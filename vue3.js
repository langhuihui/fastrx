import { watch as _watch, customRef, onUnmounted } from 'vue'
import { Sink } from './common'
export const eventHandler = (once) => {
    const observers = new Set()
    const observable = sink => {
        observers.add(sink)
        sink.defer([observers.delete, observers, sink])
    }
    if (once)
        observable.handler = (...args) => {
            const arg = args.length > 1 ? args : args[0]
            observers.forEach(observer => {
                observer.next(arg)
                observer.complete()
            })
        }
    else
        observable.handler = (...args) => {
            const arg = args.length > 1 ? args : args[0]
            observers.forEach(observer => observer.next(arg))
        }
    return observable
}
export const fromLifeHook = (hook, once = true) => hook(eventHandler(once).handler)
export const watch = (target, option) => sink => sink.defer(_watch(target, (value) => sink.next(value), option))
export const toRef = () => source => customRef((track, trigger) => {
    const sink = new Sink()
    let value;
    sink.next = d => (value = d, trigger())
    source(sink)
    onUnmounted(() => sink.dispose())
    return {
        get() {
            track()
            return value
        },
        set(value) {
            //nothing to do
        }
    }
})