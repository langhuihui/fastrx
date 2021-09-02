export declare function nothing(...args: any[]): any;
export declare const call: (f: Function) => any;
export interface IObserver<T, R = T> {
    dispose(defer?: boolean): void;
    next(data: R): void;
    complete(err?: any): void;
    defer(df?: Dispose): void;
    get Next(): (data: R) => void;
    get Complete(): (err?: any) => void;
}
declare type Dispose = () => any;
export declare type Observable<T> = (observer: IObserver<T>) => void;
export declare type Operator<T, R = T> = (source: Observable<T>) => Observable<R>;
export declare class Observer<T, R = T> implements IObserver<T, R> {
    readonly sink?: IObserver<R, R> | undefined;
    defers: Set<Dispose>;
    disposed: boolean;
    constructor(sink?: IObserver<R, R> | undefined);
    get Next(): (data: R) => void;
    get Complete(): (err?: any) => void;
    next(data: R): void;
    complete(err?: any): void;
    dispose(defer?: boolean): void;
    defer(df?: Dispose): void;
}
export declare function deliver<T>(c: {
    new (sink: IObserver<T>, ...args: any[]): IObserver<T>;
}): (...args: any[]) => (Operator<T>);
export {};
//# sourceMappingURL=common.d.ts.map