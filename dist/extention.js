'use strict';

require('core-js/modules/es.function.name');
require('regenerator-runtime/runtime');

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var _require = require('./common'),
    Sink = _require.Sink;

var _require2 = require('./index.js'),
    rx = _require2.rx,
    fromEventSource = _require2.fromEventSource;

exports.koaEventStream = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
    var sink, res, req;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            sink = new Sink();
            res = ctx.res, req = ctx.req;
            res.writeHead(200, {
              'Content-Type': 'text/event-stream',
              // <- Important headers
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
              'X-Accel-Buffering': 'no'
            });

            sink.next = function (data) {
              return res.write((typeof data == 'string' ? data : "data: " + JSON.stringify(data)) + "\n\n");
            };

            sink.complete = function (err) {
              return res.end();
            };

            sink.defer([clearInterval, null, setInterval(function () {
              return res.write(':keep-alive\n\n');
            }, 1000 * 30)]);
            _context.next = 8;
            return next();

          case 8:
            _context.t0 = _context.sent;
            (0, _context.t0)(sink);
            ctx.respond = false;
            req.on("close", function () {
              return sink.dispose();
            });

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.vueHookEvent = {
  install: function install(Vue, opt) {
    Vue.prototype.$fromEvent = function (name) {
      switch (name) {
        case "updated":
        case "beforeUpdate":
          return rx.fromVueEvent(this, "hook:" + name);

        case "beforeCreate":
        case "created":
        case "beforeMount":
        case "mounted":
        case "beforeDestroy":
        case "destroyed":
          return rx.fromVueEventOnce(this, "hook:" + name);

        default:
          return rx.fromVueEvent(this, name);
      }
    };
  }
};
exports.vueDirective = {
  install: function install(Vue, opt) {
    Vue.directive('rx', {
      bind: function bind(el, binding, vnode) {
        var name = binding.arg;

        for (var eventName in binding.modifiers) {
          binding.value[name + eventName] = rx.fromEvent(el, eventName);
        }
      }
    });
  }
};
/**
 * VUE EventSource Component
 * @description auto connect and close EventSource
 */

exports.vueEventSource = {
  install: function install(Vue) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    Vue.component(opt.id || 'EventSource', {
      name: opt.name || "EventSource",
      props: {
        src: {
          type: String,
          default: null,
          required: true
        },
        value: {
          type: Object
        },
        list: {
          type: Array,
          default: function _default() {
            return [];
          }
        },
        //use JSON.parse by default
        json: {
          type: Boolean,
          default: true
        },
        desc: {
          type: Boolean,
          default: true
        },
        //init fill the list use first incomeing array data
        init: {
          type: Boolean,
          default: true
        }
      },
      watch: {
        desc: function desc(v, o) {
          if (v != o) {
            this.list.reverse();
          }
        }
      },
      data: function data() {
        var _this = this;

        var srcChanged = null;
        var destroyed = null;
        rx(function (sink) {
          return srcChanged = sink;
        }).switchMap(fromEventSource).takeUntil(function (sink) {
          return destroyed = sink;
        }).subscribe(function (x) {
          if (_this.json) {
            var data = JSON.parse(x);

            if (_this.init && data instanceof Array) {
              if (_this.desc) {
                _this.list.unshift.apply(_this.list, data);
              } else {
                _this.list.push.apply(_this.list, data);
              }

              _this.$emit('update:list', _this.list);
            } else {
              _this.addData(data);
            }
          } else {
            _this.addData(x);
          }
        }, function (e) {
          return _this.$emit('error', e);
        });
        this.$watch('src', function (v) {
          return srcChanged.next(v);
        }, {
          immediate: true
        });
        return {
          destroyed: destroyed
        };
      },
      destroyed: function destroyed() {
        this.destroyed.next(this);
      },
      methods: {
        addData: function addData(data) {
          this.value = data;
          this.$emit('input', data);
          this.desc ? this.list.unshift(data) : this.list.push(data);
          this.$emit('update:list', this.list);
        }
      },
      render: function render(h) {
        if (typeof this.$scopedSlots.default == 'function') return this.$scopedSlots.default(this.list);else return h();
      }
    });
  }
};
//# sourceMappingURL=extention.js.map
