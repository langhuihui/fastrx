import { Observable } from "./common";
import { Subject } from "./producer";
export declare const scan: <T, R, ACC extends T | R>(f: (acc: ACC, c: T) => ACC, seed?: ACC | undefined) => import("./common").Operator<T, ACC>;
export declare const pairwise: <T>() => import("./common").Operator<T, [T, T]>;
export declare const map: <T, R>(mapper: (data: T) => R, thisArg?: any) => import("./common").Operator<T, R>;
export declare const mapTo: <R>(target: R) => import("./common").Operator<unknown, R>;
declare type ResultSelector<T, U, R> = (outter: T, inner: U) => R;
export declare const switchMap: <T, U, R = U>(makeSource: (data: T, index: number) => Observable<U>, combineResults?: ResultSelector<T, U, R> | undefined) => import("./common").Operator<T, R>;
export declare const switchMapTo: (innerSource: Observable<unknown>, combineResults?: ResultSelector<unknown, unknown, unknown> | undefined) => import("./common").Operator<unknown, unknown>;
export declare const concatMap: <T, U, R = U>(makeSource: (data: T, index: number) => Observable<U>, combineResults?: ResultSelector<T, U, R> | undefined) => import("./common").Operator<T, R>;
export declare const concatMapTo: (innerSource: Observable<unknown>, combineResults?: ResultSelector<unknown, unknown, unknown> | undefined) => import("./common").Operator<unknown, unknown>;
export declare const mergeMap: <T, U, R = U>(makeSource: (data: T, index: number) => Observable<U>, combineResults?: ResultSelector<T, U, R> | undefined) => import("./common").Operator<T, R>;
export declare const mergeMapTo: (innerSource: Observable<unknown>, combineResults?: ResultSelector<unknown, unknown, unknown> | undefined) => import("./common").Operator<unknown, unknown>;
export declare const exhaustMap: <T, U, R = U>(makeSource: (data: T, index: number) => Observable<U>, combineResults?: ResultSelector<T, U, R> | undefined) => import("./common").Operator<T, R>;
export declare const exhaustMapTo: (innerSource: Observable<unknown>, combineResults?: ResultSelector<unknown, unknown, unknown> | undefined) => import("./common").Operator<unknown, unknown>;
declare type Group = Subject<unknown> & {
    key: any;
};
export declare const groupBy: <T>(f: (data: T) => any) => import("./common").Operator<T, Group>;
export declare const timeInterval: <T>() => import("./common").Operator<T, {
    value: T;
    interval: number;
}>;
export declare const bufferTime: <T>(miniseconds: number) => import("./common").Operator<T, T[]>;
export declare const delay: <T>(delay: number) => import("./common").Operator<T, T>;
export declare const catchError: <T, R = T>(selector: (err: any) => Observable<R>) => import("./common").Operator<T, R>;
export {};
//# sourceMappingURL=transformation.d.ts.map