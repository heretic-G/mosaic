
class Mosaic {
	constructor (opt) {
		// 合并参数
		this.opt = Object.assign({},this.getDefaultOpt(),opt);
		// 获取比例
		this.pixelRatio = this.getPixelRatio(document.createElement('canvas').getContext('2d'));
		// 创建canvas
		this.createMosaicCanvas(this.opt);
		this.eventBind(this.opt);
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
		const canvasArr = ['canvasBg','canvasOpe','canvasArea']
		canvasArr.forEach((currVal,index,arr)=>{
			opt[currVal] = this.createCanvasArrFun(currVal,opt)
			opt[`${currVal}Ctx`] = opt[currVal].getContext('2d')
		})
	}
	/*
	 *	@param context 
	 *	@return 
	 */
	createCanvasArrFun(idStr,opt){
		let canvas = document.createElement('canvas');
		canvas.style.position = 'absolute';
		canvas.style.top = 0;
		canvas.style.left = 0;
		canvas.style.height = opt.height;
		canvas.style.width = opt.width;
		canvas.setAttribute('height',parseInt(opt.height)*2)
		canvas.setAttribute('width',parseInt(opt.width)*2)
		canvas.setAttribute('id',idStr);
		opt.el.appendChild(canvas);
		return canvas
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
	eventBind(opt){
		// 图片上传
		opt.uploadImg.addEventListener('change',function(event){
			let url = window.URL.createObjectURL(event.target.files[0]);
			let img = new Image();
			img.src = url;
			img.onload = function(){
				opt.canvasBgCtx.drawImage(img,0,0,100,100)	
			}
			// let fileReader = new FileReader();
			// fileReader.readAsDataURL(event.target.files[0]);
			// fileReader.onload =function(data){
			// 	let img = new Image();
			// 	img.src = data.target.result;
			// 	img.onload = function(){
			// 		opt.canvasBgCtx.drawImage(img,0,0,100,100)	
			// 	}
			// }
		})
	}
}
const opt = {
	el: document.querySelector('#mosaic-con'),
	levelEl:document.querySelector('#level'),
	uploadImg:document.querySelector('#uploadFile'),
}
var mosaic = new Mosaic(opt);
console.log(mosaic);