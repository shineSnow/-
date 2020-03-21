### 问：谈谈对vuex的理解？
- 是一个全局集中响应式状态的管理工具，状态会保存再state内，可以被所有组件所引用，一经修改后引用state内状态的组件都会响应式的更新。state不能被直接修改，必须commit内提交mutation才行，且mutation必须是同步函数。提交action可以在内部进行异步操作，可同时提交多个mutation

- store内的state可以通过this.$store.state.xxx访问。
- store内的getter可以通过this.$store.getters.xxx访问。
- store内的mutation可以通过this.$store.commit('xxx')提交。
- store内的action可以通过this.$store.dispatch('yyy')提交。

### vuex语法糖方法有哪些以及如何使用？

```js
computed: {
  ...mapState(['xxx', 'yyy'])
}

computed: {
  ...mapGetters(['xxx', 'yyy'])
}

methods: {
  ...mapMutations({
    zzz: 'XXX_YYY'
  })
}

methods: {
  ...mapActions(['yyy'])
}

```