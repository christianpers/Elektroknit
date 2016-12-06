import ViewNavItem from './ViewNavItem';

var DELAY_TIME = 50;

export default class ViewMobileMenu{

	constructor(el){

		this._el = el;

		setTimeout(() => {
			this._el.style.opacity = 1;
		},500);

		this.isActive = false;

		this._burgerEl = this._el.querySelector('.menuBurger');
		this._burgerEl.addEventListener('click', (e) => {
			this.onBurgerClick(e);
		});

		this._navItems = [];
		var navItems = this._el.querySelectorAll('.nav-item');
		for (var i=0;i<navItems.length;i++){
			var navItem = new ViewNavItem(navItems[i]);
			this._navItems.push(navItem);

			navItems[i].addEventListener('click', (e) => {
				this.onItemClick();
			});
		}

		this.isOpen = false;
	}

	onItemClick(){

		if (!this.isActive) return;

		this.hideMenu();
	}

	onBurgerClick(e){

		if (!this.isActive) return;

		e.preventDefault();

		this.isOpen ? this.hideMenu() : this.showMenu();

	}

	showMenu(){

		var delay = 0;
		for (var item of this._navItems){
			item.show(delay);

			delay += DELAY_TIME;
		}

		this.isOpen = true;

	}

	hideMenu(){

		var delay = (this._navItems.length-1) * DELAY_TIME;
		for (var item of this._navItems){
			item.hide(delay);

			delay -= DELAY_TIME;
		}

		this.isOpen = false;

	}

	onResize(w,h){

		this.isActive = w < 768 ? true : false;

	}
}