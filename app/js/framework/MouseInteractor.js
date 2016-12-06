export default class MouseInteractor{

	constructor(camera, canvas){

		 this.camera = camera;
	    this.canvas = canvas;

	    this.dragging = false;
	    this.x = this.canvas.width/2;
	    this.y = this.canvas.height/2;
	    this.lastX = 0;
	    this.lastY = 0;
	    this.button = 0;
	    this.shift = false;
	    this.key = 0;

	    this.SENSITIVITY = 0.7;

	}

	setup(){

	    this.canvas.addEventListener('mousedown', (e) => {
	    	this._onMouseDown(e);
	    });
	    this.canvas.addEventListener('mousemove', (e) => {
	    	this._onMouseMove(e);
	    });
	    this.canvas.addEventListener('mouseup', (e) => {
	    	this._onMouseUp(e);
	    });
	};

	_onMouseDown(e){

	    this.dragging = true;
	    this.x = e.clientX;
	    this.y = e.clientY;
	    this.button = e.button;

	};

	_onMouseUp(e){
	    this.dragging = false;

	};

	_onMouseMove(e){

	    this.lastX = this.x;
	    this.lastY = this.y;
	    this.x = e.clientX;
	    this.y = e.clientY;

	    if (!this.dragging) return;
	    // this.shift = e.shiftKey;



	    // if (this.button == 0) {
	        // if(this.shift){
	    var dx=this.mousePosX(this.x) -this.mousePosX(this.lastX)
	    var dy=this.mousePosY(this.y) -this.mousePosY(this.lastY)

	    this.rotate(dx,dy);
	        // }
	        // else{
	        //     var dy = this.y - this.lastY;
	        //     this.translate(dy);
	        // }
	    // }

	};

	mousePosX(x){

	    return 2 * (x / this.canvas.width) - 1;

	};

	mousePosY(y){

	    return 2 * (y / this.canvas.height) - 1;

	};

	rotate(dx, dy){

	    const camera = this.camera;
	    camera.yaw(this.SENSITIVITY*dx);
	    camera.pitch(this.SENSITIVITY*dy);
	};
}