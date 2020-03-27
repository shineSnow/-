#### 前端算法
[js家的十大算法](https://www.jianshu.com/p/1b4068ccd505)
[算法](https://www.jackpu.com/qian-duan-mian-shi-zhong-de-chang-jian-de-suan-fa-wen-ti/ ) 

1. 冒泡排序   
    冒泡排序算法就是依次比较大小，小的大的进行位置上的交换  
```javascript
function bubbleSort(arr) {
    for(let i = 0,l = arr.length;i<l-1;i++) {
        for(let j= i+1;j<l;j++) {
            if(arr[i] >arr[j]) {
                let temp= arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;

}
```

2. 二分法(快排)
        算法参考某个元素值，将小于它的值，放到左数组中，大于它的值的元素就放到右数组中，然后递归进行上一次左右数组的操作，返回合并的数组就是已经排好顺序的数组了。
```javascript
function quickSort(arr) {
    if(arr.length <= 1) {
        return arr;
    }
    let leftArr = [];
    let rightArr = [];
    let q = arr[0];
    for(let i = 1; i<arr.length;i++) {
        if(arr[i] > q) {
            rightArr.push(arr[i])
        } else {
            leftArr.push(arr[i])
        }
    }
    return [].concat(quickSort(leftArr),q,quickSort(rightArr))
}
```

100. 斐波那契数组前n项数组  1,1,2,3,5,8
```javascript
function getFibonacci(n) {
    let fibarr = [];
    let i=1;
    while(i<= n) {
        if(i <=2) {
            fibarr.push(1);
        } else {
            var l = fibarr.length;
            fibarr.push(fibarr[i-2] + fibarr[i-3])
        }
        i++;
    }

    return fibarr;
}
 ```
101. Math随机数的控制.
```javascript
取[min,max]之间的值
Math.floor(Math.random()*(max-min+1)+min);

```
[随机数](https://www.cnblogs.com/starof/p/4988516.html)
