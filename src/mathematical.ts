import { Sink, ISink, deliver } from "./common";

class Reduce<T, R, ACC extends R | T> extends Sink<T, ACC> {
    acc!: ACC;
    constructor(sink: ISink<ACC>, private readonly f: (acc: ACC, c: T) => ACC, seed?: ACC) {
        super(sink);
        const accSet = () => {
            this.sink.next(this.acc);
            this.sink.complete();
        };
        if (typeof seed === "undefined") {
            this.next = (d: T) => {
                this.acc = d as ACC;
                this.complete = accSet;
                this.resetNext();
            };
        } else {
            this.acc = seed;
            this.complete = accSet;
        }
    }
    next(data: T) {
        this.acc = this.f(this.acc, data);
    }
}
export const reduce = deliver(Reduce);

export const count = <T>(f: (d: T) => boolean) => reduce((aac, c: T) => (f(c) ? aac + 1 : aac), 0);
export const max = () => reduce(Math.max);
export const min = () => reduce(Math.min);
export const sum = () => reduce((aac, c: number) => aac + c, 0);
