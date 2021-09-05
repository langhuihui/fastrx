import { Observer, deliver, nothing } from "./common";
class Take extends Observer {
    constructor(sink, count) {
        super(sink);
        this.count = count;
    }
    next(data) {
        super.next(data);
        if (--this.count === 0) {
            this.doDefer();
            this.complete();
        }
    }
}
export const take = deliver(Take);
class TakeUntil extends Observer {
    constructor(sink, control) {
        super(sink);
        this.control = control;
        this._takeUntil = new Observer(this.sink);
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
