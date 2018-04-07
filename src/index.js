import Mosaic from './mosaic.js';

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