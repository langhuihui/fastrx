'use strict';

require('core-js/modules/es.array.concat.js');
require('core-js/modules/es.array.every.js');
require('core-js/modules/es.array.for-each.js');
require('core-js/modules/es.array.iterator.js');
require('core-js/modules/es.array.map.js');
require('core-js/modules/es.object.to-string.js');
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

var _this = undefined;

var _require = require('./common'),
    Sink = _require.Sink,
    deliver = _require.deliver,
    noop = _require.noop;

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

exports.share = function () {
  return function (source) {
    var share = new Share(null, source);
    return function (sink) {
      sink.defer([share.remove, share, sink]);
      share.add(sink);
    };
  };
};

exports.shareReplay = function (bufferSize) {
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
      sink.defer([share.remove, share, _this]);
      buffer.forEach(function (cache) {
        return sink.next(cache);
      });
      share.add(sink);
    };
  };
};

exports.iif = function (condition, trueS, falseS) {
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

exports.race = function () {
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

exports.concat = function () {
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

exports.mergeArray = function (sources) {
  return function (sink) {
    return new Merge(sink, sources.length).subscribes(sources);
  };
};

exports.merge = function () {
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

exports.combineLatest = function () {
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
      var _this2 = this,
          _exports;

      this._withLatestFrom = new Sink(this.sink);

      this._withLatestFrom.next = function (data) {
        return _this2.buffer = data;
      };

      this._withLatestFrom.complete = noop;

      (_exports = exports).combineLatest.apply(_exports, arguments)(this._withLatestFrom);
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

exports.withLatestFrom = deliver(WithLatestFrom);

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

exports.zip = function () {
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

exports.startWith = function () {
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
//# sourceMappingURL=combination.js.map
