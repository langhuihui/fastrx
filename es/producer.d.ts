import { Observable } from "./common";
declare type Subject<T> = Observable<T> & {
    next(data: T): void;
    complete(): void;
    error(err: any): void;
};
export declare const subject: <T>(source?: Observable<T> | undefined) => Subject<T>;
export {};
//# sourceMappingURL=producer.d.ts.map