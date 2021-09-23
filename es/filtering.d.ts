import { Observable, Operator } from "./common";
export declare const filter: <T>(filter: (data: T) => boolean, thisArg?: any) => Operator<T, T>;
export declare const ignoreElements: <T>() => Operator<T, never>;
export declare const take: <T>(count: number) => Operator<T, T>;
export declare const takeUntil: <T>(control: Observable<unknown>) => Operator<T, T>;
export declare const takeWhile: <T>(f: (data: T) => boolean) => Operator<T, T>;
export declare const takeLast: <T>(count: number) => Operator<T, T[]>;
export declare const skip: <T>(count: number) => Operator<T, T>;
export declare const skipUntil: <T>(control: Observable<unknown>) => Operator<T, T>;
export declare const skipWhile: <T>(f: (data: T) => boolean) => Operator<T, T>;
export declare const throttle: <T>(durationSelector: (data: T) => Observable<unknown>, config?: {
    leading: boolean;
    trailing: boolean;
} | undefined) => Operator<T, T>;
export declare const audit: <T>(durationSelector: (d: T) => Observable<unknown>) => Operator<T, T>;
export declare const debounce: <T>(durationSelector: (d: T) => Observable<unknown>) => Operator<T, T>;
export declare const debounceTime: <T>(period: number) => Operator<T, T>;
export declare const elementAt: <T>(count: number, defaultValue?: T | undefined) => Operator<T, T>;
export declare const find: <T>(f: (d: T) => boolean) => (source: Observable<T>) => Observable<T>;
export declare const findIndex: <T>(f: (d: T) => boolean) => Operator<T, number>;
export declare const first: <T>(f?: ((d: T, index: number) => boolean) | undefined, defaultValue?: T | undefined) => Operator<T, T>;
export declare const last: <T>(f?: ((d: T, index: number) => boolean) | undefined, defaultValue?: T | undefined) => Operator<T, T>;
export declare const every: <T>(predicate: (d: T, index: number) => boolean) => Operator<T, boolean>;
//# sourceMappingURL=filtering.d.ts.map