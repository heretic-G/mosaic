export function setCss(el,attr) {
	for(let i in attr){
		el.style[i] = attr[i]
	}
}
export function setAttr(el,attr) {
	for(let i in attr){
		el.setAttribute(i,attr[i])
	}
}
