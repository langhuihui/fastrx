'use strict';

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

var _require = require('./common'),
    Sink = _require.Sink;

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

exports.Filter = Filter;

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

exports.MapSink = MapSink;
//# sourceMappingURL=fusion.js.map
