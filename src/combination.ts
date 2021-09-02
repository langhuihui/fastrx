import { IObserver, Observable, Observer } from "./common";

class Share<T> extends Observer<T> {
    sinks: Set<IObserver<T>>;
    constructor(private readonly source: Observable<T>) {
        super();
        this.sinks = new Set();
    }
    add(sink: IObserver<T>) {
        this.sinks.add(sink);
        if (this.sinks.size === 1) {
            this.source(this);
        }
    }
    remove(sink: IObserver<T>) {
        this.sinks.delete(sink);
        if (this.sinks.size === 0) {
            this.defer();
        }
    }
    next(data: T) {
        this.sinks.forEach((s) => s.next(data));
    }
    complete() {
        this.sinks.forEach((s) => s.complete());
        this.sinks.clear();
    }
    error(err: any): void {
        this.sinks.forEach((s) => s.error(err));
        this.sinks.clear();
    }
}
export const share = <T>() => (source: Observable<T>) => {
    const share = new Share(source);
    return (sink: IObserver<T>) => {
        sink.defer(() => share.remove(sink));
        share.add(sink);
    };
};