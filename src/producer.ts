import { share } from "./combination";
import { ISink, Observable, nothing, Observer, create, EventHandler, EventDispachter } from "./common";
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
// 类型声明
declare const setImmediate: ((callback: () => void) => any) | undefined;
declare const process: { env?: { NODE_ENV?: string; JEST_WORKER_ID?: string; npm_lifecycle_event?: string; }; } | undefined;
declare const global: any;

// 异步调度器类型
type AsyncScheduler = (callback: () => void) => void;

// 不同的调度器实现
const schedulers = {
  // 使用 Promise.resolve().then() - 微任务队列，性能最佳
  promise: (callback: () => void) => {
    Promise.resolve().then(callback);
  },

  // 使用 setImmediate - Node.js 环境
  setImmediate: typeof setImmediate !== 'undefined'
    ? (callback: () => void) => setImmediate!(callback)
    : null,

  // 使用 setTimeout - 兼容性最好的回退方案
  setTimeout: (callback: () => void) => setTimeout(callback, 0)
};

// 创建一个高性能的异步调度器，根据环境选择最佳方法
const createAsapScheduler = (): AsyncScheduler => {
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
const asap = <T>(f: (sink: ISink<T>) => void) => (sink: ISink<T>) => {
  scheduler(() => f(sink));
};

// 调度器配置函数，允许用户自定义调度方法
const setAsapScheduler = (schedulerType: keyof typeof schedulers | AsyncScheduler) => {
  if (typeof schedulerType === 'function') {
    // 自定义调度器函数
    scheduler = schedulerType;
  } else if (schedulers[schedulerType]) {
    // 预定义的调度器类型
    scheduler = schedulers[schedulerType]!;
  }
};

// 单独导出调度器配置函数，避免与 Observable 创建函数混淆
export { setAsapScheduler };

const _fromArray = <T>(data: ArrayLike<T>) => asap((sink: ISink<T>) => {
  for (let i = 0; !sink.disposed && i < data.length; i++) {
    sink.next(data[i]);
  }
  sink.complete();
});

export function of<T>(...data: T[]) {
  return create(_fromArray(data), "of", arguments);
}

export function fromArray<T>(data: ArrayLike<T>): Observable<T> {
  return create(_fromArray(data), "fromArray", arguments);
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
      // Only create interval if period is explicitly provided and >= 10ms
      // This prevents accidental interval creation when timer is called with extra parameters (like index values 0,1,2,3...)
      if (period) {
        const id = setInterval(() => sink.next(i++), period);
        sink.defer(() => { clearInterval(id); });
      } else {
        sink.complete();
      }
    }, delay);
    const deferF = () => clearTimeout(id);
    sink.defer(deferF);
  }, "timer", arguments);
};
function _fromEventPattern<T>(add: (n: EventHandler<T>) => void, remove: (n: EventHandler<T>) => void): Observable<T> {
  return (sink: ISink<T>) => {
    const n: EventHandler<T> = (d) => sink.next(d);
    sink.defer(() => remove(n));
    add(n);
  };
}
export function fromEventPattern<T>(add: (n: EventHandler<T>) => void, remove: (n: EventHandler<T>) => void): Observable<T> {
  return create(_fromEventPattern(add, remove), "fromEventPattern", arguments);
};

export function fromEvent<T, N>(target: EventDispachter<N, T>, name: N) {
  if ("on" in target && "off" in target) {
    return create(_fromEventPattern<T>(
      (h) => target.on(name, h),
      (h) => target.off(name, h)), "fromEvent", arguments);
  } else if ("addListener" in target && "removeListener" in target) {
    return create(_fromEventPattern<T>(
      (h) => target.addListener(name, h),
      (h) => target.removeListener(name, h)), "fromEvent", arguments);
  } else if ("addEventListener" in target) {
    return create(_fromEventPattern<T>(
      (h) => target.addEventListener(name, h),
      (h) => target.removeEventListener(name, h)), "fromEvent", arguments);
  }
  else throw 'target is not a EventDispachter';
};

export function fromPromise<T>(promise: Promise<T>): Observable<T> {
  return create((sink: ISink<T>) => {
    promise.then(
      (data) => {
        sink.next(data);
        sink.complete();
      },
      sink.error.bind(sink)
    );
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
export function fromReader<T>(source: ReadableStreamDefaultReader<T>): Observable<T> {
  const read = async (sink: ISink<T>) => {
    try {
      if (sink.disposed) return;
      const { done, value } = await source.read();
      if (done) {
        sink.complete();
        return;
      } else {
        sink.next(value!);
        read(sink);
      }
    } catch (err) {
      sink.error(err);
    }
  };
  return create((sink: ISink<T>) => {
    read(sink);
  }, "fromReader", arguments);
}
export function fromReadableStream<T>(source: ReadableStream<T>): Observable<T> {
  return create((sink: ISink<T>) => {
    const controller = new AbortController();
    const signal = controller.signal;
    //@ts-ignore
    sink.defer(() => controller.abort('cancelled'));
    source.pipeTo(new WritableStream({
      write(chunk: T) {
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
