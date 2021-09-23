// import { pipe } from "./pipe";

export function nothing(...args: any[]): any { }
export const call = (f: Function) => f();
export const identity = <T>(x: T): T => x;
export function dispose<T>(this: ISink<T>) {
  this.dispose();
}
// @ts-ignore
export const inspect = () => typeof __FASTRX_DEVTOOLS__ !== 'undefined';
export type ObservableInputTuple<T> = {
  [K in keyof T]: Observable<T[K]>;
};
type ObservedValueOf<O> = O extends Observable<infer T> ? T : never;
export interface Observer<T> {
  subscribe(source: Observable<T>): void;
  next(data: T): void;
  complete(): void;
  error(err: any): void;
  dispose(): void;
}
let obids = 0;
// function pp(this: Observable<unknown>, ...args: [...Operator<unknown>[], Operator<unknown>]) {
//   return pipe(this, ...args);
// }
export class Inspect<T> extends Function {
  id!: number;
  args!: IArguments;
  streamId!: number;
  source?: InspectObservable<unknown>;
  toString() {
    return `${this.name}(${this.args.length ? [...this.args].join(', ') : ""})`;
  }
  // pipe(...args: [...Operator<unknown>[], Operator<unknown>]): Observable<unknown> {
  //   return pipe(this as unknown as Observable<T>, ...args);
  // }
  subscribe(sink: ISink<T>): ISink<T> {
    const notEnd = sink instanceof Sink;
    if (notEnd) {
      const ns = new NodeSink<T>(sink, this, this.streamId++);
      Events.subscribe({ id: this.id, end: false }, { nodeId: ns.sourceId, streamId: ns.id });
      this(ns);
      return ns;
    } else {
      Events.subscribe({ id: this.id, end: true });
      this(sink);
      return sink;
    }
  }
}
export function create<T>(ob: (sink: ISink<T>) => void, name: string, args: IArguments): Observable<T> {
  if (inspect()) {
    const result = Object.defineProperties(Object.setPrototypeOf(ob, Inspect.prototype), {
      streamId: { value: 0, writable: true },
      name: { value: name },
      args: { value: args },
      id: { value: obids++ },
    });
    Events.create(result);
    return result as InspectObservable<T>;
  }
  return ob;
}
declare type Dispose = () => any;
export type Observable<T> = (sink: ISink<T>) => void;
export type InspectObservable<T> = Observable<T> & Inspect<T>;
export type Operator<T, R = T> = (source: Observable<T>) => Observable<R>;

export class LastSink<T> implements Observer<T>{
  sourceId!: number;
  defers = new Set<Dispose>();
  disposed = false;
  next(data: T) {
  }
  complete() {
    this.dispose();
  }
  error(err: any) {
    this.dispose();
  }
  get bindDispose() {
    return () => this.dispose();
  }
  dispose() {
    this.disposed = true;
    this.complete = nothing;
    this.error = nothing;
    this.next = nothing;
    this.dispose = nothing;
    this.subscribe = nothing;
    this.doDefer();
  }
  subscribe(source: Observable<T>) {
    if (source instanceof Inspect)
      source.subscribe(this);
    else
      source(this);
    return this;
  }
  get bindSubscribe() {
    return (source: Observable<T>) => this.subscribe(source);
  }
  doDefer() {
    this.defers.forEach(call);
    this.defers.clear();
  }
  defer(df: Dispose) {
    this.defers.add(df);
  }
  removeDefer(df: Dispose) {
    this.defers.delete(df);
  }
  reset() {
    this.disposed = false;
    //@ts-ignore
    delete this.complete;
    //@ts-ignore
    delete this.next;
    //@ts-ignore
    delete this.dispose;
    //@ts-ignore
    delete this.next;
    //@ts-ignore
    delete this.subscribe;
  }
  resetNext() {
    //@ts-ignore
    delete this.next;
  }
  resetComplete() {
    //@ts-ignore
    delete this.complete;
  }
  resetError() {
    //@ts-ignore
    delete this.error;
  }
}
export type ISink<T> = LastSink<T>;
export class Sink<T, R = T> extends LastSink<T> {
  constructor(public readonly sink: ISink<R>) {
    super();
    sink.defer(this.bindDispose);
  }
  next(data: T | R) {
    this.sink.next(data as R);
  }
  complete() {
    this.sink.complete();
  }
  error(err: any) {
    this.sink.error(err);
  }
}
export class Subscribe<T> extends LastSink<T> {
  then = nothing;
  constructor(public next = nothing, public _error = nothing, public _complete = nothing) {
    super();
  }
  complete() {
    this.dispose();
    this._complete();
  }
  error(err: any) {
    this.dispose();
    this._error(err);
  }
}
export function deliver<T, R, ARG extends any[]>(c: { new(sink: ISink<R>, ...args: ARG): ISink<T>; }, name: string) {
  return function (...args: ARG): (Operator<T, R>) {
    return source => {
      if (source instanceof Inspect) {
        const ob = create((observer) => {
          const deliverSink = new c(observer, ...args);
          deliverSink.sourceId = ob.id;
          deliverSink.subscribe(source);
        }, name, arguments) as InspectObservable<R>;
        ob.source = source;
        Events.pipe(ob);
        return ob;
      } else {
        return observer => source(new c(observer, ...args));
      }
    };
  };
}

function send(event: string, payload: any) {
  window.postMessage({ source: 'fastrx-devtools-backend', payload: { event, payload } });
}
class NodeSink<T> extends Sink<T> {
  constructor(sink: ISink<T>, public readonly source: Inspect<T>, public readonly id: number) {
    super(sink);
    this.defer(() => {
      Events.defer(this.source, this.id);
    });
  }
  next(data: T) {
    Events.next(this.source, this.id, data);
    this.sink.next(data);
  }
  complete() {
    Events.complete(this.source, this.id);
    this.sink.complete();
  }
  error(err: any) {
    Events.complete(this.source, this.id, err);
    this.sink.error(err);
  }
}
interface Node {
  id: number;
  toString(): string;
  source?: Node;
}
export const Events = {
  addSource(who: Node, source: Node) {
    send('addSource', {
      id: who.id,
      name: who.toString(),
      source: { id: source.id, name: source.toString() },
    });
  },
  next(who: Node, streamId: number, data?: any) {
    send('next', { id: who.id, streamId, data: data && data.toString() });
  },
  subscribe({ id, end }: { id: number, end: boolean; }, sink?: { nodeId: number; streamId: number; }) {
    send('subscribe', {
      id,
      end,
      sink: { nodeId: sink && sink.nodeId, streamId: sink && sink.streamId },
    });
  },
  complete(who: Node, streamId: number, err?: any) {
    send('complete', { id: who.id, streamId, err: err ? err.toString() : null });
  },
  defer(who: Node, streamId: number) {
    send('defer', { id: who.id, streamId });
  },
  pipe(who: Node) {
    send('pipe', {
      name: who.toString(),
      id: who.id,
      source: { id: who.source!.id, name: who.source!.toString() },
    });
  },
  update(who: Node) {
    send('update', { id: who.id, name: who.toString() });
  },
  create(who: Node) {
    send('create', { name: who.toString(), id: who.id });
  },
};
export class TimeoutError extends Error {
  constructor(public readonly timeout: number) {
    super(`timeout after ${timeout}ms`);
  }
}
