import { Observable, Operator, ObservableInputTuple } from "./common";
export declare const share: <T>() => Operator<T, T>;
export declare const merge: <A extends readonly unknown[]>(...sources: ObservableInputTuple<A>) => Observable<A[number]>;
export declare const race: <A extends readonly unknown[]>(...sources: ObservableInputTuple<A>) => Observable<A[number]>;
export declare const concat: <A extends readonly unknown[]>(...sources: ObservableInputTuple<A>) => Observable<A[number]>;
export declare const shareReplay: <T>(bufferSize: number) => Operator<T, T>;
export declare const iif: <T, F>(condition: () => boolean, trueS: Observable<T>, falseS: Observable<F>) => Observable<T | F>;
export declare const combineLatest: <A extends unknown[]>(...sources: ObservableInputTuple<A>) => Observable<A>;
export declare const zip: <A extends unknown[]>(...sources: ObservableInputTuple<A>) => Observable<A>;
export declare const startWith: <T, A extends unknown[]>(...xs: A) => Operator<T, T | A[number]>;
export declare const withLatestFrom: <T, A extends unknown[]>(...args: ObservableInputTuple<A>) => Operator<T, [T, ...A]>;
export declare const bufferCount: <T>(bufferSize: number, startBufferEvery: number) => Operator<T, T[]>;
//# sourceMappingURL=combination.d.ts.map