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