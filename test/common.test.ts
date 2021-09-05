import { subscribe, subject, delay, pipe, timeout, interval, nothing, throwError, of, switchMap, catchError } from '../src/pipe';
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
test('catchError', () => {
    return new Promise(resolve => {
        pipe(of(1), switchMap(_ => throwError(new Error('test'))), catchError(err => of(2)), subscribe(x => {
            expect(x).toBe(2);
            resolve(true);
        }, e => {
        }));
    });
});