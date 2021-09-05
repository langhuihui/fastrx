import { Observer, nothing, Observable, Operator } from './common';
import { Subject } from './producer';
export declare const pipe: (first: Observable<unknown>, ...cbs: (Operator<unknown, unknown> | ((source: Observable<unknown>) => Subscribe<unknown>))[]) => Observable<unknown>;
export declare const toPromise: <T>() => (source: Observable<T>) => Promise<T>;
declare class Subscribe<T> extends Observer<T> {
    next: typeof nothing;
    error: typeof nothing;
    complete: typeof nothing;
    then: typeof nothing;
    constructor(next?: typeof nothing, error?: typeof nothing, complete?: typeof nothing);
}
export declare const subscribe: <T>(n?: (data: T) => void, e?: typeof nothing, c?: typeof nothing) => (source: Observable<T>) => Subscribe<T>;
export declare const tap: <T>(...args: any[]) => Operator<T, T>;
export declare const delay: <T>(...args: any[]) => Operator<T, T>;
export declare const catchError: <T, R = T>(...args: any[]) => Operator<R, R>;
export * from './common';
export * from './producer';
declare type Group = Subject<unknown> & {
    key: any;
};
export declare const groupBy: <T>(...args: any[]) => Operator<Group, Group>;
export declare class TimeoutError extends Error {
    readonly timeout: number;
    constructor(timeout: number);
}
export declare const timeout: <T>(...args: any[]) => Operator<T, T>;
interface Node {
    id: string;
    toString(): string;
    source: Node;
}
export declare const Events: {
    addSource(who: Node, source: Node): void;
    next(who: Node, streamId: string, data?: any): void;
    subscribe({ id, end }: {
        id: string;
        end: boolean;
    }, sink: {
        nodeId: string;
        streamId: string;
    }): void;
    complete(who: Node, streamId: string, err?: any): void;
    defer(who: Node, streamId: string): void;
    pipe(who: Node): void;
    update(who: Node): void;
    create(who: Node): void;
};
//# sourceMappingURL=pipe.d.ts.map