import { Sink, deliver, noop } from './common'
import { reduce } from './mathematical'
import { Filter } from './fusion'
export const filter = f => source => sink => source(sink.fusionFilter ? sink.fusionFilter(f) : new Filter(sink, f))

class Ignore extends Sink {
    next() { }
}
export const ignoreElements = source => sink => source(new Ignore(sink))

class Take extends Sink {
    init(count) {
        this.count = count
    }
    next(data) {
        this.sink.next(data)
        if (--this.count === 0) {
            this.defer()
            this.complete()
        }
    }
}
export const take = deliver(Take)

class TakeUntil extends Sink {
    init(sSrc) {
        this._takeUntil = new Sink(this.sink)
        this._takeUntil.next = () => {
            this.defer()
            this.complete()
        }
        this._takeUntil.complete = noop
        sSrc(this._takeUntil)
    }
    complete(err) {
        //完成事件，单方面终结开关sink
        this._takeUntil.dispose()
        super.complete(err)
    }
}

export const takeUntil = deliver(TakeUntil)

class TakeWhile extends Sink {
    init(f) {
        this.f = f
    }
    next(data) {
        const f = this.f
        if (f(data)) {
            this.sink.next(data)
        } else {
            this.defer()
            this.complete()
        }
    }
}
export const takeWhile = deliver(TakeWhile)

export const takeLast = count => reduce((buffer, d) => {
    buffer.push(d)
    if (buffer.length > count) buffer.shift()
    return buffer
}, [])

class Skip extends Sink {
    init(count) {
        this.count = count
    }
    next() {
        if (--this.count === 0) {
            this.next = super.next
        }
    }
}
export const skip = deliver(Skip)

class _SkipUntil extends Sink {
    next() {
        this.dispose()
        delete this.sourceSink.next
    }
    init(sourceSink) {
        this.sourceSink = sourceSink
    }
}

class SkipUntil extends Sink {
    init(sSrc) {
        this._skipUntil = new _SkipUntil(null, this).subscribe(sSrc)
        this.defer(this._skipUntil)
        this.next = noop
    }
    complete(err) {
        this._skipUntil.dispose()
        super.complete(err)
    }
}
export const skipUntil = deliver(SkipUntil)

class SkipWhile extends Sink {
    init(f) {
        this.f = f
    }
    next(data) {
        const f = this.f
        if (!f(data)) {
            this.next = super.next
            this.next(data)
        }
    }
}
export const skipWhile = deliver(SkipWhile)

const defaultThrottleConfig = {
    leading: true,
    trailing: false
}
class _Throttle extends Sink {
    init(durationSelector, trailing) {
        this.durationSelector = durationSelector
        this.trailing = trailing
        this.hasValue = true
        this.isComplete = false;
    }
    send(data) {
        if (this.hasValue) {
            this.sink.next(data)
            this.isComplete = false
            this.durationSelector(data)(this)
        }
        this.hasValue = false
    }
    next() {
        this.complete()
    }
    complete() {
        this.defer()
        this.isComplete = true
        if (this.trailing) {
            this.send(this.last)
        }
    }
}
class Throttle extends Sink {
    init(durationSelector, config = defaultThrottleConfig) {
        this.durationSelector = durationSelector
        this.leading = config.leading
        this.trailing = config.trailing
        this.hasValue = false
    }

    throttle(data) {
        this._throttle.isComplete = false
        this._throttle.last = data
        this._throttle.hasValue = true
        this.durationSelector(data)(this._throttle)
    }
    next(data) {
        if (!this._throttle || this._throttle.isComplete) {
            if (!this._throttle) {
                this._throttle = new _Throttle(this.sink, this.durationSelector, this.trailing)
                this.defer(this._throttle)
            }

            if (this.leading) {
                this.sink.next(data)
                this.throttle(data)
                this._throttle.hasValue = false
            } else {
                this.throttle(data)
            }
        } else {
            this._throttle.last = data
            this._throttle.hasValue = true
        }
    }
    complete(err) {
        if (err) {
            this._throttle && this._throttle.dispose()
            super.complete(err)
        } else {
            this._throttle && this._throttle.complete()
            super.complete()
        }
    }
}
export const throttle = deliver(Throttle)
const defaultAuditConfig = {
    leading: false,
    trailing: true
}
export const audit = durationSelector => throttle(durationSelector, defaultAuditConfig)
class ThrottleTime extends Sink {
    init(period, config = defaultThrottleConfig) {
        this.config = config
        this.period = period
        this.timerId = null
    }
    next(data) {
        if (this.timerId) {
            this.last = data
            this.hasValue = true
        } else {
            this.timerId = setTimeout(() => {
                this.timerId = null
                if (this.config.trailing && this.hasValue) {
                    this.sink.next(this.last)
                }
            }, this.period)
            if (this.config.leading) {
                this.sink.next(data)
            } else {
                this.last = data
                this.hasValue = true
            }
        }
    }
    complete(err) {
        if (!err) {
            if (this.config.trailing && this.hasValue) {
                this.sink.next(this.last)
            }
        }
        super.complete(err)
    }
}
export const throttleTime = deliver(ThrottleTime)
class DebounceTime extends Sink {
    init(period) {
        this.period = period
        this.timerId = null
    }
    next(data) {
        this.buffer = data
        if (this.timerId) {
            clearTimeout(this.timerId)
        }
        this.timerId = setTimeout(() => {
            this.sink.next(data)
            this.timerId = null
        }, this.period)
    }
    complete(error) {
        if (this.timerId) {
            clearTimeout(this.timerId)
            if (!error && this.hasOwnProperty("buffer")) {
                this.sink.next(this.buffer)
            }
        }
        super.complete(error)
    }
}

export const debounceTime = deliver(DebounceTime)

class _Debounce extends Sink {
    next() {
        this.complete()
    }
    complete(err) {
        this.defer()
        this.sink.next(this.last)
        this.isComplete = true
    }
}
class Debounce extends Sink {
    init(durationSelector) {
        this.durationSelector = durationSelector
    }
    next(data) {
        if (!this._debounce) {
            this._debounce = new _Debounce(this.sink)
            this.defer(this._debounce)
        } else if (this._debounce.isComplete) {
            this._debounce.isComplete = false
        } else {
            this._debounce.defer()
        }
        this.durationSelector(data)(this._debounce)
        this._debounce.last = data
    }
    complete(err) {
        if (err) {
            this._debounce && this._debounce.dispose()
            super.complete(err)
        } else {
            this._debounce && this._debounce.complete()
            super.complete()
        }
    }
}

export const debounce = deliver(Debounce)
class ElementAt extends Sink {
    init(count, defaultValue) {
        this.count = count
        this.value = defaultValue
    }
    next(data) {
        if (this.count-- === 0) {
            this.sink.next(data)
            this.defer()
            super.complete()
        }
    }
    complete(err) {
        if (!err) {
            if (this.value === void 0) err = new Error('not enough elements in sequence')
            else this.sink.next(this.value)
        }
        super.complete(err)
    }
}

export const elementAt = deliver(ElementAt)
export const find = f => source => take(1)(skipWhile(d => !f(d))(source))

class FindIndex extends Sink {
    init(f) {
        this.f = f
        this.i = 0
    }
    next(data) {
        const f = this.f
        if (f(data)) {
            this.sink.next(this.i++)
            this.defer()
            this.complete()
        } else {
            ++this.i
        }
    }
}

export const findIndex = deliver(FindIndex)

class First extends Sink {
    init(f, defaultValue) {
        this.f = f
        this.value = defaultValue
        this.count = 0
    }
    next(data) {
        const f = this.f
        if (!f || f(data, this.count++)) {
            this.value = data
            this.defer()
            this.complete()
        }
    }
    complete(err) {
        if (!err) {
            if (this.value === void 0) err = new Error('no elements in sequence')
            else this.sink.next(this.value)
        }
        super.complete(err)
    }
}

export const first = deliver(First)

class Last extends Sink {
    init(f, defaultValue) {
        this.f = f
        this.value = defaultValue
        this.count = 0
    }
    next(data) {
        const f = this.f
        if (!f || f(data, this.count++)) {
            this.value = data
        }
    }
    complete(err) {
        if (!err) {
            if (this.value === void 0) err = new Error('no elements in sequence')
            else this.sink.next(this.value)
        }
        super.complete(err)
    }
}

export const last = deliver(Last)

class Every extends Sink {
    init(f) {
        this.f = f
        this.ret = void 0
    }
    next(data) {
        const f = this.f
        if (!f(data)) {
            this.ret = false
            this.defer()
            this.complete()
        } else {
            this.ret = true
        }
    }
    complete(err) {
        if (!err) {
            if (this.ret === void 0) err = new Error('no elements in sequence')
            else this.sink.next(true)
        }
        super.complete(err)
    }
}

export const every = deliver(Every)
