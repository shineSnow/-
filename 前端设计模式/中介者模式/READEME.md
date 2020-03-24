### 中介者模式
中介者模式通过中介者对象封装一系列对象之间的交互,是对象之间不在相互引用,降低它们之间的耦合.有时中介者对象也可改变对象之间的交互.

### 中介者模式和观察者模式的区别

首先他们都是通过消息的收发机制实现的,不过在观察者模式中,一个对象既可以是消息的法发送者也可以是消息的接受者;他们之间信息交流依托于消息系统实现的解耦.而中介者模式中消息的发送方只有一个,就是中介者对象,而且中介者对象不能订阅消息,只有那些活跃对象(订阅者)才可以订阅中介者的消息.

1.创建中介者对象
   ```js
   //中介者对象
   var Mediator = function() {
     //消息对象
     var _msg = {};
     return {
       /***
        * 订阅消息方法
        * 参数 type     消息名称
        * 参数action    消息回调函数
        ***/
        register:function(type, action) {
          //如果消息存在
          if(_msg[type]) {
            //存入回调函数
            _msg[type].push(action)
          } else {
            //不存在, 则创建消息容器
            _msg[type] = [action]
          }
        },
        /***
         * 发布消息方法
         * 参数type 消息名称
        ***/
       send:function(type) {
         //如果消息已经被订阅
         if(_msg[type]) {
           //遍历已存储的消息回调函数
           for(var i = 0,len = _msg[type].length;i < len; i++) {
              //执行回调函数
              _msg[type][i] && _msg[type][i]()
           }
         }
       }

     }
   }

   //单元测试
   //订阅demo消息,只想回调函数--输出first
   Mediator.register('demo', function() {
     console.log('first')
   })
   Mediator.register('demo', function() {
     console.log('second')
   })
   //发布demo消息
   Mediator.send('demo')
   ```