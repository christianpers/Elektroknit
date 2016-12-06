export default class TextureCreator{

	constructor(){

		this.canvas = document.createElement('canvas');
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.style.position = 'absolute';
		// this.canvas.style.opacity = 1;
		this.currentLetters = [];

		

		this.ctx = this.canvas.getContext('2d');

		this.ctx.fillStyle = 'white';
		this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
		// document.body.appendChild(this.canvas);

	}

	addLetter(letter){

		this.currentLetters.push(letter);
	}

	removeLetter(){

		this.currentLetters.pop();
	}

	reset(){

		this.ctx.fillStyle = 'white';
		this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
	}

	startPattern(e){

		// this.ctx.fillStyle = 'white';
		// this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);

		this.ctx.beginPath();
		var startX = e.x / window.innerWidth * this.canvas.width;
		var startY = e.y / window.innerHeight * this.canvas.height;
		this.ctx.moveTo(startX, startY);

	}

	endPattern(e){

		this.ctx.strokeStyle = 'black';
		// this.ctx.closePath();
		this.ctx.lineWidth = 20;
		this.ctx.stroke();
	}

	draw(e){

		var x = e.x / window.innerWidth * this.canvas.width;
		var y = e.y / window.innerHeight * this.canvas.height;

		this.ctx.lineTo(x,y);
	}

	getImage(){


		this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

		this.ctx.font = "60px Helvetica";
		// this.ctx.textBaseline = "middle";

		// var str = this.currentLetters.toString().replace(/,/g, "");
		var str = "ELEKTROKNIT";
		var strW = this.ctx.measureText(str);

		this.canvas.width = strW.width;
		this.canvas.height = 60;

		this.ctx.fillStyle = "rgba(255, 255, 255, 0.0)";
		this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);

		this.ctx.fillStyle = 'rgba(0, 0, 0, 0.0)';

		this.ctx.font = "60px Arial";
		this.ctx.strokeStyle = 'rgba(238,224,186,1.0)';
		this.ctx.textBaseline = "middle";
	    this.ctx.lineWidth = 1.2;
	    this.ctx.strokeText(str, 0, 30);
		
		this.ctx.font = "lighter 60px Arial";
		this.ctx.textBaseline = "middle";
		this.ctx.fillText(str, 0, 30);

		return this.canvas;

		// var imgData = this.canvas.toDataURL('image/png');

		// // debugger;

		// return imgData;

	}
}