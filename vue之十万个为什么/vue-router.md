### 问：vue-router如何传递参数？
```js
方式1：
{
  path:"/home/:id",
  component:Home
}
this.$router.push({
  path:`/home/${id}`,
})
在Home组件中获取参数
this.$route.params.id

方式2：需要命名路由
{
  path:'/home',
  name: 'home'
  component:Home
}
this.$router.push({
  name:'home',
  params:{id:9527}
})
在Home组件中获取参数
this.$route.params.id

方式3：
{
  path:"/home",
  component:Home
}
this.$router.push({
  path:'/home',
  query:{id:9527}
})

在Home组件中获取参数
this.$route.query.id

```

### 问：vue-router有哪些导航守卫钩子？以及它们的执行顺序？

- 全局守卫：
beforeEach：只要当某个导航被触发时，就会执行这个钩子。
beforeResolve：在路由的beforeEnter和组件的beforeRouteEnter执行之后执行。
afterEach：在所有的导航守卫执行完毕之后执行，没有next方法。

- 路由守卫： beforeEnter：在路由内定义，在全局beforeEach之后执行。
- 组件守卫：
beforeRouteEnter：在渲染组件对应路由被确认之前调用，不能访问this，在路由beforeEnter钩子之后执行。
beforeRouteUpdate：在当前路由改变但组件被复用时调用，例如在动态子路由之前调转时。
beforeRouteLeave：导航离开该路由时调用

1. beforeRouteLeave
2. beforeEach
3. beforeRouteUpdate
4. beforeEnter
5. beforeRouteEnter
6. beforeResolve
7. afterEach