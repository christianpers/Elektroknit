export default class ImageLoader{

	constructor(images, loadedCallback, callbackScope){

		this.images = images.slice();
		this.load(this.images.pop());

		this.loadedImgs = [];
		this.loadedCallback = loadedCallback;
		this.callbackScope = callbackScope;

	}

	load(srcObj){

		var img = new Image();
		img.onload = () => {
			this.loadedImgs[srcObj.id] = img;
			if (this.images.length > 0)
				this.load(this.images.pop());
			else{
				this.loadedCallback.call(this.callbackScope, this.loadedImgs);
			}
		}
		img.src = srcObj.src;

	}

}