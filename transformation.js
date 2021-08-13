import { Sink, deliver } from './common'
import { MapSink } from './fusion'
class Scan extends Sink {
    init(hasSeed, f, seed) {
        this.f = f
        this.aac = seed
        if (!hasSeed) {
            this.next = d => {
                delete this.next
                this.sink.next(this.aac = d)
            }
        }
    }
    next(data) {
        const f = this.f
        this.aac = f(this.aac, data)
        this.sink.next(this.aac)
    }
}
export const scan = (...args) => source => sink => source(new Scan(sink, args.length == 2, ...args))

export const map = f => source => sink => source(sink.fusionMap ? sink.fusionMap(f) : new MapSink(sink, f))
export const mapTo = target => map(x => target)
export const pluck = s => map(d => d[s])

class Pairwise extends Sink {
    init() {
        this.hasLast = false
    }
    next(data) {
        if (this.hasLast) {
            this.sink.next([this.last, data])
        } else {
            this.hasLast = true
        }
        this.last = data
    }
}
export const pairwise = deliver(Pairwise)

class Repeat extends Sink {
    init(count) {
        this.buffer = []
        this.count = count
    }
    next(data) {
        this.buffer.push(data)
        this.sink.next(data)
    }
    complete(err) {
        if (err) super.complete(err)
        else {
            while (this.count--) {
                for (let i = 0, l = this.buffer.length; i < l; this.sink.next(this.buffer[i++])) {
                    if (this.disposed) return
                }
            }
            super.complete()
        }
    }
}

export const repeat = deliver(Repeat)
class _SwitchMap extends Sink {
    init(data, context) {
        this.data = data
        this.context = context
    }
    next(data) {
        const combineResults = this.context.combineResults
        if (combineResults) {
            this.sink.next(combineResults(this.data, data))
        } else {
            this.sink.next(data)
        }
    }
    complete(err) {
        if (this.context.disposed) super.complete(err)
        else this.dispose(false)
    }
}
class SwitchMap extends Sink {
    init(makeSource, combineResults) {
        this.makeSource = makeSource
        this.combineResults = combineResults
        this.index = 0
    }
    next(data) {
        const makeSource = this.makeSource
        if (this.switch) {
            this.switch.disposePass = false
            this.switch.dispose()
        }
        this.switch = new _SwitchMap(this.sink, data, this)
        makeSource(data, this.index++)(this.switch)
    }
    complete(err) {
        if (!this.switch || this.switch.disposed) super.complete(err)
        else this.dispose(false)
    }
}

export const switchMap = deliver(SwitchMap)

export const switchMapTo = (innerSource, combineResults) => switchMap(d => innerSource, combineResults)
class _MergeMap extends Sink {
    init(data, context) {
        this.data = data
        this.context = context
    }
    next(data) {
        const combineResults = this.context.combineResults
        if (combineResults) {
            this.sink.next(combineResults(this.data, data))
        } else {
            this.sink.next(data)
        }
    }
    complete(err) {
        this.context.subDisposed++
        if (this.context.subDisposed == this.context.count && this.context.disposed) super.complete(err)
        else this.dispose(false)
    }
}
class MergeMap extends Sink {
    init(makeSource, combineResults) {
        this.makeSource = makeSource
        this.combineResults = combineResults
        this.subDisposed = 0
        this.count = 0
    }
    next(data) {
        const makeSource = this.makeSource
        makeSource(data, this.count++)(new _MergeMap(this.sink, data, this))
    }
    complete(err) {
        if (this.subDisposed === this.count) super.complete(err)
        else this.dispose(false)
    }
}
export const mergeMap = deliver(MergeMap)
export const mergeMapTo = (innerSource, combineResults) => mergeMap(d => innerSource, combineResults)
class BufferTime extends Sink {
    init(miniseconds) {
        this.buffer = []
        this.id = setInterval(() => {
            this.sink.next(this.buffer.concat());
            this.buffer.length = 0
        }, miniseconds)
        this.defer([clearInterval, , this.id])
    }
    next(data) {
        this.buffer.push(data)
    }
    complete(err) {
        clearInterval(this.id)
        if (!err) this.sink.next(this.buffer)
        super.complete(err)
    }
}

export const bufferTime = deliver(BufferTime)

class TimeInterval extends Sink {
    init() {
        this.start = new Date()
    }
    next(value) {
        this.sink.next({ value, interval: new Date() - this.start });
        this.start = new Date()
    }
}
export const timeInterval = deliver(TimeInterval)