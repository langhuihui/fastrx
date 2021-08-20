const rx = require('../dist');
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

// rx.range(1, 5)
//   .mergeMap((x, i) => rx.iif(() => x % 2 == 0, rx.of(x), rx.range(x, i)))
//   .subscribe(console.log);
