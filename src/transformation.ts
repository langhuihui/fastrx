import { Sink, ISink, Observable, deliver, nothing } from "./common";


class Scan<T, R, ACC extends R | T> extends Sink<T, ACC> {
    acc!: ACC;
    constructor(sink: ISink<ACC>, private readonly f: (acc: ACC, c: T) => ACC, seed?: ACC) {
        super(sink);
        if (typeof seed === "undefined") {
            this.next = (d: T) => {
                this.acc = d as ACC;
                this.resetNext();
                this.sink.next(this.acc);
            };
        } else {
            this.acc = seed;
        }
    }
    next(data: T) {
        this.sink.next(this.acc = this.f(this.acc, data));
    }
}
export const scan = deliver(Scan);
class Pairwise<T> extends Sink<T, [T, T]> {
    hasLast = false;
    last!: T;
    next(data: T) {
        if (this.hasLast) {
            this.sink.next([this.last, data]);
        } else {
            this.hasLast = true;
        }
        this.last = data;
    }
}
export const pairwise = deliver(Pairwise);
class MapObserver<T, R> extends Sink<T, R>{
    constructor(sink: ISink<R>, private mapper: (data: T) => R, private thisArg?: any) {
        super(sink);
    }
    next(data: T) {
        super.next(this.mapper.call(this.thisArg, data));
    }
}
export const map = deliver(MapObserver);
export const mapTo = <T, R>(target: R) => map<T, R>((_x) => target);
interface TryComplete {
    tryComplete(): void;
}
interface MapContext<T, U, R> extends Sink<T, R>, TryComplete {
    combineResults?: ResultSelector<T, U, R>;
}
class InnerSink<T, U, R, C extends MapContext<T, U, R>> extends Sink<U | R> implements TryComplete {
    constructor(sink: ISink<U | R>, public data: T, public context: C) {
        super(sink);
    }
    next(data: U) {
        const combineResults = this.context.combineResults;
        if (combineResults) {
            this.sink.next(combineResults(this.data, data));
        } else {
            this.sink.next(data);
        }
    }
    // 如果complete先于context的complete触发，则激活原始的context的complete
    tryComplete() {
        this.context.resetComplete();
        this.dispose();
    }
}

type ResultSelector<T, U, R> = (outter: T, inner: U) => R;
class Maps<T, U, R, CS extends InnerSink<T, U, R, MapContext<T, U, R>>> extends Sink<T, R> implements MapContext<T, U, R> {
    currentSink!: CS;
    index = 0;
    constructor(sink: ISink<R>, protected makeSource: (data: T, index: number) => Observable<U>, public combineResults?: ResultSelector<T, U, R>) {
        super(sink);
    }
    subInner<THIS extends Maps<T, U, R, CS>, C extends { new(sink: ISink<R>, data: T, _this: THIS): CS; }>(this: THIS, data: T, c: C) {
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
class _SwitchMap<T, U, R> extends InnerSink<T, U, R, SwitchMap<T, U, R>> {

}
class SwitchMap<T, U, R> extends Maps<T, U, R, _SwitchMap<T, U, R>> {
    next(data: T) {
        if (this.currentSink) {
            this.currentSink.dispose();
        }
        this.subInner(data, _SwitchMap);
    }
}

export const switchMap = deliver(SwitchMap);

function makeMapTo<S, P, R>(f: (ms: () => S, p?: P) => R) {
    return (innerSource: S, combineResults?: P) => f(() => innerSource, combineResults);
}

export const switchMapTo = makeMapTo(switchMap);
class _ConcatMap<T, U, R> extends InnerSink<T, U, R, ConcatMap<T, U, R>> {
    tryComplete() {
        this.dispose();
        if (this.context.sources.length) {
            this.context.subNext();
        } else {
            this.context.resetNext();
            this.context.resetComplete();
        }
    }
}

class ConcatMap<T, U, R> extends Maps<T, U, R, _ConcatMap<T, U, R>>{
    sources: T[] = [];
    next2 = this.sources.push.bind(this.sources);
    next(data: T) {
        this.next2(data);
        this.subNext();
    }
    subNext() {
        this.next = this.next2; //后续直接push，不触发subNext
        this.subInner(this.sources.shift() as T, _ConcatMap);
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

class _MergeMap<T, U, R> extends InnerSink<T, U, R, MergeMap<T, U, R>> {
    tryComplete() {
        this.context.inners.delete(this);
        super.dispose();
        if (this.context.inners.size === 0)
            this.context.resetComplete();
    }
}
// type __Maps<C> = C extends MapContext<infer T, infer U, infer R> ? C : never;
// type _Maps<C> = C extends InnerSink<infer T, infer U, infer R, infer> ? Maps<T, U, R, C> : never;
class MergeMap<T, U, R> extends Maps<T, U, R, _MergeMap<T, U, R>>{
    inners = new Set<_MergeMap<T, U, R>>();
    next(data: T) {
        this.subInner(data, _MergeMap);
        this.inners.add(this.currentSink);
    }
    tryComplete() {
        // 最后一个innerSink，需要激活其真实的complete
        if (this.inners.size === 1)
            this.inners.forEach(s => s.resetComplete());
        else this.dispose();
    }
}
export const mergeMap = deliver(MergeMap);
export const mergeMapTo = makeMapTo(mergeMap);

class _ExhaustMap<T, U, R> extends InnerSink<T, U, R, ExhaustMap<T, U, R>> {
    dispose() {
        this.context.resetNext();
        super.dispose();
    }
}
class ExhaustMap<T, U, R> extends Maps<T, U, R, _ExhaustMap<T, U, R>>{
    next(data: T) {
        this.next = nothing;
        this.subInner(data, _ExhaustMap);
    }
}
export const exhaustMap = deliver(ExhaustMap);
export const exhaustMapTo = makeMapTo(exhaustMap);
class TimeInterval<T> extends Sink<T, { value: T, interval: number; }> {
    start = new Date();
    next(value: T) {
        this.sink.next({ value, interval: Number(new Date()) - Number(this.start) });
        this.start = new Date();
    }
}
export const timeInterval = deliver(TimeInterval);

class BufferTime<T> extends Sink<T, T[]> {
    buffer: T[] = [];
    id = setInterval(() => {
        this.sink.next(this.buffer.concat());
        this.buffer.length = 0;
    }, this.miniseconds);
    constructor(sink: ISink<T[]>, private readonly miniseconds: number) {
        super(sink);
    }
    next(data: T) {
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