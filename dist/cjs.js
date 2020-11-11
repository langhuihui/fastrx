'use strict';

require('core-js/modules/es.array.reduce');
require('core-js/modules/es.object.assign');
require('core-js/modules/es.object.set-prototype-of');
require('core-js/modules/es.object.to-string');
require('core-js/modules/es.promise');

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

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
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

var _require = require('./common'),
    Sink = _require.Sink,
    deliver = _require.deliver,
    noop = _require.noop;

exports.Sink = Sink;

exports.pipe = function (first) {
  for (var _len = arguments.length, cbs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    cbs[_key - 1] = arguments[_key];
  }

  return cbs.reduce(function (aac, c) {
    return c(aac);
  }, first);
};

var Reuse = /*#__PURE__*/function () {
  function Reuse(subscribe) {
    var _exports;

    _classCallCheck(this, Reuse);

    this.subscribe = subscribe;

    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    this.source = (_exports = exports).pipe.apply(_exports, args);
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
}(); //在pipe的基础上增加了start和stop方法，方便反复调用


exports.reusePipe = function () {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return _construct(Reuse, args);
};

exports.toPromise = function (source) {
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
}; //SUBSCRIBER


exports.subscribe = function (n) {
  var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
  var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;
  return function (source) {
    var sink = new Sink();
    sink.next = n;

    sink.complete = function (err) {
      return err ? e(err) : c();
    };

    source(sink);
    return sink;
  };
}; // UTILITY 


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

exports.tap = deliver(Tap);

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
      this.buffer = [];
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

exports.delay = deliver(Delay);

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

exports.catchError = deliver(CatchError);
Object.assign(exports, require('./combination'), require('./filtering'), require('./mathematical'), require('./producer'), require('./transformation'), require('./vue3'));

if (typeof Proxy == 'undefined') {
  var prototype = {}; //将一个Observable函数的原型修改为具有所有operator的方法

  var rx = function rx(f) {
    return Object.setPrototypeOf(f, prototype);
  }; //提供动态添加Obserable以及operator的方法


  rx.set = function (ext) {
    var _loop = function _loop(key) {
      var f = ext[key];

      switch (key) {
        case 'Sink':
        case 'pipe':
        case 'reusePipe':
          break;

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
            return rx(f.apply(void 0, arguments)(this));
          };

          rx[key] = function () {
            return rx(f.apply(void 0, arguments));
          };

      }
    };

    for (var key in ext) {
      _loop(key);
    }
  };

  rx.set(exports);
  exports.rx = rx;
} else {
  //该代理可以实现将pipe模式转成链式编程
  var rxProxy = {
    get: function get(target, prop) {
      return target[prop] || function () {
        var _exports2;

        return new Proxy((_exports2 = exports)[prop].apply(_exports2, arguments)(target), rxProxy);
      };
    }
  };
  exports.rx = new Proxy(function (f) {
    return new Proxy(f, rxProxy);
  }, {
    get: function get(target, prop) {
      return function () {
        var _exports3;

        return new Proxy((_exports3 = exports)[prop].apply(_exports3, arguments), rxProxy);
      };
    },
    set: function set(target, prop, value) {
      return exports[prop] = value;
    }
  });
}
//# sourceMappingURL=cjs.js.map
