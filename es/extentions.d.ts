import { EventDispachter, Observable } from "./common";
export declare const koaEventStream: (ctx: any, next: () => Promise<Observable<unknown>>) => Promise<void>;
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
export {};
//# sourceMappingURL=extentions.d.ts.map