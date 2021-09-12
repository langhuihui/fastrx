export function nothing(...args) { }
export const call = (f) => f();
export const identity = (x) => x;
export function dispose() {
    this.dispose();
}
export class LastSink {
    constructor() {
        this.defers = new Set();
        this.disposed = false;
    }
    next(data) {
    }
    complete() {
        this.dispose();
    }
    error(err) {
        this.dispose();
    }
    get bindDispose() {
        return () => this.dispose();
    }
    dispose() {
        this.disposed = true;
        this.complete = nothing;
        this.error = nothing;
        this.next = nothing;
        this.dispose = nothing;
        this.doDefer();
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
    reset() {
        this.disposed = false;
        //@ts-ignore
        delete this.complete;
        //@ts-ignore
        delete this.next;
        //@ts-ignore
        delete this.dispose;
        //@ts-ignore
        delete this.next;
    }
    resetNext() {
        //@ts-ignore
        delete this.next;
    }
    resetComplete() {
        //@ts-ignore
        delete this.complete;
    }
    resetError() {
        //@ts-ignore
        delete this.error;
    }
}
export class Sink extends LastSink {
    constructor(sink) {
        super();
        this.sink = sink;
        sink.defer(this.bindDispose);
    }
    next(data) {
        this.sink.next(data);
    }
    complete() {
        this.sink.complete();
    }
    error(err) {
        this.sink.error(err);
    }
}
export function deliver(c) {
    return (...args) => (source) => (observer) => source(new c(observer, ...args));
}
function send(event, payload) {
    window.postMessage({ source: 'fastrx-devtools-backend', payload: { event, payload } });
}
export const Events = {
    addSource(who, source) {
        send('addSource', {
            id: who.id,
            name: who.toString(),
            source: { id: source.id, name: source.toString() },
        });
    },
    next(who, streamId, data) {
        send('next', { id: who.id, streamId, data: data && data.toString() });
    },
    subscribe({ id, end }, sink) {
        send('subscribe', {
            id,
            end,
            sink: { nodeId: sink && sink.nodeId, streamId: sink && sink.streamId },
        });
    },
    complete(who, streamId, err) {
        send('complete', { id: who.id, streamId, err: err ? err.toString() : null });
    },
    defer(who, streamId) {
        send('defer', { id: who.id, streamId });
    },
    pipe(who) {
        send('pipe', {
            name: who.toString(),
            id: who.id,
            source: { id: who.source.id, name: who.source.toString() },
        });
    },
    update(who) {
        send('update', { id: who.id, name: who.toString() });
    },
    create(who) {
        send('create', { name: who.toString(), id: who.id });
    },
};
export class TimeoutError extends Error {
    constructor(timeout) {
        super(`timeout after ${timeout}ms`);
        this.timeout = timeout;
    }
}
