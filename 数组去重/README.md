### 数组去重

#### 1.双层循环

```js
var arr = [1,1,'1','1',2,'2']
function unique(array) {
  var res = [];
  for(var i=0,arrayLen = array.length;i<arrayLen;i++) {
    for(var j=0,resLen = res.length; l< resLen; j++) {
      if(array[i] === res[j]) {
        break;
      }
    }
     //如果array[i]是唯一的，那么执行完循环，j等于resLen
     if(j === resLen) {
       res.push(array[i])
     }

  }
  return res;
}
```

#### indexof去重

```js

```