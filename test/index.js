const { default: rx } = require('../dist')
// takeUntil
const b = rx.interval(200).takeUntil(rx.interval(1000)).subscribe(console.log, console.error, () => console.log("??"))
console.log(b.then)
// withLastFrom
//rx.interval(2000).withLatestFrom(rx.interval(200), rx.interval(5000)).subscribe(console.log)