'use strict';

require('core-js/modules/es.array.filter');
require('core-js/modules/es.array.find');
require('core-js/modules/es.array.find-index');
require('core-js/modules/es.array.reduce');

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

var _require2 = require('./fusion'),
    Filter = _require2.Filter;

var _require3 = require('./mathematical'),
    reduce = _require3.reduce;

exports.filter = function (f) {
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

exports.ignoreElements = function (source) {
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

exports.take = deliver(Take);

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
        return _this.complete();
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

exports.takeUntil = deliver(TakeUntil);

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

exports.takeWhile = deliver(TakeWhile);

exports.takeLast = function (count) {
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

exports.skip = deliver(Skip);

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

exports.skipUntil = deliver(SkipUntil);

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

exports.skipWhile = deliver(SkipWhile);
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

exports.throttle = deliver(Throttle);
var defaultAuditConfig = {
  leading: false,
  trailing: true
};

exports.audit = function (durationSelector) {
  return exports.throttle(durationSelector, defaultAuditConfig);
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

exports.throttleTime = deliver(ThrottleTime);

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

        if (!error && this.hasOwnProperty("buffer")) {
          this.sink.next(this.buffer);
        }
      }

      _get(_getPrototypeOf(DebounceTime.prototype), "complete", this).call(this, error);
    }
  }]);

  return DebounceTime;
}(Sink);

exports.debounceTime = deliver(DebounceTime);

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

exports.debounce = deliver(Debounce);

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

exports.elementAt = deliver(ElementAt);

exports.find = function (f) {
  return function (source) {
    return exports.take(1)(exports.skipWhile(function (d) {
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

exports.findIndex = deliver(FindIndex);

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

exports.first = deliver(First);

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

exports.last = deliver(Last);
//# sourceMappingURL=filtering.js.map
