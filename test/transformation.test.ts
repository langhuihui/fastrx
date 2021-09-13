import { pipe, subscribe, timer, identity, range, concatMap,interval, nothing ,mergeMap,elementAt, take} from "../src/index";

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


test('mergeMap', async () => {
    return new Promise((resolve,reject) => {
        pipe(range(1, 5)
            , mergeMap(
                (i) => interval( 100)
            ),
            elementAt(6),
            take(8),
            subscribe((d) => {  expect(d).toBe(1);}, reject, () => {
                resolve(true);
            }));
    });
});

