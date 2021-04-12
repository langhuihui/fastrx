const noop = Function.prototype
import * as fastrx from './index'
const Sink = fastrx.Sink
let COUNT = 0
export const Events = {
    addSource: noop, subscribe: noop, next: noop, complete: noop, defer: noop, pipe: noop,update:noop
}
export class Node {
    constructor(name = "", arg = []) {
        this.name = name
        this.arg = arg
        this.source = null
        this.id = COUNT++
        switch (name) {
            case "subscribe":
            case "toPromise":
            case "toRef":
                this.end = true
                break
            default:
                this.end = false
        }
        if (arg.length) {
            this.args = arg
        }
    }
    toString() {
        return `${this.name}(${this.arg.map(x => typeof x == 'object' || typeof x == 'function' ? '...' : x).join(',')})`
    }
    get unProxy() {
        return this
    }
    //是否属于子流
    checkSubNode(x) {
        if (typeof x != 'object' || x == null) return x
        const isNode = x.unProxy
        if (isNode) {
            Events.addSource(this, isNode)
            return s => {
                s.nodeId = this.id
                s.streamId = 0
                isNode.subscribe(s)
            }
        }
        return x
    }
    //过滤子事件流，放入sources数组中，就能显示
    set args(value) {
        this.arg = value.map(x => typeof x == "function" ? (...arg) => this.checkSubNode(x(...arg)) : this.checkSubNode(x))
    }
    // 通过返回proxy产生链式调用
    pipe() {
        if (this.end) {
            return this.subscribe()
        }
        return new Proxy(this, {
            get(target, prop) {
                if (prop != "subscribe" && (target[prop] || target.hasOwnProperty(prop))) return target[prop]
                if (prop == "subscribe" && target.subscribeSink) return target.subscribeSink
                const sink = target.createSink(prop)
                return target.subscribeSink = (...args) => {
                    sink.args = args
                    Events.update(sink)
                    return sink.pipe()
                }
            }
        })
    }
    createSink(name) {
        const sink = new Node(name)
        sink.source = this
        Events.pipe(sink)
        return sink
    }
    subscribe(sink) {
        const { source, name, arg } = this
        const realrx = fastrx[name](...arg)
        let f = source && !this.end ? realrx(s => {
            s.streamId = streamCount-1
            s.nodeId = this.id
            source.subscribe(s)
        }) : realrx
        let streamCount = 0
        this.subscribe = function (sink) {
            const streamId = streamCount++
            if (this.end) {
                return f(s => {
                    const oNext = s.next
                    const oComplete = s.complete
                    s.next = data => {
                        Events.next(this, streamId, data)
                        oNext(data);
                    }
                    s.complete = err => {
                        Events.complete(this, streamId, err)
                        oComplete(err)
                    }
                    s.streamId = streamId
                    s.nodeId = this.id
                    Events.subscribe(this)
                    source.subscribe(s)
                })
            }

            const newSink = new Sink(sink)
            newSink.next = data => {
                Events.next(this, streamId, data)
                sink.next(data);
            }
            newSink.complete = err => {
                Events.complete(this, streamId, err)
                sink.complete(err);
            }
            newSink.defer(() => {
                Events.defer(this, streamId)
            })
            Events.subscribe(this, sink)
            f(newSink)
            return newSink
        };
        return this.subscribe(sink)
    }
}