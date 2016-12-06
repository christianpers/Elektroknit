import View from "../framework/View";
import Mesh from "../framework/Mesh";

export default class ViewLogo extends View {

	constructor(transforms) {

		super(transforms, require("../../shaders/copy.vert"), require("../../shaders/logo.frag"));

		var positions = [];
		var coords = [];
		var indices = [3, 0, 2, 0, 2, 1];

		var sizeW = .4;
		var sizeH = .1;
		var topRightPos = .98;
		// positions.push([-sizeW, -sizeH, 0]);
		// positions.push([ sizeW, -sizeH, 0]);
		// positions.push([ sizeW,  sizeH, 0]);
		// positions.push([-sizeW,  sizeH, 0]);
		positions.push([topRightPos-sizeW, topRightPos-sizeH, 0]);
		positions.push([topRightPos, topRightPos-sizeH, 0]);
		positions.push([topRightPos, topRightPos, 0]);
		positions.push([topRightPos-sizeW, topRightPos, 0]);
		
		

		coords.push([0, 0]);
		coords.push([1, 0]);
		coords.push([1, 1]);
		coords.push([0, 1]);

		// debugger;
		this.mesh = new Mesh(positions.length, indices.length, this.gl.TRIANGLES);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoords(coords);
		this.mesh.bufferIndices(indices);
	}

	render(logoTexture, bgTexture) {

		// this.transforms.push();

		this.shader.bind();


		this.shader.uniform("logoTexture", "uniform1i", 0);
		this.shader.uniform("bgTexture", "uniform1i", 1);

		logoTexture.bind(this.shader, 0);
		bgTexture.bind(this.shader, 1);

		

		this.draw(this.mesh);

		// this.transforms.pop();
	}
}
