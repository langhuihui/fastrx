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
// 不同的调度器实现
const schedulers = {
    // 使用 Promise.resolve().then() - 微任务队列，性能最佳
    promise: (callback) => {
        Promise.resolve().then(callback);
    },
    // 使用 setImmediate - Node.js 环境
    setImmediate: typeof setImmediate !== 'undefined'
        ? (callback) => setImmediate(callback)
        : null,
    // 使用 setTimeout - 兼容性最好的回退方案
    setTimeout: (callback) => setTimeout(callback, 0)
};
// 创建一个高性能的异步调度器，根据环境选择最佳方法
const createAsapScheduler = () => {
    // 优先使用 Promise.resolve().then() - 使用微任务队列，性能最佳
    if (typeof Promise !== 'undefined') {
        return schedulers.promise;
    }
    // 检查是否支持 setImmediate (Node.js 或 IE)
    if (schedulers.setImmediate) {
        return schedulers.setImmediate;
    }
    // 回退到 setTimeout
    return schedulers.setTimeout;
};
// 创建全局调度器实例
let scheduler = createAsapScheduler();
// 导出可配置的 asap 函数
const asap = (f) => (sink) => {
    scheduler(() => f(sink));
};
// 调度器配置函数，允许用户自定义调度方法
const setAsapScheduler = (schedulerType) => {
    if (typeof schedulerType === 'function') {
        // 自定义调度器函数
        scheduler = schedulerType;
    }
    else if (schedulers[schedulerType]) {
        // 预定义的调度器类型
        scheduler = schedulers[schedulerType];
    }
};
// 单独导出调度器配置函数，避免与 Observable 创建函数混淆
export { setAsapScheduler };
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
            // Only create interval if period is explicitly provided and >= 10ms
            // This prevents accidental interval creation when timer is called with extra parameters (like index values 0,1,2,3...)
            if (period) {
                const id = setInterval(() => sink.next(i++), period);
                sink.defer(() => { clearInterval(id); });
            }
            else {
                sink.complete();
            }
        }, delay);
        const deferF = () => clearTimeout(id);
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
    if ("on" in target && "off" in target) {
        return create(_fromEventPattern((h) => target.on(name, h), (h) => target.off(name, h)), "fromEvent", arguments);
    }
    else if ("addListener" in target && "removeListener" in target) {
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
        promise.then((data) => {
            sink.next(data);
            sink.complete();
        }, sink.error.bind(sink));
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
    const read = async (sink) => {
        try {
            if (sink.disposed)
                return;
            const { done, value } = await source.read();
            if (done) {
                sink.complete();
                return;
            }
            else {
                sink.next(value);
                read(sink);
            }
        }
        catch (err) {
            sink.error(err);
        }
    };
    return create((sink) => {
        read(sink);
    }, "fromReader", arguments);
}
export function fromReadableStream(source) {
    return create((sink) => {
        const controller = new AbortController();
        const signal = controller.signal;
        //@ts-ignore
        sink.defer(() => controller.abort('cancelled'));
        source.pipeTo(new WritableStream({
            write(chunk) {
                sink.next(chunk);
            },
            close() {
                sink.complete();
            },
            abort(err) {
                sink.error(err);
            }
        }), { signal }).then(() => sink.complete(), (err) => sink.error(err));
    }, "fromReadableStream", arguments);
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
//# sourceMappingURL=producer.js.map