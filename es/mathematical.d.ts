export declare const reduce: <T, R, ACC extends T | R>(f: (acc: ACC, c: T) => ACC, seed?: ACC | undefined) => import("./common").Operator<T, ACC>;
export declare const count: <T>(f: (d: T) => boolean) => import("./common").Operator<T, number>;
export declare const max: () => import("./common").Operator<number, number>;
export declare const min: () => import("./common").Operator<number, number>;
export declare const sum: () => import("./common").Operator<number, number>;
//# sourceMappingURL=mathematical.d.ts.map