import FreeCamera from '../cameras/FreeCamera';
import BaseCamera from '../cameras/BaseCamera';

export default class Scene {
	constructor() {
		this.canvas = document.getElementById('gl');
		this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');


		window.NS.GL.glContext = this.gl;

		this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
		this.gl.disable(this.gl.DEPTH_TEST);
		// this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
			// gl.enable(gl.CULL_FACE);
		// this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
		// this.gl.enable(this.gl.BLEND);
		this.gl.clearColor( 0, 0, 0, 1 );
		this.gl.clearDepth( 1 );
		// this.depthTextureExt = this.gl.getExtension("WEBKIT_WEBGL_depth_texture"); // Or browser-appropriate prefix
		this.floatTextureExt = this.gl.getExtension("OES_texture_float") // Or browser-appropriate prefix
		// this.deravitives = this.gl.getExtension("GL_OES_standard_derivatives");
		

		this.setCamera();
	}

	setCamera() {

		this.camera = new FreeCamera();

		this.orthoCamera = new BaseCamera('ortho');
		
	}

	loop() {

		this.update();
		this.render();
		
	}

	update() {

		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	}

	render() {
	}

	
}