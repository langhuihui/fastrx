import { pipe, from, take, subscribe } from '../../pipe';
pipe(from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), take(4), subscribe(console.log));
