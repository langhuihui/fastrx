import { IObserver, Observable } from "./common";
export declare const share: <T>() => (source: Observable<T>) => (sink: IObserver<T, T>) => void;
//# sourceMappingURL=combination.d.ts.map