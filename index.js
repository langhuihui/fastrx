import { Sink, deliver, noop } from './common'
export * from './common'
export const pipe = (first, ...cbs) => cbs.reduce((aac, c) => c(aac), first);
class Reuse {
    constructor(subscribe, ...args) {
        this.subscribe = subscribe
        this.source = exports.pipe(...args)
    }
    start() {
        this.subscriber = this.subscribe(this.source)
    }
    stop() {
        this.subscriber && this.subscriber.dispose()
    }
}

// //在pipe的基础上增加了start和stop方法，方便反复调用
export const reusePipe = (...args) => new Reuse(...args)

export const toPromise = () => source => new Promise((resolve, reject) => {
    const sink = new Sink()
    sink.next = d => sink.value = d
    sink.complete = err => err ? reject(err) : resolve(sink.value)
    source(sink)
})

// //SUBSCRIBER
export const subscribe = (n, e = noop, c = noop) => source => {
    const sink = new Sink()
    sink.next = n
    sink.complete = err => err ? e(err) : c()
    source(sink)
    return sink
}
// // UTILITY 
class Tap extends Sink {
    init(f) {
        this.f = f
    }
    next(data) {
        const f = this.f
        f(data)
        this.sink.next(data)
    }
}

export const tap = deliver(Tap)

class Delay extends Sink {
    init(delay) {
        this.delayTime = delay
        this.buffer = []
        this.timeoutId = [clearTimeout, ,]
        this.defer(this.timeoutId)
    }
    delay(delay) {
        this.timeoutId[2] = setTimeout(this.pop, delay, this)
    }
    pop(_this) {
        const { time: lastTime, data } = _this.buffer.shift()
        _this.sink.next(data)
        if (_this.buffer.length) {
            _this.delay(_this.buffer[0].time - lastTime)
        }
    }
    next(data) {
        if (!this.buffer.length) {
            this.delay(this.delayTime)
        }
        this.buffer.push({ time: new Date, data })
    }
    complete(err) {
        if (err) this.sink.complete(err)
        else {
            this.timeoutId[2] = setTimeout(() => this.sink.complete(), this.delayTime)
        }
    }
}
export const delay = deliver(Delay)
class CatchError extends Sink {
    init(selector) {
        this.selector = selector
    }
    complete(err) {
        if (err) {
            this.selector(err)(this.sink)
        } else {
            super.complete()
        }
    }
}
export const catchError = deliver(CatchError)
import * as combination from './combination'
import * as filtering from './filtering'
import * as mathematical from './mathematical'
import * as producer from './producer'
import * as transformation from './transformation'
import * as vue3 from './vue3'
export * from './combination'
export * from './filtering'
export * from './mathematical'
export * from './producer'
export * from './transformation'
export * from './vue3'
import { Node, Events } from './devtools'
const observables = { delay, tap, toPromise, subscribe, catchError, ...combination, ...filtering, ...mathematical, ...producer, ...transformation, ...vue3 }
let dev_obs = {}
for (let key in observables) {
    dev_obs[key] = (...arg) => (new Node(key, arg)).pipe()
}
function createRx() {
    if (typeof Proxy == 'undefined') {
        const prototype = {};
        //将一个Observable函数的原型修改为具有所有operator的方法
        const rx = f => Object.setPrototypeOf(f, prototype);
        //提供动态添加Obserable以及operator的方法
        rx.set = ext => {
            for (let key in ext) {
                const f = ext[key]
                switch (key) {
                    case 'Sink':
                    case 'pipe':
                    case 'reusePipe':
                        break
                    case 'subscribe':
                        prototype[key] = function (...args) { return f(...args)(this) }
                        break
                    case 'toPromise':
                        prototype[key] = function () { return f(this) }
                        break
                    default:
                        prototype[key] = function (...args) { return rx(f(...args)(this)) }
                        rx[key] = (...args) => rx(f(...args))
                }
            }
        }
        rx.set(observables)
        return rx
    } else {
        const rxProxy = {
            get: (target, prop) => target[prop] || ((...args) => new Proxy(observables[prop](...args)(target), rxProxy))
        }
        return new Proxy(f => new Proxy(f, rxProxy), {
            get: (target, prop) => inspect() ? dev_obs[prop] : (...args) => new Proxy(observables[prop](...args), rxProxy),
            set: (target, prop, value) => observables[prop] = value
        })
    }
}
function inspect() {
    return window?.__FASTRX_DEVTOOLS__
}
function send(event, payload) {
    window.postMessage({ source: "fastrx-devtools-backend", payload: { event, payload } })
}
Events.next = (who, streamId, data) => {
    send("next", { id: who.id, streamId, data: data.toString() })
}
Events.complete = (who, streamId, err) => {
    send("complete", { id: who.id, streamId, err: err ? err.toString() : null })
}
Events.defer = (who, streamId) => {
    send("defer", { id: who.id, streamId })
}
Events.addSource = (who, source) => {
    send("addSource", { id: who.id, name: who.toString(), source: { id: source.id, name: source.toString() } })
}
Events.pipe = (who) => {
    send("pipe", { name: who.toString(), id: who.id, source: { id: who.source.id, name: who.source.toString() } })
}
Events.subscribe = ({ id, end }, sink) => {
    send("subscribe", { id, end, sink: { nodeId: sink?.nodeId, streamId: sink?.streamId } })
}
export default createRx()