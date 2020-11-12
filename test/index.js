const { rx } = require('../index')
// takeUntil
//rx.interval(200).takeUntil(rx.interval(1000).tap(console.log)).subscribe(console.log, console.error, () => console.log("??"))
// withLastFrom
rx.interval(2000).withLatestFrom(rx.interval(200), rx.interval(5000)).subscribe(console.log)