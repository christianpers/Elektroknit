import ViewImages from "./views/ViewImages";
import ViewAbout from "./views/ViewAbout";
import ViewProjects from "./views/ViewProjects";
import ViewContact from "./views/ViewContact";
import ViewMobileMenu from "./views/ViewMobileMenu";

var MOBILE_BREAK = 768;

export default class Main{

	constructor(data){


		this.DATA = data;

		this.currentShowingOverlay = null;

		// console.log(getVendorPrefix());

		

		console.log(window.NS.transform);

		
		

		this._mainLoaderGif = document.querySelector('.mainLoader');

		this._vImages = new ViewImages(document.getElementById('imageWrapper'), this.DATA.featured, this.featuredLoaded, this, MOBILE_BREAK);
		this._vAbout = new ViewAbout(document.querySelector('.overlay.about'), this.onOverlayHide, this);
		this._vProjects = new ViewProjects(document.querySelector('.overlay.projects'), this.onOverlayHide, this, this.DATA.projects, true);
		this._vContact = new ViewContact(document.querySelector('.overlay.contact'), this.onOverlayHide, this);

		this._vMobileMenu = new ViewMobileMenu(document.querySelector('.nav'));

		this._overlays = [];

		this._overlays[this._vAbout.dataId] = this._vAbout;
		this._overlays[this._vProjects.dataId] = this._vProjects;
		this._overlays[this._vContact.dataId] = this._vContact;

		var logo = document.querySelector('.logo');
		
		setTimeout(function(){
			logo.style.opacity = 1;
		},500);
		

	}

	onOverlayHide(){

		// document.body.style.overflow = 'visible';

		setTimeout(() => {
			this._vImages.show();
		},500);
		
	}

	featuredLoaded(){

		this._mainLoaderGif.style.display = 'none';

		this.onResize(window.innerWidth, window.innerHeight);

		var navItems = document.querySelectorAll('.nav-item');
		for (var i=0;i<navItems.length;i++){
			navItems[i].addEventListener('click', this.onNavClick.bind(this));
		}

		window.scrollTo(0, 0);
		this.onScroll();
		
		window.addEventListener('scroll', (e) => {
			this.onScroll(e);
		});
	}

	

	onNavClick(e){

		// debugger;

		if (e.target.nodeName !== 'A'){

			e.preventDefault();

			if (this._overlays[e.target.getAttribute('data-id')].showing) return;

			if (!this._vImages.isHidden){
				// document.body.style.overflow = 'hidden';

				this._vImages.hide();
			}
			
			for (var overlay in this._overlays){
				this._overlays[overlay]._hide();
			}
			
			setTimeout(() => {

				this._overlays[e.target.getAttribute('data-id')]._show();
			},1000);

		}
		

	}

	onScroll(e) {

		var scrollTop = getScrollTop();

		this._vImages.onScroll(scrollTop);

		function getScrollTop(){

			var ret = document.body.scrollTop;
 
			if (ret == 0)
			{
			    if (window.pageYOffset)
			        ret = window.pageYOffset;
			    else
			        ret = (document.body.parentElement) ? document.body.parentElement.scrollTop : 0;
			}

			return ret;
		}
	}

	update(){
		if (this._vImages)
			this._vImages.update();
	}

	onResize(w,h){
		document.body.style.height = this._vImages.nrImages * h + 'px'; 
		
		this._vImages.onResize(w, h);
		for (var overlay in this._overlays)
			this._overlays[overlay].onResize(w,h);

		this._vMobileMenu.onResize(w,h);
	}

}