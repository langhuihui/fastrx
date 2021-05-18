'use strict';

var rx = require('fastrx');
var vue = require('vue');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var rx__default = /*#__PURE__*/_interopDefaultLegacy(rx);

const eventHandler = once => {
  const observers = new Set();

  const observable = sink => {
    observers.add(sink);
    sink.defer([observers.delete, observers, sink]);
  };

  if (once) observable.handler = (...args) => {
    const arg = args.length > 1 ? args : args[0];
    observers.forEach(observer => {
      observer.next(arg);
      observer.complete();
    });
  };else observable.handler = (...args) => {
    const arg = args.length > 1 ? args : args[0];
    observers.forEach(observer => observer.next(arg));
  };
  return observable;
};
const fromLifeHook = (hook, once = true) => hook(eventHandler(once).handler);
const watch = (target, option) => sink => sink.defer(vue.watch(target, value => sink.next(value), option));
const toRef = () => source => vue.customRef((track, trigger) => {
  const sink = new Sink();
  let value;

  sink.next = d => (value = d, trigger());

  source(sink);
  vue.onUnmounted(() => sink.dispose());
  return {
    get() {
      track();
      return value;
    },

    set(value) {//nothing to do
    }

  };
});

var vue3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    eventHandler: eventHandler,
    fromLifeHook: fromLifeHook,
    watch: watch,
    toRef: toRef
});

var index = Object.assign(rx__default['default'], vue3);

module.exports = index;
//# sourceMappingURL=cjs.js.map
