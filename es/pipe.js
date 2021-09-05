import { Observer, deliver, nothing } from './common';
export const pipe = (first, ...cbs) => cbs.reduce((aac, c) => c(aac), first);
export const toPromise = () => (source) => new Promise((resolve, reject) => {
    let value;
    const sink = new Observer();
    sink.next = (d) => (value = d);
    sink.complete = (err) => (err ? reject(err) : resolve(value));
    source(sink);
});
class Subscribe extends Observer {
    constructor(next = nothing, error = nothing, complete = nothing) {
        super();
        this.next = next;
        this.error = error;
        this.complete = complete;
        this.then = nothing;
    }
}
// //SUBSCRIBER
export const subscribe = (n = nothing, e = nothing, c = nothing) => (source) => {
    const sink = new Subscribe(n, e, c);
    source(sink);
    return sink;
};
// // UTILITY
class Tap extends Observer {
    constructor(sink, f) {
        super(sink);
        this.f = f;
    }
    next(data) {
        this.f(data);
        super.next(data);
    }
}
export const tap = deliver(Tap);
class Delay extends Observer {
    constructor(sink, delay) {
        super(sink);
        this.buffer = [];
        this.delayTime = delay;
        this.defer(() => clearTimeout(this.timeoutId));
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
class CatchError extends Observer {
    constructor(sink, selector) {
        super(sink);
        this.selector = selector;
    }
    error(err) {
        this.dispose(false);
        this.selector(err)(this.sink);
    }
}
export const catchError = deliver(CatchError);
export * from './common';
export * from './producer';
// export * from '../combination';
// export * from '../filtering';
// export * from '../mathematical';
// export * from '../transformation';
import { subject } from './producer';
class GroupBy extends Observer {
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
export class TimeoutError extends Error {
    constructor(timeout) {
        super(`timeout after ${timeout}ms`);
        this.timeout = timeout;
    }
}
class Timeout extends Observer {
    constructor(sink, timeout) {
        super(sink);
        this.timeout = timeout;
        this.id = setTimeout(() => this.error(new TimeoutError(timeout)), this.timeout);
    }
    next(data) {
        super.next(data);
        clearTimeout(this.id);
        this.next = data => super.next(data);
    }
    complete() {
        clearTimeout(this.id);
        super.complete();
    }
    error(err) {
        clearTimeout(this.id);
        super.error(err);
    }
}
export const timeout = deliver(Timeout);
function send(event, payload) {
    window.postMessage({ source: 'fastrx-devtools-backend', payload: { event, payload } });
}
export const Events = {
    addSource(who, source) {
        send('addSource', {
            id: who.id,
            name: who.toString(),
            source: { id: source.id, name: source.toString() },
        });
    },
    next(who, streamId, data) {
        send('next', { id: who.id, streamId, data: data && data.toString() });
    },
    subscribe({ id, end }, sink) {
        send('subscribe', {
            id,
            end,
            sink: { nodeId: sink && sink.nodeId, streamId: sink && sink.streamId },
        });
    },
    complete(who, streamId, err) {
        send('complete', { id: who.id, streamId, err: err ? err.toString() : null });
    },
    defer(who, streamId) {
        send('defer', { id: who.id, streamId });
    },
    pipe(who) {
        send('pipe', {
            name: who.toString(),
            id: who.id,
            source: { id: who.source.id, name: who.source.toString() },
        });
    },
    update(who) {
        send('update', { id: who.id, name: who.toString() });
    },
    create(who) {
        send('create', { name: who.toString(), id: who.id });
    },
};
