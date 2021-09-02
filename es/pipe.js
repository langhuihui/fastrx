import { Observer, deliver, nothing } from './common';
export * from './common';
export const pipe = (first, ...cbs) => cbs.reduce((aac, c) => c(aac), first);
export const toPromise = () => (source) => new Promise((resolve, reject) => {
    let value;
    const sink = new Observer();
    sink.next = (d) => (value = d);
    sink.complete = (err) => (err ? reject(err) : resolve(value));
    source(sink);
});
class Subscribe extends Observer {
    constructor(n = nothing, e = nothing, c = nothing) {
        super();
        this.then = nothing;
        this.next = n;
        this.complete = (err) => (err ? e(err) : c());
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
    init(delay) {
        this.delayTime = delay;
        this.buffer = [];
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
    complete(err) {
        if (err)
            super.complete(err);
        else {
            this.timeoutId = setTimeout(() => super.complete(), this.delayTime);
        }
    }
}
export const delay = deliver(Delay);
class CatchError extends Observer {
    constructor(sink, selector) {
        super(sink);
        this.selector = selector;
    }
    complete(err) {
        if (err) {
            this.selector(err)(this.sink);
        }
        else {
            super.complete();
        }
    }
}
export const catchError = deliver(CatchError);
export * from './producer';
// export * from '../combination';
// export * from '../filtering';
// export * from '../mathematical';
// export * from '../transformation';
// import { subject } from '../producer';
// class GroupBy extends Sink {
//   init(f) {
//     this.f = f;
//     this.groups = new Map();
//   }
//   next(data) {
//     const key = this.f(data);
//     let group = this.groups.get(key);
//     if (!group) {
//       group = subject();
//       group.key = key;
//       this.groups.set(key, group);
//       this.sink.next(group);
//     }
//     group.next(data);
//   }
//   complete(err) {
//     this.groups.forEach((group) => group.complete(err));
//     super.complete(err);
//   }
// }
// export const groupBy = deliver(GroupBy);
// export const Events = {
//   addSource: noop,
//   subscribe: noop,
//   next: noop,
//   complete: noop,
//   defer: noop,
//   pipe: noop,
//   update: noop,
//   create: noop,
// };
// function send(event, payload) {
//   window.postMessage({ source: 'fastrx-devtools-backend', payload: { event, payload } });
// }
// Events.create = (who) => {
//   send('create', { name: who.toString(), id: who.id });
// };
// Events.next = (who, streamId, data) => {
//   send('next', { id: who.id, streamId, data: data && data.toString() });
// };
// Events.complete = (who, streamId, err) => {
//   send('complete', { id: who.id, streamId, err: err ? err.toString() : null });
// };
// Events.defer = (who, streamId) => {
//   send('defer', { id: who.id, streamId });
// };
// Events.addSource = (who, source) => {
//   send('addSource', {
//     id: who.id,
//     name: who.toString(),
//     source: { id: source.id, name: source.toString() },
//   });
// };
// Events.pipe = (who) => {
//   send('pipe', {
//     name: who.toString(),
//     id: who.id,
//     source: { id: who.source.id, name: who.source.toString() },
//   });
// };
// Events.update = (who) => {
//   send('update', { id: who.id, name: who.toString() });
// };
// Events.subscribe = ({ id, end }, sink) => {
//   send('subscribe', {
//     id,
//     end,
//     sink: { nodeId: sink && sink.nodeId, streamId: sink && sink.streamId },
//   });
// };
