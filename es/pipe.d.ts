import { nothing, Observable, Operator, Observer, LastSink } from './common';
import { Subject } from './producer';
declare type Subscription<T, R = T> = Subscribe<T> | Promise<T> | Observable<R>;
export declare function pipe<T, L extends Subscription<T>>(first: Observable<T>, sub: (source: Observable<T>) => L): L;
export declare function pipe<T, T1, L extends Subscription<T1>>(first: Observable<T>, op1: Operator<T, T1>, sub: (source: Observable<T1>) => L): L;
export declare function pipe<T, T1, T2, L extends Subscription<T2>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, sub: (source: Observable<T2>) => L): L;
export declare function pipe<T, T1, T2, T3, L extends Subscription<T3>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, sub: (source: Observable<T3>) => L): L;
export declare function pipe<T, T1, T2, T3, T4, L extends Subscription<T4>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, op4: Operator<T3, T4>, sub: (source: Observable<T4>) => L): L;
export declare function pipe<T, T1, T2, T3, T4, T5, L extends Subscription<T5>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, op4: Operator<T3, T4>, op5: Operator<T4, T5>, sub: (source: Observable<T5>) => L): L;
export declare function pipe<T, T1, T2, T3, T4, T5, T6, L extends Subscription<T6>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, op4: Operator<T3, T4>, op5: Operator<T4, T5>, op6: Operator<T5, T6>, sub: (source: Observable<T6>) => L): L;
export declare function pipe<T, T1, T2, T3, T4, T5, T6, T7, L extends Subscription<T7>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, op4: Operator<T3, T4>, op5: Operator<T4, T5>, op6: Operator<T5, T6>, op7: Operator<T6, T7>, sub: (source: Observable<T7>) => L): L;
export declare function pipe<L extends Subscription<unknown>>(...cbs: [Observable<unknown>, ...any, (source: Observable<unknown>) => L]): L;
export declare const toPromise: <T>() => (source: Observable<T>) => Promise<T>;
export declare class Subscribe<T> extends LastSink<T> {
    next: typeof nothing;
    _error: typeof nothing;
    _complete: typeof nothing;
    then: typeof nothing;
    constructor(next?: typeof nothing, _error?: typeof nothing, _complete?: typeof nothing);
    complete(): void;
    error(err: any): void;
}
export declare const subscribe: <T>(n?: (data: T) => void, e?: typeof nothing, c?: typeof nothing) => (source: Observable<T>) => Subscribe<T>;
export declare const tap: <T>(ob: Partial<Observer<T>> | ((d: T) => void)) => Operator<T, T>;
export declare const delay: <T>(delay: number) => Operator<T, T>;
export declare const catchError: <T, R = T>(selector: (err: any) => Observable<R>) => Operator<T, R>;
declare type Group = Subject<unknown> & {
    key: any;
};
export declare const groupBy: <T>(f: (data: T) => any) => Operator<T, Group>;
export declare const timeout: <T>(timeout: number) => Operator<T, T>;
export {};
//# sourceMappingURL=pipe.d.ts.map