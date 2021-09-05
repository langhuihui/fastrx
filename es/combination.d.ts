import { IObserver, Observable } from "./common";
export declare const share: <T>() => (source: Observable<T>) => (sink: IObserver<T>) => void;
export declare const merge: <T>(...sources: Observable<unknown>[]) => Observable<unknown>;
//# sourceMappingURL=combination.d.ts.map