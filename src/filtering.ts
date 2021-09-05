import { Sink, deliver, ISink, Observable, nothing } from "./common";

class Take<T> extends Sink<T> {
    constructor(sink: ISink<T>, private count: number) {
        super(sink);
    }
    next(data: T) {
        super.next(data);
        if (--this.count === 0) {
            this.doDefer();
            this.complete();
        }
    }
}
export const take = deliver(Take);

class TakeUntil<T> extends Sink<T> {
    _takeUntil = new Sink<unknown>(this.sink)
    constructor(sink: ISink<T>, private control: Observable<unknown>) {
        super(sink);
        this._takeUntil.next = () => {
            this.doDefer();
            this.complete();
        };
        this._takeUntil.complete = nothing;
        this.control(this._takeUntil);
    }
    complete() {
        //完成事件，单方面终结开关sink
        this._takeUntil.dispose();
        super.complete();
    }
}

export const takeUntil = deliver(TakeUntil);