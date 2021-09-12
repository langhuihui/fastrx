import { Sink, deliver, nothing, dispose } from "./common";
import { reduce } from "./mathematical";
import { timer } from "./producer";
class Filter extends Sink {
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
export const filter = deliver(Filter);
class Ignore extends Sink {
    next(_data) { }
}
export const ignoreElements = deliver(Ignore);
class Take extends Sink {
    constructor(sink, count) {
        super(sink);
        this.count = count;
    }
    next(data) {
        this.sink.next(data);
        if (--this.count === 0) {
            this.complete();
        }
    }
}
export const take = deliver(Take);
class TakeUntil extends Sink {
    constructor(sink, control) {
        super(sink);
        this._takeUntil = new Sink(this.sink);
        this._takeUntil.next = () => {
            this.complete();
        };
        this._takeUntil.complete = dispose;
        control(this._takeUntil);
    }
}
export const takeUntil = deliver(TakeUntil);
class TakeWhile extends Sink {
    constructor(sink, f) {
        super(sink);
        this.f = f;
    }
    next(data) {
        if (this.f(data)) {
            this.sink.next(data);
        }
        else {
            this.complete();
        }
    }
}
export const takeWhile = deliver(TakeWhile);
export const takeLast = (count) => reduce((buffer, d) => {
    buffer.push(d);
    if (buffer.length > count)
        buffer.shift();
    return buffer;
}, []);
class Skip extends Sink {
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
export const skip = deliver(Skip);
class SkipUntil extends Sink {
    constructor(sink, control) {
        super(sink);
        this._skipUntil = new Sink(this.sink);
        this._skipUntil.next = () => {
            this._skipUntil.dispose();
            this.next = super.next;
        };
        this._skipUntil.complete = dispose;
        control(this._skipUntil);
    }
    next(_data) {
    }
}
export const skipUntil = deliver(SkipUntil);
class SkipWhile extends Sink {
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
export const skipWhile = deliver(SkipWhile);
const defaultThrottleConfig = {
    leading: true,
    trailing: false,
};
class _Throttle extends Sink {
    constructor(sink, durationSelector, trailing) {
        super(sink);
        this.durationSelector = durationSelector;
        this.trailing = trailing;
    }
    cacheValue(value) {
        this.last = value;
        // @ts-ignore
        delete this.send;
        if (this.disposed)
            this.throttle(value);
    }
    send(data) {
        this.send = nothing;
        this.sink.next(data);
        this.throttle(data);
    }
    throttle(data) {
        this.reset();
        this.durationSelector(data)(this);
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
export const throttle = deliver(Throttle);
const defaultAuditConfig = {
    leading: false,
    trailing: true,
};
export const audit = (durationSelector) => throttle(durationSelector, defaultAuditConfig);
class _Debounce extends Sink {
    next() {
        this.complete();
    }
    complete() {
        this.dispose();
        this.sink.next(this.last);
    }
}
class Debounce extends Sink {
    constructor(sink, durationSelector) {
        super(sink);
        this.durationSelector = durationSelector;
        this._debounce = new _Debounce(this.sink);
        this._debounce.dispose();
    }
    next(data) {
        this._debounce.dispose();
        this._debounce.reset();
        this._debounce.last = data;
        this.durationSelector(data)(this._debounce);
    }
    complete() {
        this._debounce.complete();
        super.complete();
    }
}
export const debounce = deliver(Debounce);
export const debounceTime = (period) => debounce((_d) => timer(period));
class ElementAt extends Sink {
    constructor(sink, count, defaultValue) {
        super(sink);
        this.count = count;
        this.defaultValue = defaultValue;
    }
    next(data) {
        if (this.count-- === 0) {
            this.defaultValue = data;
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
export const elementAt = deliver(ElementAt);
export const find = (f) => (source) => take(1)(skipWhile((d) => !f(d))(source));
class FindIndex extends Sink {
    constructor(sink, f) {
        super(sink);
        this.f = f;
        this.i = 0;
    }
    next(data) {
        if (this.f(data)) {
            this.sink.next(this.i++);
            this.complete();
        }
        else {
            ++this.i;
        }
    }
}
export const findIndex = deliver(FindIndex);
class First extends Sink {
    constructor(sink, f, defaultValue) {
        super(sink);
        this.f = f;
        this.defaultValue = defaultValue;
        this.index = 0;
    }
    next(data) {
        if (!this.f || this.f(data, this.index++)) {
            this.defaultValue = data;
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
export const first = deliver(First);
class Last extends Sink {
    constructor(sink, f, defaultValue) {
        super(sink);
        this.f = f;
        this.defaultValue = defaultValue;
        this.index = 0;
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
export const last = deliver(Last);
class Every extends Sink {
    constructor(sink, predicate) {
        super(sink);
        this.predicate = predicate;
        this.index = 0;
    }
    next(data) {
        if (!this.predicate(data, this.index++)) {
            this.result = false;
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
export const every = deliver(Every);
