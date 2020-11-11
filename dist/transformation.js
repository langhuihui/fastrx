'use strict';

require('core-js/modules/es.array.concat');
require('core-js/modules/es.array.map');
require('core-js/modules/es.string.repeat');

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
    deliver = _require.deliver;

var _require2 = require('./fusion'),
    MapSink = _require2.MapSink;

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

exports.scan = function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return function (source) {
    return function (sink) {
      return source(_construct(Scan, [sink, args.length == 2].concat(args)));
    };
  };
};

exports.map = function (f) {
  return function (source) {
    return function (sink) {
      return source(sink.fusionMap ? sink.fusionMap(f) : new MapSink(sink, f));
    };
  };
};

exports.mapTo = function (target) {
  return exports.map(function (x) {
    return target;
  });
};

exports.pluck = function (s) {
  return exports.map(function (d) {
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

exports.pairwise = deliver(Pairwise);

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

exports.repeat = deliver(Repeat);

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
      makeSource(data)(this.switch);
    }
  }, {
    key: "complete",
    value: function complete(err) {
      if (!this.switch || this.switch.disposed) _get(_getPrototypeOf(SwitchMap.prototype), "complete", this).call(this, err);else this.dispose(false);
    }
  }]);

  return SwitchMap;
}(Sink);

exports.switchMap = deliver(SwitchMap);

exports.switchMapTo = function (innerSource, combineResults) {
  return exports.switchMap(function (d) {
    return innerSource;
  }, combineResults);
};

var BufferTime = /*#__PURE__*/function (_Sink6) {
  _inherits(BufferTime, _Sink6);

  var _super6 = _createSuper(BufferTime);

  function BufferTime() {
    _classCallCheck(this, BufferTime);

    return _super6.apply(this, arguments);
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

exports.bufferTime = deliver(BufferTime);
//# sourceMappingURL=transformation.js.map
