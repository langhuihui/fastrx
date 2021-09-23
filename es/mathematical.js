import { Sink, deliver } from "./common";
class Reduce extends Sink {
    constructor(sink, f, seed) {
        super(sink);
        this.f = f;
        const accSet = () => {
            this.sink.next(this.acc);
            this.sink.complete();
        };
        if (typeof seed === "undefined") {
            this.next = (d) => {
                this.acc = d;
                this.complete = accSet;
                this.resetNext();
            };
        }
        else {
            this.acc = seed;
            this.complete = accSet;
        }
    }
    next(data) {
        this.acc = this.f(this.acc, data);
    }
}
export const reduce = deliver(Reduce, "reduce");
export const count = (f) => deliver(Reduce, "count")((aac, c) => (f(c) ? aac + 1 : aac), 0);
export const max = () => deliver(Reduce, "max")(Math.max);
export const min = () => deliver(Reduce, "min")(Math.min);
export const sum = () => deliver(Reduce, "sum")((aac, c) => aac + c, 0);
