const { rx } = require('../index')
// takeUntil
rx.interval(200).tap(console.log).takeUntil(rx.interval(1000)).subscribe(console.log, console.error, () => console.log("??"))
// withLastFrom
//rx.interval(2000).withLatestFrom(rx.interval(200), rx.interval(5000)).subscribe(console.log)