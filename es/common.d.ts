export declare function nothing(...args: any[]): any;
export declare const call: (f: Function) => any;
export declare const identity: <T>(x: T) => T;
export declare function dispose<T>(this: ISink<T>): void;
export declare const inspect: () => boolean;
export declare type ObservableInputTuple<T> = {
    [K in keyof T]: Observable<T[K]>;
};
export interface Observer<T> {
    subscribe(source: Observable<T>): void;
    next(data: T): void;
    complete(): void;
    error(err: any): void;
    dispose(): void;
}
export declare class Inspect<T> extends Function {
    id: number;
    args: IArguments;
    streamId: number;
    source?: InspectObservable<unknown>;
    toString(): string;
    pipe(...args: [...Operator<unknown>[], Operator<unknown>]): Observable<unknown>;
    subscribe(sink: ISink<T>): ISink<T>;
}
export declare function create<T>(ob: (sink: ISink<T>) => void, name: string, args: IArguments): Observable<T>;
declare type Dispose = () => any;
export declare type Observable<T> = (sink: ISink<T>) => void;
export declare type InspectObservable<T> = Observable<T> & Inspect<T>;
export declare type Operator<T, R = T> = (source: Observable<T>) => Observable<R>;
export declare class LastSink<T> implements Observer<T> {
    sourceId: number;
    defers: Set<Dispose>;
    disposed: boolean;
    next(data: T): void;
    complete(): void;
    error(err: any): void;
    get bindDispose(): () => void;
    dispose(): void;
    subscribe(source: Observable<T>): this;
    get bindSubscribe(): (source: Observable<T>) => this;
    doDefer(): void;
    defer(df: Dispose): void;
    removeDefer(df: Dispose): void;
    reset(): void;
    resetNext(): void;
    resetComplete(): void;
    resetError(): void;
}
export declare type ISink<T> = LastSink<T>;
export declare class Sink<T, R = T> extends LastSink<T> {
    readonly sink: ISink<R>;
    constructor(sink: ISink<R>);
    next(data: T | R): void;
    complete(): void;
    error(err: any): void;
}
export declare function deliver<T, R, ARG extends any[]>(c: {
    new (sink: ISink<R>, ...args: ARG): ISink<T>;
}, name: string): (...args: ARG) => (Operator<T, R>);
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