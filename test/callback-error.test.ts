import {
  pipe, of, interval, throwError, subscribe, nothing, Operator, Observable,
  map, scan, groupBy, switchMap, mergeMap, concatMap, exhaustMap, expand, catchError,
  filter, distinct, takeWhile, skipWhile, throttle, audit, debounce, findIndex, first, last, every,
  reduce, count, tap,
} from '../src/index';

const boom = () => { throw new Error('cb'); };

const expectError = (source: Observable<number>, op: Operator<number, any>) =>
  new Promise<void>((resolve, reject) => {
    pipe(source, op, subscribe(nothing, (e: any) => {
      try { expect(e.message).toBe('cb'); resolve(); } catch (x) { reject(x); }
    }, () => reject(new Error('completed instead of error'))));
  });

const cases: [string, Operator<number, any>][] = [
  ['map', map(boom)],
  ['scan', scan(boom, 0)],
  ['groupBy', groupBy(boom)],
  ['switchMap project', switchMap(boom)],
  ['switchMap combineResults', switchMap((x: number) => of(x), boom)],
  ['mergeMap project', mergeMap(boom)],
  ['concatMap project', concatMap(boom)],
  ['exhaustMap project', exhaustMap(boom)],
  ['expand project', expand(boom)],
  ['filter', filter(boom)],
  ['distinct', distinct(boom)],
  ['takeWhile', takeWhile(boom)],
  ['skipWhile', skipWhile(boom)],
  ['throttle', throttle(boom)],
  ['audit', audit(boom)],
  ['debounce', debounce(boom)],
  ['findIndex', findIndex(boom)],
  ['first', first(boom)],
  ['last', last(boom)],
  ['every', every(boom)],
  ['reduce', reduce(boom, 0)],
  ['count', count(boom)],
  ['tap function', tap(boom)],
  ['tap next', tap({ next: boom })],
  ['tap complete', tap({ complete: boom })],
];

for (const [name, op] of cases) {
  test(`${name} callback error goes to error callback`, () => expectError(of(1, 2, 3), op));
}

test('catchError selector error goes to error callback', () =>
  expectError(throwError(new Error('source')), catchError(boom)));

test('tap error handler error replaces original error', () =>
  expectError(throwError(new Error('source')), tap({ error: boom })));

test('tap next error does not reach its own error handler', async () => {
  let tapError: any;
  await expectError(of(1), tap({ next: boom, error: (e: any) => { tapError = e; } }));
  expect(tapError).toBeUndefined();
});

test('callback error on interval source disposes the stream', async () => {
  let calls = 0;
  await expectError(interval(5), map(() => { calls++; boom(); }));
  await new Promise(r => setTimeout(r, 30));
  expect(calls).toBe(1);
});
