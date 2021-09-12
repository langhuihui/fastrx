// @ts-nocheck
import * as _observables from './pipe';
import { Subscribe } from './pipe';
import { Node } from './devtools';
import { Observable, Operator } from './common';
import { observables, operators } from './index';
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
            case "toPromise":
                return (...args: any[]) => _observables[prop](...args)(target);
            default:
                return (<R>(operator: (...args: any[]) => Operator<T, R>) => (...args: any[]) => new Proxy(operator(...args)(target), rxProxy))(operators[prop]);
        }
    }
};
export const rx = new Proxy(<T>(f: Observable<T>) => (inspect() ? new Node(f).pipe() : new Proxy(f, rxProxy)), {
    get: (_target: any, prop: keyof typeof observables) =>
        inspect()
            ? (...arg: any[]) => new Node(prop, arg).pipe()
            : (<T>(observable: (...args: any[]) => Observable<T>) => (...args: any[]) => new Proxy(observable(...args), rxProxy))(observables[prop]),
    // @ts-ignore
    set: (_target, prop: string, value) => (observables[prop] = value),
});