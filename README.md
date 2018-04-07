## mosaic


生成图片目前只能使用于支持a标签download属性的浏览器

dom api 并未做兼容处理

### Install

```javascript	
	// clone之后
	npm i
	// install success
	npm run start
```

### 优化

处理callback 中的还未优化

马赛克目前是实时的 可以全部打码然后打码就是把透明度从0变为255 或者在增加一层来存放打码数据
callback没有节流函数限制可能部分机器会卡
没有测试兼容性