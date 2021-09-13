var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
// @ts-nocheck
import { tap, delay, subscribe, toPromise } from './pipe';
import { Node } from './devtools';
import * as producer from './producer';
import * as combination from './combination';
const { zip, merge, race, concat, combineLatest } = combination, combinations = __rest(combination, ["zip", "merge", "race", "concat", "combineLatest"]);
const observables = Object.assign({ zip, merge, race, concat, combineLatest }, producer);
//const operators = { tap, delay, timeout, catchError, groupBy, ...combinations, ...filtering, ...mathematical, ...transformation };
const operators = { tap, delay };
function inspect() {
    return typeof window != 'undefined' && window.__FASTRX_DEVTOOLS__;
}
const rxProxy = {
    get: (target, prop) => {
        switch (prop) {
            case "subscribe":
                return (...args) => subscribe(...args)(target);
            case "toPromise":
                return () => toPromise()(target);
            default:
                return ((operator) => (...args) => new Proxy(operator(...args)(target), rxProxy))(operators[prop]);
        }
    }
};
export const rx = new Proxy((f) => (inspect() ? new Node(f).pipe() : new Proxy(f, rxProxy)), {
    get: (_target, prop) => inspect()
        ? (...arg) => new Node(prop, arg).pipe()
        : ((observable) => (...args) => new Proxy(observable(...args), rxProxy))(observables[prop]),
    // @ts-ignore
    set: (_target, prop, value) => (observables[prop] = value),
});
