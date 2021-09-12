export * from './common';
export * from './producer';
export * from './combination';
export * from './filtering';
export * from './mathematical';
export * from './transformation';
export * from './pipe';
import * as producer from './producer';
export declare const observables: {
    subject: <T>(source?: import("./common").Observable<T> | undefined) => producer.Subject<T>;
    defer: <T_1>(f: () => import("./common").Observable<T_1>) => import("./common").Observable<T_1>;
    of: <T_2>(...data: T_2[]) => import("./common").Observable<T_2>;
    fromArray: <T_3>(data: T_3[]) => import("./common").Observable<T_3>;
    interval: (period: number) => import("./common").Observable<number>;
    timer: (delay: number, period?: number) => import("./common").Observable<number>;
    fromEventPattern: <T_4>(add: (n: (event: T_4) => void) => void, remove: (n: (event: T_4) => void) => void) => import("./common").Observable<T_4>;
    fromEvent: <T_5>(target: {
        on: (name: string, handler: (event: T_5) => void) => void;
        off: (name: string, handler: (event: T_5) => void) => void;
    } | {
        addListener: (name: string, handler: (event: T_5) => void) => void;
        removeListener: (name: string, handler: (event: T_5) => void) => void;
    } | {
        addEventListener: (name: string, handler: (event: T_5) => void) => void;
        removeEventListener: (name: string, handler: (event: T_5) => void) => void;
    }, name: string) => import("./common").Observable<T_5>;
    fromMessageEvent: <T_6>(target: {
        onmessage: (event: T_6) => void;
        close: () => void;
    } & ({
        on: (name: string, handler: (event: T_6) => void) => void;
        off: (name: string, handler: (event: T_6) => void) => void;
    } | {
        addListener: (name: string, handler: (event: T_6) => void) => void;
        removeListener: (name: string, handler: (event: T_6) => void) => void;
    } | {
        addEventListener: (name: string, handler: (event: T_6) => void) => void;
        removeEventListener: (name: string, handler: (event: T_6) => void) => void;
    })) => import("./common").Observable<T_6>;
    fromPromise: <T_7>(promise: Promise<T_7>) => import("./common").Observable<T_7>;
    fromFetch: (input: RequestInfo, init?: RequestInit | undefined) => import("./common").Observable<Response>;
    fromIterable: <T_8>(source: Iterable<T_8>) => import("./common").Observable<T_8>;
    fromAnimationFrame: () => import("./common").Observable<number>;
    range: (start: number, count: number) => import("./common").Observable<number>;
    bindCallback: <T_9>(call: Function, thisArg: any, ...args: any[]) => import("./common").Observable<T_9>;
    bindNodeCallback: <T_10>(call: Function, thisArg: any, ...args: any[]) => import("./common").Observable<T_10>;
    never: () => import("./common").Observable<never>;
    throwError: <T_11>(e: T_11) => import("./common").Observable<T_11>;
    empty: () => import("./common").Observable<never>;
    zip: <A extends unknown[]>(...sources: import("./common").ObservableInputTuple<A>) => import("./common").Observable<A>;
    merge: <A_1 extends readonly unknown[]>(...sources: import("./common").ObservableInputTuple<A_1>) => import("./common").Observable<A_1[number]>;
    race: <A_2 extends readonly unknown[]>(...sources: import("./common").ObservableInputTuple<A_2>) => import("./common").Observable<A_2[number]>;
    concat: <A_3 extends readonly unknown[]>(...sources: import("./common").ObservableInputTuple<A_3>) => import("./common").Observable<A_3[number]>;
    combineLatest: <A_4 extends unknown[]>(...sources: import("./common").ObservableInputTuple<A_4>) => import("./common").Observable<A_4>;
};
export declare const operators: {
    scan: <T, R, ACC extends T | R>(f: (acc: ACC, c: T) => ACC, seed?: ACC | undefined) => import("./common").Operator<T, ACC>;
    pairwise: <T_1>() => import("./common").Operator<T_1, [T_1, T_1]>;
    map: <T_2, R_1>(mapper: (data: T_2) => R_1, thisArg?: any) => import("./common").Operator<T_2, R_1>;
    mapTo: <T_3, R_2>(target: R_2) => import("./common").Operator<T_3, R_2>;
    switchMap: <T_4, U, R_3>(makeSource: (data: T_4, index: number) => import("./common").Observable<U>, combineResults?: ((outter: T_4, inner: U) => R_3) | undefined) => import("./common").Operator<T_4, R_3>;
    switchMapTo: <T_4, U, R_3>(innerSource: import("./common").Observable<U>, combineResults?: ((outter: T_4, inner: U) => R_3) | undefined) => import("./common").Operator<T_4, R_3>;
    concatMap: <T_5, U_1, R_4>(makeSource: (data: T_5, index: number) => import("./common").Observable<U_1>, combineResults?: ((outter: T_5, inner: U_1) => R_4) | undefined) => import("./common").Operator<T_5, R_4>;
    concatMapTo: <T_5, U_1, R_4>(innerSource: import("./common").Observable<U_1>, combineResults?: ((outter: T_5, inner: U_1) => R_4) | undefined) => import("./common").Operator<T_5, R_4>;
    mergeMap: <T_6, U_2, R_5>(makeSource: (data: T_6, index: number) => import("./common").Observable<U_2>, combineResults?: ((outter: T_6, inner: U_2) => R_5) | undefined) => import("./common").Operator<T_6, R_5>;
    mergeMapTo: <T_6, U_2, R_5>(innerSource: import("./common").Observable<U_2>, combineResults?: ((outter: T_6, inner: U_2) => R_5) | undefined) => import("./common").Operator<T_6, R_5>;
    exhaustMap: <T_7, U_3, R_6>(makeSource: (data: T_7, index: number) => import("./common").Observable<U_3>, combineResults?: ((outter: T_7, inner: U_3) => R_6) | undefined) => import("./common").Operator<T_7, R_6>;
    exhaustMapTo: <T_7, U_3, R_6>(innerSource: import("./common").Observable<U_3>, combineResults?: ((outter: T_7, inner: U_3) => R_6) | undefined) => import("./common").Operator<T_7, R_6>;
    timeInterval: <T_8>() => import("./common").Operator<T_8, {
        value: T_8;
        interval: number;
    }>;
    bufferTime: <T_9>(miniseconds: number) => import("./common").Operator<T_9, T_9[]>;
    reduce: <T_10, R_7, ACC_1 extends T_10 | R_7>(f: (acc: ACC_1, c: T_10) => ACC_1, seed?: ACC_1 | undefined) => import("./common").Operator<T_10, ACC_1>;
    count: <T_11>(f: (d: T_11) => boolean) => import("./common").Operator<T_11, number>;
    max: () => import("./common").Operator<number, number>;
    min: () => import("./common").Operator<number, number>;
    sum: () => import("./common").Operator<number, number>;
    filter: <T_12>(filter: (data: T_12) => boolean, thisArg?: any) => import("./common").Operator<T_12, T_12>;
    ignoreElements: <T_13>() => import("./common").Operator<T_13, never>;
    take: <T_14>(count: number) => import("./common").Operator<T_14, T_14>;
    takeUntil: <T_15>(control: import("./common").Observable<unknown>) => import("./common").Operator<T_15, T_15>;
    takeWhile: <T_16>(f: (data: T_16) => boolean) => import("./common").Operator<T_16, T_16>;
    takeLast: <T_17>(count: number) => import("./common").Operator<T_17, T_17[]>;
    skip: <T_18>(count: number) => import("./common").Operator<T_18, T_18>;
    skipUntil: <T_19>(control: import("./common").Observable<unknown>) => import("./common").Operator<T_19, T_19>;
    skipWhile: <T_20>(f: (data: T_20) => boolean) => import("./common").Operator<T_20, T_20>;
    throttle: <T_21>(durationSelector: (data: T_21) => import("./common").Observable<unknown>, config?: {
        leading: boolean;
        trailing: boolean;
    } | undefined) => import("./common").Operator<T_21, T_21>;
    audit: <T_22>(durationSelector: (d: T_22) => import("./common").Observable<unknown>) => import("./common").Operator<T_22, T_22>;
    debounce: <T_23>(durationSelector: (d: T_23) => import("./common").Observable<unknown>) => import("./common").Operator<T_23, T_23>;
    debounceTime: <T_24>(period: number) => import("./common").Operator<T_24, T_24>;
    elementAt: <T_25>(count: number, defaultValue?: T_25 | undefined) => import("./common").Operator<T_25, T_25>;
    find: <T_26>(f: (d: T_26) => boolean) => (source: import("./common").Observable<T_26>) => import("./common").Observable<T_26>;
    findIndex: <T_27>(f: (d: T_27) => boolean) => import("./common").Operator<T_27, number>;
    first: <T_28>(f?: ((d: T_28, index: number) => boolean) | undefined, defaultValue?: T_28 | undefined) => import("./common").Operator<T_28, T_28>;
    last: <T_29>(f?: ((d: T_29, index: number) => boolean) | undefined, defaultValue?: T_29 | undefined) => import("./common").Operator<T_29, T_29>;
    every: <T_30>(predicate: (d: T_30, index: number) => boolean) => import("./common").Operator<T_30, boolean>;
    share: <T_31>() => import("./common").Operator<T_31, T_31>;
    shareReplay: <T_32>(bufferSize: number) => import("./common").Operator<T_32, T_32>;
    iif: <T_33, F>(condition: () => boolean, trueS: import("./common").Observable<T_33>, falseS: import("./common").Observable<F>) => import("./common").Observable<T_33 | F>;
    startWith: <T_34, A extends unknown[]>(...xs: A) => import("./common").Operator<T_34, T_34 | A[number]>;
    withLatestFrom: <T_35, A_1 extends unknown[]>(...args: import("./common").ObservableInputTuple<A_1>) => import("./common").Operator<T_35, [T_35, ...A_1]>;
    bufferCount: <T_36>(bufferSize: number, startBufferEvery: number) => import("./common").Operator<T_36, T_36[]>;
};
//# sourceMappingURL=index.d.ts.map