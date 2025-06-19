import { Sink, deliver, nothing } from "./common";
import { subject } from "./producer";
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
export const scan = deliver(Scan, "scan");
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
export const pairwise = deliver(Pairwise, "pairwise");
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
export const map = deliver(MapObserver, "map");
export const mapTo = (target) => deliver(MapObserver, "mapTo")((_x) => target);
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
        sink.subscribe(this.makeSource(data, this.index++));
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
export const switchMap = deliver(SwitchMap, "switchMap");
function makeMapTo(f) {
    return (innerSource, combineResults) => f(() => innerSource, combineResults);
}
export const switchMapTo = makeMapTo(deliver(SwitchMap, "switchMapTo"));
class _ConcatMap extends InnerSink {
    tryComplete() {
        this.dispose();
        this.context.isProcessing = false;
        this.context.processNext();
    }
}
class ConcatMap extends Maps {
    constructor() {
        super(...arguments);
        this.sources = [];
        this.isProcessing = false;
        this.sourceCompleted = false;
    }
    next(data) {
        this.sources.push(data);
        if (!this.isProcessing) {
            this.processNext();
        }
    }
    processNext() {
        if (this.sources.length === 0) {
            this.isProcessing = false;
            if (this.sourceCompleted) {
                this.resetNext();
                this.resetComplete();
            }
            return;
        }
        this.isProcessing = true;
        const data = this.sources.shift();
        this.subInner(data, _ConcatMap);
    }
    tryComplete() {
        this.sourceCompleted = true;
        if (!this.isProcessing && this.sources.length === 0) {
            this.resetNext();
            this.resetComplete();
        }
        this.dispose();
    }
}
export const concatMap = deliver(ConcatMap, "concatMap");
export const concatMapTo = makeMapTo(deliver(ConcatMap, "concatMapTo"));
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
export const mergeMap = deliver(MergeMap, "mergeMap");
export const mergeMapTo = makeMapTo(deliver(MergeMap, "mergeMapTo"));
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
export const exhaustMap = deliver(ExhaustMap, "exhaustMap");
export const exhaustMapTo = makeMapTo(deliver(ExhaustMap, "exhaustMapTo"));
class GroupBy extends Sink {
    constructor(sink, f) {
        super(sink);
        this.f = f;
        this.groups = new Map();
    }
    next(data) {
        const key = this.f(data);
        let group = this.groups.get(key);
        if (typeof group === 'undefined') {
            group = subject();
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
    error(err) {
        this.groups.forEach((group) => group.error(err));
        super.error(err);
    }
}
export const groupBy = deliver(GroupBy, "groupBy");
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
export const timeInterval = deliver(TimeInterval, "timeInterval");
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
export const bufferTime = deliver(BufferTime, "bufferTime");
class Delay extends Sink {
    constructor(sink, delay) {
        super(sink);
        this.buffer = [];
        this.delayTime = delay;
    }
    dispose() {
        clearTimeout(this.timeoutId);
        super.dispose();
    }
    delay(delay) {
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
    next(data) {
        if (!this.buffer.length) {
            this.delay(this.delayTime);
        }
        this.buffer.push({ time: new Date(), data });
    }
    complete() {
        this.timeoutId = setTimeout(() => super.complete(), this.delayTime);
    }
}
export const delay = deliver(Delay, "delay");
class CatchError extends Sink {
    constructor(sink, selector) {
        super(sink);
        this.selector = selector;
    }
    error(err) {
        this.dispose();
        this.selector(err)(this.sink);
    }
}
export const catchError = deliver(CatchError, "catchError");
class _Expand extends InnerSink {
    tryComplete() {
        const deleted = this.context.inners.delete(this);
        super.dispose();
        // 只有当成功删除时才检查完成，避免重复检查
        if (deleted) {
            this.context.checkComplete();
        }
    }
    next(data) {
        // 发送数据到输出流
        this.sink.next(data);
        // 递归处理：将新数据通过 project 函数产生新的 Observable 并订阅
        this.context.expandValue(data);
    }
}
class Expand extends Maps {
    constructor(sink, project) {
        super(sink, project);
        this.project = project;
        this.inners = new Set();
        this.sourceCompleted = false;
    }
    next(data) {
        // 发送原始数据到输出流
        this.sink.next(data);
        // 展开数据（递归处理）
        this.expandValue(data);
    }
    expandValue(data) {
        // 创建内部 sink 但不立即订阅
        const innerSink = new _Expand(this.sink, data, this);
        this.currentSink = innerSink;
        this.complete = this.tryComplete;
        innerSink.complete = innerSink.tryComplete;
        // 先添加到 inners，再订阅，避免时序问题
        this.inners.add(innerSink);
        // 现在订阅 Observable
        innerSink.subscribe(this.makeSource(data, this.index++));
    }
    complete() {
        this.sourceCompleted = true;
        this.checkComplete();
    }
    checkComplete() {
        // 只有当源 Observable 完成且所有内部 Observable 都完成时才完成
        if (this.sourceCompleted && this.inners.size === 0) {
            this.resetComplete();
            super.complete();
        }
    }
    tryComplete() {
        // 当源 Observable 完成时，标记源已完成并检查是否可以完成
        this.sourceCompleted = true;
        this.checkComplete();
    }
}
export const expand = deliver(Expand, "expand");
