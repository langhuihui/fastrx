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
export const reduce = deliver(Reduce);
export const count = (f) => reduce((aac, c) => (f(c) ? aac + 1 : aac), 0);
export const max = () => reduce(Math.max);
export const min = () => reduce(Math.min);
export const sum = () => reduce((aac, c) => aac + c, 0);
