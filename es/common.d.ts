export declare function nothing(...args: any[]): any;
export declare const call: (f: Function) => any;
export declare const identity: <T>(x: T) => T;
export declare function dispose<T>(this: ISink<T>): void;
export declare const inspect: () => boolean;
export type ObservableInputTuple<T> = {
    [K in keyof T]: Observable<T[K]>;
};
export type EventHandler<T> = (event: T) => void;
type EventMethod<N, T> = (name: N, handler: EventHandler<T>) => void;
export type EventDispachter<N, T> = {
    on: EventMethod<N, T>;
    off: EventMethod<N, T>;
} | {
    addListener: EventMethod<N, T>;
    removeListener: EventMethod<N, T>;
} | {
    addEventListener: EventMethod<N, T>;
    removeEventListener: EventMethod<N, T>;
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
    subscribe(sink: ISink<T>): ISink<T>;
}
declare type Dispose = () => any;
export type Observable<T> = (sink: ISink<T>) => void;
export type InspectObservable<T> = Observable<T> & Inspect<T>;
export type Operator<T, R = T> = (source: Observable<T>) => Observable<R>;
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
export type ISink<T> = LastSink<T>;
export declare class Sink<T, R = T> extends LastSink<T> {
    readonly sink: ISink<R>;
    constructor(sink: ISink<R>);
    next(data: T | R): void;
    complete(): void;
    error(err: any): void;
}
export declare class Subscribe<T> extends LastSink<T> {
    _next: typeof nothing;
    _error: typeof nothing;
    _complete: typeof nothing;
    then: typeof nothing;
    constructor(source: Observable<T> | InspectObservable<T>, _next?: typeof nothing, _error?: typeof nothing, _complete?: typeof nothing);
    next(data: T): void;
    complete(): void;
    error(err: any): void;
}
type Subscription<T, R = T> = Subscribe<T> | Promise<T> | Observable<R>;
/**
 * Why use function overloads instead of a generic recursive type?
 *
 * 1. Inference vs Validation: TypeScript infers argument types independently before validating them against the function signature.
 *    A recursive type (like PipeArgs) requires the type of the Nth argument to depend on the (N-1)th argument's return type.
 *    However, TS often infers 'unknown' or 'any' for intermediate operators during the initial pass, causing the recursive match to fail
 *    with confusing errors (e.g., "Type ... is not assignable to type 'never'").
 *
 * 2. Developer Experience: Overloads provide precise type inference for each step in the pipeline.
 *    If a type mismatch occurs (e.g., op2 expects string but op1 returns number), the error points exactly to the failing argument,
 *    rather than a generic error on the entire function call.
 *
 * 3. Performance: Deeply recursive types can be computationally expensive for the compiler. Overloads are straightforward and fast.
 *
 * This is the standard approach used by libraries like RxJS.
 */
export declare function pipe<T, L extends Subscription<T>>(first: Observable<T>, sub: (source: Observable<T>) => L): L;
export declare function pipe<T, T1, L extends Subscription<T1>>(first: Observable<T>, op1: Operator<T, T1>, sub: (source: Observable<T1>) => L): L;
export declare function pipe<T, T1, T2, L extends Subscription<T2>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, sub: (source: Observable<T2>) => L): L;
export declare function pipe<T, T1, T2, T3, L extends Subscription<T3>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, sub: (source: Observable<T3>) => L): L;
export declare function pipe<T, T1, T2, T3, T4, L extends Subscription<T4>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, op4: Operator<T3, T4>, sub: (source: Observable<T4>) => L): L;
export declare function pipe<T, T1, T2, T3, T4, T5, L extends Subscription<T5>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, op4: Operator<T3, T4>, op5: Operator<T4, T5>, sub: (source: Observable<T5>) => L): L;
export declare function pipe<T, T1, T2, T3, T4, T5, T6, L extends Subscription<T6>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, op4: Operator<T3, T4>, op5: Operator<T4, T5>, op6: Operator<T5, T6>, sub: (source: Observable<T6>) => L): L;
export declare function pipe<T, T1, T2, T3, T4, T5, T6, T7, L extends Subscription<T7>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, op4: Operator<T3, T4>, op5: Operator<T4, T5>, op6: Operator<T5, T6>, op7: Operator<T6, T7>, sub: (source: Observable<T7>) => L): L;
export declare function pipe<L extends Subscription<unknown>>(...cbs: [Observable<unknown>, ...any, (source: Observable<unknown>) => L]): L;
export declare function create<T>(ob: (sink: ISink<T>) => void, name: string, args: {
    [index: number]: any;
    length: number;
}): Observable<T>;
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
    }): void;
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