import { Envelope, summarize } from './protocol';
export function nothing(...args: any[]): any { }
export const call = (f: Function) => f();
export const identity = <T>(x: T): T => x;
export function dispose<T>(this: ISink<T>) {
  this.dispose();
}
// Compile-time opt-out: defining `__FASTRX_NO_DEVTOOLS__` (e.g. via a bundler
// define) removes all devtools instrumentation via dead-code elimination.
// @ts-ignore
const DEVTOOLS_ENABLED: boolean = typeof __FASTRX_NO_DEVTOOLS__ === 'undefined';
export type ObservableInputTuple<T> = {
  [K in keyof T]: Observable<T[K]>;
};
type ObservedValueOf<O> = O extends Observable<infer T> ? T : never;
export type EventHandler<T> = (event: T) => void;
type EventMethod<N, T> = (name: N, handler: EventHandler<T>) => void;
export type EventDispachter<N, T> = {
  on: EventMethod<N, T>;
  off: EventMethod<N, T>;
} | {
  addListener: EventMethod<N, T>;
  removeListener: EventMethod<N, T>;
} | {
  addEventListener: EventMethod<N, T>;
  removeEventListener: EventMethod<N, T>;
};
export interface Observer<T> {
  subscribe(source: Observable<T>): void;
  next(data: T): void;
  complete(): void;
  error(err: any): void;
  dispose(): void;
}
let obids = 1;
// function pp(this: Observable<unknown>, ...args: [...Operator<unknown>[], Operator<unknown>]) {
//   return pipe(this, ...args);
// }
export class Inspect<T> extends Function {
  id!: string;
  name!: string;
  args!: IArguments;
  streamId!: number;
  source?: InspectObservable<unknown>;
  _label?: string;
  toString() {
    return `${this.name}(${this.args.length ? [...this.args].join(', ') : ""})`;
  }
  /** Attach a stable display label for the devtools panel. Does not change the node id. */
  label(name: string): this {
    this._label = name;
    return this;
  }
  // pipe(...args: [...Operator<unknown>[], Operator<unknown>]): Observable<unknown> {
  //   return pipe(this as unknown as Observable<T>, ...args);
  // }
  subscribe(sink: ISink<T>): ISink<T> {
    const ns = new NodeSink<T>(sink, this, this.streamId++);
    Events.subscribe({ id: this.id }, { nodeId: ns.sourceId, streamId: ns.id });
    this(ns);
    return ns;
  }
}

declare type Dispose = () => any;
export type Observable<T> = (sink: ISink<T>) => void;
export type InspectObservable<T> = Observable<T> & Inspect<T>;
export type Operator<T, R = T> = (source: Observable<T>) => Observable<R>;

export class LastSink<T> implements Observer<T> {
  sourceId!: string;
  defers = new Set<Dispose>();
  disposed = false;
  next(data: T) {
  }
  complete() {
    this.dispose();
  }
  error(err: any) {
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
  subscribe(source: Observable<T>) {
    if (source instanceof Inspect)
      source.subscribe(this);
    else
      source(this);
    return this;
  }
  get bindSubscribe() {
    return (source: Observable<T>) => this.subscribe(source);
  }
  doDefer() {
    this.defers.forEach(call);
    this.defers.clear();
  }
  defer(df: Dispose) {
    this.defers.add(df);
  }
  removeDefer(df: Dispose) {
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
export type ISink<T> = LastSink<T>;
export class Sink<T, R = T> extends LastSink<T> {
  constructor(public readonly sink: ISink<R>) {
    super();
    sink.defer(this.bindDispose);
  }
  next(data: T | R) {
    this.sink.next(data as R);
  }
  complete() {
    this.sink.complete();
  }
  error(err: any) {
    this.sink.error(err);
  }
}
export class Subscribe<T> extends LastSink<T> {
  then = nothing;
  constructor(source: Observable<T> | InspectObservable<T>, public _next = nothing, public _error = nothing, public _complete = nothing) {
    super();
    if (source instanceof Inspect) {
      const node: Node = { toString: () => 'subscribe', name: 'subscribe', id: '', source: source as unknown as Node };
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
      } else {
        this.next = data => {
          Events.next(node, 0, data);
          _next(data);
        };
      }
      if (_complete == nothing) {
        this._complete = () => Events.complete(node, 0);
      } else {
        this.complete = () => {
          this.dispose();
          Events.complete(node, 0);
          _complete();
        };
      }
      if (_error == nothing) {
        this._error = err => Events.error(node, 0, err);
      } else {
        this.error = err => {
          this.dispose();
          Events.error(node, 0, err);
          _error(err);
        };
      }
    } else {
      this.subscribe(source);
    }
  }
  next(data: T) {
    this._next(data);
  }
  complete() {
    this.dispose();
    this._complete();
  }
  error(err: any) {
    this.dispose();
    this._error(err);
  }
}
type Subscription<T, R = T> = Subscribe<T> | Promise<T> | Observable<R>;
//type Operators<T, S> = T extends [Operator<S, infer A>, ...infer R] ? R extends [(source: Observable<A>) => Subscribe<A> | Promise<A>] ? T : (R extends Operators<R, A> ? T : never) : never;
//export function pipe<S, LL, LLL extends Subscription<LL>, T extends [...Operators<T, S>, (source: Observable<LL>) => LLL]>(first: Observable<S>, ...arg: T): LLL;

/**
 * Why use function overloads instead of a generic recursive type?
 *
 * 1. Inference vs Validation: TypeScript infers argument types independently before validating them against the function signature.
 *    A recursive type (like PipeArgs) requires the type of the Nth argument to depend on the (N-1)th argument's return type.
 *    However, TS often infers 'unknown' or 'any' for intermediate operators during the initial pass, causing the recursive match to fail
 *    with confusing errors (e.g., "Type ... is not assignable to type 'never'").
 *
 * 2. Developer Experience: Overloads provide precise type inference for each step in the pipeline.
 *    If a type mismatch occurs (e.g., op2 expects string but op1 returns number), the error points exactly to the failing argument,
 *    rather than a generic error on the entire function call.
 *
 * 3. Performance: Deeply recursive types can be computationally expensive for the compiler. Overloads are straightforward and fast.
 *
 * This is the standard approach used by libraries like RxJS.
 */
export function pipe<T, L extends Subscription<T>>(first: Observable<T>, sub: (source: Observable<T>) => L): L;
export function pipe<T, T1, L extends Subscription<T1>>(first: Observable<T>, op1: Operator<T, T1>, sub: (source: Observable<T1>) => L): L;
export function pipe<T, T1, T2, L extends Subscription<T2>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, sub: (source: Observable<T2>) => L): L;
export function pipe<T, T1, T2, T3, L extends Subscription<T3>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, sub: (source: Observable<T3>) => L): L;
export function pipe<T, T1, T2, T3, T4, L extends Subscription<T4>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, op4: Operator<T3, T4>, sub: (source: Observable<T4>) => L): L;
export function pipe<T, T1, T2, T3, T4, T5, L extends Subscription<T5>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, op4: Operator<T3, T4>, op5: Operator<T4, T5>, sub: (source: Observable<T5>) => L): L;
export function pipe<T, T1, T2, T3, T4, T5, T6, L extends Subscription<T6>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, op4: Operator<T3, T4>, op5: Operator<T4, T5>, op6: Operator<T5, T6>, sub: (source: Observable<T6>) => L): L;
export function pipe<T, T1, T2, T3, T4, T5, T6, T7, L extends Subscription<T7>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, op4: Operator<T3, T4>, op5: Operator<T4, T5>, op6: Operator<T5, T6>, op7: Operator<T6, T7>, sub: (source: Observable<T7>) => L): L;
export function pipe<L extends Subscription<unknown>>(...cbs: [Observable<unknown>, ...any, (source: Observable<unknown>) => L]): L;
export function pipe<L extends Subscription<unknown>>(first: Observable<unknown>, ...cbs: [...any, (source: Observable<unknown>) => L]): L {
  return cbs.reduce((aac, c) => c(aac), first);
}
export function create<T>(ob: (sink: ISink<T>) => void, name: string, args: {
  [index: number]: any;
  length: number;
}): Observable<T> {
  if (DEVTOOLS_ENABLED) {
    const result = Object.defineProperties(Object.setPrototypeOf(ob, Inspect.prototype), {
      streamId: { value: 0, writable: true, configurable: true },
      name: { value: name, writable: true, configurable: true },
      args: { value: args, writable: true, configurable: true },
      id: { value: '', writable: true, configurable: true },
    }) as InspectObservable<T>;
    Events.create(result);
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (typeof arg === 'function') {
        if (arg instanceof Inspect) {
          Events.addSource(result, arg);
        } else {
        }
      }
    }
    return result;
  }
  return ob;
}
export function deliver<T, R, ARG extends any[]>(c: { new(sink: ISink<R>, ...args: ARG): ISink<T>; }, name: string) {
  return function (...args: ARG): (Operator<T, R>) {
    return source => {
      if (source instanceof Inspect) {
        const ob = create((observer) => {
          const deliverSink = new c(observer, ...args);
          deliverSink.sourceId = ob.id;
          deliverSink.subscribe(source);
        }, name, arguments) as InspectObservable<R>;
        ob.source = source;
        Events.pipe(ob);
        return ob;
      } else {
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
let currentCause: { nodeId: string; sequence: number } | undefined;
let port: any;
const ring: Envelope[] = [];
const RING_MAX = 500;

function dispatch(env: Envelope) {
  if (port) {
    try { port.postMessage(env); }
    catch { port = undefined; ring.push(env); if (ring.length > RING_MAX) ring.shift(); }
  } else {
    ring.push(env);
    if (ring.length > RING_MAX) ring.shift();
  }
}

function openPort(extId: string) {
  if (port) return;
  const rt = (globalThis as any).chrome?.runtime;
  if (!rt?.connect) return;
  try {
    const p = rt.connect(extId, { name: 'fastrx-backend' });
    p.onDisconnect.addListener(() => { port = undefined; });
    port = p;
    while (ring.length) p.postMessage(ring.shift()!);
  } catch {
    port = undefined;
  }
}

function closePort() {
  if (port) { try { port.disconnect(); } catch {} port = undefined; }
}

function tryOpen() {
  if (port) return;
  const extId = (globalThis as any).__fastrxExtId;
  if (extId) openPort(extId);
}

if (typeof window !== 'undefined') {
  const w = window as any;
  const currentId = w.__fastrxExtId;
  let storedId: any = currentId;
  try {
    Object.defineProperty(w, '__fastrxExtId', {
      configurable: true,
      get() { return storedId; },
      set(id: any) {
        storedId = id;
        if (id) tryOpen();
        else closePort();
      },
    });
  } catch { /* property non-configurable; fall back to direct check in tryOpen */ }
  if (storedId) tryOpen();
}

/** @internal Test seam: install a mock backend that receives all emitted
 *  envelopes (drains the ring first). Returns a disconnect function. */
export function __testInstallBackend(emit: (e: Envelope) => void): () => void {
  port = {
    postMessage: emit,
    onDisconnect: { addListener: () => {} } as any,
    disconnect: () => {},
  };
  while (ring.length) emit(ring.shift()!);
  return () => { port = undefined; };
}
// ────────────────────────────────────────────────────────────────────────────

class NodeSink<T> extends Sink<T> {
  constructor(sink: ISink<T>, public readonly source: Inspect<T>, public readonly id: number) {
    super(sink);
    this.sourceId = sink.sourceId;
    this.defer(() => {
      Events.defer(this.source, this.id);
    });
  }
  next(data: T) {
    const seq = Events.next(this.source, this.id, data);
    const prev = currentCause;
    currentCause = { nodeId: this.source.id, sequence: seq };
    try { this.sink.next(data); }
    finally { currentCause = prev; }
  }
  complete() {
    const seq = Events.complete(this.source, this.id);
    const prev = currentCause;
    currentCause = { nodeId: this.source.id, sequence: seq };
    try { this.sink.complete(); }
    finally { currentCause = prev; }
  }
  error(err: any) {
    const seq = Events.error(this.source, this.id, err);
    const prev = currentCause;
    currentCause = { nodeId: this.source.id, sequence: seq };
    try { this.sink.error(err); }
    finally { currentCause = prev; }
  }
}
interface Node {
  id: string;
  name: string;
  _label?: string;
  toString(): string;
  source?: Node;
}
export const Events = {
  addSource(who: Node, source: Node) {
    dispatch({
      version: 1, sequence: ++sequence, nodeId: who.id, nodeLabel: who._label,
      kind: 'addSource', streamId: 0, ts: Date.now(), data: source.id,
    });
  },
  next(who: Node, streamId: number, data?: unknown, cause: { nodeId: string; sequence: number } | undefined = currentCause): number {
    const seq = ++sequence;
    dispatch({
      version: 1, sequence: seq, nodeId: who.id, nodeLabel: who._label,
      kind: 'next', streamId, ts: Date.now(), cause, data: summarize(data),
    });
    return seq;
  },
  subscribe(id: { id: string }, sink?: { nodeId: string; streamId: number }) {
    dispatch({
      version: 1, sequence: ++sequence, nodeId: id.id, kind: 'subscribe',
      streamId: sink ? sink.streamId : 0, ts: Date.now(),
      data: sink ? sink.nodeId : undefined,
    });
  },
  complete(who: Node, streamId: number, cause: { nodeId: string; sequence: number } | undefined = currentCause): number {
    const seq = ++sequence;
    dispatch({
      version: 1, sequence: seq, nodeId: who.id, nodeLabel: who._label,
      kind: 'complete', streamId, ts: Date.now(), cause,
    });
    return seq;
  },
  error(who: Node, streamId: number, err: unknown, cause: { nodeId: string; sequence: number } | undefined = currentCause): number {
    const seq = ++sequence;
    dispatch({
      version: 1, sequence: seq, nodeId: who.id, nodeLabel: who._label,
      kind: 'error', streamId, ts: Date.now(), cause, err: summarize(err),
    });
    return seq;
  },
  defer(who: Node, streamId: number) {
    dispatch({
      version: 1, sequence: ++sequence, nodeId: who.id, nodeLabel: who._label,
      kind: 'defer', streamId, ts: Date.now(),
    });
  },
  pipe(who: Node) {
    dispatch({
      version: 1, sequence: ++sequence, nodeId: who.id, nodeLabel: who._label,
      kind: 'pipe', streamId: 0, ts: Date.now(),
      data: who.source ? who.source.id : undefined,
    });
  },
  create(who: Node) {
    if (!who.id) who.id = `${who.name}#${obids++}`;
    dispatch({
      version: 1, sequence: ++sequence, nodeId: who.id, nodeLabel: who._label,
      kind: 'create', streamId: 0, ts: Date.now(),
    });
  },
};
export class TimeoutError extends Error {
  constructor(public readonly timeout: number) {
    super(`timeout after ${timeout}ms`);
  }
}
