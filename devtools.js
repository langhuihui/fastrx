import { reactive, customRef } from 'vue'
const noop = Function.prototype
import * as fastrx from './index'
const Sink = fastrx.Sink
function CoolDown(min) {
    return customRef((track, trigger) => {
        let value = 0
        let stop = true
        let cooldown = () => {
            value -= 0.05
            trigger();
            if (value >= min) {
                requestAnimationFrame(cooldown)
            } else {
                stop = true
            }
        }
        return {
            get() {
                track();
                return value;
            },
            set(v) {
                value = v
                trigger()
                if (stop) {
                    requestAnimationFrame(cooldown)
                    stop = false
                }
            }
        }
    })
}
export class Node {
    constructor(name = "", arg = []) {
        this.name = name
        this.arg = arg
        this.streams = reactive([])
        this.sources = reactive([])
        this.cdData = CoolDown(0.1)
        this.cdSub = CoolDown(0)
        this.source = null
        this.stopCoolDown = true
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
    pickColor() {
        return this.streams.find(s => s.status == 1)?.color ?? 'rgba(255,255,255,.5)'
    }
    toString() {
        return `${this.name}(${this.arg.map(x => typeof x == 'object' || typeof x == 'function' ? '...' : x).join(',')})`
    }
    clickTag() {
        console.log(this)
    }
    get unProxy() {
        return this
    }
    //是否属于子流
    checkSubNode(x) {
        const isNode = x.unProxy
        if (isNode) {
            this.sources.push(isNode)
            return s => isNode.subscribe(s)
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
            fastrx.rxInstances.push(this)
            return this.subscribe()
        }
        return new Proxy(this, {
            get(target, prop) {
                if (target[prop] || target.hasOwnProperty(prop)) return target[prop]
                let sink = new Node(prop)
                sink.source = target
                return (...args) => {
                    sink.args = args
                    return sink.pipe()
                }
            }
        })
    }
    subscribe(sink) {
        const { source, name, streams, arg } = this
        const realrx = fastrx[name](...arg)
        let f = source && !this.end ? realrx(s => source.subscribe(s)) : realrx
        this.subscribe = function (sink) {
            if (this.end) {
                return f(s => source.subscribe(s))
            }
            this.cdSub.value = 1
            const newSink = new Sink(sink)
            newSink.status = 1
            const stream = reactive(newSink);
            if (!source) {
                stream.color = [
                    "pink",
                    "red",
                    "orange",
                    "blue",
                    "green",
                    "cyan",
                    "purple",
                ][streams.length % 7];
            }
            sink.color = stream.color
            newSink.next = data => {
                stream.current = data
                this.cdData.value = 1
                sink.next(data);
            }
            newSink.complete = err => {
                stream.status = err ? -1 : 3;
                if (err) stream.current = err
                this.cdData.value = 1
                sink.complete(err);
            }
            streams.push(stream);
            newSink.defer(() => {
                stream.status = 2;
                this.cdSub.value = 1
            })
            f(stream)
            return stream
        };
        return this.subscribe(sink)
    }
}
// const observables = Object.keys(fastrx).filter((x) => {
//     switch (x) {
//         case "default":
//         case "pipe":
//         case "toPromise":
//         case "toRef":
//         case "reusePipe":
//         case "Sink":
//             return false;
//     }
//     return true;
// });