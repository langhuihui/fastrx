'use strict';

require('core-js/modules/es.array.iterator.js');
require('core-js/modules/es.map.js');
require('core-js/modules/es.object.set-prototype-of.js');
require('core-js/modules/es.object.to-string.js');
require('core-js/modules/es.string.iterator.js');
require('core-js/modules/web.dom-collections.for-each.js');
require('core-js/modules/web.dom-collections.iterator.js');
require('core-js/modules/es.promise.js');
require('core-js/modules/es.regexp.to-string.js');
require('core-js/modules/es.array.concat.js');
require('core-js/modules/es.array.slice.js');
require('core-js/modules/es.set.js');
require('core-js/modules/es.array.map.js');
require('core-js/modules/es.string.sub.js');
require('core-js/modules/es.symbol.js');
require('core-js/modules/es.symbol.description.js');
require('core-js/modules/es.symbol.iterator.js');
require('core-js/modules/es.array.find.js');
require('core-js/modules/es.array.join.js');
require('core-js/modules/es.function.name.js');

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

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

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
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

function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
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

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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

function noop() {} //第一次调用有效

var once = function once(f) {
  return function () {
    if (f) {
      var r = f.apply(void 0, arguments);
      f = null;
      return r;
    }
  };
};
var Sink = /*#__PURE__*/function () {
  function Sink(sink) {
    _classCallCheck(this, Sink);

    this.defers = new Set();
    this.sink = sink;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    this.init.apply(this, args);
    if (sink) sink.defers.add(this);
  }

  _createClass(Sink, [{
    key: "init",
    value: function init() {}
  }, {
    key: "disposePass",
    set: function set(value) {
      if (!this.sink) return;
      if (value) this.sink.defers.add(this);else this.sink.defers.delete(this);
    }
  }, {
    key: "next",
    value: function next(data) {
      this.sink && this.sink.next(data);
    }
  }, {
    key: "complete",
    value: function complete(err) {
      this.sink && this.sink.complete(err);
      this.dispose(false);
    }
  }, {
    key: "error",
    value: function error(err) {
      this.complete(err);
    }
  }, {
    key: "dispose",
    value: function dispose() {
      var defer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.disposed = true;
      this.complete = noop;
      this.next = noop;
      this.dispose = noop;
      this.subscribes = this.subscribe = noop;
      defer && this.defer(); //销毁时终止事件源
    }
  }, {
    key: "defer",
    value: function defer(add) {
      if (add) {
        this.defers.add(add);
      } else {
        this.defers.forEach(function (defer) {
          switch (true) {
            case defer.dispose != void 0:
              defer.dispose();
              break;

            case typeof defer == 'function':
              defer();
              break;

            case defer.length > 0:
              {
                var _defer = _toArray(defer),
                    f = _defer[0],
                    thisArg = _defer[1],
                    args = _defer.slice(2);

                if (f.call) f.call.apply(f, [thisArg].concat(_toConsumableArray(args)));else f.apply(void 0, _toConsumableArray(args));
              }
              break;
          }
        });
        this.defers.clear();
      }
    }
  }, {
    key: "subscribe",
    value: function subscribe(source) {
      source(this);
      return this;
    }
  }, {
    key: "subscribes",
    value: function subscribes(sources) {
      var _this2 = this;

      sources.forEach(function (source) {
        return source(_this2);
      });
    }
  }]);

  return Sink;
}();

var Asap = /*#__PURE__*/function () {
  function Asap() {
    _classCallCheck(this, Asap);

    this.asaps = [];
    this._asaps = [];
  }

  _createClass(Asap, [{
    key: "push",
    value: function push(task) {
      this.asaps.push(task);
    }
  }, {
    key: "_push",
    value: function _push(task) {
      this._asaps.push(task);
    }
  }, {
    key: "run",
    value: function run(task) {
      this.run = this.push;
      if (task) this.asaps.push(task);
      Promise.resolve(this).then(function (_this) {
        _this.run = _this._push;

        for (var i = 0, l = _this.asaps.length; i < l; i++) {
          _this.asaps[i]();
        }

        _this.asaps = _this._asaps;
        _this._asaps = [];
        delete _this.run;

        if (_this.asaps.length) {
          _this.run();
        }
      });
    }
  }]);

  return Asap;
}();

var _asap = new Asap();

function asap(task, defer) {
  _asap.run(task);

  return defer;
}
var deliver = function deliver(Class) {
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return function (source) {
      return function (sink) {
        return source(_construct(Class, [sink].concat(args)));
      };
    };
  };
};

var Share = /*#__PURE__*/function (_Sink) {
  _inherits(Share, _Sink);

  var _super = _createSuper(Share);

  function Share() {
    _classCallCheck(this, Share);

    return _super.apply(this, arguments);
  }

  _createClass(Share, [{
    key: "init",
    value: function init(source) {
      this.source = source;
      this.sinks = new Set();
    }
  }, {
    key: "add",
    value: function add(sink) {
      this.sinks.add(sink);

      if (this.sinks.size === 1) {
        this.source(this);
      }
    }
  }, {
    key: "remove",
    value: function remove(sink) {
      this.sinks.delete(sink);

      if (this.sinks.size === 0) {
        this.defer();
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
    value: function complete(err) {
      this.sinks.forEach(function (s) {
        return s.complete(err);
      });
      this.sinks.clear();
    }
  }]);

  return Share;
}(Sink);

var share = function share() {
  return function (source) {
    var share = new Share(null, source);
    return function (sink) {
      sink.defer([share.remove, share, sink]);
      share.add(sink);
    };
  };
};
var shareReplay = function shareReplay(bufferSize) {
  return function (source) {
    var share = new Share(null, source);
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

    return function (sink) {
      sink.defer([share.remove, share, sink]);
      buffer.forEach(function (cache) {
        return sink.next(cache);
      });
      share.add(sink);
    };
  };
};
var iif = function iif(condition, trueS, falseS) {
  return function (sink) {
    return condition() ? trueS(sink) : falseS(sink);
  };
};

var Race = /*#__PURE__*/function (_Sink2) {
  _inherits(Race, _Sink2);

  var _super2 = _createSuper(Race);

  function Race() {
    _classCallCheck(this, Race);

    return _super2.apply(this, arguments);
  }

  _createClass(Race, [{
    key: "init",
    value: function init(nLife) {
      this.nLife = nLife;
    }
  }, {
    key: "next",
    value: function next(data) {
      this.defer();
      this.sink.next(data);

      _get(_getPrototypeOf(Race.prototype), "complete", this).call(this);
    }
  }, {
    key: "complete",
    value: function complete(err) {
      if (--this.nLife === 0) _get(_getPrototypeOf(Race.prototype), "complete", this).call(this, err);
    }
  }]);

  return Race;
}(Sink);

var race = function race() {
  for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) {
    sources[_key] = arguments[_key];
  }

  return function (sink) {
    return new Race(sink, sources.length).subscribes(sources);
  };
};

var Concat = /*#__PURE__*/function (_Sink3) {
  _inherits(Concat, _Sink3);

  var _super3 = _createSuper(Concat);

  function Concat() {
    _classCallCheck(this, Concat);

    return _super3.apply(this, arguments);
  }

  _createClass(Concat, [{
    key: "init",
    value: function init(sources) {
      this.sources = sources;
      this.pos = 0;
      this.len = sources.length;
    }
  }, {
    key: "complete",
    value: function complete(err) {
      if (err) {
        _get(_getPrototypeOf(Concat.prototype), "complete", this).call(this, err);

        return;
      }

      if (this.pos < this.len && !this.disposed) this.sources[this.pos++](this);else _get(_getPrototypeOf(Concat.prototype), "complete", this).call(this);
    }
  }]);

  return Concat;
}(Sink);

var concat = function concat() {
  for (var _len2 = arguments.length, sources = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    sources[_key2] = arguments[_key2];
  }

  return function (sink) {
    return new Concat(sink, sources).complete();
  };
};

var Merge = /*#__PURE__*/function (_Sink4) {
  _inherits(Merge, _Sink4);

  var _super4 = _createSuper(Merge);

  function Merge() {
    _classCallCheck(this, Merge);

    return _super4.apply(this, arguments);
  }

  _createClass(Merge, [{
    key: "init",
    value: function init(nLife) {
      this.nLife = nLife;
    }
  }, {
    key: "complete",
    value: function complete() {
      if (--this.nLife === 0) _get(_getPrototypeOf(Merge.prototype), "complete", this).call(this);
    }
  }]);

  return Merge;
}(Sink);

var mergeArray = function mergeArray(sources) {
  return function (sink) {
    return new Merge(sink, sources.length).subscribes(sources);
  };
};
var merge = function merge() {
  for (var _len3 = arguments.length, sources = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    sources[_key3] = arguments[_key3];
  }

  return function (sink) {
    return new Merge(sink, sources.length).subscribes(sources);
  };
};

var CombineLatest = /*#__PURE__*/function (_Sink5) {
  _inherits(CombineLatest, _Sink5);

  var _super5 = _createSuper(CombineLatest);

  function CombineLatest() {
    _classCallCheck(this, CombineLatest);

    return _super5.apply(this, arguments);
  }

  _createClass(CombineLatest, [{
    key: "init",
    value: function init(index, array, context) {
      this.index = index;
      this.context = context;
      this.state = 0;
      this.array = array;
    }
  }, {
    key: "next",
    value: function next(data) {
      switch (this.state) {
        case 0:
          ++this.context.nRun;
          this.state = 1;

        case 1:
          if (this.context.nRun === this.context.nTotal) {
            this.state = 2;
          } else {
            this.array[this.index] = data;
            break;
          }

        case 2:
          this.array[this.index] = data;
          this.sink.next(this.array);
          break;
      }
    }
  }, {
    key: "complete",
    value: function complete(err) {
      if (err || --this.context.nLife === 0) _get(_getPrototypeOf(CombineLatest.prototype), "complete", this).call(this, err);
    }
  }]);

  return CombineLatest;
}(Sink);

var combineLatest = function combineLatest() {
  for (var _len4 = arguments.length, sources = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    sources[_key4] = arguments[_key4];
  }

  return function (sink) {
    var nTotal = sources.length;
    var context = {
      nTotal: nTotal,
      nLife: nTotal,
      nRun: 0
    };
    var array = new Array(nTotal); // const defers = new Array(nTotal)
    // for (let i = 0; i < nTotal; ++i) defers[i] = sources[i](new CombineLatest(sink, i, array, context))

    sources.forEach(function (source, i) {
      return source(new CombineLatest(sink, i, array, context));
    });
  };
};

var WithLatestFrom = /*#__PURE__*/function (_Sink6) {
  _inherits(WithLatestFrom, _Sink6);

  var _super6 = _createSuper(WithLatestFrom);

  function WithLatestFrom() {
    _classCallCheck(this, WithLatestFrom);

    return _super6.apply(this, arguments);
  }

  _createClass(WithLatestFrom, [{
    key: "init",
    value: function init() {
      var _this = this;

      this._withLatestFrom = new Sink(this.sink);

      this._withLatestFrom.next = function (data) {
        return _this.buffer = data;
      };

      this._withLatestFrom.complete = noop;
      combineLatest.apply(void 0, arguments)(this._withLatestFrom);
    }
  }, {
    key: "next",
    value: function next(data) {
      if (this.buffer) {
        this.sink.next([data].concat(this.buffer));
      }
    }
  }, {
    key: "complete",
    value: function complete(err) {
      this._withLatestFrom.dispose();

      _get(_getPrototypeOf(WithLatestFrom.prototype), "complete", this).call(this, err);
    }
  }]);

  return WithLatestFrom;
}(Sink);

var withLatestFrom = deliver(WithLatestFrom);

var Zip = /*#__PURE__*/function (_Sink7) {
  _inherits(Zip, _Sink7);

  var _super7 = _createSuper(Zip);

  function Zip() {
    _classCallCheck(this, Zip);

    return _super7.apply(this, arguments);
  }

  _createClass(Zip, [{
    key: "init",
    value: function init(index, array, context) {
      this.index = index;
      this.context = context;
      this.array = array;
      this.buffer = [];
      array[index] = this.buffer;
    }
  }, {
    key: "next",
    value: function next(data) {
      this.buffer.push(data);

      if (this.array.every(function (x) {
        return x.length;
      })) {
        this.sink.next(this.array.map(function (x) {
          return x.shift();
        }));
      }
    }
  }, {
    key: "complete",
    value: function complete(err) {
      if (err || --this.context.nLife === 0) _get(_getPrototypeOf(Zip.prototype), "complete", this).call(this, err);
    }
  }]);

  return Zip;
}(Sink);

var zip = function zip() {
  for (var _len5 = arguments.length, sources = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    sources[_key5] = arguments[_key5];
  }

  return function (sink) {
    var nTotal = sources.length;
    var context = {
      nTotal: nTotal,
      nLife: nTotal
    };
    var array = new Array(nTotal);
    sources.forEach(function (source, i) {
      return source(new Zip(sink, i, array, context));
    });
  };
};
var startWith = function startWith() {
  for (var _len6 = arguments.length, xs = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    xs[_key6] = arguments[_key6];
  }

  return function (inputSource) {
    return function (sink) {
      var pos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var l = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : xs.length;

      while (pos < l) {
        if (sink.disposed) return;
        sink.next(xs[pos++]);
      }

      sink.disposed || inputSource(sink);
    };
  };
};

var BufferCount = /*#__PURE__*/function (_Sink8) {
  _inherits(BufferCount, _Sink8);

  var _super8 = _createSuper(BufferCount);

  function BufferCount() {
    _classCallCheck(this, BufferCount);

    return _super8.apply(this, arguments);
  }

  _createClass(BufferCount, [{
    key: "init",
    value: function init(bufferSize, startBufferEvery) {
      this.bufferSize = bufferSize;
      this.startBufferEvery = startBufferEvery;
      this.buffer = [];

      if (startBufferEvery) {
        this.buffers = [[]];
        this.count = 0;
      }
    }
  }, {
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
    value: function complete(err) {
      var _this2 = this;

      if (!err) {
        if (this.buffer.length) {
          this.sink.next(this.buffer);
        } else if (this.buffers.size) {
          this.buffers.forEach(function (buffer) {
            return _this2.sink.next(buffer);
          });
        }
      }

      _get(_getPrototypeOf(BufferCount.prototype), "complete", this).call(this, err);
    }
  }]);

  return BufferCount;
}(Sink);

var bufferCount = deliver(BufferCount);

var ConcatAll = /*#__PURE__*/function (_Sink9) {
  _inherits(ConcatAll, _Sink9);

  var _super9 = _createSuper(ConcatAll);

  function ConcatAll() {
    _classCallCheck(this, ConcatAll);

    return _super9.apply(this, arguments);
  }

  _createClass(ConcatAll, [{
    key: "init",
    value: function init() {
      this.sources = [];
      this.running = false;
    }
  }, {
    key: "sub",
    value: function sub(data) {
      var _this3 = this;

      var s = new Sink(this.sink);
      this.running = true;

      s.complete = function (err) {
        _this3.running = false;

        if (err) {
          s.dispose(true);

          _get(_getPrototypeOf(ConcatAll.prototype), "complete", _this3).call(_this3, err);
        } else {
          s.dispose(false);

          if (_this3.sources.length) {
            _this3.sub(_this3.sources.shift());
          } else if (_this3.disposed) {
            _get(_getPrototypeOf(ConcatAll.prototype), "complete", _this3).call(_this3);
          }
        }
      };

      data(s);
    }
  }, {
    key: "next",
    value: function next(data) {
      if (!this.running) {
        this.sub(data);
      } else {
        this.sources.push(data);
      }
    }
  }, {
    key: "complete",
    value: function complete(err) {
      if (err) {
        if (!this.running) _get(_getPrototypeOf(ConcatAll.prototype), "complete", this).call(this, err);
      } else if (this.running) this.dispose(false);else _get(_getPrototypeOf(ConcatAll.prototype), "complete", this).call(this);
    }
  }]);

  return ConcatAll;
}(Sink);

var concatAll = deliver(ConcatAll);

var Reduce = /*#__PURE__*/function (_Sink) {
  _inherits(Reduce, _Sink);

  var _super = _createSuper(Reduce);

  function Reduce() {
    _classCallCheck(this, Reduce);

    return _super.apply(this, arguments);
  }

  _createClass(Reduce, [{
    key: "init",
    value: function init(hasSeed, f, seed) {
      var _this = this;

      this.f = f;
      this.aac = seed;

      if (!hasSeed) {
        this.next = function (d) {
          delete _this.next;
          _this.aac = d;
        };
      }
    }
  }, {
    key: "next",
    value: function next(data) {
      var f = this.f;
      this.aac = f(this.aac, data);
    }
  }, {
    key: "complete",
    value: function complete(err) {
      err || this.sink.next(this.aac);

      _get(_getPrototypeOf(Reduce.prototype), "complete", this).call(this, err);
    }
  }]);

  return Reduce;
}(Sink);

var reduce = function reduce() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return function (source) {
    return function (sink) {
      return source(_construct(Reduce, [sink, args.length === 2].concat(args)));
    };
  };
};
var count = function count(f) {
  return reduce(function (aac, c) {
    return f(c) ? aac + 1 : aac;
  }, 0);
};
var max = function max() {
  return reduce(Math.max);
};
var min = function min() {
  return reduce(Math.min);
};
var sum = function sum() {
  return reduce(function (aac, c) {
    return aac + c;
  }, 0);
};

function compose(g, f) {
  return function (x) {
    return g(f(x));
  };
}

function and(a, b) {
  return function (x) {
    return a(x) && b(x);
  };
}

var Filter = /*#__PURE__*/function (_Sink) {
  _inherits(Filter, _Sink);

  var _super = _createSuper(Filter);

  function Filter() {
    _classCallCheck(this, Filter);

    return _super.apply(this, arguments);
  }

  _createClass(Filter, [{
    key: "init",
    value: function init(f) {
      this.f = f;
    }
  }, {
    key: "next",
    value: function next(data) {
      var f = this.f;
      f(data) && this.sink.next(data);
    }
  }, {
    key: "fusionFilter",
    value: function fusionFilter(f) {
      this.f = and(f, this.f);
      return this; // return new Filter(this.sink, this.and(f, this.f))
    }
  }]);

  return Filter;
}(Sink);

var FilterMapSink = /*#__PURE__*/function (_Sink2) {
  _inherits(FilterMapSink, _Sink2);

  var _super2 = _createSuper(FilterMapSink);

  function FilterMapSink() {
    _classCallCheck(this, FilterMapSink);

    return _super2.apply(this, arguments);
  }

  _createClass(FilterMapSink, [{
    key: "init",
    value: function init(f, m) {
      this.f = f;
      this.m = m;
    }
  }, {
    key: "next",
    value: function next(data) {
      var f = this.f;
      var m = this.m;
      f(data) && this.sink.next(m(data));
    }
  }, {
    key: "fusionFilter",
    value: function fusionFilter(f) {
      this.f = and(f, this.f);
      return this; // return new Filter(this, f)
    }
  }]);

  return FilterMapSink;
}(Sink);

var MapSink = /*#__PURE__*/function (_Sink3) {
  _inherits(MapSink, _Sink3);

  var _super3 = _createSuper(MapSink);

  function MapSink() {
    _classCallCheck(this, MapSink);

    return _super3.apply(this, arguments);
  }

  _createClass(MapSink, [{
    key: "init",
    value: function init(f) {
      this.f = f;
    }
  }, {
    key: "next",
    value: function next(data) {
      var f = this.f;
      this.sink.next(f(data));
    }
  }, {
    key: "fusionFilter",
    value: function fusionFilter(f) {
      this.disposePass = false;
      this.dispose(false);
      return new FilterMapSink(this.sink, f, this.f);
    }
  }, {
    key: "fusionMap",
    value: function fusionMap(f) {
      this.f = compose(this.f, f);
      return this; // return new MapSink(this.sink, this.compose(this.f, f))
    }
  }]);

  return MapSink;
}(Sink);

var filter = function filter(f) {
  return function (source) {
    return function (sink) {
      return source(sink.fusionFilter ? sink.fusionFilter(f) : new Filter(sink, f));
    };
  };
};

var Ignore = /*#__PURE__*/function (_Sink) {
  _inherits(Ignore, _Sink);

  var _super = _createSuper(Ignore);

  function Ignore() {
    _classCallCheck(this, Ignore);

    return _super.apply(this, arguments);
  }

  _createClass(Ignore, [{
    key: "next",
    value: function next() {}
  }]);

  return Ignore;
}(Sink);

var ignoreElements = function ignoreElements(source) {
  return function (sink) {
    return source(new Ignore(sink));
  };
};

var Take = /*#__PURE__*/function (_Sink2) {
  _inherits(Take, _Sink2);

  var _super2 = _createSuper(Take);

  function Take() {
    _classCallCheck(this, Take);

    return _super2.apply(this, arguments);
  }

  _createClass(Take, [{
    key: "init",
    value: function init(count) {
      this.count = count;
    }
  }, {
    key: "next",
    value: function next(data) {
      this.sink.next(data);

      if (--this.count === 0) {
        this.defer();
        this.complete();
      }
    }
  }]);

  return Take;
}(Sink);

var take = deliver(Take);

var TakeUntil = /*#__PURE__*/function (_Sink3) {
  _inherits(TakeUntil, _Sink3);

  var _super3 = _createSuper(TakeUntil);

  function TakeUntil() {
    _classCallCheck(this, TakeUntil);

    return _super3.apply(this, arguments);
  }

  _createClass(TakeUntil, [{
    key: "init",
    value: function init(sSrc) {
      var _this = this;

      this._takeUntil = new Sink(this.sink);

      this._takeUntil.next = function () {
        _this.defer();

        _this.complete();
      };

      this._takeUntil.complete = noop;
      sSrc(this._takeUntil);
    }
  }, {
    key: "complete",
    value: function complete(err) {
      //完成事件，单方面终结开关sink
      this._takeUntil.dispose();

      _get(_getPrototypeOf(TakeUntil.prototype), "complete", this).call(this, err);
    }
  }]);

  return TakeUntil;
}(Sink);

var takeUntil = deliver(TakeUntil);

var TakeWhile = /*#__PURE__*/function (_Sink4) {
  _inherits(TakeWhile, _Sink4);

  var _super4 = _createSuper(TakeWhile);

  function TakeWhile() {
    _classCallCheck(this, TakeWhile);

    return _super4.apply(this, arguments);
  }

  _createClass(TakeWhile, [{
    key: "init",
    value: function init(f) {
      this.f = f;
    }
  }, {
    key: "next",
    value: function next(data) {
      var f = this.f;

      if (f(data)) {
        this.sink.next(data);
      } else {
        this.defer();
        this.complete();
      }
    }
  }]);

  return TakeWhile;
}(Sink);

var takeWhile = deliver(TakeWhile);
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

  function Skip() {
    _classCallCheck(this, Skip);

    return _super5.apply(this, arguments);
  }

  _createClass(Skip, [{
    key: "init",
    value: function init(count) {
      this.count = count;
    }
  }, {
    key: "next",
    value: function next() {
      if (--this.count === 0) {
        this.next = _get(_getPrototypeOf(Skip.prototype), "next", this);
      }
    }
  }]);

  return Skip;
}(Sink);

var skip = deliver(Skip);

var _SkipUntil = /*#__PURE__*/function (_Sink6) {
  _inherits(_SkipUntil, _Sink6);

  var _super6 = _createSuper(_SkipUntil);

  function _SkipUntil() {
    _classCallCheck(this, _SkipUntil);

    return _super6.apply(this, arguments);
  }

  _createClass(_SkipUntil, [{
    key: "next",
    value: function next() {
      this.dispose();
      delete this.sourceSink.next;
    }
  }, {
    key: "init",
    value: function init(sourceSink) {
      this.sourceSink = sourceSink;
    }
  }]);

  return _SkipUntil;
}(Sink);

var SkipUntil = /*#__PURE__*/function (_Sink7) {
  _inherits(SkipUntil, _Sink7);

  var _super7 = _createSuper(SkipUntil);

  function SkipUntil() {
    _classCallCheck(this, SkipUntil);

    return _super7.apply(this, arguments);
  }

  _createClass(SkipUntil, [{
    key: "init",
    value: function init(sSrc) {
      this._skipUntil = new _SkipUntil(null, this).subscribe(sSrc);
      this.defer(this._skipUntil);
      this.next = noop;
    }
  }, {
    key: "complete",
    value: function complete(err) {
      this._skipUntil.dispose();

      _get(_getPrototypeOf(SkipUntil.prototype), "complete", this).call(this, err);
    }
  }]);

  return SkipUntil;
}(Sink);

var skipUntil = deliver(SkipUntil);

var SkipWhile = /*#__PURE__*/function (_Sink8) {
  _inherits(SkipWhile, _Sink8);

  var _super8 = _createSuper(SkipWhile);

  function SkipWhile() {
    _classCallCheck(this, SkipWhile);

    return _super8.apply(this, arguments);
  }

  _createClass(SkipWhile, [{
    key: "init",
    value: function init(f) {
      this.f = f;
    }
  }, {
    key: "next",
    value: function next(data) {
      var f = this.f;

      if (!f(data)) {
        this.next = _get(_getPrototypeOf(SkipWhile.prototype), "next", this);
        this.next(data);
      }
    }
  }]);

  return SkipWhile;
}(Sink);

var skipWhile = deliver(SkipWhile);
var defaultThrottleConfig = {
  leading: true,
  trailing: false
};

var _Throttle = /*#__PURE__*/function (_Sink9) {
  _inherits(_Throttle, _Sink9);

  var _super9 = _createSuper(_Throttle);

  function _Throttle() {
    _classCallCheck(this, _Throttle);

    return _super9.apply(this, arguments);
  }

  _createClass(_Throttle, [{
    key: "init",
    value: function init(durationSelector, trailing) {
      this.durationSelector = durationSelector;
      this.trailing = trailing;
      this.hasValue = true;
      this.isComplete = false;
    }
  }, {
    key: "send",
    value: function send(data) {
      if (this.hasValue) {
        this.sink.next(data);
        this.isComplete = false;
        this.durationSelector(data)(this);
      }

      this.hasValue = false;
    }
  }, {
    key: "next",
    value: function next() {
      this.complete();
    }
  }, {
    key: "complete",
    value: function complete() {
      this.defer();
      this.isComplete = true;

      if (this.trailing) {
        this.send(this.last);
      }
    }
  }]);

  return _Throttle;
}(Sink);

var Throttle = /*#__PURE__*/function (_Sink10) {
  _inherits(Throttle, _Sink10);

  var _super10 = _createSuper(Throttle);

  function Throttle() {
    _classCallCheck(this, Throttle);

    return _super10.apply(this, arguments);
  }

  _createClass(Throttle, [{
    key: "init",
    value: function init(durationSelector) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultThrottleConfig;
      this.durationSelector = durationSelector;
      this.leading = config.leading;
      this.trailing = config.trailing;
      this.hasValue = false;
    }
  }, {
    key: "throttle",
    value: function throttle(data) {
      this._throttle.isComplete = false;
      this._throttle.last = data;
      this._throttle.hasValue = true;
      this.durationSelector(data)(this._throttle);
    }
  }, {
    key: "next",
    value: function next(data) {
      if (!this._throttle || this._throttle.isComplete) {
        if (!this._throttle) {
          this._throttle = new _Throttle(this.sink, this.durationSelector, this.trailing);
          this.defer(this._throttle);
        }

        if (this.leading) {
          this.sink.next(data);
          this.throttle(data);
          this._throttle.hasValue = false;
        } else {
          this.throttle(data);
        }
      } else {
        this._throttle.last = data;
        this._throttle.hasValue = true;
      }
    }
  }, {
    key: "complete",
    value: function complete(err) {
      if (err) {
        this._throttle && this._throttle.dispose();

        _get(_getPrototypeOf(Throttle.prototype), "complete", this).call(this, err);
      } else {
        this._throttle && this._throttle.complete();

        _get(_getPrototypeOf(Throttle.prototype), "complete", this).call(this);
      }
    }
  }]);

  return Throttle;
}(Sink);

var throttle = deliver(Throttle);
var defaultAuditConfig = {
  leading: false,
  trailing: true
};
var audit = function audit(durationSelector) {
  return throttle(durationSelector, defaultAuditConfig);
};

var ThrottleTime = /*#__PURE__*/function (_Sink11) {
  _inherits(ThrottleTime, _Sink11);

  var _super11 = _createSuper(ThrottleTime);

  function ThrottleTime() {
    _classCallCheck(this, ThrottleTime);

    return _super11.apply(this, arguments);
  }

  _createClass(ThrottleTime, [{
    key: "init",
    value: function init(period) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultThrottleConfig;
      this.config = config;
      this.period = period;
      this.timerId = null;
    }
  }, {
    key: "next",
    value: function next(data) {
      var _this2 = this;

      if (this.timerId) {
        this.last = data;
        this.hasValue = true;
      } else {
        this.timerId = setTimeout(function () {
          _this2.timerId = null;

          if (_this2.config.trailing && _this2.hasValue) {
            _this2.sink.next(_this2.last);
          }
        }, this.period);

        if (this.config.leading) {
          this.sink.next(data);
        } else {
          this.last = data;
          this.hasValue = true;
        }
      }
    }
  }, {
    key: "complete",
    value: function complete(err) {
      if (!err) {
        if (this.config.trailing && this.hasValue) {
          this.sink.next(this.last);
        }
      }

      _get(_getPrototypeOf(ThrottleTime.prototype), "complete", this).call(this, err);
    }
  }]);

  return ThrottleTime;
}(Sink);

var throttleTime = deliver(ThrottleTime);

var DebounceTime = /*#__PURE__*/function (_Sink12) {
  _inherits(DebounceTime, _Sink12);

  var _super12 = _createSuper(DebounceTime);

  function DebounceTime() {
    _classCallCheck(this, DebounceTime);

    return _super12.apply(this, arguments);
  }

  _createClass(DebounceTime, [{
    key: "init",
    value: function init(period) {
      this.period = period;
      this.timerId = null;
    }
  }, {
    key: "next",
    value: function next(data) {
      var _this3 = this;

      this.buffer = data;

      if (this.timerId) {
        clearTimeout(this.timerId);
      }

      this.timerId = setTimeout(function () {
        _this3.sink.next(data);

        _this3.timerId = null;
      }, this.period);
    }
  }, {
    key: "complete",
    value: function complete(error) {
      if (this.timerId) {
        clearTimeout(this.timerId);

        if (!error && this.hasOwnProperty('buffer')) {
          this.sink.next(this.buffer);
        }
      }

      _get(_getPrototypeOf(DebounceTime.prototype), "complete", this).call(this, error);
    }
  }]);

  return DebounceTime;
}(Sink);

var debounceTime = deliver(DebounceTime);

var _Debounce = /*#__PURE__*/function (_Sink13) {
  _inherits(_Debounce, _Sink13);

  var _super13 = _createSuper(_Debounce);

  function _Debounce() {
    _classCallCheck(this, _Debounce);

    return _super13.apply(this, arguments);
  }

  _createClass(_Debounce, [{
    key: "next",
    value: function next() {
      this.complete();
    }
  }, {
    key: "complete",
    value: function complete(err) {
      this.defer();
      this.sink.next(this.last);
      this.isComplete = true;
    }
  }]);

  return _Debounce;
}(Sink);

var Debounce = /*#__PURE__*/function (_Sink14) {
  _inherits(Debounce, _Sink14);

  var _super14 = _createSuper(Debounce);

  function Debounce() {
    _classCallCheck(this, Debounce);

    return _super14.apply(this, arguments);
  }

  _createClass(Debounce, [{
    key: "init",
    value: function init(durationSelector) {
      this.durationSelector = durationSelector;
    }
  }, {
    key: "next",
    value: function next(data) {
      if (!this._debounce) {
        this._debounce = new _Debounce(this.sink);
        this.defer(this._debounce);
      } else if (this._debounce.isComplete) {
        this._debounce.isComplete = false;
      } else {
        this._debounce.defer();
      }

      this.durationSelector(data)(this._debounce);
      this._debounce.last = data;
    }
  }, {
    key: "complete",
    value: function complete(err) {
      if (err) {
        this._debounce && this._debounce.dispose();

        _get(_getPrototypeOf(Debounce.prototype), "complete", this).call(this, err);
      } else {
        this._debounce && this._debounce.complete();

        _get(_getPrototypeOf(Debounce.prototype), "complete", this).call(this);
      }
    }
  }]);

  return Debounce;
}(Sink);

var debounce = deliver(Debounce);

var ElementAt = /*#__PURE__*/function (_Sink15) {
  _inherits(ElementAt, _Sink15);

  var _super15 = _createSuper(ElementAt);

  function ElementAt() {
    _classCallCheck(this, ElementAt);

    return _super15.apply(this, arguments);
  }

  _createClass(ElementAt, [{
    key: "init",
    value: function init(count, defaultValue) {
      this.count = count;
      this.value = defaultValue;
    }
  }, {
    key: "next",
    value: function next(data) {
      if (this.count-- === 0) {
        this.sink.next(data);
        this.defer();

        _get(_getPrototypeOf(ElementAt.prototype), "complete", this).call(this);
      }
    }
  }, {
    key: "complete",
    value: function complete(err) {
      if (!err) {
        if (this.value === void 0) err = new Error('not enough elements in sequence');else this.sink.next(this.value);
      }

      _get(_getPrototypeOf(ElementAt.prototype), "complete", this).call(this, err);
    }
  }]);

  return ElementAt;
}(Sink);

var elementAt = deliver(ElementAt);
var find = function find(f) {
  return function (source) {
    return take(1)(skipWhile(function (d) {
      return !f(d);
    })(source));
  };
};

var FindIndex = /*#__PURE__*/function (_Sink16) {
  _inherits(FindIndex, _Sink16);

  var _super16 = _createSuper(FindIndex);

  function FindIndex() {
    _classCallCheck(this, FindIndex);

    return _super16.apply(this, arguments);
  }

  _createClass(FindIndex, [{
    key: "init",
    value: function init(f) {
      this.f = f;
      this.i = 0;
    }
  }, {
    key: "next",
    value: function next(data) {
      var f = this.f;

      if (f(data)) {
        this.sink.next(this.i++);
        this.defer();
        this.complete();
      } else {
        ++this.i;
      }
    }
  }]);

  return FindIndex;
}(Sink);

var findIndex = deliver(FindIndex);

var First = /*#__PURE__*/function (_Sink17) {
  _inherits(First, _Sink17);

  var _super17 = _createSuper(First);

  function First() {
    _classCallCheck(this, First);

    return _super17.apply(this, arguments);
  }

  _createClass(First, [{
    key: "init",
    value: function init(f, defaultValue) {
      this.f = f;
      this.value = defaultValue;
      this.count = 0;
    }
  }, {
    key: "next",
    value: function next(data) {
      var f = this.f;

      if (!f || f(data, this.count++)) {
        this.value = data;
        this.defer();
        this.complete();
      }
    }
  }, {
    key: "complete",
    value: function complete(err) {
      if (!err) {
        if (this.value === void 0) err = new Error('no elements in sequence');else this.sink.next(this.value);
      }

      _get(_getPrototypeOf(First.prototype), "complete", this).call(this, err);
    }
  }]);

  return First;
}(Sink);

var first = deliver(First);

var Last = /*#__PURE__*/function (_Sink18) {
  _inherits(Last, _Sink18);

  var _super18 = _createSuper(Last);

  function Last() {
    _classCallCheck(this, Last);

    return _super18.apply(this, arguments);
  }

  _createClass(Last, [{
    key: "init",
    value: function init(f, defaultValue) {
      this.f = f;
      this.value = defaultValue;
      this.count = 0;
    }
  }, {
    key: "next",
    value: function next(data) {
      var f = this.f;

      if (!f || f(data, this.count++)) {
        this.value = data;
      }
    }
  }, {
    key: "complete",
    value: function complete(err) {
      if (!err) {
        if (this.value === void 0) err = new Error('no elements in sequence');else this.sink.next(this.value);
      }

      _get(_getPrototypeOf(Last.prototype), "complete", this).call(this, err);
    }
  }]);

  return Last;
}(Sink);

var last = deliver(Last);

var Every = /*#__PURE__*/function (_Sink19) {
  _inherits(Every, _Sink19);

  var _super19 = _createSuper(Every);

  function Every() {
    _classCallCheck(this, Every);

    return _super19.apply(this, arguments);
  }

  _createClass(Every, [{
    key: "init",
    value: function init(f) {
      this.f = f;
      this.ret = void 0;
    }
  }, {
    key: "next",
    value: function next(data) {
      var f = this.f;

      if (!f(data)) {
        this.ret = false;
        this.defer();
        this.complete();
      } else {
        this.ret = true;
      }
    }
  }, {
    key: "complete",
    value: function complete(err) {
      if (!err) {
        if (this.ret === void 0) err = new Error('no elements in sequence');else this.sink.next(true);
      }

      _get(_getPrototypeOf(Every.prototype), "complete", this).call(this, err);
    }
  }]);

  return Every;
}(Sink);

var every = deliver(Every);

var subject = function subject(source) {
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
var fromArray = function fromArray(array) {
  return function (sink) {
    var pos = 0;
    var l = array.length;

    while (pos < l && !sink.disposed) {
      sink.next(array[pos++]);
    }

    sink.complete();
  };
};
var of = function of() {
  for (var _len = arguments.length, items = new Array(_len), _key = 0; _key < _len; _key++) {
    items[_key] = arguments[_key];
  }

  return fromArray(items);
};
var interval = function interval(period) {
  return function (sink) {
    var i = 0;
    sink.defer([clearInterval,, setInterval(function () {
      return sink.next(i++);
    }, period)]);
  };
};
var timer = function timer(delay, period) {
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
var fromAnimationFrame = function fromAnimationFrame() {
  return function (sink) {
    function next(t) {
      sink.next(t);
      defer[2] = requestAnimationFrame(next);
    }

    var defer = [cancelAnimationFrame,, requestAnimationFrame(next)];
    sink.defer(defer);
  };
};
var fromEventPattern = function fromEventPattern(add, remove) {
  return function (sink) {
    var n = function n(d) {
      return sink.next(d);
    };

    sink.defer([remove,, n]);
    add(n);
  };
};
var fromEvent = function fromEvent(target, name) {
  var addF = ['on', 'addEventListener', 'addListener'].find(function (x) {
    return typeof target[x] == 'function';
  });
  var removeF = ['off', 'removeEventListener', 'removeListener'].find(function (x) {
    return typeof target[x] == 'function';
  });
  if (addF && removeF) return fromEventPattern(function (handler) {
    return target[addF](name, handler);
  }, function (handler) {
    return target[removeF](name, handler);
  });else throw 'target is not a EventDispachter';
};
var fromVueEvent = function fromVueEvent(vm, name) {
  return function (sink) {
    var ls = function ls(e) {
      return sink.next(e);
    };

    vm.$on(name, ls);
    sink.defer([vm.$off, vm, ls]);
  };
};
var fromVueEventOnce = function fromVueEventOnce(vm, name) {
  return function (sink) {
    return vm.$once(name, function (e) {
      return sink.next(e);
    });
  };
};
var fromEventSource = function fromEventSource(src, arg) {
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
var fromFetch = function fromFetch(url, opt) {
  return function (sink) {
    fetch(url, opt).then(function (res) {
      sink.next(res);
      sink.complete();
    }).catch(function (err) {
      return sink.complete(err);
    });
  };
};
var fromNextTick = function fromNextTick(vm) {
  return function (sink) {
    vm.$nextTick(function () {
      sink.next(vm);
      sink.complete();
    });
  };
};
var range = function range(start, count) {
  return function (sink) {
    var pos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : start;
    var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : count + start;

    while (pos < end && !sink.disposed) {
      sink.next(pos++);
    }

    sink.complete();
  };
};
var fromPromise = function fromPromise(source) {
  return function (sink) {
    source.then(function (d) {
      return sink.next(d), sink.complete();
    }).catch(function (e) {
      return sink.complete(e);
    });
  };
};
var fromIterable = function fromIterable(source) {
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
var from = function from(source) {
  switch (true) {
    case source instanceof Array:
      return fromArray(source);

    case source instanceof Promise:
      return fromPromise(source);

    case source[Symbol.iterator] && typeof source[Symbol.iterator] === 'function':
      return fromIterable(source);

    default:
      return of(source);
  }
};
var bindCallback = function bindCallback(call, thisArg) {
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
var bindNodeCallback = function bindNodeCallback(call, thisArg) {
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
var never = function never() {
  return noop;
};
var throwError = function throwError(e) {
  return function (sink) {
    return sink.complete(e);
  };
};
var empty = function empty() {
  return throwError();
};

var Scan = /*#__PURE__*/function (_Sink) {
  _inherits(Scan, _Sink);

  var _super = _createSuper(Scan);

  function Scan() {
    _classCallCheck(this, Scan);

    return _super.apply(this, arguments);
  }

  _createClass(Scan, [{
    key: "init",
    value: function init(hasSeed, f, seed) {
      var _this = this;

      this.f = f;
      this.aac = seed;

      if (!hasSeed) {
        this.next = function (d) {
          delete _this.next;

          _this.sink.next(_this.aac = d);
        };
      }
    }
  }, {
    key: "next",
    value: function next(data) {
      var f = this.f;
      this.aac = f(this.aac, data);
      this.sink.next(this.aac);
    }
  }]);

  return Scan;
}(Sink);

var scan = function scan() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return function (source) {
    return function (sink) {
      return source(_construct(Scan, [sink, args.length == 2].concat(args)));
    };
  };
};
var map = function map(f) {
  return function (source) {
    return function (sink) {
      return source(sink.fusionMap ? sink.fusionMap(f) : new MapSink(sink, f));
    };
  };
};
var mapTo = function mapTo(target) {
  return map(function (x) {
    return target;
  });
};
var pluck = function pluck(s) {
  return map(function (d) {
    return d[s];
  });
};

var Pairwise = /*#__PURE__*/function (_Sink2) {
  _inherits(Pairwise, _Sink2);

  var _super2 = _createSuper(Pairwise);

  function Pairwise() {
    _classCallCheck(this, Pairwise);

    return _super2.apply(this, arguments);
  }

  _createClass(Pairwise, [{
    key: "init",
    value: function init() {
      this.hasLast = false;
    }
  }, {
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

var pairwise = deliver(Pairwise);

var Repeat = /*#__PURE__*/function (_Sink3) {
  _inherits(Repeat, _Sink3);

  var _super3 = _createSuper(Repeat);

  function Repeat() {
    _classCallCheck(this, Repeat);

    return _super3.apply(this, arguments);
  }

  _createClass(Repeat, [{
    key: "init",
    value: function init(count) {
      this.buffer = [];
      this.count = count;
    }
  }, {
    key: "next",
    value: function next(data) {
      this.buffer.push(data);
      this.sink.next(data);
    }
  }, {
    key: "complete",
    value: function complete(err) {
      if (err) _get(_getPrototypeOf(Repeat.prototype), "complete", this).call(this, err);else {
        while (this.count--) {
          for (var i = 0, l = this.buffer.length; i < l; this.sink.next(this.buffer[i++])) {
            if (this.disposed) return;
          }
        }

        _get(_getPrototypeOf(Repeat.prototype), "complete", this).call(this);
      }
    }
  }]);

  return Repeat;
}(Sink);

var repeat = deliver(Repeat);

var _SwitchMap = /*#__PURE__*/function (_Sink4) {
  _inherits(_SwitchMap, _Sink4);

  var _super4 = _createSuper(_SwitchMap);

  function _SwitchMap() {
    _classCallCheck(this, _SwitchMap);

    return _super4.apply(this, arguments);
  }

  _createClass(_SwitchMap, [{
    key: "init",
    value: function init(data, context) {
      this.data = data;
      this.context = context;
    }
  }, {
    key: "next",
    value: function next(data) {
      var combineResults = this.context.combineResults;

      if (combineResults) {
        this.sink.next(combineResults(this.data, data));
      } else {
        this.sink.next(data);
      }
    }
  }, {
    key: "complete",
    value: function complete(err) {
      if (this.context.disposed) _get(_getPrototypeOf(_SwitchMap.prototype), "complete", this).call(this, err);else this.dispose(false);
    }
  }]);

  return _SwitchMap;
}(Sink);

var SwitchMap = /*#__PURE__*/function (_Sink5) {
  _inherits(SwitchMap, _Sink5);

  var _super5 = _createSuper(SwitchMap);

  function SwitchMap() {
    _classCallCheck(this, SwitchMap);

    return _super5.apply(this, arguments);
  }

  _createClass(SwitchMap, [{
    key: "init",
    value: function init(makeSource, combineResults) {
      this.makeSource = makeSource;
      this.combineResults = combineResults;
      this.index = 0;
    }
  }, {
    key: "next",
    value: function next(data) {
      var makeSource = this.makeSource;

      if (this.switch) {
        this.switch.disposePass = false;
        this.switch.dispose();
      }

      this.switch = new _SwitchMap(this.sink, data, this);
      makeSource(data, this.index++)(this.switch);
    }
  }, {
    key: "complete",
    value: function complete(err) {
      if (!this.switch || this.switch.disposed) _get(_getPrototypeOf(SwitchMap.prototype), "complete", this).call(this, err);else this.dispose(false);
    }
  }]);

  return SwitchMap;
}(Sink);

var switchMap = deliver(SwitchMap);
var switchMapTo = function switchMapTo(innerSource, combineResults) {
  return switchMap(function (d) {
    return innerSource;
  }, combineResults);
};

var _MergeMap = /*#__PURE__*/function (_Sink6) {
  _inherits(_MergeMap, _Sink6);

  var _super6 = _createSuper(_MergeMap);

  function _MergeMap() {
    _classCallCheck(this, _MergeMap);

    return _super6.apply(this, arguments);
  }

  _createClass(_MergeMap, [{
    key: "init",
    value: function init(data, context) {
      this.data = data;
      this.context = context;
    }
  }, {
    key: "next",
    value: function next(data) {
      var combineResults = this.context.combineResults;

      if (combineResults) {
        this.sink.next(combineResults(this.data, data));
      } else {
        this.sink.next(data);
      }
    }
  }, {
    key: "complete",
    value: function complete(err) {
      this.context.subDisposed++;
      if (this.context.subDisposed == this.context.count && this.context.disposed) _get(_getPrototypeOf(_MergeMap.prototype), "complete", this).call(this, err);else this.dispose(false);
    }
  }]);

  return _MergeMap;
}(Sink);

var MergeMap = /*#__PURE__*/function (_Sink7) {
  _inherits(MergeMap, _Sink7);

  var _super7 = _createSuper(MergeMap);

  function MergeMap() {
    _classCallCheck(this, MergeMap);

    return _super7.apply(this, arguments);
  }

  _createClass(MergeMap, [{
    key: "init",
    value: function init(makeSource, combineResults) {
      this.makeSource = makeSource;
      this.combineResults = combineResults;
      this.subDisposed = 0;
      this.count = 0;
    }
  }, {
    key: "next",
    value: function next(data) {
      var makeSource = this.makeSource;
      makeSource(data, this.count++)(new _MergeMap(this.sink, data, this));
    }
  }, {
    key: "complete",
    value: function complete(err) {
      if (this.subDisposed === this.count) _get(_getPrototypeOf(MergeMap.prototype), "complete", this).call(this, err);else this.dispose(false);
    }
  }]);

  return MergeMap;
}(Sink);

var mergeMap = deliver(MergeMap);
var mergeMapTo = function mergeMapTo(innerSource, combineResults) {
  return mergeMap(function (d) {
    return innerSource;
  }, combineResults);
};

var BufferTime = /*#__PURE__*/function (_Sink8) {
  _inherits(BufferTime, _Sink8);

  var _super8 = _createSuper(BufferTime);

  function BufferTime() {
    _classCallCheck(this, BufferTime);

    return _super8.apply(this, arguments);
  }

  _createClass(BufferTime, [{
    key: "init",
    value: function init(miniseconds) {
      var _this2 = this;

      this.buffer = [];
      this.id = setInterval(function () {
        _this2.sink.next(_this2.buffer.concat());

        _this2.buffer.length = 0;
      }, miniseconds);
      this.defer([clearInterval,, this.id]);
    }
  }, {
    key: "next",
    value: function next(data) {
      this.buffer.push(data);
    }
  }, {
    key: "complete",
    value: function complete(err) {
      clearInterval(this.id);
      if (!err) this.sink.next(this.buffer);

      _get(_getPrototypeOf(BufferTime.prototype), "complete", this).call(this, err);
    }
  }]);

  return BufferTime;
}(Sink);

var bufferTime = deliver(BufferTime);

var TimeInterval = /*#__PURE__*/function (_Sink9) {
  _inherits(TimeInterval, _Sink9);

  var _super9 = _createSuper(TimeInterval);

  function TimeInterval() {
    _classCallCheck(this, TimeInterval);

    return _super9.apply(this, arguments);
  }

  _createClass(TimeInterval, [{
    key: "init",
    value: function init() {
      this.start = new Date();
    }
  }, {
    key: "next",
    value: function next(value) {
      this.sink.next({
        value: value,
        interval: new Date() - this.start
      });
      this.start = new Date();
    }
  }]);

  return TimeInterval;
}(Sink);

var timeInterval = deliver(TimeInterval);

var pipe = function pipe(first) {
  for (var _len = arguments.length, cbs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    cbs[_key - 1] = arguments[_key];
  }

  return cbs.reduce(function (aac, c) {
    return c(aac);
  }, first);
};

var Reuse = /*#__PURE__*/function () {
  function Reuse(subscribe) {
    _classCallCheck(this, Reuse);

    this.subscribe = subscribe;

    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    this.source = pipe.apply(void 0, args);
  }

  _createClass(Reuse, [{
    key: "start",
    value: function start() {
      this.subscriber = this.subscribe(this.source);
    }
  }, {
    key: "stop",
    value: function stop() {
      this.subscriber && this.subscriber.dispose();
    }
  }]);

  return Reuse;
}(); // //在pipe的基础上增加了start和stop方法，方便反复调用


var reusePipe = function reusePipe() {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return _construct(Reuse, args);
};
var toPromise = function toPromise() {
  return function (source) {
    return new Promise(function (resolve, reject) {
      var sink = new Sink();

      sink.next = function (d) {
        return sink.value = d;
      };

      sink.complete = function (err) {
        return err ? reject(err) : resolve(sink.value);
      };

      source(sink);
    });
  };
}; // //SUBSCRIBER

var subscribe = function subscribe() {
  var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;
  var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
  var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;
  return function (source) {
    var sink = new Sink();
    sink.next = n;

    sink.complete = function (err) {
      return err ? e(err) : c();
    };

    sink.then = noop;
    source(sink);
    return sink;
  };
}; // // UTILITY

var Tap = /*#__PURE__*/function (_Sink) {
  _inherits(Tap, _Sink);

  var _super = _createSuper(Tap);

  function Tap() {
    _classCallCheck(this, Tap);

    return _super.apply(this, arguments);
  }

  _createClass(Tap, [{
    key: "init",
    value: function init(f) {
      this.f = f;
    }
  }, {
    key: "next",
    value: function next(data) {
      var f = this.f;
      f(data);
      this.sink.next(data);
    }
  }]);

  return Tap;
}(Sink);

var tap = deliver(Tap);

var Delay = /*#__PURE__*/function (_Sink2) {
  _inherits(Delay, _Sink2);

  var _super2 = _createSuper(Delay);

  function Delay() {
    _classCallCheck(this, Delay);

    return _super2.apply(this, arguments);
  }

  _createClass(Delay, [{
    key: "init",
    value: function init(delay) {
      this.delayTime = delay;
      this.buffer = []; // eslint-disable-next-line no-sparse-arrays

      this.timeoutId = [clearTimeout,,];
      this.defer(this.timeoutId);
    }
  }, {
    key: "delay",
    value: function delay(_delay) {
      this.timeoutId[2] = setTimeout(this.pop, _delay, this);
    }
  }, {
    key: "pop",
    value: function pop(_this) {
      var _this$buffer$shift = _this.buffer.shift(),
          lastTime = _this$buffer$shift.time,
          data = _this$buffer$shift.data;

      _this.sink.next(data);

      if (_this.buffer.length) {
        _this.delay(_this.buffer[0].time - lastTime);
      }
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
    value: function complete(err) {
      var _this2 = this;

      if (err) this.sink.complete(err);else {
        this.timeoutId[2] = setTimeout(function () {
          return _this2.sink.complete();
        }, this.delayTime);
      }
    }
  }]);

  return Delay;
}(Sink);

var delay = deliver(Delay);

var CatchError = /*#__PURE__*/function (_Sink3) {
  _inherits(CatchError, _Sink3);

  var _super3 = _createSuper(CatchError);

  function CatchError() {
    _classCallCheck(this, CatchError);

    return _super3.apply(this, arguments);
  }

  _createClass(CatchError, [{
    key: "init",
    value: function init(selector) {
      this.selector = selector;
    }
  }, {
    key: "complete",
    value: function complete(err) {
      if (err) {
        this.selector(err)(this.sink);
      } else {
        _get(_getPrototypeOf(CatchError.prototype), "complete", this).call(this);
      }
    }
  }]);

  return CatchError;
}(Sink);

var catchError = deliver(CatchError);

var GroupBy = /*#__PURE__*/function (_Sink4) {
  _inherits(GroupBy, _Sink4);

  var _super4 = _createSuper(GroupBy);

  function GroupBy() {
    _classCallCheck(this, GroupBy);

    return _super4.apply(this, arguments);
  }

  _createClass(GroupBy, [{
    key: "init",
    value: function init(f) {
      this.f = f;
      this.groups = new Map();
    }
  }, {
    key: "next",
    value: function next(data) {
      var key = this.f(data);
      var group = this.groups.get(key);

      if (!group) {
        group = subject();
        group.key = key;
        this.groups.set(key, group);
        this.sink.next(group);
      }

      group.next(data);
    }
  }, {
    key: "complete",
    value: function complete(err) {
      this.groups.forEach(function (group) {
        return group.complete(err);
      });

      _get(_getPrototypeOf(GroupBy.prototype), "complete", this).call(this, err);
    }
  }]);

  return GroupBy;
}(Sink);

var groupBy = deliver(GroupBy);
var Events = {
  addSource: noop,
  subscribe: noop,
  next: noop,
  complete: noop,
  defer: noop,
  pipe: noop,
  update: noop,
  create: noop
};

function send(event, payload) {
  window.postMessage({
    source: 'fastrx-devtools-backend',
    payload: {
      event: event,
      payload: payload
    }
  });
}

Events.create = function (who) {
  send('create', {
    name: who.toString(),
    id: who.id
  });
};

Events.next = function (who, streamId, data) {
  send('next', {
    id: who.id,
    streamId: streamId,
    data: data && data.toString()
  });
};

Events.complete = function (who, streamId, err) {
  send('complete', {
    id: who.id,
    streamId: streamId,
    err: err ? err.toString() : null
  });
};

Events.defer = function (who, streamId) {
  send('defer', {
    id: who.id,
    streamId: streamId
  });
};

Events.addSource = function (who, source) {
  send('addSource', {
    id: who.id,
    name: who.toString(),
    source: {
      id: source.id,
      name: source.toString()
    }
  });
};

Events.pipe = function (who) {
  send('pipe', {
    name: who.toString(),
    id: who.id,
    source: {
      id: who.source.id,
      name: who.source.toString()
    }
  });
};

Events.update = function (who) {
  send('update', {
    id: who.id,
    name: who.toString()
  });
};

Events.subscribe = function (_ref, sink) {
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
};

var _observables = /*#__PURE__*/Object.freeze({
  __proto__: null,
  pipe: pipe,
  reusePipe: reusePipe,
  toPromise: toPromise,
  subscribe: subscribe,
  tap: tap,
  delay: delay,
  catchError: catchError,
  groupBy: groupBy,
  Events: Events,
  noop: noop,
  once: once,
  Sink: Sink,
  asap: asap,
  deliver: deliver,
  share: share,
  shareReplay: shareReplay,
  iif: iif,
  race: race,
  concat: concat,
  mergeArray: mergeArray,
  merge: merge,
  combineLatest: combineLatest,
  withLatestFrom: withLatestFrom,
  zip: zip,
  startWith: startWith,
  bufferCount: bufferCount,
  concatAll: concatAll,
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
  throttleTime: throttleTime,
  debounceTime: debounceTime,
  debounce: debounce,
  elementAt: elementAt,
  find: find,
  findIndex: findIndex,
  first: first,
  last: last,
  every: every,
  reduce: reduce,
  count: count,
  max: max,
  min: min,
  sum: sum,
  subject: subject,
  fromArray: fromArray,
  of: of,
  interval: interval,
  timer: timer,
  fromAnimationFrame: fromAnimationFrame,
  fromEventPattern: fromEventPattern,
  fromEvent: fromEvent,
  fromVueEvent: fromVueEvent,
  fromVueEventOnce: fromVueEventOnce,
  fromEventSource: fromEventSource,
  fromFetch: fromFetch,
  fromNextTick: fromNextTick,
  range: range,
  fromPromise: fromPromise,
  fromIterable: fromIterable,
  from: from,
  bindCallback: bindCallback,
  bindNodeCallback: bindNodeCallback,
  never: never,
  throwError: throwError,
  empty: empty,
  scan: scan,
  map: map,
  mapTo: mapTo,
  pluck: pluck,
  pairwise: pairwise,
  repeat: repeat,
  switchMap: switchMap,
  switchMapTo: switchMapTo,
  mergeMap: mergeMap,
  mergeMapTo: mergeMapTo,
  bufferTime: bufferTime,
  timeInterval: timeInterval
});

var Events$1 = Events,
    Sink$1 = Sink;
var COUNT = 0;
var Node = /*#__PURE__*/function () {
  function Node() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var arg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, Node);

    this.name = name;
    this.arg = arg;
    this.source = null;
    this.id = COUNT++;

    switch (name) {
      case 'subscribe':
      case 'toPromise':
      case 'toRef':
        this.end = true;
        break;

      default:
        this.end = false;
    }

    Events$1.create(this);

    if (arg.length) {
      this.args = arg;
    }
  }

  _createClass(Node, [{
    key: "toString",
    value: function toString() {
      return "".concat(typeof this.name == 'string' ? this.name : this.name.name, "(").concat(this.arg.map(function (x) {
        return _typeof(x) == 'object' || typeof x == 'function' ? (typeof x.name == 'function' ? x.name.name : x.name) || '...' : x;
      }).join(','), ")");
    }
  }, {
    key: "unProxy",
    get: function get() {
      return this;
    } //是否属于子流

  }, {
    key: "checkSubNode",
    value: function checkSubNode(x) {
      var _this = this;

      if (typeof x == 'function') {
        var isNode = x.unProxy;
        return isNode ? (Events$1.addSource(this, isNode), function (s) {
          s.nodeId = _this.id;
          s.streamId = 0;
          isNode.subscribe(s);
        }) : function () {
          return _this.checkSubNode(x.apply(void 0, arguments));
        };
      }

      return x;
    } //过滤子事件流，放入sources数组中，就能显示

  }, {
    key: "args",
    set: function set(value) {
      var _this2 = this;

      this.arg = value.map(function (x) {
        return _this2.checkSubNode(x);
      });
    } // 通过返回proxy产生链式调用

  }, {
    key: "pipe",
    value: function pipe() {
      var _this3 = this;

      if (this.end) {
        return this.subscribe();
      }

      var target = this;
      return new Proxy(function (sink) {
        return _this3.subscribe(sink);
      }, {
        get: function get(_, prop) {
          if (prop != 'subscribe' && (target[prop] || target.hasOwnProperty(prop))) return target[prop];
          if (prop == 'subscribe' && target.subscribeSink) return target.subscribeSink;
          var sink = target.createSink(prop);
          return target.subscribeSink = function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            sink.args = args;
            Events$1.update(sink);
            return sink.pipe();
          };
        }
      });
    }
  }, {
    key: "createSink",
    value: function createSink(name) {
      var sink = new Node(name);
      sink.source = this;
      Events$1.pipe(sink);
      return sink;
    }
  }, {
    key: "subscribe",
    value: function subscribe(sink) {
      var _this4 = this;

      var source = this.source,
          name = this.name,
          arg = this.arg;
      var realrx = typeof name == 'string' ? _observables[name].apply(_observables, _toConsumableArray(arg)) : name;
      var f = source && !this.end ? realrx(function (s) {
        s.streamId = streamCount - 1;
        s.nodeId = _this4.id;
        source.subscribe(s);
      }) : realrx;
      var streamCount = 0;

      this.subscribe = function (sink) {
        var _this5 = this;

        var streamId = streamCount++;

        if (this.end) {
          return f(function (s) {
            var oNext = s.next;
            var oComplete = s.complete;

            s.next = function (data) {
              Events$1.next(_this5, streamId, data);
              oNext(data);
            };

            s.complete = function (err) {
              Events$1.complete(_this5, streamId, err);
              oComplete(err);
            };

            s.streamId = streamId;
            s.nodeId = _this5.id;
            Events$1.subscribe(_this5);
            source.subscribe(s);
          });
        }

        var newSink = new Sink$1(sink);

        newSink.next = function (data) {
          Events$1.next(_this5, streamId, data);
          sink.next(data);
        };

        newSink.complete = function (err) {
          Events$1.complete(_this5, streamId, err);
          sink.complete(err);
        };

        newSink.defer(function () {
          Events$1.defer(_this5, streamId);
        });
        Events$1.subscribe(this, sink);
        f(newSink);
        return newSink;
      };

      return this.subscribe(sink);
    }
  }]);

  return Node;
}();

var Sink$2 = Sink,
    deliver$1 = deliver,
    observables = _objectWithoutProperties(_observables, ["Sink", "pipe", "reusePipe", "Events", "deliver", "noop"]);

var GroupBy$1 = /*#__PURE__*/function (_Sink) {
  _inherits(GroupBy, _Sink);

  var _super = _createSuper(GroupBy);

  function GroupBy() {
    _classCallCheck(this, GroupBy);

    return _super.apply(this, arguments);
  }

  _createClass(GroupBy, [{
    key: "init",
    value: function init(f) {
      this.f = f;
      this.groups = new Map();
    }
  }, {
    key: "next",
    value: function next(data) {
      var key = this.f(data);
      var group = this.groups.get(key);

      if (!group) {
        group = rx.subject();
        group.key = key;
        this.groups.set(key, group);
        this.sink.next(group);
      }

      group.next(data);
    }
  }, {
    key: "complete",
    value: function complete(err) {
      this.groups.forEach(function (group) {
        return group.complete(err);
      });

      _get(_getPrototypeOf(GroupBy.prototype), "complete", this).call(this, err);
    }
  }]);

  return GroupBy;
}(Sink$2);

observables.groupBy = deliver$1(GroupBy$1);

function inspect() {
  return typeof window != 'undefined' && window.__FASTRX_DEVTOOLS__;
}

function createRx() {
  if (typeof Proxy == 'undefined') {
    var prototype = {}; //将一个Observable函数的原型修改为具有所有operator的方法

    var _rx = function _rx(f) {
      return Object.setPrototypeOf(f, prototype);
    }; //提供动态添加Obserable以及operator的方法


    _rx.set = function (ext) {
      var _loop = function _loop(key) {
        var f = ext[key];

        switch (key) {
          case 'subscribe':
            prototype[key] = function () {
              return f.apply(void 0, arguments)(this);
            };

            break;

          case 'toPromise':
            prototype[key] = function () {
              return f(this);
            };

            break;

          default:
            prototype[key] = function () {
              return _rx(f.apply(void 0, arguments)(this));
            };

            _rx[key] = function () {
              return _rx(f.apply(void 0, arguments));
            };

        }
      };

      for (var key in ext) {
        _loop(key);
      }
    };

    _rx.set(observables);

    return _rx;
  } else {
    var rxProxy = {
      get: function get(target, prop) {
        return prop in target ? target[prop] : function () {
          return new Proxy(observables[prop].apply(observables, arguments)(target), rxProxy);
        };
      }
    };
    return new Proxy(function (f) {
      return inspect() ? new Node(f).pipe() : new Proxy(f, rxProxy);
    }, {
      get: function get(_target, prop) {
        return inspect() ? function () {
          for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
            arg[_key] = arguments[_key];
          }

          return new Node(prop, arg).pipe();
        } : function () {
          return new Proxy(observables[prop].apply(observables, arguments), rxProxy);
        };
      },
      set: function set(_target, prop, value) {
        return observables[prop] = value;
      }
    });
  }
}

var rx = createRx();

module.exports = rx;
//# sourceMappingURL=cjs.js.map
