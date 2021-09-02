import { share } from "./combination";
import { nothing } from "./common";
export const subject = (source) => {
    const observable = share()((sink) => {
        observable.next = sink.Next;
        observable.error = observable.complete = sink.Complete;
        source && source(sink);
    });
    observable.next = nothing;
    observable.complete = nothing;
    observable.error = nothing;
    return observable;
};
