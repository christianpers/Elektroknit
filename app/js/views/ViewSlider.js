export default class ViewSlider{

	constructor(el, data, loadedCallback, callbackScope){

		this._el = el;

		this.loadedCallback = loadedCallback;
		this.callbackScope = callbackScope;

		this._containerEl = document.createElement('div');
		this._containerEl.className = 'sliderContainer';

		this._el.appendChild(this._containerEl);

		// this._innerEl = document.createElement('div');
		// this._innerEl.className = 'sliderInner';
		// this._containerEl.appendChild(this._innerEl);

		var arrowNext = document.createElement('img');
		arrowNext.className = 'sliderNext sliderNav';
		arrowNext.src = 'assets/icons/next.svg';
		arrowNext.addEventListener('click', () => {
			
			var hideIdx = this.currentIdx;
			var nextIdx = this.currentIdx;
			if (nextIdx >= this._items.length-1){
				nextIdx = 0;
			}else
				nextIdx++;

			

			setTimeout(() => {
				this.show(nextIdx);
			},600);

			setTimeout(() => {
				this.hide(hideIdx, nextIdx);
			},0);
		});

		var arrowPrev = document.createElement('img');
		arrowPrev.className = 'sliderPrev sliderNav';
		arrowPrev.src = 'assets/icons/back.svg';
		arrowPrev.addEventListener('click', () => {
			var hideIdx = this.currentIdx;
			var nextIdx = this.currentIdx;
			if (nextIdx == 0){
				nextIdx = this._items.length-1;
			}else
				nextIdx--;

			

			setTimeout(() => {
				this.show(nextIdx);
			},600);

			setTimeout(() => {
				this.hide(hideIdx, nextIdx);
			},0);
		});

		this._el.appendChild(arrowNext);
		this._el.appendChild(arrowPrev);

		this._assets = data.assets.slice();

		this.isLoaded = false;

		this._items = [];
		this.loadedCounter = 0;
		for (var asset of this._assets){
			var item = document.createElement('div');
			item.className = 'sliderItem';

			var img = new Image();
			img.onload = () => {
				this.loadedCounter++;
				if (this.loadedCounter == this._assets.length-1){
					this.loadedCallback.call(this.callbackScope);
					this.isLoaded = true;
					this.onResize(window.innerWidth);
				}
			};
			img.src = 'assets/projects/' + data.assetsFolder + '/' + asset;
			item.appendChild(img);

			this._containerEl.appendChild(item);

			this._items.push({item: item, 'img': img});
		}

		this.currentIdx = -1;

		// this.onResize(window.innerWidth);		
		
	}

	show(idx){

		// var translateX = this.currentWidth;
		// var leftX = -this.currentWidth;
		// if (idx > this.currentIdx){
		// 	translateX = -this.currentWidth;
		// 	leftX = this.currentWidth;
		// }
		// console.log('show: ',idx,' leftX: ',leftX, ' transX: ',translateX);
		// this._items[idx].item.style.left = leftX + 'px';
		// this._items[idx].item.style.transform = 'translate('+translateX+'px, 0px)';

		// this._el.style.height = this._items[idx].img.height * this._items[idx].ratio + 'px';

		this._items[idx].item.style[window.NS.transform] = 'scale(1)';
		this._items[idx].item.style.opacity = 1;
		this.currentIdx = idx;
	}

	hide(idx, nextIdx){

		// console.log('hide: ',idx, 'curridx: ',this.currentIdx);
		// var translateX = 0;
		// // var leftX = 0;
		// if (nextIdx > idx){
		// 	// leftX = 0;
		// 	translateX = -this.currentWidth * 2;
		// }
		// // this._items[idx].item.style.left = 0 + 'px';
		// this._items[idx].item.style.transform = 'translate('+translateX+'px, 0px)';

		this._items[idx].item.style[window.NS.transform] = 'scale(0.4)';
		this._items[idx].item.style.opacity = 0;

	}

	onResize(w){

		if (!this.isLoaded) return;

		var maxH = window.innerHeight - 20;
		var isMobile = w < 768 ? true : false;
		var wMult = isMobile ? .8 : .5;
		var outerW = w * wMult;

		this._el.style.width = outerW + 'px';
		
		this._containerEl.style.width = outerW + 'px';

		var sliderHeight = 0;

		for (var item of this._items){
			var ratio = outerW / item.img.width;
			item.ratio = ratio;
			var imgHeight = item.img.height * ratio;
			item.height = imgHeight;
			item.width = outerW;

			if (imgHeight > maxH){
				ratio = maxH / item.img.height;
				item.ratio = ratio;
				item.height = maxH;
				item.width = item.img.width * ratio;
			}
			if (sliderHeight < item.height)
				sliderHeight = item.height;
		}

		for (var item of this._items){
			item.item.style.width = item.width + 'px';
			if (item.width < outerW)
				item.item.style.left = (outerW/2) - (item.width/2) + 'px';
			item.item.style[window.NS.transform] = 'scale(0.4)';
			item.item.style.opacity = 0;

			item.item.style.top = (sliderHeight/2) - (item.height/2) + 'px';
			// item.item.style.marginTop = (sliderHeight/2) - (item.img.height)/2 + 'px';
			// item.item.style.left = -outerW + 'px';

			// var ratio = outerW / item.img.width;
			// var imgHeight = item.img.height * ratio;
			// if (sliderHeight < imgHeight)
			// 	sliderHeight = imgHeight;

		}



		this._el.style.height = sliderHeight + 'px';


		this.currentWidth = outerW;

		


	}
}