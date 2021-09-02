import { Sink } from '../common';
export * from '../common';
declare type Observable<T = unknown> = (sink: Sink<T>) => void;
declare type Operator<T, R = T> = (source: Observable<T>) => Observable<R>;
export declare const pipe: (first: Observable, ...cbs: Operator<unknown, unknown>[]) => Observable<unknown>;
declare class Reuse {
    constructor(subscribe: any, ...args: any[]);
    start(): void;
    stop(): void;
}
export declare const reusePipe: (...args: any[]) => Reuse;
export declare const toPromise: () => (source: any) => Promise<unknown>;
export declare const subscribe: (n?: any, e?: any, c?: any) => (source: any) => any;
export declare const tap: any;
export declare const delay: any;
export declare const catchError: any;
export * from '../combination';
export * from '../filtering';
export * from '../mathematical';
export * from '../producer';
export * from '../transformation';
export declare const groupBy: any;
export declare const Events: {
    addSource: any;
    subscribe: any;
    next: any;
    complete: any;
    defer: any;
    pipe: any;
    update: any;
    create: any;
};
//# sourceMappingURL=pipe.d.ts.map