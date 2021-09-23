import { Observable, Observer } from "./common";
export declare type Subject<T> = Observable<T> & Observer<T>;
export declare function subject<T>(source?: Observable<T>): Subject<T>;
export declare function defer<T>(f: () => Observable<T>): Observable<T>;
export declare function of<T>(...data: T[]): Observable<T>;
export declare function fromArray<T>(data: ArrayLike<T>): Observable<T>;
export declare function interval(period: number): Observable<number>;
export declare function timer(delay: number, period?: number): Observable<number>;
export declare function fromEventPattern<T>(add: (n: EventHandler<T>) => void, remove: (n: EventHandler<T>) => void): Observable<T>;
declare type EventHandler<T> = (event: T) => void;
declare type EventMethod<N, T> = (name: N, handler: EventHandler<T>) => void;
declare type EventDispachter<N, T> = {
    on: EventMethod<N, T>;
    off: EventMethod<N, T>;
} | {
    addListener: EventMethod<N, T>;
    removeListener: EventMethod<N, T>;
} | {
    addEventListener: EventMethod<N, T>;
    removeEventListener: EventMethod<N, T>;
};
export declare function fromEvent<T, N>(target: EventDispachter<N, T>, name: N): Observable<T>;
declare type Messager<T> = {
    onmessage: (event: T) => void;
    close: () => void;
};
/**
 *
 * @param {window | Worker | EventSource | WebSocket | RTCPeerConnection} target
 * @returns
 */
export declare function fromMessageEvent<T>(target: Messager<T> & EventDispachter<string, T>): Observable<T>;
export declare function fromPromise<T>(promise: Promise<T>): Observable<T>;
export declare function fromFetch(input: RequestInfo, init?: RequestInit): Observable<Response>;
export declare function fromIterable<T>(source: Iterable<T>): Observable<T>;
export declare function fromAnimationFrame(): Observable<DOMHighResTimeStamp>;
export declare function range(start: number, count: number): Observable<number>;
export declare function bindCallback<T>(call: Function, thisArg: any, ...args: any[]): Observable<T>;
export declare function bindNodeCallback<T>(call: Function, thisArg: any, ...args: any[]): Observable<T>;
export declare function never(): Observable<never>;
export declare function throwError(e: any): Observable<never>;
export declare function empty(): Observable<never>;
export {};
//# sourceMappingURL=producer.d.ts.map