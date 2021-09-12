export function nothing(...args: any[]): any { }
export const call = (f: Function) => f();
export const identity = <T>(x: T): T => x;
export function dispose<T>(this: ISink<T>) {
    this.dispose();
}
export type ObservableInputTuple<T> = {
    [K in keyof T]: Observable<T[K]>;
};
type ObservedValueOf<O> = O extends Observable<infer T> ? T : never;
export interface Observer<T> {
    next(data: T): void;
    complete(): void;
    error(err: any): void;
    dispose(): void;
}
export interface ISink<T> extends Observer<T> {
    disposed: boolean;
    dispose(): void;
    defer(df: Dispose): void;
    doDefer(): void;
    removeDefer(df: Dispose): void;
}

declare type Dispose = () => any;
export type Observable<T> = (sink: ISink<T>) => void;
export type Operator<T, R = T> = (source: Observable<T>) => Observable<R>;

export class LastSink<T> implements ISink<T>{
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
        this.doDefer();
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

export function deliver<T, R, ARG extends any[]>(c: { new(sink: ISink<R>, ...args: ARG): ISink<T>; }) {
    return (...args: ARG): (Operator<T, R>) => (source: Observable<T>) => (observer: ISink<R>) => source(new c(observer, ...args));
}

function send(event: string, payload: any) {
    window.postMessage({ source: 'fastrx-devtools-backend', payload: { event, payload } });
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