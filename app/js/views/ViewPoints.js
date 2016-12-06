import View from "../framework/View";
import Mesh from "../framework/Mesh";

export default class ViewPoints extends View {

	constructor(transforms) {

		super(transforms, require("../../shaders/points.vert"), require("../../shaders/points.frag"));

		var positions = [];
		var coords = [];
		var indices = [];
		var colors = [];
		var extraCoords = [];
		
		var detail = window.NS.GL.params.detail;
		var totDetail = detail * detail;
		
		var index = 0;

		var y = 1 - (2 / (detail * 2));
		var step = 2 / detail;

		for (var row=0;row<detail;row++){
			
			var x = -1 + (2 / (detail * 2));
			for (var col=0;col<detail;col++){

				positions.push([x, y, 0]);
				indices.push(index);
				coords.push([col/detail, 1.0 - (row/detail)]);

				colors.push([Math.random() * 10 / 10, .3, .1]);

				extraCoords.push([2.5 - (index/totDetail), 1 + (index/totDetail), .5 - (index/totDetail)]);
				
				x += step;
				index++;

			}

			y -= step;
		}

		
		

		this._counter = .1;

		this.mesh = new Mesh(positions.length, indices.length, this.gl.POINTS);
		this.mesh.bufferVertex(positions);
		// this.mesh.bufferTexCoords(coords);
		this.mesh.bufferIndices(indices);
		// this.mesh.bufferData(colors, "aVertexColor", 3);
		// this.mesh.bufferData(extraCoords, "aVertexExtraCoord", 3);
	}

	render(permTexture, simplexTexture) {

		// this.transforms.push();

		this.transforms.calculateModelView();

		this.shader.bind();

		this.shader.uniform("simplexTexture", "uniform1i", 0);
		this.shader.uniform("permTexture", "uniform1i", 1);

		simplexTexture.bind(this.shader, 0);
		permTexture.bind(this.shader, 1);

		// this.shader.uniform("uTexture", "uniform1i", 2);
		// texturePos.bind(this.shader, 2);

		this.shader.uniform("uCounter", "uniform1f", this._counter+=.005);
		this.shader.uniform("uRandom", "uniform1f", Math.random());

		
		this.draw(this.mesh);

		// this.transforms.pop();
	}
}
