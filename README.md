#移动端WEB开发适配解决方案
>做移动端开发时，通常是得到设计稿后，要经过各种换算得出像素值，再应用在css上；
同时也因为移动端存在各种屏幕尺寸，如何适配各种屏幕尺寸和完美还原设计稿就成了一个大问题。
这个方案是通过动态计算得出一个font-size的值，然后应用于根元素上，子元素使用rem单位做布局。
这样的优势是能适配各种各样不同尺寸的屏幕，同时根据设置的设计稿宽度，做到任何尺寸的设计稿都能完美适配。
当然也有个缺点，那就是字体不能直接使用rem，字体像素值需要乘以当前屏幕的dpr才是正常的尺寸，建议用sass或者less添加一些预处理。
参考了hotcss和手淘flexiable，做了一些修改，用了es6的写法，添加可自定义转换系数等。
（目前当转换系数为10时，iphone6 下有bug，待验证）



##如何使用
#####1.设置meta
```
<meta name="rem-setting" content="design-width = 750,max-width = 500,ratio = 100">
```
design-width - 设计稿宽度，默认750</br>
max-width - 在非移动端时页面的最大宽度，默认500</br>
ratio - 转换系数，默认100</br>
dpr - 屏幕像素比，设置了该项时，dpr会固定为设置的值

#####2.引入js
```
<script src="src/rem.js"></script>
```
#####3.愉快的编写css</br>
例如：假设设计稿宽度是750px，转换系数100。</br>
设置body为750px（与设计稿同宽）
```
body {
  width: 7.5rem; // 750 / 100 = 7.5 => 7.5rem
}
```
其中某个元素尺寸是宽300px，高100px
那么该元素的css可这样写
```
div.sample{
width: 3rem; // 300 / 100 = 3 => 3rem
height: 1rem; // 100 / 100 = 1 => 1rem
}
```
#####4.字体值相关
需要注意的是，如果dpr是1的时候，可以正常使用px当字体值；</br>
但是如果dpr是1以上时，字体值 × dpr才是正确的值，可以使用less或sass做预处理；</br>
当然也可以设置固定的dpr = 1，这样在任何屏幕下字体值都可以使用px单位了。

##主要思路
首先了解以下的值：
视口宽度 **clientWidth**（例如iphone 6屏幕的宽度为375px，iphone 6p屏幕的宽度为414px）；</br>
设计稿宽度大小 **designWidth**（一般为750px）；</br>
转换系数 **ratio**（ratio表示将设计稿的px单位除以ratio，得出的值直接用于rem即可）；</br>
设备像素比 **dpr**（iphone 6为2，iphone 6p为3）。</br>
我们要实现的是将设计稿适配到各种尺寸的屏幕中，可以将rem理解成一个动态参数，
（**设计稿的像素数据** / **转换系数**） * **rem的具体值** = **当前屏幕下应该显示的尺寸**，
屏幕变化，rem的具体值也会改变，也就会自动适配各种尺寸的屏幕，
然后再考虑屏幕的dpr和转换系数（关于dpr可以百度谷歌一下，相信比我说的还要清楚清晰）
根据以上的条件可以得出公式：
```
clientWidth * dpr = (designWidth / ratio) * rem
```
从而得出
```
rem = (clientWidth * dpr * ratio) / designWidth
```
根据以上公式就可以计算出rem的值。
使用的时候，只要将**设计稿的像素** ÷ **转换系数**，得出的值直接使用rem即可。</br>
以上就是大概的实现思路，实际中还要根据dpr动态设置一个缩放比例，具体的可以看代码的实现。

研究了一下手淘的flexible发现，flexible可以理解为用设计稿的十分之一作为转换系数，
而hotcss是用46.875（750/16）作为转换系数。

##其他相关

rem.js执行完后会提供一个全局变量rem，可以通过window.rem访问到，rem提供了两个方法，方便px与rem之间的相互转换。
```
// 接受一个数字或字符串参数，返回对应的数值
/**
* @param  {number|String} [需要转换的值]
* @return {String} [返回转换后的结果]
*/
rem.px2rem(20); // '0.02rem'
rem.px2rem('100px'); // '1rem'
rem.rem2px(1); // '100px'
rem.rem2px('2rem'); // '200px'
```
<small>注：这里返回的数值会因设计稿大小，屏幕宽度和换算比例变化而变化，这里仅作示范用。</small>


##参考
[网易和淘宝移动WEB适配方案再分析](https://zhuanlan.zhihu.com/p/25216275)
[hotcss](https://github.com/imochen/hotcss)
