### bind的原理以及实现

一句话将bind的原理:bind方法会创建一个函数.当这个函数在调用时,第一个参数将作为它运行时的this,之后的一序列参数将在将会在实参传入前传入作为它的参数.(mdn)

由此我们可以首先得出 bind 函数的两个特点：
1. 返回一个函数
2. 可以传入参数

关于指定 this 的指向，我们可以使用 call 或者 apply 实现
```
//模拟用例
var name = "小张",age=17;
var obj ={
    name:"小王",
    objAge = this.age,
    myFun:function(fm,t) {
        console.log(this.name+"年龄"+this.age,"来自"+fm+"去往"+t)
    }
}
var db = {
    name:"德玛",
    age:99
}
obj.myFun.call(db,'成都','上海')；　　　　 // 德玛 年龄 99  来自 成都去往上海
obj.myFun.apply(db,['成都','上海']);      // 德玛 年龄 99  来自 成都去往上海  
obj.myFun.bind(db,'成都','上海')();       // 德玛 年龄 99  来自 成都去往上海
obj.myFun.bind(db,['成都','上海'])();　　 // 德玛 年龄 99  来自 成都, 上海去往 undefined
```
### 第一版实现
```js
Function.prototype.bind = function(context) {
  var self = this;
  return function() {
    self.apply(context)
  }
}
```
### 传参的模拟实现
```js
//第二版实现

Function.prototype.bind = function(context) {
  var self = this;
  //获取bind2函数从第二个到最后一个参数
  var args = Array.prototype.slice.call(arguments,1);
  return function() {
    var bindArgs = Array.prototype.slice.call(arguments);
    self.apply(args.concat(bindArgs))
  }
}
```
### 构造函数效果的模拟实现

完成了这两点，最难的部分到啦！因为 bind 还有一个特点，就是
> 一个绑定函数也可以使用new操作符创建对象,这种行为就像把原函数当做构造器.提供的this也被忽略,同时调用时的参数被提供给模拟函数.

也就是说当 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传入的参数依然生效。举个例子：

注意：尽管在全局和 foo 中都声明了 value 值，最后依然返回了 undefind，说明绑定的 this 失效了，如果大家了解 new 的模拟实现，就会知道这个时候的 this 已经指向了 obj。

```js
//第三版实现
Function.prototype.bind2 = function(context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments,1)
  var fbound = function() {
    var bindArgs = Array.prototype.slice.call(arguments);
    //当作为构造函数时,this指向实例,self指向绑定函数,因为下面一句'fbound.prototype = this.prototype',已经修改fbound.prototype为绑定函数的prototype,此时结果为true.当结果为true时,this指向实例.
    //当作为普通函数时,this指向window,self指向绑定函数,此时结果为false,当结果为false的时候,this指向绑定的context

    self.apply(this instanceof self ? this : context,args.concat(bindArgs))
    // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承函数的原型中的值
  }

    fbound.prototype = this.prototype;
    return fbound;
}
```

### 构造函数效果的优化实现
但是在这个写法中，我们直接将 fbound.prototype = this.prototype，我们直接修改 fbound.prototype 的时候，也会直接修改函数的 prototype。这个时候，我们可以通过一个空函数来进行中转：

```js
Function.prototype.bind = function(context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments,1)
  var fNOP = function() {};
  var fbound = function() {
    var bindArgs = Array.prototype.slice(arguments);
    self.apply(this instanceof self ? this: context,args.concat(bindArgs));
  }

    fNOP.prototype = this.prototype;
    fbound.prototye = new fNOP();
    return fbound;
}
```

### 最终版的代码  
```js
Function.prototype.bind = function(context) {
  if(typeof this !== 'function') {
    throw new Errow("Function.prototype.bind - what is trying to be bound is not callable")
  }
  var self =this;
  var args = Array.prototype.slice.call(arguments,1);
  var fNOP = function() {};
  var fbound = function() {
    var bindArgs = Array.prototype.slice.call(arguments)
    self.apply(this instanceof self ? this : context, args.concat(bindArgs));
  }
  fNOP.prototype = this.prototype;
  fbound.prototype = new fNOP();
  return fbound;
}
```