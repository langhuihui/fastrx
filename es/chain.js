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
import * as producer from './producer';
import * as filtering from './filtering';
import * as mathematical from './mathematical';
import * as transformation from './transformation';
import { subscribe, toPromise, tap, timeout, toReadableStream } from './utils';
import * as combination from './combination';
const { zip, merge, race, concat, combineLatest } = combination, combinations = __rest(combination, ["zip", "merge", "race", "concat", "combineLatest"]);
const observables = Object.assign({ zip, merge, race, concat, combineLatest }, producer);
const operators = Object.assign(Object.assign(Object.assign(Object.assign({ tap, timeout }, combinations), filtering), mathematical), transformation);
const rxProxy = {
    get: (target, prop) => {
        switch (prop) {
            case "subscribe":
                return (...args) => subscribe(...args)(target);
            case "toPromise":
                return () => toPromise()(target);
            case "toReadableStream":
                return () => toReadableStream()(target);
            default:
                //@ts-ignore
                return ((operator) => (...args) => new Proxy(operator(...args)(target), rxProxy))(operators[prop]);
        }
    }
};
export const rx = new Proxy((f) => new Proxy(f, rxProxy), {
    get: (_target, prop) => ((observable) => (...args) => new Proxy(observable(...args), rxProxy))(observables[prop]),
    // @ts-ignore
    set: (_target, prop, value) => (observables[prop] = value),
});
