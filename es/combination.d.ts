import { Observable, Operator, ObservableInputTuple } from "./common";
export declare function share<T>(): Operator<T>;
export declare function merge<A extends readonly unknown[]>(...sources: ObservableInputTuple<A>): Observable<A[number]>;
export declare function race<A extends readonly unknown[]>(...sources: ObservableInputTuple<A>): Observable<A[number]>;
export declare function concat<A extends readonly unknown[]>(...sources: ObservableInputTuple<A>): Observable<A[number]>;
export declare function shareReplay<T>(bufferSize: number): Operator<T>;
export declare function iif<T, F>(condition: () => boolean, trueS: Observable<T>, falseS: Observable<F>): Observable<T | F>;
export declare function combineLatest<A extends unknown[]>(...sources: ObservableInputTuple<A>): Observable<A>;
export declare function zip<A extends unknown[]>(...sources: ObservableInputTuple<A>): Observable<A>;
export declare function startWith<T, A extends unknown[]>(...xs: A): Operator<T, T | A[number]>;
export declare const withLatestFrom: <T, A extends unknown[]>(...args: ObservableInputTuple<A>) => Operator<T, [T, ...A]>;
export declare const bufferCount: <T>(bufferSize: number, startBufferEvery?: number | undefined) => Operator<T, T[]>;
export declare const buffer: <T>(closingNotifier: Observable<unknown>) => Operator<T, T[]>;
//# sourceMappingURL=combination.d.ts.map