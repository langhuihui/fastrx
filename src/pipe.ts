import { Sink, ISink, deliver, nothing, Observable, Operator, Observer, LastSink, TimeoutError } from './common';
import { Subject } from './producer';

type Subscription<T, R = T> = Subscribe<T> | Promise<T> | Observable<R>;
//type Operators<T, S> = T extends [Operator<S, infer A>, ...infer R] ? R extends [(source: Observable<A>) => Subscribe<A> | Promise<A>] ? T : (R extends Operators<R, A> ? T : never) : never;
//export function pipe<S, LL, LLL extends Subscription<LL>, T extends [...Operators<T, S>, (source: Observable<LL>) => LLL]>(first: Observable<S>, ...arg: T): LLL;

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
    source(new Subscribe<T>((d) => (value = d), reject, () => resolve(value)));
  });

export class Subscribe<T> extends LastSink<T> {
  then = nothing;
  constructor(public next = nothing, public _error = nothing, public _complete = nothing) {
    super();
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
    observer.next = (data: T) => { ob(data); sink.next(data); };
  } else {
    if (ob.next) observer.next = (data: T) => { ob.next!(data); sink.next(data); };
    if (ob.complete) observer.complete = () => { ob.complete!(); sink.complete(); };
    if (ob.error) observer.error = (err: any) => { ob.error!(err); sink.error(err); };
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
  }
  dispose() {
    clearTimeout(this.timeoutId);
    super.dispose();
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
    this.dispose();
    this.selector(err)(this.sink);
  }
}

export const catchError = deliver(CatchError);

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

class Timeout<T> extends Sink<T> {
  id = setTimeout(() => this.error(new TimeoutError(this.timeout)), this.timeout);
  constructor(sink: ISink<T>, private readonly timeout: number) {
    super(sink);
  }
  next(data: T) {
    super.next(data);
    clearTimeout(this.id);
    this.next = super.next;
  }
  dispose() {
    clearTimeout(this.id);
    super.dispose();
  }
}
export const timeout = deliver(Timeout);