import { Observable, nothing, Observer, Subscribe } from "./common";
export declare const toPromise: <T>() => (source: Observable<T>) => Promise<T>;
export declare const subscribe: <T>(n?: (data: T) => void, e?: typeof nothing, c?: typeof nothing) => (source: Observable<T>) => Subscribe<T>;
export declare const tap: <T>(ob: Partial<Observer<T>> | ((d: T) => void)) => import("./common").Operator<T, T>;
export declare const timeout: <T>(timeout: number) => import("./common").Operator<T, T>;
//# sourceMappingURL=utils.d.ts.map