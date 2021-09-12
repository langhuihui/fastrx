import { Observable } from "./common";
export declare const scan: <T, R, ACC extends T | R>(f: (acc: ACC, c: T) => ACC, seed?: ACC | undefined) => import("./common").Operator<T, ACC>;
export declare const pairwise: <T>() => import("./common").Operator<T, [T, T]>;
export declare const map: <T, R>(mapper: (data: T) => R, thisArg?: any) => import("./common").Operator<T, R>;
export declare const mapTo: <T, R>(target: R) => import("./common").Operator<T, R>;
declare type ResultSelector<T, U, R> = (outter: T, inner: U) => R;
export declare const switchMap: <T, U, R>(makeSource: (data: T, index: number) => Observable<U>, combineResults?: ResultSelector<T, U, R> | undefined) => import("./common").Operator<T, R>;
export declare const switchMapTo: <T, U, R>(innerSource: Observable<U>, combineResults?: ResultSelector<T, U, R> | undefined) => import("./common").Operator<T, R>;
export declare const concatMap: <T, U, R>(makeSource: (data: T, index: number) => Observable<U>, combineResults?: ResultSelector<T, U, R> | undefined) => import("./common").Operator<T, R>;
export declare const concatMapTo: <T, U, R>(innerSource: Observable<U>, combineResults?: ResultSelector<T, U, R> | undefined) => import("./common").Operator<T, R>;
export declare const mergeMap: <T, U, R>(makeSource: (data: T, index: number) => Observable<U>, combineResults?: ResultSelector<T, U, R> | undefined) => import("./common").Operator<T, R>;
export declare const mergeMapTo: <T, U, R>(innerSource: Observable<U>, combineResults?: ResultSelector<T, U, R> | undefined) => import("./common").Operator<T, R>;
export declare const exhaustMap: <T, U, R>(makeSource: (data: T, index: number) => Observable<U>, combineResults?: ResultSelector<T, U, R> | undefined) => import("./common").Operator<T, R>;
export declare const exhaustMapTo: <T, U, R>(innerSource: Observable<U>, combineResults?: ResultSelector<T, U, R> | undefined) => import("./common").Operator<T, R>;
export declare const timeInterval: <T>() => import("./common").Operator<T, {
    value: T;
    interval: number;
}>;
export declare const bufferTime: <T>(miniseconds: number) => import("./common").Operator<T, T[]>;
export {};
//# sourceMappingURL=transformation.d.ts.map