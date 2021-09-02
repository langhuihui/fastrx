import { Observer, IObserver, deliver, nothing, Observable, Operator } from './common';
export * from './common';
export const pipe = (first: Observable<unknown>, ...cbs: Operator<unknown, unknown>[]) => cbs.reduce((aac, c) => c(aac), first);

export const toPromise = <T>() => (source: Observable<T>) =>
  new Promise<T>((resolve, reject) => {
    let value: T;
    const sink = new Observer<T>();
    sink.next = (d) => (value = d);
    sink.complete = (err?: any) => (err ? reject(err) : resolve(value));
    source(sink);
  });

class Subscribe<T> extends Observer<T> {
  then = nothing;
  constructor(public next = nothing,public error = nothing,public complete = nothing) {
    super();
  }
}
// //SUBSCRIBER
export const subscribe =
  <T>(n: (data: T) => void = nothing, e = nothing, c = nothing) =>
    (source: Observable<T>) => {
      const sink = new Subscribe<T>(n, e, c);
      source(sink);
      return sink;
    };
// // UTILITY
class Tap<T> extends Observer<T> {
  constructor(sink: IObserver<T>, private readonly f: (d: T) => void) {
    super(sink);
  }
  next(data: T) {
    this.f(data);
    super.next(data);
  }
}

export const tap = deliver(Tap);

class Delay<T> extends Observer<T> {
  delayTime!: number;
  buffer: { time: Date; data: T; }[] = [];
  timeoutId!: NodeJS.Timeout;
  constructor(sink: IObserver<T>, delay: number) {
    super(sink);
    this.delayTime = delay;
    this.defer(() => clearTimeout(this.timeoutId));
  }

  delay(delay: number) {
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

  next(data: T) {
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
class CatchError<T, R = T> extends Observer<T, R> {
  constructor(sink: IObserver<R>, private readonly selector: (err: any) => Observable<R>) {
    super(sink);
  }
  error(err: any) {
    this.dispose(false);
    this.selector(err)(this.sink!);
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
