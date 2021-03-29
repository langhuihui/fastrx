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
    }
    next(data) {
        const makeSource = this.makeSource
        if (this.switch) {
            this.switch.disposePass = false
            this.switch.dispose()
        }
        this.switch = new _SwitchMap(this.sink, data, this)
        makeSource(data)(this.switch)
    }
    complete(err) {
        if (!this.switch || this.switch.disposed) super.complete(err)
        else this.dispose(false)
    }
}

export const switchMap = deliver(SwitchMap)

export const switchMapTo = (innerSource, combineResults) => switchMap(d => innerSource, combineResults)

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