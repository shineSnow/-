var count = 1;
var container = document.getElementById('container');

function getUserAction(e) {
  console.log(this)
  console.log(e)
  container.innerHTML = count++;
};

// function throttle(func, wait) {
//   var context, args;
//   var previous = 0;
//   return function() {
//     var now = +new Date();
//     context = this;
//     args = arguments;
//     if(now - previous > wait) {
//       func.apply(context,args);
//       previous = now;
//     }
//   }
// }

// function throttle(func, wait) {
//   var timeout, context, args;

//   return function () {
//     context = this;
//     args = arguments;
//     if (!timeout) {
//       timeout = setTimeout(function () {
//         timeout = null;
//         func.apply(context, args)
//       }, wait)
//     }
//   }
// }

function throttle(func, wait) {
  var timeout, context, args, result;
  var previous = 0;
  var later = function () {
    previous = +new Date();
    timeout = null;
    func.apply(context, args)
  }
  var throttled = function () {
    var now = +new Date();
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    // 如果没有剩余的时间了或者你改了系统时间
    if (previous <= 0 || remaining > wait) {
      if (timeout) {
        cleartimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args)
    } else if (!timeout) {
      timeout = setTimeout(later, wait)
    }

  }
  return throttled;
}

// container.onmousemove = getUserAction;
container.onmousemove = throttle(getUserAction, 1000);