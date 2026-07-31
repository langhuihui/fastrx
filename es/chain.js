import * as producer from './producer';
import * as filtering from './filtering';
import * as mathematical from './mathematical';
import * as transformation from './transformation';
import { subscribe, toPromise, tap, timeout, toReadableStream } from './utils';
import * as combination from './combination';
const { zip, merge, race, concat, combineLatest, ...combinations } = combination;
const { setAsapScheduler, ...producerObservables } = producer;
const observables = { zip, merge, race, concat, combineLatest, ...producerObservables };
const operators = { tap, timeout, ...combinations, ...filtering, ...mathematical, ...transformation };
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
//# sourceMappingURL=chain.js.map