import { Observable, nothing, Sink, ISink, Observer, deliver, TimeoutError, Subscribe } from "./common";

export const toPromise = <T>() => (source: Observable<T>) =>
  new Promise<T>((resolve, reject) => {
    let value: T;
    (new Subscribe<T>((d) => (value = d), reject, () => resolve(value))).subscribe(source);
  });


// //SUBSCRIBER
export const subscribe =
  <T>(n: (data: T) => void = nothing, e = nothing, c = nothing) =>
    (new Subscribe<T>(n, e, c)).bindSubscribe;
// // UTILITY

class Tap<T> extends Sink<T> {
  constructor(sink: ISink<T>, ob: ((d: T) => void) | Partial<Observer<T>>) {
    super(sink);
    if (ob instanceof Function) {
      this.next = (data: T) => { ob(data); sink.next(data); };
    } else {
      if (ob.next) this.next = (data: T) => { ob.next!(data); sink.next(data); };
      if (ob.complete) this.complete = () => { ob.complete!(); sink.complete(); };
      if (ob.error) this.error = (err: any) => { ob.error!(err); sink.error(err); };
    }
  }
}

export const tap = deliver(Tap, "tap");

class Timeout<T> extends Sink<T> {
  id = setTimeout(() => this.error(new TimeoutError(this.timeout)), this.timeout);
  constructor(sink: ISink<T>, private readonly timeout: number) {
    super(sink);
  }
  next(data: T) {
    super.next(data);
    clearTimeout(this.id);
    this.next = super.next;
  }
  dispose() {
    clearTimeout(this.id);
    super.dispose();
  }
}
export const timeout = deliver(Timeout, "timeout");