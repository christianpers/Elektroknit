import ViewOverlay from './ViewOverlay';
import ViewProjectItem from './ViewProjectItem';


export default class ViewProjects extends ViewOverlay{

	constructor(el, onHideCallback, callbackScope, projectsData, hasDetail){

		super(el, onHideCallback, callbackScope, hasDetail);

		this.projectsContainer = this._el.querySelector('.projectsContainer');

		this.ITEMS_PER_ROW = 3;
		this.ITEMS_PER_ROW_MOBILE = 1;
		this.MOBILE_BREAK = 768;
		this.MARGIN = 10;

		this.items = [];
		for (var projectData of projectsData){
			var item = new ViewProjectItem(this.projectsContainer, projectData, this.onDetailOpen, this.onDetailClose, this);
			this.items.push(item);


		}

		this.detailOpen = false;



	}

	onDetailOpen(){

		var delay = 0;
		for (var item of this.items){
			item.hide(delay+= 100);
		}

		this.detailOpen = true;
		// this.closeBtn.style.display = 'none';

	}

	onDetailClose(){

		var delay = (this.items.length-1) * 100;
		for (var item of this.items){
			item.show(delay -= 100);
		}

		this.detailOpen = false;
		// this.closeBtn.style.display = 'block';
	}

	onResize(w,h){

		var isMobile = w < this.MOBILE_BREAK ? true : false;
		var wMult = isMobile ? .9 : .8;
		var containerW = w * wMult;
		this.projectsContainer.style.width = containerW + 'px';

		var itemsPerRow = isMobile ? this.ITEMS_PER_ROW_MOBILE : this.ITEMS_PER_ROW;

		var itemW = Math.floor(containerW / itemsPerRow);

		var currentX = 0;
		var currentY = 0;
		var idx = 1;

		var itemH = itemW;


		for (var item of this.items){
			item.onResize(currentX, currentY, itemW, itemH, w);
			if (idx % itemsPerRow == 0){
				if (idx > 0){
					currentY += itemH + this.MARGIN;
				}
				currentX = 0;
			}else{
				currentX += itemW + this.MARGIN;
			}

			idx++;
		}

		var containerH = this.items.length * (itemH + this.MARGIN);
		// this._el.style.height = containerH + 'px';
	}
}