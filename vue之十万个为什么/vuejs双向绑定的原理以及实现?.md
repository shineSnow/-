## vue实现数据双向绑定的原理?或者vue响应式原理?

响应式流程：
- 在init的时候会利用Object.defineProperty方法（不兼容 IE8）监听Vue实例的响应式数据的变化从而实现数据劫持能力（利用了 JavaScript 对象的访问器属性get和set，在未来的 Vue3 中会使用 ES6 的Proxy来优化响应式原理）。在初始化流程中的编译阶段，当render function被渲染的时候，会读取Vue实例中和视图相关的响应式数据，此时会触发getter函数进行依赖收集（将观察者Watcher对象存放到当前闭包的订阅者Dep的subs中），此时的数据劫持功能和观察者模式就实现了一个 MVVM 模式中的  Binder，之后就是正常的渲染和更新流程。

- 当数据发生变化或者视图导致的数据发生了变化时，会触发数据劫持的setter函数，setter会通知初始化依赖收集中的Dep中的和视图相应的Watcher，告知需要重新渲染视图，Wather就会再次通过update方法来更新视图。

可以发现只要视图中添加监听事件，自动变更对应的数据变化时，就可以实现数据和视图的双向绑定了。


最小化代码实现:
```js
class Watcher {
  update() {
    console.log('更新~');
  }
}
class Dep {
  constructor() {
    this._watchers = new Set();
  }
  add(watcher) {
    if(!this._watchers.has(watcher)) {
      this._watchers.add(watcher);
    }
  }
  notify() {
    this._watchers.forEach(watch => {
      watch.update();
    })
  }
}

Dep.target = new Watcher();

function observer(target) {
  if (typeof target === 'object' && target !== null) {
    Object.keys(target).forEach(key => {
      defineReactive(target, key, target[key]);
    })
  }
}
function defineReactive(target, key, val) {
  const dep = new Dep();
  if (typeof val === 'object' && val !== null) {
    observer(val);
  }
  Object.defineProperty(target, key, {
    get() {
      dep.add(Dep.target);
      return val;
    },
    set(newVal) {
      dep.notify();
      val = newVal;
    }
  })
}

```





#### vue响应式原理？  
   
 Vue的双向数据绑定原理是什么？

    答：vue.js 是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。

    具体步骤：

    第一步：需要observe的数据对象进行递归遍历，包括子属性对象的属性，都加上 setter和getter
    这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化

    第二步：compile解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图

    第三步：Watcher订阅者是Observer和Compile之间通信的桥梁，主要做的事情是:
    1、在自身实例化时往属性订阅器(dep)里面添加自己
    2、自身必须有一个update()方法
    3、待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。

    第四步：MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果。 

#### 参考
[深入理解Vue响应式原理](http://jungahuang.com/2018/02/07/About-responsive-of-Vue/#more)
[vue的双向绑定原理及实现](https://www.cnblogs.com/canfoo/p/6891868.html)

[vue双向绑定的实现](https://www.jianshu.com/p/f194619f6f26)
[vue双向绑定解释的很好](https://juejin.im/post/5bd027b0f265da0aba70f787)