var Observer = (function() {
  var __message = {};
  return {
    regist:function(type, fn) {
      if(typeof __message[type] === 'undefined') {
        __message[type] = [fn]
      } else {
        __message[type].push(fn)
      }
    },
    fire:function(type,args) {
      if(!__message[type]) {
        return;
      }
      var events = {
        type:type,
        args:args|| {}
      },
      i= 0,
      len = __message[type].length;
      for(;i<len;i++) {
        __message[type][i].call(this, events)
      }
    },
    remove:function(type, fn) {
      //如果消息队列存在
      if(__message[type] instanceof Array) {
        //从最后一个消息队列遍历
        var i = __message[type].length - 1;
        for(;i >= 0; i--) {
          __message[type][i] === fn && __message[type].splice(i,1)
        }
      }

    }
  }
})()