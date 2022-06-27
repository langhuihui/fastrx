import { nothing, Sink, deliver, TimeoutError, Subscribe, Events, Inspect, create } from "./common";
export const toPromise = () => (source) => new Promise((resolve, reject) => {
    let value;
    new Subscribe(source, (d) => (value = d), reject, () => resolve(value));
});
export const toReadableStream = () => (source) => {
    let subscriber;
    return new ReadableStream({
        start(controller) {
            subscriber = new Subscribe(source, controller.enqueue.bind(controller), controller.error.bind(controller), controller.close.bind(controller));
        },
        cancel() {
            subscriber.dispose();
        }
    });
};
// //SUBSCRIBER
export const subscribe = (n = nothing, e = nothing, c = nothing) => (source) => new Subscribe(source, n, e, c);
// // UTILITY
class Tap extends Sink {
    constructor(sink, ob) {
        super(sink);
        if (ob instanceof Function) {
            this.next = (data) => { ob(data); sink.next(data); };
        }
        else {
            if (ob.next)
                this.next = (data) => { ob.next(data); sink.next(data); };
            if (ob.complete)
                this.complete = () => { ob.complete(); sink.complete(); };
            if (ob.error)
                this.error = (err) => { ob.error(err); sink.error(err); };
        }
    }
}
export const tap = deliver(Tap, "tap");
class Timeout extends Sink {
    constructor(sink, timeout) {
        super(sink);
        this.timeout = timeout;
        this.id = setTimeout(() => this.error(new TimeoutError(this.timeout)), this.timeout);
    }
    next(data) {
        super.next(data);
        clearTimeout(this.id);
        this.next = super.next;
    }
    dispose() {
        clearTimeout(this.id);
        super.dispose();
    }
}
export const timeout = deliver(Timeout, "timeout");
export const retry = (count = Infinity) => (source) => {
    if (source instanceof Inspect) {
        const ob = create((observer) => {
            let remain = count;
            const deliverSink = new Sink(observer);
            deliverSink.error = (err) => {
                if (remain-- > 0) {
                    deliverSink.subscribe(source);
                }
                else {
                    observer.error(err);
                }
            };
            deliverSink.sourceId = ob.id;
            deliverSink.subscribe(source);
        }, 'retry', [count]);
        ob.source = source;
        Events.pipe(ob);
        return ob;
    }
    else {
        return (observer) => {
            let remain = count;
            const deliverSink = new Sink(observer);
            deliverSink.error = (err) => {
                if (remain-- > 0) {
                    source(deliverSink);
                }
                else {
                    observer.error(err);
                }
            };
            source(deliverSink);
        };
    }
};
