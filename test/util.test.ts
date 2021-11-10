import { pipe, nothing, retry, ISink, subscribe, take, skip, skipWhile, takeWhile, timer, takeUntil, every } from '../src/index';
test('retry', () => {
  return new Promise((resolve) => {
    let result: number[] = [];
    pipe((sink: ISink<number>) => {
      sink.next(1);
      sink.next(2);
      sink.error(new Error('error'));
    }, retry(2), subscribe(
      e => {
        result.push(e);
      }, err => {
        expect(result.join('')).toBe('121212');
        resolve(true);
      }
    ));
  });
});