declare type Deferable = Sink | Function | Array<any>
declare type Observable = (sink: Sink) => void
declare type Observer<T> = (source: Observable) => T
export interface Sink {
    defers: Set<Deferable>;
    sink: Sink;
    disposePass: Boolean;
    constructor(sink: Sink, ...args: Array<any>);
    init();
    next(data: any);
    complete(err?: Error);
    dispose(defer?: Boolean | true);
    defer(add?: Deferable);
    subscribe(source: Observable);
    subscribes(sources: Array<Observable>);
}
declare type Deliver = (...args: Array<any>) => Observable
export function pipe<T>(...args: Array<Observable | Observer<T>>): Observable | T
export function deliver(Class: Function): Deliver;
export function subject(source?: Observable): Observable
export function from<T>(source: Array<any> | Promise<T> | T): Observable
export function fromArray(array: Array<any>): Observable
export function fromEventPattern(add: (h: Function) => any, remove: (h: Function) => any): Observable
export function fromEvent(target: any, name: string): Observable
export function fromVueEvent(target: any, name: string): Observable
export function fromVueEventOnce(target: any, name: string): Observable
export function fromEventSource(href: string, opt?: any): Observable
export function fromPromise<T>(source: Promise<T>): Observable
export function fromAnimationFrame(): Observable
export function fromFetch(input: RequestInfo, init?: RequestInit): Observable
export function fromNextTick(vm: any): Observable
export function eventHandler(once?: boolean): Observable | { handler: () => void }
export function range(start: Number, count: Number): Observable
export function interval(period: Number): Observable
export function timer(delay: Number, period: Number): Observable
export function bindCallback(f: (...args: Array<any>, callback: (res: any) => void) => void, thisArg: any, ...args: Array<any>): Observable
export function bindNodeCallback(f: (...args: Array<any>, callback: (err: Error | any, res: any) => void) => void, thisArg: any, ...args: Array<any>): Observable
export function iif(condition: () => Boolean, trueSource: Observable, falseSource: Observable): Observable
export function race(...sources: Array<Observable>): Observable
export function merge(...sources: Array<Observable>): Observable
export function mergeArray(sources: Array<Observable>): Observable
export function concat(...sources: Array<Observable>): Observable
export function combineLatest(...sources: Array<Observable>): Observable
export function zip(...sources: Array<Observable>): Observable
export function never(): Observable
export function empty(): Observable
export function throwError(e: Error | any): Observable

export function reduce(f: (acc: any, d: any) => any, seed?: any): Observable
export function max(): Observable
export function min(): Observable
export function sum(): Observable
export function take(count: number): Observable
export function takeUntil(source: Observable): Observable
export function takeWhile(f: (d: any) => Boolean): Observable
export function skip(count: number): Observable
export function skipUntil(source: Observable): Observable
export function skipWhile(f: (d: any) => Boolean): Observable
export function map(f: (d: any) => any): Observable
export function mapTo(target: Observable): Observable
export function tap(f: (d: any) => any): Observable
export function filter(f: (d: any) => Boolean): Observable
export function share(source?: Observable): Observable
export function shareReplay(bufferSize: number): (source?: Observable) => Observable
export function startWith(...xs: Array<any>): Observable
export function throttle(durationSelector: (d: any) => Observable, config?: { leading: true, trailing: false }): Observable
export function throttleTime(period: Number, config?: { leading: true, trailing: false }): Observable
export function debounce(durationSelector: (d: any) => Observable): Observable
export function debounceTime(period: number): Observable
export function withLatestFrom(...sources: Array<Observable>): Observable
export function elementAt(count: number, defaultValue?: any): Observable
export function find(f: (d: any) => Boolean): Observable
export function findIndex(f: (d: any) => Boolean): Observable
export function first(f?: (d: any) => Boolean, defaultValue?: any): Observable
export function last(f?: (d: any) => Boolean, defaultValue?: any): Observable
export function every(f: (d: any) => Boolean): Observable
export function delay(period: number): Observable
export function scan(f: (d: any) => any, seed?: any): Observable
export function repeat(count: number): Observable
export function pluck(prop: string): Observable
export function switchMap(source: (d: any, index: number) => Observable, combineResults?: (outter: any, inner: any) => any): Observable
export function switchMapTo(source: Observable): Observable
export function mergeMap(source: (d: any, index: number) => Observable, combineResults?: (outter: any, inner: any) => any): Observable
export function mergeMapTo(source: Observable): Observable
export function concatMap(f: (d: any) => Observable):Observable
export function concatMapTo(inner:Observable):Observable
export function groupBy(f: (d: any) => any): Observable
export function bufferTime(miniseconds: number): Observable
export function timeInterval(): Observable
export function catchError(selector: (e: Error | any) => Observable): Observable
export function toPromise(): Observer<Sink>
export function subscribe(n?: (d: any) => void, e?: (d: Error) => void, c?: () => void): Observer<Sink>