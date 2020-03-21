### 能说一下vue的diff算法么?


#### 1.首先来理解Vnode对象
一个VNode的实例包含了以下属性，这部分代码在src/core/vdom/vnode.js里
```js
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  functionalContext: Component | void; // real context vm for functional nodes
  functionalOptions: ?ComponentOptions; // for SSR caching
  functionalScopeId: ?string; // functioanl scope id support

```
- tag: 当前节点的标签名
- data: 当前节点的数据对象，具体包含哪些字段可以参考vue源码types/vnode.d.ts中对VNodeData的定义
- children: 数组类型，包含了当前节点的子节点
- text: 当前节点的文本，一般文本节点或注释节点会有该属性
- elm: 当前虚拟节点对应的真实的dom节点
- ns: 节点的namespace
- context: 编译作用域
- functionalContext: 函数化组件的作用域
- key: 节点的key属性，用于作为节点的标识，有利于patch的优化
- componentOptions: 创建组件实例时会用到的选项信息
- child: 当前节点对应的组件实例
- parent: 组件的占位节点
- raw: raw html
- isStatic: 静态节点的标识
- isRootInsert: 是否作为根节点插入，被包裹的节点，该属性的值为false
- isComment: 当前节点是否是注释节点
- isCloned: 当前节点是否为克隆节点
- isOnce: 当前节点是否有v-once指令

#### 2.VNode的分类
VNode可以理解为VueVirtual Dom的一个基类，通过VNode构造函数生成的VNnode实例可为如下几类：

- EmptyVNode: 没有内容的注释节点
- TextVNode: 文本节点
- ElementVNode: 普通元素节点
- ComponentVNode: 组件节点
- CloneVNode: 克隆节点，可以是以上任意类型的节点，唯一的区别在于isCloned属性为true


#### 3.Create-Element源码解析
好像这部分和diff联系不大,略去

#### 4.Patch原理
patch函数的定义在src/core/vdom/patch.js中

patch函数接收6个参数：
- oldVnode: 旧的虚拟节点或旧的真实dom节点
- vnode: 新的虚拟节点
- hydrating: 是否要跟真实dom混合
- removeOnly: 特殊flag，用于组件
- parentElm: 父节点
- refElm: 新节点将插入到refElm之前
  
  ------
**patch的逻辑是**：

































### 参考
[详解vue的diff算法](https://juejin.im/post/5affd01551882542c83301da)
[解析vue2.0diff算法](https://github.com/aooy/blog/issues/2)
[diff算法最准确](https://github.com/answershuto/learnVue/blob/master/docs/VirtualDOM%E4%B8%8Ediff(Vue%E5%AE%9E%E7%8E%B0).MarkDown)
[解析vue2.0的diff算法](https://segmentfault.com/a/1190000008782928)
[可以看明白的vuediff算法解析](https://www.cnblogs.com/isLiu/p/7909889.html)