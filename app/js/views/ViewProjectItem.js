import ViewProjectDetail from './ViewProjectDetail';

export default class ViewProjectItem{

	constructor(parentEl, data, openDetailCallback, closeDetailCallback, callbackScope){

		this.isMobile = false;

		this.openDetailCallback = openDetailCallback;
		this.closeDetailCallback = closeDetailCallback;
		this.callbackScope = callbackScope;

		var el = document.createElement('div');
		el.classList.add('projectItem');

		var loader = document.createElement('img');
		loader.classList.add('projectItemLoader');
		loader.src = '../assets/triangle.svg';
		el.appendChild(loader);
		this.loader = loader;

		var captionLayer = document.createElement('div');
		captionLayer.classList.add('itemCaption');

		var captionCopy = document.createElement('h5');
		captionCopy.innerHTML = data.title;

		captionLayer.appendChild(captionCopy);

		var openBtn = document.createElement('h5');
		openBtn.classList.add('projectOpenBtn');
		openBtn.innerHTML = 'VIEW';



		captionLayer.appendChild(openBtn);

		var touchLayer = document.createElement('div');
		touchLayer.classList.add('touchLayer');

		el.appendChild(touchLayer);
		el.appendChild(captionLayer);

		parentEl.appendChild(el);

		this._el = el;

		var img = new Image();
		img.onload = () => {
			this._el.appendChild(img);
		}
		img.src = '../assets/projects/' + data.frontAsset + '.jpg';

		this.touchLayer = touchLayer;
		this.captionLayer = captionLayer;

		this.captionVisible = false;

		var projectDetailEl = document.createElement('div');
		projectDetailEl.className = 'projectDetailWrapper';

		


		parentEl.appendChild(projectDetailEl);
		
		this._projectDetail = new ViewProjectDetail(projectDetailEl, data.detail, this.onDetailClose, this.onDetailLoaded, this);

		touchLayer.addEventListener('click', () => {
			if (!this._projectDetail.isSliderLoaded()) return;
			this.openDetailCallback.call(this.callbackScope);

			this._projectDetail.show();
		});
		

	}

	onDetailLoaded(){

		this.loader.style.display = 'none';
	}

	onDetailClose(){

		this.closeDetailCallback.call(this.callbackScope);

	}

	activateDesktop(){

		this.touchLayer.addEventListener('mouseover', () => {
			this.captionLayer.style.opacity = 1;
		});

		this.touchLayer.addEventListener('mouseout', () => {
			this.captionLayer.style.opacity = 0;
		});

		this.touchLayer.removeEventListener('click', () => {});

	}

	activateMobile(){

		this.touchLayer.removeEventListener('mouseover', () => {});
		this.touchLayer.removeEventListener('mouseout', () => {});

		this.touchLayer.addEventListener('click', (e) => {
			if (this.captionVisible){
				this.captionVisible = false;
				this.captionLayer.style.opacity = 0;
			}else{
				this.captionVisible = true;
				this.captionLayer.style.opacity = 1;
			}
		});

	}

	show(delay){

		this._el.style.display = 'block';
		

		setTimeout(() => {
			this._el.style.opacity = 1;
			this._el.style[window.NS.transform] = 'scale(1)';
		},delay + 200);
		
		
	}

	hide(delay){

		
		setTimeout(() => {
			this._el.style.opacity = 0;
			this._el.style[window.NS.transform] = 'scale(.92)';
		},delay);

		setTimeout(() => {
			this._el.style.display = 'none';
		},delay + 500);
		
	}

	onResize(x,y,w,h,winW){

		var isMobile = winW < 768 ? true : false;
		if (isMobile && !this.isMobile)
			this.activateMobile();
		else{
			this.activateDesktop();
		}


		this.isMobile = isMobile;


		this._el.style.left = x + 'px';
		this._el.style.top = y + 'px';
		this._el.style.width = w + 'px';
		this._el.style.height = h + 'px';

		this._projectDetail.onResize(winW);


	}
}