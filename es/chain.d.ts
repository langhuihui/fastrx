import { Observable, Operator } from './common';
import * as producer from './producer';
import { subscribe, toPromise } from './utils';
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
    switchMapTo: (innerSource: Observable<unknown>, combineResults?: ((outter: unknown, inner: unknown) => unknown) | undefined) => Operator<unknown, unknown>;
    concatMap: <T_4, U_1, R_4 = U_1>(makeSource: (data: T_4, index: number) => Observable<U_1>, combineResults?: ((outter: T_4, inner: U_1) => R_4) | undefined) => Operator<T_4, R_4>;
    concatMapTo: (innerSource: Observable<unknown>, combineResults?: ((outter: unknown, inner: unknown) => unknown) | undefined) => Operator<unknown, unknown>;
    mergeMap: <T_5, U_2, R_5 = U_2>(makeSource: (data: T_5, index: number) => Observable<U_2>, combineResults?: ((outter: T_5, inner: U_2) => R_5) | undefined) => Operator<T_5, R_5>;
    mergeMapTo: (innerSource: Observable<unknown>, combineResults?: ((outter: unknown, inner: unknown) => unknown) | undefined) => Operator<unknown, unknown>;
    exhaustMap: <T_6, U_3, R_6 = U_3>(makeSource: (data: T_6, index: number) => Observable<U_3>, combineResults?: ((outter: T_6, inner: U_3) => R_6) | undefined) => Operator<T_6, R_6>;
    exhaustMapTo: (innerSource: Observable<unknown>, combineResults?: ((outter: unknown, inner: unknown) => unknown) | undefined) => Operator<unknown, unknown>;
    groupBy: <T_7>(f: (data: T_7) => any) => Operator<T_7, Observable<unknown> & import("./common").Observer<unknown> & {
        key: any;
    }>;
    timeInterval: <T_8>() => Operator<T_8, {
        value: T_8;
        interval: number;
    }>;
    bufferTime: <T_9>(miniseconds: number) => Operator<T_9, T_9[]>;
    delay: <T_10>(delay: number) => Operator<T_10, T_10>;
    catchError: <T_11, R_7 = T_11>(selector: (err: any) => Observable<R_7>) => Operator<T_11, R_7>;
    reduce: <T_12, R_8, ACC_1 extends T_12 | R_8>(f: (acc: ACC_1, c: T_12) => ACC_1, seed?: ACC_1 | undefined) => Operator<T_12, ACC_1>;
    count: <T_13>(f: (d: T_13) => boolean) => Operator<T_13, number>;
    max: () => Operator<number, number>;
    min: () => Operator<number, number>;
    sum: () => Operator<number, number>;
    filter: <T_14>(filter: (data: T_14) => boolean, thisArg?: any) => Operator<T_14, T_14>;
    ignoreElements: <T_15>() => Operator<T_15, never>;
    take: <T_16>(count: number) => Operator<T_16, T_16>;
    takeUntil: <T_17>(control: Observable<unknown>) => Operator<T_17, T_17>;
    takeWhile: <T_18>(f: (data: T_18) => boolean) => Operator<T_18, T_18>;
    takeLast: <T_19>(count: number) => Operator<T_19, T_19[]>;
    skip: <T_20>(count: number) => Operator<T_20, T_20>;
    skipUntil: <T_21>(control: Observable<unknown>) => Operator<T_21, T_21>;
    skipWhile: <T_22>(f: (data: T_22) => boolean) => Operator<T_22, T_22>;
    throttle: <T_23>(durationSelector: (data: T_23) => Observable<unknown>, config?: {
        leading: boolean;
        trailing: boolean;
    } | undefined) => Operator<T_23, T_23>;
    audit: <T_24>(durationSelector: (d: T_24) => Observable<unknown>) => Operator<T_24, T_24>;
    debounce: <T_25>(durationSelector: (d: T_25) => Observable<unknown>) => Operator<T_25, T_25>;
    debounceTime: <T_26>(period: number) => Operator<T_26, T_26>;
    elementAt: <T_27>(count: number, defaultValue?: T_27 | undefined) => Operator<T_27, T_27>;
    find: <T_28>(f: (d: T_28) => boolean) => (source: Observable<T_28>) => Observable<T_28>;
    findIndex: <T_29>(f: (d: T_29) => boolean) => Operator<T_29, number>;
    first: <T_30>(f?: ((d: T_30, index: number) => boolean) | undefined, defaultValue?: T_30 | undefined) => Operator<T_30, T_30>;
    last: <T_31>(f?: ((d: T_31, index: number) => boolean) | undefined, defaultValue?: T_31 | undefined) => Operator<T_31, T_31>;
    every: <T_32>(predicate: (d: T_32, index: number) => boolean) => Operator<T_32, boolean>;
    share<T_33>(): Operator<T_33, T_33>;
    shareReplay<T_34>(bufferSize: number): Operator<T_34, T_34>;
    iif<T_35, F>(condition: () => boolean, trueS: Observable<T_35>, falseS: Observable<F>): Observable<T_35 | F>;
    startWith<T_36, A extends unknown[]>(...xs: A): Operator<T_36, T_36 | A[number]>;
    withLatestFrom: <T_37, A_1 extends unknown[]>(...args: import("./common").ObservableInputTuple<A_1>) => Operator<T_37, [T_37, ...A_1]>;
    bufferCount: <T_38>(bufferSize: number, startBufferEvery?: number | undefined) => Operator<T_38, T_38[]>;
    buffer: <T_39>(closingNotifier: Observable<unknown>) => Operator<T_39, T_39[]>;
    tap: <T_40>(ob: Partial<import("./common").Observer<T_40>> | ((d: T_40) => void)) => Operator<T_40, T_40>;
    timeout: <T_41>(timeout: number) => Operator<T_41, T_41>;
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