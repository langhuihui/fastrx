import { pipe } from "./pipe";
export function nothing(...args) { }
export const call = (f) => f();
export const identity = (x) => x;
export function dispose() {
    this.dispose();
}
// @ts-ignore
export const inspect = () => typeof __FASTRX_DEVTOOLS__ !== 'undefined';
let obids = 0;
function pp(...args) {
    return pipe(this, ...args);
}
export class Inspect extends Function {
    toString() {
        return `${this.name}(${this.args.length ? [...this.args].join(', ') : ""})`;
    }
    pipe(...args) {
        return pipe(this, ...args);
    }
    subscribe(sink) {
        const notEnd = sink instanceof Sink;
        if (notEnd) {
            const ns = new NodeSink(sink, this, this.streamId++);
            Events.subscribe({ id: this.id, end: false }, { nodeId: ns.sourceId, streamId: ns.id });
            this(ns);
            return ns;
        }
        else {
            Events.subscribe({ id: this.id, end: true });
            this(sink);
            return sink;
        }
    }
}
export function create(ob, name, args) {
    if (inspect()) {
        const result = Object.defineProperties(Object.setPrototypeOf(ob, Inspect.prototype), {
            streamId: { value: 0, writable: true },
            name: { value: name },
            args: { value: args },
            id: { value: obids++ },
        });
        Events.create(result);
        return result;
    }
    return ob;
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
        this.subscribe = nothing;
        this.doDefer();
    }
    subscribe(source) {
        if (source instanceof Inspect)
            source.subscribe(this);
        else
            source(this);
        return this;
    }
    get bindSubscribe() {
        return (source) => this.subscribe(source);
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
        //@ts-ignore
        delete this.subscribe;
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
export function deliver(c, name) {
    return function (...args) {
        return source => {
            if (source instanceof Inspect) {
                const ob = create((observer) => {
                    const deliverSink = new c(observer, ...args);
                    deliverSink.sourceId = ob.id;
                    deliverSink.subscribe(source);
                }, name, arguments);
                ob.source = source;
                Events.pipe(ob);
                return ob;
            }
            else {
                return observer => source(new c(observer, ...args));
            }
        };
    };
}
function send(event, payload) {
    window.postMessage({ source: 'fastrx-devtools-backend', payload: { event, payload } });
}
class NodeSink extends Sink {
    constructor(sink, source, id) {
        super(sink);
        this.source = source;
        this.id = id;
        this.defer(() => {
            Events.defer(this.source, this.id);
        });
    }
    next(data) {
        Events.next(this.source, this.id, data);
        this.sink.next(data);
    }
    complete() {
        Events.complete(this.source, this.id);
        this.sink.complete();
    }
    error(err) {
        Events.complete(this.source, this.id, err);
        this.sink.error(err);
    }
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
