#rx4rx-fast
the fast rxjs implemention

#install

```bash
npm i fastrx
```

#usage

```js
import { rx } from 'fastrx';

rx.of(1,2,3).filter(x=>x<2).subscribe(console.log)
```

or

```js
import {pipe,fromArray,filter,subscribe} from 'fastrx';
pipe(fromArray([1,2,3]), filter(x=>x<2), subscribe(console.log))
```


dataflow for 1000000 source events
-----------------------------------------------

| lib   |      op/s      |  samples |
|----------|:-------------:|------:|
|rx4rx-lite  | 11.29 op/s ±  1.47%  | (56 samples)
|rx4rx-fast  | 22.56 op/s ±  1.77%  | (57 samples)
|cb-basics   |  9.56 op/s ±  1.73%  | (49 samples)
|xstream     | 5.37 op/s ±  0.68%   | (30 samples)
|most        | 17.32 op/s ±  1.93%  | (82 samples)
|rx 6        |  6.28 op/s ±  3.10%  | (35 samples)
-----------------------------------------------

#extensible

## Observable.create way

```js
import { rx } from 'fastrx';
const myObservable = rx(sink=>{
    sink.next('data')
    sink.complete()
})
myObservable.subscribe(console.log)
```
or

```js
import {pipe,subscribe} from 'fastrx';
const myObservable = ()=>sink=>{
    sink.next('data')
    sink.complete()
}
pipe(myObservable(), subscribe(console.log))
```

## add to library
```js
import { rx } from 'fastrx';
rx.myObservable = (args) => sink => {
    const id = setTimeout(()=>{
        sink.next(args)
        sink.complete()
    })
    sink.defer([clearTimeout,null,id])
    //or sink.defer(()=>clearTimeout(id))
}
```
then you can use your observable anywhere

```js
import { rx} from 'fastrx';
rx.myObservable('something').subscribe(console.log)
```
or

```js
import {pipe,myObservable} from 'fastrx';
pipe(myObservable('something'), subscribe(console.log))
```

## vue2.0 usage
```js
import { rx } from "fastrx";
import RxComputed from "fastrx/vue";
Vue.use(RxComputed);

```
```html
<template>
    <div @click="onClick1" :style="{top:y+'px',left:x+'px'}">
        <span>{{test1}}</span>
        <span>{{test0}}</span>
    </div>
</template>
<script>
import {rx} from 'fastrx'
export default {
   rxComputed:{
       test0:_this=>rx.interval(1000).take(10),//简单的订阅
       test_watch:{//使用watch触发Observable发射数据
           get:ob=>ob.switchMapTo(rx.interval(1000)).map(x=>10-x)
           watch:"test1"
       },
       test1:{//使用设置方法的方式触发，可以提供给事件回调
           get:ob=>ob.switchMap(rx.timer(1000)),
           handler:"onClick1"
       },
       test2:{
           call:true,//调用test2方法而不是设置属性
           get:ob=>ob.switchMap(e=>rx.timer(1000).map(()=>e)),
           handler:"onClick1"
       },
       "x,y":{//采用解构，将结果对象中的x,y属性分别写入vue实例中的x和y属性
            get:ob=>ob.switchMap(e=>rx.timer(1000).map(()=>({x:e.screenX,y:e.screenY}))),
           handler:"onClick1",
           default:{x:0,y:0}//设置默认值
        }
   },
   methods:{
       test2(e){
           console.log(e)
       }
   }
}
</script>
```

## vue3.0 usage
```html
<template>
    <div @click="handler"></div>
</template>
<script>
import {rx} from 'fastrx'
import {onUnmounted} from 'vue'
export default {
    setup(){
        const ob = rx.eventHandler()
        ob.switchMapTo(rx.interval(1000)).takeUntil(rx.fromLifeHook(onUnmounted)).subscribe(()=>{
            
        })
        return {handler:ob.handler}
    }
}
</script>
```