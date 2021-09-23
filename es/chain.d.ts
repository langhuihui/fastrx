import { subscribe, toPromise } from './pipe';
import { Observable, Operator } from './common';
import * as producer from './producer';
import * as combination from './combination';
declare const observables: {
    subject<T>(source?: Observable<T> | undefined): producer.Subject<T>;
    defer<T_1>(f: () => Observable<T_1>): Observable<T_1>;
    of<T_2>(...data: T_2[]): Observable<T_2>;
    fromArray<T_3>(data: ArrayLike<T_3>): Observable<T_3>;
    interval(period: number): Observable<number>;
    timer(delay: number, period?: number | undefined): Observable<number>;
    fromEventPattern<T_4>(add: (n: (event: T_4) => void) => void, remove: (n: (event: T_4) => void) => void): Observable<T_4>;
    fromEvent<T_5, N>(target: {
        on: (name: N, handler: (event: T_5) => void) => void;
        off: (name: N, handler: (event: T_5) => void) => void;
    } | {
        addListener: (name: N, handler: (event: T_5) => void) => void;
        removeListener: (name: N, handler: (event: T_5) => void) => void;
    } | {
        addEventListener: (name: N, handler: (event: T_5) => void) => void;
        removeEventListener: (name: N, handler: (event: T_5) => void) => void;
    }, name: N): Observable<T_5>;
    fromMessageEvent<T_6>(target: {
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
    })): Observable<T_6>;
    fromPromise<T_7>(promise: Promise<T_7>): Observable<T_7>;
    fromFetch(input: RequestInfo, init?: RequestInit | undefined): Observable<Response>;
    fromIterable<T_8>(source: Iterable<T_8>): Observable<T_8>;
    fromAnimationFrame(): Observable<number>;
    range(start: number, count: number): Observable<number>;
    bindCallback<T_9>(call: Function, thisArg: any, ...args: any[]): Observable<T_9>;
    bindNodeCallback<T_10>(call: Function, thisArg: any, ...args: any[]): Observable<T_10>;
    never(): Observable<never>;
    throwError(e: any): Observable<never>;
    empty(): Observable<never>;
    zip: typeof combination.zip;
    merge: typeof combination.merge;
    race: typeof combination.race;
    concat: typeof combination.concat;
    combineLatest: typeof combination.combineLatest;
};
declare const operators: {
    scan: <T, R, ACC extends T | R>(f: (acc: ACC, c: T) => ACC, seed?: ACC | undefined) => Operator<T, ACC>;
    pairwise: <T_1>() => Operator<T_1, [T_1, T_1]>;
    map: <T_2, R_1>(mapper: (data: T_2) => R_1, thisArg?: any) => Operator<T_2, R_1>;
    mapTo: <R_2>(target: R_2) => Operator<unknown, R_2>;
    switchMap: <T_3, U, R_3 = U>(makeSource: (data: T_3, index: number) => Observable<U>, combineResults?: ((outter: T_3, inner: U) => R_3) | undefined) => Operator<T_3, R_3>;
    switchMapTo: <T_3, U, R_3 = U>(innerSource: Observable<U>, combineResults?: ((outter: T_3, inner: U) => R_3) | undefined) => Operator<T_3, R_3>;
    concatMap: <T_4, U_1, R_4 = U_1>(makeSource: (data: T_4, index: number) => Observable<U_1>, combineResults?: ((outter: T_4, inner: U_1) => R_4) | undefined) => Operator<T_4, R_4>;
    concatMapTo: <T_4, U_1, R_4 = U_1>(innerSource: Observable<U_1>, combineResults?: ((outter: T_4, inner: U_1) => R_4) | undefined) => Operator<T_4, R_4>;
    mergeMap: <T_5, U_2, R_5 = U_2>(makeSource: (data: T_5, index: number) => Observable<U_2>, combineResults?: ((outter: T_5, inner: U_2) => R_5) | undefined) => Operator<T_5, R_5>;
    mergeMapTo: <T_5, U_2, R_5 = U_2>(innerSource: Observable<U_2>, combineResults?: ((outter: T_5, inner: U_2) => R_5) | undefined) => Operator<T_5, R_5>;
    exhaustMap: <T_6, U_3, R_6 = U_3>(makeSource: (data: T_6, index: number) => Observable<U_3>, combineResults?: ((outter: T_6, inner: U_3) => R_6) | undefined) => Operator<T_6, R_6>;
    exhaustMapTo: <T_6, U_3, R_6 = U_3>(innerSource: Observable<U_3>, combineResults?: ((outter: T_6, inner: U_3) => R_6) | undefined) => Operator<T_6, R_6>;
    timeInterval: <T_7>() => Operator<T_7, {
        value: T_7;
        interval: number;
    }>;
    bufferTime: <T_8>(miniseconds: number) => Operator<T_8, T_8[]>;
    reduce: <T_9, R_7, ACC_1 extends T_9 | R_7>(f: (acc: ACC_1, c: T_9) => ACC_1, seed?: ACC_1 | undefined) => Operator<T_9, ACC_1>;
    count: <T_10>(f: (d: T_10) => boolean) => Operator<T_10, number>;
    max: () => Operator<number, number>;
    min: () => Operator<number, number>;
    sum: () => Operator<number, number>;
    filter: <T_11>(filter: (data: T_11) => boolean, thisArg?: any) => Operator<T_11, T_11>;
    ignoreElements: <T_12>() => Operator<T_12, never>;
    take: <T_13>(count: number) => Operator<T_13, T_13>;
    takeUntil: <T_14>(control: Observable<unknown>) => Operator<T_14, T_14>;
    takeWhile: <T_15>(f: (data: T_15) => boolean) => Operator<T_15, T_15>;
    takeLast: <T_16>(count: number) => Operator<T_16, T_16[]>;
    skip: <T_17>(count: number) => Operator<T_17, T_17>;
    skipUntil: <T_18>(control: Observable<unknown>) => Operator<T_18, T_18>;
    skipWhile: <T_19>(f: (data: T_19) => boolean) => Operator<T_19, T_19>;
    throttle: <T_20>(durationSelector: (data: T_20) => Observable<unknown>, config?: {
        leading: boolean;
        trailing: boolean;
    } | undefined) => Operator<T_20, T_20>;
    audit: <T_21>(durationSelector: (d: T_21) => Observable<unknown>) => Operator<T_21, T_21>;
    debounce: <T_22>(durationSelector: (d: T_22) => Observable<unknown>) => Operator<T_22, T_22>;
    debounceTime: <T_23>(period: number) => Operator<T_23, T_23>;
    elementAt: <T_24>(count: number, defaultValue?: T_24 | undefined) => Operator<T_24, T_24>;
    find: <T_25>(f: (d: T_25) => boolean) => (source: Observable<T_25>) => Observable<T_25>;
    findIndex: <T_26>(f: (d: T_26) => boolean) => Operator<T_26, number>;
    first: <T_27>(f?: ((d: T_27, index: number) => boolean) | undefined, defaultValue?: T_27 | undefined) => Operator<T_27, T_27>;
    last: <T_28>(f?: ((d: T_28, index: number) => boolean) | undefined, defaultValue?: T_28 | undefined) => Operator<T_28, T_28>;
    every: <T_29>(predicate: (d: T_29, index: number) => boolean) => Operator<T_29, boolean>;
    share<T_30>(): Operator<T_30, T_30>;
    shareReplay<T_31>(bufferSize: number): Operator<T_31, T_31>;
    iif<T_32, F>(condition: () => boolean, trueS: Observable<T_32>, falseS: Observable<F>): Observable<T_32 | F>;
    startWith<T_33, A extends unknown[]>(...xs: A): Operator<T_33, T_33 | A[number]>;
    withLatestFrom: <T_34, A_1 extends unknown[]>(...args: import("./common").ObservableInputTuple<A_1>) => Operator<T_34, [T_34, ...A_1]>;
    bufferCount: <T_35>(bufferSize: number, startBufferEvery?: number | undefined) => Operator<T_35, T_35[]>;
    buffer: <T_36>(closingNotifier: Observable<unknown>) => Operator<T_36, T_36[]>;
    tap: <T_37>(ob: Partial<import("./common").Observer<T_37>> | ((d: T_37) => void)) => Operator<T_37, T_37>;
    delay: <T_38>(delay: number) => Operator<T_38, T_38>;
    timeout: <T_39>(timeout: number) => Operator<T_39, T_39>;
    catchError: <T_40, R_8 = T_40>(selector: (err: any) => Observable<R_8>) => Operator<T_40, R_8>;
    groupBy: <T_41>(f: (data: T_41) => any) => Operator<T_41, Observable<unknown> & import("./common").Observer<unknown> & {
        key: any;
    }>;
};
declare type Obs = {
    subscribe: typeof subscribe;
    toPromise: typeof toPromise;
};
declare type Op = {
    [key in keyof (typeof operators)]: (...args: Parameters<((typeof operators))[key]>) => Op;
} & Obs;
declare type Rx = {
    [key in keyof typeof observables]: (...args: Parameters<(typeof observables)[key]>) => Op;
};
export declare const rx: Rx;
export {};
//# sourceMappingURL=chain.d.ts.map