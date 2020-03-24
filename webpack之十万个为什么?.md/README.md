### 1. webpack的原理, loader 和 plugin 是干什么的? 有自己手写过么 ?
[详解webpack loader和plugin编写](https://blog.csdn.net/qq_34629352/article/details/83628917)
[教你手写一个简单的 webpack loader 与 plugin](https://blog.csdn.net/yolo0927/article/details/85017565)

1. 解析webpack配置参数，合并从shell传入和webpack.config.js文件里配置的参数，生产最后的配置结果
2. 注册所有配置的插件，好让插件监听webpack构建生命周期的事件节点，以做出对应的反应。
3. 从配置的entry入口文件开始解析文件构建AST语法树，找出每个文件所依赖的文件，递归下去。  
4. 在解析文件递归的过程中根据文件类型和loader配置找出合适的loader用来对文件进行转换。
5. 递归完后得到每个文件的最终结果，根据entry配置生成代码块chunk。
6. 输出所有chunk到文件系统。