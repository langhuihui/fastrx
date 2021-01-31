'use strict';

require('core-js/modules/es.array.for-each.js');
require('core-js/modules/es.array.iterator.js');
require('core-js/modules/es.object.to-string.js');
require('core-js/modules/es.set.js');
require('core-js/modules/es.string.iterator.js');
require('core-js/modules/web.dom-collections.for-each.js');
require('core-js/modules/web.dom-collections.iterator.js');

exports.eventHandler = function () {
  var once = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var observers = new Set();

  var observable = function observable(sink) {
    observers.add(sink);
    sink.defer([observers.delete, observers, sink]);
  };

  if (once) observable.handler = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var arg = args.length > 1 ? args : args[0];
    observers.forEach(function (observer) {
      observer.next(arg);
      observer.complete();
    });
  };else observable.handler = function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var arg = args.length > 1 ? args : args[0];
    observers.forEach(function (observer) {
      return observer.next(arg);
    });
  };
  return observable;
};

exports.fromLifeHook = function (hook) {
  var once = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return hook(exports.eventHandler(once).handler);
};
//# sourceMappingURL=vue3.js.map
