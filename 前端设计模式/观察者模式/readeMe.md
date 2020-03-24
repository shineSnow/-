###
观察者模式(Observer):又被成为发布-订阅模式或者消息机制,定义了一种依赖关系,解决了主体对象与观察者之间的功能耦合.

  首先我们需要把观察者创建出来,它有一个消息容器,和三个方法,分别是订阅消息方法,取消订阅消息方法,发送订阅消息的方法.

1.创建一个观察者
```js
//将观察者放在闭包中,当页面加载就立即执行

var Observer = (function(){
  //防止消息队列暴露而被篡改故将消息容器作为静态私有变量保存
  var __message = {};
  return {
    //注册消息接口
    regist:function(){},
    //发布消息接口
    fire:function(){},
    //移除消息接口
    remove:function(){}
  }
})()
```
2. 实现三个方法
  我们首先要实现消息注册方法,注册方法的作用是将订阅者注册的消息推入消息队列中,因此我们需要两个参数:消息类型以及相应的处理动作,在推入消息队列时如果此消息不存在则应该创建一个该消息类型并将消息放入消息队列中,如果此消息存在则应该将消息执行方法推入改消息对应的执行方法队列中,这么做的目的也是保证多个模块注册同一则消息时能顺利执行.

  ```js
  regist:function(type, fn) {
    //如果此消息不存在则应该创建一个该消息类型
    if(typeOf __message[type] === 'undefined'){
      //将动作推入到该消息对应的动作执行队列中
      __message[type] = [fn];
      //如果消息存在
    } else {
      //将动作方法推入该消息对应的动作执行序列中
      __message[type].push(fn)
    }
  }
  ```
  对于发布消息的方法,其功能是当观察者发布已给消息时将所有订阅者订阅的消息一次性执行.故应该接受两个参数,消息类型以及动作执行时需要的传递的参数.
  ```js
  fire: function(type,args) {
    //如果该消息没有被注册,则返回
    if(!__message[type]) return;
    //定义消息信息
    var events = {
      type: type,
      args: args|| {}
    },
    i = 0,
    len = __message[type].length;
    //遍历消息动作
    for(; i< len;i++) {
      //依次执行注册的消息对象序列
      __message[type][i] && __message[type][i].call(this, events)
    }
  }
  ```
  最后是消息注销方法,其功能是将订阅者注销的消息从消息队列中清除,因此我们也需要两个参数,即消息类型以及执行的某一动作.

  ```js
  remove:function(type,fn) {
    //如果消息队列存在
    if(__message[type] instanceof Array) {
      //从最后一个消息动作遍历
      var i = __message[type].length - 1;
      for(; i >= 0 ;i--) {
        //如果存在该动作则在消息动作序列中移除相应的操作
        __message[type][i] === fn && __message[type].splice(i, 1);
      }
    }
  }
  ```

  单元测试
  ```js
  //注册消息
  Observer.regist('test', function(e) {
    console.log(e.type, e.args.msg)
  })
  //发布消息
  Observer.fire('test',{msg:'参数传递'})
  ```

