import { nothing, Sink, deliver, TimeoutError, Subscribe } from "./common";
export const toPromise = () => (source) => new Promise((resolve, reject) => {
    let value;
    new Subscribe(source, (d) => (value = d), reject, () => resolve(value));
});
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
