import { reactive, customRef, watch } from 'vue'
const noop = Function.prototype
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
    constructor(name = "") {
        this.name = name
        this.streams = reactive([])
        this.sources = reactive([])
        this.cdData = CoolDown(0.1)
        this.cdSub = CoolDown(0)
        this.source = null
        this.stopCoolDown = true
    }
    pickColor() {
        return this.color ?? 'rgba(255,255,255,.5)'
    }
    toString() {
        return this.name
    }
    clickTag() {
        console.log(this)
    }
    next(index, data) {
        this.streams[index].label = data
        this.color = this.streams[index].color
        this.cdData.value = 1
    }
    complete(index, err) {
        if (err) this.streams[index].label = err
        this.streams[index].status = err ? -1 : 3;
    }
    defer(index) {
        this.cdData.value = 1
        this.streams[index].status = 2
    }
    subscribe(sinkStream) {
        const { source, streams } = this
        this.cdSub.value = 1
        const stream = reactive({ status: 1 })
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
            if (sinkStream) sinkStream.color = stream.color
            while (sinkStream.sink) {
                sinkStream = sinkStream.sink
                sinkStream.color = stream.color
            }

        } else if (stream != sinkStream && sinkStream) {
            stream.sink = sinkStream
        }
        streams.push(stream)
        // const realrx = name == "subscribe" ? fastrx[name] : fastrx[name](...arg)
        // let f = source ? realrx(s => source.subscribe(s)) : realrx
        // this.subscribe = function (...args) {
        //     let sink = args[0]
        //     if (name == "subscribe") {
        //         sink = new Sink()
        //         sink.next = args[0]
        //         sink.complete = err => (err ? args[1] : args[2]) || noop
        //         f = sink => source.subscribe(sink)
        //     }
        //     this.cdSub.value = 1
        //     const newSink = new Sink(sink)
        //     newSink.status = 1
        //     const stream = reactive(newSink);
        //     if (!source) {
        //         stream.color = [
        //             "pink",
        //             "red",
        //             "orange",
        //             "blue",
        //             "green",
        //             "cyan",
        //             "purple",
        //         ][streams.length % 7];
        //     }
        //     sink.color = stream.color
        //     newSink.next = data => {
        //         stream.label = data.toString()
        //         this.cdData.value = 1
        //         sink.next(data);
        //     }
        //     newSink.complete = err => {
        //         stream.status = err ? -1 : 3;
        //         if (err) stream.label = err
        //         this.cdData.value = 1
        //         sink.complete(err);
        //     }
        //     streams.push(stream);
        //     newSink.defer(() => {
        //         stream.status = 2;
        //         this.cdSub.value = 1
        //     })
        //     f(stream);
        //     return stream
        // };
        // return this.subscribe(...args)
    }
}
