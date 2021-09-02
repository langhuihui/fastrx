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
            this.defer();
        }
    }
    next(data) {
        this.sinks.forEach((s) => s.next(data));
    }
    complete(err) {
        this.sinks.forEach((s) => s.complete(err));
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
