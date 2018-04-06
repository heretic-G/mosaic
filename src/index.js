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
		this.setCanvasPicURL = this.setCanvasPicURLCreater(opt)
		// 事件绑定 所有的事件绑定处理都在这里
		this.eventBind(opt);
		// 初始化值(一些值根据dom的value来改变这里获取一次)
		this.getInitValue(opt)


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
	/*
	 *	@param context 
	 *	@return 
	 */
	createMosaicCanvas(opt) {
		opt.el.style.position = 'relative';
		opt.el.style.border = '1px solid black';
		opt.el.style.height = opt.height;
		opt.el.style.width = opt.width;
		const canvasArr = ['canvasBg','canvasArea','canvasOpe']
		canvasArr.forEach((currVal,index,arr)=>{
			opt[currVal] = this.createCanvasArrFun(currVal,opt,index)
			opt[`${currVal}Ctx`] = opt[currVal].getContext('2d')
		})
	}
	/*
	 *	@param context 
	 *	@return 
	 */
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
	setCanvasPicURLCreater(opt){
		return function(urlPath){
			if(typeof urlPath === 'string'){
				this.readImgURL(opt,urlPath,true);
			}else{
				alert(`请输入正确图片地址`)
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
	}
	/*
	 *	@param context 
	 *	@return 
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
				height = e.target.height,
				width = e.target.width,
				imgRatio = height/width,
				imageWidth,
				imageHeight,
				top,
				left;
			if(imgRatio > 1) {
				imageWidth = canvasSize/imgRatio,
				imageHeight = canvasSize,
				top = 0,
				left = (canvasSize-imageWidth)/2;
			}else if(imgRatio < 1) {
				imageWidth = canvasSize,
				imageHeight = imgRatio*canvasSize,
				top = (canvasSize-imageHeight)/2,
				left = 0;
			}
			opt.canvasBgCtx.drawImage(img,left, top, imageWidth, imageHeight)	
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
		opt.makeImgEl.addEventListener('click',function(){
			let download = document.createElement('canvas');
			download.style.height = opt.height;
			download.style.width = opt.width;
			download.setAttribute('height',parseInt(opt.height)*opt.pixelRatio);
			download.setAttribute('width',parseInt(opt.width)*opt.pixelRatio);
			let downloadCtx = download.getContext('2d');
			downloadCtx.drawImage(opt.canvasBg,0,0);
			downloadCtx.drawImage(opt.canvasArea,0,0);
			convertCanvasToImage(download);
		})
		opt.revertEl.addEventListener('click',function(){
			if(opt.operateList.length > 0){
				opt.canvasAreaCtx.putImageData(opt.operateList.pop(),0,0);	
			}
		})
		opt.reworkEl.addEventListener('click',function(){
			opt.canvasAreaCtx.clearRect(0,0,parseInt(opt.width)*opt.pixelRatio,parseInt(opt.width)*opt.pixelRatio);  
			opt.operateList = [];
		})
		opt.operateAreaEl.addEventListener('change',function(e){
			opt.operateArea = e.target.value
		})
		opt.operateLevelEl.addEventListener('change',function(e){
			opt.operateLevel = e.target.value
		})
		opt.operateTypeEl.addEventListener('change',function(e){
			opt.operateType = e.target.value
		})
		// 操作范围
		opt.canvasOpe.addEventListener('mousedown',function(e){
			if(!opt.operateStart){
				opt.operateList.push(opt.canvasAreaCtx.getImageData(0,0,parseInt(opt.width)*opt.pixelRatio ,parseInt(opt.width)*opt.pixelRatio))
				opt.operateStart = true	
			}
		})
		opt.canvasOpe.addEventListener('mouseout',function(e){
			opt.operateStart = false
		})
		opt.canvasOpe.addEventListener('mouseup',function(e){
			opt.operateStart = false
		})
		opt.canvasOpe.addEventListener('mousemove',function(e){
			let scrollTop = document.documentElement.scrollTop,
				positionX = (e.clientX - opt.offsetLeft - opt.operateArea/2)*2,
				positionY = (e.clientY + scrollTop - opt.offsetTop - opt.operateArea/2)*2,
				canvasSize = opt.canvasSize,
				operateArea = opt.operateArea*opt.pixelRatio;
			// 在Ope这层画工具框
			opt.canvasOpeCtx.clearRect(0, 0, canvasSize,canvasSize);
			opt.canvasOpeCtx.strokeRect(positionX, positionY, operateArea,operateArea);
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
			}
		})
		opt.canvasOpe.addEventListener('mouseout',function(){
			let canvasSize = parseInt(opt.width)*opt.pixelRatio;
			opt.canvasOpeCtx.clearRect(0, 0, canvasSize, canvasSize);
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
	// imgUrl:'./demo.jpg'
}
let mosaic = new Mosaic(opt);
window._mosaic = mosaic;
console.log(mosaic);





