import { pipe, interval, takeLast, skipUntil, subscribe, take, skip, skipWhile, takeWhile, timer, takeUntil, every } from '../src/index';
test('skip', () => {
    return new Promise((resolve) => {
        pipe(interval(100), skip(1), take(1), subscribe(
            e => {
                expect(e).toBe(1);
                resolve(true);
            }
        ));
    });
});
test('skipWhile', () => {
    return new Promise((resolve) => {
        pipe(interval(100), skipWhile(x => x < 5), take(1), subscribe(
            e => {
                expect(e).toBe(5);
                resolve(true);
            }
        ));
    });
});
test('skipUntil', () => {
    return new Promise((resolve) => {
        pipe(interval(100), skipUntil(interval(550)), take(1), subscribe(
            e => {
                expect(e).toBe(5);
                resolve(true);
            }
        ));
    });
});
test('takeLast', () => {
    return new Promise((resolve) => {
        pipe(interval(100), take(5), takeLast(2), subscribe(
            e => {
                expect(e.length).toBe(2);
                expect(e[0]).toBe(3);
                expect(e[1]).toBe(4);
                resolve(true);
            }
        ));
    });
});
test('takeWhile', () => {
    return new Promise((resolve, reject) => {
        pipe(interval(100), takeWhile(x => x < 4), subscribe((d) => expect(d).toBeLessThan(4), reject, resolve));
    });
});
test('takeUntil', () => {
    return new Promise((resolve, reject) => {
        pipe(interval(100), takeUntil(timer(250)), subscribe((d) => expect(d).toBeLessThan(2), reject, resolve));
    });
});
test('every', () => {
    return new Promise((resolve, reject) => {
        pipe(interval(100), take(5), every(x => x < 5), subscribe((d) => expect(d).toBeTruthy(), reject, resolve));
    });
});