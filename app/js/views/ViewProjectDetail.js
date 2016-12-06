import ViewSlider from "./ViewSlider";

export default class ViewProjectDetail{

	constructor(el, data, closeCallback, loadedCallback, callbackScope){

		this._el = el;

		this.closeCallback = closeCallback;
		this.callbackScope = callbackScope;
		this.loadedCallback = loadedCallback;

		this._descrEl = document.createElement('p');
		this._descrEl.className = 'projectDescr';
		this._descrEl.innerHTML = data.descr;

		this._el.appendChild(this._descrEl);

		// var projectDetailCloseBtn = document.createElement('img');
		// projectDetailCloseBtn.className = 'projectDetailCloseBtn';
		// projectDetailCloseBtn.src = 'assets/icons/cancel.svg';

		// projectDetailCloseBtn.addEventListener('click', (e) => {
			
		// 	this.hide();
		// });

		// this._el.appendChild(projectDetailCloseBtn);

		var sliderWrapper = document.createElement('div');
		sliderWrapper.className = 'projectSlider';
		this._el.appendChild(sliderWrapper);
		this._slider = new ViewSlider(sliderWrapper, data, this.sliderLoaded, this);

	}

	sliderLoaded(){

		this.loadedCallback.call(this.callbackScope);

	}

	isSliderLoaded(){

		return this._slider.isLoaded;
	}

	show(){


		this._el.style.display = 'block';

		setTimeout(() => {
			this._el.style.opacity = 1;
			window.scrollTo(0,0);
		},800);

		// this._slider.currentIdx = 1;
		if (this._slider.currentIdx > -1)
			this._slider.hide(this._slider.currentIdx);
	
		this._slider.show(0);


		

	}

	hide(){

		setTimeout(() => {
			this._el.style.display = 'none';
		},500);
		
		this._el.style.opacity = 0;

		this.closeCallback.call(this.callbackScope);

	}

	onResize(w){
		this._slider.onResize(w);
	}
}