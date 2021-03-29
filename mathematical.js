import { Sink } from './common'
class Reduce extends Sink {
    init(hasSeed, f, seed) {
        this.f = f
        this.aac = seed
        if (!hasSeed) {
            this.next = d => {
                delete this.next
                this.aac = d
            }
        }
    }
    next(data) {
        const f = this.f
        this.aac = f(this.aac, data)
    }
    complete(err) {
        err || this.sink.next(this.aac)
        super.complete(err)
    }
}
export const reduce = (...args) => source => sink => source(new Reduce(sink, args.length === 2, ...args))
export const count = f => reduce((aac, c) => f(c) ? aac + 1 : aac, 0)
export const max = reduce(Math.max)
export const min = reduce(Math.min)