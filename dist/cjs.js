'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('core-js/modules/es.array.concat.js');
require('core-js/modules/es.array.iterator.js');
require('core-js/modules/es.array.join.js');
require('core-js/modules/es.function.name.js');
require('core-js/modules/es.object.set-prototype-of.js');
require('core-js/modules/es.object.to-string.js');
require('core-js/modules/es.regexp.to-string.js');
require('core-js/modules/es.set.js');
require('core-js/modules/es.string.iterator.js');
require('core-js/modules/web.dom-collections.for-each.js');
require('core-js/modules/web.dom-collections.iterator.js');
require('core-js/modules/es.map.js');
require('core-js/modules/es.number.constructor.js');
require('core-js/modules/es.promise.js');
require('core-js/modules/es.array.map.js');
require('core-js/modules/es.array.filter.js');
require('core-js/modules/es.symbol.js');
require('core-js/modules/es.object.assign.js');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
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
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
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
      it = it.call(o);
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

var Share = /*#__PURE__*/function (_LastSink) {
  _inherits(Share, _LastSink);

  var _super = _createSuper(Share);

  function Share(source) {
    var _this;

    _classCallCheck(this, Share);

    _this = _super.call(this);
    _this.source = source;
    _this.sinks = new Set();
    return _this;
  }

  _createClass(Share, [{
    key: "add",
    value: function add(sink) {
      var _this2 = this;

      sink.defer(function () {
        return _this2.remove(sink);
      });

      if (this.sinks.add(sink).size === 1) {
        this.reset();
        this.subscribe(this.source);
      }
    }
  }, {
    key: "remove",
    value: function remove(sink) {
      this.sinks.delete(sink);

      if (this.sinks.size === 0) {
        this.dispose();
      }
    }
  }, {
    key: "next",
    value: function next(data) {
      this.sinks.forEach(function (s) {
        return s.next(data);
      });
    }
  }, {
    key: "complete",
    value: function complete() {
      this.sinks.forEach(function (s) {
        return s.complete();
      });
      this.sinks.clear();
    }
  }, {
    key: "error",
    value: function error(err) {
      this.sinks.forEach(function (s) {
        return s.error(err);
      });
      this.sinks.clear();
    }
  }]);

  return Share;
}(LastSink);

function share() {
  var _arguments = arguments;
  return function (source) {
    var share = new Share(source);
    return create(share.add.bind(share), "share", _arguments);
  };
}
function merge() {
  for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) {
    sources[_key] = arguments[_key];
  }

  return create(function (sink) {
    var merge = new Sink(sink);
    var nLife = sources.length;

    merge.complete = function () {
      if (--nLife === 0) {
        sink.complete();
      }
    };

    sources.forEach(merge.bindSubscribe);
  }, "merge", arguments);
}
function race() {
  for (var _len2 = arguments.length, sources = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    sources[_key2] = arguments[_key2];
  }

  return create(function (sink) {
    var sinks = new Map();
    sources.forEach(function (source) {
      var r = new Sink(sink);
      sinks.set(source, r);

      r.complete = function () {
        sinks.delete(source);

        if (sinks.size === 0) {
          //特殊情况：所有流都没有数据
          sink.complete();
        } else {
          r.dispose();
        }
      };

      r.next = function (data) {
        sinks.delete(source); //先排除自己，防止自己调用dispose

        sinks.forEach(function (s) {
          return s.dispose();
        }); //其他所有流全部取消订阅

        r.resetNext();
        r.resetComplete();
        r.next(data);
      };
    });
    sources.forEach(function (source) {
      return sinks.get(source).subscribe(source);
    });
  }, "race", arguments);
}
function concat() {
  for (var _len3 = arguments.length, sources = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    sources[_key3] = arguments[_key3];
  }

  return create(function (sink) {
    var pos = 0;
    var len = sources.length;
    var s = new Sink(sink);

    s.complete = function () {
      if (pos < len && !s.disposed) {
        s.doDefer();
        s.subscribe(sources[pos++]);
      } else sink.complete();
    };

    s.complete();
  }, "concat", arguments);
}
function shareReplay(bufferSize) {
  var _arguments2 = arguments;
  return function (source) {
    var share = new Share(source);
    var buffer = [];

    share.next = function (data) {
      buffer.push(data);

      if (buffer.length > bufferSize) {
        buffer.shift();
      }

      this.sinks.forEach(function (s) {
        return s.next(data);
      });
    };

    return create(function (sink) {
      sink.defer(function () {
        return share.remove(sink);
      });
      buffer.forEach(function (cache) {
        return sink.next(cache);
      });
      share.add(sink);
    }, "shareReplay", _arguments2);
  };
}
function iif(condition, trueS, falseS) {
  return create(function (sink) {
    return condition() ? trueS(sink) : falseS(sink);
  }, "iif", arguments);
}
function combineLatest() {
  for (var _len4 = arguments.length, sources = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    sources[_key4] = arguments[_key4];
  }

  return create(function (sink) {
    var nTotal = sources.length;
    var nRun = nTotal; //剩余未发出事件的事件流数量

    var nLife = nTotal; //剩余未完成的事件流数量

    var array = new Array(nTotal);

    var onComplete = function onComplete() {
      if (--nLife === 0) sink.complete();
    };

    var s = function s(source, i) {
      var ss = new Sink(sink);

      ss.next = function (data) {
        if (--nRun === 0) {
          ss.next = function (data) {
            array[i] = data;
            sink.next(array);
          };

          ss.next(data);
        } else {
          array[i] = data;
        }
      };

      ss.complete = onComplete;
      ss.subscribe(source);
    };

    sources.forEach(s);
  }, "combineLatest", arguments);
}
function zip() {
  for (var _len5 = arguments.length, sources = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    sources[_key5] = arguments[_key5];
  }

  return create(function (sink) {
    var nTotal = sources.length;
    var nLife = nTotal; //剩余未完成的事件流数量

    var array = new Array(nTotal);

    var onComplete = function onComplete() {
      if (--nLife === 0) sink.complete();
    };

    var s = function s(source, i) {
      var ss = new Sink(sink);
      var buffer = [];
      array[i] = buffer;

      ss.next = function (data) {
        buffer.push(data);

        if (array.every(function (x) {
          return x.length;
        })) {
          sink.next(array.map(function (x) {
            return x.shift();
          }));
        }
      };

      ss.complete = onComplete;
      ss.subscribe(source);
    };

    sources.forEach(s);
  }, "zip", arguments);
}
function startWith() {
  var _arguments3 = arguments;

  for (var _len6 = arguments.length, xs = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    xs[_key6] = arguments[_key6];
  }

  return function (inputSource) {
    return create(function (sink) {
      var pos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var l = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : xs.length;

      while (pos < l && !sink.disposed) {
        sink.next(xs[pos++]);
      }

      sink.disposed || sink.subscribe(inputSource);
    }, "startWith", _arguments3);
  };
}

var WithLatestFrom = /*#__PURE__*/function (_Sink) {
  _inherits(WithLatestFrom, _Sink);

  var _super2 = _createSuper(WithLatestFrom);

  function WithLatestFrom(sink) {
    var _this3;

    _classCallCheck(this, WithLatestFrom);

    _this3 = _super2.call(this, sink);
    var s = new Sink(_this3.sink);

    s.next = function (data) {
      return _this3.buffer = data;
    };

    s.complete = nothing;

    for (var _len7 = arguments.length, sources = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
      sources[_key7 - 1] = arguments[_key7];
    }

    s.subscribe(combineLatest.apply(void 0, sources));
    return _this3;
  }

  _createClass(WithLatestFrom, [{
    key: "next",
    value: function next(data) {
      if (this.buffer) {
        this.sink.next([data].concat(_toConsumableArray(this.buffer)));
      }
    }
  }]);

  return WithLatestFrom;
}(Sink);

var withLatestFrom = deliver(WithLatestFrom, "withLatestFrom");

var BufferCount = /*#__PURE__*/function (_Sink2) {
  _inherits(BufferCount, _Sink2);

  var _super3 = _createSuper(BufferCount);

  function BufferCount(sink, bufferSize, startBufferEvery) {
    var _this4;

    _classCallCheck(this, BufferCount);

    _this4 = _super3.call(this, sink);
    _this4.bufferSize = bufferSize;
    _this4.startBufferEvery = startBufferEvery;
    _this4.buffer = [];
    _this4.count = 0;

    if (_this4.startBufferEvery) {
      _this4.buffers = [[]];
    }

    return _this4;
  }

  _createClass(BufferCount, [{
    key: "next",
    value: function next(data) {
      if (this.startBufferEvery) {
        if (this.count++ === this.startBufferEvery) {
          this.buffers.push([]);
          this.count = 1;
        }

        this.buffers.forEach(function (buffer) {
          buffer.push(data);
        });

        if (this.buffers[0].length === this.bufferSize) {
          this.sink.next(this.buffers.shift());
        }
      } else {
        this.buffer.push(data);

        if (this.buffer.length === this.bufferSize) {
          this.sink.next(this.buffer);
          this.buffer = [];
        }
      }
    }
  }, {
    key: "complete",
    value: function complete() {
      var _this5 = this;

      if (this.buffer.length) {
        this.sink.next(this.buffer);
      } else if (this.buffers.length) {
        this.buffers.forEach(function (buffer) {
          return _this5.sink.next(buffer);
        });
      }

      _get(_getPrototypeOf(BufferCount.prototype), "complete", this).call(this);
    }
  }]);

  return BufferCount;
}(Sink);

var bufferCount = deliver(BufferCount, "bufferCount"); // export function operator<T, R, ARG extends unknown[]>(f: (...args: [ISink<R>, ...ARG]) => ISink<T>) {
//   return (...args: ARG): (Operator<T, R>) => source => sink => f(sink, ...args).subscribe(source);
// }

var Buffer = /*#__PURE__*/function (_Sink3) {
  _inherits(Buffer, _Sink3);

  var _super4 = _createSuper(Buffer);

  function Buffer(sink, closingNotifier) {
    var _this6;

    _classCallCheck(this, Buffer);

    _this6 = _super4.call(this, sink);
    _this6.buffer = [];
    var s = new Sink(sink);

    s.next = function (_data) {
      sink.next(_this6.buffer);
      _this6.buffer = [];
    };

    s.complete = nothing;
    s.subscribe(closingNotifier);
    return _this6;
  }

  _createClass(Buffer, [{
    key: "next",
    value: function next(data) {
      this.buffer.push(data);
    }
  }, {
    key: "complete",
    value: function complete() {
      if (this.buffer.length) {
        this.sink.next(this.buffer);
      }

      _get(_getPrototypeOf(Buffer.prototype), "complete", this).call(this);
    }
  }]);

  return Buffer;
}(Sink);

var buffer = deliver(Buffer, "buffer");

var combination = /*#__PURE__*/Object.freeze({
  __proto__: null,
  share: share,
  merge: merge,
  race: race,
  concat: concat,
  shareReplay: shareReplay,
  iif: iif,
  combineLatest: combineLatest,
  zip: zip,
  startWith: startWith,
  withLatestFrom: withLatestFrom,
  bufferCount: bufferCount,
  buffer: buffer
});

var Reduce = /*#__PURE__*/function (_Sink) {
  _inherits(Reduce, _Sink);

  var _super = _createSuper(Reduce);

  function Reduce(sink, f, seed) {
    var _this;

    _classCallCheck(this, Reduce);

    _this = _super.call(this, sink);
    _this.f = f;

    var accSet = function accSet() {
      _this.sink.next(_this.acc);

      _this.sink.complete();
    };

    if (typeof seed === "undefined") {
      _this.next = function (d) {
        _this.acc = d;
        _this.complete = accSet;

        _this.resetNext();
      };
    } else {
      _this.acc = seed;
      _this.complete = accSet;
    }

    return _this;
  }

  _createClass(Reduce, [{
    key: "next",
    value: function next(data) {
      this.acc = this.f(this.acc, data);
    }
  }]);

  return Reduce;
}(Sink);

var reduce = deliver(Reduce, "reduce");
var count = function count(f) {
  return deliver(Reduce, "count")(function (aac, c) {
    return f(c) ? aac + 1 : aac;
  }, 0);
};
var max = function max() {
  return deliver(Reduce, "max")(Math.max);
};
var min = function min() {
  return deliver(Reduce, "min")(Math.min);
};
var sum = function sum() {
  return deliver(Reduce, "sum")(function (aac, c) {
    return aac + c;
  }, 0);
};

var mathematical = /*#__PURE__*/Object.freeze({
  __proto__: null,
  reduce: reduce,
  count: count,
  max: max,
  min: min,
  sum: sum
});

var Filter = /*#__PURE__*/function (_Sink) {
  _inherits(Filter, _Sink);

  var _super = _createSuper(Filter);

  function Filter(sink, filter, thisArg) {
    var _this;

    _classCallCheck(this, Filter);

    _this = _super.call(this, sink);
    _this.filter = filter;
    _this.thisArg = thisArg;
    return _this;
  }

  _createClass(Filter, [{
    key: "next",
    value: function next(data) {
      if (this.filter.call(this.thisArg, data)) {
        this.sink.next(data);
      }
    }
  }]);

  return Filter;
}(Sink);

var filter = deliver(Filter, "filter");

var Ignore = /*#__PURE__*/function (_Sink2) {
  _inherits(Ignore, _Sink2);

  var _super2 = _createSuper(Ignore);

  function Ignore() {
    _classCallCheck(this, Ignore);

    return _super2.apply(this, arguments);
  }

  _createClass(Ignore, [{
    key: "next",
    value: function next(_data) {}
  }]);

  return Ignore;
}(Sink);

var ignoreElements = deliver(Ignore, "ignoreElements");

var Take = /*#__PURE__*/function (_Sink3) {
  _inherits(Take, _Sink3);

  var _super3 = _createSuper(Take);

  function Take(sink, count) {
    var _this2;

    _classCallCheck(this, Take);

    _this2 = _super3.call(this, sink);
    _this2.count = count;
    return _this2;
  }

  _createClass(Take, [{
    key: "next",
    value: function next(data) {
      this.sink.next(data);

      if (--this.count === 0) {
        this.complete();
      }
    }
  }]);

  return Take;
}(Sink);

var take = deliver(Take, "take");
function takeUntil(control) {
  var _arguments = arguments;
  return function (source) {
    return create(function (sink) {
      var _takeUntil = new Sink(sink);

      _takeUntil.next = function () {
        return sink.complete();
      };

      _takeUntil.complete = dispose;

      _takeUntil.subscribe(control);

      sink.subscribe(source);
    }, "takeUntil", _arguments);
  };
}

var TakeWhile = /*#__PURE__*/function (_Sink4) {
  _inherits(TakeWhile, _Sink4);

  var _super4 = _createSuper(TakeWhile);

  function TakeWhile(sink, f) {
    var _this3;

    _classCallCheck(this, TakeWhile);

    _this3 = _super4.call(this, sink);
    _this3.f = f;
    return _this3;
  }

  _createClass(TakeWhile, [{
    key: "next",
    value: function next(data) {
      if (this.f(data)) {
        this.sink.next(data);
      } else {
        this.complete();
      }
    }
  }]);

  return TakeWhile;
}(Sink);

var takeWhile = deliver(TakeWhile, "takeWhile");
var takeLast = function takeLast(count) {
  return reduce(function (buffer, d) {
    buffer.push(d);
    if (buffer.length > count) buffer.shift();
    return buffer;
  }, []);
};

var Skip = /*#__PURE__*/function (_Sink5) {
  _inherits(Skip, _Sink5);

  var _super5 = _createSuper(Skip);

  function Skip(sink, count) {
    var _this4;

    _classCallCheck(this, Skip);

    _this4 = _super5.call(this, sink);
    _this4.count = count;
    return _this4;
  }

  _createClass(Skip, [{
    key: "next",
    value: function next(_data) {
      if (--this.count === 0) {
        this.next = _get(_getPrototypeOf(Skip.prototype), "next", this);
      }
    }
  }]);

  return Skip;
}(Sink);

var skip = deliver(Skip, "skip");
function skipUntil(control) {
  var _arguments2 = arguments;
  return function (source) {
    return create(function (sink) {
      sink.next = nothing;

      var _skipUntil = new Sink(sink);

      _skipUntil.next = function () {
        _skipUntil.dispose();

        sink.resetNext();
      };

      _skipUntil.complete = dispose;

      _skipUntil.subscribe(control);

      sink.subscribe(source);
    }, "skipUntil", _arguments2);
  };
}

var SkipWhile = /*#__PURE__*/function (_Sink6) {
  _inherits(SkipWhile, _Sink6);

  var _super6 = _createSuper(SkipWhile);

  function SkipWhile(sink, f) {
    var _this5;

    _classCallCheck(this, SkipWhile);

    _this5 = _super6.call(this, sink);
    _this5.f = f;
    return _this5;
  }

  _createClass(SkipWhile, [{
    key: "next",
    value: function next(data) {
      if (!this.f(data)) {
        this.next = _get(_getPrototypeOf(SkipWhile.prototype), "next", this);
        this.next(data);
      }
    }
  }]);

  return SkipWhile;
}(Sink);

var skipWhile = deliver(SkipWhile, "skipWhile");
var defaultThrottleConfig = {
  leading: true,
  trailing: false
};

var _Throttle = /*#__PURE__*/function (_Sink7) {
  _inherits(_Throttle, _Sink7);

  var _super7 = _createSuper(_Throttle);

  function _Throttle(sink, durationSelector, trailing) {
    var _this6;

    _classCallCheck(this, _Throttle);

    _this6 = _super7.call(this, sink);
    _this6.durationSelector = durationSelector;
    _this6.trailing = trailing;
    return _this6;
  }

  _createClass(_Throttle, [{
    key: "cacheValue",
    value: function cacheValue(value) {
      this.last = value; // @ts-ignore

      delete this.send;
      if (this.disposed) this.throttle(value);
    }
  }, {
    key: "send",
    value: function send(data) {
      this.send = nothing;
      this.sink.next(data);
      this.throttle(data);
    }
  }, {
    key: "throttle",
    value: function throttle(data) {
      this.reset();
      this.subscribe(this.durationSelector(data));
    }
  }, {
    key: "next",
    value: function next() {
      this.complete();
    }
  }, {
    key: "complete",
    value: function complete() {
      this.dispose();

      if (this.trailing) {
        this.send(this.last);
      }
    }
  }]);

  return _Throttle;
}(Sink);

var Throttle = /*#__PURE__*/function (_Sink8) {
  _inherits(Throttle, _Sink8);

  var _super8 = _createSuper(Throttle);

  function Throttle(sink, durationSelector) {
    var _this7;

    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultThrottleConfig;

    _classCallCheck(this, Throttle);

    _this7 = _super8.call(this, sink);
    _this7.durationSelector = durationSelector;
    _this7.config = config;
    _this7._throttle = new _Throttle(_this7.sink, _this7.durationSelector, _this7.config.trailing);

    _this7._throttle.dispose();

    return _this7;
  }

  _createClass(Throttle, [{
    key: "next",
    value: function next(data) {
      if (this._throttle.disposed && this.config.leading) {
        this._throttle.send(data);
      } else {
        this._throttle.cacheValue(data);
      }
    }
  }, {
    key: "complete",
    value: function complete() {
      this._throttle.throttle = nothing; //最后不再启动节流

      this._throttle.complete();

      _get(_getPrototypeOf(Throttle.prototype), "complete", this).call(this);
    }
  }]);

  return Throttle;
}(Sink);

var throttle = deliver(Throttle, "throttle");
var defaultAuditConfig = {
  leading: false,
  trailing: true
};
var audit = function audit(durationSelector) {
  return deliver(Throttle, "audit")(durationSelector, defaultAuditConfig);
};

var _Debounce = /*#__PURE__*/function (_Sink9) {
  _inherits(_Debounce, _Sink9);

  var _super9 = _createSuper(_Debounce);

  function _Debounce() {
    _classCallCheck(this, _Debounce);

    return _super9.apply(this, arguments);
  }

  _createClass(_Debounce, [{
    key: "next",
    value: function next() {
      this.complete();
    }
  }, {
    key: "complete",
    value: function complete() {
      this.dispose();
      this.sink.next(this.last);
    }
  }]);

  return _Debounce;
}(Sink);

var Debounce = /*#__PURE__*/function (_Sink10) {
  _inherits(Debounce, _Sink10);

  var _super10 = _createSuper(Debounce);

  function Debounce(sink, durationSelector) {
    var _this8;

    _classCallCheck(this, Debounce);

    _this8 = _super10.call(this, sink);
    _this8.durationSelector = durationSelector;
    _this8._debounce = new _Debounce(_this8.sink);

    _this8._debounce.dispose();

    return _this8;
  }

  _createClass(Debounce, [{
    key: "next",
    value: function next(data) {
      this._debounce.dispose();

      this._debounce.reset();

      this._debounce.last = data;

      this._debounce.subscribe(this.durationSelector(data));
    }
  }, {
    key: "complete",
    value: function complete() {
      this._debounce.complete();

      _get(_getPrototypeOf(Debounce.prototype), "complete", this).call(this);
    }
  }]);

  return Debounce;
}(Sink);

var debounce = deliver(Debounce, "debounce");
var debounceTime = function debounceTime(period) {
  return deliver(Debounce, "debounceTime")(function (_d) {
    return timer(period);
  });
};

var ElementAt = /*#__PURE__*/function (_Sink11) {
  _inherits(ElementAt, _Sink11);

  var _super11 = _createSuper(ElementAt);

  function ElementAt(sink, count, defaultValue) {
    var _this9;

    _classCallCheck(this, ElementAt);

    _this9 = _super11.call(this, sink);
    _this9.count = count;
    _this9.defaultValue = defaultValue;
    return _this9;
  }

  _createClass(ElementAt, [{
    key: "next",
    value: function next(data) {
      if (this.count-- === 0) {
        this.defaultValue = data;
        this.complete();
      }
    }
  }, {
    key: "complete",
    value: function complete() {
      if (this.defaultValue === void 0) {
        this.error(new Error('not enough elements in sequence'));
        return;
      } else this.sink.next(this.defaultValue);

      _get(_getPrototypeOf(ElementAt.prototype), "complete", this).call(this);
    }
  }]);

  return ElementAt;
}(Sink);

var elementAt = deliver(ElementAt, "elementAt");
var find = function find(f) {
  return function (source) {
    return take(1)(skipWhile(function (d) {
      return !f(d);
    })(source));
  };
};

var FindIndex = /*#__PURE__*/function (_Sink12) {
  _inherits(FindIndex, _Sink12);

  var _super12 = _createSuper(FindIndex);

  function FindIndex(sink, f) {
    var _this10;

    _classCallCheck(this, FindIndex);

    _this10 = _super12.call(this, sink);
    _this10.f = f;
    _this10.i = 0;
    return _this10;
  }

  _createClass(FindIndex, [{
    key: "next",
    value: function next(data) {
      if (this.f(data)) {
        this.sink.next(this.i++);
        this.complete();
      } else {
        ++this.i;
      }
    }
  }]);

  return FindIndex;
}(Sink);

var findIndex = deliver(FindIndex, "findIndex");

var First = /*#__PURE__*/function (_Sink13) {
  _inherits(First, _Sink13);

  var _super13 = _createSuper(First);

  function First(sink, f, defaultValue) {
    var _this11;

    _classCallCheck(this, First);

    _this11 = _super13.call(this, sink);
    _this11.f = f;
    _this11.defaultValue = defaultValue;
    _this11.index = 0;
    return _this11;
  }

  _createClass(First, [{
    key: "next",
    value: function next(data) {
      if (!this.f || this.f(data, this.index++)) {
        this.defaultValue = data;
        this.complete();
      }
    }
  }, {
    key: "complete",
    value: function complete() {
      if (this.defaultValue === void 0) {
        this.error(new Error('no elements in sequence'));
        return;
      } else this.sink.next(this.defaultValue);

      _get(_getPrototypeOf(First.prototype), "complete", this).call(this);
    }
  }]);

  return First;
}(Sink);

var first = deliver(First, "first");

var Last = /*#__PURE__*/function (_Sink14) {
  _inherits(Last, _Sink14);

  var _super14 = _createSuper(Last);

  function Last(sink, f, defaultValue) {
    var _this12;

    _classCallCheck(this, Last);

    _this12 = _super14.call(this, sink);
    _this12.f = f;
    _this12.defaultValue = defaultValue;
    _this12.index = 0;
    return _this12;
  }

  _createClass(Last, [{
    key: "next",
    value: function next(data) {
      if (!this.f || this.f(data, this.index++)) {
        this.defaultValue = data;
      }
    }
  }, {
    key: "complete",
    value: function complete() {
      if (this.defaultValue === void 0) {
        this.error(new Error('no elements in sequence'));
        return;
      } else this.sink.next(this.defaultValue);

      _get(_getPrototypeOf(Last.prototype), "complete", this).call(this);
    }
  }]);

  return Last;
}(Sink);

var last = deliver(Last, 'last');

var Every = /*#__PURE__*/function (_Sink15) {
  _inherits(Every, _Sink15);

  var _super15 = _createSuper(Every);

  function Every(sink, predicate) {
    var _this13;

    _classCallCheck(this, Every);

    _this13 = _super15.call(this, sink);
    _this13.predicate = predicate;
    _this13.index = 0;
    return _this13;
  }

  _createClass(Every, [{
    key: "next",
    value: function next(data) {
      if (!this.predicate(data, this.index++)) {
        this.result = false;
        this.complete();
      } else {
        this.result = true;
      }
    }
  }, {
    key: "complete",
    value: function complete() {
      if (this.result === void 0) {
        this.error(new Error('no elements in sequence'));
        return;
      } else this.sink.next(this.result);

      _get(_getPrototypeOf(Every.prototype), "complete", this).call(this);
    }
  }]);

  return Every;
}(Sink);

var every = deliver(Every, "every");

var filtering = /*#__PURE__*/Object.freeze({
  __proto__: null,
  filter: filter,
  ignoreElements: ignoreElements,
  take: take,
  takeUntil: takeUntil,
  takeWhile: takeWhile,
  takeLast: takeLast,
  skip: skip,
  skipUntil: skipUntil,
  skipWhile: skipWhile,
  throttle: throttle,
  audit: audit,
  debounce: debounce,
  debounceTime: debounceTime,
  elementAt: elementAt,
  find: find,
  findIndex: findIndex,
  first: first,
  last: last,
  every: every
});

var Scan = /*#__PURE__*/function (_Sink) {
  _inherits(Scan, _Sink);

  var _super = _createSuper(Scan);

  function Scan(sink, f, seed) {
    var _this;

    _classCallCheck(this, Scan);

    _this = _super.call(this, sink);
    _this.f = f;

    if (typeof seed === "undefined") {
      _this.next = function (d) {
        _this.acc = d;

        _this.resetNext();

        _this.sink.next(_this.acc);
      };
    } else {
      _this.acc = seed;
    }

    return _this;
  }

  _createClass(Scan, [{
    key: "next",
    value: function next(data) {
      this.sink.next(this.acc = this.f(this.acc, data));
    }
  }]);

  return Scan;
}(Sink);

var scan = deliver(Scan, "scan");

var Pairwise = /*#__PURE__*/function (_Sink2) {
  _inherits(Pairwise, _Sink2);

  var _super2 = _createSuper(Pairwise);

  function Pairwise() {
    var _this2;

    _classCallCheck(this, Pairwise);

    _this2 = _super2.apply(this, arguments);
    _this2.hasLast = false;
    return _this2;
  }

  _createClass(Pairwise, [{
    key: "next",
    value: function next(data) {
      if (this.hasLast) {
        this.sink.next([this.last, data]);
      } else {
        this.hasLast = true;
      }

      this.last = data;
    }
  }]);

  return Pairwise;
}(Sink);

var pairwise = deliver(Pairwise, "pairwise");

var MapObserver = /*#__PURE__*/function (_Sink3) {
  _inherits(MapObserver, _Sink3);

  var _super3 = _createSuper(MapObserver);

  function MapObserver(sink, mapper, thisArg) {
    var _this3;

    _classCallCheck(this, MapObserver);

    _this3 = _super3.call(this, sink);
    _this3.mapper = mapper;
    _this3.thisArg = thisArg;
    return _this3;
  }

  _createClass(MapObserver, [{
    key: "next",
    value: function next(data) {
      _get(_getPrototypeOf(MapObserver.prototype), "next", this).call(this, this.mapper.call(this.thisArg, data));
    }
  }]);

  return MapObserver;
}(Sink);

var map = deliver(MapObserver, "map");
var mapTo = function mapTo(target) {
  return map(function (_x) {
    return target;
  });
};

var InnerSink = /*#__PURE__*/function (_Sink4) {
  _inherits(InnerSink, _Sink4);

  var _super4 = _createSuper(InnerSink);

  function InnerSink(sink, data, context) {
    var _this4;

    _classCallCheck(this, InnerSink);

    _this4 = _super4.call(this, sink);
    _this4.data = data;
    _this4.context = context;
    return _this4;
  }

  _createClass(InnerSink, [{
    key: "next",
    value: function next(data) {
      var combineResults = this.context.combineResults;

      if (combineResults) {
        this.sink.next(combineResults(this.data, data));
      } else {
        this.sink.next(data);
      }
    } // 如果complete先于context的complete触发，则激活原始的context的complete

  }, {
    key: "tryComplete",
    value: function tryComplete() {
      this.context.resetComplete();
      this.dispose();
    }
  }]);

  return InnerSink;
}(Sink);

var Maps = /*#__PURE__*/function (_Sink5) {
  _inherits(Maps, _Sink5);

  var _super5 = _createSuper(Maps);

  function Maps(sink, makeSource, combineResults) {
    var _this5;

    _classCallCheck(this, Maps);

    _this5 = _super5.call(this, sink);
    _this5.makeSource = makeSource;
    _this5.combineResults = combineResults;
    _this5.index = 0;
    return _this5;
  }

  _createClass(Maps, [{
    key: "subInner",
    value: function subInner(data, c) {
      var sink = this.currentSink = new c(this.sink, data, this);
      this.complete = this.tryComplete;
      sink.complete = sink.tryComplete;
      this.makeSource(data, this.index++)(sink);
    } // 如果complete先于inner的complete触发，则不传播complete

  }, {
    key: "tryComplete",
    value: function tryComplete() {
      // 如果tryComplete被调用，说明currentSink已经存在
      this.currentSink.resetComplete();
      this.dispose();
    }
  }]);

  return Maps;
}(Sink);

var _SwitchMap = /*#__PURE__*/function (_InnerSink) {
  _inherits(_SwitchMap, _InnerSink);

  var _super6 = _createSuper(_SwitchMap);

  function _SwitchMap() {
    _classCallCheck(this, _SwitchMap);

    return _super6.apply(this, arguments);
  }

  return _SwitchMap;
}(InnerSink);

var SwitchMap = /*#__PURE__*/function (_Maps) {
  _inherits(SwitchMap, _Maps);

  var _super7 = _createSuper(SwitchMap);

  function SwitchMap() {
    _classCallCheck(this, SwitchMap);

    return _super7.apply(this, arguments);
  }

  _createClass(SwitchMap, [{
    key: "next",
    value: function next(data) {
      var _this6 = this;

      this.subInner(data, _SwitchMap);

      this.next = function (data) {
        _this6.currentSink.dispose();

        _this6.subInner(data, _SwitchMap);
      };
    }
  }]);

  return SwitchMap;
}(Maps);

var switchMap = deliver(SwitchMap, "switchMap");

function makeMapTo(f) {
  return function (innerSource, combineResults) {
    return f(function () {
      return innerSource;
    }, combineResults);
  };
}

var switchMapTo = makeMapTo(switchMap);

var _ConcatMap = /*#__PURE__*/function (_InnerSink2) {
  _inherits(_ConcatMap, _InnerSink2);

  var _super8 = _createSuper(_ConcatMap);

  function _ConcatMap() {
    _classCallCheck(this, _ConcatMap);

    return _super8.apply(this, arguments);
  }

  _createClass(_ConcatMap, [{
    key: "tryComplete",
    value: function tryComplete() {
      this.dispose();

      if (this.context.sources.length) {
        this.context.subNext();
      } else {
        this.context.resetNext();
        this.context.resetComplete();
      }
    }
  }]);

  return _ConcatMap;
}(InnerSink);

var ConcatMap = /*#__PURE__*/function (_Maps2) {
  _inherits(ConcatMap, _Maps2);

  var _super9 = _createSuper(ConcatMap);

  function ConcatMap() {
    var _this7;

    _classCallCheck(this, ConcatMap);

    _this7 = _super9.apply(this, arguments);
    _this7.sources = [];
    _this7.next2 = _this7.sources.push.bind(_this7.sources);
    return _this7;
  }

  _createClass(ConcatMap, [{
    key: "next",
    value: function next(data) {
      this.next2(data);
      this.subNext();
    }
  }, {
    key: "subNext",
    value: function subNext() {
      this.next = this.next2; //后续直接push，不触发subNext

      this.subInner(this.sources.shift(), _ConcatMap);

      if (this.disposed && this.sources.length === 0) {
        // 最后一个innerSink，需要激活其真实的complete
        this.currentSink.resetComplete();
      }
    }
  }, {
    key: "tryComplete",
    value: function tryComplete() {
      if (this.sources.length === 0) // 最后一个innerSink，需要激活其真实的complete
        this.currentSink.resetComplete();
      this.dispose();
    }
  }]);

  return ConcatMap;
}(Maps);

var concatMap = deliver(ConcatMap, "concatMap");
var concatMapTo = makeMapTo(concatMap);

var _MergeMap = /*#__PURE__*/function (_InnerSink3) {
  _inherits(_MergeMap, _InnerSink3);

  var _super10 = _createSuper(_MergeMap);

  function _MergeMap() {
    _classCallCheck(this, _MergeMap);

    return _super10.apply(this, arguments);
  }

  _createClass(_MergeMap, [{
    key: "tryComplete",
    value: function tryComplete() {
      this.context.inners.delete(this);

      _get(_getPrototypeOf(_MergeMap.prototype), "dispose", this).call(this);

      if (this.context.inners.size === 0) this.context.resetComplete();
    }
  }]);

  return _MergeMap;
}(InnerSink); // type __Maps<C> = C extends MapContext<infer T, infer U, infer R> ? C : never;
// type _Maps<C> = C extends InnerSink<infer T, infer U, infer R, infer> ? Maps<T, U, R, C> : never;


var MergeMap = /*#__PURE__*/function (_Maps3) {
  _inherits(MergeMap, _Maps3);

  var _super11 = _createSuper(MergeMap);

  function MergeMap() {
    var _this8;

    _classCallCheck(this, MergeMap);

    _this8 = _super11.apply(this, arguments);
    _this8.inners = new Set();
    return _this8;
  }

  _createClass(MergeMap, [{
    key: "next",
    value: function next(data) {
      this.subInner(data, _MergeMap);
      this.inners.add(this.currentSink);
    }
  }, {
    key: "tryComplete",
    value: function tryComplete() {
      // 最后一个innerSink，需要激活其真实的complete
      if (this.inners.size === 1) this.inners.forEach(function (s) {
        return s.resetComplete();
      });else this.dispose();
    }
  }]);

  return MergeMap;
}(Maps);

var mergeMap = deliver(MergeMap, "mergeMap");
var mergeMapTo = makeMapTo(mergeMap);

var _ExhaustMap = /*#__PURE__*/function (_InnerSink4) {
  _inherits(_ExhaustMap, _InnerSink4);

  var _super12 = _createSuper(_ExhaustMap);

  function _ExhaustMap() {
    _classCallCheck(this, _ExhaustMap);

    return _super12.apply(this, arguments);
  }

  _createClass(_ExhaustMap, [{
    key: "dispose",
    value: function dispose() {
      this.context.resetNext();

      _get(_getPrototypeOf(_ExhaustMap.prototype), "dispose", this).call(this);
    }
  }]);

  return _ExhaustMap;
}(InnerSink);

var ExhaustMap = /*#__PURE__*/function (_Maps4) {
  _inherits(ExhaustMap, _Maps4);

  var _super13 = _createSuper(ExhaustMap);

  function ExhaustMap() {
    _classCallCheck(this, ExhaustMap);

    return _super13.apply(this, arguments);
  }

  _createClass(ExhaustMap, [{
    key: "next",
    value: function next(data) {
      this.next = nothing;
      this.subInner(data, _ExhaustMap);
    }
  }]);

  return ExhaustMap;
}(Maps);

var exhaustMap = deliver(ExhaustMap, "exhaustMap");
var exhaustMapTo = makeMapTo(exhaustMap);

var TimeInterval = /*#__PURE__*/function (_Sink6) {
  _inherits(TimeInterval, _Sink6);

  var _super14 = _createSuper(TimeInterval);

  function TimeInterval() {
    var _this9;

    _classCallCheck(this, TimeInterval);

    _this9 = _super14.apply(this, arguments);
    _this9.start = new Date();
    return _this9;
  }

  _createClass(TimeInterval, [{
    key: "next",
    value: function next(value) {
      this.sink.next({
        value: value,
        interval: Number(new Date()) - Number(this.start)
      });
      this.start = new Date();
    }
  }]);

  return TimeInterval;
}(Sink);

var timeInterval = deliver(TimeInterval, "timeInterval");

var BufferTime = /*#__PURE__*/function (_Sink7) {
  _inherits(BufferTime, _Sink7);

  var _super15 = _createSuper(BufferTime);

  function BufferTime(sink, miniseconds) {
    var _this10;

    _classCallCheck(this, BufferTime);

    _this10 = _super15.call(this, sink);
    _this10.miniseconds = miniseconds;
    _this10.buffer = [];
    _this10.id = setInterval(function () {
      _this10.sink.next(_this10.buffer.concat());

      _this10.buffer.length = 0;
    }, _this10.miniseconds);
    return _this10;
  }

  _createClass(BufferTime, [{
    key: "next",
    value: function next(data) {
      this.buffer.push(data);
    }
  }, {
    key: "complete",
    value: function complete() {
      this.sink.next(this.buffer);

      _get(_getPrototypeOf(BufferTime.prototype), "complete", this).call(this);
    }
  }, {
    key: "dispose",
    value: function dispose() {
      clearInterval(this.id);

      _get(_getPrototypeOf(BufferTime.prototype), "dispose", this).call(this);
    }
  }]);

  return BufferTime;
}(Sink);

var bufferTime = deliver(BufferTime, "bufferTime");

var transformation = /*#__PURE__*/Object.freeze({
  __proto__: null,
  scan: scan,
  pairwise: pairwise,
  map: map,
  mapTo: mapTo,
  switchMap: switchMap,
  switchMapTo: switchMapTo,
  concatMap: concatMap,
  concatMapTo: concatMapTo,
  mergeMap: mergeMap,
  mergeMapTo: mergeMapTo,
  exhaustMap: exhaustMap,
  exhaustMapTo: exhaustMapTo,
  timeInterval: timeInterval,
  bufferTime: bufferTime
});

function subject(source) {
  var args = arguments;
  var observable = share()(create(function (sink) {
    observable.next = function (data) {
      return sink.next(data);
    };

    observable.complete = function () {
      return sink.complete();
    };

    observable.error = function (err) {
      return sink.error(err);
    };

    source && sink.subscribe(source);
  }, "subject", args));
  observable.next = nothing;
  observable.complete = nothing;
  observable.error = nothing;
  return observable;
}
function defer(f) {
  return create(function (sink) {
    return sink.subscribe(f());
  }, "defer", arguments);
}
function of() {
  for (var _len = arguments.length, data = new Array(_len), _key = 0; _key < _len; _key++) {
    data[_key] = arguments[_key];
  }

  return create(fromArray(data), "of", arguments);
}

var asap = function asap(f) {
  return function (sink) {
    setTimeout(function () {
      return f(sink);
    });
  };
};

function fromArray(data) {
  return create(asap(function (sink) {
    for (var i = 0; !sink.disposed && i < data.length; i++) {
      sink.next(data[i]);
    }

    sink.complete();
  }), "fromArray", arguments);
}
function interval(period) {
  return create(function (sink) {
    var i = 0;
    var id = setInterval(function () {
      return sink.next(i++);
    }, period);
    sink.defer(function () {
      clearInterval(id);
    });
    return "interval";
  }, "interval", arguments);
}
function timer(delay, period) {
  return create(function (sink) {
    var i = 0;
    var id = setTimeout(function () {
      sink.removeDefer(deferF);
      sink.next(i++);

      if (period) {
        var _id = setInterval(function () {
          return sink.next(i++);
        }, period);

        sink.defer(function () {
          clearInterval(_id);
        });
      } else {
        sink.complete();
      }
    }, delay);

    var deferF = function deferF() {
      clearTimeout(id);
    };

    sink.defer(deferF);
  }, "timer", arguments);
}
function fromEventPattern(add, remove) {
  return create(function (sink) {
    var n = function n(d) {
      return sink.next(d);
    };

    sink.defer(function () {
      return remove(n);
    });
    add(n);
    return name;
  }, "fromEventPattern", arguments);
}
function fromEvent(target, name) {
  if ("on" in target) {
    return create(fromEventPattern(function (h) {
      return target.on(name, h);
    }, function (h) {
      return target.off(name, h);
    }), "fromEvent", arguments);
  } else if ("addListener" in target) {
    return create(fromEventPattern(function (h) {
      return target.addListener(name, h);
    }, function (h) {
      return target.removeListener(name, h);
    }), "fromEvent", arguments);
  } else if ("addEventListener" in target) {
    return create(fromEventPattern(function (h) {
      return target.addEventListener(name, h);
    }, function (h) {
      return target.removeEventListener(name, h);
    }), "fromEvent", arguments);
  } else throw 'target is not a EventDispachter';
}
/**
 *
 * @param {window | Worker | EventSource | WebSocket | RTCPeerConnection} target
 * @returns
 */

function fromMessageEvent(target) {
  return create(function (sink) {
    var closeOb = fromEvent(target, 'close');
    var messageOb = fromEvent(target, 'message');
    var errorOb = fromEvent(target, 'error');
    sink.defer(function () {
      return target.close();
    });
    sink.subscribe(pipe(merge(messageOb, switchMap(throwError)(errorOb)), takeUntil(closeOb)));
  }, "fromMessageEvent", arguments);
}
function fromPromise(promise) {
  return create(function (sink) {
    promise.then(sink.next.bind(sink), sink.error.bind(sink));
  }, "fromPromise", arguments);
}
function fromFetch(input, init) {
  return create(defer(function () {
    return fromPromise(fetch(input, init));
  }), "fromFetch", arguments);
}
function fromIterable(source) {
  return create(asap(function (sink) {
    try {
      var _iterator = _createForOfIteratorHelper(source),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var data = _step.value;
          if (sink.disposed) return;
          sink.next(data);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      sink.complete();
    } catch (err) {
      sink.error(err);
    }
  }), "fromIterable", arguments);
}
function fromAnimationFrame() {
  return create(function (sink) {
    var id = requestAnimationFrame(function next(t) {
      if (!sink.disposed) {
        sink.next(t);
        id = requestAnimationFrame(next);
      }
    });
    sink.defer(function () {
      return cancelAnimationFrame(id);
    });
  }, "fromAnimationFrame", arguments);
}
function range(start, count) {
  return create(function (sink) {
    var pos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : start;
    var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : count + start;

    while (pos < end && !sink.disposed) {
      sink.next(pos++);
    }

    sink.complete();
    return "range";
  }, "range", arguments);
}
function bindCallback(call, thisArg) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  return create(function (sink) {
    var inArgs = args.concat(function (res) {
      return sink.next(res), sink.complete();
    });
    call.apply(thisArg, inArgs);
  }, "bindCallback", arguments);
}
function bindNodeCallback(call, thisArg) {
  for (var _len3 = arguments.length, args = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    args[_key3 - 2] = arguments[_key3];
  }

  return create(function (sink) {
    var inArgs = args.concat(function (err, res) {
      return err ? sink.error(err) : (sink.next(res), sink.complete());
    });
    call.apply(thisArg, inArgs);
  }, "bindNodeCallback", arguments);
}
function never() {
  return create(function () {}, "never", arguments);
}
function throwError(e) {
  return create(function (sink) {
    return sink.error(e);
  }, "throwError", arguments);
}
function empty() {
  return create(function (sink) {
    return sink.complete();
  }, "empty", arguments);
}

var producer = /*#__PURE__*/Object.freeze({
  __proto__: null,
  subject: subject,
  defer: defer,
  of: of,
  fromArray: fromArray,
  interval: interval,
  timer: timer,
  fromEventPattern: fromEventPattern,
  fromEvent: fromEvent,
  fromMessageEvent: fromMessageEvent,
  fromPromise: fromPromise,
  fromFetch: fromFetch,
  fromIterable: fromIterable,
  fromAnimationFrame: fromAnimationFrame,
  range: range,
  bindCallback: bindCallback,
  bindNodeCallback: bindNodeCallback,
  never: never,
  throwError: throwError,
  empty: empty
});

function pipe(first) {
  for (var _len = arguments.length, cbs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    cbs[_key - 1] = arguments[_key];
  }

  return cbs.reduce(function (aac, c) {
    return c(aac);
  }, first);
}
var toPromise = function toPromise() {
  return function (source) {
    return new Promise(function (resolve, reject) {
      var value;
      new Subscribe(function (d) {
        return value = d;
      }, reject, function () {
        return resolve(value);
      }).subscribe(source);
    });
  };
};
var Subscribe = /*#__PURE__*/function (_LastSink) {
  _inherits(Subscribe, _LastSink);

  var _super = _createSuper(Subscribe);

  function Subscribe() {
    var _this;

    var next = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : nothing;

    var _error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : nothing;

    var _complete = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : nothing;

    _classCallCheck(this, Subscribe);

    _this = _super.call(this);
    _this.next = next;
    _this._error = _error;
    _this._complete = _complete;
    _this.then = nothing;
    return _this;
  }

  _createClass(Subscribe, [{
    key: "complete",
    value: function complete() {
      this.dispose();

      this._complete();
    }
  }, {
    key: "error",
    value: function error(err) {
      this.dispose();

      this._error(err);
    }
  }]);

  return Subscribe;
}(LastSink); // //SUBSCRIBER

var subscribe = function subscribe() {
  var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : nothing;
  var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : nothing;
  var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : nothing;
  return new Subscribe(n, e, c).bindSubscribe;
}; // // UTILITY

function tap(ob) {
  var _arguments = arguments;
  return function (source) {
    return create(function (sink) {
      var observer = new Sink(sink);

      if (ob instanceof Function) {
        observer.next = function (data) {
          ob(data);
          sink.next(data);
        };
      } else {
        if (ob.next) observer.next = function (data) {
          ob.next(data);
          sink.next(data);
        };
        if (ob.complete) observer.complete = function () {
          ob.complete();
          sink.complete();
        };
        if (ob.error) observer.error = function (err) {
          ob.error(err);
          sink.error(err);
        };
      }

      observer.subscribe(source);
    }, "tap", _arguments);
  };
}

var Delay = /*#__PURE__*/function (_Sink) {
  _inherits(Delay, _Sink);

  var _super2 = _createSuper(Delay);

  function Delay(sink, delay) {
    var _this2;

    _classCallCheck(this, Delay);

    _this2 = _super2.call(this, sink);
    _this2.buffer = [];
    _this2.delayTime = delay;
    return _this2;
  }

  _createClass(Delay, [{
    key: "dispose",
    value: function dispose() {
      clearTimeout(this.timeoutId);

      _get(_getPrototypeOf(Delay.prototype), "dispose", this).call(this);
    }
  }, {
    key: "delay",
    value: function delay(_delay) {
      var _this3 = this;

      this.timeoutId = setTimeout(function () {
        var d = _this3.buffer.shift();

        if (d) {
          var lastTime = d.time,
              data = d.data;

          _get(_getPrototypeOf(Delay.prototype), "next", _this3).call(_this3, data);

          if (_this3.buffer.length) {
            _this3.delay(Number(_this3.buffer[0].time) - Number(lastTime));
          }
        }
      }, _delay);
    }
  }, {
    key: "next",
    value: function next(data) {
      if (!this.buffer.length) {
        this.delay(this.delayTime);
      }

      this.buffer.push({
        time: new Date(),
        data: data
      });
    }
  }, {
    key: "complete",
    value: function complete() {
      var _this4 = this;

      this.timeoutId = setTimeout(function () {
        return _get(_getPrototypeOf(Delay.prototype), "complete", _this4).call(_this4);
      }, this.delayTime);
    }
  }]);

  return Delay;
}(Sink);

var delay = deliver(Delay, "delay");

var CatchError = /*#__PURE__*/function (_Sink2) {
  _inherits(CatchError, _Sink2);

  var _super3 = _createSuper(CatchError);

  function CatchError(sink, selector) {
    var _this5;

    _classCallCheck(this, CatchError);

    _this5 = _super3.call(this, sink);
    _this5.selector = selector;
    return _this5;
  }

  _createClass(CatchError, [{
    key: "error",
    value: function error(err) {
      this.dispose();
      this.selector(err)(this.sink);
    }
  }]);

  return CatchError;
}(Sink);

var catchError = deliver(CatchError, "catchError");

var GroupBy = /*#__PURE__*/function (_Sink3) {
  _inherits(GroupBy, _Sink3);

  var _super4 = _createSuper(GroupBy);

  function GroupBy(sink, f) {
    var _this6;

    _classCallCheck(this, GroupBy);

    _this6 = _super4.call(this, sink);
    _this6.f = f;
    _this6.groups = new Map();
    return _this6;
  }

  _createClass(GroupBy, [{
    key: "next",
    value: function next(data) {
      var key = this.f(data);
      var group = this.groups.get(key);

      if (typeof group === 'undefined') {
        group = subject();
        group.key = key;
        this.groups.set(key, group);

        _get(_getPrototypeOf(GroupBy.prototype), "next", this).call(this, group);
      }

      group.next(data);
    }
  }, {
    key: "complete",
    value: function complete() {
      this.groups.forEach(function (group) {
        return group.complete();
      });

      _get(_getPrototypeOf(GroupBy.prototype), "complete", this).call(this);
    }
  }, {
    key: "error",
    value: function error(err) {
      this.groups.forEach(function (group) {
        return group.error(err);
      });

      _get(_getPrototypeOf(GroupBy.prototype), "error", this).call(this, err);
    }
  }]);

  return GroupBy;
}(Sink);

var groupBy = deliver(GroupBy, "groupBy");

var Timeout = /*#__PURE__*/function (_Sink4) {
  _inherits(Timeout, _Sink4);

  var _super5 = _createSuper(Timeout);

  function Timeout(sink, timeout) {
    var _this7;

    _classCallCheck(this, Timeout);

    _this7 = _super5.call(this, sink);
    _this7.timeout = timeout;
    _this7.id = setTimeout(function () {
      return _this7.error(new TimeoutError(_this7.timeout));
    }, _this7.timeout);
    return _this7;
  }

  _createClass(Timeout, [{
    key: "next",
    value: function next(data) {
      _get(_getPrototypeOf(Timeout.prototype), "next", this).call(this, data);

      clearTimeout(this.id);
      this.next = _get(_getPrototypeOf(Timeout.prototype), "next", this);
    }
  }, {
    key: "dispose",
    value: function dispose() {
      clearTimeout(this.id);

      _get(_getPrototypeOf(Timeout.prototype), "dispose", this).call(this);
    }
  }]);

  return Timeout;
}(Sink);

var timeout = deliver(Timeout, "timeout");

function nothing() {}
var call = function call(f) {
  return f();
};
var identity = function identity(x) {
  return x;
};
function dispose() {
  this.dispose();
} // @ts-ignore

var inspect = function inspect() {
  return typeof __FASTRX_DEVTOOLS__ !== 'undefined';
};
var obids = 0;

var InspectObservable = /*#__PURE__*/function (_Function) {
  _inherits(InspectObservable, _Function);

  var _super = _createSuper(InspectObservable);

  function InspectObservable() {
    _classCallCheck(this, InspectObservable);

    return _super.apply(this, arguments);
  }

  _createClass(InspectObservable, [{
    key: "toString",
    value: function toString() {
      return "".concat(this.name, "(").concat(this.args.length ? _toConsumableArray(this.args).join(', ') : "", ")");
    }
  }, {
    key: "pipe",
    value: function pipe$1() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return pipe.apply(void 0, [this].concat(args));
    }
  }, {
    key: "subscribe",
    value: function subscribe(sink) {
      var notEnd = sink instanceof Sink;

      if (notEnd) {
        var ns = new NodeSink(sink, this, this.streamId++);
        Events.subscribe({
          id: this.id,
          end: false
        }, {
          nodeId: ns.sourceId,
          streamId: ns.id
        });
        this(ns);
        return ns;
      } else {
        Events.subscribe({
          id: this.id,
          end: true
        });
        this(sink);
        return sink;
      }
    }
  }]);

  return InspectObservable;
}( /*#__PURE__*/_wrapNativeSuper(Function));
function create(ob, name, args) {
  if (inspect()) {
    var result = Object.defineProperties(Object.setPrototypeOf(ob, InspectObservable.prototype), {
      streamId: {
        value: 0,
        writable: true
      },
      name: {
        value: name
      },
      args: {
        value: args
      },
      id: {
        value: obids++
      }
    });
    Events.create(result);
    return result;
  } // @ts-ignore


  return ob;
}
var LastSink = /*#__PURE__*/function () {
  function LastSink() {
    _classCallCheck(this, LastSink);

    this.defers = new Set();
    this.disposed = false;
  }

  _createClass(LastSink, [{
    key: "next",
    value: function next(data) {}
  }, {
    key: "complete",
    value: function complete() {
      this.dispose();
    }
  }, {
    key: "error",
    value: function error(err) {
      this.dispose();
    }
  }, {
    key: "bindDispose",
    get: function get() {
      var _this = this;

      return function () {
        return _this.dispose();
      };
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.disposed = true;
      this.complete = nothing;
      this.error = nothing;
      this.next = nothing;
      this.dispose = nothing;
      this.subscribe = nothing;
      this.doDefer();
    }
  }, {
    key: "subscribe",
    value: function subscribe(source) {
      if (inspect()) return source.subscribe(this);else source(this);
      return this;
    }
  }, {
    key: "bindSubscribe",
    get: function get() {
      var _this2 = this;

      return function (source) {
        return _this2.subscribe(source);
      };
    }
  }, {
    key: "doDefer",
    value: function doDefer() {
      this.defers.forEach(call);
      this.defers.clear();
    }
  }, {
    key: "defer",
    value: function defer(df) {
      this.defers.add(df);
    }
  }, {
    key: "removeDefer",
    value: function removeDefer(df) {
      this.defers.delete(df);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.disposed = false; //@ts-ignore

      delete this.complete; //@ts-ignore

      delete this.next; //@ts-ignore

      delete this.dispose; //@ts-ignore

      delete this.next; //@ts-ignore

      delete this.subscribe;
    }
  }, {
    key: "resetNext",
    value: function resetNext() {
      //@ts-ignore
      delete this.next;
    }
  }, {
    key: "resetComplete",
    value: function resetComplete() {
      //@ts-ignore
      delete this.complete;
    }
  }, {
    key: "resetError",
    value: function resetError() {
      //@ts-ignore
      delete this.error;
    }
  }]);

  return LastSink;
}();
var Sink = /*#__PURE__*/function (_LastSink) {
  _inherits(Sink, _LastSink);

  var _super2 = _createSuper(Sink);

  function Sink(sink) {
    var _this3;

    _classCallCheck(this, Sink);

    _this3 = _super2.call(this);
    _this3.sink = sink;
    sink.defer(_this3.bindDispose);
    return _this3;
  }

  _createClass(Sink, [{
    key: "next",
    value: function next(data) {
      this.sink.next(data);
    }
  }, {
    key: "complete",
    value: function complete() {
      this.sink.complete();
    }
  }, {
    key: "error",
    value: function error(err) {
      this.sink.error(err);
    }
  }]);

  return Sink;
}(LastSink);
function deliver(c, name) {
  return function () {
    var _arguments = arguments;

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    if (inspect()) {
      return function (source) {
        var ob = create(function (observer) {
          var deliverSink = _construct(c, [observer].concat(args));

          deliverSink.sourceId = ob.id;
          return deliverSink.subscribe(source);
        }, name, _arguments);
        ob.source = source;
        Events.pipe(ob);
        return ob;
      };
    }

    return function (source) {
      return create(function (observer) {
        return _construct(c, [observer].concat(args)).subscribe(source);
      }, name, _arguments);
    };
  };
}

function send(event, payload) {
  window.postMessage({
    source: 'fastrx-devtools-backend',
    payload: {
      event: event,
      payload: payload
    }
  });
}

var NodeSink = /*#__PURE__*/function (_Sink) {
  _inherits(NodeSink, _Sink);

  var _super3 = _createSuper(NodeSink);

  function NodeSink(sink, source, id) {
    var _this4;

    _classCallCheck(this, NodeSink);

    _this4 = _super3.call(this, sink);
    _this4.source = source;
    _this4.id = id;

    _this4.defer(function () {
      Events.defer(_this4.source, _this4.id);
    });

    return _this4;
  }

  _createClass(NodeSink, [{
    key: "next",
    value: function next(data) {
      Events.next(this.source, this.id, data);
      this.sink.next(data);
    }
  }, {
    key: "complete",
    value: function complete() {
      Events.complete(this.source, this.id);
      this.sink.complete();
    }
  }, {
    key: "error",
    value: function error(err) {
      Events.complete(this.source, this.id, err);
      this.sink.error(err);
    }
  }]);

  return NodeSink;
}(Sink);

NodeSink.Observables = {};
var Events = {
  addSource: function addSource(who, source) {
    send('addSource', {
      id: who.id,
      name: who.toString(),
      source: {
        id: source.id,
        name: source.toString()
      }
    });
  },
  next: function next(who, streamId, data) {
    send('next', {
      id: who.id,
      streamId: streamId,
      data: data && data.toString()
    });
  },
  subscribe: function subscribe(_ref, sink) {
    var id = _ref.id,
        end = _ref.end;
    send('subscribe', {
      id: id,
      end: end,
      sink: {
        nodeId: sink && sink.nodeId,
        streamId: sink && sink.streamId
      }
    });
  },
  complete: function complete(who, streamId, err) {
    send('complete', {
      id: who.id,
      streamId: streamId,
      err: err ? err.toString() : null
    });
  },
  defer: function defer(who, streamId) {
    send('defer', {
      id: who.id,
      streamId: streamId
    });
  },
  pipe: function pipe(who) {
    send('pipe', {
      name: who.toString(),
      id: who.id,
      source: {
        id: who.source.id,
        name: who.source.toString()
      }
    });
  },
  update: function update(who) {
    send('update', {
      id: who.id,
      name: who.toString()
    });
  },
  create: function create(who) {
    send('create', {
      name: who.toString(),
      id: who.id
    });
  }
};
var TimeoutError = /*#__PURE__*/function (_Error) {
  _inherits(TimeoutError, _Error);

  var _super4 = _createSuper(TimeoutError);

  function TimeoutError(timeout) {
    var _this5;

    _classCallCheck(this, TimeoutError);

    _this5 = _super4.call(this, "timeout after ".concat(timeout, "ms"));
    _this5.timeout = timeout;
    return _this5;
  }

  return TimeoutError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

var __rest = undefined && undefined.__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
}; // @ts-nocheck

var zip$1 = zip,
    merge$1 = merge,
    race$1 = race,
    concat$1 = concat,
    combineLatest$1 = combineLatest,
    combinations = __rest(combination, ["zip", "merge", "race", "concat", "combineLatest"]);

var observables = Object.assign({
  zip: zip$1,
  merge: merge$1,
  race: race$1,
  concat: concat$1,
  combineLatest: combineLatest$1
}, producer);
var operators = Object.assign(Object.assign(Object.assign(Object.assign({
  tap: tap,
  delay: delay,
  timeout: timeout,
  catchError: catchError,
  groupBy: groupBy
}, combinations), filtering), mathematical), transformation);
var rxProxy = {
  get: function get(target, prop) {
    switch (prop) {
      case "subscribe":
        return function () {
          return subscribe.apply(void 0, arguments)(target);
        };

      case "toPromise":
        return function () {
          return toPromise()(target);
        };

      default:
        return function (operator) {
          return function () {
            return new Proxy(operator.apply(void 0, arguments)(target), rxProxy);
          };
        }(operators[prop]);
    }
  }
};
var rx = new Proxy(function (f) {
  return new Proxy(f, rxProxy);
}, {
  get: function get(_target, prop) {
    return function (observable) {
      return function () {
        return new Proxy(observable.apply(void 0, arguments), rxProxy);
      };
    }(observables[prop]);
  },
  // @ts-ignore
  set: function set(_target, prop, value) {
    return observables[prop] = value;
  }
});

exports.Events = Events;
exports.InspectObservable = InspectObservable;
exports.LastSink = LastSink;
exports.Sink = Sink;
exports.Subscribe = Subscribe;
exports.TimeoutError = TimeoutError;
exports.audit = audit;
exports.bindCallback = bindCallback;
exports.bindNodeCallback = bindNodeCallback;
exports.buffer = buffer;
exports.bufferCount = bufferCount;
exports.bufferTime = bufferTime;
exports.call = call;
exports.catchError = catchError;
exports.combineLatest = combineLatest;
exports.concat = concat;
exports.concatMap = concatMap;
exports.concatMapTo = concatMapTo;
exports.count = count;
exports.create = create;
exports.debounce = debounce;
exports.debounceTime = debounceTime;
exports.defer = defer;
exports.delay = delay;
exports.deliver = deliver;
exports.dispose = dispose;
exports.elementAt = elementAt;
exports.empty = empty;
exports.every = every;
exports.exhaustMap = exhaustMap;
exports.exhaustMapTo = exhaustMapTo;
exports.filter = filter;
exports.find = find;
exports.findIndex = findIndex;
exports.first = first;
exports.fromAnimationFrame = fromAnimationFrame;
exports.fromArray = fromArray;
exports.fromEvent = fromEvent;
exports.fromEventPattern = fromEventPattern;
exports.fromFetch = fromFetch;
exports.fromIterable = fromIterable;
exports.fromMessageEvent = fromMessageEvent;
exports.fromPromise = fromPromise;
exports.groupBy = groupBy;
exports.identity = identity;
exports.ignoreElements = ignoreElements;
exports.iif = iif;
exports.inspect = inspect;
exports.interval = interval;
exports.last = last;
exports.map = map;
exports.mapTo = mapTo;
exports.max = max;
exports.merge = merge;
exports.mergeMap = mergeMap;
exports.mergeMapTo = mergeMapTo;
exports.min = min;
exports.never = never;
exports.nothing = nothing;
exports.of = of;
exports.pairwise = pairwise;
exports.pipe = pipe;
exports.race = race;
exports.range = range;
exports.reduce = reduce;
exports.rx = rx;
exports.scan = scan;
exports.share = share;
exports.shareReplay = shareReplay;
exports.skip = skip;
exports.skipUntil = skipUntil;
exports.skipWhile = skipWhile;
exports.startWith = startWith;
exports.subject = subject;
exports.subscribe = subscribe;
exports.sum = sum;
exports.switchMap = switchMap;
exports.switchMapTo = switchMapTo;
exports.take = take;
exports.takeLast = takeLast;
exports.takeUntil = takeUntil;
exports.takeWhile = takeWhile;
exports.tap = tap;
exports.throttle = throttle;
exports.throwError = throwError;
exports.timeInterval = timeInterval;
exports.timeout = timeout;
exports.timer = timer;
exports.toPromise = toPromise;
exports.withLatestFrom = withLatestFrom;
exports.zip = zip;
//# sourceMappingURL=cjs.js.map
