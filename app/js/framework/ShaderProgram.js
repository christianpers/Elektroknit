export default class ShaderProgram {
	constructor(vertexShader, fragmentShader) {

		this.gl = window.NS.GL.glContext;

		this.vertexShader = undefined;
		this.fragmentShader = undefined;

		this.vertexShader = this.createShaderProgram(vertexShader, true);
		this.fragmentShader = this.createShaderProgram(fragmentShader, false);
		this.parameters = [];

		this.prg = this.gl.createProgram();
		this.gl.attachShader(this.prg, this.vertexShader);
		this.gl.attachShader(this.prg, this.fragmentShader);
		this.gl.linkProgram(this.prg);
		this._isReady = true;
	}

	createShaderProgram(str, isVertexShader) {
		var shader = isVertexShader ? this.gl.createShader(this.gl.VERTEX_SHADER) : this.gl.createShader(this.gl.FRAGMENT_SHADER);

		this.gl.shaderSource(shader, str);
		this.gl.compileShader(shader);

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			alert(this.gl.getShaderInfoLog(shader));
			return null;
		}

		return shader;
	}

	bind() {

		this.gl.useProgram(this.prg);

		if (!this.prg) debugger;

		if(this.prg.pMatrixUniform == undefined) this.prg.pMatrixUniform = this.gl.getUniformLocation(this.prg, "uPMatrix");
		if(this.prg.mvMatrixUniform == undefined) this.prg.mvMatrixUniform = this.gl.getUniformLocation(this.prg, "uMVMatrix");

		
		this.uniformTextures = [];

	}

	uniform(name, type, value) {

		if(type == "texture") type = "uniform1i";
	
		var hasUniform = false;
		var oUniform;
		for(var i=0; i<this.parameters.length; i++) {
			oUniform = this.parameters[i];
			if(oUniform.name == name) {
				oUniform.value = value;
				hasUniform = true;
				break;
			}
		}

		if(!hasUniform) {
			this.prg[name] = this.gl.getUniformLocation(this.prg, name);
			this.parameters.push( {name:name, type:type, value:value, uniformLoc:this.prg[name]} );
		} else {
			this.prg[name] = oUniform.uniformLoc;
		}


		if(type.indexOf("Matrix") == -1) {
			this.gl[type](this.prg[name], value);
		} else {
			this.gl[type](this.prg[name], false, value);
		}

		if(type == "uniform1i") {	//	TEXTURE
			this.uniformTextures[value] = this.prg[name];
			// if(name == "textureForce") console.log( "Texture Force : ",  this.uniformTextures[value], value );
		}

	}

	unbind() {


	}

	isReady() {
		return this._isReady;
	}

}

