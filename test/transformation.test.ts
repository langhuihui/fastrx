import { pipe, subscribe, timer, identity, range, concatMap, toPromise } from "../src/pipe";

test('concatMap', async () => {
   expect(await pipe(range(1, 5)
        , concatMap(
            (i) => timer(i * 100),
            identity
        )
        , toPromise()
    )).toBe(5);
}, 2000);