const { rx } = require('./index')
module.exports = {
    install(Vue, opt) {
        Vue.config
            .optionMergeStrategies
            .rxComputed = Vue.config.optionMergeStrategies.computed

        Vue.mixin(getRxComputedMixin(opt))
    }
}
function getRxComputedMixin(opt) {
    return {
        data() {
            return {
                _rxComputed: [],
                _rxSubjects: {},
            }
        },
        beforeCreate() {
            const rxComputed = this.$options.rxComputed || {}

            if (!Object.keys(rxComputed).length) return

            for (const key in rxComputed) {
                // const getter = getterFn(key, rxComputed[key])
                // this.$options.computed[prefix + key] = getter
            }

            this.$options.data = initDataWithRxComputed(this.$options, opt)
        },
        created() {
            const rxComputed = this.$options.rxComputed || {}
            for (const key in rxComputed) {
                const item = rxComputed[key]
                const keys = key.split(',')
                const setFunc = keys.length > 1 ? data => keys.forEach(k => this[k] = data[k]) : data => this[key] = data
                if (typeof item == 'function') {
                    const ob = item(this)
                    this.$data._rxComputed.push(ob.subscribe(setFunc))
                } else {
                    const subject = this.$data._rxSubjects[key]
                    this.$data._rxComputed.push(item.get(subject).subscribe(item.call ? data => this[key](data) : setFunc))
                    if ('watch' in item) {
                        if (typeof item.watch == 'object') {
                            for (const name in item.watch) {
                                this.$watch(name, v => subject.next(v), item.watch[name])
                            }
                        } else
                            this.$watch(item.watch, v => subject.next(v))
                    }
                }
            }
        },
        destroyed() {
            this.$data._rxComputed.forEach(d => d.dispose())
        }
    }
}
function initDataWithRxComputed(options, pluginOptions) {
    const optionData = options.data
    const rxComputed = options.rxComputed || {}

    return function vueAsyncComputedInjectedDataFn(vm) {
        const data = ((typeof optionData === 'function')
            ? optionData.call(this, vm)
            : optionData) || {}
        for (const key in rxComputed) {
            const item = this.$options.rxComputed[key]

            var value = generateDefault.call(this, item, pluginOptions)
            // if (isComputedLazy(item)) {
            //     initLazy(data, key, value)
            //     this.$options.computed[key] = makeLazyComputed(key)
            // } else {
            //     data[key] = value
            // }
            data[key] = value
            if (typeof item == 'object') {
                data._rxSubjects[key] = rx.subject()
                if ('handler' in item) {
                    data[item.handler] = function (e) {
                        data._rxSubjects[key].next(e)
                    }
                }
            }
        }
        return data
    }
}
function generateDefault(fn, pluginOptions) {
    let defaultValue = null

    if ('default' in fn) {
        defaultValue = fn.default
    } else if ('default' in pluginOptions) {
        defaultValue = pluginOptions.default
    }

    if (typeof defaultValue === 'function') {
        return defaultValue.call(this)
    } else {
        return defaultValue
    }
}
// module.exports = {
//     install(Vue, opt) {
//         function render(h) {
//             return h()
//         }
//         Vue.component('Pipe', {
//             functional: true,
//             render(h, ctx) {
//                 console.log(ctx.children)
//                 return h()
//             }
//         })
//         Vue.component('Observable', {
//             render
//         })
//         Vue.component('Subject', {
//             props: ['source'],
//             data() {
//                 return {
//                     value
//                 }
//             },
//             created() {
//                 this.value = rx.subject(this.source)
//             },
//             render
//         })
//         Vue.component('Subscriber', {
//             props: ['source', 'enabled'],
//             data() {
//                 return {
//                     disposble: null
//                 }
//             },
//             created() {
//                 this.$watch('enabled', v => {
//                     if (!v) {
//                         if (this.disposble) this.disposble.dispose()
//                         this.disposble = null
//                     } else {
//                         this.disposble = this.source.subscribe(d => this.$emit('next', d), e => e ? this.$emit('error', e) : this.$emit('complete'))
//                     }
//                 }, {
//                         immediate: true
//                     })
//             },
//             distroyed() {
//                 if (this.disposble) this.disposble.dispose()
//             },
//             render
//         })
//     }
// }