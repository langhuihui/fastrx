import { Observable } from "./common";
export declare const filter: <T>(filter: (data: T) => boolean, thisArg?: any) => import("./common").Operator<T, T>;
export declare const ignoreElements: <T>() => import("./common").Operator<T, never>;
export declare const take: <T>(count: number) => import("./common").Operator<T, T>;
export declare const takeUntil: <T>(control: Observable<unknown>) => import("./common").Operator<T, T>;
export declare const takeWhile: <T>(f: (data: T) => boolean) => import("./common").Operator<T, T>;
export declare const takeLast: <T>(count: number) => import("./common").Operator<T, T[]>;
export declare const skip: <T>(count: number) => import("./common").Operator<T, T>;
export declare const skipUntil: <T>(control: Observable<unknown>) => import("./common").Operator<T, T>;
export declare const skipWhile: <T>(f: (data: T) => boolean) => import("./common").Operator<T, T>;
export declare const throttle: <T>(durationSelector: (data: T) => Observable<unknown>, config?: {
    leading: boolean;
    trailing: boolean;
} | undefined) => import("./common").Operator<T, T>;
export declare const audit: <T>(durationSelector: (d: T) => Observable<unknown>) => import("./common").Operator<T, T>;
export declare const debounce: <T>(durationSelector: (d: T) => Observable<unknown>) => import("./common").Operator<T, T>;
export declare const debounceTime: <T>(period: number) => import("./common").Operator<T, T>;
export declare const elementAt: <T>(count: number, defaultValue?: T | undefined) => import("./common").Operator<T, T>;
export declare const find: <T>(f: (d: T) => boolean) => (source: Observable<T>) => Observable<T>;
export declare const findIndex: <T>(f: (d: T) => boolean) => import("./common").Operator<T, number>;
export declare const first: <T>(f?: ((d: T, index: number) => boolean) | undefined, defaultValue?: T | undefined) => import("./common").Operator<T, T>;
export declare const last: <T>(f?: ((d: T, index: number) => boolean) | undefined, defaultValue?: T | undefined) => import("./common").Operator<T, T>;
export declare const every: <T>(predicate: (d: T, index: number) => boolean) => import("./common").Operator<T, boolean>;
//# sourceMappingURL=filtering.d.ts.map