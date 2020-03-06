var count = 1;
var container = document.getElementById('container');

function getUserAction(e) {
  console.log(this)
  console.log(e)
  container.innerHTML = count++;
};

function debounce(func, wait, immediate) {
  var timeout, result;
  return function () {
    var context = this;
    var args = arguments;
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      //如果已经执行过,就不在执行
      var callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait)
      if (callNow) result = func.apply(context, args)
    } else {
      timeout = setTimeout(function () {
        result = func.apply(context, args)
      }, wait)
    }
    return result;
  }
}

// container.onmousemove = getUserAction;
container.onmousemove = debounce(getUserAction,1000, true);