import { Observer } from "./common";
class Share extends Observer {
    constructor(source) {
        super();
        this.source = source;
        this.sinks = new Set();
    }
    add(sink) {
        this.sinks.add(sink);
        if (this.sinks.size === 1) {
            this.source(this);
        }
    }
    remove(sink) {
        this.sinks.delete(sink);
        if (this.sinks.size === 0) {
            this.doDefer();
        }
    }
    next(data) {
        this.sinks.forEach((s) => s.next(data));
    }
    complete() {
        this.sinks.forEach((s) => s.complete());
        this.sinks.clear();
    }
    error(err) {
        this.sinks.forEach((s) => s.error(err));
        this.sinks.clear();
    }
}
export const share = () => (source) => {
    const share = new Share(source);
    return (sink) => {
        sink.defer(() => share.remove(sink));
        share.add(sink);
    };
};
class Merge extends Observer {
    constructor(sink, nLife) {
        super(sink);
        this.nLife = nLife;
    }
    complete() {
        if (--this.nLife === 0)
            super.complete();
    }
}
export const merge = (...sources) => (sink) => {
    const merge = new Merge(sink, sources.length);
    sources.forEach((source) => source(merge));
};
