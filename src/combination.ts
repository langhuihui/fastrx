import { ISink, Observable, Sink, Operator, LastSink, ObservableInputTuple } from "./common";

class Share<T> extends LastSink<T> {
    sinks = new Set<ISink<T>>();
    constructor(private readonly source: Observable<T>) {
        super();
    }
    add(sink: ISink<T>) {
        if (this.sinks.add(sink).size === 1) {
            this.source(this);
        }
    }
    remove(sink: ISink<T>) {
        this.sinks.delete(sink);
        if (this.sinks.size === 0) {
            this.doDefer();
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
    return (sink: ISink<T>) => {
        sink.defer(() => share.remove(sink));
        share.add(sink);
    };
};
export const merge =
    <A extends readonly unknown[]>(...sources: ObservableInputTuple<A>): Observable<A[number]> =>
        (sink) => {
            const merge = new Sink<unknown>(sink);
            let nLife = sources.length;
            merge.complete = () => {
                if (--nLife === 0) {
                    sink.complete();
                    merge.dispose(false);
                }
            };
            sources.forEach((source) => source(merge));
        };

export const race =
    <A extends readonly unknown[]>(...sources: ObservableInputTuple<A>): Observable<A[number]> =>
        (sink) => {
            const sinks = new Map<Observable<A[number]>, ISink<unknown>>();
            sources.forEach((source) => {
                const r = new Sink<unknown>(sink);
                sinks.set(source, r);
                r.error = (err) => {
                    sinks.delete(source);
                    r.dispose(false);
                    sink.error(err);
                    sinks.forEach((s) => s.dispose());
                };
                r.complete = () => {
                    sinks.delete(source);
                    r.dispose(false);
                    if (sinks.size === 0) {//特殊情况：所有流都没有数据
                        sink.complete();
                    }
                };
                r.next = (data) => {
                    sinks.delete(source);//先排除自己，防止自己调用dispose
                    sinks.forEach((s) => s.dispose());//其他所有流全部取消订阅
                    r.next = (data) => sink.next(data);//覆盖next方法
                    r.next(data);
                };
            });
            sources.forEach((source) => source(sinks.get(source)!));
        };

export const concat =
    <A extends readonly unknown[]>(...sources: ObservableInputTuple<A>): Observable<A[number]> =>
        (sink) => {
            let pos = 0;
            const len = sources.length;
            const s = new Sink(sink);
            s.complete = () => {
                if (pos < len && !s.disposed) sources[pos++](s);
                else sink.complete();
            };
            s.complete();
        };
