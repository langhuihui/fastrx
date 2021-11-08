import { Sink, deliver, ISink, Observable, nothing, dispose } from "./common";
import { reduce } from "./mathematical";
import { timer } from "./producer";
class Filter<T> extends Sink<T> {
  constructor(sink: ISink<T>, private filter: (data: T) => boolean, private thisArg?: any) {
    super(sink);
  }
  next(data: T) {
    if (this.filter.call(this.thisArg, data)) {
      this.sink.next(data);
    }
  }
}
export const filter = deliver(Filter, "filter");

class Ignore<T> extends Sink<T, never> {
  next(_data: T) { }
}
export const ignoreElements = deliver(Ignore, "ignoreElements");
class Take<T> extends Sink<T> {
  constructor(sink: ISink<T>, private count: number) {
    super(sink);
  }
  next(data: T) {
    this.sink.next(data);
    if (--this.count === 0) {
      this.complete();
    }
  }
}
export const take = deliver(Take, "take");
class TakeUntil<T> extends Sink<T> {
  constructor(sink: ISink<T>, control: Observable<unknown>) {
    super(sink);
    const _takeUntil = new Sink<unknown>(sink);
    _takeUntil.next = () => sink.complete();
    _takeUntil.complete = dispose;
    _takeUntil.subscribe(control);
  }
}
export const takeUntil = deliver(TakeUntil, "takeUntil");

class TakeWhile<T> extends Sink<T> {
  constructor(sink: ISink<T>, private readonly f: (data: T) => boolean) {
    super(sink);
  }
  next(data: T) {
    if (this.f(data)) {
      this.sink.next(data);
    } else {
      this.complete();
    }
  }
}
export const takeWhile = deliver(TakeWhile, "takeWhile");

export const takeLast = <T>(count: number) =>
  reduce((buffer: T[], d: T) => {
    buffer.push(d);
    if (buffer.length > count) buffer.shift();
    return buffer;
  }, []);

class Skip<T> extends Sink<T> {
  constructor(sink: ISink<T>, private count: number) {
    super(sink);
  }
  next(_data: T) {
    if (--this.count === 0) {
      this.next = super.next;
    }
  }
}
export const skip = deliver(Skip, "skip");
class SkipUntil<T> extends Sink<T> {
  constructor(sink: ISink<T>, control: Observable<unknown>) {
    super(sink);
    sink.next = nothing;
    const _skipUntil = new Sink<unknown>(sink);
    _skipUntil.next = () => {
      _skipUntil.dispose();
      sink.resetNext();
    };
    _skipUntil.complete = dispose;
    _skipUntil.subscribe(control);
  }
}
export const skipUntil = deliver(SkipUntil, "skipUntil");

class SkipWhile<T> extends Sink<T> {
  constructor(sink: ISink<T>, private readonly f: (data: T) => boolean) {
    super(sink);
  }
  next(data: T) {
    if (!this.f(data)) {
      this.next = super.next;
      this.next(data);
    }
  }
}
export const skipWhile = deliver(SkipWhile, "skipWhile");
const defaultThrottleConfig = {
  leading: true,
  trailing: false,
};
class _Throttle<T> extends Sink<T> {
  last!: T;
  constructor(sink: ISink<T>, private readonly durationSelector: (data: T) => Observable<unknown>, private readonly trailing: boolean) {
    super(sink);
  }
  cacheValue(value: T) {
    this.last = value;
    // @ts-ignore
    delete this.send;
    if (this.disposed) this.throttle(value);
  }
  send(data: T) {
    this.send = nothing;
    this.sink.next(data);
    this.throttle(data);
  }
  throttle(data: T) {
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
class Throttle<T> extends Sink<T> {
  _throttle: _Throttle<T> = new _Throttle(this.sink, this.durationSelector, this.config.trailing);
  constructor(sink: ISink<T>, private readonly durationSelector: (data: T) => Observable<unknown>, private readonly config = defaultThrottleConfig) {
    super(sink);
    this._throttle.dispose();
  }
  next(data: T) {
    if (this._throttle.disposed && this.config.leading) {
      this._throttle.send(data);
    } else {
      this._throttle.cacheValue(data);
    }
  }
  complete() {
    this._throttle.throttle = nothing;//最后不再启动节流
    this._throttle.complete();
    super.complete();
  }
}
export const throttle = deliver(Throttle, "throttle");
const defaultAuditConfig = {
  leading: false,
  trailing: true,
};
export const audit = <T>(durationSelector: (d: T) => Observable<unknown>) => deliver(Throttle, "audit")<T>(durationSelector, defaultAuditConfig);
class _Debounce<T> extends Sink<T> {
  last!: T;
  next() {
    this.complete();
  }
  complete() {
    this.dispose();
    this.sink.next(this.last);
  }
}
class Debounce<T> extends Sink<T> {
  _debounce: _Debounce<T> = new _Debounce(this.sink);
  constructor(sink: ISink<T>, private readonly durationSelector: (d: T) => Observable<unknown>) {
    super(sink);
    this._debounce.dispose();
  }
  next(data: T) {
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

export const debounce = deliver(Debounce, "debounce");

export const debounceTime = <T>(period: number) => deliver(Debounce, "debounceTime")((_d: T) => timer(period));
class ElementAt<T> extends Sink<T> {
  constructor(sink: ISink<T>, private count: number, private defaultValue?: T) {
    super(sink);
  }
  next(data: T) {
    if (this.count-- === 0) {
      this.defaultValue = data;
      this.complete();
    }
  }
  complete() {
    if (this.defaultValue === void 0) {
      this.error(new Error('not enough elements in sequence'));
      return;
    } else this.sink.next(this.defaultValue);
    super.complete();
  }
}

export const elementAt = deliver(ElementAt, "elementAt");
export const find = <T>(f: (d: T) => boolean) => (source: Observable<T>) => take<T>(1)(skipWhile<T>((d) => !f(d))(source));
class FindIndex<T> extends Sink<T, number> {
  i = 0;
  constructor(sink: ISink<number>, private readonly f: (d: T) => boolean) {
    super(sink);
  }
  next(data: T) {
    if (this.f(data)) {
      this.sink.next(this.i++);
      this.complete();
    } else {
      ++this.i;
    }
  }
}
export const findIndex = deliver(FindIndex, "findIndex");
class First<T> extends Sink<T> {
  index = 0;
  constructor(sink: ISink<T>, private readonly f?: (d: T, index: number) => boolean, private defaultValue?: T) {
    super(sink);
  }
  next(data: T) {
    if (!this.f || this.f(data, this.index++)) {
      this.defaultValue = data;
      this.complete();
    }
  }
  complete() {
    if (this.defaultValue === void 0) {
      this.error(new Error('no elements in sequence'));
      return;
    } else this.sink.next(this.defaultValue);
    super.complete();
  }
}

export const first = deliver(First, "first");
class Last<T> extends Sink<T> {
  index = 0;
  constructor(sink: ISink<T>, private readonly f?: (d: T, index: number) => boolean, private defaultValue?: T) {
    super(sink);
  }
  next(data: T) {
    if (!this.f || this.f(data, this.index++)) {
      this.defaultValue = data;
    }
  }
  complete() {
    if (this.defaultValue === void 0) {
      this.error(new Error('no elements in sequence'));
      return;
    } else this.sink.next(this.defaultValue);
    super.complete();
  }
}

export const last = deliver(Last, 'last');

class Every<T> extends Sink<T, boolean> {
  result?: boolean;
  index = 0;
  constructor(sink: ISink<boolean>, private readonly predicate: (d: T, index: number) => boolean) {
    super(sink);
  }
  next(data: T) {
    if (!this.predicate(data, this.index++)) {
      this.result = false;
      this.complete();
    } else {
      this.result = true;
    }
  }
  complete() {
    if (this.result === void 0) {
      this.error(new Error('no elements in sequence'));
      return;
    } else this.sink.next(this.result);
    super.complete();
  }
}

export const every = deliver(Every, "every");
