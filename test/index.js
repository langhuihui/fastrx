const rx = require('../dist');
const { pipe, range, subscribe, timer, map, concatMap, identity, tap } = require('../dist');


function fibonacci(n, ac1 = 1, ac2 = 1) {
  if (n <= 1) {
    return ac2;
  }

  return fibonacci(n - 1, ac2, ac1 + ac2);
}

function getReconnectionTimeout(reconnectionCount) {
  // 最小间隔2s，2,3,5,8 间隔各尝试2次
  const n = Math.round(reconnectionCount / 2) + 1;
  // 最大间隔 13s
  // fibonacci(6) = 13
  if (n > 6) {
    return 13 * 1000;
  }
  return fibonacci(n) * 1000;
}


// takeUntil
//const b = rx.interval(200).takeUntil(rx.interval(1000)).subscribe(console.log, console.error, () => console.log("??"))
//console.log(b.then)
// withLastFrom
//rx.interval(2000).withLatestFrom(rx.interval(200), rx.interval(5000)).subscribe(console.log)
// bufferCount
// rx.interval(100).bufferCount(3,2).take(5).subscribe(console.log)
// sum
//rx.interval(100).take(4).sum().subscribe(console.log)
// debounceTime

//rx.interval(500).take(4).debounceTime(200).subscribe(console.log);
// groupBy;
function groupBy() {
  rx.of(
    { id: 1, name: 'JavaScript' },
    { id: 2, name: 'Parcel' },
    { id: 2, name: 'webpack' },
    { id: 1, name: 'TypeScript' },
    { id: 3, name: 'TSLint' }
  )
    .groupBy((p) => p.id)
    .mergeMap(
      (group$) => group$.reduce((acc, cur) => [...acc, cur], []),
      (o, i) => {
        console.log(o.key);
        return i;
      }
    )
    .subscribe((p) => console.log(p));
}

_concatMap();
function _concatMap() {
  let result = 0;
  pipe(
    range(1, 5),
    map(getReconnectionTimeout),
    tap(console.log),
    concatMap(
      (x) => timer(x),
      identity
    ),
    subscribe((d) => { result = d / 1000; console.log(d); }));
  // rx.range(1, 10)
  //   .concatMap(
  //     (i) => rx.timer(i * 100),
  //     (out) => out
  //   )
  //   .subscribe(console.log);
}
