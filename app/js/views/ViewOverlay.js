export default class ViewOverlay{

	constructor(el, onHideCallback, callbackScope, hasDetail = false) {

		this._el = el;

		this.dataId = this._el.getAttribute('data-id');

		this._el.style.transform = 'scale(.93)';

		this.onHideCallback = onHideCallback;
		this.callbackScope = callbackScope;

		this.hasDetail = hasDetail;

		this.closeBtn = document.querySelector('.closeBtn');
		this.onCloseBtnClickBound = this.onCloseBtnClick.bind(this);
		// var touchLayer = this._el.querySelector('.touchLayer');
		// touchLayer.addEventListener('click', () => {
		// 	this._hide();
		// 	this.onHideCallback.call(this.callbackScope);
		// });

		this.showing = false;
		// this.onResize(window.innerWidth, window.innerHeight);

	
	}

	toggle(){

		if (this.showing)
			this._hide();
		else
			this._show();
	}

	activateCloseBtn(){

		
		this.closeBtn.addEventListener('click', this.onCloseBtnClickBound);
	}

	onCloseBtnClick(){

		console.log('close btn');
		if (this.hasDetail){

			if (this.detailOpen){
				console.log('deatil open');
				for (var item of this.items){
					item._projectDetail.hide();
				}
			}else{
				this._hide();
				this.onHideCallback.call(this.callbackScope);
			}
		}else{
			this._hide();
			this.onHideCallback.call(this.callbackScope);
		}

	}

	inactivateCloseBtn(){

		this.closeBtn.removeEventListener('click', this.onCloseBtnClickBound);
	}

	_show(){

		this.activateCloseBtn();
		this._el.style.display = 'block';
		
		var self = this;
		setTimeout(function(){
			self._el.style.opacity = 1;
			self._el.style[window.NS.transform] = 'scale(1.0)';


			self.closeBtn.style.opacity = 1;
		},100);
		
		this.showing = true;

		window.scrollTo(0,0);
	}

	_hide(){

		this.inactivateCloseBtn();
		// this._el.style.transform = 'translate3d(0, -100%,0)';
		this._el.style.opacity = 0;
		this._el.style[window.NS.transform] = 'scale(.93)';

		this.closeBtn.style.opacity = 0;
		
		setTimeout(() => {
			this._el.style.display = 'none';

		},1000);
		this.showing = false;

		// this._el.style.height = '0';

	}

	
	

	update(){





	}

	render(){


	}

	onResize(w,h){

		

	}
	
}
