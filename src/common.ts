export function nothing(...args: any[]): any { }
export const call = (f: Function) => f();
export interface IObserver<T, R = T> {
    dispose(defer?: boolean): void;
    next(data: R): void;
    complete(): void;
    error(err: any): void;
    defer(df?: Dispose): void;
    get Next(): (data: R) => void;
    get Complete(): () => void;
    get Error(): (err: any) => void;
}

declare type Dispose = () => any;
export type Observable<T> = (observer: IObserver<T>) => void;
export type Operator<T, R = T> = (source: Observable<T>) => Observable<R>;
export class Observer<T, R = T> implements IObserver<T, R> {
    defers = new Set<Dispose>();
    disposed = false;
    constructor(public readonly sink?: IObserver<R>) {
    }
    // set disposePass(value: boolean) {
    //     if (!this.sink) return;
    //     if (value) this.sink.defers.add(this);
    //     else this.sink.defers.delete(this);
    // }
    get Next() {
        return (data: R) => this.next(data);
    }
    get Complete() {
        return () => this.complete();
    }
    get Error() {
        return (err: any) => this.error(err);
    }
    next(data: R) {
        if (this.sink) this.sink.next(data);
    }
    complete() {
        if (this.sink) this.sink.complete();
        this.dispose(false);
    }
    error(err: any) {
        if (this.sink) this.sink.error(err);
        this.dispose(false);
    }
    dispose(defer = true) {
        this.disposed = true;
        this.complete = nothing;
        this.error = nothing;
        this.next = nothing;
        this.dispose = nothing;
        if (defer) this.defer(); //销毁时终止事件源
    }
    defer(df?: Dispose) {
        if (df)
            this.defers.add(df);
        else {
            this.defers.forEach(call);
            this.defers.clear();
        }
    }
}
export function deliver<T>(c: { new(sink: IObserver<T>, ...args: any[]): IObserver<T>; }) {
    return (...args: any[]): (Operator<T>) => (source: Observable<T>) => (observer: IObserver<T>) => source(new c(observer, ...args));
}