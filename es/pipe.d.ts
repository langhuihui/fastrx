import { Observer, nothing, Observable, Operator } from './common';
export * from './common';
export declare const pipe: (first: Observable<unknown>, ...cbs: Operator<unknown, unknown>[]) => Observable<unknown>;
export declare const toPromise: <T>() => (source: Observable<T>) => Promise<T>;
declare class Subscribe<T> extends Observer<T> {
    then: typeof nothing;
    constructor(n?: typeof nothing, e?: typeof nothing, c?: typeof nothing);
}
export declare const subscribe: <T>(n?: (data: T) => void, e?: typeof nothing, c?: typeof nothing) => (source: Observable<T>) => Subscribe<T>;
export declare const tap: <T>(...args: any[]) => Operator<T, T>;
export declare const delay: <T>(...args: any[]) => Operator<T, T>;
export declare const catchError: <T, R = T>(...args: any[]) => Operator<R, R>;
export * from './producer';
//# sourceMappingURL=pipe.d.ts.map