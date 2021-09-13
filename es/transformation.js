import { Sink, deliver, nothing } from "./common";
class Scan extends Sink {
    constructor(sink, f, seed) {
        super(sink);
        this.f = f;
        if (typeof seed === "undefined") {
            this.next = (d) => {
                this.acc = d;
                this.resetNext();
                this.sink.next(this.acc);
            };
        }
        else {
            this.acc = seed;
        }
    }
    next(data) {
        this.sink.next(this.acc = this.f(this.acc, data));
    }
}
export const scan = deliver(Scan);
class Pairwise extends Sink {
    constructor() {
        super(...arguments);
        this.hasLast = false;
    }
    next(data) {
        if (this.hasLast) {
            this.sink.next([this.last, data]);
        }
        else {
            this.hasLast = true;
        }
        this.last = data;
    }
}
export const pairwise = deliver(Pairwise);
class MapObserver extends Sink {
    constructor(sink, mapper, thisArg) {
        super(sink);
        this.mapper = mapper;
        this.thisArg = thisArg;
    }
    next(data) {
        super.next(this.mapper.call(this.thisArg, data));
    }
}
export const map = deliver(MapObserver);
export const mapTo = (target) => map((_x) => target);
class InnerSink extends Sink {
    constructor(sink, data, context) {
        super(sink);
        this.data = data;
        this.context = context;
    }
    next(data) {
        const combineResults = this.context.combineResults;
        if (combineResults) {
            this.sink.next(combineResults(this.data, data));
        }
        else {
            this.sink.next(data);
        }
    }
    // 如果complete先于context的complete触发，则激活原始的context的complete
    tryComplete() {
        this.context.resetComplete();
        this.dispose();
    }
}
class Maps extends Sink {
    constructor(sink, makeSource, combineResults) {
        super(sink);
        this.makeSource = makeSource;
        this.combineResults = combineResults;
        this.index = 0;
    }
    subInner(data, c) {
        const sink = this.currentSink = new c(this.sink, data, this);
        this.complete = this.tryComplete;
        sink.complete = sink.tryComplete;
        this.makeSource(data, this.index++)(sink);
    }
    // 如果complete先于inner的complete触发，则不传播complete
    tryComplete() {
        // 如果tryComplete被调用，说明currentSink已经存在
        this.currentSink.resetComplete();
        this.dispose();
    }
}
class _SwitchMap extends InnerSink {
}
class SwitchMap extends Maps {
    next(data) {
        this.subInner(data, _SwitchMap);
        this.next = (data) => {
            this.currentSink.dispose();
            this.subInner(data, _SwitchMap);
        };
    }
}
export const switchMap = deliver(SwitchMap);
function makeMapTo(f) {
    return (innerSource, combineResults) => f(() => innerSource, combineResults);
}
export const switchMapTo = makeMapTo(switchMap);
class _ConcatMap extends InnerSink {
    tryComplete() {
        this.dispose();
        if (this.context.sources.length) {
            this.context.subNext();
        }
        else {
            this.context.resetNext();
            this.context.resetComplete();
        }
    }
}
class ConcatMap extends Maps {
    constructor() {
        super(...arguments);
        this.sources = [];
        this.next2 = this.sources.push.bind(this.sources);
    }
    next(data) {
        this.next2(data);
        this.subNext();
    }
    subNext() {
        this.next = this.next2; //后续直接push，不触发subNext
        this.subInner(this.sources.shift(), _ConcatMap);
        if (this.disposed && this.sources.length === 0) {
            // 最后一个innerSink，需要激活其真实的complete
            this.currentSink.resetComplete();
        }
    }
    tryComplete() {
        if (this.sources.length === 0)
            // 最后一个innerSink，需要激活其真实的complete
            this.currentSink.resetComplete();
        this.dispose();
    }
}
export const concatMap = deliver(ConcatMap);
export const concatMapTo = makeMapTo(concatMap);
class _MergeMap extends InnerSink {
    tryComplete() {
        this.context.inners.delete(this);
        super.dispose();
        if (this.context.inners.size === 0)
            this.context.resetComplete();
    }
}
// type __Maps<C> = C extends MapContext<infer T, infer U, infer R> ? C : never;
// type _Maps<C> = C extends InnerSink<infer T, infer U, infer R, infer> ? Maps<T, U, R, C> : never;
class MergeMap extends Maps {
    constructor() {
        super(...arguments);
        this.inners = new Set();
    }
    next(data) {
        this.subInner(data, _MergeMap);
        this.inners.add(this.currentSink);
    }
    tryComplete() {
        // 最后一个innerSink，需要激活其真实的complete
        if (this.inners.size === 1)
            this.inners.forEach(s => s.resetComplete());
        else
            this.dispose();
    }
}
export const mergeMap = deliver(MergeMap);
export const mergeMapTo = makeMapTo(mergeMap);
class _ExhaustMap extends InnerSink {
    dispose() {
        this.context.resetNext();
        super.dispose();
    }
}
class ExhaustMap extends Maps {
    next(data) {
        this.next = nothing;
        this.subInner(data, _ExhaustMap);
    }
}
export const exhaustMap = deliver(ExhaustMap);
export const exhaustMapTo = makeMapTo(exhaustMap);
class TimeInterval extends Sink {
    constructor() {
        super(...arguments);
        this.start = new Date();
    }
    next(value) {
        this.sink.next({ value, interval: Number(new Date()) - Number(this.start) });
        this.start = new Date();
    }
}
export const timeInterval = deliver(TimeInterval);
class BufferTime extends Sink {
    constructor(sink, miniseconds) {
        super(sink);
        this.miniseconds = miniseconds;
        this.buffer = [];
        this.id = setInterval(() => {
            this.sink.next(this.buffer.concat());
            this.buffer.length = 0;
        }, this.miniseconds);
    }
    next(data) {
        this.buffer.push(data);
    }
    complete() {
        this.sink.next(this.buffer);
        super.complete();
    }
    dispose() {
        clearInterval(this.id);
        super.dispose();
    }
}
export const bufferTime = deliver(BufferTime);
