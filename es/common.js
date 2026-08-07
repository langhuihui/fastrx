import { summarize } from './protocol';
export function nothing(...args) { }
export const call = (f) => f();
export const identity = (x) => x;
export function dispose() {
    this.dispose();
}
// Compile-time opt-out: defining `__FASTRX_NO_DEVTOOLS__` (e.g. via a bundler
// define) removes all devtools instrumentation via dead-code elimination.
// @ts-ignore
const DEVTOOLS_ENABLED = typeof __FASTRX_NO_DEVTOOLS__ === 'undefined';
let obids = 1;
// function pp(this: Observable<unknown>, ...args: [...Operator<unknown>[], Operator<unknown>]) {
//   return pipe(this, ...args);
// }
export class Inspect extends Function {
    id;
    name;
    args;
    streamId;
    source;
    _label;
    toString() {
        return `${this.name}(${this.args.length ? [...this.args].join(', ') : ""})`;
    }
    /** Attach a stable display label for the devtools panel. Does not change the node id. */
    label(name) {
        this._label = name;
        return this;
    }
    // pipe(...args: [...Operator<unknown>[], Operator<unknown>]): Observable<unknown> {
    //   return pipe(this as unknown as Observable<T>, ...args);
    // }
    subscribe(sink) {
        const ns = new NodeSink(sink, this, this.streamId++);
        Events.subscribe({ id: this.id }, { nodeId: ns.sourceId, streamId: ns.id });
        this(ns);
        return ns;
    }
}
export class LastSink {
    sourceId;
    defers = new Set();
    disposed = false;
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
    sink;
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
    _next;
    _error;
    _complete;
    then = nothing;
    constructor(source, _next = nothing, _error = nothing, _complete = nothing) {
        super();
        this._next = _next;
        this._error = _error;
        this._complete = _complete;
        if (source instanceof Inspect) {
            const node = { toString: () => 'subscribe', name: 'subscribe', id: '', source: source };
            this.defer(() => {
                Events.defer(node, 0);
            });
            Events.create(node);
            Events.pipe(node);
            this.sourceId = node.id;
            this.subscribe(source);
            Events.subscribe({ id: node.id });
            if (_next == nothing) {
                this._next = data => Events.next(node, 0, data);
            }
            else {
                this.next = data => {
                    Events.next(node, 0, data);
                    _next(data);
                };
            }
            if (_complete == nothing) {
                this._complete = () => Events.complete(node, 0);
            }
            else {
                this.complete = () => {
                    this.dispose();
                    Events.complete(node, 0);
                    _complete();
                };
            }
            if (_error == nothing) {
                this._error = err => Events.error(node, 0, err);
            }
            else {
                this.error = err => {
                    this.dispose();
                    Events.error(node, 0, err);
                    _error(err);
                };
            }
        }
        else {
            this.subscribe(source);
        }
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
    if (DEVTOOLS_ENABLED) {
        const result = Object.defineProperties(Object.setPrototypeOf(ob, Inspect.prototype), {
            streamId: { value: 0, writable: true, configurable: true },
            name: { value: name, writable: true, configurable: true },
            args: { value: args, writable: true, configurable: true },
            id: { value: '', writable: true, configurable: true },
        });
        Events.create(result);
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (typeof arg === 'function') {
                if (arg instanceof Inspect) {
                    Events.addSource(result, arg);
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
// ── Devtools transport ─────────────────────────────────────────────────────
// The library connects to the devtools extension via externally_connectable.
// When the devtools panel opens, devtools.js sets window.__fastrxExtId to the
// extension id (via inspectedWindow.eval). The library detects this (immediately
// or via the property setter) and opens a long-lived port with
// chrome.runtime.connect(extId, {name:'fastrx-backend'}). Envelopes are posted
// on the port. When the panel closes, devtools.js clears the id and the library
// disconnects, resuming ring-buffer accumulation.
let sequence = 0;
let currentCause;
let port;
const ring = [];
const RING_MAX = 500;
function dispatch(env) {
    if (port) {
        try {
            port.postMessage(env);
        }
        catch {
            port = undefined;
            ring.push(env);
            if (ring.length > RING_MAX)
                ring.shift();
        }
    }
    else {
        ring.push(env);
        if (ring.length > RING_MAX)
            ring.shift();
    }
}
function openPort(extId) {
    if (port)
        return;
    const rt = globalThis.chrome?.runtime;
    if (!rt?.connect)
        return;
    try {
        const p = rt.connect(extId, { name: 'fastrx-backend' });
        p.onDisconnect.addListener(() => { port = undefined; });
        port = p;
        while (ring.length)
            p.postMessage(ring.shift());
    }
    catch {
        port = undefined;
    }
}
function closePort() {
    if (port) {
        try {
            port.disconnect();
        }
        catch { }
        port = undefined;
    }
}
function tryOpen() {
    if (port)
        return;
    const extId = globalThis.__fastrxExtId;
    if (extId)
        openPort(extId);
}
if (typeof window !== 'undefined') {
    const w = window;
    const currentId = w.__fastrxExtId;
    let storedId = currentId;
    try {
        Object.defineProperty(w, '__fastrxExtId', {
            configurable: true,
            get() { return storedId; },
            set(id) {
                storedId = id;
                if (id)
                    tryOpen();
                else
                    closePort();
            },
        });
    }
    catch { /* property non-configurable; fall back to direct check in tryOpen */ }
    if (storedId)
        tryOpen();
}
/** @internal Test seam: install a mock backend that receives all emitted
 *  envelopes (drains the ring first). Returns a disconnect function. */
export function __testInstallBackend(emit) {
    port = {
        postMessage: emit,
        onDisconnect: { addListener: () => { } },
        disconnect: () => { },
    };
    while (ring.length)
        emit(ring.shift());
    return () => { port = undefined; };
}
// ────────────────────────────────────────────────────────────────────────────
class NodeSink extends Sink {
    source;
    id;
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
        const seq = Events.next(this.source, this.id, data);
        const prev = currentCause;
        currentCause = { nodeId: this.source.id, sequence: seq };
        try {
            this.sink.next(data);
        }
        finally {
            currentCause = prev;
        }
    }
    complete() {
        const seq = Events.complete(this.source, this.id);
        const prev = currentCause;
        currentCause = { nodeId: this.source.id, sequence: seq };
        try {
            this.sink.complete();
        }
        finally {
            currentCause = prev;
        }
    }
    error(err) {
        const seq = Events.error(this.source, this.id, err);
        const prev = currentCause;
        currentCause = { nodeId: this.source.id, sequence: seq };
        try {
            this.sink.error(err);
        }
        finally {
            currentCause = prev;
        }
    }
}
export const Events = {
    addSource(who, source) {
        dispatch({
            version: 1, sequence: ++sequence, nodeId: who.id, nodeLabel: who._label,
            kind: 'addSource', streamId: 0, ts: Date.now(), data: source.id,
        });
    },
    next(who, streamId, data, cause = currentCause) {
        const seq = ++sequence;
        dispatch({
            version: 1, sequence: seq, nodeId: who.id, nodeLabel: who._label,
            kind: 'next', streamId, ts: Date.now(), cause, data: summarize(data),
        });
        return seq;
    },
    subscribe(id, sink) {
        dispatch({
            version: 1, sequence: ++sequence, nodeId: id.id, kind: 'subscribe',
            streamId: sink ? sink.streamId : 0, ts: Date.now(),
            data: sink ? sink.nodeId : undefined,
        });
    },
    complete(who, streamId, cause = currentCause) {
        const seq = ++sequence;
        dispatch({
            version: 1, sequence: seq, nodeId: who.id, nodeLabel: who._label,
            kind: 'complete', streamId, ts: Date.now(), cause,
        });
        return seq;
    },
    error(who, streamId, err, cause = currentCause) {
        const seq = ++sequence;
        dispatch({
            version: 1, sequence: seq, nodeId: who.id, nodeLabel: who._label,
            kind: 'error', streamId, ts: Date.now(), cause, err: summarize(err),
        });
        return seq;
    },
    defer(who, streamId) {
        dispatch({
            version: 1, sequence: ++sequence, nodeId: who.id, nodeLabel: who._label,
            kind: 'defer', streamId, ts: Date.now(),
        });
    },
    pipe(who) {
        dispatch({
            version: 1, sequence: ++sequence, nodeId: who.id, nodeLabel: who._label,
            kind: 'pipe', streamId: 0, ts: Date.now(),
            data: who.source ? who.source.id : undefined,
        });
    },
    create(who) {
        if (!who.id)
            who.id = `${who.name}#${obids++}`;
        dispatch({
            version: 1, sequence: ++sequence, nodeId: who.id, nodeLabel: who._label,
            kind: 'create', streamId: 0, ts: Date.now(),
        });
    },
};
export class TimeoutError extends Error {
    timeout;
    constructor(timeout) {
        super(`timeout after ${timeout}ms`);
        this.timeout = timeout;
    }
}
//# sourceMappingURL=common.js.map