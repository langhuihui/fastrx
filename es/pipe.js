import { Sink, deliver, nothing, LastSink, TimeoutError } from './common';
export function pipe(first, ...cbs) {
    return cbs.reduce((aac, c) => c(aac), first);
}
export const toPromise = () => (source) => new Promise((resolve, reject) => {
    let value;
    source(new Subscribe((d) => (value = d), reject, () => resolve(value)));
});
export class Subscribe extends LastSink {
    constructor(next = nothing, _error = nothing, _complete = nothing) {
        super();
        this.next = next;
        this._error = _error;
        this._complete = _complete;
        this.then = nothing;
    }
    complete() {
        this.dispose();
        this._complete();
    }
    error(err) {
        this.dispose();
        this._error(err);
    }
}
// //SUBSCRIBER
export const subscribe = (n = nothing, e = nothing, c = nothing) => (source) => {
    const sink = new Subscribe(n, e, c);
    source(sink);
    return sink;
};
// // UTILITY
export const tap = (ob) => (source) => (sink) => {
    const observer = new Sink(sink);
    if (ob instanceof Function) {
        observer.next = (data) => { ob(data); sink.next(data); };
    }
    else {
        if (ob.next)
            observer.next = (data) => { ob.next(data); sink.next(data); };
        if (ob.complete)
            observer.complete = () => { ob.complete(); sink.complete(); };
        if (ob.error)
            observer.error = (err) => { ob.error(err); sink.error(err); };
    }
    source(observer);
};
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
export const delay = deliver(Delay);
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
export const catchError = deliver(CatchError);
import { subject } from './producer';
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
export const groupBy = deliver(GroupBy);
class Timeout extends Sink {
    constructor(sink, timeout) {
        super(sink);
        this.timeout = timeout;
        this.id = setTimeout(() => this.error(new TimeoutError(this.timeout)), this.timeout);
    }
    next(data) {
        super.next(data);
        clearTimeout(this.id);
        this.next = super.next;
    }
    dispose() {
        clearTimeout(this.id);
        super.dispose();
    }
}
export const timeout = deliver(Timeout);
