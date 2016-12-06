import ShaderProgram from "./ShaderProgram";

export default class View{

	constructor(transforms, strVert, strFrag) {

		this.gl = window.NS.GL.glContext;

		this.transforms = transforms;

		this._enabledVertexAttrib = [];

		if(strVert == undefined) return;
		this.shader = new ShaderProgram(strVert, strFrag);
		
	}

	draw(mesh) {

		this.gl.uniformMatrix4fv(this.shader.prg.pMatrixUniform, false, this.transforms.getProjectionMatrix());
		this.gl.uniformMatrix4fv(this.shader.prg.mvMatrixUniform, false, this.transforms.getMvMatrix());
		
		// 	VERTEX POSITIONS
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.vBufferPos);
		var vertexPositionAttribute = this.getAttribLoc(this.shader.prg, "aVertexPosition");
		this.gl.vertexAttribPointer(vertexPositionAttribute, mesh.vBufferPos.itemSize, this.gl.FLOAT, this.gl.FALSE, 0, 0);
		if(this._enabledVertexAttrib.indexOf(vertexPositionAttribute) == -1) {
			this.gl.enableVertexAttribArray(vertexPositionAttribute);
			this._enabledVertexAttrib.push(vertexPositionAttribute);
		}

		

		if (mesh.textureUsed){
			//		TEXTURE COORDS
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.vBufferUV);
			var textureCoordAttribute = this.getAttribLoc(this.shader.prg, "aTextureCoord");
			this.gl.vertexAttribPointer(textureCoordAttribute, mesh.vBufferUV.itemSize, this.gl.FLOAT, this.gl.FALSE, 0, 0);
			// this.gl.enableVertexAttribArray(textureCoordAttribute);
			if(this._enabledVertexAttrib.indexOf(textureCoordAttribute) == -1) {
				this.gl.enableVertexAttribArray(textureCoordAttribute);
				this._enabledVertexAttrib.push(textureCoordAttribute);
			}
		}
		

		//	INDICES
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.iBuffer);

		//	EXTRA ATTRIBUTES
		for(var i=0; i<mesh.extraAttributes.length; i++) {
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.extraAttributes[i].buffer);
			var attrPosition = this.getAttribLoc(this.shader.prg, mesh.extraAttributes[i].name);
			this.gl.vertexAttribPointer(attrPosition, mesh.extraAttributes[i].itemSize, this.gl.FLOAT, this.gl.FALSE, 0, 0);
			this.gl.enableVertexAttribArray(attrPosition);		

			if(this._enabledVertexAttrib.indexOf(attrPosition) == -1) {
				this.gl.enableVertexAttribArray(attrPosition);
				this._enabledVertexAttrib.push(attrPosition);
			}
		}

		//	DRAWING
		// this.gl.drawElements(mesh.drawType, mesh.iBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);	
		if(mesh.drawType == this.gl.POINTS ) {
			this.gl.drawArrays(mesh.drawType, 0, mesh.vertexSize);	
		} else{
			this.gl.drawElements(mesh.drawType, mesh.iBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);
		} 


		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
		

		

	}

	getAttribLoc (shaderProgram, name) {
		if(shaderProgram.cacheAttribLoc  == undefined) shaderProgram.cacheAttribLoc = {};
		if(shaderProgram.cacheAttribLoc[name] == undefined) {
			shaderProgram.cacheAttribLoc[name] = this.gl.getAttribLocation(shaderProgram, name);
		}

		return shaderProgram.cacheAttribLoc[name];
	}
}