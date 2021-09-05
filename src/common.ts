export function nothing(...args: any[]): any { }
export const call = (f: Function) => f();
export const identity = <T>(x: T): T => x;
export type ObservableInputTuple<T> = {
    [K in keyof T]: Observable<T[K]>;
};
type ObservedValueOf<O> = O extends Observable<infer T> ? T : never;
export interface Observer<T> {
    next(data: T): void;
    complete(): void;
    error(err: any): void;
}
export interface ISink<T> extends Observer<T> {
    disposed: boolean;
    dispose(defer?: boolean): void;
    defer(df: Dispose): void;
    doDefer():void;
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
        this.dispose(false);
    }
    error(err: any) {
        this.dispose(false);
    }
    dispose(defer = true) {
        this.disposed = true;
        this.complete = nothing;
        this.error = nothing;
        this.next = nothing;
        this.dispose = nothing;
        if (defer) {
            this.doDefer();
        } //销毁时终止事件源
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
}
export class Sink<T, R = T> extends LastSink<T> {
    constructor(public readonly sink: ISink<R>) {
        super();
        sink.defer(() => this.dispose());
    }
    next(data: T | R) {
        this.sink.next(data as R);
    }
    complete() {
        super.complete();
        this.sink.complete();
    }
    error(err: any) {
        super.error(err);
        this.sink.error(err);
    }
}
export function deliver<T, R, ARG extends any[]>(c: { new(sink: ISink<R>, ...args: ARG): ISink<T>; }) {
    return (...args: ARG): (Operator<T, R>) => (source: Observable<T>) => (observer: ISink<R>) => source(new c(observer, ...args));
}

