export function nothing(...args) { }
export const call = (f) => f();
export const identity = (x) => x;
export function dispose() {
    this.dispose();
}
// @ts-ignore
export const inspect = () => typeof __FASTRX_DEVTOOLS__ !== 'undefined';
let obids = 1;
// function pp(this: Observable<unknown>, ...args: [...Operator<unknown>[], Operator<unknown>]) {
//   return pipe(this, ...args);
// }
export class Inspect extends Function {
    toString() {
        return `${this.name}(${this.args.length ? [...this.args].join(', ') : ""})`;
    }
    // pipe(...args: [...Operator<unknown>[], Operator<unknown>]): Observable<unknown> {
    //   return pipe(this as unknown as Observable<T>, ...args);
    // }
    subscribe(sink) {
        const ns = new NodeSink(sink, this, this.streamId++);
        Events.subscribe({ id: this.id, end: false }, { nodeId: ns.sourceId, streamId: ns.id });
        this(ns);
        return ns;
    }
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
export class Subscribe extends LastSink {
    constructor(source, _next = nothing, _error = nothing, _complete = nothing) {
        super();
        this._next = _next;
        this._error = _error;
        this._complete = _complete;
        this.then = nothing;
        if (source instanceof Inspect) {
            const id = source.streamId++;
            this.defer(() => {
                Events.defer(source, id);
            });
            const node = { toString: () => 'Subscribe', id: 0, source };
            Events.create(node);
            Events.pipe(node);
            Events.subscribe({ id: node.id, end: true }, { nodeId: this.sourceId, streamId: id });
            if (_next == nothing) {
                this._next = data => Events.next(source, id, data);
            }
            else {
                this.next = data => {
                    Events.next(source, id, data);
                    _next(data);
                };
            }
            if (_complete == nothing) {
                this._complete = () => Events.complete(source, id);
            }
            else {
                this.complete = () => {
                    this.dispose();
                    Events.complete(source, id);
                    _complete();
                };
            }
            if (_error == nothing) {
                this._error = err => Events.complete(source, id, err);
            }
            else {
                this.error = err => {
                    this.dispose();
                    Events.complete(source, id, err);
                    _error();
                };
            }
        }
        this.subscribe(source);
    }
    next(data) {
        this._next(data);
    }
    complete() {
        this.dispose();
        this._complete();
    }
    error(err) {
        this.dispose();
        this._error(err);
    }
}
export function pipe(first, ...cbs) {
    return cbs.reduce((aac, c) => c(aac), first);
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
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (typeof arg === 'function') {
                if (arg instanceof Inspect) {
                    Events.addSource(arg, result);
                }
                else {
                }
            }
        }
        return result;
    }
    return ob;
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
        this.sourceId = sink.sourceId;
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
        if (!who.id)
            who.id = obids++;
        send('create', { name: who.toString(), id: who.id });
    },
};
export class TimeoutError extends Error {
    constructor(timeout) {
        super(`timeout after ${timeout}ms`);
        this.timeout = timeout;
    }
}
