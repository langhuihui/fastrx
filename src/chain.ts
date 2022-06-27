import { Observable, Operator, Subscribe } from './common';
import * as producer from './producer';
import * as filtering from './filtering';
import * as mathematical from './mathematical';
import * as transformation from './transformation';
import { subscribe, toPromise, tap, timeout, toReadableStream } from './utils';
import * as combination from './combination';
const { zip, merge, race, concat, combineLatest, ...combinations } = combination;
const observables = { zip, merge, race, concat, combineLatest, ...producer };
const operators = { tap, timeout, ...combinations, ...filtering, ...mathematical, ...transformation };

// (typeof operators)[keyof typeof operators] extends (...arg:any[])=>Operator<number,number>?
type Operators<T> = {
  [Key in keyof typeof operators]: (typeof operators)[Key] extends (...arg: any[]) => Operator<T, any> ? (typeof operators)[Key] : never
};
const rxProxy = {
  get: <T, PROP extends keyof typeof operators>(target: Observable<T>, prop: PROP | "subscribe" | "toPromise"): (Subscribe<T> | Promise<T> | InstanceType<ProxyConstructor>) => {
    switch (prop) {
      case "subscribe":
        return (...args: Parameters<typeof subscribe>) => subscribe<T>(...args)(target);
      case "toPromise":
        return () => toPromise<T>()(target);
      case "toReadableStream":
        return () => toReadableStream<T>()(target);
      default:
        //@ts-ignore
        return (<R>(operator: (...args: Parameters<(typeof operators)[PROP]>) => Operator<T, R>) => (...args: Parameters<(typeof operators)[PROP]>) => new Proxy(operator(...args)(target), rxProxy))(operators[prop]);
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
export const rx: Rx = new Proxy(<T>(f: Observable<T>) => new Proxy(f, rxProxy), {
  get: (_target: any, prop: keyof typeof observables) =>
    (<T>(observable: (...args: any[]) => Observable<T>) => (...args: any[]) => new Proxy(observable(...args), rxProxy))(observables[prop]),
  // @ts-ignore
  set: (_target, prop: string, value) => (observables[prop] = value),
});