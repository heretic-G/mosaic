
class Mosaic {
	constructor (opt) {
		// 合并参数
		this.opt = Object.assign({},this.getDefaultOpt(),opt);
		// 创建canvas
		this.createMosaicCanvas(opt.el);
	}
	getDefaultOpt() {
		return {
			width: '500px',
			height: '500px',
			imgSrc: undefined,
		}
	}
	createMosaicCanvas(el) {
		el.style.position = 'relative';
		const canvasArr = ['canvasBg','canvasOpe','canvasArea']
		canvasArr.forEach((currVal,index,arr)=>{
			this[currVal] = this.createCanvasArrFun(currVal,el)
		})

	}
	createCanvasArrFun(idStr,parent){
		let canvas = document.createElement('canvas');
		canvas.style.height = this.opt.height;
		canvas.style.width = this.opt.width;
		canvas.style.position = 'absolute';
		canvas.style.top = 0;
		canvas.style.left = 0;
		canvas.setAttribute('id',idStr);
		parent.appendChild(canvas);
		return canvas
	}
}
const opt = {
	el: document.querySelector('#mosaic-con'),
	levelEl:document.querySelector('#level'),
	uploadImg:document.querySelector('#uploadFile'),
}
var mosaic = new Mosaic(opt);
console.log(mosaic);