// @ts-nocheck
import * as _observables from './pipe';
import { Node } from './devtools';
import { observables, operators } from './index';
function inspect() {
    return typeof window != 'undefined' && window.__FASTRX_DEVTOOLS__;
}
const rxProxy = {
    get: (target, prop) => {
        switch (prop) {
            case "subscribe":
            case "toPromise":
                return (...args) => _observables[prop](...args)(target);
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
