import { Observable } from "./common";
declare type ResultSelector<T, U, R> = (data: T, result: U) => R;
export declare const switchMap: <T, U, R>(...args: any[]) => import("./common").Operator<R, R>;
export declare const switchMapTo: <T, U, R>(innerSource: Observable<T>, combineResults?: ResultSelector<T, U, R> | undefined) => import("./common").Operator<R, R>;
export {};
//# sourceMappingURL=transformation.d.ts.map