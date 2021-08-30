interface Observable {
    take(count: number): Observable
    takeUntil(source: Observable): Observable
    takeWhile(f: (d: any) => Boolean): Observable
    skip(count: number): Observable
    skipUntil(source: Observable): Observable
    skipWhile(f: (d: any) => Boolean): Observable
    map(f: (d: any) => any): Observable
    mapTo(target: Observable): Observable
    tap(f: (d: any) => any): Observable
    filter(f: (d: any) => Boolean): Observable
    share(source?: Observable): Observable
    shareReplay(bufferSize: number): (source?: Observable) => Observable
    startWith(...xs: Array<any>): Observable
    throttle(durationSelector: (d: any) => Observable, config?: { leading: true, trailing: false }): Observable
    throttleTime(period: Number, config?: { leading: true, trailing: false }): Observable
    debounce(durationSelector: (d: any) => Observable): Observable
    debounceTime(period: number): Observable
    withLatestFrom(...sources: Array<Observable>): Observable
    elementAt(count: number, defaultValue?: any): Observable
    find(f: (d: any) => Boolean): Observable
    findIndex(f: (d: any) => Boolean): Observable
    first(f?: (d: any) => Boolean, defaultValue?: any): Observable
    last(f?: (d: any) => Boolean, defaultValue?: any): Observable
    every(f: (d: any) => Boolean): Observable
    delay(period: number): Observable
    scan(f: (d: any) => any, seed?: any): Observable
    repeat(count: number): Observable
    pluck(prop: string): Observable
    switchMap(source: (d: any, index: number) => Observable, combineResults?: (outter: any, inner: any) => any): Observable
    switchMapTo(source: Observable): Observable
    mergeMap(source: (d: any, index: number) => Observable, combineResults?: (outter: any, inner: any) => any): Observable
    mergeMapTo(source: Observable): Observable
    concatMap(f: (d: any) => Observable,combineResults?: (outter: any, inner: any) => any):Observable
    concatMapTo(inner:Observable,combineResults?: (outter: any, inner: any) => any):Observable
    groupBy(f: (d: any) => any): Observable
    bufferTime(miniseconds: number): Observable
    timeInterval(): Observable
    catchError(selector: (e: Error | any) => Observable): Observable
    toPromise(): Promise<any>
    reduce(f: (acc: any, d: any) => any, seed?: any): Observable
    max(): Observable
    min(): Observable
    sum(): Observable
    subscribe(n?: (d: any) => void, e?: (d: Error) => void, c?: () => void): Sink
}
interface Creator {
    (f: (sink: Sink) => void): Observable
    subject(source?: Observable): Observable
    of(...args: Array<any>): Observable
    from<T>(source: Array<any> | Promise<T> | T): Observable
    fromArray(array: Array<any>): Observable
    fromEventPattern(add: (h: Function) => any, remove: (h: Function) => any): Observable
    fromEvent(target: any, name: string): Observable
    fromVueEvent(target: any, name: string): Observable
    fromVueEventOnce(target: any, name: string): Observable
    fromEventSource(href: string, opt?: any): Observable
    fromPromise<T>(source: Promise<T>): Observable
    fromAnimationFrame(): Observable
    fromFetch(input: RequestInfo, init?: RequestInit): Observable
    fromNextTick(vm: any): Observable
    fromAsyncFunc(f: () => Promise): Observable
    eventHandler(once?: boolean): Observable | { handler: () => void }
    range(start: Number, count: Number): Observable
    interval(period: Number): Observable
    timer(delay: Number, period: Number): Observable
    bindCallback(f: (...args: Array<any>, callback: (res: any) => void) => void, thisArg: any, ...args: Array<any>): Observable
    bindNodeCallback(f: (...args: Array<any>, callback: (err: Error | any, res: any) => void) => void, thisArg: any, ...args: Array<any>): Observable
    iif(condition: () => Boolean, trueSource: Observable, falseSource: Observable): Observable
    race(...sources: Array<Observable>): Observable
    merge(...sources: Array<Observable>): Observable
    mergeArray(sources: Array<Observable>): Observable
    concat(...sources: Array<Observable>): Observable
    combineLatest(...sources: Array<Observable>): Observable
    zip(...sources: Array<Observable>): Observable
    never(): Observable
    empty(): Observable
    throwError(e: Error | any): Observable
}
declare const rx: Creator;
export default rx;