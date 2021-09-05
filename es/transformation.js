import { Observer, deliver } from "./common";
class _SwitchMap extends Observer {
    constructor(sink, data, context) {
        super(sink);
        this.data = data;
        this.context = context;
    }
    next(data) {
        const combineResults = this.context.combineResults;
        if (combineResults) {
            super.next(combineResults(this.data, data));
        }
        else {
            super.next(data);
        }
    }
    error(err) {
        if (this.context.disposed)
            super.error(err);
        else
            this.dispose(false);
    }
    complete() {
        if (this.context.disposed)
            super.complete();
        else
            this.dispose(false);
    }
}
class SwitchMap extends Observer {
    constructor(sink, makeSource, combineResults) {
        super(sink);
        this.makeSource = makeSource;
        this.combineResults = combineResults;
        this.index = 0;
    }
    next(data) {
        const makeSource = this.makeSource;
        if (this.switch) {
            //this.switch.disposePass = false;
            this.switch.dispose();
        }
        this.switch = new _SwitchMap(this.sink, data, this);
        makeSource(data, this.index++)(this.switch);
    }
    complete() {
        if (!this.switch || this.switch.disposed)
            super.complete();
        else
            this.dispose(false);
    }
    error(err) {
        if (!this.switch || this.switch.disposed)
            super.error(err);
        else
            this.dispose(false);
    }
}
export const switchMap = deliver(SwitchMap);
export const switchMapTo = (innerSource, combineResults) => switchMap((d) => innerSource, combineResults);
