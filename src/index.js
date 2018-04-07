class Mosaic {
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
	/*
	 *	@param context 
	 *	@return 
	 */
	getDefaultOpt() {
		return {
			width: '500px',
			height: '500px',
			imgSrc: undefined,
			operateStart: false,
			operateList: [],
		}
	}
	createMosaicCanvas(opt) {
		opt.el.style.position = 'relative';
		opt.el.style.border = '1px solid black';
		opt.el.style.height = opt.height;
		opt.el.style.width = opt.width;
		const canvasArr = ['canvasBg','canvasArea','canvasWaterMark','canvasOpe']
		canvasArr.forEach((currVal,index,arr)=>{
			opt[currVal] = this.createCanvasArrFun(currVal,opt,index)
			opt[`${currVal}Ctx`] = opt[currVal].getContext('2d')
		})
	}
	createCanvasArrFun(idStr,opt,index){
		let canvas = document.createElement('canvas');
		canvas.style.position = 'absolute';
		canvas.style.top = 0;
		canvas.style.left = 0;
		canvas.style['z-index'] = index+1;
		canvas.style.height = opt.height;
		canvas.style.width = opt.width;
		canvas.setAttribute('height',parseInt(opt.height)*opt.pixelRatio)
		canvas.setAttribute('width',parseInt(opt.width)*opt.pixelRatio)
		canvas.setAttribute('id',idStr);
		opt.el.appendChild(canvas);
		return canvas
	}
	setCanvasPicURLCreater(opt,that){
		return function(urlPath){
			if(typeof urlPath === 'string'){
				that.readImgURL(opt,urlPath,true);
			}else{
				alert(`请输入正确图片地址`)
			}	
		}
	}
	getResultCanvasCreater(opt){
		return function (){
			let download = document.createElement('canvas');
			download.style.height = opt.height;
			download.style.width = opt.width;
			download.setAttribute('height',parseInt(opt.height)*opt.pixelRatio);
			download.setAttribute('width',parseInt(opt.width)*opt.pixelRatio);
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
	getInitValue(opt){
		// 获取范围和马赛克程度
		opt.operateArea = +opt.operateAreaEl.value;
		opt.operateLevel = +opt.operateLevelEl.value;
		// 获取工具类型
		opt.operateType = opt.operateTypeEl.value;
		opt.canvasSize = parseInt(opt.width)*opt.pixelRatio;
		opt.WMopacity = +opt.WMopacityEl.value;
	}
	/*
	 *	@param context 	(canvasEl) 
	 *	@return pixelRatio  (number)
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
	eventBind(opt){
		const that = this;
		function getXY(p,d,i,j){
		    return [d[p],d[p+1],d[p+2],d[p+3]];
		}
		function setXY(p,d,c,l){
			if(l === 0){
				return 
			}
		    d[p-4] = c[0];
		    d[p-3] = c[1];
		    d[p-2] = c[2];
		    d[p-1] = c[3];
		}
		function convertCanvasToImage(canvas) {
			let aEl = document.createElement('a');
			aEl.setAttribute('download',`${Date.now()}.png`);
			aEl.setAttribute('href',canvas.toDataURL("image/png"))
			aEl.setAttribute('target','_blank')
			window.document.body.appendChild(aEl);
			aEl.click();
		}
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
						}];
			const length = arr.length;
			for(let i = 0;i<length;i++){
				if(arr[i].x < x && arr[i].x + size > x && arr[i].y < y && arr[i].y+size > y){
					return arr[i].pos
				}
			}
			return false
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
			if(opt.operateType !== 'choose' &&!opt.operateStart){
				opt.operateList.push(opt.canvasAreaCtx.getImageData(0,0,parseInt(opt.width)*opt.pixelRatio ,parseInt(opt.width)*opt.pixelRatio))
				opt.operateStart = true	
			}else if(opt.operateType === 'choose' && opt.WMInfo){
				let scrollTop = document.documentElement.scrollTop,
					{left,top,height,width} = opt.WMInfo,
					positionX = (e.clientX - opt.offsetLeft)*2,
					positionY = (e.clientY + scrollTop - opt.offsetTop)*2;
				// 判断是不是要调整大小
				// 那就是要move
				let changePos = judgeChangeSize({top,left,width,height},10,positionX,positionY)
				if(changePos){
					opt.WMChangeSize = true;
					opt.changePos = {
						vertical : changePos.vertical,
						horizontal : changePos.horizontal,
						size: 10,
					}
					opt.WMInfo.positionStartX = positionX;
					opt.WMInfo.positionStartY = positionY;
					return true	
				}else{
					opt.WMChangeSize = false;
				} 
				if(left < positionX && positionX < (left+width) && top < positionY && positionY< (top+height)){
					opt.WMclick = true;
					opt.canvasOpeCtx.clearRect(0, 0, opt.canvasSize,opt.canvasSize);
					opt.canvasOpeCtx.strokeRect(left-1, top-1, width+2,height+2);
					opt.canvasOpeCtx.strokeRect(left-6, top-6, 10,10);
					opt.canvasOpeCtx.strokeRect(left-6+width, top-6, 10,10);
					opt.canvasOpeCtx.strokeRect(left-6, top-6+height, 10,10);
					opt.canvasOpeCtx.strokeRect(left-6+width, top-6+height, 10,10);
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
			if(opt.WMclick){
				let scrollTop = document.documentElement.scrollTop,
					positionX = (e.clientX - opt.offsetLeft)*2,
					positionY = (e.clientY + scrollTop - opt.offsetTop)*2;
				let {img,left,top,height,width,positionStartX,positionStartY} = opt.WMInfo;
				opt.canvasOpeCtx.clearRect(0,0,opt.canvasSize,opt.canvasSize);
				opt.canvasWaterMarkCtx.clearRect(0,0,opt.canvasSize,opt.canvasSize);
				left = left+(positionX-positionStartX);
				top = top+(positionY-positionStartY);
				opt.WMInfo = {
					img,left, top, width,height
				}
				opt.canvasOpeCtx.strokeRect(left-1, top-1, width+2,height+2);
				opt.canvasOpeCtx.strokeRect(left-6, top-6, 10,10);
				opt.canvasOpeCtx.strokeRect(left-6+width, top-6, 10,10);
				opt.canvasOpeCtx.strokeRect(left-6, top-6+height, 10,10);
				opt.canvasOpeCtx.strokeRect(left-6+width, top-6+height, 10,10);
				opt.canvasWaterMarkCtx.drawImage(img,left,top, width,height);
			}
			if(opt.WMChangeSize){
				let {img,left,top,height,width} = opt.changePos;
				opt.WMInfo = {
					img,left, top, width,height
				}
				opt.canvasOpeCtx.clearRect(0,0,opt.canvasSize,opt.canvasSize);
				opt.canvasWaterMarkCtx.clearRect(0,0,opt.canvasSize,opt.canvasSize);
				opt.canvasOpeCtx.strokeRect(left-1, top-1, width+2,height+2);
				opt.canvasOpeCtx.strokeRect(left-6, top-6, 10,10);
				opt.canvasOpeCtx.strokeRect(left-6+width, top-6, 10,10);
				opt.canvasOpeCtx.strokeRect(left-6, top-6+height, 10,10);
				opt.canvasOpeCtx.strokeRect(left-6+width, top-6+height, 10,10);
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
				opt.canvasOpe.style.cursor = 'none';
				opt.canvasOpeCtx.clearRect(0, 0, canvasSize,canvasSize);
				opt.canvasOpeCtx.strokeRect(positionX, positionY, operateArea,operateArea);
			}
			if(opt.operateStart && opt.operateType === 'mosaic'){
				let num = opt.operateLevel,
					imageDataSize = (operateArea/num|0+1)*num,
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
	            opt.canvasAreaCtx.putImageData(oImg,positionX,positionY);
			}else if(opt.operateStart && opt.operateType === 'clear'){
				opt.canvasAreaCtx.clearRect(positionX,positionY,operateArea,operateArea);
			}else if(opt.operateType === 'choose'){
				positionX += opt.operateArea;
				positionY += opt.operateArea;
				opt.canvasOpe.style.cursor = 'default';
				if(opt.WMclick && opt.WMInfo){
					let {left,top,height,width,positionStartX,positionStartY} = opt.WMInfo;
					opt.canvasOpeCtx.clearRect(0,0,canvasSize,canvasSize);
					opt.canvasOpeCtx.strokeRect(left-1, top-1, width+2,height+2);
					opt.canvasOpeCtx.strokeRect(left-6, top-6, 10,10);
					opt.canvasOpeCtx.strokeRect(left-6+width, top-6, 10,10);
					opt.canvasOpeCtx.strokeRect(left-6, top-6+height, 10,10);
					opt.canvasOpeCtx.strokeRect(left-6+width, top-6+height, 10,10);
					opt.canvasOpeCtx.strokeRect(left-1+(positionX-positionStartX), top-1+(positionY-positionStartY), width+2,height+2);
				}
				if(opt.WMChangeSize){
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
					opt.canvasOpeCtx.strokeRect(left-1, top-1, width+2,height+2);
					opt.canvasOpeCtx.strokeRect(left-6, top-6, 10,10);
					opt.canvasOpeCtx.strokeRect(left-6+width, top-6, 10,10);
					opt.canvasOpeCtx.strokeRect(left-6, top-6+height, 10,10);
					opt.canvasOpeCtx.strokeRect(left-6+width, top-6+height, 10,10);
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
		opt.WMopacityEl.addEventListener('change',function(e){
			let {left, top, width, height} = opt.WMInfo,
				opacity = opt.WMopacity = +e.target.value;
			let imgInfo = opt.canvasWaterMarkCtx.getImageData(left,top,width,height),
				data = imgInfo.data,
				length = (width|0)*(height|0)*4|0;
			opt.canvasWaterMarkCtx.clearRect(0,0,opt.canvasSize,opt.canvasSize);
			for(let i = 3;i<length;i+=4){
				data[i] = (opacity/100*255)|0;
			}
			opt.canvasWaterMarkCtx.putImageData(imgInfo,left,top);
		})
	}
}
const opt = {
	el: document.querySelector('#mosaic-con'),
	levelEl: document.querySelector('#level'),
	uploadImg: document.querySelector('#uploadFile'),
	operateAreaEl: document.querySelector('#operateArea'),
	operateTypeEl: document.querySelector('#tool-type'),
	reworkEl: document.querySelector('#rework'),
	revertEl: document.querySelector('#revert'),
	makeImgEl: document.querySelector('#makeImg'),
	operateLevelEl: document.querySelector('#operateLevel'),
	uploadWMFileEl: document.querySelector('#uploadWMFile'),
	WMRepeatEl: document.querySelector('#WMRepeat'),
	WMopacityEl: document.querySelector('#WMopacity'),
	// imgUrl:'./demo.jpg'
}
let mosaic = new Mosaic(opt);
window._mosaic = mosaic;
console.log(mosaic);





