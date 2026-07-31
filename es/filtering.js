import { Sink, deliver, nothing, dispose } from "./common";
import { reduce } from "./mathematical";
import { timer } from "./producer";
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
export const filter = deliver(Filter, "filter");
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
export function distinct(keySelector = (data => data)) {
    return deliver(Distinct, "distinct")(keySelector);
}
class Ignore extends Sink {
    next(_data) { }
}
export const ignoreElements = deliver(Ignore, "ignoreElements");
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
export const take = deliver(Take, "take");
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
export const takeUntil = deliver(TakeUntil, "takeUntil");
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
export const takeWhile = deliver(TakeWhile, "takeWhile");
export const takeLast = (count) => reduce((buffer, d) => {
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
export const skip = deliver(Skip, "skip");
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
export const skipUntil = deliver(SkipUntil, "skipUntil");
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
export const skipWhile = deliver(SkipWhile, "skipWhile");
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
export const throttle = deliver(Throttle, "throttle");
const defaultAuditConfig = {
    leading: false,
    trailing: true,
};
export const audit = (durationSelector) => deliver(Throttle, "audit")(durationSelector, defaultAuditConfig);
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
export const debounce = deliver(Debounce, "debounce");
export const debounceTime = (period) => deliver(Debounce, "debounceTime")((_d) => timer(period));
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
export const elementAt = deliver(ElementAt, "elementAt");
export const find = (f) => (source) => take(1)(skipWhile((d) => !f(d))(source));
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
export const findIndex = deliver(FindIndex, "findIndex");
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
export const first = deliver(First, "first");
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
export const last = deliver(Last, 'last');
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
export const every = deliver(Every, "every");
//# sourceMappingURL=filtering.js.map