# 命令模式
**命令模式** :就是将请求与实现解耦并封装成独立对象,从而使不同的请求对客户端的实现参数化.

-- 命令模式是将创建模块的逻辑封装在一个对象里,这个对象提供一个参数化的请求接口,通过调用这个接口并传递一个参数实现调用命令对象内部中的一些方法.

```js
//绘图命令
//使用canvs绘图会需要经常调用canvs绘画的上下文应用,如果多个人开发,其中有一个人不小心篡改了canvas元素上下文的引用,那么结果就会很糟糕,我们通常的做法是将上下文引用对象安全地封装在一个命令对象的内部,如果他人想绘图,直接通过命令对象书写一条命令,即可调用命令对象内部封装的方法来完成需求任务.
//实现对象
var CanvasCommand = (function
  //获取canvas
  var canvas = document.getElementById('canvas')
  //canvas元素的上下文引用对象缓存在命令对象的内部
  ctx = canvas.getContext('2d')
  //内部方法
  var Action = {
    //填充色彩
    fillStyle:function(c) {
      ctx.fillStyle = c
    },
    //填充矩形
    fillRect:function(x,y,width,height) {
      ctx.fillRect(x,y,width,height)
    },
    //描边色彩
    strokeStyle:function(c) {
      ctx,strokeStyle = c
    },
    //描边矩形
    strokeRect:function(x,y,width,height) {
      ctx.strokeRect(x,y,width,height)
    },
    //填充字体
    fillText:function(text,x,y) {
      ctx.fillText(text,x,y)
    },
    //开启路径
    beginPath:function() {
      ctx.beginPath()
    },
    //移动画笔
    moveTo:function(x,y) {
      ctx.moveTo(x,y)
    },
    //画笔连线
    lineTo:function(x,y) {
      ctx.lineTo(x,y)
    },
    //绘制弧线
    arc:function(x,y,r,begin,end,dir) {
      ctx.arc(x,y,r,begin,end,dir)
    },
    //填充
    fill:function() {
      ctx.fill();
    },
    //描边
    stoke:function() {
      ctx.stoke()
    }
  }
  return {
    excute:function(msg) {
      //如果没有指令返回
      if(!msg)return;
      //如果指令是一个数组
      if(msg.length){
        //遍历执行对个命令
        for(var i=0,len=msg.length; i<len;i++) {
          argumens.callee(msg[i])
        }
      } else {
        mag.param = Object.prototype.toString.call(msg.param) === "[object Array]" ? mag.param : [msg.param];
        Action[msg.type].apply(Action,msg.param)
      }
    }
  }
))()
```