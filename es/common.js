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
    next(data) {
        if (this.sink)
            this.sink.next(data);
    }
    complete() {
        if (this.sink)
            this.sink.complete();
        this.dispose(false);
    }
    error(err) {
        if (this.sink)
            this.sink.error(err);
        this.dispose(false);
    }
    dispose(defer = true) {
        this.disposed = true;
        this.complete = nothing;
        this.error = nothing;
        this.next = nothing;
        this.dispose = nothing;
        if (defer) {
            this.doDefer();
        } //销毁时终止事件源
    }
    doDefer() {
        this.defers.forEach(call);
        this.defers.clear();
    }
    defer(df) {
        this.defers.add(df);
    }
    removeDefer(df) {
        this.defers.delete(df);
    }
}
export function deliver(c) {
    return (...args) => (source) => (observer) => source(new c(observer, ...args));
}
