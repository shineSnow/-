参考链接: 
- https://blog.csdn.net/yuhk231/article/details/53976295
- https://www.jianshu.com/p/7e63f5a32636  

### 伪元素方案  京东方案

  这条横细线通过上面这种样式呈现出来。这种方式的核心在于使用transform:scaleY来使得1px的border得以收缩，最终呈现出细线的效果
```css
.bdr-bottom:after {
    height: 1px;
    content: '';
    width: 100%;
    border-top: 1px solid #f0f0f0;
    position: absolute;
    bottom: -1px;
    right: 0;
    transform: scaleY(0.5);
    -webkit-transform: scaleY(0.5); 
}

```

### 手淘  
淘宝手机版没有使用CSS伪类进行细线的实现，而是在需要使用细线的地方统一使用div来补位。
```css
.tb_line{
    box-sizing: border-box;
    line-height: 0;
    background-color: rgb(239, 239, 239);
    width: 100%;
    height: 1px;
}

```

### 腾讯财经  

```css
.navTab{
    border-bottom: 1px solid #eceef0;
    box-shadow: 0 1px 1px #fff;
}

```

### 方案5   
 伪元素结合 背景图片 使用渐变一半有色一半透明
```css
.table_position td:before{ 
    content: " "; 
    position: absolute; 
    left: 0; 
    bottom: 0; 
    width: 100%; 
    height: 1px; 
    background-image: -webkit-linear-gradient(0deg, #ddd 50%, transparent 50%); 
    background-image: -moz-linear-gradient(0deg, #ddd 50%, transparent 50%); 
    background-image: -ms-linear-gradient(0deg, #ddd 50%, transparent 50%); 
    background-image: -o-linear-gradient(0deg, #ddd 50%, transparent 50%); 
    background-image: linear-gradient(0deg, #ddd 50%, transparent 50%);
}

```  

### 知乎  
```css
.ele:before{
    content: " ";
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-right: 1px solid rgba(255,255,255,0.3);
    -webkit-transform: scale(.5);
    -webkit-transform-origin: 0 0;
    -webkit-box-sizing: border-box;
    z-index :0;
}

```