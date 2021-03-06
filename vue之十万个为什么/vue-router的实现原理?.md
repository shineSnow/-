## 2、vue-router实现原理？
[参考](https://juejin.im/post/5bc6eb875188255c9c755df2)    

近期面试，遇到关于vue-router实现原理的问题，在查阅了相关资料后，根据自己理解，来记录下。
我们知道vue-router是vue的核心插件，而当前vue项目一般都是单页面应用，也就是说vue-router是应用在单页面应用中的。
那么，什么是单页面应用呢？在单页面应用出现之前，多页面应用又是什么样子呢？

单页面应用与多页面应用
单页面
即 第一次进入页面的时候会请求一个html文件，刷新清除一下。切换到其他组件，此时路径也相应变化，但是并没有新的html文件请求，页面内容也变化了。

原理是：JS会感知到url的变化，通过这一点，可以用js动态的将当前页面的内容清除掉，然后将下一个页面的内容挂载到当前页面上，这个时候的路由不是后端来做了，而是前端来做，判断页面到底是显示哪个组件，清除不需要的，显示需要的组件。这种过程就是单页应用，每次跳转的时候不需要再请求html文件了。

多页面
即 每一次页面跳转的时候，后台服务器都会给返回一个新的html文档，这种类型的网站也就是多页网站，也叫做多页应用。
原理是：传统的页面应用，是用一些超链接来实现页面切换和跳转的

其实刚才单页面应用跳转原理即 vue-router实现原理

vue-router实现原理
原理核心就是 更新视图但不重新请求页面。

vue-router实现单页面路由跳转，提供了三种方式：hash模式、history模式、abstract模式，根据mode参数来决定采用哪一种方式。

路由模式
vue-router 提供了三种运行模式：
● hash: 使用 URL hash 值来作路由。默认模式。
● history: 依赖 HTML5 History API 和服务器配置。查看 HTML5 History 模式。
● abstract: 支持所有 JavaScript 运行环境，如 Node.js 服务器端

Hash模式
hash即浏览器url中#后面的内容，包含#。hash是URL中的锚点，代表的是网页中的一个位置，单单改变#后的部分，浏览器只会加载相应位置的内容，不会重新加载页面。
也就是说

即#是用来指导浏览器动作的，对服务器端完全无用，HTTP请求中，不包含#。
每一次改变#后的部分，都会在浏览器的访问历史中增加一个记录，使用”后退”按钮，就可以回到上一个位置。
所以说Hash模式通过锚点值的改变，根据不同的值，渲染指定DOM位置的不同数据。

History模式
HTML5 History API提供了一种功能，能让开发人员在不刷新整个页面的情况下修改站点的URL，就是利用 history.pushState API 来完成 URL 跳转而无须重新加载页面；

由于hash模式会在url中自带#，如果不想要很丑的 hash，我们可以用路由的 history 模式，只需要在配置路由规则时，加入"mode: 'history'",这种模式充分利用 history.pushState API 来完成 URL 跳转而无须重新加载页面。

有时，history模式下也会出问题：
eg:
hash模式下：xxx.com/#/id=5 请求地址为 xxx.com,没有问题。
history模式下：xxx.com/id=5 请求地址为 xxx.com/id=5，如果后端没有对应的路由处理，就会返回404错误；

为了应对这种情况，需要后台配置支持：
在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。

abstract模式
abstract模式是使用一个不依赖于浏览器的浏览历史虚拟管理后端。
根据平台差异可以看出，在 Weex 环境中只支持使用 abstract 模式。 不过，vue-router 自身会对环境做校验，如果发现没有浏览器的 API，vue-router 会自动强制进入 abstract 模式，所以 在使用 vue-router 时只要不写 mode 配置即可，默认会在浏览器环境中使用 hash 模式，在移动端原生环境中使用 abstract 模式。 （当然，你也可以明确指定在所有情况下都使用 abstract 模式）。