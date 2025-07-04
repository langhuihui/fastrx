import { pipe, interval, takeLast, skipUntil, subscribe, take, skip, skipWhile, takeWhile, timer, takeUntil, every, debounceTime, tap, switchMapTo } from '../src/index';
test('take', () => {
  return new Promise((resolve, reject) => {
    pipe(interval(100), tap((e) => {
      if (e > 1) {
        reject('not canceled');
      }
    }), skip(1), take(1), switchMapTo(timer(1000)), subscribe(
      e => {
        expect(e).toBe(0);
        resolve(true);
      }
    ));
  });
});
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
test('debounceTime', () => {
  return new Promise((resolve) => {
    const results: number[] = [];

    pipe(
      interval(50), // 每50ms发射一个值
      take(5), // 取前5个值 (0-4)
      debounceTime(200), // 防抖200ms
      subscribe(
        (value) => {
          results.push(value);
        },
        () => { },
        () => {
          // 由于防抖时间是200ms，而interval是50ms
          // 只有最后一个值(4)会在complete后被发射出来
          expect(results.length).toBe(1);
          expect(results[0]).toBe(4);
          resolve(true);
        }
      )
    );
  });
});
test('debounceTime with delayed emissions', () => {
  return new Promise((resolve) => {
    const results: number[] = [];
    let count = 0;

    const emitNext = () => {
      if (count < 3) {
        pipe(
          timer(0),
          debounceTime(50),
          subscribe(
            () => {
              results.push(count);
              count++;
              if (count < 3) {
                setTimeout(emitNext, 100); // 等待100ms再发射下一个，大于防抖时间
              } else {
                // 每次发射都会被处理，因为间隔大于防抖时间
                expect(results.length).toBe(3);
                expect(results).toEqual([0, 1, 2]);
                resolve(true);
              }
            }
          )
        );
      }
    };

    emitNext();
  });
});