import {setCss,setAttr} from './util.js'
export default class Mosaic {
	constructor (option) {
		// 合并参数
		let opt = Object.assign({},this.getDefaultOpt(),option);
		// 获取比例
		opt.pixelRatio = this.getPixelRatio(document.createElement('canvas').getContext('2d'));
		// 创建canvas
		this.createMosaicCanvas(opt);
		// 获取canvas 距离顶部的距离
		let postion = this.getElemPos(opt.el)
		opt.offsetTop = postion.y;
		opt.offsetLeft = postion.x;
		if(opt.imgUrl){
			this.readImgURL(opt,opt.imgUrl);
		}
		this.setCanvasPicURL = this.setCanvasPicURLCreater(opt,this)
		this.getResultCanvas = this.getResultCanvasCreater(opt)
		// 事件绑定 所有的事件绑定处理都在这里
		this.eventBind(opt);
		// 初始化值(一些值根据dom的value来改变这里获取一次)
		this.getInitValue(opt);
		return {
			setCanvasPicURL: this.setCanvasPicURL,
			getResultCanvas: this.getResultCanvas
		}
		// readImgURL主要是用来读取在线地址的图片 不需要用户上传来获取图片
		// this.readImgURL(this.opt)
	}
	/**
	 * 返回默认参数
	 * @return {[object]} 默认参数
	 */
	getDefaultOpt() {
		return {
			width: '500px',
			height: '500px',
			imgSrc: undefined,
			operateStart: false,
			operateList: [],
			size: 10,
		}
	}
	/**
	 * 设置容器的css，遍历生成canvas和canvasCtx
	 * @param  {[object]} opt [全部参数]
	 * @return {[undefined]}
	 */
	createMosaicCanvas(opt) {
		setCss(opt.el,{
			position: 'relative',
			border: '1px solid black',
			height: opt.height,
			width: opt.width
		})
		const canvasArr = ['canvasBg','canvasArea','canvasWaterMark','canvasOpe']
		canvasArr.forEach((currVal,index,arr)=>{
			opt[currVal] = this.createCanvasArrFun(currVal,opt,index)
			opt[`${currVal}Ctx`] = opt[currVal].getContext('2d')
		})
	}
	/**
	 * [设置canvas的css和attr并append到容器内]
	 * @param  {[string]} idStr [id标志]
	 * @param  {[object]} opt   [总参数]
	 * @param  {[序号]} index [设置层级 层级依赖于遍历的数组]
	 * @return {[canvas element]}       [返回canvas]
	 */
	createCanvasArrFun(idStr,opt,index){
		let canvas = document.createElement('canvas');
		setCss(canvas,{
			position: 'absolute',
			top: 0,
			left: 0,
			'z-index': index + 1,
			height: opt.height,
			width: opt.width
		})
		setAttr(canvas,{
			'height': parseInt(opt.height)*opt.pixelRatio,
			'width': parseInt(opt.width)*opt.pixelRatio,
			'id': idStr
		})
		opt.el.appendChild(canvas);
		return canvas
	}
	/**
	 * [返回setCanvasPicURL函数，传递opt参数]
	 * @param {[objet]} opt  [总参数]
	 * @param {[object]} that [实例本身]
	 * @return {[function]}     [setCanvasPicURL参数是根据url渲染canvas]
	 */
	setCanvasPicURLCreater(opt,that){
		return function(urlPath){
			if(typeof urlPath === 'string'){
				that.readImgURL(opt,urlPath,true);
			}else{
				alert(`请输入正确图片地址`)
			}	
		}
	}
	/**
	 * [getResultCanvasCreater description]
	 * @param  {[object]} opt [总参数]
	 * @return {[function]}     [getResultCanvas 合并canvas]
	 */
	getResultCanvasCreater(opt){
		return function (){
			let download = document.createElement('canvas');
			setCss(download,{
				height: opt.height,
				width: opt.width,
			})
			setAttr(download,{
				'height': parseInt(opt.height)*opt.pixelRatio,
				'width': parseInt(opt.width)*opt.pixelRatio,
			})
			let downloadCtx = download.getContext('2d');
			downloadCtx.drawImage(opt.canvasBg,0,0);
			downloadCtx.drawImage(opt.canvasArea,0,0);
			downloadCtx.drawImage(opt.canvasWaterMark,0,0);
			return {
				download,
				downloadCtx
			}	
		}
	}
	/**
	 * [getInitValue 初始化和获取参数]
	 * @param  {[objet]} opt [总参数]
	 * @return {[undefined]}
	 */
	getInitValue(opt){
		// 获取范围和马赛克程度
		opt.operateArea = +opt.operateAreaEl.value;
		opt.operateLevel = +opt.operateLevelEl.value;
		// 获取工具类型
		opt.operateType = opt.operateTypeEl.value;
		opt.canvasSize = parseInt(opt.width)*opt.pixelRatio;
		opt.WMopacity = +opt.WMopacityEl.value;
	}
	/**
	 * [getPixelRatio 获取像素比例]
	 * @param  {[canvas]} context [canvas]
	 * @return {[number]}   [像素比例]
	 */
	getPixelRatio(context) {
	  	let backingStore = context.backingStorePixelRatio ||
	    	context.webkitBackingStorePixelRatio ||
	    	context.mozBackingStorePixelRatio ||
	    	context.msBackingStorePixelRatio ||
	    	context.oBackingStorePixelRatio ||
	    	context.backingStorePixelRatio || 1;
   		return (window.devicePixelRatio || 1) / backingStore;
	}
	/**
	 * [readImgURL 获取图片数据渲染canvas]
	 * @param  {[object]} opt    [总参数]
	 * @param  {[string]} imgUrl [图片地址]
	 * @param  {[boolean]} clear  [是否清除参数]
	 * @return {[undefined]}
	 */
	readImgURL(opt,imgUrl,clear){
		let canvasSize = opt.canvasSize;
		if(clear){
			opt.operateList = [];
			opt.canvasAreaCtx.clearRect(0, 0, canvasSize, canvasSize);
			opt.canvasBgCtx.clearRect(0, 0, canvasSize, canvasSize);	
		}
		let img = new Image();
		img.src = imgUrl;
		img.onload = function(e) {
			let canvasSize = opt.canvasSize,
				imageHeight = e.target.height,
				imageWidth = e.target.width,
				imgRatio = imageHeight/imageWidth,
				width,
				height,
				top,
				left;
			if(imgRatio > 1) {
				width = canvasSize/imgRatio,
				height = canvasSize,
				top = 0,
				left = (canvasSize-width)/2;
			}else if(imgRatio < 1) {
				width = canvasSize,
				height = imgRatio*canvasSize,
				top = (canvasSize-height)/2,
				left = 0;
			}
			opt.canvasBgCtx.drawImage(img,left, top, width, height)	
		}
		img.onerror = function(error){
			console.log(error)
			alert('请输入正确的图片地址')
		}
	}
	/**
	 * [getElemPos 获取element距离顶部的高度和左面的距离]
	 * @param  {[element]} el [dom]
	 * @return {[object]}    [距离左和上的距离]
	 */
	getElemPos(el) {
        let pos = {"top":0, "left":0};
     	if (el.offsetParent){
       		while (el.offsetParent){
         		pos.top += el.offsetTop;
         		pos.left += el.offsetLeft;
         		el = el.offsetParent;
       		}
 		}else if(el.x){
       		pos.left += el.x;
 		}else if(el.x){
       		pos.top += el.y;
     	}
         return {x:pos.left, y:pos.top};
	}
	/**
	 * [eventBind 事件绑定 所有的事件绑定都在里面]
	 * @param  {[object]} opt [总参数]
	 * @return {[undefined]}
	 */
	eventBind(opt){
		const that = this;
		/**
		 * [getXY 获取像素信息]
		 * @param  {[number]} p [序号]
		 * @param  {[array]} d [像素数据]
		 * @return {[array]}   [像素信息 一个点是4个信息 0-255]
		 */
		function getXY(p,d){
		    return [d[p],d[p+1],d[p+2],d[p+3]];
		}
		/**
		 * [setXY 设置像素数据]
		 * @param {[type]} p [description]
		 * @param {[type]} d [description]
		 * @param {[type]} c [description]
		 * @param {[type]} l [description]
		 */
		function setXY(p,d,c,l){
			// 这里判断渲染时一行错误数据的处理
			// (还未定位到距离问题，新的打码方式中不存在这个问题)
			if(l === 0){
				return 
			}
		    d[p-4] = c[0];
		    d[p-3] = c[1];
		    d[p-2] = c[2];
		    d[p-1] = c[3];
		}
		/**
		 * [convertCanvasToImage 下载生成图片]
		 * @param  {[element]} canvas [需要下载的canvas]
		 * @return {[undefined]}
		 */
		function convertCanvasToImage(canvas) {
			let aEl = document.createElement('a');
			setAttr(aEl,{
				'download': `${Date.now()}.png`,
				'href': canvas.toDataURL("image/png"),
				'target': '_blank'
			})
			window.document.body.appendChild(aEl);
			aEl.click();
		}
		/**
		 * [judgeChangeSize 判断是否在操作框内 (判断还存在不精准的]
		 * @param  {[object]} pos  [水印位置]
		 * @param  {[number]} size [操作框宽度]
		 * @param  {[number]} x    [鼠标x坐标]
		 * @param  {[number]} y    [鼠标y坐标]
		 * @return {[boolean|object]}      [返回false或者位置]
		 */
		function judgeChangeSize(pos,size,x,y){
			let arr = [
				{
					x:pos.left-size/2,
					y:pos.top-size/2,
					pos:{vertical:'top',horizontal:'left'}
				},
				{
					x:pos.left+pos.width,
					y:pos.top,
					pos:{vertical:'top',horizontal:'right'}
				},
				{
					x:pos.left,
					y:pos.top+pos.height,
					pos:{vertical:'bottom',horizontal:'left'}
				},
				{
					x:pos.left+pos.width,
					y:pos.top+pos.height,
					pos:{vertical:'bottom',horizontal:'right'}
				}
			];
			const length = arr.length;
			for(let i = 0;i<length;i++){
				if(arr[i].x < x && arr[i].x + size > x && arr[i].y < y && arr[i].y+size > y){
					return arr[i].pos
				}
			}
			return false
		}
		/**
		 * [drawFrame 画操作框]
		 * @param  {[element]} canvas      [操作框目标]
		 * @param  {[number]} options.size   [操作框大小]
		 * @param  {[number]} options.left   [canvas左距离]
		 * @param  {[number]} options.top    [canvas上距离]
		 * @param  {[number]} options.width  [canvas宽度]
		 * @param  {[number]} options.height [canvas高度]
		 * @return {[undefined]}
		 */
		function drawFrame(canvas,{size,left,top,width,height}){
			canvas.strokeRect(left-1, top-1, width+2,height+2);
			canvas.strokeRect(left-1-size/2, top-1-size/2, size,size);
			canvas.strokeRect(left-1-size/2+width, top-1-size/2, size,size);
			canvas.strokeRect(left-1-size/2, top-1-size/2+height, size,size);
			canvas.strokeRect(left-1-size/2+width, top-1-size/2+height, size,size);
		}
		// 图片上传
		opt.uploadImg.addEventListener('change',function(event){
			let url = window.URL.createObjectURL(event.target.files[0]);
			that.readImgURL(opt,url,true);
			// let fileReader = new FileReader();
			// fileReader.readAsDataURL(event.target.files[0]);
			// fileReader.onload =function(data){
			// 	let img = new Image();
			// 	img.src = data.target.result;
			// 	img.onload = function(){
			// 		let canvasSize = parseInt(opt.width)*2,
			// 			height = e.target.height,
			// 			width = e.target.width,
			// 			imgRatio = height/width,
			// 			imageWidth,
			// 			imageHeight,
			// 			top,
			// 			left;
			// 		if(imgRatio > 1) {
			// 			imageWidth = canvasSize/imgRatio,
			// 			imageHeight = canvasSize,
			// 			top = 0,
			// 			left = (canvasSize-imageWidth)/2;
			// 		}else if(imgRatio < 1) {
			// 			imageWidth = canvasSize,
			// 			imageHeight = imgRatio*canvasSize,
			// 			top = (canvasSize-imageHeight)/2,
			// 			left = 0;
			// 		}
			// 		opt.canvasBgCtx.drawImage(img,left, top, imageWidth, imageHeight)
			// 	}
			// }
		})
		// 创建图片事件
		opt.makeImgEl.addEventListener('click',function(){
			let {download} = that.getResultCanvas();
			convertCanvasToImage(download);
		})
		// 撤销操作事件
		opt.revertEl.addEventListener('click',function(){
			if(opt.operateList.length > 0){
				opt.canvasAreaCtx.putImageData(opt.operateList.pop(),0,0);	
			}
		})
		// 复原事件
		opt.reworkEl.addEventListener('click',function(){
			opt.canvasAreaCtx.clearRect(0,0,parseInt(opt.width)*opt.pixelRatio,parseInt(opt.width)*opt.pixelRatio);  
			opt.operateList = [];
		})
		// 范围监听
		opt.operateAreaEl.addEventListener('change',function(e){
			opt.operateArea = e.target.value
		})
		// 程度监听
		opt.operateLevelEl.addEventListener('change',function(e){
			opt.operateLevel = e.target.value
		})
		// 操作类型监听
		opt.operateTypeEl.addEventListener('change',function(e){
			opt.operateType = e.target.value
		})
		// 操作开始并记录当前图片数据
		opt.canvasOpe.addEventListener('mousedown',function(e){
			// 非选择模式并且没有开始打码状态 保存canvas数据 设置开始状态
			if(opt.operateType !== 'choose' && !opt.operateStart){
				opt.operateList.push(opt.canvasAreaCtx.getImageData(0,0,parseInt(opt.width)*opt.pixelRatio ,parseInt(opt.width)*opt.pixelRatio))
				opt.operateStart = true;
			// 选择模式并且存在水印
			}else if(opt.operateType === 'choose' && opt.WMInfo){
				let scrollTop = document.documentElement.scrollTop,
					{left,top,height,width} = opt.WMInfo,
					positionX = (e.clientX - opt.offsetLeft)*2,
					positionY = (e.clientY + scrollTop - opt.offsetTop)*2;
				// 判断鼠标位置是否在4个顶点框
				let changePos = judgeChangeSize({top,left,width,height},opt.size,positionX,positionY)
				if(changePos){
					// 在顶点框 设置形状状态为true
					opt.WMChangeSize = true;
					// 保存选中的框
					opt.changePos = {
						vertical : changePos.vertical,
						horizontal : changePos.horizontal,
						size: opt.size,
					}
					// 保存起点坐标 并退出mousedown
					opt.WMInfo.positionStartX = positionX;
					opt.WMInfo.positionStartY = positionY;
					return true	
				}else{
					opt.WMChangeSize = false;
				} 
				// 如果不在选择框判断是否在canvas中
				if(left < positionX && positionX < (left+width) && top < positionY && positionY< (top+height)){
					opt.WMclick = true;
					// 清除操作canvas
					opt.canvasOpeCtx.clearRect(0, 0, opt.canvasSize,opt.canvasSize);
					// 画操作框
					drawFrame(opt.canvasOpeCtx,{size:opt.size,left,top,width,height})
					// 保存起点坐标
					opt.WMInfo.positionStartX = positionX;
					opt.WMInfo.positionStartY = positionY	
				}else{
					opt.WMclick = false
				}
			}
		})
		// 操作结束标志
		opt.canvasOpe.addEventListener('mouseout',function(e){
			opt.operateStart = false;
			opt.WMclick = false;
			opt.WMChangeSize = false;
		})
		// 操作结束标志
		opt.canvasOpe.addEventListener('mouseup',function(e){
			// 判断选中状态
			if(opt.WMclick){
				let scrollTop = document.documentElement.scrollTop,
					positionX = (e.clientX - opt.offsetLeft)*2,
					positionY = (e.clientY + scrollTop - opt.offsetTop)*2;
				let {img,left,top,height,width,positionStartX,positionStartY} = opt.WMInfo;
				// 清除选中框画布
				opt.canvasOpeCtx.clearRect(0,0,opt.canvasSize,opt.canvasSize);
				opt.canvasWaterMarkCtx.clearRect(0,0,opt.canvasSize,opt.canvasSize);
				// 获取新的x和y的信息
				left = left+(positionX-positionStartX);
				top = top+(positionY-positionStartY);
				opt.WMInfo = {
					img,left, top, width,height
				}
				// 重画选中框
				drawFrame(opt.canvasOpeCtx,{size:opt.size,left,top,width,height})
				// 重画图片
				opt.canvasWaterMarkCtx.drawImage(img,left,top, width,height);
			}
			// 判断修改状态
			if(opt.WMChangeSize){
				let {img,left,top,height,width} = opt.changePos;
				opt.WMInfo = {
					img,left, top, width,height
				}
				// 清除选中框画布
				// opt.canvasOpeCtx.clearRect(0,0,opt.canvasSize,opt.canvasSize);
				// 清除水印画布
				opt.canvasWaterMarkCtx.clearRect(0,0,opt.canvasSize,opt.canvasSize);
				// 重画选中框
				// drawFrame(opt.canvasOpeCtx,{size:opt.size,left,top,width,height})
				// 重画水印canvas
				opt.canvasWaterMarkCtx.drawImage(img,left,top, width,height);
			}
			opt.operateStart = false;
			opt.WMclick = false;
		})
		// 移动动作
		// 画操作框
		// 动态计算马赛克or清除马赛克
		opt.canvasOpe.addEventListener('mousemove',function(e){
			let scrollTop = document.documentElement.scrollTop,
				positionX = (e.clientX - opt.offsetLeft - opt.operateArea/2)*2,
				positionY = (e.clientY + scrollTop - opt.offsetTop - opt.operateArea/2)*2,
				canvasSize = opt.canvasSize,
				operateArea = opt.operateArea*opt.pixelRatio;
			// 在Ope这层画工具框
			if(opt.operateType !== 'choose'){
				// 马赛克和擦除的选中框
				opt.canvasOpe.style.cursor = 'none';
				opt.canvasOpeCtx.clearRect(0, 0, canvasSize,canvasSize);
				opt.canvasOpeCtx.strokeRect(positionX, positionY, operateArea,operateArea);
			}
			// 判断是否在马赛克状态
			if(opt.operateStart && opt.operateType === 'mosaic'){
				let num = opt.operateLevel,
					imageDataSize = (operateArea/num|0+1)*num,
					// 获取操作内信息
					oImg = opt.canvasBgCtx.getImageData(positionX,positionY,operateArea,operateArea),
					w = oImg.width,
	            	d = oImg.data,
	            	dLength = d.length,
	            	stepW = w/num,
	            	point = 0.5*num|0;
	            //这里是循环画布的像素点
	            // 每个切分的方块来获取像素点并设置
	            for(let i=0;i<stepW;i++){
	                for(let j=0;j<stepW;j++){
	                    //获取一个小方格的随机颜色，这是小方格的随机位置获取的
	                    let row = i*num,
	                    	column = j*num,
	                    	mosaicP = 4*((row+point)*w+column+point),
	                    	color = getXY(mosaicP,d);
	                    //这里是循环小方格的像素点，
	                    for(let k=0;k<num;k++){
	                        for(let l=0;l<=num;l++){
	                            //设置小方格的颜色
                            	let setP = 4*((row+k)*w+column+l);
                            	setXY(setP,d,color,l);
	                        }
	                    }
	                }
	            }
	            // 渲染处理后数据
	            opt.canvasAreaCtx.putImageData(oImg,positionX,positionY);
			}else if(opt.operateStart && opt.operateType === 'clear'){
				// 擦除画布
				opt.canvasAreaCtx.clearRect(positionX,positionY,operateArea,operateArea);
			}else if(opt.operateType === 'choose'){
				// 选择画布中
				positionX += opt.operateArea;
				positionY += opt.operateArea;
				opt.canvasOpe.style.cursor = 'default';
				if(opt.WMclick && opt.WMInfo){
					// 移动事件
					let {left,top,height,width,positionStartX,positionStartY} = opt.WMInfo;
					opt.canvasOpeCtx.clearRect(0,0,canvasSize,canvasSize);
					drawFrame(opt.canvasOpeCtx,{size:opt.size,left,top,width,height})
					opt.canvasOpeCtx.strokeRect(left-1+(positionX-positionStartX), top-1+(positionY-positionStartY), width+2,height+2);
				}
				if(opt.WMChangeSize){
					// 修改大小事件
					let {img,left,top,height,width,positionStartX,positionStartY} = opt.WMInfo;
					opt.canvasOpeCtx.clearRect(0,0,canvasSize,canvasSize);
					let {vertical,horizontal} = opt.changePos;
					if(vertical === 'top' && horizontal === 'left'){
						left += positionX-positionStartX
						width -= positionX-positionStartX
						top += positionY-positionStartY
						height -= positionY-positionStartY
					}else if(vertical === 'top' && horizontal === 'right'){
						width += positionX-positionStartX
						top += positionY-positionStartY
						height -= positionY-positionStartY
					}else if(vertical === 'bottom' && horizontal === 'left'){
						left += positionX-positionStartX
						width -= positionX-positionStartX
						height += positionY-positionStartY
					}else if(vertical === 'bottom' && horizontal === 'right'){
						width += positionX-positionStartX
						height += positionY-positionStartY
					}
					drawFrame(opt.canvasOpeCtx,{size:opt.size,left,top,width,height})
					opt.changePos = {
						vertical,
						horizontal,
						left,
						top,
						width,
						height,
						img
					}
				}
			}
		})
		// 操作框移出范围清除
		opt.canvasOpe.addEventListener('mouseout',function(){
			let canvasSize = parseInt(opt.width)*opt.pixelRatio;
			opt.canvasOpeCtx.clearRect(0, 0, canvasSize, canvasSize);
		})
		// 上传水印图片 默认设置的总宽度的1/5
		opt.uploadWMFileEl.addEventListener('change',function(event){
			let imgUrl = window.URL.createObjectURL(event.target.files[0]);
			let img = new Image();
			img.src = imgUrl;
			img.onload = function(e) {
				let canvasSize = opt.canvasSize/5,
					imageHeight = e.target.height,
					imageWidth = e.target.width,
					imgRatio = imageHeight/imageWidth,
					width,
					height,
					top,
					left;
				if(imgRatio > 1) {
					width = canvasSize/imgRatio,
					height = canvasSize,
					top = 0,
					left = (canvasSize-width)/2;
				}else if(imgRatio < 1) {
					width = canvasSize,
					height = imgRatio*canvasSize,
					top = (canvasSize-height)/2,
					left = 0;
				}
				opt.canvasWaterMarkCtx.drawImage(img,left, top, width, height);
				opt.WMInfo = {
					img,left, top, width, height
				}	
			}
			img.onerror = function(error){
				console.log(error)
				alert('请输入正确的图片地址')
			}
		})
		// 水印透明度设置 (还未增加保存)
		opt.WMopacityEl.addEventListener('change',function(e){
			// 获取水印信息
			let {left, top, width, height} = opt.WMInfo,
				opacity = opt.WMopacity = +e.target.value;
			// 获取水印图片数据
			let imgInfo = opt.canvasWaterMarkCtx.getImageData(left,top,width,height),
				data = imgInfo.data,
				length = (width|0)*(height|0)*4|0;
			// 清除画板
			opt.canvasWaterMarkCtx.clearRect(0,0,opt.canvasSize,opt.canvasSize);
			// 遍历设置透明度
			for(let i = 3;i<length;i+=4){
				data[i] = (opacity/100*255)|0;
			}
			opt.canvasWaterMarkCtx.putImageData(imgInfo,left,top);
		})
	}
}