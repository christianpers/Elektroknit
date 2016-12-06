export default class ViewImage{

	constructor(el, idx) {

		this._el = el;
		this._idx = idx;

	}

	update(normalized){

	
		var opacity = Math.pow(normalized, 8);
		var scaleMult = this._isMobile ? 1.0 : 1.3;
		var scale = Math.pow(normalized, 3) * scaleMult;



		this._el.style[window.NS.transform] = 'scale('+scale+')';

		this._el.style.opacity = opacity;

	
	}

	onResize(w,h){

		this._isMobile = w < 768 ? true : false;
		this._el.style.marginLeft = - (this._el.width / 2) + 'px';
	}
	
}
