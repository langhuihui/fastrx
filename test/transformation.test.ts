import { pipe, subscribe, timer, identity, range, concatMap, nothing } from "../src/pipe";

test('concatMap', async () => {
    let result = 0;
    return new Promise((resolve) => {
        pipe(range(1, 5)
            , concatMap(
                (i) => timer(i * 100),
                identity
            ),
            subscribe((d) => { result = d }, nothing, () => {
                expect(result).toBe(5);
                resolve(true);
            }));
    });
}, 3000);