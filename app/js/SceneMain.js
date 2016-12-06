import Scene from "./framework/Scene";
import ViewCopy from "./views/ViewCopy";
import ViewPoints from "./views/ViewPoints";

// import MouseInteractor from "./framework/MouseInteractor";
// import KeyboardInteractor from "./framework/KeyboardInteractor";
import SceneTransforms from "./framework/SceneTransforms";
import Framebuffer from "./framework/Framebuffer";
import Texture from "./framework/Texture";
// import ImageLoader from "./framework/ImageLoader";
// import TextureCreator from "./framework/TextureCreator";

var grad3 = [[0,1,1],[0,1,-1],[0,-1,1],[0,-1,-1],
                   [1,0,1],[1,0,-1],[-1,0,1],[-1,0,-1],
                   [1,1,0],[1,-1,0],[-1,1,0],[-1,-1,0], // 12 cube edges
                   [1,0,-1],[-1,0,-1],[0,-1,1],[0,1,1]]; // 4 more to make 16

var perm = [151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
  5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
  49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

var simplex4 = [
  [0,64,128,192],[0,64,192,128],[0,0,0,0],[0,128,192,64],
  [0,0,0,0],[0,0,0,0],[0,0,0,0],[64,128,192,0],
  [0,128,64,192],[0,0,0,0],[0,192,64,128],[0,192,128,64],
  [0,0,0,0],[0,0,0,0],[0,0,0,0],[64,192,128,0],
  [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
  [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
  [64,128,0,192],[0,0,0,0],[64,192,0,128],[0,0,0,0],
  [0,0,0,0],[0,0,0,0],[128,192,0,64],[128,192,64,0],
  [64,0,128,192],[64,0,192,128],[0,0,0,0],[0,0,0,0],
  [0,0,0,0],[128,0,192,64],[0,0,0,0],[128,64,192,0],
  [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
  [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
  [128,0,64,192],[0,0,0,0],[0,0,0,0],[0,0,0,0],
  [192,0,64,128],[192,0,128,64],[0,0,0,0],[192,64,128,0],
  [128,64,0,192],[0,0,0,0],[0,0,0,0],[0,0,0,0],
  [192,64,0,128],[0,0,0,0],[192,128,0,64],[192,128,64,0]
];



export default class SceneMain extends Scene {
	constructor(container) {

		super();
		this.container = container;
		
		

		this.doRender = false;

		this.orthoTransforms = new SceneTransforms(this.canvas);

		
		this.initTextures();
		this.initViews();
		this.createNoiseTexture();

		
		this.doRender = true;
		this.container.style.opacity = 1;

	}

	createNoiseTexture() {

		// PERM TEXTURE
		var pixels = new Uint8Array(256 * 256 * 4);
		
		var permTexture = this.gl.createTexture();
		this.gl.bindTexture(this.gl.TEXTURE_2D, permTexture);

		for(var i = 0; i<256; i++){
			for(var j = 0; j<256; j++) {
			  var offset = (i*256+j)*4;
			  var value = perm[(j+perm[i]) & 0xFF];
			  pixels[offset] = grad3[value & 0x0F][0] * 64 + 64;   // Gradient x
			  pixels[offset+1] = grad3[value & 0x0F][1] * 64 + 64; // Gradient y
			  pixels[offset+2] = grad3[value & 0x0F][2] * 64 + 64; // Gradient z
			  pixels[offset+3] = value;                     // Permuted index
			}
		}
		
		this.gl.texImage2D( this.gl.TEXTURE_2D, 0, this.gl.RGBA, 256, 256, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixels );
		this.gl.texParameteri( this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST );
		this.gl.texParameteri( this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST );

		this._permTexture = new Texture(permTexture, true);
		

		// SIMPLEX TEXTURE
		var test = new Uint8Array(64 * 1 * 4);
		
		var index = 0;
		for (var i=0;i<simplex4.length;i++){
			for (var j=0;j<simplex4[i].length;j++){

				test[index] = simplex4[i][j];

				index++;
			}
		}

		var simplexTexture = this.gl.createTexture();
		this.gl.bindTexture(this.gl.TEXTURE_2D, simplexTexture);

		this.gl.texImage2D( this.gl.TEXTURE_2D, 0, this.gl.RGBA, 64, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, test );
		this.gl.texParameteri( this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST );
		this.gl.texParameteri( this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST );

		this._simplexTexture = new Texture(simplexTexture, true);
	}

	initTextures() {
	
		var size = window.NS.GL.params.detail;
		this._fboPoints = new Framebuffer(size, size, this.gl.NEAREST, this.gl.NEAREST, this.gl.FLOAT);

		// this._logoTexture = new Texture(this.textureCreator.getImage(), false);
		// this._logoTexture = new Texture(this.loadedImages['logoTexture'], false);

	}

	initViews() {

		this._vCopy = new ViewCopy(this.orthoTransforms, require("../shaders/copy.frag"));
		this._vPoints = new ViewPoints(this.orthoTransforms);
		
		
	}

	

	update() {

		super.update();
		
	}

	render() {

		if (window.NS.iOS){
			this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
			this.gl.clearColor( 1.0, 1.0, 1.0, 1 );
			this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		}else{
			if (!this.doRender) return;

			this.orthoTransforms.setCamera(this.orthoCamera);

			this.gl.viewport(0, 0, this._fboPoints.width, this._fboPoints.height);
			
			this._fboPoints.bind();
			this.gl.clearColor( 1.0, 1.0, 1.0, 1 );
			this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

			this._vPoints.render(this._permTexture, this._simplexTexture);
		
			this._fboPoints.unbind();

			this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);

			this.gl.clearColor( 1.0, 1.0, 1.0, 1 );
			this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

			this._vCopy.render(this._fboPoints.getTexture());
		}
	}

	onResize(w,h) {

		this.gl.viewportWidth = w;
		this.gl.viewportHeight = h;

		this.canvas.width = w;
		this.canvas.height = h;

		this.canvas.style.height = h + 'px';
		this.canvas.style.width = w + 'px';

	}
}