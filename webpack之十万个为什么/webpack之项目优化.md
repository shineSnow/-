### 代码分割结合 Prefetch 完美优化单页应用加载性能
webackdiamante分割提供三种方式
- 每个需要分割的文件可以配置多入口
- 动态加载 import()
- .....忘了

#### vue代码分割-异步组件

我们可以在需要引用组件的地方封装一个函数return 一个import组件引用,从而分割组件



```js
const Home = () => import(/* webpackChunkName: "home" */ './Home.vue');
const About = () => import(/* webpackChunkName: "about" */ './About.vue');
const Contact = () => import(/* webpackChunkName: "contact" */ './Contact.vue');
const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/contact', name: 'contact', component: Contact }
];
```








#### 参考
[『翻译』基于 Vue.js 与 Webpack 的三种代码分割范式](https://juejin.im/post/59bb73336fb9a00a3c4b08d9)