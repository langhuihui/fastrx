import { Sink, ISink, Observable, deliver, Operator } from "./common";
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

class InnerSink<T, U, R, C extends Maps<T, U, R>> extends Sink<U | R>{
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
}
class _SwitchMap<T, U, R> extends InnerSink<T, U, R, SwitchMap<T, U, R>> {
    complete() {
        if (this.context.disposed) super.complete();
        else this.dispose(false);
    }
}
type ResultSelector<T, U, R> = (outter: T, inner: U) => R;
class Maps<T, U, R> extends Sink<T, R>{
    index = 0;
    constructor(sink: ISink<R>, protected makeSource: (data: T, index: number) => Observable<U>, public combineResults?: ResultSelector<T, U, R>) {
        super(sink);
    }
    subInner<THIS extends Maps<T, U, R>, Type extends ISink<U>, C extends { new(sink: ISink<R>, data: T, _this: THIS): Type; }>(this: THIS, data: T, c: C): Type {
        const sink = new c(this.sink, data, this);
        this.makeSource(data, this.index++)(sink);
        return sink;
    }
    error(err: any) {
        this.sink.doDefer();//可取消订阅所有上游
        super.error(err);
    }
}
class SwitchMap<T, U, R> extends Maps<T, U, R> {
    switch!: _SwitchMap<T, U, R>;
    next(data: T) {
        if (this.switch) {
            this.switch.dispose();
        }
        this.switch = this.subInner(data, _SwitchMap);
    }
    complete() {
        if (!this.switch || this.switch.disposed) super.complete();
        else this.dispose(false);
    }
}

export const switchMap = deliver(SwitchMap);


function makeMapTo<S, P, R>(f: (ms: () => S, p?: P) => R) {
    return (innerSource: S, combineResults?: P) => f(() => innerSource, combineResults);
}

export const switchMapTo = makeMapTo(switchMap);
class _ConcatMap<T, U, R> extends InnerSink<T, U, R, ConcatMap<T, U, R>> {
    error(err: any) {
        this.context.running = false;
        super.error(err);
    }
    complete() {
        this.context.running = false;
        this.dispose(false);
        if (this.context.sources.length) {
            this.context.running = true;
            this.context.subInner(this.context.sources.shift() as T, _ConcatMap);
        } else if (this.context.disposed) {
            super.complete();
        }
    }
}

class ConcatMap<T, U, R> extends Maps<T, U, R>{
    sources: T[] = [];
    running = false;
    next(data: T) {
        if (!this.running) {
            this.running = true;
            this.subInner(this.sources.shift() as T, _ConcatMap);
        } else {
            this.sources.push(data);
        }
    }
    complete() {
        if (this.running) this.dispose(false);
        else super.complete();
    }
}

export const concatMap = deliver(ConcatMap);
export const concatMapTo = makeMapTo(concatMap);

class _MergeMap<T, U, R> extends InnerSink<T, U, R, MergeMap<T, U, R>> {
    complete() {
        this.context.subDisposed++;
        if (this.context.subDisposed == this.context.index && this.context.disposed)
            super.complete();
        else this.dispose(false);
    }
}
class MergeMap<T, U, R> extends Maps<T, U, R>{
    subDisposed: number = 0;
    next(data: T) {
        this.subInner(data, _MergeMap);
    }
    complete() {
        if (this.subDisposed === this.index) super.complete();
        else this.dispose(false);
    }
}
export const mergeMap = deliver(MergeMap);
export const mergeMapTo = makeMapTo(mergeMap);

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
    id: ReturnType<typeof setInterval> = setInterval(() => {
        this.sink.next(this.buffer.concat());
        this.buffer.length = 0;
    }, this.miniseconds);
    constructor(sink: ISink<T[]>, private readonly miniseconds: number) {
        super(sink);
        this.defer(() => clearInterval(this.id));
    }
    next(data: T) {
        this.buffer.push(data);
    }
    complete() {
        clearInterval(this.id);
        this.sink.next(this.buffer);
        super.complete();
    }
}

export const bufferTime = deliver(BufferTime);