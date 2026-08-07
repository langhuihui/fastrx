// Shared devtools protocol types for fastrx.
// Consumed by the library (emit side) and the devtools panel (decode side).
/**
 * Bounded serialization of a runtime value for the devtools panel.
 * Returns undefined for null/undefined so the Envelope field can be omitted.
 * Objects attempted via JSON.stringify, fallback to String(); truncated to `max`.
 */
function summarize(v, max = 256) {
    if (v === undefined || v === null)
        return undefined;
    let s;
    try {
        if (typeof v === 'object')
            s = JSON.stringify(v);
        else
            s = String(v);
    }
    catch {
        try {
            s = String(v);
        }
        catch {
            return 'unserializable';
        }
    }
    if (s.length > max)
        return s.slice(0, Math.max(0, max - 3)) + '...';
    return s;
}

function nothing(...args) { }
const call = (f) => f();
const identity = (x) => x;
function dispose() {
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
class Inspect extends Function {
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
class LastSink {
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
class Sink extends LastSink {
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
class Subscribe extends LastSink {
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
function pipe(first, ...cbs) {
    return cbs.reduce((aac, c) => c(aac), first);
}
function create(ob, name, args) {
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
            }
        }
        return result;
    }
    return ob;
}
function deliver(c, name) {
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
//
// The port is bidirectional: the panel can send PanelCommands (inspect /
// breakpoint) and the library replies over the same port.
let sequence = 0;
let currentCause;
let port;
const ring = [];
const RING_MAX = 500;
// Reverse-channel state.
const breakpoints = new Set();
const latestByNode = new Map();
const streamCountByNode = new Map();
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
/** Handle a panel command; returns a reply to post back (or undefined). */
function handlePanelCommand(msg) {
    if (!msg || typeof msg.type !== 'string')
        return undefined;
    if (msg.type === 'breakpoint') {
        if (msg.on)
            breakpoints.add(String(msg.nodeId));
        else
            breakpoints.delete(String(msg.nodeId));
        return { type: 'breakpoint-ack', nodeId: String(msg.nodeId), on: !!msg.on, ts: Date.now() };
    }
    if (msg.type === 'inspect') {
        const nodeId = String(msg.nodeId);
        return {
            type: 'inspect-result',
            nodeId,
            latest: latestByNode.get(nodeId),
            subscriptionCount: streamCountByNode.get(nodeId) ?? 0,
            ts: Date.now(),
        };
    }
    return undefined;
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
        p.onMessage.addListener((msg) => {
            const reply = handlePanelCommand(msg);
            if (reply && port) {
                try {
                    port.postMessage(reply);
                }
                catch { /* noop */ }
            }
        });
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
function __testInstallBackend(emit, onReply) {
    const sendCommand = (msg) => {
        const reply = handlePanelCommand(msg);
        if (reply && onReply)
            onReply(reply);
    };
    port = {
        postMessage: emit,
        onDisconnect: { addListener: () => { } },
        onMessage: { addListener: (cb) => { port._onMessage = cb; } },
        disconnect: () => { },
    };
    while (ring.length)
        emit(ring.shift());
    const disconnect = () => { port = undefined; };
    return onReply
        ? { disconnect, sendCommand }
        : disconnect;
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
const Events = {
    addSource(who, source) {
        dispatch({
            version: 1, sequence: ++sequence, nodeId: who.id, nodeLabel: who._label,
            kind: 'addSource', streamId: 0, ts: Date.now(), data: source.id,
        });
    },
    next(who, streamId, data, cause = currentCause) {
        const seq = ++sequence;
        latestByNode.set(who.id, summarize(data) ?? '');
        dispatch({
            version: 1, sequence: seq, nodeId: who.id, nodeLabel: who._label,
            kind: 'next', streamId, ts: Date.now(), cause, data: summarize(data),
            breakpoint: breakpoints.has(who.id) || undefined,
        });
        return seq;
    },
    subscribe(id, sink) {
        const active = sink !== undefined;
        streamCountByNode.set(id.id, (streamCountByNode.get(id.id) ?? 0) + (active ? 1 : 0));
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
            breakpoint: breakpoints.has(who.id) || undefined,
        });
        return seq;
    },
    error(who, streamId, err, cause = currentCause) {
        const seq = ++sequence;
        dispatch({
            version: 1, sequence: seq, nodeId: who.id, nodeLabel: who._label,
            kind: 'error', streamId, ts: Date.now(), cause, err: summarize(err),
            breakpoint: breakpoints.has(who.id) || undefined,
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
class TimeoutError extends Error {
    timeout;
    constructor(timeout) {
        super(`timeout after ${timeout}ms`);
        this.timeout = timeout;
    }
}

class Share extends LastSink {
    source;
    sinks = new Set();
    constructor(source) {
        super();
        this.source = source;
    }
    add(sink) {
        sink.defer(() => this.remove(sink));
        if (this.sinks.add(sink).size === 1) {
            this.reset();
            this.subscribe(this.source);
        }
    }
    remove(sink) {
        this.sinks.delete(sink);
        if (this.sinks.size === 0) {
            this.dispose();
        }
    }
    next(data) {
        this.sinks.forEach((s) => s.next(data));
    }
    complete() {
        this.sinks.forEach((s) => s.complete());
        this.sinks.clear();
    }
    error(err) {
        this.sinks.forEach((s) => s.error(err));
        this.sinks.clear();
    }
}
function share() {
    return (source) => {
        const share = new Share(source);
        if (source instanceof Inspect) {
            const ob = create((observer) => {
                share.add(observer);
            }, "share", arguments);
            share.sourceId = ob.id;
            ob.source = source;
            Events.pipe(ob);
            return ob;
        }
        return create(share.add.bind(share), "share", arguments);
    };
}
function merge(...sources) {
    return create((sink) => {
        const merge = new Sink(sink);
        let nLife = sources.length;
        merge.complete = () => {
            if (--nLife === 0) {
                sink.complete();
            }
        };
        sources.forEach(merge.bindSubscribe);
    }, "merge", arguments);
}
function race(...sources) {
    return create((sink) => {
        const sinks = new Map();
        sources.forEach((source) => {
            const r = new Sink(sink);
            sinks.set(source, r);
            r.complete = () => {
                sinks.delete(source);
                if (sinks.size === 0) { //特殊情况：所有流都没有数据
                    sink.complete();
                }
                else {
                    r.dispose();
                }
            };
            r.next = (data) => {
                sinks.delete(source); //先排除自己，防止自己调用dispose
                sinks.forEach((s) => s.dispose()); //其他所有流全部取消订阅
                r.resetNext();
                r.resetComplete();
                r.next(data);
            };
        });
        sources.forEach((source) => sinks.get(source).subscribe(source));
    }, "race", arguments);
}
function concat(...sources) {
    return create(sink => {
        let pos = 0;
        const len = sources.length;
        const s = new Sink(sink);
        s.complete = () => {
            if (pos < len && !s.disposed) {
                s.doDefer();
                s.subscribe(sources[pos++]);
            }
            else
                sink.complete();
        };
        s.complete();
    }, "concat", arguments);
}
function shareReplay(bufferSize) {
    return (source) => {
        const share = new Share(source);
        const buffer = [];
        share.next = function (data) {
            buffer.push(data);
            if (buffer.length > bufferSize) {
                buffer.shift();
            }
            this.sinks.forEach((s) => s.next(data));
        };
        return create(sink => {
            sink.defer(() => share.remove(sink));
            buffer.forEach((cache) => sink.next(cache));
            share.add(sink);
        }, "shareReplay", arguments);
    };
}
function iif(condition, trueS, falseS) {
    return create((sink) => condition() ? trueS(sink) : falseS(sink), "iif", arguments);
}
function combineLatest(...sources) {
    return create((sink) => {
        const nTotal = sources.length;
        let nRun = nTotal; //剩余未发出事件的事件流数量
        let nLife = nTotal; //剩余未完成的事件流数量
        const array = new Array(nTotal);
        const onComplete = () => {
            if (--nLife === 0)
                sink.complete();
        };
        const s = (source, i) => {
            const ss = new Sink(sink);
            ss.next = data => {
                nRun--;
                ss.next = data => {
                    array[i] = data;
                    if (nRun === 0)
                        sink.next(array);
                };
                ss.next(data);
            };
            ss.complete = onComplete;
            ss.subscribe(source);
        };
        sources.forEach(s);
    }, "combineLatest", arguments);
}
function zip(...sources) {
    return create((sink) => {
        const nTotal = sources.length;
        let nLife = nTotal; //剩余未完成的事件流数量
        const array = new Array(nTotal);
        const onComplete = () => {
            if (--nLife === 0)
                sink.complete();
        };
        const s = (source, i) => {
            const ss = new Sink(sink);
            const buffer = [];
            array[i] = buffer;
            ss.next = data => {
                buffer.push(data);
                if (array.every(x => x.length)) {
                    sink.next(array.map(x => x.shift()));
                }
            };
            ss.complete = onComplete;
            ss.subscribe(source);
        };
        sources.forEach(s);
    }, "zip", arguments);
}
function startWith(...xs) {
    return (inputSource) => create((sink, pos = 0, l = xs.length) => {
        while (pos < l && !sink.disposed) {
            sink.next(xs[pos++]);
        }
        sink.disposed || sink.subscribe(inputSource);
    }, "startWith", arguments);
}
class WithLatestFrom extends Sink {
    buffer;
    constructor(sink, ...sources) {
        super(sink);
        const s = new Sink(this.sink);
        s.next = (data) => (this.buffer = data);
        s.complete = nothing;
        s.subscribe(combineLatest(...sources));
    }
    next(data) {
        if (this.buffer) {
            this.sink.next([data, ...this.buffer]);
        }
    }
}
const withLatestFrom = deliver(WithLatestFrom, "withLatestFrom");
class BufferCount extends Sink {
    bufferSize;
    startBufferEvery;
    buffer = [];
    buffers;
    count = 0;
    constructor(sink, bufferSize, startBufferEvery) {
        super(sink);
        this.bufferSize = bufferSize;
        this.startBufferEvery = startBufferEvery;
        if (this.startBufferEvery) {
            this.buffers = [[]];
        }
    }
    next(data) {
        if (this.startBufferEvery) {
            if (this.count++ === this.startBufferEvery) {
                this.buffers.push([]);
                this.count = 1;
            }
            this.buffers.forEach((buffer) => {
                buffer.push(data);
            });
            if (this.buffers[0].length === this.bufferSize) {
                this.sink.next(this.buffers.shift());
            }
        }
        else {
            this.buffer.push(data);
            if (this.buffer.length === this.bufferSize) {
                this.sink.next(this.buffer);
                this.buffer = [];
            }
        }
    }
    complete() {
        if (this.buffer.length) {
            this.sink.next(this.buffer);
        }
        else if (this.buffers.length) {
            this.buffers.forEach((buffer) => this.sink.next(buffer));
        }
        super.complete();
    }
}
const bufferCount = deliver(BufferCount, "bufferCount");
// export function operator<T, R, ARG extends unknown[]>(f: (...args: [ISink<R>, ...ARG]) => ISink<T>) {
//   return (...args: ARG): (Operator<T, R>) => source => sink => f(sink, ...args).subscribe(source);
// }
class Buffer extends Sink {
    buffer = [];
    constructor(sink, closingNotifier) {
        super(sink);
        const s = new Sink(sink);
        s.next = (_data) => {
            sink.next(this.buffer);
            this.buffer = [];
        };
        s.complete = nothing;
        s.subscribe(closingNotifier);
    }
    next(data) {
        this.buffer.push(data);
    }
    complete() {
        if (this.buffer.length) {
            this.sink.next(this.buffer);
        }
        super.complete();
    }
}
const buffer = deliver(Buffer, "buffer");

function subject(source) {
    const args = arguments;
    const observable = share()(create((sink) => {
        observable.next = (data) => sink.next(data);
        observable.complete = () => sink.complete();
        observable.error = (err) => sink.error(err);
        source && sink.subscribe(source);
    }, "subject", args));
    observable.next = nothing;
    observable.complete = nothing;
    observable.error = nothing;
    return observable;
}
function defer(f) {
    return create(sink => sink.subscribe(f()), "defer", arguments);
}
// 不同的调度器实现
const schedulers = {
    // 使用 Promise.resolve().then() - 微任务队列，性能最佳
    promise: (callback) => {
        Promise.resolve().then(callback);
    },
    // 使用 setImmediate - Node.js 环境
    setImmediate: typeof setImmediate !== 'undefined'
        ? (callback) => setImmediate(callback)
        : null,
    // 使用 setTimeout - 兼容性最好的回退方案
    setTimeout: (callback) => setTimeout(callback, 0)
};
// 创建一个高性能的异步调度器，根据环境选择最佳方法
const createAsapScheduler = () => {
    // 优先使用 Promise.resolve().then() - 使用微任务队列，性能最佳
    if (typeof Promise !== 'undefined') {
        return schedulers.promise;
    }
    // 检查是否支持 setImmediate (Node.js 或 IE)
    if (schedulers.setImmediate) {
        return schedulers.setImmediate;
    }
    // 回退到 setTimeout
    return schedulers.setTimeout;
};
// 创建全局调度器实例
let scheduler = createAsapScheduler();
// 导出可配置的 asap 函数
const asap = (f) => (sink) => {
    scheduler(() => f(sink));
};
// 调度器配置函数，允许用户自定义调度方法
const setAsapScheduler = (schedulerType) => {
    if (typeof schedulerType === 'function') {
        // 自定义调度器函数
        scheduler = schedulerType;
    }
    else if (schedulers[schedulerType]) {
        // 预定义的调度器类型
        scheduler = schedulers[schedulerType];
    }
};
const _fromArray = (data) => asap((sink) => {
    for (let i = 0; !sink.disposed && i < data.length; i++) {
        sink.next(data[i]);
    }
    sink.complete();
});
function of(...data) {
    return create(_fromArray(data), "of", arguments);
}
function fromArray(data) {
    return create(_fromArray(data), "fromArray", arguments);
}
function interval(period) {
    return create((sink) => {
        let i = 0;
        const id = setInterval(() => sink.next(i++), period);
        sink.defer(() => { clearInterval(id); });
        return "interval";
    }, "interval", arguments);
}
function timer(delay, period) {
    return create((sink) => {
        let i = 0;
        const id = setTimeout(() => {
            sink.removeDefer(deferF);
            sink.next(i++);
            // Only create interval if period is explicitly provided and >= 10ms
            // This prevents accidental interval creation when timer is called with extra parameters (like index values 0,1,2,3...)
            if (period) {
                const id = setInterval(() => sink.next(i++), period);
                sink.defer(() => { clearInterval(id); });
            }
            else {
                sink.complete();
            }
        }, delay);
        const deferF = () => clearTimeout(id);
        sink.defer(deferF);
    }, "timer", arguments);
}
function _fromEventPattern(add, remove) {
    return (sink) => {
        const n = (d) => sink.next(d);
        sink.defer(() => remove(n));
        add(n);
    };
}
function fromEventPattern(add, remove) {
    return create(_fromEventPattern(add, remove), "fromEventPattern", arguments);
}
function fromEvent(target, name) {
    if ("on" in target && "off" in target) {
        return create(_fromEventPattern((h) => target.on(name, h), (h) => target.off(name, h)), "fromEvent", arguments);
    }
    else if ("addListener" in target && "removeListener" in target) {
        return create(_fromEventPattern((h) => target.addListener(name, h), (h) => target.removeListener(name, h)), "fromEvent", arguments);
    }
    else if ("addEventListener" in target) {
        return create(_fromEventPattern((h) => target.addEventListener(name, h), (h) => target.removeEventListener(name, h)), "fromEvent", arguments);
    }
    else
        throw 'target is not a EventDispachter';
}
function fromPromise(promise) {
    return create((sink) => {
        promise.then((data) => {
            sink.next(data);
            sink.complete();
        }, sink.error.bind(sink));
    }, "fromPromise", arguments);
}
function fromFetch(input, init) {
    return create(defer(() => fromPromise(fetch(input, init))), "fromFetch", arguments);
}
function fromIterable(source) {
    return create(asap((sink) => {
        try {
            for (const data of source) {
                if (sink.disposed)
                    return;
                sink.next(data);
            }
            sink.complete();
        }
        catch (err) {
            sink.error(err);
        }
    }), "fromIterable", arguments);
}
function fromReader(source) {
    const read = async (sink) => {
        try {
            if (sink.disposed)
                return;
            const { done, value } = await source.read();
            if (done) {
                sink.complete();
                return;
            }
            else {
                sink.next(value);
                read(sink);
            }
        }
        catch (err) {
            sink.error(err);
        }
    };
    return create((sink) => {
        read(sink);
    }, "fromReader", arguments);
}
function fromReadableStream(source) {
    return create((sink) => {
        const controller = new AbortController();
        const signal = controller.signal;
        //@ts-ignore
        sink.defer(() => controller.abort('cancelled'));
        source.pipeTo(new WritableStream({
            write(chunk) {
                sink.next(chunk);
            },
            close() {
                sink.complete();
            },
            abort(err) {
                sink.error(err);
            }
        }), { signal }).then(() => sink.complete(), (err) => sink.error(err));
    }, "fromReadableStream", arguments);
}
function fromAnimationFrame() {
    return create((sink) => {
        let id = requestAnimationFrame(function next(t) {
            if (!sink.disposed) {
                sink.next(t);
                id = requestAnimationFrame(next);
            }
        });
        sink.defer(() => cancelAnimationFrame(id));
    }, "fromAnimationFrame", arguments);
}
function range(start, count) {
    return create((sink, pos = start, end = count + start) => {
        while (pos < end && !sink.disposed)
            sink.next(pos++);
        sink.complete();
        return "range";
    }, "range", arguments);
}
function bindCallback(call, thisArg, ...args) {
    return create((sink) => {
        const inArgs = args.concat((res) => (sink.next(res), sink.complete()));
        call.apply(thisArg, inArgs);
    }, "bindCallback", arguments);
}
function bindNodeCallback(call, thisArg, ...args) {
    return create((sink) => {
        const inArgs = args.concat((err, res) => err ? (sink.error(err)) : (sink.next(res), sink.complete()));
        call.apply(thisArg, inArgs);
    }, "bindNodeCallback", arguments);
}
function never() {
    return create(() => { }, "never", arguments);
}
function throwError(e) {
    return create(sink => sink.error(e), "throwError", arguments);
}
function empty() {
    return create(sink => sink.complete(), "empty", arguments);
}

class Reduce extends Sink {
    f;
    acc;
    constructor(sink, f, seed) {
        super(sink);
        this.f = f;
        const accSet = () => {
            this.sink.next(this.acc);
            this.sink.complete();
        };
        if (typeof seed === "undefined") {
            this.next = (d) => {
                this.acc = d;
                this.complete = accSet;
                this.resetNext();
            };
        }
        else {
            this.acc = seed;
            this.complete = accSet;
        }
    }
    next(data) {
        this.acc = this.f(this.acc, data);
    }
}
const reduce = deliver(Reduce, "reduce");
const count = (f) => deliver(Reduce, "count")((aac, c) => (f(c) ? aac + 1 : aac), 0);
const max = () => deliver(Reduce, "max")(Math.max);
const min = () => deliver(Reduce, "min")(Math.min);
const sum = () => deliver(Reduce, "sum")((aac, c) => aac + c, 0);

class Filter extends Sink {
    filter;
    thisArg;
    constructor(sink, filter, thisArg) {
        super(sink);
        this.filter = filter;
        this.thisArg = thisArg;
    }
    next(data) {
        if (this.filter.call(this.thisArg, data)) {
            this.sink.next(data);
        }
    }
}
const filter = deliver(Filter, "filter");
class Distinct extends Sink {
    keySelector;
    hasPrevious = false;
    previous;
    constructor(sink, keySelector) {
        super(sink);
        this.keySelector = keySelector;
    }
    next(data) {
        const key = this.keySelector(data);
        if (!this.hasPrevious || key !== this.previous) {
            this.hasPrevious = true;
            this.previous = key;
            this.sink.next(data);
        }
    }
}
/**
 * Suppresses consecutive values with the same key.
 *
 * This matches Rill's `distinct` operator semantics. A new comparison state is
 * created for every subscription.
 */
function distinct(keySelector = (data => data)) {
    return deliver(Distinct, "distinct")(keySelector);
}
class Ignore extends Sink {
    next(_data) { }
}
const ignoreElements = deliver(Ignore, "ignoreElements");
class Take extends Sink {
    count;
    constructor(sink, count) {
        super(sink);
        this.count = count;
    }
    next(data) {
        this.sink.next(data);
        if (--this.count === 0) {
            this.doDefer();
            this.complete();
        }
    }
}
const take = deliver(Take, "take");
class TakeUntil extends Sink {
    constructor(sink, control) {
        super(sink);
        const _takeUntil = new Sink(sink);
        _takeUntil.next = () => {
            _takeUntil.doDefer();
            sink.complete();
        };
        _takeUntil.complete = dispose;
        _takeUntil.subscribe(control);
    }
}
const takeUntil = deliver(TakeUntil, "takeUntil");
class TakeWhile extends Sink {
    f;
    constructor(sink, f) {
        super(sink);
        this.f = f;
    }
    next(data) {
        if (this.f(data)) {
            this.sink.next(data);
        }
        else {
            this.doDefer();
            this.complete();
        }
    }
}
const takeWhile = deliver(TakeWhile, "takeWhile");
const takeLast = (count) => reduce((buffer, d) => {
    buffer.push(d);
    if (buffer.length > count)
        buffer.shift();
    return buffer;
}, []);
class Skip extends Sink {
    count;
    constructor(sink, count) {
        super(sink);
        this.count = count;
    }
    next(_data) {
        if (--this.count === 0) {
            this.next = super.next;
        }
    }
}
const skip = deliver(Skip, "skip");
class SkipUntil extends Sink {
    constructor(sink, control) {
        super(sink);
        sink.next = nothing;
        const _skipUntil = new Sink(sink);
        _skipUntil.next = () => {
            _skipUntil.doDefer();
            sink.resetNext();
        };
        _skipUntil.complete = dispose;
        _skipUntil.subscribe(control);
    }
}
const skipUntil = deliver(SkipUntil, "skipUntil");
class SkipWhile extends Sink {
    f;
    constructor(sink, f) {
        super(sink);
        this.f = f;
    }
    next(data) {
        if (!this.f(data)) {
            this.next = super.next;
            this.next(data);
        }
    }
}
const skipWhile = deliver(SkipWhile, "skipWhile");
const defaultThrottleConfig = {
    leading: true,
    trailing: false,
};
class _Throttle extends Sink {
    durationSelector;
    trailing;
    last;
    constructor(sink, durationSelector, trailing) {
        super(sink);
        this.durationSelector = durationSelector;
        this.trailing = trailing;
    }
    cacheValue(value) {
        this.last = value;
        if (this.disposed)
            this.throttle(value);
    }
    send(data) {
        this.sink.next(data);
        this.throttle(data);
    }
    throttle(data) {
        this.reset();
        this.subscribe(this.durationSelector(data));
    }
    next() {
        this.complete();
    }
    complete() {
        this.dispose();
        if (this.trailing) {
            this.send(this.last);
        }
    }
}
class Throttle extends Sink {
    durationSelector;
    config;
    _throttle;
    constructor(sink, durationSelector, config = defaultThrottleConfig) {
        super(sink);
        this.durationSelector = durationSelector;
        this.config = config;
        this._throttle = new _Throttle(this.sink, this.durationSelector, this.config.trailing);
        this._throttle.dispose();
    }
    next(data) {
        if (this._throttle.disposed && this.config.leading) {
            this._throttle.send(data);
        }
        else {
            this._throttle.cacheValue(data);
        }
    }
    complete() {
        this._throttle.throttle = nothing; //最后不再启动节流
        this._throttle.complete();
        super.complete();
    }
}
const throttle = deliver(Throttle, "throttle");
const defaultAuditConfig = {
    leading: false,
    trailing: true,
};
const audit = (durationSelector) => deliver(Throttle, "audit")(durationSelector, defaultAuditConfig);
class _Debounce extends Sink {
    last;
    next() {
        this.complete();
    }
    complete() {
        this.dispose();
        this.sink.next(this.last);
    }
}
class Debounce extends Sink {
    durationSelector;
    _debounce = new _Debounce(this.sink);
    constructor(sink, durationSelector) {
        super(sink);
        this.durationSelector = durationSelector;
        this._debounce.dispose();
    }
    next(data) {
        this._debounce.dispose();
        this._debounce.reset();
        this._debounce.last = data;
        this._debounce.subscribe(this.durationSelector(data));
    }
    complete() {
        this._debounce.complete();
        super.complete();
    }
}
const debounce = deliver(Debounce, "debounce");
const debounceTime = (period) => deliver(Debounce, "debounceTime")((_d) => timer(period));
class ElementAt extends Sink {
    count;
    defaultValue;
    constructor(sink, count, defaultValue) {
        super(sink);
        this.count = count;
        this.defaultValue = defaultValue;
    }
    next(data) {
        if (this.count-- === 0) {
            this.defaultValue = data;
            this.doDefer();
            this.complete();
        }
    }
    complete() {
        if (this.defaultValue === void 0) {
            this.error(new Error('not enough elements in sequence'));
            return;
        }
        else
            this.sink.next(this.defaultValue);
        super.complete();
    }
}
const elementAt = deliver(ElementAt, "elementAt");
const find = (f) => (source) => take(1)(skipWhile((d) => !f(d))(source));
class FindIndex extends Sink {
    f;
    i = 0;
    constructor(sink, f) {
        super(sink);
        this.f = f;
    }
    next(data) {
        if (this.f(data)) {
            this.sink.next(this.i++);
            this.doDefer();
            this.complete();
        }
        else {
            ++this.i;
        }
    }
}
const findIndex = deliver(FindIndex, "findIndex");
class First extends Sink {
    f;
    defaultValue;
    index = 0;
    constructor(sink, f, defaultValue) {
        super(sink);
        this.f = f;
        this.defaultValue = defaultValue;
    }
    next(data) {
        if (!this.f || this.f(data, this.index++)) {
            this.defaultValue = data;
            this.doDefer();
            this.complete();
        }
    }
    complete() {
        if (this.defaultValue === void 0) {
            this.error(new Error('no elements in sequence'));
            return;
        }
        else
            this.sink.next(this.defaultValue);
        super.complete();
    }
}
const first = deliver(First, "first");
class Last extends Sink {
    f;
    defaultValue;
    index = 0;
    constructor(sink, f, defaultValue) {
        super(sink);
        this.f = f;
        this.defaultValue = defaultValue;
    }
    next(data) {
        if (!this.f || this.f(data, this.index++)) {
            this.defaultValue = data;
        }
    }
    complete() {
        if (this.defaultValue === void 0) {
            this.error(new Error('no elements in sequence'));
            return;
        }
        else
            this.sink.next(this.defaultValue);
        super.complete();
    }
}
const last = deliver(Last, 'last');
class Every extends Sink {
    predicate;
    result;
    index = 0;
    constructor(sink, predicate) {
        super(sink);
        this.predicate = predicate;
    }
    next(data) {
        if (!this.predicate(data, this.index++)) {
            this.result = false;
            this.doDefer();
            this.complete();
        }
        else {
            this.result = true;
        }
    }
    complete() {
        if (this.result === void 0) {
            this.error(new Error('no elements in sequence'));
            return;
        }
        else
            this.sink.next(this.result);
        super.complete();
    }
}
const every = deliver(Every, "every");

class Scan extends Sink {
    f;
    acc;
    constructor(sink, f, seed) {
        super(sink);
        this.f = f;
        if (typeof seed === "undefined") {
            this.next = (d) => {
                this.acc = d;
                this.resetNext();
                this.sink.next(this.acc);
            };
        }
        else {
            this.acc = seed;
        }
    }
    next(data) {
        this.sink.next(this.acc = this.f(this.acc, data));
    }
}
const scan = deliver(Scan, "scan");
class Pairwise extends Sink {
    hasLast = false;
    last;
    next(data) {
        if (this.hasLast) {
            this.sink.next([this.last, data]);
        }
        else {
            this.hasLast = true;
        }
        this.last = data;
    }
}
const pairwise = deliver(Pairwise, "pairwise");
class MapObserver extends Sink {
    mapper;
    thisArg;
    constructor(sink, mapper, thisArg) {
        super(sink);
        this.mapper = mapper;
        this.thisArg = thisArg;
    }
    next(data) {
        super.next(this.mapper.call(this.thisArg, data));
    }
}
const map = deliver(MapObserver, "map");
const mapTo = (target) => deliver(MapObserver, "mapTo")((_x) => target);
class InnerSink extends Sink {
    data;
    context;
    constructor(sink, data, context) {
        super(sink);
        this.data = data;
        this.context = context;
    }
    next(data) {
        const combineResults = this.context.combineResults;
        if (combineResults) {
            this.sink.next(combineResults(this.data, data));
        }
        else {
            this.sink.next(data);
        }
    }
    // 如果complete先于context的complete触发，则激活原始的context的complete
    tryComplete() {
        this.context.resetComplete();
        this.dispose();
    }
}
class Maps extends Sink {
    makeSource;
    combineResults;
    currentSink;
    index = 0;
    constructor(sink, makeSource, combineResults) {
        super(sink);
        this.makeSource = makeSource;
        this.combineResults = combineResults;
    }
    subInner(data, c) {
        const sink = this.currentSink = new c(this.sink, data, this);
        // Only override complete if it hasn't been overridden by a subclass
        if (this.complete === Maps.prototype.complete) {
            this.complete = this.tryComplete;
        }
        sink.complete = sink.tryComplete;
        sink.subscribe(this.makeSource(data, this.index++));
    }
    // Default complete method that can be overridden by subclasses
    complete() {
        // Default behavior: just call the sink's complete
        this.sink.complete();
    }
    // 如果complete先于inner的complete触发，则不传播complete
    tryComplete() {
        // 如果tryComplete被调用，说明currentSink已经存在
        this.currentSink.resetComplete();
        this.dispose();
    }
}
class _SwitchMap extends InnerSink {
}
class SwitchMap extends Maps {
    next(data) {
        this.subInner(data, _SwitchMap);
        this.next = (data) => {
            this.currentSink.dispose();
            this.subInner(data, _SwitchMap);
        };
    }
}
const switchMap = deliver(SwitchMap, "switchMap");
function makeMapTo(f) {
    return (innerSource, combineResults) => f(() => innerSource, combineResults);
}
const switchMapTo = makeMapTo(deliver(SwitchMap, "switchMapTo"));
class _ConcatMap extends InnerSink {
    tryComplete() {
        this.dispose();
        if (this.context.sources.length) {
            this.context.subNext();
        }
        else {
            this.context.resetNext();
            this.context.resetComplete();
        }
    }
}
class ConcatMap extends Maps {
    sources = [];
    next2 = this.sources.push.bind(this.sources);
    next(data) {
        this.next2(data);
        this.subNext();
    }
    subNext() {
        this.next = this.next2; //后续直接push，不触发subNext
        this.subInner(this.sources.shift(), _ConcatMap);
        if (this.disposed && this.sources.length === 0) {
            // 最后一个innerSink，需要激活其真实的complete
            this.currentSink.resetComplete();
        }
    }
    tryComplete() {
        if (this.sources.length === 0)
            // 最后一个innerSink，需要激活其真实的complete
            this.currentSink.resetComplete();
        this.dispose();
    }
}
const concatMap = deliver(ConcatMap, "concatMap");
const concatMapTo = makeMapTo(deliver(ConcatMap, "concatMapTo"));
class _MergeMap extends InnerSink {
    tryComplete() {
        this.context.inners.delete(this);
        super.dispose();
        if (this.context.inners.size === 0)
            this.context.resetComplete();
    }
}
// type __Maps<C> = C extends MapContext<infer T, infer U, infer R> ? C : never;
// type _Maps<C> = C extends InnerSink<infer T, infer U, infer R, infer> ? Maps<T, U, R, C> : never;
class MergeMap extends Maps {
    inners = new Set();
    next(data) {
        this.subInner(data, _MergeMap);
        this.inners.add(this.currentSink);
    }
    tryComplete() {
        // 最后一个innerSink，需要激活其真实的complete
        if (this.inners.size === 1)
            this.inners.forEach(s => s.resetComplete());
        else
            this.dispose();
    }
}
const mergeMap = deliver(MergeMap, "mergeMap");
const mergeMapTo = makeMapTo(deliver(MergeMap, "mergeMapTo"));
class _ExhaustMap extends InnerSink {
    dispose() {
        this.context.resetNext();
        super.dispose();
    }
}
class ExhaustMap extends Maps {
    next(data) {
        this.next = nothing;
        this.subInner(data, _ExhaustMap);
    }
}
const exhaustMap = deliver(ExhaustMap, "exhaustMap");
const exhaustMapTo = makeMapTo(deliver(ExhaustMap, "exhaustMapTo"));
class GroupBy extends Sink {
    f;
    groups = new Map();
    constructor(sink, f) {
        super(sink);
        this.f = f;
    }
    next(data) {
        const key = this.f(data);
        let group = this.groups.get(key);
        if (typeof group === 'undefined') {
            group = subject();
            group.key = key;
            this.groups.set(key, group);
            super.next(group);
        }
        group.next(data);
    }
    complete() {
        this.groups.forEach((group) => group.complete());
        super.complete();
    }
    error(err) {
        this.groups.forEach((group) => group.error(err));
        super.error(err);
    }
}
const groupBy = deliver(GroupBy, "groupBy");
class TimeInterval extends Sink {
    start = new Date();
    next(value) {
        this.sink.next({ value, interval: Number(new Date()) - Number(this.start) });
        this.start = new Date();
    }
}
const timeInterval = deliver(TimeInterval, "timeInterval");
class BufferTime extends Sink {
    miniseconds;
    buffer = [];
    id;
    constructor(sink, miniseconds) {
        super(sink);
        this.miniseconds = miniseconds;
        this.id = setInterval(() => {
            this.sink.next(this.buffer.concat());
            this.buffer.length = 0;
        }, this.miniseconds);
    }
    next(data) {
        this.buffer.push(data);
    }
    complete() {
        this.sink.next(this.buffer);
        super.complete();
    }
    dispose() {
        clearInterval(this.id);
        super.dispose();
    }
}
const bufferTime = deliver(BufferTime, "bufferTime");
class Delay extends Sink {
    delayTime;
    buffer = [];
    timeoutId;
    constructor(sink, delay) {
        super(sink);
        this.delayTime = delay;
    }
    dispose() {
        clearTimeout(this.timeoutId);
        super.dispose();
    }
    delay(delay) {
        this.timeoutId = setTimeout(() => {
            const d = this.buffer.shift();
            if (d) {
                const { time: lastTime, data } = d;
                super.next(data);
                if (this.buffer.length) {
                    this.delay(Number(this.buffer[0].time) - Number(lastTime));
                }
            }
        }, delay);
    }
    next(data) {
        if (!this.buffer.length) {
            this.delay(this.delayTime);
        }
        this.buffer.push({ time: new Date(), data });
    }
    complete() {
        this.timeoutId = setTimeout(() => super.complete(), this.delayTime);
    }
}
const delay = deliver(Delay, "delay");
class CatchError extends Sink {
    selector;
    constructor(sink, selector) {
        super(sink);
        this.selector = selector;
    }
    error(err) {
        this.dispose();
        this.selector(err)(this.sink);
    }
}
const catchError = deliver(CatchError, "catchError");
class _Expand extends InnerSink {
    tryComplete() {
        const deleted = this.context.inners.delete(this);
        super.dispose();
        // 只有当成功删除时才检查完成，避免重复检查
        if (deleted) {
            this.context.checkComplete();
        }
    }
    next(data) {
        // 发送数据到输出流
        this.sink.next(data);
        // 递归处理：将新数据通过 project 函数产生新的 Observable 并订阅
        this.context.expandValue(data);
    }
}
class Expand extends Maps {
    project;
    inners = new Set();
    sourceCompleted = false;
    constructor(sink, project) {
        super(sink, project);
        this.project = project;
    }
    next(data) {
        // 发送原始数据到输出流
        this.sink.next(data);
        // 展开数据（递归处理）
        this.expandValue(data);
    }
    expandValue(data) {
        // 创建内部 sink 但不立即订阅
        const innerSink = new _Expand(this.sink, data, this);
        this.currentSink = innerSink;
        this.complete = this.tryComplete;
        innerSink.complete = innerSink.tryComplete;
        // 先添加到 inners，再订阅，避免时序问题
        this.inners.add(innerSink);
        // 现在订阅 Observable
        innerSink.subscribe(this.makeSource(data, this.index++));
    }
    complete() {
        this.sourceCompleted = true;
        this.checkComplete();
    }
    checkComplete() {
        // 只有当源 Observable 完成且所有内部 Observable 都完成时才完成
        if (this.sourceCompleted && this.inners.size === 0) {
            this.resetComplete();
            super.complete();
        }
    }
    tryComplete() {
        // 当源 Observable 完成时，标记源已完成并检查是否可以完成
        this.sourceCompleted = true;
        this.checkComplete();
    }
}
const expand = deliver(Expand, "expand");

const toPromise = () => (source) => new Promise((resolve, reject) => {
    let value;
    new Subscribe(source, (d) => (value = d), reject, () => resolve(value));
});
const toReadableStream = () => (source) => {
    let subscriber;
    return new ReadableStream({
        start(controller) {
            subscriber = new Subscribe(source, controller.enqueue.bind(controller), controller.error.bind(controller), controller.close.bind(controller));
        },
        cancel() {
            subscriber.dispose();
        }
    });
};
// //SUBSCRIBER
const subscribe = (n = nothing, e = nothing, c = nothing) => (source) => new Subscribe(source, n, e, c);
// // UTILITY
class Tap extends Sink {
    constructor(sink, ob) {
        super(sink);
        if (ob instanceof Function) {
            this.next = (data) => { ob(data); sink.next(data); };
        }
        else {
            if (ob.next)
                this.next = (data) => { ob.next(data); sink.next(data); };
            if (ob.complete)
                this.complete = () => { ob.complete(); sink.complete(); };
            if (ob.error)
                this.error = (err) => { ob.error(err); sink.error(err); };
        }
    }
}
const tap = deliver(Tap, "tap");
class Timeout extends Sink {
    timeout;
    id;
    constructor(sink, timeout) {
        super(sink);
        this.timeout = timeout;
        this.id = setTimeout(() => this.error(new TimeoutError(this.timeout)), this.timeout);
    }
    next(data) {
        super.next(data);
        clearTimeout(this.id);
        this.next = super.next;
    }
    dispose() {
        clearTimeout(this.id);
        super.dispose();
    }
}
const timeout = deliver(Timeout, "timeout");
const retry = (count = Infinity) => (source) => {
    if (source instanceof Inspect) {
        const ob = create((observer) => {
            let remain = count;
            const deliverSink = new Sink(observer);
            deliverSink.error = (err) => {
                if (remain-- > 0) {
                    deliverSink.subscribe(source);
                }
                else {
                    observer.error(err);
                }
            };
            deliverSink.sourceId = ob.id;
            deliverSink.subscribe(source);
        }, 'retry', [count]);
        ob.source = source;
        Events.pipe(ob);
        return ob;
    }
    else {
        return (observer) => {
            let remain = count;
            const deliverSink = new Sink(observer);
            deliverSink.error = (err) => {
                if (remain-- > 0) {
                    source(deliverSink);
                }
                else {
                    observer.error(err);
                }
            };
            source(deliverSink);
        };
    }
};

export { Events, Inspect, LastSink, Sink, Subscribe, TimeoutError, __testInstallBackend, audit, bindCallback, bindNodeCallback, buffer, bufferCount, bufferTime, call, catchError, combineLatest, concat, concatMap, concatMapTo, count, create, debounce, debounceTime, defer, delay, deliver, dispose, distinct, elementAt, empty, every, exhaustMap, exhaustMapTo, expand, filter, find, findIndex, first, fromAnimationFrame, fromArray, fromEvent, fromEventPattern, fromFetch, fromIterable, fromPromise, fromReadableStream, fromReader, groupBy, handlePanelCommand, identity, ignoreElements, iif, interval, last, map, mapTo, max, merge, mergeMap, mergeMapTo, min, never, nothing, of, pairwise, pipe, race, range, reduce, retry, scan, setAsapScheduler, share, shareReplay, skip, skipUntil, skipWhile, startWith, subject, subscribe, sum, summarize, switchMap, switchMapTo, take, takeLast, takeUntil, takeWhile, tap, throttle, throwError, timeInterval, timeout, timer, toPromise, toReadableStream, withLatestFrom, zip };
//# sourceMappingURL=index.mjs.map
