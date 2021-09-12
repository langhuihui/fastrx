// @ts-nocheck
import { Subscribe, tap, delay, timeout, catchError, groupBy, subscribe, toPromise } from './pipe';
import { Node } from './devtools';
import { Observable, Operator } from './common';
import * as producer from './producer';
import * as filtering from './filtering';
import * as mathematical from './mathematical';
import * as transformation from './transformation';
import * as combination from './combination';
const { zip, merge, race, concat, combineLatest, ...combinations } = combination;
const observables = { zip, merge, race, concat, combineLatest, ...producer };
const operators = { tap, delay, timeout, catchError, groupBy, ...combinations, ...filtering, ...mathematical, ...transformation };

function inspect() {
    return typeof window != 'undefined' && window.__FASTRX_DEVTOOLS__;
}
// (typeof operators)[keyof typeof operators] extends (...arg:any[])=>Operator<number,number>?
type Operators<T> = {
    [Key in keyof typeof operators]: (typeof operators)[Key] extends (...arg: any[]) => Operator<T, any> ? (typeof operators)[Key] : never
};
const rxProxy = {
    get: <T>(target: Observable<T>, prop: keyof Operators<T> | "subscribe" | "toPromise"): (Subscribe<T> | Promise<T> | InstanceType<ProxyConstructor>) => {
        switch (prop) {
            case "subscribe":
                (...args: Parameters<typeof subscribe>) => subscribe<T>(...args)(target);
            case "toPromise":
                return () => toPromise<T>()(target);
            default:
                return (<R>(operator: (...args: any[]) => Operator<T, R>) => (...args: any[]) => new Proxy(operator(...args)(target), rxProxy))(operators[prop]);
        }
    }
};
type Obs = {
    subscribe: typeof subscribe;
    toPromise: typeof toPromise;
};
type Op = {
    [key in keyof (typeof operators)]: (...args: Parameters<((typeof operators))[key]>) => Op;
} & Obs;
type Rx = {
    [key in keyof typeof observables]: (...args: Parameters<(typeof observables)[key]>) => Op
};
export const rx: Rx = new Proxy(<T>(f: Observable<T>) => (inspect() ? new Node(f).pipe() : new Proxy(f, rxProxy)), {
    get: (_target: any, prop: keyof typeof observables) =>
        inspect()
            ? (...arg: any[]) => new Node(prop, arg).pipe()
            : (<T>(observable: (...args: any[]) => Observable<T>) => (...args: any[]) => new Proxy(observable(...args), rxProxy))(observables[prop]),
    // @ts-ignore
    set: (_target, prop: string, value) => (observables[prop] = value),
});