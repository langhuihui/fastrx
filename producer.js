import { noop } from './common';
import { share } from './combination';
export const subject = (source) => {
  let subSink = null;
  const observable = share()((sink) => {
    subSink = sink;
    source && source(subSink);
  });
  observable.next = (d) => subSink && subSink.next(d);
  observable.complete = () => subSink && subSink.complete();
  observable.error = (err) => subSink && subSink.complete(err);
  return observable;
};

export const fromArray = (array) => (sink) => {
  let pos = 0;
  const l = array.length;
  while (pos < l && !sink.disposed) sink.next(array[pos++]);
  sink.complete();
};
export const of = (...items) => fromArray(items);
export const interval = (period) => (sink) => {
  let i = 0;
  sink.defer([clearInterval, , setInterval(() => sink.next(i++), period)]);
};
export const timer = (delay, period) => (sink) => {
  const defer = [
    clearTimeout,
    ,
    setTimeout(() => {
      if (period) {
        defer[0] = clearInterval;
        let i = 0;
        defer[2] = setInterval(() => sink.next(i++), period);
      } else {
        sink.next(0);
        sink.complete();
      }
    }, delay),
  ];
  sink.defer(defer);
};
export const fromAnimationFrame = () => (sink) => {
  function next(t) {
    sink.next(t);
    defer[2] = requestAnimationFrame(next);
  }
  const defer = [cancelAnimationFrame, , requestAnimationFrame(next)];
  sink.defer(defer);
};
export const fromEventPattern = (add, remove) => (sink) => {
  const n = (d) => sink.next(d);
  sink.defer([remove, , n]);
  add(n);
};
export const fromEvent = (target, name) => {
  const addF = ['on', 'addEventListener', 'addListener'].find(
    (x) => typeof target[x] == 'function'
  );
  const removeF = ['off', 'removeEventListener', 'removeListener'].find(
    (x) => typeof target[x] == 'function'
  );
  if (addF && removeF)
    return fromEventPattern(
      (handler) => target[addF](name, handler),
      (handler) => target[removeF](name, handler)
    );
  else throw 'target is not a EventDispachter';
};
export const fromVueEvent = (vm, name) => (sink) => {
  const ls = (e) => sink.next(e);
  vm.$on(name, ls);
  sink.defer([vm.$off, vm, ls]);
};
export const fromVueEventOnce = (vm, name) => (sink) => vm.$once(name, (e) => sink.next(e));

export const fromEventSource = (src, arg) => (sink) => {
  if (typeof EventSource == 'undefined') {
    return sink.complete(new Error('No EventSource defined!'));
  }
  const evtSource = new EventSource(src, arg);
  evtSource.onerror = (err) => sink.complete(err);
  evtSource.onmessage = (evt) => sink.next(evt.data);
  sink.defer([evtSource.close, evtSource]);
};
export const fromFetch = (url, opt) => (sink) => {
  fetch(url, opt)
    .then((res) => {
      sink.next(res);
      sink.complete();
    })
    .catch((err) => sink.complete(err));
};
export const fromNextTick = (vm) => (sink) => {
  vm.$nextTick(() => {
    sink.next(vm);
    sink.complete();
  });
};
export const range =
  (start, count) =>
  (sink, pos = start, end = count + start) => {
    while (pos < end && !sink.disposed) sink.next(pos++);
    sink.complete();
  };

export const fromPromise = (source) => (sink) => {
  source.then((d) => (sink.next(d), sink.complete())).catch((e) => sink.complete(e));
};

export const fromIterable = (source) => (sink) => {
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
export const from = (source) => {
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
export const bindCallback =
  (call, thisArg, ...args) =>
  (sink) => {
    const inArgs = args.concat(
      (...rargs) => (sink.next(rargs.length > 1 ? rargs : rargs[0]), sink.complete())
    );
    call.apply ? call.apply(thisArg, inArgs) : call(...inArgs);
  };
export const bindNodeCallback =
  (call, thisArg, ...args) =>
  (sink) => {
    const inArgs = args.concat((err, ...rargs) =>
      err ? sink.complete(err) : (sink.next(rargs.length > 1 ? rargs : rargs[0]), sink.complete())
    );
    call.apply ? call.apply(thisArg, inArgs) : call(...inArgs);
  };
export const never = () => noop;
export const throwError = (e) => (sink) => sink.complete(e);
export const empty = () => throwError();
