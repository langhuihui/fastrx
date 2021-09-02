export function nothing(...args) { }
export const call = (f) => f();
export class Observer {
    constructor(sink) {
        this.sink = sink;
        this.defers = new Set();
        this.disposed = false;
    }
    // set disposePass(value: boolean) {
    //     if (!this.sink) return;
    //     if (value) this.sink.defers.add(this);
    //     else this.sink.defers.delete(this);
    // }
    get Next() {
        return (data) => this.next(data);
    }
    get Complete() {
        return (err) => this.complete(err);
    }
    next(data) {
        if (this.sink)
            this.sink.next(data);
    }
    complete(err) {
        if (this.sink)
            this.sink.complete(err);
        this.dispose(false);
    }
    dispose(defer = true) {
        this.disposed = true;
        this.complete = nothing;
        this.next = nothing;
        this.dispose = nothing;
        if (defer)
            this.defer(); //销毁时终止事件源
    }
    defer(df) {
        if (df)
            this.defers.add(df);
        else {
            this.defers.forEach(call);
            this.defers.clear();
        }
    }
}
export function deliver(c) {
    return (...args) => (source) => (observer) => source(new c(observer, ...args));
}
