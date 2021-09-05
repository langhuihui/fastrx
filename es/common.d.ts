export declare function nothing(...args: any[]): any;
export declare const call: (f: Function) => any;
export interface IObserver<T> {
    disposed: boolean;
    dispose(defer?: boolean): void;
    next(data: T): void;
    complete(): void;
    error(err: any): void;
    defer(df: Dispose): void;
    removeDefer(df: Dispose): void;
}
declare type Dispose = () => any;
export declare type Observable<T> = (observer: IObserver<T>) => void;
export declare type Operator<T, R = T> = (source: Observable<T>) => Observable<R>;
export declare class Observer<T, R = T> {
    readonly sink?: IObserver<R> | undefined;
    defers: Set<Dispose>;
    disposed: boolean;
    constructor(sink?: IObserver<R> | undefined);
    next(data: T | R): void;
    complete(): void;
    error(err: any): void;
    dispose(defer?: boolean): void;
    doDefer(): void;
    defer(df: Dispose): void;
    removeDefer(df: Dispose): void;
}
export declare function deliver<T>(c: {
    new (sink: IObserver<T>, ...args: any[]): IObserver<T>;
}): (...args: any[]) => (Operator<T>);
export {};
//# sourceMappingURL=common.d.ts.map