import { Sink, ISink, deliver, nothing, Observable, Operator, Observer, LastSink } from './common';
import { Subject } from './producer';

type Subscription<T, R = T> = Subscribe<T> | Promise<T> | Observable<R>;

export function pipe<T, L extends Subscription<T>>(first: Observable<T>, sub: (source: Observable<T>) => L): L;
export function pipe<T, T1, L extends Subscription<T1>>(first: Observable<T>, op1: Operator<T, T1>, sub: (source: Observable<T1>) => L): L;
export function pipe<T, T1, T2, L extends Subscription<T2>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, sub: (source: Observable<T2>) => L): L;
export function pipe<T, T1, T2, T3, L extends Subscription<T3>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, sub: (source: Observable<T3>) => L): L;
export function pipe<T, T1, T2, T3, T4, L extends Subscription<T4>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, op4: Operator<T3, T4>, sub: (source: Observable<T4>) => L): L;
export function pipe<T, T1, T2, T3, T4, T5, L extends Subscription<T5>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, op4: Operator<T3, T4>, op5: Operator<T4, T5>, sub: (source: Observable<T5>) => L): L;
export function pipe<T, T1, T2, T3, T4, T5, T6, L extends Subscription<T6>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, op4: Operator<T3, T4>, op5: Operator<T4, T5>, op6: Operator<T5, T6>, sub: (source: Observable<T6>) => L): L;
export function pipe<T, T1, T2, T3, T4, T5, T6, T7, L extends Subscription<T7>>(first: Observable<T>, op1: Operator<T, T1>, op2: Operator<T1, T2>, op3: Operator<T2, T3>, op4: Operator<T3, T4>, op5: Operator<T4, T5>, op6: Operator<T5, T6>, op7: Operator<T6, T7>, sub: (source: Observable<T7>) => L): L;

export function pipe<L extends Subscription<unknown>>(first: Observable<unknown>, ...cbs: [...any, (source: Observable<unknown>) => L]): L {
  return cbs.reduce((aac, c) => c(aac), first);
}

export const toPromise = <T>() => (source: Observable<T>) =>
  new Promise<T>((resolve, reject) => {
    let value: T;
    const sink = new LastSink<T>();
    sink.next = (d) => (value = d);
    sink.complete = (err?: any) => (err ? reject(err) : resolve(value));
    source(sink);
  });

class Subscribe<T> extends LastSink<T> {
  then = nothing;
  constructor(public next = nothing, public error = nothing, public complete = nothing) {
    super();
  }
}
// //SUBSCRIBER
export const subscribe =
  <T>(n: (data: T) => void = nothing, e = nothing, c = nothing) =>
    (source: Observable<T>) => {
      const sink = new Subscribe<T>(n, e, c);
      source(sink);
      return sink;
    };
// // UTILITY

export const tap = <T>(ob: ((d: T) => void) | Partial<Observer<T>>): (Operator<T>) => (source: Observable<T>) => (sink: ISink<T>) => {
  const observer = new Sink<T>(sink);
  if (ob instanceof Function) {
    const next = observer.next;
    observer.next = (data: T) => { ob(data); next.call(observer, data); };
  } else {
    const { next, complete, error } = observer;
    if (ob.next) observer.next = (data: T) => { ob.next!(data); next.call(observer, data); };
    if (ob.complete) observer.complete = () => { ob.complete!(); complete.call(observer); };
    if (ob.error) observer.error = (err: any) => { ob.error!(err); error.call(observer, err); };
  }
  source(observer);
};

class Delay<T> extends Sink<T> {
  delayTime!: number;
  buffer: { time: Date; data: T; }[] = [];
  timeoutId!: ReturnType<typeof setTimeout>;
  constructor(sink: ISink<T>, delay: number) {
    super(sink);
    this.delayTime = delay;
    this.defer(() => clearTimeout(this.timeoutId));
  }

  delay(delay: number) {
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

  next(data: T) {
    if (!this.buffer.length) {
      this.delay(this.delayTime);
    }
    this.buffer.push({ time: new Date(), data });
  }
  complete() {
    this.timeoutId = setTimeout(() => super.complete(), this.delayTime);
  }
}
export const delay = deliver(Delay);
class CatchError<T, R = T> extends Sink<T, R> {
  constructor(sink: ISink<R>, private readonly selector: (err: any) => Observable<R>) {
    super(sink);
  }
  error(err: any) {
    this.dispose(false);
    this.selector(err)(this.sink!);
  }
}

export const catchError = deliver(CatchError);
export * from './common';
export * from './producer';
export * from './combination';
export * from './filtering';
// export * from '../mathematical';

export * from './transformation';
import { subject } from './producer';
type Group = Subject<unknown> & { key: any; };
class GroupBy<T> extends Sink<T, Group> {
  groups = new Map<any, Group>();
  constructor(sink: ISink<Group>, private readonly f: (data: T) => any) {
    super(sink);
  }
  next(data: T) {
    const key = this.f(data);
    let group = this.groups.get(key);
    if (typeof group === 'undefined') {
      group = subject() as Group;
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
  error(err: any) {
    this.groups.forEach((group) => group.error(err));
    super.error(err);
  }
}
export const groupBy = deliver(GroupBy);
export class TimeoutError extends Error {
  constructor(public readonly timeout: number) {
    super(`timeout after ${timeout}ms`);
  }
}
class Timeout<T> extends Sink<T> {
  id: ReturnType<typeof setTimeout>;
  constructor(sink: ISink<T>, private readonly timeout: number) {
    super(sink);
    this.id = setTimeout(() => this.error(new TimeoutError(timeout)), this.timeout);
  }
  next(data: T) {
    super.next(data);
    clearTimeout(this.id);
    this.next = data => super.next(data);
  }
  complete() {
    clearTimeout(this.id);
    super.complete();
  }
  error(err: any) {
    clearTimeout(this.id);
    super.error(err);
  }
}
export const timeout = deliver(Timeout);
function send(event: string, payload: any) {
  window.postMessage({ source: 'fastrx-devtools-backend', payload: { event, payload } });
}
interface Node {
  id: string;
  toString(): string;
  source: Node;
}
export const Events = {
  addSource(who: Node, source: Node) {
    send('addSource', {
      id: who.id,
      name: who.toString(),
      source: { id: source.id, name: source.toString() },
    });
  },
  next(who: Node, streamId: string, data?: any) {
    send('next', { id: who.id, streamId, data: data && data.toString() });
  },
  subscribe({ id, end }: { id: string, end: boolean; }, sink: { nodeId: string; streamId: string; }) {
    send('subscribe', {
      id,
      end,
      sink: { nodeId: sink && sink.nodeId, streamId: sink && sink.streamId },
    });
  },
  complete(who: Node, streamId: string, err?: any) {
    send('complete', { id: who.id, streamId, err: err ? err.toString() : null });
  },
  defer(who: Node, streamId: string) {
    send('defer', { id: who.id, streamId });
  },
  pipe(who: Node) {
    send('pipe', {
      name: who.toString(),
      id: who.id,
      source: { id: who.source.id, name: who.source.toString() },
    });
  },
  update(who: Node) {
    send('update', { id: who.id, name: who.toString() });
  },
  create(who: Node) {
    send('create', { name: who.toString(), id: who.id });
  },
};