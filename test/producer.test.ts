import { pipe, range, subscribe, nothing,fromIterable ,tap} from "../src/index";

test('range', () => {
    const result: number[] = [];
    pipe(range(0, 10), subscribe(result.push.bind(result), nothing, () => {
        expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }));
});
test('from iterate',()=>{
  const result: number[] = [];
  const g = function*(){
    yield 1
    yield 2
    return 3
  }
  pipe(fromIterable(g()),subscribe(result.push.bind(result),nothing,()=>{
    expect(result).toEqual([1,2,3]);
  }))
})
// test('fromMessageEvent', () => {
//     const message = fromMessageEvent(window);
//     subscribe((e: MessageEvent) => {
//         expect(e.data).toBe('test');
//     })(message);
//     window.postMessage('test', '*');
// });