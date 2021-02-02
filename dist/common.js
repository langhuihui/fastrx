'use strict';

require('core-js/modules/es.symbol.js');
require('core-js/modules/es.symbol.description.js');
require('core-js/modules/es.array.concat.js');
require('core-js/modules/es.array.for-each.js');
require('core-js/modules/es.array.iterator.js');
require('core-js/modules/es.array.slice.js');
require('core-js/modules/es.object.to-string.js');
require('core-js/modules/es.promise.js');
require('core-js/modules/es.set.js');
require('core-js/modules/es.string.iterator.js');
require('core-js/modules/web.dom-collections.for-each.js');
require('core-js/modules/web.dom-collections.iterator.js');

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
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
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

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function noop() {}

exports.noop = noop;
exports.stop = Symbol('stop'); //第一次调用有效

exports.once = function (f) {
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
              var _defer = _toArray(defer),
                  f = _defer[0],
                  thisArg = _defer[1],
                  args = _defer.slice(2);

              if (f.call) f.call.apply(f, [thisArg].concat(_toConsumableArray(args)));else f.apply(void 0, _toConsumableArray(args));
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
  }, {
    key: "disposePass",
    set: function set(value) {
      if (!this.sink) return;
      if (value) this.sink.defers.add(this);else this.sink.defers.delete(this);
    }
  }]);

  return Sink;
}();

exports.Sink = Sink;

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

exports.asap = asap;

exports.deliver = function (Class) {
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
//# sourceMappingURL=common.js.map
