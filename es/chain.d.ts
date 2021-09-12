import { subscribe, toPromise } from './pipe';
import { Observable, Operator } from './common';
import * as producer from './producer';
export * from './index';
declare const observables: {
    subject: <T>(source?: Observable<T> | undefined) => producer.Subject<T>;
    defer: <T_1>(f: () => Observable<T_1>) => Observable<T_1>;
    of: <T_2>(...data: T_2[]) => Observable<T_2>;
    fromArray: <T_3>(data: T_3[]) => Observable<T_3>;
    interval: (period: number) => Observable<number>;
    timer: (delay: number, period?: number) => Observable<number>;
    fromEventPattern: <T_4>(add: (n: (event: T_4) => void) => void, remove: (n: (event: T_4) => void) => void) => Observable<T_4>;
    fromEvent: <T_5>(target: {
        on: (name: string, handler: (event: T_5) => void) => void;
        off: (name: string, handler: (event: T_5) => void) => void;
    } | {
        addListener: (name: string, handler: (event: T_5) => void) => void;
        removeListener: (name: string, handler: (event: T_5) => void) => void;
    } | {
        addEventListener: (name: string, handler: (event: T_5) => void) => void;
        removeEventListener: (name: string, handler: (event: T_5) => void) => void;
    }, name: string) => Observable<T_5>;
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
    })) => Observable<T_6>;
    fromPromise: <T_7>(promise: Promise<T_7>) => Observable<T_7>;
    fromFetch: (input: RequestInfo, init?: RequestInit | undefined) => Observable<Response>;
    fromIterable: <T_8>(source: Iterable<T_8>) => Observable<T_8>;
    fromAnimationFrame: () => Observable<number>;
    range: (start: number, count: number) => Observable<number>;
    bindCallback: <T_9>(call: Function, thisArg: any, ...args: any[]) => Observable<T_9>;
    bindNodeCallback: <T_10>(call: Function, thisArg: any, ...args: any[]) => Observable<T_10>;
    never: () => Observable<never>;
    throwError: <T_11>(e: T_11) => Observable<T_11>;
    empty: () => Observable<never>;
    zip: <A extends unknown[]>(...sources: import("./common").ObservableInputTuple<A>) => Observable<A>;
    merge: <A_1 extends readonly unknown[]>(...sources: import("./common").ObservableInputTuple<A_1>) => Observable<A_1[number]>;
    race: <A_2 extends readonly unknown[]>(...sources: import("./common").ObservableInputTuple<A_2>) => Observable<A_2[number]>;
    concat: <A_3 extends readonly unknown[]>(...sources: import("./common").ObservableInputTuple<A_3>) => Observable<A_3[number]>;
    combineLatest: <A_4 extends unknown[]>(...sources: import("./common").ObservableInputTuple<A_4>) => Observable<A_4>;
};
declare const operators: {
    scan: <T, R, ACC extends T | R>(f: (acc: ACC, c: T) => ACC, seed?: ACC | undefined) => Operator<T, ACC>;
    pairwise: <T_1>() => Operator<T_1, [T_1, T_1]>;
    map: <T_2, R_1>(mapper: (data: T_2) => R_1, thisArg?: any) => Operator<T_2, R_1>;
    mapTo: <T_3, R_2>(target: R_2) => Operator<T_3, R_2>;
    switchMap: <T_4, U, R_3>(makeSource: (data: T_4, index: number) => Observable<U>, combineResults?: ((outter: T_4, inner: U) => R_3) | undefined) => Operator<T_4, R_3>;
    switchMapTo: <T_4, U, R_3>(innerSource: Observable<U>, combineResults?: ((outter: T_4, inner: U) => R_3) | undefined) => Operator<T_4, R_3>;
    concatMap: <T_5, U_1, R_4>(makeSource: (data: T_5, index: number) => Observable<U_1>, combineResults?: ((outter: T_5, inner: U_1) => R_4) | undefined) => Operator<T_5, R_4>;
    concatMapTo: <T_5, U_1, R_4>(innerSource: Observable<U_1>, combineResults?: ((outter: T_5, inner: U_1) => R_4) | undefined) => Operator<T_5, R_4>;
    mergeMap: <T_6, U_2, R_5>(makeSource: (data: T_6, index: number) => Observable<U_2>, combineResults?: ((outter: T_6, inner: U_2) => R_5) | undefined) => Operator<T_6, R_5>;
    mergeMapTo: <T_6, U_2, R_5>(innerSource: Observable<U_2>, combineResults?: ((outter: T_6, inner: U_2) => R_5) | undefined) => Operator<T_6, R_5>;
    exhaustMap: <T_7, U_3, R_6>(makeSource: (data: T_7, index: number) => Observable<U_3>, combineResults?: ((outter: T_7, inner: U_3) => R_6) | undefined) => Operator<T_7, R_6>;
    exhaustMapTo: <T_7, U_3, R_6>(innerSource: Observable<U_3>, combineResults?: ((outter: T_7, inner: U_3) => R_6) | undefined) => Operator<T_7, R_6>;
    timeInterval: <T_8>() => Operator<T_8, {
        value: T_8;
        interval: number;
    }>;
    bufferTime: <T_9>(miniseconds: number) => Operator<T_9, T_9[]>;
    reduce: <T_10, R_7, ACC_1 extends T_10 | R_7>(f: (acc: ACC_1, c: T_10) => ACC_1, seed?: ACC_1 | undefined) => Operator<T_10, ACC_1>;
    count: <T_11>(f: (d: T_11) => boolean) => Operator<T_11, number>;
    max: () => Operator<number, number>;
    min: () => Operator<number, number>;
    sum: () => Operator<number, number>;
    filter: <T_12>(filter: (data: T_12) => boolean, thisArg?: any) => Operator<T_12, T_12>;
    ignoreElements: <T_13>() => Operator<T_13, never>;
    take: <T_14>(count: number) => Operator<T_14, T_14>;
    takeUntil: <T_15>(control: Observable<unknown>) => Operator<T_15, T_15>;
    takeWhile: <T_16>(f: (data: T_16) => boolean) => Operator<T_16, T_16>;
    takeLast: <T_17>(count: number) => Operator<T_17, T_17[]>;
    skip: <T_18>(count: number) => Operator<T_18, T_18>;
    skipUntil: <T_19>(control: Observable<unknown>) => Operator<T_19, T_19>;
    skipWhile: <T_20>(f: (data: T_20) => boolean) => Operator<T_20, T_20>;
    throttle: <T_21>(durationSelector: (data: T_21) => Observable<unknown>, config?: {
        leading: boolean;
        trailing: boolean;
    } | undefined) => Operator<T_21, T_21>;
    audit: <T_22>(durationSelector: (d: T_22) => Observable<unknown>) => Operator<T_22, T_22>;
    debounce: <T_23>(durationSelector: (d: T_23) => Observable<unknown>) => Operator<T_23, T_23>;
    debounceTime: <T_24>(period: number) => Operator<T_24, T_24>;
    elementAt: <T_25>(count: number, defaultValue?: T_25 | undefined) => Operator<T_25, T_25>;
    find: <T_26>(f: (d: T_26) => boolean) => (source: Observable<T_26>) => Observable<T_26>;
    findIndex: <T_27>(f: (d: T_27) => boolean) => Operator<T_27, number>;
    first: <T_28>(f?: ((d: T_28, index: number) => boolean) | undefined, defaultValue?: T_28 | undefined) => Operator<T_28, T_28>;
    last: <T_29>(f?: ((d: T_29, index: number) => boolean) | undefined, defaultValue?: T_29 | undefined) => Operator<T_29, T_29>;
    every: <T_30>(predicate: (d: T_30, index: number) => boolean) => Operator<T_30, boolean>;
    share: <T_31>() => Operator<T_31, T_31>;
    shareReplay: <T_32>(bufferSize: number) => Operator<T_32, T_32>;
    iif: <T_33, F>(condition: () => boolean, trueS: Observable<T_33>, falseS: Observable<F>) => Observable<T_33 | F>;
    startWith: <T_34, A extends unknown[]>(...xs: A) => Operator<T_34, T_34 | A[number]>;
    withLatestFrom: <T_35, A_1 extends unknown[]>(...args: import("./common").ObservableInputTuple<A_1>) => Operator<T_35, [T_35, ...A_1]>;
    bufferCount: <T_36>(bufferSize: number, startBufferEvery: number) => Operator<T_36, T_36[]>;
    tap: <T_37>(ob: Partial<import("./common").Observer<T_37>> | ((d: T_37) => void)) => Operator<T_37, T_37>;
    delay: <T_38>(delay: number) => Operator<T_38, T_38>;
    timeout: <T_39>(timeout: number) => Operator<T_39, T_39>;
    catchError: <T_40, R_8 = T_40>(selector: (err: any) => Observable<R_8>) => Operator<T_40 | R_8, R_8>;
    groupBy: <T_41>(f: (data: T_41) => any) => Operator<T_41, Observable<unknown> & import("./common").Observer<unknown> & {
        key: any;
    }>;
};
declare type Obs = {
    subscribe: typeof subscribe;
    toPromise: typeof toPromise;
};
declare type Op = {
    [key in keyof ((typeof operators) | Obs)]: (...args: Parameters<((typeof operators) | Obs)[key]>) => (key extends keyof Obs ? Obs : Op);
};
declare type Rx = {
    [key in keyof typeof observables]: (...args: Parameters<(typeof observables)[key]>) => Op;
};
export declare const rx: Rx;
//# sourceMappingURL=chain.d.ts.map