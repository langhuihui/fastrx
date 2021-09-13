import { subscribe, toPromise } from './pipe';
import { Observable, Operator } from './common';
import * as producer from './producer';
declare const observables: {
    subject: <T>(source?: Observable<T> | undefined) => producer.Subject<T>;
    defer: <T_1>(f: () => Observable<T_1>) => Observable<T_1>;
    of: <T_2>(...data: T_2[]) => Observable<T_2>;
    fromArray: <T_3>(data: T_3[]) => Observable<T_3>;
    interval: (period: number) => Observable<number>;
    timer: (delay: number, period?: number) => Observable<number>;
    fromEventPattern: <T_4>(add: (n: (event: T_4) => void) => void, remove: (n: (event: T_4) => void) => void) => Observable<T_4>;
    fromEvent: <T_5, N>(target: {
        on: (name: N, handler: (event: T_5) => void) => void;
        off: (name: N, handler: (event: T_5) => void) => void;
    } | {
        addListener: (name: N, handler: (event: T_5) => void) => void;
        removeListener: (name: N, handler: (event: T_5) => void) => void;
    } | {
        addEventListener: (name: N, handler: (event: T_5) => void) => void;
        removeEventListener: (name: N, handler: (event: T_5) => void) => void;
    }, name: N) => Observable<T_5>;
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
    throwError: (e: any) => Observable<never>;
    empty: () => Observable<never>;
    zip: <A extends unknown[]>(...sources: import("./common").ObservableInputTuple<A>) => Observable<A>;
    merge: <A_1 extends readonly unknown[]>(...sources: import("./common").ObservableInputTuple<A_1>) => Observable<A_1[number]>;
    race: <A_2 extends readonly unknown[]>(...sources: import("./common").ObservableInputTuple<A_2>) => Observable<A_2[number]>;
    concat: <A_3 extends readonly unknown[]>(...sources: import("./common").ObservableInputTuple<A_3>) => Observable<A_3[number]>;
    combineLatest: <A_4 extends unknown[]>(...sources: import("./common").ObservableInputTuple<A_4>) => Observable<A_4>;
};
declare const operators: {
    tap: <T>(ob: Partial<import("./common").Observer<T>> | ((d: T) => void)) => Operator<T, T>;
    delay: <T_1>(delay: number) => Operator<T_1, T_1>;
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