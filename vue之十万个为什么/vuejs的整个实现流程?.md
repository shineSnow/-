# vuejs的整个实现原理以及vue双向数据绑定的原理

先上图
![vuejs实现流程图](https://user-gold-cdn.xitu.io/2019/5/13/16aae4f3b2aa9340?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

说实话这个问题还是蛮虐的,有深度又有广度

初始化流程:
- 创建 Vue 实例对象
- $\color{red}init{}$过程会初始化生命周期，初始化事件中心，初始化渲染、执行$\color{red}{beforeCreate}$周期函数、初始化 **data、props、computed、watcher**,执行**created**周期函数等。
- 初始化后，调用$**mount** 方法对Vue实例进行挂载（挂载的核心过程包括**模板编译、渲染以及更新**三个过程）
- 如果没有在 Vue 实例上定义render方法而是定义了template，那么需要经历编译阶段。需要先将template 字符串编译成 render function，template 字符串编译步骤如下 ：
  - parse正则解析template字符串形成 AST（抽象语法树，是源代码的抽象语法结构的树状表现形式）
  - optimize标记静态节点跳过 DIFF 算法（DIFF 算法是逐层进行比对，只有同层级的节点进行比对，因此时间的复杂度只有 O(n)。如果对于时间复杂度不是很清晰的，可以查看我写的文章ziyi2/algorithms-javascript/渐进记号）
  - generate将 AST 转化成render function字符串
- 编译成render function 后，调用$mount的mountComponent方法，先执行beforeMount钩子函数，然后核心是实例化一个渲染Watcher，在它的回调函数（初始化的时候执行，以及组件实例中监测到数据发生变化时执行）中调用updateComponent方法（此方法调用render方法生成虚拟 Node，最终调用update方法更新 DOM）。
- 调用render方法将render function渲染成虚拟的Node（真正的 DOM 元素是非常庞大的，因为浏览器的标准就把 DOM 设计的非常复杂。如果频繁的去做 DOM 更新，会产生一定的性能问题，而 Virtual DOM 就是用一个原生的 JavaScript 对象去描述一个 DOM 节点，所以它比创建一个 DOM 的代价要小很多，而且修改属性也很轻松，还可以做到跨平台兼容），render方法的第一个参数是createElement(或者说是h函数)，这个在官方文档也有说明
- 生成虚拟 DOM 树后，需要将虚拟 DOM 树转化成真实的 DOM 节点，此时需要调用update方法，update方法又会调用pacth方法把虚拟 DOM 转换成真正的 DOM 节点。需要注意在图中忽略了新建真实 DOM 的情况（如果没有旧的虚拟 Node，那么可以直接通过createElm创建真实 DOM 节点），这里重点分析在已有虚拟 Node 的情况下，会通过sameVnode判断当前需要更新的 Node节点是否和旧的 Node 节点相同（例如我们设置的key属性发生了变化，那么节点显然不同），如果节点不同那么将旧节点采用新节点替换即可，如果相同且存在子节点，需要调用patchVNode方法执行 DIFF 算法更新 DOM，从而提升   DOM 操作的性能

需要注意在初始化阶段，没有详细描述数据的响应式过程，这个在响应式流程里做说明

响应式流程：
- 在init的时候会利用Object.defineProperty方法（不兼容 IE8）监听Vue实例的响应式数据的变化从而实现数据劫持能力（利用了 JavaScript 对象的访问器属性get和set，在未来的 Vue3 中会使用 ES6 的Proxy来优化响应式原理）。在初始化流程中的编译阶段，当render function被渲染的时候，会读取Vue实例中和视图相关的响应式数据，此时会触发getter函数进行依赖收集（将观察者Watcher对象存放到当前闭包的订阅者Dep的subs中），此时的数据劫持功能和观察者模式就实现了一个 MVVM 模式中的  Binder，之后就是正常的渲染和更新流程。

- 当数据发生变化或者视图导致的数据发生了变化时，会触发数据劫持的setter函数，setter会通知初始化依赖收集中的Dep中的和视图相应的Watcher，告知需要重新渲染视图，Wather就会再次通过update方法来更新视图。

可以发现只要视图中添加监听事件，自动变更对应的数据变化时，就可以实现数据和视图的双向绑定了。













# 参考
[在阿里我是如何当面试官的](https://juejin.im/post/5e6ebfa86fb9a07ca714d0ec#heading-47)