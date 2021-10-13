import { merge, share } from "./combination";
import { nothing, create, pipe } from "./common";
import { takeUntil } from "./filtering";
import { switchMap } from "./transformation";
export function subject(source) {
    const args = arguments;
    const observable = share()(create((sink) => {
        observable.next = (data) => sink.next(data);
        observable.complete = () => sink.complete();
        observable.error = (err) => sink.error(err);
        source && sink.subscribe(source);
    }, "subject", args));
    observable.next = nothing;
    observable.complete = nothing;
    observable.error = nothing;
    return observable;
}
;
export function defer(f) {
    return create(sink => sink.subscribe(f()), "defer", arguments);
}
export function of(...data) {
    return create(fromArray(data), "of", arguments);
}
const asap = (f) => (sink) => {
    setTimeout(() => f(sink));
};
export function fromArray(data) {
    return create(asap((sink) => {
        for (let i = 0; !sink.disposed && i < data.length; i++) {
            sink.next(data[i]);
        }
        sink.complete();
    }), "fromArray", arguments);
}
export function interval(period) {
    return create((sink) => {
        let i = 0;
        const id = setInterval(() => sink.next(i++), period);
        sink.defer(() => { clearInterval(id); });
        return "interval";
    }, "interval", arguments);
}
export function timer(delay, period) {
    return create((sink) => {
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
    }, "timer", arguments);
}
;
export function fromEventPattern(add, remove) {
    return create((sink) => {
        const n = (d) => sink.next(d);
        sink.defer(() => remove(n));
        add(n);
        return name;
    }, "fromEventPattern", arguments);
}
;
export function fromEvent(target, name) {
    if ("on" in target) {
        return create(fromEventPattern((h) => target.on(name, h), (h) => target.off(name, h)), "fromEvent", arguments);
    }
    else if ("addListener" in target) {
        return create(fromEventPattern((h) => target.addListener(name, h), (h) => target.removeListener(name, h)), "fromEvent", arguments);
    }
    else if ("addEventListener" in target) {
        return create(fromEventPattern((h) => target.addEventListener(name, h), (h) => target.removeEventListener(name, h)), "fromEvent", arguments);
    }
    else
        throw 'target is not a EventDispachter';
}
;
/**
 *
 * @param {window | Worker | EventSource | WebSocket | RTCPeerConnection} target
 * @returns
 */
export function fromMessageEvent(target) {
    return create((sink) => {
        const closeOb = fromEvent(target, 'close');
        const messageOb = fromEvent(target, 'message');
        const errorOb = fromEvent(target, 'error');
        sink.defer(() => target.close());
        sink.subscribe(pipe(merge(messageOb, switchMap(throwError)(errorOb)), takeUntil(closeOb)));
    }, "fromMessageEvent", arguments);
}
;
export function fromPromise(promise) {
    return create((sink) => {
        promise.then(sink.next.bind(sink), sink.error.bind(sink));
    }, "fromPromise", arguments);
}
export function fromFetch(input, init) {
    return create(defer(() => fromPromise(fetch(input, init))), "fromFetch", arguments);
}
export function fromIterable(source) {
    return create(asap((sink) => {
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
    }), "fromIterable", arguments);
}
export function fromAnimationFrame() {
    return create((sink) => {
        let id = requestAnimationFrame(function next(t) {
            if (!sink.disposed) {
                sink.next(t);
                id = requestAnimationFrame(next);
            }
        });
        sink.defer(() => cancelAnimationFrame(id));
    }, "fromAnimationFrame", arguments);
}
export function range(start, count) {
    return create((sink, pos = start, end = count + start) => {
        while (pos < end && !sink.disposed)
            sink.next(pos++);
        sink.complete();
        return "range";
    }, "range", arguments);
}
export function bindCallback(call, thisArg, ...args) {
    return create((sink) => {
        const inArgs = args.concat((res) => (sink.next(res), sink.complete()));
        call.apply(thisArg, inArgs);
    }, "bindCallback", arguments);
}
export function bindNodeCallback(call, thisArg, ...args) {
    return create((sink) => {
        const inArgs = args.concat((err, res) => err ? (sink.error(err)) : (sink.next(res), sink.complete()));
        call.apply(thisArg, inArgs);
    }, "bindNodeCallback", arguments);
}
export function never() {
    return create(() => { }, "never", arguments);
}
;
export function throwError(e) {
    return create(sink => sink.error(e), "throwError", arguments);
}
export function empty() {
    return create(sink => sink.complete(), "empty", arguments);
}
;
