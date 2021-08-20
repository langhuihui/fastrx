'use strict';

function noop() {} //第一次调用有效
class Sink {
  constructor(sink, ...args) {
    this.defers = new Set();
    this.sink = sink;
    this.init(...args);
    if (sink) sink.defers.add(this);
  }

  init() {}

  set disposePass(value) {
    if (!this.sink) return;
    if (value) this.sink.defers.add(this);else this.sink.defers.delete(this);
  }

  next(data) {
    this.sink && this.sink.next(data);
  }

  complete(err) {
    this.sink && this.sink.complete(err);
    this.dispose(false);
  }

  error(err) {
    this.complete(err);
  }

  dispose(defer = true) {
    this.disposed = true;
    this.complete = noop;
    this.next = noop;
    this.dispose = noop;
    this.subscribes = this.subscribe = noop;
    defer && this.defer(); //销毁时终止事件源
  }

  defer(add) {
    if (add) {
      this.defers.add(add);
    } else {
      this.defers.forEach(defer => {
        switch (true) {
          case defer.dispose != void 0:
            defer.dispose();
            break;

          case typeof defer == 'function':
            defer();
            break;

          case defer.length > 0:
            {
              let [f, thisArg, ...args] = defer;
              if (f.call) f.call(thisArg, ...args);else f(...args);
            }
            break;
        }
      });
      this.defers.clear();
    }
  }

  subscribe(source) {
    source(this);
    return this;
  }

  subscribes(sources) {
    sources.forEach(source => source(this));
  }

}
const deliver = Class => (...args) => source => sink => source(new Class(sink, ...args));

class Take extends Sink {
  init(count) {
    this.count = count;
  }

  next(data) {
    this.sink.next(data);

    if (--this.count === 0) {
      this.defer();
      this.complete();
    }
  }

}

const take = deliver(Take);

const fromArray = array => sink => {
  let pos = 0;
  const l = array.length;

  while (pos < l && !sink.disposed) sink.next(array[pos++]);

  sink.complete();
};
const of = (...items) => fromArray(items);
const fromPromise = source => sink => {
  source.then(d => (sink.next(d), sink.complete())).catch(e => sink.complete(e));
};
const fromIterable = source => sink => {
  try {
    for (let data of source) {
      sink.next(data);
      if (sink.disposed) return;
    }

    sink.complete();
  } catch (err) {
    sink.complete(err);
  }
};
const from = source => {
  switch (true) {
    case source instanceof Array:
      return fromArray(source);

    case source instanceof Promise:
      return fromPromise(source);

    case source[Symbol.iterator] && typeof source[Symbol.iterator] === 'function':
      return fromIterable(source);

    default:
      return of(source);
  }
};

/* eslint-disable require-jsdoc */
const pipe = (first, ...cbs) => cbs.reduce((aac, c) => c(aac), first);

const subscribe = (n = noop, e = noop, c = noop) => source => {
  const sink = new Sink();
  sink.next = n;

  sink.complete = err => err ? e(err) : c();

  sink.then = noop;
  source(sink);
  return sink;
}; // // UTILITY

pipe(from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), take(4), subscribe(console.log));
