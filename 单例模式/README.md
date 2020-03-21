### 问：单例模式
- 只创建一次类的实例，其余情况都返回创建好的实例结果。例如vue里的插件，安装一次之后不会再次安装，直接返回之前已经实例化的结果。
  
> 实现Storage类，使得该对象为单例，基于localStorage进行封装。实现方法 setItem(key,value) 和 getItem(key)？

```js
静态方法版：
class Storage {
  static create() {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }
    return Storage.instance;
  }
  setItem(key, value) {
    return localStorage.setItem(key, value);
  }
  getItem(key, value) {
    return localStorage.getItem(key, value);
  }
}

闭包版：
function Storage() { }
Storage.prototype.setItem = function (key, value) {
  return localStorage.setItem(key, value);
}
Storage.prototype.getItem = function (key) {
  return localStorage.getItem(key, value);
}
const createStorage = (function () {
  let instance;
  return function () {
    if (!instance) {
      instance = new Storage();
    }
    return instance
  }
})()

```