import { ISink, Observable, Sink, Operator, LastSink, ObservableInputTuple, deliver, nothing, create, Inspect, InspectObservable, Events } from "./common";

class Share<T> extends LastSink<T> {
  sinks = new Set<ISink<T>>();
  constructor(private readonly source: Observable<T>) {
    super();
  }
  add(sink: ISink<T>) {
    sink.defer(() => this.remove(sink));
    if (this.sinks.add(sink).size === 1) {
      this.reset();
      this.subscribe(this.source);
    }
  }
  remove(sink: ISink<T>) {
    this.sinks.delete(sink);
    if (this.sinks.size === 0) {
      this.dispose();
    }
  }
  next(data: T) {
    this.sinks.forEach((s) => s.next(data));
  }
  complete() {
    this.sinks.forEach((s) => s.complete());
    this.sinks.clear();
  }
  error(err: any): void {
    this.sinks.forEach((s) => s.error(err));
    this.sinks.clear();
  }
}
export function share<T>(): Operator<T> {
  return (source) => {
    const share = new Share(source);
    if (source instanceof Inspect) {
      const ob = create((observer) => {
        share.add(observer);
      }, "share", arguments) as InspectObservable<T>;
      share.sourceId = ob.id
      ob.source = source;
      Events.pipe(ob);
      return ob;
    }
    return create(share.add.bind(share), "share", arguments);
  };
};
export function merge
  <A extends readonly unknown[]>(...sources: ObservableInputTuple<A>): Observable<A[number]> {
  return create((sink) => {
    const merge = new Sink<A[number]>(sink);
    let nLife = sources.length;
    merge.complete = () => {
      if (--nLife === 0) {
        sink.complete();
      }
    };
    sources.forEach(merge.bindSubscribe);
  }, "merge", arguments);
}

export function race
  <A extends readonly unknown[]>(...sources: ObservableInputTuple<A>): Observable<A[number]> {
  return create(
    (sink) => {
      const sinks = new Map<Observable<A[number]>, ISink<A[number]>>();
      sources.forEach((source) => {
        const r = new Sink<A[number]>(sink);
        sinks.set(source, r);
        r.complete = () => {
          sinks.delete(source);
          if (sinks.size === 0) {//特殊情况：所有流都没有数据
            sink.complete();
          } else {
            r.dispose();
          }
        };
        r.next = (data) => {
          sinks.delete(source);//先排除自己，防止自己调用dispose
          sinks.forEach((s) => s.dispose());//其他所有流全部取消订阅
          r.resetNext();
          r.resetComplete();
          r.next(data);
        };
      });
      sources.forEach((source) => sinks.get(source)!.subscribe(source));
    }, "race", arguments);
}


export function concat
  <A extends readonly unknown[]>(...sources: ObservableInputTuple<A>): Observable<A[number]> {
  return create(sink => {
    let pos = 0;
    const len = sources.length;
    const s = new Sink(sink);
    s.complete = () => {
      if (pos < len && !s.disposed) {
        s.doDefer();
        s.subscribe(sources[pos++]);
      }
      else sink.complete();
    };
    s.complete();
  }, "concat", arguments);
}

export function shareReplay<T>(bufferSize: number): Operator<T> {
  return (source) => {
    const share = new Share(source);
    const buffer: T[] = [];
    share.next = function (data: T) {
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
export function iif<T, F>(condition: () => boolean, trueS: Observable<T>, falseS: Observable<F>): Observable<T | F> {
  return create((sink) => condition() ? trueS(sink) : falseS(sink), "iif", arguments);
}
export function combineLatest
  <A extends unknown[]>(...sources: ObservableInputTuple<A>): Observable<A> {
  return create((sink) => {
    const nTotal = sources.length;
    let nRun = nTotal;//剩余未发出事件的事件流数量
    let nLife = nTotal;//剩余未完成的事件流数量
    const array: A = new Array(nTotal) as A;
    const onComplete = () => {
      if (--nLife === 0) sink.complete();
    };
    const s = (source: Observable<A[number]>, i: number) => {
      const ss = new Sink<A[number], A>(sink);
      ss.next = data => {
        if (--nRun === 0) {
          ss.next = data => {
            array[i] = data;
            sink.next(array);
          };
          ss.next(data);
        } else {
          array[i] = data;
        }
      };
      ss.complete = onComplete;
      ss.subscribe(source);
    };
    sources.forEach(s);
  }, "combineLatest", arguments);
}

type ZipBuffer<T> = { [K in keyof T]: T[K][] };
export function zip
  <A extends unknown[]>(...sources: ObservableInputTuple<A>): Observable<A> {
  return create((sink) => {
    const nTotal = sources.length;
    let nLife = nTotal;//剩余未完成的事件流数量
    const array: ZipBuffer<A> = new Array(nTotal) as ZipBuffer<A>;
    const onComplete = () => {
      if (--nLife === 0) sink.complete();
    };
    const s = (source: Observable<A[number]>, i: number) => {
      const ss = new Sink<A[number], A>(sink);
      const buffer: Array<A[number]> = [];
      array[i] = buffer;
      ss.next = data => {
        buffer.push(data);
        if (array.every(x => x.length)) {
          sink.next(array.map(x => x.shift()) as A);
        }
      };
      ss.complete = onComplete;
      ss.subscribe(source);
    };
    sources.forEach(s);
  }, "zip", arguments);
}

export function startWith<T, A extends unknown[]>(...xs: A): Operator<T, T | A[number]> {
  return (inputSource) =>
    create((sink, pos = 0, l = xs.length) => {
      while (pos < l && !sink.disposed) {
        sink.next(xs[pos++]);
      }
      sink.disposed || sink.subscribe(inputSource);
    }, "startWith", arguments);
}

class WithLatestFrom<T, A extends unknown[]> extends Sink<T, [T, ...A]> {
  buffer!: A;
  constructor(sink: ISink<[T, ...A]>, ...sources: ObservableInputTuple<A>) {
    super(sink);
    const s = new Sink<A, never>(this.sink);
    s.next = (data) => (this.buffer = data);
    s.complete = nothing;
    s.subscribe(combineLatest(...sources));
  }
  next(data: T) {
    if (this.buffer) {
      this.sink.next([data, ...this.buffer]);
    }
  }
}
export const withLatestFrom = deliver(WithLatestFrom, "withLatestFrom");
class BufferCount<T> extends Sink<T, T[]> {
  buffer: T[] = [];
  buffers!: Array<T[]>;
  count = 0;
  constructor(sink: ISink<T[]>, private readonly bufferSize: number, private readonly startBufferEvery?: number) {
    super(sink);
    if (this.startBufferEvery) {
      this.buffers = [[]];
    }
  }
  next(data: T) {
    if (this.startBufferEvery) {
      if (this.count++ === this.startBufferEvery) {
        this.buffers.push([]);
        this.count = 1;
      }
      this.buffers.forEach((buffer) => {
        buffer.push(data);
      });
      if (this.buffers[0].length === this.bufferSize) {
        this.sink.next(this.buffers.shift()!);
      }
    } else {
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
    } else if (this.buffers.length) {
      this.buffers.forEach((buffer) => this.sink.next(buffer));
    }
    super.complete();
  }
}

export const bufferCount = deliver(BufferCount, "bufferCount");

// export function operator<T, R, ARG extends unknown[]>(f: (...args: [ISink<R>, ...ARG]) => ISink<T>) {
//   return (...args: ARG): (Operator<T, R>) => source => sink => f(sink, ...args).subscribe(source);
// }
class Buffer<T> extends Sink<T, T[]> {
  buffer: T[] = [];
  constructor(sink: ISink<T[]>, closingNotifier: Observable<unknown>) {
    super(sink);
    const s = new Sink<T, never>(sink);
    s.next = (_data) => {
      sink.next(this.buffer);
      this.buffer = [];
    };
    s.complete = nothing;
    s.subscribe(closingNotifier);
  }
  next(data: T) {
    this.buffer.push(data);
  }
  complete() {
    if (this.buffer.length) {
      this.sink.next(this.buffer);
    }
    super.complete();
  }
}

export const buffer = deliver(Buffer, "buffer");