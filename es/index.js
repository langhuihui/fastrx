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
export * from './common';
export * from './producer';
export * from './combination';
export * from './filtering';
export * from './mathematical';
export * from './transformation';
export * from './pipe';
import * as producer from './producer';
import * as filtering from './filtering';
import * as mathematical from './mathematical';
import * as transformation from './transformation';
import * as combination from './combination';
const { zip, merge, race, concat, combineLatest } = combination, combinations = __rest(combination, ["zip", "merge", "race", "concat", "combineLatest"]);
export const observables = Object.assign({ zip, merge, race, concat, combineLatest }, producer);
export const operators = Object.assign(Object.assign(Object.assign(Object.assign({}, combinations), filtering), mathematical), transformation);
