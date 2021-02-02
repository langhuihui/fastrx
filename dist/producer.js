'use strict';

require('core-js/modules/es.symbol');
require('core-js/modules/es.symbol.description');
require('core-js/modules/es.symbol.iterator');
require('core-js/modules/es.array.concat');
require('core-js/modules/es.array.find');
require('core-js/modules/es.array.iterator');
require('core-js/modules/es.object.to-string');
require('core-js/modules/es.promise');
require('core-js/modules/es.string.iterator');
require('core-js/modules/web.dom-collections.iterator');

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

var _require = require('./common'),
    Sink = _require.Sink,
    noop = _require.noop;

var _require2 = require('./combination'),
    share = _require2.share;

exports.subject = function (source) {
  var subSink = null;
  var observable = share()(function (sink) {
    subSink = sink;
    source && source(subSink);
  });

  observable.next = function (d) {
    return subSink && subSink.next(d);
  };

  observable.complete = function () {
    return subSink && subSink.complete();
  };

  observable.error = function (err) {
    return subSink && subSink.complete(err);
  };

  return observable;
};

exports.fromArray = function (array) {
  return function (sink) {
    var pos = 0;
    var l = array.length;

    while (pos < l && !sink.disposed) {
      sink.next(array[pos++]);
    }

    sink.complete();
  };
};

exports.of = function () {
  for (var _len = arguments.length, items = new Array(_len), _key = 0; _key < _len; _key++) {
    items[_key] = arguments[_key];
  }

  return exports.fromArray(items);
};

exports.interval = function (period) {
  return function (sink) {
    var i = 0;
    sink.defer([clearInterval,, setInterval(function () {
      return sink.next(i++);
    }, period)]);
  };
};

exports.timer = function (delay, period) {
  return function (sink) {
    var defer = [clearTimeout,, setTimeout(function () {
      if (period) {
        defer[0] = clearInterval;
        var i = 0;
        defer[2] = setInterval(function () {
          return sink.next(i++);
        }, period);
      } else {
        sink.next(0);
        sink.complete();
      }
    }, delay)];
    sink.defer(defer);
  };
};

exports.fromAnimationFrame = function () {
  return function (sink) {
    function next(t) {
      sink.next(t);
      defer[2] = requestAnimationFrame(next);
    }

    var defer = [cancelAnimationFrame,, requestAnimationFrame(next)];
    sink.defer(defer);
  };
};

exports.fromEventPattern = function (add, remove) {
  return function (sink) {
    var n = function n(d) {
      return sink.next(d);
    };

    sink.defer([remove,, n]);
    add(n);
  };
};

exports.fromEvent = function (target, name) {
  var addF = ['on', 'addEventListener', 'addListener'].find(function (x) {
    return typeof target[x] == 'function';
  });
  var removeF = ['off', 'removeEventListener', 'removeListener'].find(function (x) {
    return typeof target[x] == 'function';
  });
  if (addF && removeF) return exports.fromEventPattern(function (handler) {
    return target[addF](name, handler);
  }, function (handler) {
    return target[removeF](name, handler);
  });else throw 'target is not a EventDispachter';
};

exports.fromVueEvent = function (vm, name) {
  return function (sink) {
    var ls = function ls(e) {
      return sink.next(e);
    };

    vm.$on(name, ls);
    sink.defer([vm.$off, vm, ls]);
  };
};

exports.fromVueEventOnce = function (vm, name) {
  return function (sink) {
    return vm.$once(name, function (e) {
      return sink.next(e);
    });
  };
};

exports.fromEventSource = function (src, arg) {
  return function (sink) {
    if (typeof EventSource == 'undefined') {
      return sink.complete(new Error('No EventSource defined!'));
    }

    var evtSource = new EventSource(src, arg);

    evtSource.onerror = function (err) {
      return sink.complete(err);
    };

    evtSource.onmessage = function (evt) {
      return sink.next(evt.data);
    };

    sink.defer([evtSource.close, evtSource]);
  };
};

exports.fromFetch = function (url, opt) {
  return function (sink) {
    fetch(url, opt).then(function (res) {
      sink.next(res);
      sink.complete();
    }).catch(function (err) {
      return sink.complete(err);
    });
  };
};

exports.fromNextTick = function (vm) {
  return function (sink) {
    vm.$nextTick(function () {
      sink.next(vm);
      sink.complete();
    });
  };
};

exports.range = function (start, count) {
  return function (sink) {
    var pos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : start;
    var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : count + start;

    while (pos < end && !sink.disposed) {
      sink.next(pos++);
    }

    sink.complete();
  };
};

exports.fromPromise = function (source) {
  return function (sink) {
    source.then(function (d) {
      return sink.next(d), sink.complete();
    }).catch(function (e) {
      return sink.complete(e);
    });
  };
};

exports.fromIterable = function (source) {
  return function (sink) {
    try {
      var _iterator = _createForOfIteratorHelper(source),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var data = _step.value;
          sink.next(data);
          if (sink.disposed) return;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      sink.complete();
    } catch (err) {
      sink.complete(err);
    }
  };
};

exports.from = function (source) {
  switch (true) {
    case source instanceof Array:
      return exports.fromArray(source);

    case source instanceof Promise:
      return exports.fromPromise(source);

    case source[Symbol.iterator] && typeof source[Symbol.iterator] === 'function':
      return exports.fromIterable(source);

    default:
      return exports.of(source);
  }
};

exports.bindCallback = function (call, thisArg) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  return function (sink) {
    var inArgs = args.concat(function () {
      for (var _len3 = arguments.length, rargs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        rargs[_key3] = arguments[_key3];
      }

      return sink.next(rargs.length > 1 ? rargs : rargs[0]), sink.complete();
    });
    call.apply ? call.apply(thisArg, inArgs) : call.apply(void 0, _toConsumableArray(inArgs));
  };
};

exports.bindNodeCallback = function (call, thisArg) {
  for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
    args[_key4 - 2] = arguments[_key4];
  }

  return function (sink) {
    var inArgs = args.concat(function (err) {
      for (var _len5 = arguments.length, rargs = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        rargs[_key5 - 1] = arguments[_key5];
      }

      return err ? sink.complete(err) : (sink.next(rargs.length > 1 ? rargs : rargs[0]), sink.complete());
    });
    call.apply ? call.apply(thisArg, inArgs) : call.apply(void 0, _toConsumableArray(inArgs));
  };
};

exports.never = function () {
  return noop;
};

exports.throwError = function (e) {
  return function (sink) {
    return sink.complete(e);
  };
};

exports.empty = function () {
  return exports.throwError();
};
//# sourceMappingURL=producer.js.map
