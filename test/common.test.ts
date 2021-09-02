import { subscribe, subject } from '../src/pipe';
test('adds 1 + 2 to equal 3', () => {
    const ob = subject<number>();
    subscribe((d: number) => {
        expect(d).toBe(3);
    })(ob);
    ob.next(3);
});