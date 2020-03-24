# 闭包  
今天学习一下闭包,一般了解一个事物的顺序是:what -> why-> how.但是我一般想了解闭包是干什么的.  
## 闭包是做什么用的?  
根据js函数作用域访问层次的限制,内一层的函数可以访问以上所有层的变量,但是外层的函数无法访问内层的函数的变量.但是有时候我们写程序确实需要访问函数内的变量,这怎么办呢?这时候就用上闭包了,使用闭包我们就可以在函数外部访问函数内部的变量,nice!  

## 闭包的是什么?  
```html
有权访问另一个函数的作用域内变量的函数都是闭包.
```  
## 闭包的用法  

先来看看闭包 例子:  
```js
function add(){
    var n = 0;
    function inc(){
       n++; 
       console.log(n);
    }
    return inc;
}
var c = add();
c();    //控制台输出1
c();    //控制台输出2
```  
下一个例子,有点函数函数柯里化的样子,(js的高级用法)  
```js
function makeAdder(x) {
    return function(y) {
        return x + y;
    }
var add5 = makeAdder(5);
var add5 = makeAdder(10);

console.log(add5(2)) //7
console.log(add5(2)) //12
```  

> 编程语言中，比如 Java，是支持将方法声明为私有的，即它们只能被同一个类中的其它方法所调用.

> 而 JavaScript 没有这种原生支持，但我们可以使用闭包来模拟私有方法。私有方法不仅仅有利于限制对代码的访问：还提供了管理全局命名空间的强大能力，避免非核心的方法弄乱了代码的公共接口部分。

下面的示例展现了如何使用闭包来定义公共函数，并令其可以访问私有函数和变量,这个方法也被成为"模块模式"

```js
var Counter = (function() {
    var privateCounter = 0;
    function changeBy(val) {
         privateCounter += val;
    }
    
    return {
        increment:function(){
            changeBy(1)
        },
        decrement: function() {
          changeBy(-1);
        },
        value: function() {
          return privateCounter;
        }
    
    }

})()

console.log(Counter.value()); /* logs 0 */
Counter.increment();
Counter.increment();
console.log(Counter.value()); /* logs 2 */
Counter.decrement();
console.log(Counter.value()); /* logs 1 */

//如果要保持数据的独立性,可以分别创建不同的函数  

var Counter1 = Counter();
var Counter2 = Counter();
console.log(Counter1.value()); /* logs 0 */
Counter1.increment();
Counter1.increment();
console.log(Counter1.value()); /* logs 2 */
Counter1.decrement();
console.log(Counter1.value()); /* logs 1 */
console.log(Counter2.value()); /* logs 0 */
```  

该共享环境创建于一个立即执行的匿名函数体内。这个环境中包含两个私有项：名为 privateCounter 的变量和名为 changeBy 的函数。这两项都无法在这个匿名函数外部直接访问。必须通过匿名函数返回的三个公共函数访问。

这三个公共函数是共享同一个环境的闭包。多亏 JavaScript 的词法作用域，它们都可以访问 privateCounter 变量和 changeBy 函数。

在循环中创建闭包的常见的错误  
```js
function createFunctions(){
    var result = new Array();
    for (var i=0; i < 10; i++){
        result[i] = function(){
            return i;
        };
    }
    return result;
}
var funcs = createFunctions();
for (var i=0; i < funcs.length; i++){
    console.log(funcs[i]());
}

```  
第一次看一定会以为会按顺序输出0-9,可是真的会这样么?  
 running:
 
![闭包](https://github.com/shineSnow/academic/blob/master/img/bibao.jpg)

输入的是10个10,这就是年轻的代价.之所以这样的原因,其实是涉及到(es5及其以前)js没有块级作用域的问题所导致的问题,因为createFunctions里的循环一结束,i其实已经变为10存贮在内存中. 这个问题有两种解决办法,es6的let,es6实现了块级作用域,另一种就是闭包了.

最简单的let:  
```js
function createFunctions(){
    var result = new Array();
    for (let i=0; i < 10; i++){
        result[i] = function(){
            return i;
        };
    }
    return result;
}
var funcs = createFunctions();
for (var i=0; i < funcs.length; i++){
    console.log(funcs[i]());
}
```  
闭包的方法:  
```js
    function createFunctions(){
    var result = new Array();
    for (var i=0; i < 10; i++){
        (function(i){
            result[i] = function(){
            return i;
        };
        })(i)
    }
    return result;
}
var funcs = createFunctions();
for (var i=0; i < funcs.length; i++){
    console.log(funcs[i]());
}
```  



这次可以依次输出0-9,ok.

### 参考链接

[带你一分钟理解闭包--js面向对象编程](https://www.cnblogs.com/qieguo/p/5457040.html)