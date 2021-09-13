import { Observable, Observer } from "./common";
export declare type Subject<T> = Observable<T> & Observer<T>;
export declare const subject: <T>(source?: Observable<T> | undefined) => Subject<T>;
export declare const defer: <T>(f: () => Observable<T>) => Observable<T>;
export declare const of: <T>(...data: T[]) => Observable<T>;
export declare const fromArray: <T>(data: T[]) => Observable<T>;
export declare const interval: (period: number) => Observable<number>;
export declare const timer: (delay: number, period?: number) => Observable<number>;
export declare const fromEventPattern: <T>(add: (n: EventHandler<T>) => void, remove: (n: EventHandler<T>) => void) => Observable<T>;
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
export declare const fromEvent: <T, N>(target: EventDispachter<N, T>, name: N) => Observable<T>;
declare type Messager<T> = {
    onmessage: (event: T) => void;
    close: () => void;
};
/**
 *
 * @param {window | Worker | EventSource | WebSocket | RTCPeerConnection} target
 * @returns
 */
export declare const fromMessageEvent: <T>(target: Messager<T> & EventDispachter<string, T>) => Observable<T>;
export declare const fromPromise: <T>(promise: Promise<T>) => Observable<T>;
export declare const fromFetch: (input: RequestInfo, init?: RequestInit | undefined) => Observable<Response>;
export declare const fromIterable: <T>(source: Iterable<T>) => Observable<T>;
export declare const fromAnimationFrame: () => Observable<DOMHighResTimeStamp>;
export declare const range: (start: number, count: number) => Observable<number>;
export declare const bindCallback: <T>(call: Function, thisArg: any, ...args: any[]) => Observable<T>;
export declare const bindNodeCallback: <T>(call: Function, thisArg: any, ...args: any[]) => Observable<T>;
export declare const never: () => Observable<never>;
export declare const throwError: (e: any) => Observable<never>;
export declare const empty: () => Observable<never>;
export {};
//# sourceMappingURL=producer.d.ts.map