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
let obids = 1;
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
    const ns = new NodeSink<T>(sink, this, this.streamId++);
    Events.subscribe({ id: this.id, end: false }, { nodeId: ns.sourceId, streamId: ns.id });
    this(ns);
    return ns;
  }
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
  constructor(source: Observable<T> | InspectObservable<T>, public _next = nothing, public _error = nothing, public _complete = nothing) {
    super();
    if (source instanceof Inspect) {
      const node = { toString: () => 'subscribe', id: 0, source };
      this.defer(() => {
        Events.defer(node, 0);
      });
      Events.create(node);
      Events.pipe(node);
      this.sourceId = node.id;
      this.subscribe(source);
      Events.subscribe({ id: node.id, end: true });
      if (_next == nothing) {
        this._next = data => Events.next(node, 0, data);
      } else {
        this.next = data => {
          Events.next(node, 0, data);
          _next(data);
        };
      }
      if (_complete == nothing) {
        this._complete = () => Events.complete(node, 0);
      } else {
        this.complete = () => {
          this.dispose();
          Events.complete(node, 0);
          _complete();
        };
      }
      if (_error == nothing) {
        this._error = err => Events.complete(node, 0, err);
      } else {
        this.error = err => {
          this.dispose();
          Events.complete(node, 0, err);
          _error();
        };
      }
    } else {
      this.subscribe(source);
    }
  }
  next(data: T) {
    this._next(data);
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
type Subscription<T, R = T> = Subscribe<T> | Promise<T> | Observable<R>;
//type Operators<T, S> = T extends [Operator<S, infer A>, ...infer R] ? R extends [(source: Observable<A>) => Subscribe<A> | Promise<A>] ? T : (R extends Operators<R, A> ? T : never) : never;
//export function pipe<S, LL, LLL extends Subscription<LL>, T extends [...Operators<T, S>, (source: Observable<LL>) => LLL]>(first: Observable<S>, ...arg: T): LLL;

export function pipe<T, L extends Subscription<T>>(first: Observable<T>, sub: (source: Observable<T>) => L): L;
export function pipe<T, T1, L extends Subscription<T1>>(first: Observable<T>, op1: Operator<T, T1>, sub: (source: Observable<T1>) => L): L;
export function pipe<T, T1, T2, L extends Subscription<T2>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, sub: (source: Observable<T2>) => L): L;
export function pipe<T, T1, T2, T3, L extends Subscription<T3>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, sub: (source: Observable<T3>) => L): L;
export function pipe<T, T1, T2, T3, T4, L extends Subscription<T4>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, op4: Operator<T3, T4>, sub: (source: Observable<T4>) => L): L;
export function pipe<T, T1, T2, T3, T4, T5, L extends Subscription<T5>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, op4: Operator<T3, T4>, op5: Operator<T4, T5>, sub: (source: Observable<T5>) => L): L;
export function pipe<T, T1, T2, T3, T4, T5, T6, L extends Subscription<T6>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, op4: Operator<T3, T4>, op5: Operator<T4, T5>, op6: Operator<T5, T6>, sub: (source: Observable<T6>) => L): L;
export function pipe<T, T1, T2, T3, T4, T5, T6, T7, L extends Subscription<T7>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, op4: Operator<T3, T4>, op5: Operator<T4, T5>, op6: Operator<T5, T6>, op7: Operator<T6, T7>, sub: (source: Observable<T7>) => L): L;
export function pipe<L extends Subscription<unknown>>(...cbs: [Observable<unknown>, ...any, (source: Observable<unknown>) => L]): L;
export function pipe<L extends Subscription<unknown>>(first: Observable<unknown>, ...cbs: [...any, (source: Observable<unknown>) => L]): L {
  return cbs.reduce((aac, c) => c(aac), first);
}
export function create<T>(ob: (sink: ISink<T>) => void, name: string, args: IArguments): Observable<T> {
  if (inspect()) {
    const result = Object.defineProperties(Object.setPrototypeOf(ob, Inspect.prototype), {
      streamId: { value: 0, writable: true },
      name: { value: name },
      args: { value: args },
      id: { value: 0, writable: true },
    });
    Events.create(result);
    for(let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (typeof arg === 'function') {
        if(arg instanceof Inspect){
          Events.addSource(result,arg)
        } else {
          
        }
      }
    }
    return result as InspectObservable<T>;
  }
  return ob;
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
    this.sourceId = sink.sourceId;
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
    if (!who.id) who.id = obids++;
    send('create', { name: who.toString(), id: who.id });
  },
};
export class TimeoutError extends Error {
  constructor(public readonly timeout: number) {
    super(`timeout after ${timeout}ms`);
  }
}
