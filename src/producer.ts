import { merge, share } from "./combination";
import { ISink, Observable, nothing, Observer } from "./common";
import { takeUntil } from "./filtering";
import { pipe } from "./pipe";
import { switchMap } from "./transformation";
export type Subject<T> = Observable<T> & Observer<T>;
export const subject = <T>(source?: Observable<T>) => {
  const observable: Subject<T> = share<T>()((sink: ISink<T>) => {
    observable.next = (data: T) => sink.next(data);
    observable.complete = () => sink.complete();
    observable.error = (err: any) => sink.error(err);
    source && source(sink);
  }) as Subject<T>;
  observable.next = nothing;
  observable.complete = nothing;
  observable.error = nothing;
  return observable;
};
export const defer = <T>(f: () => Observable<T>): Observable<T> => (sink) => f()(sink);
export const of = <T>(...data: T[]) => fromArray(data);

const asap = <T>(f: Observable<T>): Observable<T> => (sink) => setTimeout(() => f(sink));

export const fromArray = <T>(data: T[]): Observable<T> => asap((sink: ISink<T>) => {
  for (const d of data) {
    if (sink.disposed)
      return;
    sink.next(d);
  }
  sink.complete();
});

export const interval = (period: number): Observable<number> => (sink: ISink<number>) => {
  let i = 0;
  const id = setInterval(() => sink.next(i++), period);
  sink.defer(() => { clearInterval(id); });
};

export const timer = (delay: number, period: number = 0): Observable<number> => (sink: ISink<number>) => {
  let i = 0;
  const id = setTimeout(() => {
    sink.removeDefer(deferF);
    sink.next(i++);
    if (period) {
      const id = setInterval(() => sink.next(i++), period);
      sink.defer(() => { clearInterval(id); });
    } else {
      sink.complete();
    }
  }, delay);
  const deferF = () => { clearTimeout(id); };
  sink.defer(deferF);
};
export const fromEventPattern = <T>(add: (n: EventHandler<T>) => void, remove: (n: EventHandler<T>) => void): Observable<T> => (sink: ISink<T>) => {
  const n: EventHandler<T> = (d) => sink.next(d);
  sink.defer(() => remove(n));
  add(n);
};
type EventHandler<T> = (event: T) => void;
type EventMethod<N, T> = (name: N, handler: EventHandler<T>) => void;
type EventDispachter<N, T> = {
  on: EventMethod<N, T>;
  off: EventMethod<N, T>;
} | {
  addListener: EventMethod<N, T>;
  removeListener: EventMethod<N, T>;
} | {
  addEventListener: EventMethod<N, T>;
  removeEventListener: EventMethod<N, T>;
};
export const fromEvent = <T, N>(target: EventDispachter<N, T>, name: N) => {
  if ("on" in target) {
    return fromEventPattern<T>(
      (h) => target.on(name, h),
      (h) => target.off(name, h));
  } else if ("addListener" in target) {
    return fromEventPattern<T>(
      (h) => target.addListener(name, h),
      (h) => target.removeListener(name, h));
  } else if ("addEventListener" in target) {
    return fromEventPattern<T>(
      (h) => target.addEventListener(name, h),
      (h) => target.removeEventListener(name, h));
  }
  else throw 'target is not a EventDispachter';
};
type Messager<T> = {
  onmessage: (event: T) => void;
  close: () => void;
};
/**
 * 
 * @param {window | Worker | EventSource | WebSocket | RTCPeerConnection} target 
 * @returns
 */
export const fromMessageEvent = <T>(target: Messager<T> & EventDispachter<string, T>): Observable<T> => (sink: ISink<T>) => {
  const closeOb = fromEvent(target, 'close');
  const messageOb = fromEvent(target, 'message');
  const errorOb = fromEvent(target, 'error');
  pipe(merge(messageOb, switchMap(throwError)(errorOb)), takeUntil(closeOb))(sink);
  sink.defer(() => target.close());
};
export const fromPromise = <T>(promise: Promise<T>): Observable<T> => (sink: ISink<T>) => {
  promise.then(sink.next.bind(sink), sink.error.bind(sink));
};
export const fromFetch = (input: RequestInfo, init?: RequestInit) => defer(() => fromPromise(fetch(input, init)));
export const fromIterable = <T>(source: Iterable<T>): Observable<T> => asap((sink: ISink<T>) => {
  try {
    for (const data of source) {
      if (sink.disposed) return;
      sink.next(data);
    }
    sink.complete();
  } catch (err) {
    sink.error(err);
  }
});
export const fromAnimationFrame = (): Observable<DOMHighResTimeStamp> => (sink: ISink<DOMHighResTimeStamp>) => {
  let id: number;
  function next(t: DOMHighResTimeStamp) {
    if (!sink.disposed) {
      sink.next(t);
      id = requestAnimationFrame(next);
    }
  }
  id = requestAnimationFrame(next);
  sink.defer(() => cancelAnimationFrame(id));
};

export const range =
  (start: number, count: number): Observable<number> =>
    (sink, pos = start, end = count + start) => {
      while (pos < end && !sink.disposed) sink.next(pos++);
      sink.complete();
    };

export const bindCallback =
  <T>(call: Function, thisArg: any, ...args: any[]): Observable<T> =>
    (sink) => {
      const inArgs = args.concat(
        (res: T) => (sink.next(res), sink.complete())
      );
      call.apply(thisArg, inArgs);
    };
export const bindNodeCallback =
  <T>(call: Function, thisArg: any, ...args: any[]): Observable<T> =>
    (sink) => {
      const inArgs = args.concat(
        (err: Error, res: T) => err ? (sink.error(err)) : (sink.next(res), sink.complete())
      );
      call.apply(thisArg, inArgs);
    };
export const never = (): Observable<never> => nothing;
export const throwError = (e: any): Observable<never> => (sink) => sink.error(e);
export const empty = (): Observable<never> => (sink) => sink.complete();
