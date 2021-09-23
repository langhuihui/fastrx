import { merge, share } from "./combination";
import { ISink, Observable, nothing, Observer, create } from "./common";
import { takeUntil } from "./filtering";
import { pipe } from "./pipe";
import { switchMap } from "./transformation";
export type Subject<T> = Observable<T> & Observer<T>;
export function subject<T>(source?: Observable<T>) {
  const args = arguments;
  const observable: Subject<T> = share<T>()(create((sink: ISink<T>) => {
    observable.next = (data: T) => sink.next(data);
    observable.complete = () => sink.complete();
    observable.error = (err: any) => sink.error(err);
    source && sink.subscribe(source);
  }, "subject", args)) as Subject<T>;
  observable.next = nothing;
  observable.complete = nothing;
  observable.error = nothing;
  return observable;
};
export function defer<T>(f: () => Observable<T>): Observable<T> {
  return create(sink => sink.subscribe(f()), "defer", arguments);
}
export function of<T>(...data: T[]) {
  return create(fromArray(data), "of", arguments);
}

const asap = <T>(f: (sink: ISink<T>) => void) => (sink: ISink<T>) => {
  setTimeout(() => f(sink));
};

export function fromArray<T>(data: ArrayLike<T>): Observable<T> {
  return create(asap((sink: ISink<T>) => {
    for (let i = 0; !sink.disposed && i < data.length; i++) {
      sink.next(data[i]);
    }
    sink.complete();
  }), "fromArray", arguments);
}

export function interval(period: number): Observable<number> {
  return create((sink: ISink<number>) => {
    let i = 0;
    const id = setInterval(() => sink.next(i++), period);
    sink.defer(() => { clearInterval(id); });
    return "interval";
  }, "interval", arguments);
}

export function timer(delay: number, period?: number): Observable<number> {
  return create((sink: ISink<number>) => {
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
  }, "timer", arguments);
};
export function fromEventPattern<T>(add: (n: EventHandler<T>) => void, remove: (n: EventHandler<T>) => void): Observable<T> {
  return create((sink: ISink<T>) => {
    const n: EventHandler<T> = (d) => sink.next(d);
    sink.defer(() => remove(n));
    add(n);
    return name;
  }, "fromEventPattern", arguments);
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
export function fromEvent<T, N>(target: EventDispachter<N, T>, name: N) {
  if ("on" in target) {
    return create(fromEventPattern<T>(
      (h) => target.on(name, h),
      (h) => target.off(name, h)), "fromEvent", arguments);
  } else if ("addListener" in target) {
    return create(fromEventPattern<T>(
      (h) => target.addListener(name, h),
      (h) => target.removeListener(name, h)), "fromEvent", arguments);
  } else if ("addEventListener" in target) {
    return create(fromEventPattern<T>(
      (h) => target.addEventListener(name, h),
      (h) => target.removeEventListener(name, h)), "fromEvent", arguments);
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
export function fromMessageEvent<T>(target: Messager<T> & EventDispachter<string, T>): Observable<T> {
  return create((sink: ISink<T>) => {
    const closeOb = fromEvent(target, 'close');
    const messageOb = fromEvent(target, 'message');
    const errorOb = fromEvent(target, 'error');
    sink.defer(() => target.close());
    sink.subscribe(pipe(merge(messageOb, switchMap(throwError)(errorOb)), takeUntil(closeOb)));
  }, "fromMessageEvent", arguments);
};
export function fromPromise<T>(promise: Promise<T>): Observable<T> {
  return create((sink: ISink<T>) => {
    promise.then(sink.next.bind(sink), sink.error.bind(sink));
  }, "fromPromise", arguments);
}
export function fromFetch(input: RequestInfo, init?: RequestInit) {
  return create(defer(() => fromPromise(fetch(input, init))), "fromFetch", arguments);
}
export function fromIterable<T>(source: Iterable<T>): Observable<T> {
  return create(asap((sink: ISink<T>) => {
    try {
      for (const data of source) {
        if (sink.disposed) return;
        sink.next(data);
      }
      sink.complete();
    } catch (err) {
      sink.error(err);
    }
  }), "fromIterable", arguments);
}
export function fromAnimationFrame(): Observable<DOMHighResTimeStamp> {
  return create((sink) => {
    let id = requestAnimationFrame(function next(t: DOMHighResTimeStamp) {
      if (!sink.disposed) {
        sink.next(t);
        id = requestAnimationFrame(next);
      }
    });
    sink.defer(() => cancelAnimationFrame(id));
  }, "fromAnimationFrame", arguments);
}
export function range
  (start: number, count: number): Observable<number> {
  return create((sink, pos = start, end = count + start) => {
    while (pos < end && !sink.disposed) sink.next(pos++);
    sink.complete();
    return "range";
  }, "range", arguments);
}

export function bindCallback
  <T>(call: Function, thisArg: any, ...args: any[]): Observable<T> {
  return create((sink) => {
    const inArgs = args.concat(
      (res: T) => (sink.next(res), sink.complete())
    );
    call.apply(thisArg, inArgs);
  }, "bindCallback", arguments);
}
export function bindNodeCallback<T>(call: Function, thisArg: any, ...args: any[]): Observable<T> {
  return create((sink) => {
    const inArgs = args.concat(
      (err: Error, res: T) => err ? (sink.error(err)) : (sink.next(res), sink.complete())
    );
    call.apply(thisArg, inArgs);
  }, "bindNodeCallback", arguments);
}
export function never(): Observable<never> {
  return create(() => { }, "never", arguments);
};
export function throwError(e: any): Observable<never> {
  return create(sink => sink.error(e), "throwError", arguments);
}
export function empty(): Observable<never> {
  return create(sink => sink.complete(), "empty", arguments);
};
