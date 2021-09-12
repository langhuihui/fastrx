import { merge, share } from "./combination";
import { nothing } from "./common";
import { takeUntil } from "./filtering";
import { pipe } from "./pipe";
import { switchMap } from "./transformation";
export const subject = (source) => {
    const observable = share()((sink) => {
        observable.next = (data) => sink.next(data);
        observable.complete = () => sink.complete();
        observable.error = (err) => sink.error(err);
        source && source(sink);
    });
    observable.next = nothing;
    observable.complete = nothing;
    observable.error = nothing;
    return observable;
};
export const defer = (f) => (sink) => f()(sink);
export const of = (...data) => fromArray(data);
const asap = (f) => (sink) => setTimeout(() => f(sink));
export const fromArray = (data) => asap((sink) => {
    for (const d of data) {
        if (sink.disposed)
            return;
        sink.next(d);
    }
    sink.complete();
});
export const interval = (period) => (sink) => {
    let i = 0;
    const id = setInterval(() => sink.next(i++), period);
    sink.defer(() => { clearInterval(id); });
};
export const timer = (delay, period = 0) => (sink) => {
    let i = 0;
    const id = setTimeout(() => {
        sink.removeDefer(deferF);
        sink.next(i++);
        if (period) {
            const id = setInterval(() => sink.next(i++), period);
            sink.defer(() => { clearInterval(id); });
        }
        else {
            sink.complete();
        }
    }, delay);
    const deferF = () => { clearTimeout(id); };
    sink.defer(deferF);
};
export const fromEventPattern = (add, remove) => (sink) => {
    const n = (d) => sink.next(d);
    sink.defer(() => remove(n));
    add(n);
};
export const fromEvent = (target, name) => {
    if ("on" in target) {
        return fromEventPattern((h) => target.on(name, h), (h) => target.off(name, h));
    }
    else if ("addListener" in target) {
        return fromEventPattern((h) => target.addListener(name, h), (h) => target.removeListener(name, h));
    }
    else if ("addEventListener" in target) {
        return fromEventPattern((h) => target.addEventListener(name, h), (h) => target.removeEventListener(name, h));
    }
    else
        throw 'target is not a EventDispachter';
};
/**
 *
 * @param {window | Worker | EventSource | WebSocket | RTCPeerConnection} target
 * @returns
 */
export const fromMessageEvent = (target) => (sink) => {
    const closeOb = fromEvent(target, 'close');
    const messageOb = fromEvent(target, 'message');
    const errorOb = fromEvent(target, 'error');
    pipe(merge(messageOb, switchMap(throwError)(errorOb)), takeUntil(closeOb))(sink);
    sink.defer(() => target.close());
};
export const fromPromise = (promise) => (sink) => {
    promise.then(sink.next.bind(sink), sink.error.bind(sink));
};
export const fromFetch = (input, init) => defer(() => fromPromise(fetch(input, init)));
export const fromIterable = (source) => asap((sink) => {
    try {
        for (const data of source) {
            if (sink.disposed)
                return;
            sink.next(data);
        }
        sink.complete();
    }
    catch (err) {
        sink.error(err);
    }
});
export const fromAnimationFrame = () => (sink) => {
    let id;
    function next(t) {
        if (!sink.disposed) {
            sink.next(t);
            id = requestAnimationFrame(next);
        }
    }
    id = requestAnimationFrame(next);
    sink.defer(() => cancelAnimationFrame(id));
};
export const range = (start, count) => (sink, pos = start, end = count + start) => {
    while (pos < end && !sink.disposed)
        sink.next(pos++);
    sink.complete();
};
export const bindCallback = (call, thisArg, ...args) => (sink) => {
    const inArgs = args.concat((res) => (sink.next(res), sink.complete()));
    call.apply(thisArg, inArgs);
};
export const bindNodeCallback = (call, thisArg, ...args) => (sink) => {
    const inArgs = args.concat((err, res) => err ? (sink.error(err)) : (sink.next(res), sink.complete()));
    call.apply(thisArg, inArgs);
};
export const never = () => nothing;
export const throwError = (e) => (sink) => sink.error(e);
export const empty = () => (sink) => sink.complete();
