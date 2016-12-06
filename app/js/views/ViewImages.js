import ViewImage from "../views/ViewImage";

export default class ViewImages{

	constructor(el, images, imagesLoadedCallback, scope, mobileBreak) {

		this._el = el;

		this.mobileBreak;

		this.nrImages = images.length;
		this.images = images.slice();

		this.imagesLoadedCallback = imagesLoadedCallback;
		this.scope = scope;
		this.loadImage(this.images.shift());

		this.winH = undefined;

		this._viewImages = [];

		this.currScrollTop = -1;

		this.runUpdate = false;
		this.currentAnimation = {diff: undefined, start: undefined, end: undefined, current: undefined};

		this.isHidden = false;
	}

	loadImage(src){

		var img = new Image();
		img.onload = () => {
			this._el.appendChild(img);
			var viewImage = new ViewImage(img, this.nrImages - this._viewImages.length);
			this._viewImages.push(viewImage);
			if (this.images.length > 0)
				this.loadImage(this.images.shift());
			else{
				this.onResize(window.innerWidth, window.innerHeight);
				this.imagesLoadedCallback.call(this.scope);
			}
		};
		img.src = 'assets/'+src+'.png';
	}

	show(){

		this.isHidden = false;

		var currScrollTop = this.currScrollTop;
		var winH = this.winH;
		var currentIdx = Math.floor(currScrollTop / winH);

		window.scrollTo(0, currScrollTop);

		var scrollTop = 0;
		if (currentIdx == 0){
			scrollTop = winH;
			console.log('first');
		}
		else if (currentIdx == this.nrImages-1){
			console.log('last');
			scrollTop = currentIdx * winH;
		}else{
			scrollTop = winH * currentIdx - winH;
			console.log('mid');
		}

		currScrollTop -= winH;
		var diff = scrollTop - currScrollTop;
		this.currentAnimation.diff = diff;
		this.currentAnimation.start = currScrollTop;
		this.currentAnimation.current = 0.0;
		this.currentAnimation.type = 'show';
		this.runUpdate = true;

		

	}

	hide(){

		var currScrollTop = this.currScrollTop;
		var winH = this.winH;
		var currentIdx = Math.floor(currScrollTop / winH);
		
		var scrollTop = 0;
		if (currentIdx == 0){
			scrollTop = winH/2;
			console.log('first');
		}
		else if (currentIdx == this.nrImages-1){
			console.log('last');
			scrollTop = currentIdx * winH - winH/2;
		}else{
			scrollTop = winH * currentIdx + winH/2 - winH;
			console.log('mid');
		}

		currScrollTop -= winH;
		var diff = scrollTop - currScrollTop;
		this.currentAnimation.diff = diff;
		this.currentAnimation.start = currScrollTop;
		this.currentAnimation.current = 0.0;
		this.currentAnimation.type = 'hide';
		this.runUpdate = true;

	}

	update(){

		if (!this.runUpdate) return;

		var val = this.currentAnimation.diff * this.currentAnimation.current + this.currentAnimation.start;

		window.scrollTo(0,val);

		if (this.currentAnimation.current >= 1){
			if (this.currentAnimation.type == 'hide')
				this.isHidden = true;

			this.runUpdate = false;
		}
		else{
			this.currentAnimation.current += .05;
		}
	}

	onScroll(scrollTop){

		
		if (this.isHidden) return;

		if (this._viewImages.length == 0) return;

		var winH = this.winH;
		scrollTop += winH;
		var currentIdx = Math.floor(scrollTop / winH);
		if (currentIdx == this.nrImages) return;
		var prevIdx = currentIdx > 0 ? currentIdx - 1 : -1;
		var nextIdx = currentIdx < this.nrImages-1 ? currentIdx + 1 : -1;

		var normalized = Math.round(scrollTop % winH / winH * 100) / 100;
		var prevNormalized = 1 - normalized;
		var nextNormalized = 1 - normalized;

		if (currentIdx > -1){
			this._viewImages[currentIdx].update(normalized);
		}		

		if (prevIdx > -1){
			this._viewImages[prevIdx].update(prevNormalized);
		}
		
		
		this.currScrollTop = scrollTop;
		// console.log(currentIdx, normalized);

	}

	onResize(w,h){

		this.winH = h;


		for (var img of this._viewImages){
			img.onResize(w,h);
		}
	
	}

}
