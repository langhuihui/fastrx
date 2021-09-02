import { share } from "./combination";
import { IObserver, Observable, nothing } from "./common";
type Subject<T> = Observable<T> & {
    next(data: T): void;
    complete(): void;
    error(err: any): void;
};
export const subject = <T>(source?: Observable<T>) => {
    const observable: Subject<T> = share<T>()((sink: IObserver<T>) => {
        observable.next = sink.Next;
        observable.complete = sink.Complete;
        observable.error = sink.Error;
        source && source(sink);
    }) as Subject<T>;
    observable.next = nothing;
    observable.complete = nothing;
    observable.error = nothing;
    return observable;
};