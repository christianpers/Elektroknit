export default class SceneTransforms{

	constructor(canvas){

		this._stack = [];
		// this._camera = c;
		this._canvas = canvas;
		this._mvMatrix    = mat4.create();    // The Model-View matrix
		// this._pMatrix     = mat4.create();    // The projection matrix
		// this._nMatrix     = mat4.create();    // The normal matrix
		// this.cMatrix     = mat4.create();    // The camera matrix

		mat4.identity(this._mvMatrix);

		this.FIELD_OF_VIEW = 45 * Math.PI/180;

	}

	setCamera(c){

		this._camera = c;
	}

	calculateModelView(){

		// this._mvMatrix = this._camera.getViewTransform();
		mat4.multiply(this._mvMatrix,this._mvMatrix, this._camera.getViewMatrix());

		// var m = mat4.create();
		// mat4.invert(m, this._camera.getViewMatrix());

		// this._mvMatrix = m;


		
	}

	calculateNormal(){

		mat4.identity(this._nMatrix);
		mat4.copy(this._nMatrix, this._mvMatrix);
		mat4.invert(this._nMatrix, this._nMatrix);
		mat4.transpose(this._nMatrix, this._nMatrix);


	}

	calculatePerspective(){



		mat4.identity(this._pMatrix);
		mat4.perspective(this.FIELD_OF_VIEW, this._canvas.width / this._canvas.height, 0.1, 1000, this._pMatrix);
	}

	updatePerspective(w, h){

		mat4.perspective(this._pMatrix, SceneTransforms.FIELD_OF_VIEW, w / h, 0.1, 1000);	
	}

	resetPerspective(){

		mat4.identity(this._pMatrix);
	}


	setMatrixUniforms(){

		this.calculateNormal();
			
	}

	getMvMatrix(){

		// var m = mat4.create();
		// mat4.copy(m, this._mvMatrix);

		// return m;
		return this._mvMatrix;	
	}

	getProjectionMatrix(){

		// return this._pMatrix;
		return this._camera.getProjectionMatrix();
	}

	getNormalMatrix(){

		return this._nMatrix;	
	}

	pop(){

		if(this._stack.length == 0) return;
		this._mvMatrix = this._stack.pop();

	}

	push(){

		var memento = mat4.create();
		mat4.copy(memento, this._mvMatrix);
		this._stack.push(memento);

	}
}