import { Sink, LastSink, deliver, nothing, create, Inspect, Events } from "./common";
class Share extends LastSink {
    constructor(source) {
        super();
        this.source = source;
        this.sinks = new Set();
    }
    add(sink) {
        sink.defer(() => this.remove(sink));
        if (this.sinks.add(sink).size === 1) {
            this.reset();
            this.subscribe(this.source);
        }
    }
    remove(sink) {
        this.sinks.delete(sink);
        if (this.sinks.size === 0) {
            this.dispose();
        }
    }
    next(data) {
        this.sinks.forEach((s) => s.next(data));
    }
    complete() {
        this.sinks.forEach((s) => s.complete());
        this.sinks.clear();
    }
    error(err) {
        this.sinks.forEach((s) => s.error(err));
        this.sinks.clear();
    }
}
export function share() {
    return (source) => {
        const share = new Share(source);
        if (source instanceof Inspect) {
            const ob = create((observer) => {
                share.add(observer);
            }, "share", arguments);
            share.sourceId = ob.id;
            ob.source = source;
            Events.pipe(ob);
            return ob;
        }
        return create(share.add.bind(share), "share", arguments);
    };
}
;
export function merge(...sources) {
    return create((sink) => {
        const merge = new Sink(sink);
        let nLife = sources.length;
        merge.complete = () => {
            if (--nLife === 0) {
                sink.complete();
            }
        };
        sources.forEach(merge.bindSubscribe);
    }, "merge", arguments);
}
export function race(...sources) {
    return create((sink) => {
        const sinks = new Map();
        sources.forEach((source) => {
            const r = new Sink(sink);
            sinks.set(source, r);
            r.complete = () => {
                sinks.delete(source);
                if (sinks.size === 0) { //特殊情况：所有流都没有数据
                    sink.complete();
                }
                else {
                    r.dispose();
                }
            };
            r.next = (data) => {
                sinks.delete(source); //先排除自己，防止自己调用dispose
                sinks.forEach((s) => s.dispose()); //其他所有流全部取消订阅
                r.resetNext();
                r.resetComplete();
                r.next(data);
            };
        });
        sources.forEach((source) => sinks.get(source).subscribe(source));
    }, "race", arguments);
}
export function concat(...sources) {
    return create(sink => {
        let pos = 0;
        const len = sources.length;
        const s = new Sink(sink);
        s.complete = () => {
            if (pos < len && !s.disposed) {
                s.doDefer();
                s.subscribe(sources[pos++]);
            }
            else
                sink.complete();
        };
        s.complete();
    }, "concat", arguments);
}
export function shareReplay(bufferSize) {
    return (source) => {
        const share = new Share(source);
        const buffer = [];
        share.next = function (data) {
            buffer.push(data);
            if (buffer.length > bufferSize) {
                buffer.shift();
            }
            this.sinks.forEach((s) => s.next(data));
        };
        return create(sink => {
            sink.defer(() => share.remove(sink));
            buffer.forEach((cache) => sink.next(cache));
            share.add(sink);
        }, "shareReplay", arguments);
    };
}
export function iif(condition, trueS, falseS) {
    return create((sink) => condition() ? trueS(sink) : falseS(sink), "iif", arguments);
}
export function combineLatest(...sources) {
    return create((sink) => {
        const nTotal = sources.length;
        let nRun = nTotal; //剩余未发出事件的事件流数量
        let nLife = nTotal; //剩余未完成的事件流数量
        const array = new Array(nTotal);
        const onComplete = () => {
            if (--nLife === 0)
                sink.complete();
        };
        const s = (source, i) => {
            const ss = new Sink(sink);
            ss.next = data => {
                if (--nRun === 0) {
                    ss.next = data => {
                        array[i] = data;
                        sink.next(array);
                    };
                    ss.next(data);
                }
                else {
                    array[i] = data;
                }
            };
            ss.complete = onComplete;
            ss.subscribe(source);
        };
        sources.forEach(s);
    }, "combineLatest", arguments);
}
export function zip(...sources) {
    return create((sink) => {
        const nTotal = sources.length;
        let nLife = nTotal; //剩余未完成的事件流数量
        const array = new Array(nTotal);
        const onComplete = () => {
            if (--nLife === 0)
                sink.complete();
        };
        const s = (source, i) => {
            const ss = new Sink(sink);
            const buffer = [];
            array[i] = buffer;
            ss.next = data => {
                buffer.push(data);
                if (array.every(x => x.length)) {
                    sink.next(array.map(x => x.shift()));
                }
            };
            ss.complete = onComplete;
            ss.subscribe(source);
        };
        sources.forEach(s);
    }, "zip", arguments);
}
export function startWith(...xs) {
    return (inputSource) => create((sink, pos = 0, l = xs.length) => {
        while (pos < l && !sink.disposed) {
            sink.next(xs[pos++]);
        }
        sink.disposed || sink.subscribe(inputSource);
    }, "startWith", arguments);
}
class WithLatestFrom extends Sink {
    constructor(sink, ...sources) {
        super(sink);
        const s = new Sink(this.sink);
        s.next = (data) => (this.buffer = data);
        s.complete = nothing;
        s.subscribe(combineLatest(...sources));
    }
    next(data) {
        if (this.buffer) {
            this.sink.next([data, ...this.buffer]);
        }
    }
}
export const withLatestFrom = deliver(WithLatestFrom, "withLatestFrom");
class BufferCount extends Sink {
    constructor(sink, bufferSize, startBufferEvery) {
        super(sink);
        this.bufferSize = bufferSize;
        this.startBufferEvery = startBufferEvery;
        this.buffer = [];
        this.count = 0;
        if (this.startBufferEvery) {
            this.buffers = [[]];
        }
    }
    next(data) {
        if (this.startBufferEvery) {
            if (this.count++ === this.startBufferEvery) {
                this.buffers.push([]);
                this.count = 1;
            }
            this.buffers.forEach((buffer) => {
                buffer.push(data);
            });
            if (this.buffers[0].length === this.bufferSize) {
                this.sink.next(this.buffers.shift());
            }
        }
        else {
            this.buffer.push(data);
            if (this.buffer.length === this.bufferSize) {
                this.sink.next(this.buffer);
                this.buffer = [];
            }
        }
    }
    complete() {
        if (this.buffer.length) {
            this.sink.next(this.buffer);
        }
        else if (this.buffers.length) {
            this.buffers.forEach((buffer) => this.sink.next(buffer));
        }
        super.complete();
    }
}
export const bufferCount = deliver(BufferCount, "bufferCount");
// export function operator<T, R, ARG extends unknown[]>(f: (...args: [ISink<R>, ...ARG]) => ISink<T>) {
//   return (...args: ARG): (Operator<T, R>) => source => sink => f(sink, ...args).subscribe(source);
// }
class Buffer extends Sink {
    constructor(sink, closingNotifier) {
        super(sink);
        this.buffer = [];
        const s = new Sink(sink);
        s.next = (_data) => {
            sink.next(this.buffer);
            this.buffer = [];
        };
        s.complete = nothing;
        s.subscribe(closingNotifier);
    }
    next(data) {
        this.buffer.push(data);
    }
    complete() {
        if (this.buffer.length) {
            this.sink.next(this.buffer);
        }
        super.complete();
    }
}
export const buffer = deliver(Buffer, "buffer");
