
### 一个vue的全局提示框组件

**步骤**

1. 编写这个组件的逻辑,vue单文件
2. 进行全局注册
3. 引用这个组件

```vue
<template>
  
      <!-- 全局提示框 -->
      <div v-show="visible" class="dialog-tips dialog-center">
          <div>{{message}}</div>
      </div>
  
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      message: ""
    };
  }
};
</script>
<style lang="scss">
.dialog-tips{
    position: fixed;
    z-index: 100;
    min-width: 220px;
    padding: 40px 22px;
    white-space: nowrap;
    background-color: #fff;
    box-shadow: 0px 8px 15px 0 rgba(0, 0, 0, 0.1);
    text-align: center;
    .dialog-tips-icon{
        width: 54px;
        height: 54px;
        @extend %bg-contain;
        display: inline-block;
        margin-bottom: 13px;
    }
}
.dialog-center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)
}

</style>
```
toast.js
```js
import ToastComponent from './toast.vue'

const Toast = {};

// 注册Toast
Toast.install = function (Vue) {
    // 生成一个Vue的子类
    // 同时这个子类也就是组件
    const ToastConstructor = Vue.extend(ToastComponent)
    // 生成一个该子类的实例
    const instance = new ToastConstructor();

    // 将这个实例挂载在我创建的div上
    // 并将此div加入全局挂载点内部
    instance.$mount(document.createElement('div'))
    document.body.appendChild(instance.$el)

    // 通过Vue的原型注册一个方法
    // 让所有实例共享这个方法 
    Vue.prototype.$toast = (msg, duration = 1500) => {
        instance.message = msg;
        instance.visible = true;

        setTimeout(() => {
            instance.visible = false;
        }, duration);
    }
}

export default Toast
```

**使用**
在main.js文件中使用
```
　import Vue from 'vue'
　import Toast from './toast'
 
 
　　Vue.use(Toast);
```　
　在component中
this.$toast("XXXXXXXXX");