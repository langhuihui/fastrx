import { pipe, range, subscribe, nothing } from "../src/index";

test('range', () => {
    const result: number[] = [];
    pipe(range(0, 10), subscribe(result.push.bind(result), nothing, () => {
        expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }));
});
// test('fromMessageEvent', () => {
//     const message = fromMessageEvent(window);
//     subscribe((e: MessageEvent) => {
//         expect(e.data).toBe('test');
//     })(message);
//     window.postMessage('test', '*');
// });