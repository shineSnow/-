### 数据的深浅拷贝

#### 浅拷贝
1. 手写浅拷贝函数

```js

 var obj1 = {
    'name' : 'zhangsan',
    'age' :  '18',
    'language' : [1,[2,3],[4,5]],
};
 var obj3 = shallowCopy(obj1);
 obj3.name = "lisi";
 obj3.language[1] = ["二","三"];
 function shallowCopy(src) {
   var res = {}
   for(var pop in src) {
     if(src.hasOwnProperty(pop)) {
       res[pop] = src[pop]
     }
   }
   return res;
}
console.log('obj1',obj1)
console.log('obj3',obj3)


//3.Array.prototype.concat()
//4.Array.prototype.slice()
```
2.Object.assign()



#### 深拷贝

1. JSON.parse(JSON.stringify())
原理： 用JSON.stringify将对象转成JSON字符串，再用JSON.parse()把字符串解析成对象，一去一来，新的对象产生了，而且对象会开辟新的栈，实现深拷贝。
这种方法虽然可以实现数组或对象深拷贝,但不能处理函数

2. 手写递归实现
递归方法实现深度克隆原理：遍历对象、数组直到里边都是基本数据类型，然后再去复制，就是深度拷贝
```js
function deepClone(target) {
  if(typeof target === 'object' && target !== null) {
    var result = Array.isArray(target) ? [] : {};
    for (let key of target) {
      let val = target[key]
      if(typeof val === 'object') {
        deepClone(val)
      } else {
        result[key] = val
      }
    }
    return result;
  }
}




```



















### 参考

[js 深拷贝 vs 浅拷贝](https://juejin.im/post/59ac1c4ef265da248e75892b)