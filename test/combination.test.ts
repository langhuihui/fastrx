import { race, tap, pipe, interval, map, take, merge, toPromise, concat } from "../src/pipe";

test('race', async () => {
    const result: number[] = [];
    await pipe(race(interval(100), map(x => x + "!")(interval(200))), take(3), tap((e: number) => {
        result.push(e);
    }), toPromise());
    expect(result.join(',')).toBe("0,1,2");
});

test('merge', async () => {
    let x = 0;
    await pipe(merge(interval(100), interval(250)), take(3), tap((e: number) => { x += e; }), toPromise());
    expect(x).toBe(0+1+0);
});

test('concat', async () => {
    let x = 0;
    await pipe(concat(interval(100), interval(250)), take(3), tap((e: number) => {
        x += e;
    }), toPromise());
    expect(x).toBe(0+1+2);
});