# promise的原理解析以及实现

## Promise的实现

文章开头我们先点一下Promise为我们解决了什么问题：在传统的异步编程中，如果异步之间存在依赖关系，我们就需要通过层层嵌套回调来满足这种依赖，如果嵌套层数过多，可读性和可维护性都变得很差，产生所谓“回调地狱”，而Promise将回调嵌套改为链式调用，增加可读性和可维护性。下面我们就来一步步实现一个Promise：

### 1. 观察者模式

```js
const p1 = new Promise((resolve,reject) => {
  setTimeout(function(){
    resolve('result')
  },1000)
})
p1.then(res => console.log(res),err => console.log(errr))
```
博主的思考
观察这个例子，我们分析Promise的调用流程：
- Promise的构造方法接收一个executor()，在new Promise()时就立刻执行这个executor回调
- executor()内部的异步任务被放入宏/微任务队列，等待执行
- then()被执行，收集成功/失败回调，放入成功/失败队列
- executor()的异步任务被执行，触发resolve/reject，从成功/失败队列中取出回调依次执行

其实熟悉设计模式的同学，很容易就能意识到这是个观察者模式，这种收集依赖 -> 触发通知 -> 取出依赖执行 的方式，被广泛运用于观察者模式的实现，在Promise里，执行顺序是then收集依赖 -> 异步触发resolve -> resolve执行依赖。依此，我们可以勾勒出Promise的大致形状

实现 promise
```js
class MyPromise {
  //构造函数接受一个回调
  constructor(executor){
    this._resolveQueue = []// then收集的执行成功的回调队列
    this._rejectQueue = [] // then收集的执行失败的回调队列

    // 由于resolve/reject是在executor内部被调用, 因此需要使用箭头函数固定this指向, 否则找不到this._resolveQueue
    let _resolve = (val) => {
      // 从成功队列里取出回调依次执行
      while(this._resolveQueue.length) {
        const callback = this._resolveQueue.shift()
        callback(val)
      }
    }
    // reject 同理
    let _reject = (err) => {
      while(this._rejectQueue.length) {
        const callback = this._rejectQueue.shift()
        callback(err)
      }
    }
    executor(_resolve,_reject)
  }
  // then方法,接收一个成功的回调和一个失败的回调，并push进对应队列
  then(resolveFn,rejectFn) {
    this._resolveQueue.push(resolveFn)
    this._rejectQueue.push(rejectFn)
  }
}

```

测试
```js
const p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('result')
  }, 1000);
})
p1.then(res => console.log(res))
//一秒后输出result

```

我们运用观察者模式简单的实现了一下then和resolve，使我们能够在then方法的回调里取得异步操作的返回值，但我们这个Promise离最终实现还有很长的距离，下面我们来一步步补充这个Promise：



### 2. Promise A+规范

Promise/A+的规范比较长，这里只总结两条核心规则：

> - Promise本质是一个状态机，且状态只能为以下三种：Pending（等待态）、Fulfilled（执行态）、Rejected（拒绝态），状态的变更是单向的，只能从Pending -> Fulfilled 或 Pending -> Rejected，状态变更不可逆
> - then方法接收两个可选参数，分别对应状态改变时触发的回调。then方法返回一个promise。then 方法可以被同一个 promise 调用多次。

根据规范,补充代码:
```js
//Promise//A+规范的三种状态

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class  Mypromise{
  //构造方法接受一个回调
  constructor(executor) {
    this._status = PENDING   //promise的状态
    this._resolveQueue = []    //成功队列, resolve时触发
    this._rejectQueue = []  //失败队列, reject时触发
    // 由于resolve/reject是在executor内部被调用, 因此需要使用箭头函数固定this指向, 否则找不到this._resolveQueue
    let _resolve = (val) => {
      if(this._status !== PENDING) return // 对应规范中的"状态只能由pending到fulfilled或rejected"
      this.status = FulFILLED // 变更状态

      // 这里之所以使用一个队列来储存回调,是为了实现规范要求的 "then 方法可以被同一个 promise 调用多次"
      // 如果使用一个变量而非队列来储存回调,那么即使多次p1.then()也只会执行一次回调
      while(this._resolveQueue.length) {
        const callback = this._resolveQueue.shift()
        callback()
      }
    }
    //实现同resolve
    let _reject = (val) => {
      if(this._status !== PENDING) return
      this._status = REJECTED
      while(this._rejectQueue.length) {
        const callback = this._rejectedQueue.shift()
        callback()
      }
    }
    // new Promise()时立即执行executor,并传入resolve和reject
    executor(_resolve,_reject)
  }
   // then方法,接收一个成功的回调和一个失败的回调
  then(resolveFn,rejectFn) {
    this._resolveQueue.push(resolveFn)
    this._rejectQueue.push(rejectFn)
  }
}




```

### 3. then的链式调用

看下列子
```js
const p1 = new Promise((resolve, reject) => {
  resolve(1)
})

p1
  .then(res => {
    console.log(res)
    //then回调中可以return一个Promise
    return new MyPromise((resolve, reject) => {
      setTimeout(() => {
        resolve(2)
      }, 1000);
    })
  })
  .then(res => {
    console.log(res)
    //then回调中也可以return一个值
    return 3
  })
  .then(res => {
    console.log(res)
  })

```

返回
```js
1  
2  
3 
```
我们思考一下如何实现这种链式调用：  
1. 显然.then()需要返回一个Promise，这样才能找到then方法，所以我们会把then方法的返回值包装成Promise。
2. .then()的回调需要顺序执行，以上面这段代码为例，虽然中间return了一个Promise，但执行顺序仍要保证是1->2->3。我们要等待当前Promise状态变更后，再执行下一个then收集的回调，这就要求我们对then的返回值分类讨论

```js
then(resolveFn,rejectFn) {
  return new MyPromise((resolve,reject) => {
    //把resolveFn重新包装一下,再push进resolve执行队列,这是为了能够获取回调的返回值进行分类讨论
    const fulfilledFn = value =>{
      try {
      //执行第一个(当前的)Promise的成功回调,并获取返回值
      let x = resolveFn(value)
      x intanceof MyPromise ? x.then(resolve,reject) : resolve(x)
      }catch(error) {
        reject(error)
      }
    }
    this._resolveQueue.push(fulfilledFn)
    //reject同理
    const rejectedFn = value => {
      try {
        let x = rejectFn(value)
        x instanceof MyPromise ? x.then(resolve,reject) : resolve(x)
      } catch(error) {
          reject(error)
      }
    }
    this._rejectedQueue.push(rejectedFn)
  })
}
```

```js
const p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 500);
})

p1
  .then(res => {
    console.log(res)
    return 2
  })
  .then(res => {
    console.log(res)
    return 3
  })
  .then(res => {
    console.log(res)
  })

//输出 1 2 3

```

### 4.值穿透 & 状态已变更的情况
我们已经初步完成了链式调用，但是对于 then() 方法，我们还要两个细节需要处理一下

1. **值穿透**：根据规范，如果 then() 接收的参数不是function，那么我们应该忽略它。如果没有忽略，当then()回调不为function时将会抛出异常，导致链式调用中断
2. **处理状态为resolve/reject的情况**：其实我们上边 then() 的写法是对应状态为padding的情况，但是有些时候，resolve/reject 在 then() 之前就被执行（比如Promise.resolve().then()），如果这个时候还把then()回调push进resolve/reject的执行队列里，那么回调将不会被执行，因此对于状态已经变为fulfilled或rejected的情况，我们直接执行then回调：

```js
//then方法,接受一个成功的回调,一个失败的回调
then(resolveFn,rejectFn) {
  // 根据规范，如果then的参数不是function，则我们需要忽略它, 让链式调用继续往下执行
  if(typeof resolveFn !== 'function') resolveFn = value => value
  if(typeof rejectFn !== 'function') rejectFn = error => error

  //return一个新的promise
  return new MyPromise((resolve,reject) => {
    // 把resolveFn重新包装一下,再push进resolve执行队列,这是为了能够获取回调的返回值进行分类讨论
    const fulfilledFn = value => {
      try {
           // 执行第一个(当前的)Promise的成功回调,并获取返回值
           let x = resolveFn(value)
            // 分类讨论返回值,如果是Promise,那么等待Promise状态变更,否则直接resolve
            x instanceof MyPromise ? x.then(resolve,reject) : resolve(x)
      }catch(error) {
        reject(error)
      }
    }
    const rejectedFn = value => {
        try {
          let x = rejectFn(value)
          x instanceof MyPromise ? x.then(resolve,reject) ? resolve(x)
        }catch(error){
            reject(error)
        }
    }
    switch(this._status) {
      // 当状态为pending时,把then回调push进resolve/reject执行队列,等待执行
      case PENDING:
        this._resolveQueue.push(resolveFn)
        this.rejectQueue.push(rejectFn)
        break;
        // 当状态已经变为resolve/reject时,直接执行then回调
      case FULFILLED:
        fulfilledFn(this._value)// this._value是上一个then回调return的值(见完整版代码)
        break;
      case REJECTED:
        rejectedFn(this._value)
    }
  })
}
```
### 5.兼容同步任务

完成了then的链式调用以后，我们再处理一个前边的细节，然后放出完整代码。上文我们说过，Promise的执行顺序是new Promise -> then()收集回调 -> resolve/reject执行回调，这一顺序是建立在executor是异步任务的前提上的，如果executor是一个同步任务，那么顺序就会变成new Promise -> resolve/reject执行回调 -> then()收集回调，resolve的执行跑到then之前去了，为了兼容这种情况，我们给resolve/reject执行回调的操作包一个setTimeout，让它异步执行

> 这里插一句，有关这个setTimeout，其实还有一番学问。虽然规范没有要求回调应该被放进宏任务队列还是微任务队列，但其实Promise的默认实现是放进了微任务队列，我们的实现（包括大多数Promise手动实现和polyfill的转化）都是使用setTimeout放入了宏任务队列（当然我们也可以用MutationObserver模拟微任务）

#### promise代码最终核心实现版
```js
//Promise/A+规定的三种状态
const PENGDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  //构造方法接受一个回调
  constructor(executor) {
    this._status = PENDING //Promise初始状态
    this._value = undefined // 储存then回调return的值
    this.resolveQueue = []//成功队列,resolve时触发
    this.rejectQueue = [] //失败队列,reject时触发
    // 由于resolve/reject是在executor内部被调用, 因此需要使用箭头函数固定this指向, 否则找不到this._resolveQueue
    let _resolve = (val) => {
      //把resolve执行回调的操作封装成一个函数,放进setTimeout里,以兼容executor是同步代码的情况
      const run = () => {
        if(this._status !== PENGING) return // 对应规范中的"状态只能由pending到fulfilled或rejected"
        this._status = FULFILLED // 变更状态
        this._value =val        // 储存当前value
        // 这里之所以使用一个队列来储存回调,是为了实现规范要求的 "then 方法可以被同一个 promise 调用多次"
        // 如果使用一个变量而非队列来储存回调,那么即使多次p1.then()也只会执行一次回调
        while(this._resolveQueue.length) {
          const callback = this._resolveQueue.shift()
          callback(val)
        }
      }
      setTimeou(run)
    }
    //实现同resolve
    let _reject = (val) => {
      const run = () => {
        if(this._status !== PENDING) return
        this._status = REJECTED
        this._value = val
                while(this._rejectQueue.length) {
          const callback = this._rejectQueue.shift()
          callback(val)
        }
      }
      setTimeout(run)
      }
      // new Promise()时立即执行executor,并传入resolve和reject
      exetuor(_resolve,_reject)
    }
  }
  //then方法接受一个成功回调的方法,和一个失败回调的方法
  then(resolveFn,rejectFn) {
    // 根据规范，如果then的参数不是function，则我们需要忽略它, 让链式调用继续往下执行
    if(typeof resolveFn !== 'function') resolveFn = value => value
    if(typeof rejectFn !== 'function')  rejectFn = value => value
    // return一个新的promise
    return new MyPromise((resolve,reject) => {
    // 把resolveFn重新包装一下,再push进resolve执行队列,这是为了能够获取回调的返回值进行分类讨论
    const fulfilledFn = value => {
      try{
        //执行第一个(当前的)Promise的成功回调,并获取返回值
        let x = resolveFn(value)
        //分类讨论返回值,如果是Promise,那么等待Promise状态变更,否则直接resolve
        x instance MyPromise ? x.then(resolve,reject) : resolve(x)
      }catch(error) {
          reject(error)
      }
    }
    //reject同理
    const rejectedFn = value => {
      try{
        let x = rejetcFn(value)
        x instanceof MyPromise ? x.then(resolve,reject) : resolve(x)
      }catch(error) {
          reject(error)
      }
    }
    switch(this._status) {
      //当状态为pending时,把then回调push进resolve/reject执行队列,等待执行
      case PENDING:
        this._resolveQueue.push(fulfilledFn)
        this._rejectQueue.push(rejectedFn)
        break;
         // 当状态已经变为resolve/reject时,直接执行then回调
      case FULFILLED:
        fulfilledFn(this._value) // this._value是上一个then回调return的值(见完整版代码)
        break;
      case REJECTED:
        rejectedFn(this._value)
        break;
    }
    })



  }
}
```
然后我们可以测试一下这个Promise：
```js
const p1 = new MyPromise((resolve, reject) => {
  resolve(1)          //同步executor测试
})

p1
  .then(res => {
    console.log(res)
    return 2          //链式调用测试
  })
  .then()             //值穿透测试
  .then(res => {
    console.log(res)
    return new MyPromise((resolve, reject) => {
      resolve(3)      //返回Promise测试
    })
  })
  .then(res => {
    console.log(res)
    throw new Error('reject测试')   //reject测试
  })
  .then(() => {}, err => {
    console.log(err)
  })

// 输出 
// 1 
// 2 
// 3 
// Error: reject测试

```
到这里，我们已经实现了Promise的主要功能(｀∀´)Ψ剩下的几个方法都非常简单，我们顺手收拾掉：

#### Promise.prototype.catch()
> catch()方法返回一个Promise，并且处理拒绝的情况。它的行为与调用Promise.prototype.then(undefined, onRejected) 相同。
```js
//catch方法其实就是执行then方法的第二个回调
catch(rejectFn) {
  return this.then(undefined,rejectFn)
}

```

#### Promise.prototype.finally()
>finally()方法返回一个Promise。在promise结束时，无论结果是fulfilled或者是rejected，都会执行指定的回调函数。在finally之后，还可以继续then。并且会将值原封不动的传递给后面的then
```js
finally(callback){
  return this.then(
    value =>MyPromise.resolve(callback()).then(() => value),
    reason =>MyPromise.resolve(callback()).then(() => { throw reason})
  )
}
```

#### Promise.resolve()
> Promise.resolve(value)方法返回一个以给定值解析后的Promise 对象。如果该值为promise，返回这个promise；如果这个值是thenable（即带有"then" 方法)），返回的promise会“跟随”这个thenable的对象，采用它的最终状态；否则返回的promise将以此值完成。此函数将类promise对象的多层嵌套展平。
```js
//静态resolve方法
static resolve(value) {
  if(value instanceof MyPromise) return value;
  return new MyPromise(resolve =>resolve(value))
}
```

#### Promise.reject()
>Promise.reject()方法返回一个带有拒绝原因的Promise对象。
```js
//静态reject方法
static reject(reason) {
  return new MyPromise((resolve,reject) => reject(reason))
}
```
#### Promise.all()
>Promise.all(iterable)方法返回一个 Promise 实例，此实例在 iterable 参数内所有的 promise 都“完成（resolved）”或参数中不包含 promise 时回调完成（resolve）；如果参数中  promise 有一个失败（rejected），此实例回调失败（reject），失败原因的是第一个失败 promise 的结果。

```js
//静态all方法
static all(promiseArr) {
  return new MyPromise((resolve,reject) => {
    //同时执行Promise,如果有一个Promise的状态发生改变,就变更MyPromise的状态
    for(let p of promiseArr) {
      MyPromise.resolve(p).then(
        value => resolve(value),
        error => reject(error)
      )
    }
  })
}
```

完整方法
```js
//Promise/A+规定的三种状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  // 构造方法接收一个回调
  constructor(executor) {
    this._status = PENDING     // Promise状态
    this._value = undefined    // 储存then回调return的值
    this._resolveQueue = []    // 成功队列, resolve时触发
    this._rejectQueue = []     // 失败队列, reject时触发

    // 由于resolve/reject是在executor内部被调用, 因此需要使用箭头函数固定this指向, 否则找不到this._resolveQueue
    let _resolve = (val) => {
      //把resolve执行回调的操作封装成一个函数,放进setTimeout里,以兼容executor是同步代码的情况
      const run = () => {
        if(this._status !== PENDING) return   // 对应规范中的"状态只能由pending到fulfilled或rejected"
        this._status = FULFILLED              // 变更状态
        this._value = val                     // 储存当前value

        // 这里之所以使用一个队列来储存回调,是为了实现规范要求的 "then 方法可以被同一个 promise 调用多次"
        // 如果使用一个变量而非队列来储存回调,那么即使多次p1.then()也只会执行一次回调
        while(this._resolveQueue.length) {    
          const callback = this._resolveQueue.shift()
          callback(val)
        }
      }
      setTimeout(run)
    }
    // 实现同resolve
    let _reject = (val) => {
      const run = () => {
        if(this._status !== PENDING) return   // 对应规范中的"状态只能由pending到fulfilled或rejected"
        this._status = REJECTED               // 变更状态
        this._value = val                     // 储存当前value
        while(this._rejectQueue.length) {
          const callback = this._rejectQueue.shift()
          callback(val)
        }
      }
      setTimeout(run)
    }
    // new Promise()时立即执行executor,并传入resolve和reject
    executor(_resolve, _reject)
  }

  // then方法,接收一个成功的回调和一个失败的回调
  then(resolveFn, rejectFn) {
    // 根据规范，如果then的参数不是function，则我们需要忽略它, 让链式调用继续往下执行
    typeof resolveFn !== 'function' ? resolveFn = value => value : null
    typeof rejectFn !== 'function' ? rejectFn = reason => {
      throw new Error(reason instanceof Error? reason.message:reason);
    } : null
  
    // return一个新的promise
    return new MyPromise((resolve, reject) => {
      // 把resolveFn重新包装一下,再push进resolve执行队列,这是为了能够获取回调的返回值进行分类讨论
      const fulfilledFn = value => {
        try {
          // 执行第一个(当前的)Promise的成功回调,并获取返回值
          let x = resolveFn(value)
          // 分类讨论返回值,如果是Promise,那么等待Promise状态变更,否则直接resolve
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
        } catch (error) {
          reject(error)
        }
      }
  
      // reject同理
      const rejectedFn  = error => {
        try {
          let x = rejectFn(error)
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
        } catch (error) {
          reject(error)
        }
      }
  
      switch (this._status) {
        // 当状态为pending时,把then回调push进resolve/reject执行队列,等待执行
        case PENDING:
          this._resolveQueue.push(fulfilledFn)
          this._rejectQueue.push(rejectedFn)
          break;
        // 当状态已经变为resolve/reject时,直接执行then回调
        case FULFILLED:
          fulfilledFn(this._value)    // this._value是上一个then回调return的值(见完整版代码)
          break;
        case REJECTED:
          rejectedFn(this._value)
          break;
      }
    })
  }

  //catch方法其实就是执行一下then的第二个回调
  catch(rejectFn) {
    return this.then(undefined, rejectFn)
  }

  //finally方法
  finally(callback) {
    return this.then(
      value => MyPromise.resolve(callback()).then(() => value),             //执行回调,并returnvalue传递给后面的then
      reason => MyPromise.resolve(callback()).then(() => { throw reason })  //reject同理
    )
  }

  //静态的resolve方法
  static resolve(value) {
    if(value instanceof MyPromise) return value //根据规范, 如果参数是Promise实例, 直接return这个实例
    return new MyPromise(resolve => resolve(value))
  }

  //静态的reject方法
  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason))
  }

  //静态的all方法
  static all(promiseArr) {
    let index = 0
    let result = []
    return new MyPromise((resolve, reject) => {
      promiseArr.forEach((p, i) => {
        //Promise.resolve(p)用于处理传入值不为Promise的情况
        MyPromise.resolve(p).then(
          val => {
            index++
            result[i] = val
            if(index === promiseArr.length) {
              resolve(result)
            }
          },
          err => {
            reject(err)
          }
        )
      })
    })
  }

  //静态的race方法
  static race(promiseArr) {
    return new MyPromise((resolve, reject) => {
      //同时执行Promise,如果有一个Promise的状态发生改变,就变更新MyPromise的状态
      for (let p of promiseArr) {
        MyPromise.resolve(p).then(  //Promise.resolve(p)用于处理传入值不为Promise的情况
          value => {
            resolve(value)        //注意这个resolve是上边new MyPromise的
          },
          err => {
            reject(err)
          }
        )
      }
    })
  }
}

```

此处是记录了下面链接博主的文章,看完之后受益匪浅,然后就想记录一下,加深学习和理解,谢谢博主.


#参考
[Promise / async / Generator 实现&原理大解析（附源码）| 9k字](https://juejin.im/post/5e3b9ae26fb9a07ca714a5cc)


## 参考链接  
[promise源码](https://segmentfault.com/a/1190000009478377)   
[promise实现](https://blog.csdn.net/u013217071/article/details/76911627)  
[pomise用法解析](http://www.cnblogs.com/lvdabao/p/es6-promise-1.html)  
[pomise的运行理解](https://blog.csdn.net/hai8902882/article/details/52562977)  