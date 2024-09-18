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
require('core-js/modules/es.promise.js');
require('core-js/modules/es.array.map.js');
require('core-js/modules/es.map.js');
require('core-js/modules/es.array.filter.js');
require('core-js/modules/es.number.constructor.js');

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _construct(t, e, r) {
  if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && _setPrototypeOf(p, r.prototype), p;
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: !0
          } : {
            done: !1,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = !0,
    u = !1;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = !0, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _get() {
  return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) {
    var p = _superPropBase(e, t);
    if (p) {
      var n = Object.getOwnPropertyDescriptor(p, t);
      return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value;
    }
  }, _get.apply(null, arguments);
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: !0,
      configurable: !0
    }
  }), Object.defineProperty(t, "prototype", {
    writable: !1
  }), e && _setPrototypeOf(t, e);
}
function _isNativeFunction(t) {
  try {
    return -1 !== Function.toString.call(t).indexOf("[native code]");
  } catch (n) {
    return "function" == typeof t;
  }
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function () {
    return !!t;
  })();
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _regeneratorRuntime() {
  _regeneratorRuntime = function () {
    return e;
  };
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function (t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function (t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(typeof e + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) r.push(n);
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function (e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
    },
    stop: function () {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function (e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function (t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function (t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    catch: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw Error("illegal catch attempt");
    },
    delegateYield: function (e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}
function _superPropBase(t, o) {
  for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t)););
  return t;
}
function _superPropGet(t, e, o, r) {
  var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), e, o);
  return 2 & r && "function" == typeof p ? function (t) {
    return p.apply(o, t);
  } : p;
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _wrapNativeSuper(t) {
  var r = "function" == typeof Map ? new Map() : void 0;
  return _wrapNativeSuper = function (t) {
    if (null === t || !_isNativeFunction(t)) return t;
    if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
    if (void 0 !== r) {
      if (r.has(t)) return r.get(t);
      r.set(t, Wrapper);
    }
    function Wrapper() {
      return _construct(t, arguments, _getPrototypeOf(this).constructor);
    }
    return Wrapper.prototype = Object.create(t.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }), _setPrototypeOf(Wrapper, t);
  }, _wrapNativeSuper(t);
}

function nothing() {}
var call = function call(f) {
  return f();
};
var identity = function identity(x) {
  return x;
};
function dispose() {
  this.dispose();
}
// @ts-ignore
var inspect = function inspect() {
  return typeof __FASTRX_DEVTOOLS__ !== 'undefined';
};
var obids = 1;
// function pp(this: Observable<unknown>, ...args: [...Operator<unknown>[], Operator<unknown>]) {
//   return pipe(this, ...args);
// }
var Inspect = /*#__PURE__*/function (_Function) {
  function Inspect() {
    _classCallCheck(this, Inspect);
    return _callSuper(this, Inspect, arguments);
  }
  _inherits(Inspect, _Function);
  return _createClass(Inspect, [{
    key: "toString",
    value: function toString() {
      return "".concat(this.name, "(").concat(this.args.length ? _toConsumableArray(this.args).join(', ') : "", ")");
    }
    // pipe(...args: [...Operator<unknown>[], Operator<unknown>]): Observable<unknown> {
    //   return pipe(this as unknown as Observable<T>, ...args);
    // }
  }, {
    key: "subscribe",
    value: function subscribe(sink) {
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
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(Function));
var LastSink = /*#__PURE__*/function () {
  function LastSink() {
    _classCallCheck(this, LastSink);
    this.defers = new Set();
    this.disposed = false;
  }
  return _createClass(LastSink, [{
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
      if (source instanceof Inspect) source.subscribe(this);else source(this);
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
      this.disposed = false;
      //@ts-ignore
      delete this.complete;
      //@ts-ignore
      delete this.next;
      //@ts-ignore
      delete this.dispose;
      //@ts-ignore
      delete this.next;
      //@ts-ignore
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
}();
var Sink = /*#__PURE__*/function (_LastSink) {
  function Sink(sink) {
    var _this3;
    _classCallCheck(this, Sink);
    _this3 = _callSuper(this, Sink);
    _this3.sink = sink;
    sink.defer(_this3.bindDispose);
    return _this3;
  }
  _inherits(Sink, _LastSink);
  return _createClass(Sink, [{
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
}(LastSink);
var Subscribe = /*#__PURE__*/function (_LastSink2) {
  function Subscribe(source) {
    var _this4;
    var _next = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : nothing;
    var _error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : nothing;
    var _complete = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : nothing;
    _classCallCheck(this, Subscribe);
    _this4 = _callSuper(this, Subscribe);
    _this4._next = _next;
    _this4._error = _error;
    _this4._complete = _complete;
    _this4.then = nothing;
    if (source instanceof Inspect) {
      var node = {
        toString: function toString() {
          return 'subscribe';
        },
        id: 0,
        source: source
      };
      _this4.defer(function () {
        Events.defer(node, 0);
      });
      Events.create(node);
      Events.pipe(node);
      _this4.sourceId = node.id;
      _this4.subscribe(source);
      Events.subscribe({
        id: node.id,
        end: true
      });
      if (_next == nothing) {
        _this4._next = function (data) {
          return Events.next(node, 0, data);
        };
      } else {
        _this4.next = function (data) {
          Events.next(node, 0, data);
          _next(data);
        };
      }
      if (_complete == nothing) {
        _this4._complete = function () {
          return Events.complete(node, 0);
        };
      } else {
        _this4.complete = function () {
          _this4.dispose();
          Events.complete(node, 0);
          _complete();
        };
      }
      if (_error == nothing) {
        _this4._error = function (err) {
          return Events.complete(node, 0, err);
        };
      } else {
        _this4.error = function (err) {
          _this4.dispose();
          Events.complete(node, 0, err);
          _error();
        };
      }
    } else {
      _this4.subscribe(source);
    }
    return _this4;
  }
  _inherits(Subscribe, _LastSink2);
  return _createClass(Subscribe, [{
    key: "next",
    value: function next(data) {
      this._next(data);
    }
  }, {
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
}(LastSink);
function pipe(first) {
  for (var _len = arguments.length, cbs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    cbs[_key - 1] = arguments[_key];
  }
  return cbs.reduce(function (aac, c) {
    return c(aac);
  }, first);
}
function create(ob, name, args) {
  if (inspect()) {
    var result = Object.defineProperties(Object.setPrototypeOf(ob, Inspect.prototype), {
      streamId: {
        value: 0,
        writable: true,
        configurable: true
      },
      name: {
        value: name,
        writable: true,
        configurable: true
      },
      args: {
        value: args,
        writable: true,
        configurable: true
      },
      id: {
        value: 0,
        writable: true,
        configurable: true
      }
    });
    Events.create(result);
    for (var i = 0; i < args.length; i++) {
      var arg = args[i];
      if (typeof arg === 'function') {
        if (arg instanceof Inspect) {
          Events.addSource(result, arg);
        }
      }
    }
    return result;
  }
  return ob;
}
function deliver(c, name) {
  return function () {
    var _arguments = arguments;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return function (source) {
      if (source instanceof Inspect) {
        var ob = create(function (observer) {
          var deliverSink = _construct(c, [observer].concat(args));
          deliverSink.sourceId = ob.id;
          deliverSink.subscribe(source);
        }, name, _arguments);
        ob.source = source;
        Events.pipe(ob);
        return ob;
      } else {
        return function (observer) {
          return source(_construct(c, [observer].concat(args)));
        };
      }
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
  function NodeSink(sink, source, id) {
    var _this5;
    _classCallCheck(this, NodeSink);
    _this5 = _callSuper(this, NodeSink, [sink]);
    _this5.source = source;
    _this5.id = id;
    _this5.sourceId = sink.sourceId;
    _this5.defer(function () {
      Events.defer(_this5.source, _this5.id);
    });
    return _this5;
  }
  _inherits(NodeSink, _Sink);
  return _createClass(NodeSink, [{
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
}(Sink);
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
    if (!who.id) who.id = obids++;
    send('create', {
      name: who.toString(),
      id: who.id
    });
  }
};
var TimeoutError = /*#__PURE__*/function (_Error) {
  function TimeoutError(timeout) {
    var _this6;
    _classCallCheck(this, TimeoutError);
    _this6 = _callSuper(this, TimeoutError, ["timeout after ".concat(timeout, "ms")]);
    _this6.timeout = timeout;
    return _this6;
  }
  _inherits(TimeoutError, _Error);
  return _createClass(TimeoutError);
}(/*#__PURE__*/_wrapNativeSuper(Error));

var Share = /*#__PURE__*/function (_LastSink) {
  function Share(source) {
    var _this;
    _classCallCheck(this, Share);
    _this = _callSuper(this, Share);
    _this.source = source;
    _this.sinks = new Set();
    return _this;
  }
  _inherits(Share, _LastSink);
  return _createClass(Share, [{
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
}(LastSink);
function share() {
  var _arguments = arguments;
  return function (source) {
    var share = new Share(source);
    if (source instanceof Inspect) {
      var ob = create(function (observer) {
        share.add(observer);
      }, "share", _arguments);
      share.sourceId = ob.id;
      ob.source = source;
      Events.pipe(ob);
      return ob;
    }
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
  function WithLatestFrom(sink) {
    var _this3;
    _classCallCheck(this, WithLatestFrom);
    _this3 = _callSuper(this, WithLatestFrom, [sink]);
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
  _inherits(WithLatestFrom, _Sink);
  return _createClass(WithLatestFrom, [{
    key: "next",
    value: function next(data) {
      if (this.buffer) {
        this.sink.next([data].concat(_toConsumableArray(this.buffer)));
      }
    }
  }]);
}(Sink);
var withLatestFrom = deliver(WithLatestFrom, "withLatestFrom");
var BufferCount = /*#__PURE__*/function (_Sink2) {
  function BufferCount(sink, bufferSize, startBufferEvery) {
    var _this4;
    _classCallCheck(this, BufferCount);
    _this4 = _callSuper(this, BufferCount, [sink]);
    _this4.bufferSize = bufferSize;
    _this4.startBufferEvery = startBufferEvery;
    _this4.buffer = [];
    _this4.count = 0;
    if (_this4.startBufferEvery) {
      _this4.buffers = [[]];
    }
    return _this4;
  }
  _inherits(BufferCount, _Sink2);
  return _createClass(BufferCount, [{
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
      _superPropGet(BufferCount, "complete", this, 3)([]);
    }
  }]);
}(Sink);
var bufferCount = deliver(BufferCount, "bufferCount");
// export function operator<T, R, ARG extends unknown[]>(f: (...args: [ISink<R>, ...ARG]) => ISink<T>) {
//   return (...args: ARG): (Operator<T, R>) => source => sink => f(sink, ...args).subscribe(source);
// }
var Buffer = /*#__PURE__*/function (_Sink3) {
  function Buffer(sink, closingNotifier) {
    var _this6;
    _classCallCheck(this, Buffer);
    _this6 = _callSuper(this, Buffer, [sink]);
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
  _inherits(Buffer, _Sink3);
  return _createClass(Buffer, [{
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
      _superPropGet(Buffer, "complete", this, 3)([]);
    }
  }]);
}(Sink);
var buffer = deliver(Buffer, "buffer");

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
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
var asap = function asap(f) {
  return function (sink) {
    setTimeout(function () {
      return f(sink);
    });
  };
};
var _fromArray = function _fromArray(data) {
  return asap(function (sink) {
    for (var i = 0; !sink.disposed && i < data.length; i++) {
      sink.next(data[i]);
    }
    sink.complete();
  });
};
function of() {
  for (var _len = arguments.length, data = new Array(_len), _key = 0; _key < _len; _key++) {
    data[_key] = arguments[_key];
  }
  return create(_fromArray(data), "of", arguments);
}
function fromArray(data) {
  return create(_fromArray(data), "fromArray", arguments);
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
function _fromEventPattern(add, remove) {
  return function (sink) {
    var n = function n(d) {
      return sink.next(d);
    };
    sink.defer(function () {
      return remove(n);
    });
    add(n);
  };
}
function fromEventPattern(add, remove) {
  return create(_fromEventPattern(add, remove), "fromEventPattern", arguments);
}
function fromEvent(target, name) {
  if ("on" in target && "off" in target) {
    return create(_fromEventPattern(function (h) {
      return target.on(name, h);
    }, function (h) {
      return target.off(name, h);
    }), "fromEvent", arguments);
  } else if ("addListener" in target && "removeListener" in target) {
    return create(_fromEventPattern(function (h) {
      return target.addListener(name, h);
    }, function (h) {
      return target.removeListener(name, h);
    }), "fromEvent", arguments);
  } else if ("addEventListener" in target) {
    return create(_fromEventPattern(function (h) {
      return target.addEventListener(name, h);
    }, function (h) {
      return target.removeEventListener(name, h);
    }), "fromEvent", arguments);
  } else throw 'target is not a EventDispachter';
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
function fromReader(source) {
  var _this = this;
  var _read = function read(sink) {
    return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var _yield$source$read, done, value;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!sink.disposed) {
              _context.next = 2;
              break;
            }
            return _context.abrupt("return");
          case 2:
            _context.next = 4;
            return source.read();
          case 4:
            _yield$source$read = _context.sent;
            done = _yield$source$read.done;
            value = _yield$source$read.value;
            if (!done) {
              _context.next = 12;
              break;
            }
            sink.complete();
            return _context.abrupt("return");
          case 12:
            sink.next(value);
            _read(sink);
          case 14:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
  };
  return create(function (sink) {
    _read(sink);
  }, "fromReader", arguments);
}
function fromReadableStream(source) {
  return create(function (sink) {
    var controller = new AbortController();
    var signal = controller.signal;
    //@ts-ignore
    sink.defer(function () {
      return controller.abort('cancelled');
    });
    source.pipeTo(new WritableStream({
      write: function write(chunk) {
        sink.next(chunk);
      },
      close: function close() {
        sink.complete();
      },
      abort: function abort(err) {
        sink.error(err);
      }
    }), {
      signal: signal
    }).then(function () {
      return sink.complete();
    }, function (err) {
      return sink.error(err);
    });
  }, "fromReadableStream", arguments);
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
    while (pos < end && !sink.disposed) sink.next(pos++);
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

var Reduce = /*#__PURE__*/function (_Sink) {
  function Reduce(sink, f, seed) {
    var _this;
    _classCallCheck(this, Reduce);
    _this = _callSuper(this, Reduce, [sink]);
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
  _inherits(Reduce, _Sink);
  return _createClass(Reduce, [{
    key: "next",
    value: function next(data) {
      this.acc = this.f(this.acc, data);
    }
  }]);
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

var Filter = /*#__PURE__*/function (_Sink) {
  function Filter(sink, filter, thisArg) {
    var _this;
    _classCallCheck(this, Filter);
    _this = _callSuper(this, Filter, [sink]);
    _this.filter = filter;
    _this.thisArg = thisArg;
    return _this;
  }
  _inherits(Filter, _Sink);
  return _createClass(Filter, [{
    key: "next",
    value: function next(data) {
      if (this.filter.call(this.thisArg, data)) {
        this.sink.next(data);
      }
    }
  }]);
}(Sink);
var filter = deliver(Filter, "filter");
var Ignore = /*#__PURE__*/function (_Sink2) {
  function Ignore() {
    _classCallCheck(this, Ignore);
    return _callSuper(this, Ignore, arguments);
  }
  _inherits(Ignore, _Sink2);
  return _createClass(Ignore, [{
    key: "next",
    value: function next(_data) {}
  }]);
}(Sink);
var ignoreElements = deliver(Ignore, "ignoreElements");
var Take = /*#__PURE__*/function (_Sink3) {
  function Take(sink, count) {
    var _this2;
    _classCallCheck(this, Take);
    _this2 = _callSuper(this, Take, [sink]);
    _this2.count = count;
    return _this2;
  }
  _inherits(Take, _Sink3);
  return _createClass(Take, [{
    key: "next",
    value: function next(data) {
      this.sink.next(data);
      if (--this.count === 0) {
        this.complete();
      }
    }
  }]);
}(Sink);
var take = deliver(Take, "take");
var TakeUntil = /*#__PURE__*/function (_Sink4) {
  function TakeUntil(sink, control) {
    var _this3;
    _classCallCheck(this, TakeUntil);
    _this3 = _callSuper(this, TakeUntil, [sink]);
    var _takeUntil = new Sink(sink);
    _takeUntil.next = function () {
      return sink.complete();
    };
    _takeUntil.complete = dispose;
    _takeUntil.subscribe(control);
    return _this3;
  }
  _inherits(TakeUntil, _Sink4);
  return _createClass(TakeUntil);
}(Sink);
var takeUntil = deliver(TakeUntil, "takeUntil");
var TakeWhile = /*#__PURE__*/function (_Sink5) {
  function TakeWhile(sink, f) {
    var _this4;
    _classCallCheck(this, TakeWhile);
    _this4 = _callSuper(this, TakeWhile, [sink]);
    _this4.f = f;
    return _this4;
  }
  _inherits(TakeWhile, _Sink5);
  return _createClass(TakeWhile, [{
    key: "next",
    value: function next(data) {
      if (this.f(data)) {
        this.sink.next(data);
      } else {
        this.complete();
      }
    }
  }]);
}(Sink);
var takeWhile = deliver(TakeWhile, "takeWhile");
var takeLast = function takeLast(count) {
  return reduce(function (buffer, d) {
    buffer.push(d);
    if (buffer.length > count) buffer.shift();
    return buffer;
  }, []);
};
var Skip = /*#__PURE__*/function (_Sink6) {
  function Skip(sink, count) {
    var _this5;
    _classCallCheck(this, Skip);
    _this5 = _callSuper(this, Skip, [sink]);
    _this5.count = count;
    return _this5;
  }
  _inherits(Skip, _Sink6);
  return _createClass(Skip, [{
    key: "next",
    value: function next(_data) {
      if (--this.count === 0) {
        this.next = _superPropGet(Skip, "next", this, 1);
      }
    }
  }]);
}(Sink);
var skip = deliver(Skip, "skip");
var SkipUntil = /*#__PURE__*/function (_Sink7) {
  function SkipUntil(sink, control) {
    var _this6;
    _classCallCheck(this, SkipUntil);
    _this6 = _callSuper(this, SkipUntil, [sink]);
    sink.next = nothing;
    var _skipUntil = new Sink(sink);
    _skipUntil.next = function () {
      _skipUntil.dispose();
      sink.resetNext();
    };
    _skipUntil.complete = dispose;
    _skipUntil.subscribe(control);
    return _this6;
  }
  _inherits(SkipUntil, _Sink7);
  return _createClass(SkipUntil);
}(Sink);
var skipUntil = deliver(SkipUntil, "skipUntil");
var SkipWhile = /*#__PURE__*/function (_Sink8) {
  function SkipWhile(sink, f) {
    var _this7;
    _classCallCheck(this, SkipWhile);
    _this7 = _callSuper(this, SkipWhile, [sink]);
    _this7.f = f;
    return _this7;
  }
  _inherits(SkipWhile, _Sink8);
  return _createClass(SkipWhile, [{
    key: "next",
    value: function next(data) {
      if (!this.f(data)) {
        this.next = _superPropGet(SkipWhile, "next", this, 1);
        this.next(data);
      }
    }
  }]);
}(Sink);
var skipWhile = deliver(SkipWhile, "skipWhile");
var defaultThrottleConfig = {
  leading: true,
  trailing: false
};
var _Throttle = /*#__PURE__*/function (_Sink9) {
  function _Throttle(sink, durationSelector, trailing) {
    var _this8;
    _classCallCheck(this, _Throttle);
    _this8 = _callSuper(this, _Throttle, [sink]);
    _this8.durationSelector = durationSelector;
    _this8.trailing = trailing;
    return _this8;
  }
  _inherits(_Throttle, _Sink9);
  return _createClass(_Throttle, [{
    key: "cacheValue",
    value: function cacheValue(value) {
      this.last = value;
      if (this.disposed) this.throttle(value);
    }
  }, {
    key: "send",
    value: function send(data) {
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
}(Sink);
var Throttle = /*#__PURE__*/function (_Sink10) {
  function Throttle(sink, durationSelector) {
    var _this9;
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultThrottleConfig;
    _classCallCheck(this, Throttle);
    _this9 = _callSuper(this, Throttle, [sink]);
    _this9.durationSelector = durationSelector;
    _this9.config = config;
    _this9._throttle = new _Throttle(_this9.sink, _this9.durationSelector, _this9.config.trailing);
    _this9._throttle.dispose();
    return _this9;
  }
  _inherits(Throttle, _Sink10);
  return _createClass(Throttle, [{
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
      _superPropGet(Throttle, "complete", this, 3)([]);
    }
  }]);
}(Sink);
var throttle = deliver(Throttle, "throttle");
var defaultAuditConfig = {
  leading: false,
  trailing: true
};
var audit = function audit(durationSelector) {
  return deliver(Throttle, "audit")(durationSelector, defaultAuditConfig);
};
var _Debounce = /*#__PURE__*/function (_Sink11) {
  function _Debounce() {
    _classCallCheck(this, _Debounce);
    return _callSuper(this, _Debounce, arguments);
  }
  _inherits(_Debounce, _Sink11);
  return _createClass(_Debounce, [{
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
}(Sink);
var Debounce = /*#__PURE__*/function (_Sink12) {
  function Debounce(sink, durationSelector) {
    var _this10;
    _classCallCheck(this, Debounce);
    _this10 = _callSuper(this, Debounce, [sink]);
    _this10.durationSelector = durationSelector;
    _this10._debounce = new _Debounce(_this10.sink);
    _this10._debounce.dispose();
    return _this10;
  }
  _inherits(Debounce, _Sink12);
  return _createClass(Debounce, [{
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
      _superPropGet(Debounce, "complete", this, 3)([]);
    }
  }]);
}(Sink);
var debounce = deliver(Debounce, "debounce");
var debounceTime = function debounceTime(period) {
  return deliver(Debounce, "debounceTime")(function (_d) {
    return timer(period);
  });
};
var ElementAt = /*#__PURE__*/function (_Sink13) {
  function ElementAt(sink, count, defaultValue) {
    var _this11;
    _classCallCheck(this, ElementAt);
    _this11 = _callSuper(this, ElementAt, [sink]);
    _this11.count = count;
    _this11.defaultValue = defaultValue;
    return _this11;
  }
  _inherits(ElementAt, _Sink13);
  return _createClass(ElementAt, [{
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
      _superPropGet(ElementAt, "complete", this, 3)([]);
    }
  }]);
}(Sink);
var elementAt = deliver(ElementAt, "elementAt");
var find = function find(f) {
  return function (source) {
    return take(1)(skipWhile(function (d) {
      return !f(d);
    })(source));
  };
};
var FindIndex = /*#__PURE__*/function (_Sink14) {
  function FindIndex(sink, f) {
    var _this12;
    _classCallCheck(this, FindIndex);
    _this12 = _callSuper(this, FindIndex, [sink]);
    _this12.f = f;
    _this12.i = 0;
    return _this12;
  }
  _inherits(FindIndex, _Sink14);
  return _createClass(FindIndex, [{
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
}(Sink);
var findIndex = deliver(FindIndex, "findIndex");
var First = /*#__PURE__*/function (_Sink15) {
  function First(sink, f, defaultValue) {
    var _this13;
    _classCallCheck(this, First);
    _this13 = _callSuper(this, First, [sink]);
    _this13.f = f;
    _this13.defaultValue = defaultValue;
    _this13.index = 0;
    return _this13;
  }
  _inherits(First, _Sink15);
  return _createClass(First, [{
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
      _superPropGet(First, "complete", this, 3)([]);
    }
  }]);
}(Sink);
var first = deliver(First, "first");
var Last = /*#__PURE__*/function (_Sink16) {
  function Last(sink, f, defaultValue) {
    var _this14;
    _classCallCheck(this, Last);
    _this14 = _callSuper(this, Last, [sink]);
    _this14.f = f;
    _this14.defaultValue = defaultValue;
    _this14.index = 0;
    return _this14;
  }
  _inherits(Last, _Sink16);
  return _createClass(Last, [{
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
      _superPropGet(Last, "complete", this, 3)([]);
    }
  }]);
}(Sink);
var last = deliver(Last, 'last');
var Every = /*#__PURE__*/function (_Sink17) {
  function Every(sink, predicate) {
    var _this15;
    _classCallCheck(this, Every);
    _this15 = _callSuper(this, Every, [sink]);
    _this15.predicate = predicate;
    _this15.index = 0;
    return _this15;
  }
  _inherits(Every, _Sink17);
  return _createClass(Every, [{
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
      _superPropGet(Every, "complete", this, 3)([]);
    }
  }]);
}(Sink);
var every = deliver(Every, "every");

var Scan = /*#__PURE__*/function (_Sink) {
  function Scan(sink, f, seed) {
    var _this;
    _classCallCheck(this, Scan);
    _this = _callSuper(this, Scan, [sink]);
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
  _inherits(Scan, _Sink);
  return _createClass(Scan, [{
    key: "next",
    value: function next(data) {
      this.sink.next(this.acc = this.f(this.acc, data));
    }
  }]);
}(Sink);
var scan = deliver(Scan, "scan");
var Pairwise = /*#__PURE__*/function (_Sink2) {
  function Pairwise() {
    var _this2;
    _classCallCheck(this, Pairwise);
    _this2 = _callSuper(this, Pairwise, arguments);
    _this2.hasLast = false;
    return _this2;
  }
  _inherits(Pairwise, _Sink2);
  return _createClass(Pairwise, [{
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
}(Sink);
var pairwise = deliver(Pairwise, "pairwise");
var MapObserver = /*#__PURE__*/function (_Sink3) {
  function MapObserver(sink, mapper, thisArg) {
    var _this3;
    _classCallCheck(this, MapObserver);
    _this3 = _callSuper(this, MapObserver, [sink]);
    _this3.mapper = mapper;
    _this3.thisArg = thisArg;
    return _this3;
  }
  _inherits(MapObserver, _Sink3);
  return _createClass(MapObserver, [{
    key: "next",
    value: function next(data) {
      _superPropGet(MapObserver, "next", this, 3)([this.mapper.call(this.thisArg, data)]);
    }
  }]);
}(Sink);
var map = deliver(MapObserver, "map");
var mapTo = function mapTo(target) {
  return deliver(MapObserver, "mapTo")(function (_x) {
    return target;
  });
};
var InnerSink = /*#__PURE__*/function (_Sink4) {
  function InnerSink(sink, data, context) {
    var _this4;
    _classCallCheck(this, InnerSink);
    _this4 = _callSuper(this, InnerSink, [sink]);
    _this4.data = data;
    _this4.context = context;
    return _this4;
  }
  _inherits(InnerSink, _Sink4);
  return _createClass(InnerSink, [{
    key: "next",
    value: function next(data) {
      var combineResults = this.context.combineResults;
      if (combineResults) {
        this.sink.next(combineResults(this.data, data));
      } else {
        this.sink.next(data);
      }
    }
    // 如果complete先于context的complete触发，则激活原始的context的complete
  }, {
    key: "tryComplete",
    value: function tryComplete() {
      this.context.resetComplete();
      this.dispose();
    }
  }]);
}(Sink);
var Maps = /*#__PURE__*/function (_Sink5) {
  function Maps(sink, makeSource, combineResults) {
    var _this5;
    _classCallCheck(this, Maps);
    _this5 = _callSuper(this, Maps, [sink]);
    _this5.makeSource = makeSource;
    _this5.combineResults = combineResults;
    _this5.index = 0;
    return _this5;
  }
  _inherits(Maps, _Sink5);
  return _createClass(Maps, [{
    key: "subInner",
    value: function subInner(data, c) {
      var sink = this.currentSink = new c(this.sink, data, this);
      this.complete = this.tryComplete;
      sink.complete = sink.tryComplete;
      sink.subscribe(this.makeSource(data, this.index++));
    }
    // 如果complete先于inner的complete触发，则不传播complete
  }, {
    key: "tryComplete",
    value: function tryComplete() {
      // 如果tryComplete被调用，说明currentSink已经存在
      this.currentSink.resetComplete();
      this.dispose();
    }
  }]);
}(Sink);
var _SwitchMap = /*#__PURE__*/function (_InnerSink) {
  function _SwitchMap() {
    _classCallCheck(this, _SwitchMap);
    return _callSuper(this, _SwitchMap, arguments);
  }
  _inherits(_SwitchMap, _InnerSink);
  return _createClass(_SwitchMap);
}(InnerSink);
var SwitchMap = /*#__PURE__*/function (_Maps) {
  function SwitchMap() {
    _classCallCheck(this, SwitchMap);
    return _callSuper(this, SwitchMap, arguments);
  }
  _inherits(SwitchMap, _Maps);
  return _createClass(SwitchMap, [{
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
}(Maps);
var switchMap = deliver(SwitchMap, "switchMap");
function makeMapTo(f) {
  return function (innerSource, combineResults) {
    return f(function () {
      return innerSource;
    }, combineResults);
  };
}
var switchMapTo = makeMapTo(deliver(SwitchMap, "switchMapTo"));
var _ConcatMap = /*#__PURE__*/function (_InnerSink2) {
  function _ConcatMap() {
    _classCallCheck(this, _ConcatMap);
    return _callSuper(this, _ConcatMap, arguments);
  }
  _inherits(_ConcatMap, _InnerSink2);
  return _createClass(_ConcatMap, [{
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
}(InnerSink);
var ConcatMap = /*#__PURE__*/function (_Maps2) {
  function ConcatMap() {
    var _this7;
    _classCallCheck(this, ConcatMap);
    _this7 = _callSuper(this, ConcatMap, arguments);
    _this7.sources = [];
    _this7.next2 = _this7.sources.push.bind(_this7.sources);
    return _this7;
  }
  _inherits(ConcatMap, _Maps2);
  return _createClass(ConcatMap, [{
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
      if (this.sources.length === 0)
        // 最后一个innerSink，需要激活其真实的complete
        this.currentSink.resetComplete();
      this.dispose();
    }
  }]);
}(Maps);
var concatMap = deliver(ConcatMap, "concatMap");
var concatMapTo = makeMapTo(deliver(ConcatMap, "concatMapTo"));
var _MergeMap = /*#__PURE__*/function (_InnerSink3) {
  function _MergeMap() {
    _classCallCheck(this, _MergeMap);
    return _callSuper(this, _MergeMap, arguments);
  }
  _inherits(_MergeMap, _InnerSink3);
  return _createClass(_MergeMap, [{
    key: "tryComplete",
    value: function tryComplete() {
      this.context.inners.delete(this);
      _superPropGet(_MergeMap, "dispose", this, 3)([]);
      if (this.context.inners.size === 0) this.context.resetComplete();
    }
  }]);
}(InnerSink); // type __Maps<C> = C extends MapContext<infer T, infer U, infer R> ? C : never;
// type _Maps<C> = C extends InnerSink<infer T, infer U, infer R, infer> ? Maps<T, U, R, C> : never;
var MergeMap = /*#__PURE__*/function (_Maps3) {
  function MergeMap() {
    var _this8;
    _classCallCheck(this, MergeMap);
    _this8 = _callSuper(this, MergeMap, arguments);
    _this8.inners = new Set();
    return _this8;
  }
  _inherits(MergeMap, _Maps3);
  return _createClass(MergeMap, [{
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
}(Maps);
var mergeMap = deliver(MergeMap, "mergeMap");
var mergeMapTo = makeMapTo(deliver(MergeMap, "mergeMapTo"));
var _ExhaustMap = /*#__PURE__*/function (_InnerSink4) {
  function _ExhaustMap() {
    _classCallCheck(this, _ExhaustMap);
    return _callSuper(this, _ExhaustMap, arguments);
  }
  _inherits(_ExhaustMap, _InnerSink4);
  return _createClass(_ExhaustMap, [{
    key: "dispose",
    value: function dispose() {
      this.context.resetNext();
      _superPropGet(_ExhaustMap, "dispose", this, 3)([]);
    }
  }]);
}(InnerSink);
var ExhaustMap = /*#__PURE__*/function (_Maps4) {
  function ExhaustMap() {
    _classCallCheck(this, ExhaustMap);
    return _callSuper(this, ExhaustMap, arguments);
  }
  _inherits(ExhaustMap, _Maps4);
  return _createClass(ExhaustMap, [{
    key: "next",
    value: function next(data) {
      this.next = nothing;
      this.subInner(data, _ExhaustMap);
    }
  }]);
}(Maps);
var exhaustMap = deliver(ExhaustMap, "exhaustMap");
var exhaustMapTo = makeMapTo(deliver(ExhaustMap, "exhaustMapTo"));
var GroupBy = /*#__PURE__*/function (_Sink6) {
  function GroupBy(sink, f) {
    var _this9;
    _classCallCheck(this, GroupBy);
    _this9 = _callSuper(this, GroupBy, [sink]);
    _this9.f = f;
    _this9.groups = new Map();
    return _this9;
  }
  _inherits(GroupBy, _Sink6);
  return _createClass(GroupBy, [{
    key: "next",
    value: function next(data) {
      var key = this.f(data);
      var group = this.groups.get(key);
      if (typeof group === 'undefined') {
        group = subject();
        group.key = key;
        this.groups.set(key, group);
        _superPropGet(GroupBy, "next", this, 3)([group]);
      }
      group.next(data);
    }
  }, {
    key: "complete",
    value: function complete() {
      this.groups.forEach(function (group) {
        return group.complete();
      });
      _superPropGet(GroupBy, "complete", this, 3)([]);
    }
  }, {
    key: "error",
    value: function error(err) {
      this.groups.forEach(function (group) {
        return group.error(err);
      });
      _superPropGet(GroupBy, "error", this, 3)([err]);
    }
  }]);
}(Sink);
var groupBy = deliver(GroupBy, "groupBy");
var TimeInterval = /*#__PURE__*/function (_Sink7) {
  function TimeInterval() {
    var _this10;
    _classCallCheck(this, TimeInterval);
    _this10 = _callSuper(this, TimeInterval, arguments);
    _this10.start = new Date();
    return _this10;
  }
  _inherits(TimeInterval, _Sink7);
  return _createClass(TimeInterval, [{
    key: "next",
    value: function next(value) {
      this.sink.next({
        value: value,
        interval: Number(new Date()) - Number(this.start)
      });
      this.start = new Date();
    }
  }]);
}(Sink);
var timeInterval = deliver(TimeInterval, "timeInterval");
var BufferTime = /*#__PURE__*/function (_Sink8) {
  function BufferTime(sink, miniseconds) {
    var _this11;
    _classCallCheck(this, BufferTime);
    _this11 = _callSuper(this, BufferTime, [sink]);
    _this11.miniseconds = miniseconds;
    _this11.buffer = [];
    _this11.id = setInterval(function () {
      _this11.sink.next(_this11.buffer.concat());
      _this11.buffer.length = 0;
    }, _this11.miniseconds);
    return _this11;
  }
  _inherits(BufferTime, _Sink8);
  return _createClass(BufferTime, [{
    key: "next",
    value: function next(data) {
      this.buffer.push(data);
    }
  }, {
    key: "complete",
    value: function complete() {
      this.sink.next(this.buffer);
      _superPropGet(BufferTime, "complete", this, 3)([]);
    }
  }, {
    key: "dispose",
    value: function dispose() {
      clearInterval(this.id);
      _superPropGet(BufferTime, "dispose", this, 3)([]);
    }
  }]);
}(Sink);
var bufferTime = deliver(BufferTime, "bufferTime");
var Delay = /*#__PURE__*/function (_Sink9) {
  function Delay(sink, delay) {
    var _this12;
    _classCallCheck(this, Delay);
    _this12 = _callSuper(this, Delay, [sink]);
    _this12.buffer = [];
    _this12.delayTime = delay;
    return _this12;
  }
  _inherits(Delay, _Sink9);
  return _createClass(Delay, [{
    key: "dispose",
    value: function dispose() {
      clearTimeout(this.timeoutId);
      _superPropGet(Delay, "dispose", this, 3)([]);
    }
  }, {
    key: "delay",
    value: function delay(_delay) {
      var _this13 = this;
      this.timeoutId = setTimeout(function () {
        var d = _this13.buffer.shift();
        if (d) {
          var lastTime = d.time,
            data = d.data;
          _superPropGet(Delay, "next", _this13, 3)([data]);
          if (_this13.buffer.length) {
            _this13.delay(Number(_this13.buffer[0].time) - Number(lastTime));
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
      var _this14 = this;
      this.timeoutId = setTimeout(function () {
        return _superPropGet(Delay, "complete", _this14, 3)([]);
      }, this.delayTime);
    }
  }]);
}(Sink);
var delay = deliver(Delay, "delay");
var CatchError = /*#__PURE__*/function (_Sink10) {
  function CatchError(sink, selector) {
    var _this15;
    _classCallCheck(this, CatchError);
    _this15 = _callSuper(this, CatchError, [sink]);
    _this15.selector = selector;
    return _this15;
  }
  _inherits(CatchError, _Sink10);
  return _createClass(CatchError, [{
    key: "error",
    value: function error(err) {
      this.dispose();
      this.selector(err)(this.sink);
    }
  }]);
}(Sink);
var catchError = deliver(CatchError, "catchError");

var toPromise = function toPromise() {
  return function (source) {
    return new Promise(function (resolve, reject) {
      var value;
      new Subscribe(source, function (d) {
        return value = d;
      }, reject, function () {
        return resolve(value);
      });
    });
  };
};
var toReadableStream = function toReadableStream() {
  return function (source) {
    var subscriber;
    return new ReadableStream({
      start: function start(controller) {
        subscriber = new Subscribe(source, controller.enqueue.bind(controller), controller.error.bind(controller), controller.close.bind(controller));
      },
      cancel: function cancel() {
        subscriber.dispose();
      }
    });
  };
};
// //SUBSCRIBER
var subscribe = function subscribe() {
  var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : nothing;
  var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : nothing;
  var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : nothing;
  return function (source) {
    return new Subscribe(source, n, e, c);
  };
};
// // UTILITY
var Tap = /*#__PURE__*/function (_Sink) {
  function Tap(sink, ob) {
    var _this;
    _classCallCheck(this, Tap);
    _this = _callSuper(this, Tap, [sink]);
    if (ob instanceof Function) {
      _this.next = function (data) {
        ob(data);
        sink.next(data);
      };
    } else {
      if (ob.next) _this.next = function (data) {
        ob.next(data);
        sink.next(data);
      };
      if (ob.complete) _this.complete = function () {
        ob.complete();
        sink.complete();
      };
      if (ob.error) _this.error = function (err) {
        ob.error(err);
        sink.error(err);
      };
    }
    return _this;
  }
  _inherits(Tap, _Sink);
  return _createClass(Tap);
}(Sink);
var tap = deliver(Tap, "tap");
var Timeout = /*#__PURE__*/function (_Sink2) {
  function Timeout(sink, timeout) {
    var _this2;
    _classCallCheck(this, Timeout);
    _this2 = _callSuper(this, Timeout, [sink]);
    _this2.timeout = timeout;
    _this2.id = setTimeout(function () {
      return _this2.error(new TimeoutError(_this2.timeout));
    }, _this2.timeout);
    return _this2;
  }
  _inherits(Timeout, _Sink2);
  return _createClass(Timeout, [{
    key: "next",
    value: function next(data) {
      _superPropGet(Timeout, "next", this, 3)([data]);
      clearTimeout(this.id);
      this.next = _superPropGet(Timeout, "next", this, 1);
    }
  }, {
    key: "dispose",
    value: function dispose() {
      clearTimeout(this.id);
      _superPropGet(Timeout, "dispose", this, 3)([]);
    }
  }]);
}(Sink);
var timeout = deliver(Timeout, "timeout");
var retry = function retry() {
  var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Infinity;
  return function (source) {
    if (source instanceof Inspect) {
      var ob = create(function (observer) {
        var remain = count;
        var deliverSink = new Sink(observer);
        deliverSink.error = function (err) {
          if (remain-- > 0) {
            deliverSink.subscribe(source);
          } else {
            observer.error(err);
          }
        };
        deliverSink.sourceId = ob.id;
        deliverSink.subscribe(source);
      }, 'retry', [count]);
      ob.source = source;
      Events.pipe(ob);
      return ob;
    } else {
      return function (observer) {
        var remain = count;
        var deliverSink = new Sink(observer);
        deliverSink.error = function (err) {
          if (remain-- > 0) {
            source(deliverSink);
          } else {
            observer.error(err);
          }
        };
        source(deliverSink);
      };
    }
  };
};

exports.Events = Events;
exports.Inspect = Inspect;
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
exports.fromPromise = fromPromise;
exports.fromReadableStream = fromReadableStream;
exports.fromReader = fromReader;
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
exports.retry = retry;
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
exports.toReadableStream = toReadableStream;
exports.withLatestFrom = withLatestFrom;
exports.zip = zip;
//# sourceMappingURL=cjs.js.map
