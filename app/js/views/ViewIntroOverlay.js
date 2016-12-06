export default class ViewIntroOverlay{

	constructor(el) {

		this._el = el;

		this._el.style.top = 0;

		this._canvas = document.createElement('canvas');
		this._el.appendChild(this._canvas);

		this._ctx = this._canvas.getContext('2d');

		this.scale = 1;

		this.duration = 3000;
		this.lastTime = null;

		this.doUpdate = true;

		this.amount = 0;


		this.onResize(window.innerWidth, window.innerHeight);

	
	}

	

	update(){

		if (!this.lastTime)
			this.lastTime = Date.now();
		else{
			var now = Date.now();
			var diff = now - this.lastTime;

			var normalized = Math.round( (diff / this.duration) * 1000 )/1000;
			this.scale = 1 + Math.pow(normalized,4);
		}



	}

	render(){

		this._ctx.clearRect(0,0,this._canvas.width, this._canvas.height);

		this._ctx.fillStyle = 'white';
		this._ctx.fillRect(0,0,this._canvas.width, this._canvas.height);

		this._ctx.save();

		this._ctx.translate(this._canvas.width/2, this._canvas.height/2);
		this._ctx.scale(this.scale, this.scale);
		this._ctx.font = "bold 140px Arial";

		this._ctx.globalCompositeOperation = 'destination-out';
		this._ctx.fillText("ELECTROKNIT", -500, 40);

		this._ctx.restore();

		this._el.style.opacity = 6 - this.scale;



		if (this.scale > 6){
			this.doUpdate = false;
			return;
		}

		this.amount = 6 - this.scale;

	}

	onResize(w,h){

		this._canvas.width = w;
		this._canvas.height = h;

	}
	
}
