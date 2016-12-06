export default class ViewNavItem{

	constructor(el){

		this._el = el;

		this.timer = null;

	}

	show(delay){

		clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			this._el.style[window.NS.transform] = 'translate(0,0)';
		},delay);

	}

	hide(delay){

		clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			this._el.style[window.NS.transform] = 'translate(-200px,0)';
		},delay);

	}
}