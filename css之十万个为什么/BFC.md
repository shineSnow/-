## BFC 块级格式化上下文

**含义**

>块格式化上下文（Block Formatting Context，BFC） 是Web页面的可视化CSS渲染的一部分，是块盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域。

>BFC(Block Formatting Context)块级格式化上下文，是Web页面 CSS 视觉渲染的一部分，用于决定块盒子的布局及浮动相互影响范围的一个区域。



**下列方式会创建块格式化上下文：**

- 根元素(`<html>`) 
- 浮动元素（元素的 float 不是 `none`）
- 绝对定位元素（元素的 position 为 absolute 或 fixed）
- 行内块元素（元素的 display 为 inline-block）
- 表格单元格（元素的 display为 table-cell，HTML表格单元格默认为该值）
- 表格标题（元素的 display 为 table-caption，HTML表格标题默认为该值）
- 匿名表格单元格元素（元素的 display为 table、table-row、 table-row-group、table-header-group、table-footer-group（分别是HTML table、row、tbody、thead、tfoot的默认属性）或 inline-table）
- overflow 值不为 visible 的块元素(其余属性:auto,hidden,scroll,visible 默认值)
- display 值为 flow-root 的元素
- contain 值为 layout、content或 paint 的元素
- 弹性元素（display为 flex 或 inline-flex元素的直接子元素）
- 网格元素（display为 grid 或 inline-grid 元素的直接子元素）
- 多列容器（元素的 column-count 或 column-width 不为 auto，包括 column-count 为 1）
- column-span 为 all 的元素始终会创建一个新的BFC，即使该元素没有包裹在一个多列容器中（标准变更，Chrome bug）。

>块格式化上下文对浮动定位（参见 float）与清除浮动（参见 clear）都很重要。浮动定位和清除浮动时只会应用于同一个BFC内的元素。浮动不会影响其它BFC中元素的布局，而清除浮动只能清除同一BFC中在它前面的元素的浮动。外边距折叠（Margin collapsing）也只会发生在属于同一BFC的块级元素之间。


**BFC的特性**
1. 属于同一个BFC的两个相邻Box的margin会发生折叠，不同BFC不会发生折叠
2. BFC的区域不会与浮动元素的区域重叠
3. BFC的高度包含浮动子元素的高度
4. BFC在页面上是一个独立的容器，里外的元素不会互相影响
5. 每个元素的左外边距与包含块的左边界相接触（从左向右），即使浮动元素也是如此。（这说明BFC中子元素不会超出他的包含块，而position为absolute的元素可以超出他的包含块边界）


**BFC的使用场景**
1. 去除边距重叠现象

2. 清除浮动（让父元素的高度包含子浮动元素）

3. 避免某元素被浮动元素覆盖

4. 避免多列布局由于宽度计算四舍五入而自动换行











[BFC MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)