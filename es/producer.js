var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { share } from "./combination";
import { nothing, create } from "./common";
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
const asap = (f) => (sink) => {
    setTimeout(() => f(sink));
};
const _fromArray = (data) => asap((sink) => {
    for (let i = 0; !sink.disposed && i < data.length; i++) {
        sink.next(data[i]);
    }
    sink.complete();
});
export function of(...data) {
    return create(_fromArray(data), "of", arguments);
}
export function fromArray(data) {
    return create(_fromArray(data), "fromArray", arguments);
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
function _fromEventPattern(add, remove) {
    return (sink) => {
        const n = (d) => sink.next(d);
        sink.defer(() => remove(n));
        add(n);
    };
}
export function fromEventPattern(add, remove) {
    return create(_fromEventPattern(add, remove), "fromEventPattern", arguments);
}
;
export function fromEvent(target, name) {
    if ("on" in target) {
        return create(_fromEventPattern((h) => target.on(name, h), (h) => target.off(name, h)), "fromEvent", arguments);
    }
    else if ("addListener" in target) {
        return create(_fromEventPattern((h) => target.addListener(name, h), (h) => target.removeListener(name, h)), "fromEvent", arguments);
    }
    else if ("addEventListener" in target) {
        return create(_fromEventPattern((h) => target.addEventListener(name, h), (h) => target.removeEventListener(name, h)), "fromEvent", arguments);
    }
    else
        throw 'target is not a EventDispachter';
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
export function fromReader(source) {
    const read = (sink) => __awaiter(this, void 0, void 0, function* () {
        if (sink.disposed)
            return;
        const { done, value } = yield source.read();
        if (done) {
            sink.complete();
            return;
        }
        else {
            sink.next(value);
            yield read(sink);
        }
    });
    return create((sink) => {
        read(sink);
    }, "fromReader", arguments);
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
