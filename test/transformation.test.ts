import { pipe, subscribe, timer, identity, range, concatMap, interval, nothing, mergeMap, elementAt, take, switchMap, tap, of, map, expand, empty } from "../src/index";

function fibonacci(n: number, ac1 = 1, ac2 = 1): number {
  if (n <= 1) {
    return ac2;
  }

  return fibonacci(n - 1, ac2, ac1 + ac2);
}

function getReconnectionTimeout(reconnectionCount: number) {
  // 最小间隔2s，2,3,5,8 间隔各尝试2次
  const n = Math.round(reconnectionCount / 2) + 1;
  // 最大间隔 13s
  // fibonacci(6) = 13
  if (n > 6) {
    return 13 * 1000;
  }
  return fibonacci(n) * 1000;
}


test('concatMap', async () => {
  let result = 0;
  let emissionCount = 0;

  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    pipe(range(1, 5),
      map(getReconnectionTimeout),
      concatMap(
        x => timer(x),
        identity
      ),
      subscribe(
        (d) => {
          result = d / 1000; // concatMap with identity returns the delay time, so convert to seconds
          emissionCount++;
          console.log(`Emission ${emissionCount}: ${d}ms (${result}s)`);

          // 防止无限循环
          if (emissionCount > 10) {
            reject(new Error('Too many emissions - possible infinite loop'));
            return;
          }
        },
        reject,
        () => {
          const elapsed = Date.now() - startTime;
          console.log(`Test completed in ${elapsed}ms. Final result: ${result}s, Total emissions: ${emissionCount}`);

          // The last emission should be 5000ms (5 seconds)
          expect(result).toBe(5);
          expect(emissionCount).toBe(5);
          resolve(true);
        }
      )
    );

    // 添加超时保护
    setTimeout(() => {
      reject(new Error(`Test timed out after 20s. Emissions: ${emissionCount}, Last result: ${result}`));
    }, 20000);
  });
}, 25000);


test('mergeMap', async () => {
  return new Promise((resolve, reject) => {
    pipe(range(1, 5)
      , mergeMap(
        (i) => interval(100)
      ),
      elementAt(6),
      take(8),
      subscribe((d) => { expect(d).toBe(1); }, reject, () => {
        resolve(true);
      }));
  });
});

test('switchMap', async () => {
  return new Promise((resolve, reject) => {
    pipe(range(1, 5)
      , switchMap(
        (i) => of(i, i * 2)
      ),
      tap(console.log),
      elementAt(1),
      subscribe((d) => { expect(d).toBe(10); }, reject, () => {
        resolve(true);
      }));
  });
});

test('expand debug', async () => {
  return new Promise((resolve, reject) => {
    let completed = false;
    let resultCount = 0;

    pipe(
      of(1),
      expand(x => {
        console.log('expand project called with:', x);
        if (x < 3) {
          console.log('returning of(' + (x + 1) + ')');
          return of(x + 1);
        } else {
          console.log('returning empty()');
          return empty();
        }
      }),
      subscribe(
        (d) => {
          console.log('expand debug result:', d, ', count:', ++resultCount);
        },
        reject,
        () => {
          console.log('expand debug completed');
          completed = true;
          expect(resultCount).toBe(3);
          resolve(true);
        }
      )
    );

    // 添加超时检查
    setTimeout(() => {
      if (!completed) {
        console.log('Test timed out. Results so far:', resultCount);
        reject(new Error('Test timed out'));
      }
    }, 3000);
  });
}, 5000);

test('expand', async () => {
  return new Promise((resolve, reject) => {
    const result: number[] = [];

    pipe(
      of(1),
      expand(x => x < 5 ? of(x + 1) : empty()),
      subscribe(
        (d) => {
          result.push(d);
          console.log('expand result:', d);
        },
        reject,
        () => {
          expect(result).toEqual([1, 2, 3, 4, 5]);
          resolve(true);
        }
      )
    );
  });
}, 15000);

test('expand with async source', async () => {
  return new Promise((resolve, reject) => {
    const result: number[] = [];

    pipe(
      of(0),
      expand(x => x < 3 ? pipe(timer(100), map(() => x + 1)) : empty()),
      subscribe(
        (d) => {
          result.push(d);
          console.log('expand async result:', d);
        },
        reject,
        () => {
          expect(result).toEqual([0, 1, 2, 3]);
          resolve(true);
        }
      )
    );
  });
}, 10000);

test('expand fibonacci sequence', async () => {
  return new Promise((resolve, reject) => {
    const result: number[] = [];

    pipe(
      of([1, 1]),
      expand(([a, b]) => b < 50 ? of([b, a + b]) : empty()),
      map(([a, b]) => a),
      subscribe(
        (d) => {
          result.push(d);
          console.log('fibonacci:', d);
        },
        reject,
        () => {
          expect(result).toEqual([1, 1, 2, 3, 5, 8, 13, 21, 34]);
          resolve(true);
        }
      )
    );
  });
});