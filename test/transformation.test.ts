import { pipe, subscribe, timer, identity, range, concatMap, interval, nothing, mergeMap, elementAt, take, switchMap, tap, of, map } from "../src/index";

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
  return new Promise((resolve) => {
    pipe(range(1, 5),
      map(getReconnectionTimeout)
      , concatMap(
        timer,
        identity
      ),
      subscribe((d) => { result = d/1000; console.log(d); }, nothing, () => {
        expect(result).toBe(5);
        resolve(true);
      }));
  });
}, 30000);


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