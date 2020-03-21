### vue平常开发中做的优化?
- **keep-alive**
- 路由懒加载
- [Preload/Prefetch](https://juejin.im/post/5d1d6063f265da1ba77cc0dc)
- key
- 响应式依赖扁平化
- 减少非必要的响应式依赖
- Object.freeze
- DOM 滚动加载
- v-if / v-show
- computed / watch
- 事件销毁（防止内存泄漏）
- 组件按需引入
- 预渲染
- 按需 Polyfill
- 模板预编译
- 渲染函数
- 官方风格指南 + 官方 ESLint 插件
  

### 可能追加的面试题

- 路由懒加载是如何实现的？
- Coding Split 和哪些 Webpack 配置相关？
- Polyfill 是什么？Vue 支持哪些相关的可配置化信息？
- Vue 中可以使用 JSX 吗？（居然有人不清楚 JSX 是什么）


### 参考
[Vue性能优化](https://juejin.im/post/5d548b83f265da03ab42471d)