export default class Texture{

	constructor(source, isTexture){

		this.gl = window.NS.GL.glContext;
		

		if (isTexture == undefined)
			isTexture = isTexture == undefined ? false : true;
		// this.gl = GL.this.gl;
		if(isTexture) {
			this.texture = source;
		} else {
			this.texture = this.gl.createTexture();
			this._isVideo = (source.tagName == "VIDEO");


			this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
			this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
			this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, source);

			if(!this._isVideo) {
				this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
				this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
				this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
				this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
				this.gl.generateMipmap(this.gl.TEXTURE_2D);
			} else {
				this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
				this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
				this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
				this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
				this.gl.generateMipmap(this.gl.TEXTURE_2D);
			}

			this.gl.bindTexture(this.gl.TEXTURE_2D, null);
		}

	}

	updateTexture(source) {


		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
		this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, source);

		// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, texType, null);

		if(!this._isVideo) {
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
			this.gl.generateMipmap(this.gl.TEXTURE_2D);
		} else {
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
		}

		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	}


	bind(shader, index, toDebug) {
		if(index == undefined) index = 0;

		this.gl.activeTexture(this.gl.TEXTURE0 + index);
		// console.log( gl.TEXTURE0 + i, this._textures[i].texture );
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
		// gl.uniform1i(shaderProgram["samplerUniform"+i], i);
		// if(toDebug) console.log( GL.shader.uniformTextures[index], this );
		this.gl.uniform1i(shader.uniformTextures[index], index);
		this._bindIndex = index;
	}


	unbind() {
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	}
}