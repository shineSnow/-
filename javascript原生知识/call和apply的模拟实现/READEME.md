### call和apply的模拟实现

一句话介绍call:
    call()在使用一个指定的this值和若干个指定的参数的前提下调用某个方法或函数.

```js
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call(foo); // 1
```
注意两点：

call 改变了 this 的指向，指向到 foo
bar 函数执行了

#### 模拟实现的思想

那么我们该怎么模拟实现这两个效果呢？

试想当调用 call 的时候，把 foo 对象改造成如下：
```js
var foo = {
    value: 1,
    bar: function() {
        console.log(this.value)
    }
};

foo.bar(); // 1
```
这个时候 this 就指向了 foo，是不是很简单呢？

但是这样却给 foo 对象本身添加了一个属性，这可不行呐！

不过也不用担心，我们用 delete 再删除它不就好了~

所以我们模拟的步骤可以分为：

1. 将函数设为对象的属性
2. 执行该函数
3. 删除该函数
```js
// 第一步
foo.fn = bar
// 第二步
foo.fn()
// 第三步
delete foo.fn
```
#### 有了原理现在可以实现第一版call2:
```js
Function.prototype.call2 = function(context) {
  //首先要获取call的函数,用this可以获取
  context.fn = this;
  context.fn();
  delete context.fn;
}


// 测试一下
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call2(foo); // 1
```

### 实现第二版:可以传递参数

获取不定长的参数,arguments  

注意：传入的参数并不确定，这可咋办？

不急，我们可以从 Arguments 对象中取值，取出第二个到最后一个参数，然后放到一个数组里。

比如这样
```js
//arguments是类数组对象,所以可以使用for循环
var args = [];
for(var i = 1,len = arguments.length;i<len;i++) {
   args.push('arguments[' + i + ']');
}
//不定长的参数问题解决了，我们接着要把这个参数数组放到要执行的函数的参数里面去。
// 将数组里的元素作为多个参数放进函数的形参里
context.fn(args.join(','))
// (O_o)??
// 这个方法肯定是不行的啦！！！
```

也许有人想到用 ES6 的方法，不过 call 是 ES3 的方法，我们为了模拟实现一个 ES3 的方法，要用到ES6的方法，好像……，嗯，也可以啦。但是我们这次用 eval 方法拼成一个函数，类似于这样：
```js
eval('context.fn(' + args +')')
```
第二版的实现  
```js
Function.prototype.call2 = function(context) {
    context.fn = this;
    var args = [];
    for(var i =1,len = arguments.length;i < len;i++) {
        args.push('arguments[' + i + ']');
    }
    eval('context.fn('+args+')');
    delete context.fn
}
// 测试一下
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value);
}

bar.call2(foo, 'kevin', 18); 
// kevin
// 18
// 1

```

### 模拟实现第三版 2个注意点

1. this 参数可以传 null，当为 null 的时候，视为指向 window
```js

var value = 1;

function bar() {
    console.log(this.value);
}

bar.call(null); // 1
```
2. 函数是可以有返回值的
```js

var obj = {
    value: 1
}

function bar(name, age) {
    return {
        value: this.value,
        name: name,
        age: age
    }
}

console.log(bar.call(obj, 'kevin', 18));
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```

##### 最终版代码 
```js

Function.prototype.call2 = function(context) {
    var context = context || window;
    context.fn = this;
    var args = [];
    for(var i= 1, len= arguments.length;i<len;i++) {
        args.push('arguments('+i+')')
    }
    var result = eval('context.fn('+args+')')
    delete context.fn;
    return result;
}
// 测试一下
var value = 2;

var obj = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

bar.call(null); // 2

console.log(bar.call2(obj, 'kevin', 18));
// 1
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```

### apply的模拟实现
```js
Function.prototype.apply = function(context,arr) {
    var context = Object(context) || window;
    context.fn = this;
    var result = '';
    if(!arr) {
        result = context.fn()
    } else {
        var args = [];
        for(var i=0,len = arr.length;i< len;i++) {
            args.push('arr['+i+']')
        }
        result = eval('context.fn('+args+')')
    }
    delete context.fn;
    return result;
}
```