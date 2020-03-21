### 观察者模式和发布订阅模式的区别？

- 如果发布者直接触及到订阅者，就可以说明是观察者模式；
- 如果发布者不直接触及到订阅者，而是由第三方来完成实际的通信操作，就叫做发布-订阅模式
- 简单来说，它们就是解耦的程度不同，vue内的自定义事件的Event Emitter，发布者完全不用感知到订阅者，事件的注册和触发都发生在事件总线上，实现了完全的解耦。
- 而Dep和Watcher就是观察者模式，Dep直接add以及notify触发watcher的更新。
  
上代码.不过这个和我在书上看的叫法完全不一样,第一个是中介者模式?第二交观察者模式.
```js
观察者模式：
class Subject {
  constructor() {
    this.observers = [];
  }
  add(observer) {
    this.observers.push(observer);
  }
  remove(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }
  notify() {
    const obs = this.observers;
    for (let i = 0; i < obs.length; i++) {
      obs[i].update();
    }
  }
}
class Observer {
  constructor(name) {
    this.name = name;
  }
  update() {
    console.log('my name is' + this.name);
  }
}

发布订阅模式：
class Events {
  constructor() {
    this._evnets = Object.create(null);
  }
  
  on(event, fn) {  // 往事件中心添加事件
    if (Array.isArray(event)) {
      for (let i = 0; i < event.length; i++) {
        this.on(evnet[i], fn);
      }
    } else {
      (this._evnets[event] || (this._evnets[event] = [])).push(fn);
    }
  }
  
  emit(event, ...args) {  // 触发事件中心对应事件
    const cbs = this._evnets[event];
    if (cbs) {
      for (let i = 0; i < cbs.length; i++) {
        cbs[i].apply(this, args);
      }
    }
  }
  
  off(event, fn) {  // 移除事件
    if (!arguments) {
      this._evnets = Object.create(null);
      return this;
    }
    if (Array.isArray(event)) {
      for (let i = 0; i < event.length; i++) {
        this.off(event[i], fn);
      }
      return this;
    }
    if (!fn) {
      this._evnets[event] = null;
      return this;
    }
    const cbs = this._evnets[event];
    let i = cbs.length;
    while (i--) {
      const cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break;
      }
    }
    return this;
  }
  
  once(evnet, fn) {  // 只执行一次
    function on() {
      this.off(evnet, on);
      fn.apply(this, arguments);
    }
    on.fn = fn;
    this.on(evnet, on);
    return this;
  }
}

```