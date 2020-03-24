### 防抖的原理以及实现

在前端开发中会遇到一些频繁的事件触发，比如：

1. window 的 resize、scroll
2. mousedown、mousemove
3. keyup、keydown
……
为此，我们举个示例代码来了解事件如何频繁的触发：

一句话介绍防抖: 

>防抖的原理就是：你尽管触发事件，但是我一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行，真是任性呐!

#### 实现
```js
//第一版代码
function debounce(fn, wait) {
  var timeout;
  return function() {
    clearTimeout(timeout)
    timeout = setTimeout(fn, wait)
  }
}

container.onmousemove = debounce(getUserAction, 1000);
```

现在随你怎么移动，反正你移动完 1000ms 内不再触发，我再执行事件。

顿时就从 165 次降低成了 1 次!

棒棒哒，我们接着完善它


#### this

如果我们在 getUserAction 函数中 console.log(this)，在不使用 debounce 函数的时候，this 的值为：
```js
<div id="container"></div>
```

但是如果使用我们的 debounce 函数，this 就会指向 Window 对象！

所以我们需要将 this 指向正确的对象。

我们修改下代码：
```js
function debounce(fnc, wait) {
  var timeout;
  return function() {
    var context = this;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      fnc.call(context)
    }, wait)
  }
}
```

#### event对象

如果我们不使用 debouce 函数，这里会打印 MouseEvent 对象，如图所示：

![image](https://user-gold-cdn.xitu.io/2017/6/2/f62b1f2fc84fabc0320e3d69825e2b66?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


但是在我们实现的 debounce 函数中，却只会打印 undefined!

```js
//第三版代码

function debounce (fuc, wait) {
  var timeout;
  return function() {
    var context = this;
    var args = arguments;
    clearTimeout(timeout)
    fnc.apply(context,args)
  }
}
```

#### 返回值
再注意一个小点，getUserAction 函数可能是有返回值的，所以我们也要返回函数的执行结果

```js
//第四版代码
function debounce(func, wait) {
  var timeout;
  return functio() {
    clearTimeout(timeout);
    var context = this;
    var args = arguments;
    timeout = setTimeout(function(){

      result = func.apply(conxtext,args)

    }, wait)
    return result;
  }
}
```

到此为止，我们修复了三个小问题：
1. this指向
2. events对象
3. 返回值
   

#### 立刻执行

我不希望非要等到事件停止触发后才执行，我希望立刻执行函数，然后等到停止触发n秒后，才可以重新触发执行。

```js
//第五版
function debounce(func, wait, immediate) {
  var timeout, result;
  return function() {
    var context = this;
    var args = arguments;
    if(timeout) clearTimeout(timeout);
    if(immediate) {
      //如果已经执行过,就不在执行
      var callNow = !timeout;
      timeout = setTimeout(function() {
        timeout = null;
      }, wait)
      if(callNow) result = func.apply(context, args)
    } else {
      timeout = setTimeout(function() {
        result = func.apply(context, args)
      }, wait)
    }
    return result;
  }
}
```