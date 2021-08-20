import * as _observables from './pipe';

import { Node } from './devtools';

const { Sink, pipe, reusePipe, Events, deliver, noop, ...observables } = _observables;
class GroupBy extends Sink {
  init(f) {
    this.f = f;
    this.groups = new Map();
  }
  next(data) {
    const key = this.f(data);
    let group = this.groups.get(key);
    if (!group) {
      group = rx.subject();
      group.key = key;
      this.groups.set(key, group);
      this.sink.next(group);
    }
    group.next(data);
  }
  complete(err) {
    this.groups.forEach((group) => group.complete(err));
    super.complete(err);
  }
}
observables.groupBy = deliver(GroupBy);

function inspect() {
  return typeof window != 'undefined' && window.__FASTRX_DEVTOOLS__;
}
function createRx() {
  if (typeof Proxy == 'undefined') {
    const prototype = {};
    //将一个Observable函数的原型修改为具有所有operator的方法
    const rx = (f) => Object.setPrototypeOf(f, prototype);
    //提供动态添加Obserable以及operator的方法
    rx.set = (ext) => {
      for (let key in ext) {
        const f = ext[key];
        switch (key) {
          case 'subscribe':
            prototype[key] = function (...args) {
              return f(...args)(this);
            };
            break;
          case 'toPromise':
            prototype[key] = function () {
              return f(this);
            };
            break;
          default:
            prototype[key] = function (...args) {
              return rx(f(...args)(this));
            };
            rx[key] = (...args) => rx(f(...args));
        }
      }
    };
    rx.set(observables);
    return rx;
  } else {
    const rxProxy = {
      get: (target, prop) =>
        prop in target
          ? target[prop]
          : (...args) => new Proxy(observables[prop](...args)(target), rxProxy),
    };
    return new Proxy((f) => (inspect() ? new Node(f).pipe() : new Proxy(f, rxProxy)), {
      get: (_target, prop) =>
        inspect()
          ? (...arg) => new Node(prop, arg).pipe()
          : (...args) => new Proxy(observables[prop](...args), rxProxy),
      set: (_target, prop, value) => (observables[prop] = value),
    });
  }
}
const rx = createRx();
export default rx;
