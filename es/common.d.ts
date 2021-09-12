export declare function nothing(...args: any[]): any;
export declare const call: (f: Function) => any;
export declare const identity: <T>(x: T) => T;
export declare function dispose<T>(this: ISink<T>): void;
export declare type ObservableInputTuple<T> = {
    [K in keyof T]: Observable<T[K]>;
};
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
export declare type Observable<T> = (sink: ISink<T>) => void;
export declare type Operator<T, R = T> = (source: Observable<T>) => Observable<R>;
export declare class LastSink<T> implements ISink<T> {
    defers: Set<Dispose>;
    disposed: boolean;
    next(data: T): void;
    complete(): void;
    error(err: any): void;
    get bindDispose(): () => void;
    dispose(): void;
    doDefer(): void;
    defer(df: Dispose): void;
    removeDefer(df: Dispose): void;
    reset(): void;
    resetNext(): void;
    resetComplete(): void;
    resetError(): void;
}
export declare class Sink<T, R = T> extends LastSink<T> {
    readonly sink: ISink<R>;
    constructor(sink: ISink<R>);
    next(data: T | R): void;
    complete(): void;
    error(err: any): void;
}
export declare function deliver<T, R, ARG extends any[]>(c: {
    new (sink: ISink<R>, ...args: ARG): ISink<T>;
}): (...args: ARG) => (Operator<T, R>);
interface Node {
    id: number;
    toString(): string;
    source?: Node;
}
export declare const Events: {
    addSource(who: Node, source: Node): void;
    next(who: Node, streamId: number, data?: any): void;
    subscribe({ id, end }: {
        id: number;
        end: boolean;
    }, sink?: {
        nodeId: number;
        streamId: number;
    } | undefined): void;
    complete(who: Node, streamId: number, err?: any): void;
    defer(who: Node, streamId: number): void;
    pipe(who: Node): void;
    update(who: Node): void;
    create(who: Node): void;
};
export declare class TimeoutError extends Error {
    readonly timeout: number;
    constructor(timeout: number);
}
export {};
//# sourceMappingURL=common.d.ts.map