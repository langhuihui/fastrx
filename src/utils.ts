import { Observable, nothing, Sink, ISink, Observer, deliver, TimeoutError, Subscribe, Events, inspect, InspectObservable, Inspect, create } from "./common";

export const toPromise = <T>() => (source: Observable<T>) =>
  new Promise<T>((resolve, reject) => {
    let value: T;
    new Subscribe<T>(source, (d) => (value = d), reject, () => resolve(value));
  });


// //SUBSCRIBER
export const subscribe =
  <T>(n: (data: T) => void = nothing, e = nothing, c = nothing) => (source: Observable<T>) => new Subscribe<T>(source, n, e, c);
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

export const retry = (count: number = Infinity) => <T>(source: Observable<T>) => {
  if (source instanceof Inspect) {
    const ob = create((observer: ISink<T>) => {
      let remain = count;
      const deliverSink = new Sink(observer);
      deliverSink.error = (err) => {
        if (remain-- > 0) {
          deliverSink.subscribe(source);
        } else {
          observer.error(err);
        }
      };
      deliverSink.sourceId = ob.id;
      deliverSink.subscribe(source);
    }, 'retry', [count]) as InspectObservable<T>;
    ob.source = source;
    Events.pipe(ob);
    return ob;
  } else {
    return (observer: ISink<T>) => {
      let remain = count;
      const deliverSink = new Sink(observer);
      deliverSink.error = (err) => {
        if (remain-- > 0) {
          source(deliverSink);
        } else {
          observer.error(err);
        }
      };
      source(deliverSink);
    };
  }
};