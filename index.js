
class Mosaic {
	constructor (opt) {
		// 合并参数
		this.opt = Object.assign({},this.getDefaultOpt(),opt);
		// 获取比例
		this.opt.pixelRatio = this.getPixelRatio(document.createElement('canvas').getContext('2d'));
		// 创建canvas
		this.createMosaicCanvas(this.opt);
		let postion = this.getElemPos(this.opt.el)
		this.opt.offsetTop = postion.y;
		this.opt.offsetLeft = postion.x;
		this.eventBind(this.opt);
		this.getInitValue(this.opt)

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
		canvas.setAttribute('height',parseInt(opt.height)*2)
		canvas.setAttribute('width',parseInt(opt.width)*2)
		canvas.setAttribute('id',idStr);
		opt.el.appendChild(canvas);
		return canvas
	}
	getInitValue(opt){
		opt.operateAreaSize = opt.operateArea.value;
		opt.operateLevelSize = opt.operateLevel.value;
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
	readImgURL(opt){
		let img = new Image();
		img.src = opt.imgUrl;
		img.onload = function(e) {
			let canvasSize = parseInt(opt.width)*2,
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
		// 图片上传
		opt.uploadImg.addEventListener('change',function(event){
			let url = window.URL.createObjectURL(event.target.files[0]);
			let img = new Image();
			img.src = url;
			img.onload = function(e) {
				let canvasSize = parseInt(opt.width)*2,
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
		opt.operateArea.addEventListener('change',function(e){
			opt.operateAreaSize = e.target.value
		})
		opt.operateLevel.addEventListener('change',function(e){
			opt.operateLevelSize = e.target.value
		})
		// 操作范围
		opt.canvasOpe.addEventListener('mousemove',function(e){
			let scrollTop = document.documentElement.scrollTop,
				positionX = (e.clientX - opt.offsetLeft - opt.operateAreaSize/2)*2,
				positionY = (e.clientY + scrollTop - opt.offsetTop - opt.operateAreaSize/2)*2,
				canvasSize = parseInt(opt.width)*opt.pixelRatio,
				operateAreaSize = opt.operateAreaSize*opt.pixelRatio;
			opt.canvasOpeCtx.clearRect(0, 0, canvasSize,canvasSize);
			opt.canvasOpeCtx.strokeRect(positionX, positionY, operateAreaSize,operateAreaSize);
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
	operateArea: document.querySelector('#operateArea'),
	operateLevel: document.querySelector('#operateLevel'),
	// imgUrl:'./demo.jpg'
}
var mosaic = new Mosaic(opt);
console.log(mosaic);





