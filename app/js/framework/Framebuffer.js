import Texture from '../framework/Texture';

export default class Framebuffer{

	constructor(width, height, magFilter, minFilter, texType, src){

		this.gl = window.NS.GL.glContext;

		this.id = '';

		this.texType = texType;
		this.width  = width;
		this.height = height;
		this.magFilter = magFilter==undefined ? this.gl.LINEAR : magFilter;
		this.minFilter = minFilter==undefined ? this.gl.LINEAR : minFilter;

		this.depthTextureExt 	= this.gl.getExtension("WEBKIT_WEBGL_depth_texture"); // Or browser-appropriate prefix

		this.texture            = this.gl.createTexture();
		this.depthTexture       = this.gl.createTexture();
		this.glTexture			= new Texture(this.texture, true);
		// this.glTexture.init(this.texture, true);
		this.glDepthTexture		= new Texture(this.depthTexture, true);
		// this.glDepthTexture.init(this.depthTexture, true);
		this.frameBuffer        = this.gl.createFramebuffer();		
		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);
		this.frameBuffer.width  = this.width;
		this.frameBuffer.height = this.height;
		var size                = this.width;



		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
	    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.magFilter);
	    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.minFilter);
	    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
		// if(this.magFilter == this.gl.NEAREST && this.minFilter == this.gl.NEAREST) 
		// 	this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, this.gl.RGBA, this.gl.FLOAT, null);
		// else
		// 	this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);

		if (!src)
			this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, this.gl.RGBA, texType, null);
		else
			this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, texType, src);

		// this.gl.generateMipmap(this.gl.TEXTURE_2D);

		this.gl.bindTexture(this.gl.TEXTURE_2D, this.depthTexture);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
		if(this.depthTextureExt != null)this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.DEPTH_COMPONENT, this.width, this.height, 0, this.gl.DEPTH_COMPONENT, this.gl.UNSIGNED_SHORT, null);

	    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture, 0);
	    if(this.depthTextureExt == null) {
	    	console.log( "no depth texture" );
	    	var renderbuffer = this.gl.createRenderbuffer();
	    	this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, renderbuffer);
	    	this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.frameBuffer.width, this.frameBuffer.height);
	    	this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, renderbuffer);
	    } else {
	    	this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.depthTexture, 0);
	    }
	    
	    

	    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
	    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

	}

	bind() {
		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);
	}


	unbind() {
		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
	}


	getTexture() {
		return this.glTexture;
	}


	getDepthTexture() {
		return this.glDepthTexture;
	}
}