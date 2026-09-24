import { subscribe, subject, delay, pipe, timeout, interval, nothing, throwError, of, switchMap, catchError, map, defer, ISink, share } from '../src/index';
test('subject', () => {
    const ob = subject<number>();
    ob.next(4);
    subscribe((d: number) => {
        expect(d).toBe(3);
    })(ob);
    subscribe((d: number) => {
        expect(d).toBe(3);
    })(ob);
    ob.next(3);
});
test('delay', async () => {
    const ob = subject<number>();
    let result = 0;
    subscribe((d: number) => {
        result = d;
    })(delay(300)(ob));
    ob.next(3);
    expect(result).toBe(0);
    return new Promise(resolve => {
        setTimeout(() => { expect(result).toBe(3); resolve(true); }, 400);
    });
});
test('timeout', () => {
    return new Promise(resolve => {
        pipe(interval(1000), timeout(400), subscribe(nothing, e => {
            expect(e).toBeInstanceOf(Error);
            resolve(true);
        }));
    });
});
test('throwError', () => {
    return new Promise(resolve => {
        pipe(of(1), switchMap(_ => throwError(new Error('test'))), subscribe(nothing, e => {
            expect(e).toBeInstanceOf(Error);
            resolve(true);
        }));
    });
});
test('sync throw in source function goes to error callback', () => {
    const err = new Error('boom');
    let received: any;
    let disposed = false;
    expect(() => {
        pipe((sink: ISink<number>) => {
            sink.defer(() => { disposed = true; });
            throw err;
        }, map((x: number) => x * 2), subscribe(nothing, e => { received = e; }));
    }).not.toThrow();
    expect(received).toBe(err);
    expect(disposed).toBe(true);
});
test('sync throw in inspected source goes to error callback', () => {
    const err = new Error('boom');
    let received: any;
    pipe(defer(() => { throw err; }), map((x: number) => x * 2), subscribe(nothing, e => { received = e; }));
    expect(received).toBe(err);
});
test('sync throw after termination is rethrown', () => {
    const err = new Error('late');
    expect(() => {
        pipe((sink: ISink<number>) => {
            sink.complete();
            throw err;
        }, subscribe());
    }).toThrow(err);
});
test('share propagates error after resubscribe', () => {
    const err = new Error('late');
    let current!: ISink<number>;
    const shared = share<number>()((sink: ISink<number>) => { current = sink; });
    subscribe()(shared).dispose();
    let received: any;
    subscribe(nothing, e => { received = e; })(shared);
    current.error(err);
    expect(received).toBe(err);
});
test('catchError', () => {
    return new Promise(resolve => {
        pipe(of(1), switchMap(_ => throwError(new Error('test'))), catchError(err => of(2)), subscribe(x => {
            expect(x).toBe(2);
            resolve(true);
        }, e => {
        }));
    });
});