import View from "../framework/View";
import Mesh from "../framework/Mesh";

export default class ViewCopy extends View {

	constructor(transforms, frag) {

		super(transforms, require("../../shaders/copy.vert"), frag);

		var positions = [];
		var coords = [];
		var indices = [0, 1, 2, 0, 2, 3];
		

		var size = 1;
		positions.push([-size, -size, 0]);
		positions.push([ size, -size, 0]);
		positions.push([ size,  size, 0]);
		positions.push([-size,  size, 0]);

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

	render(texture, fadeAmount) {

		// this.transforms.push();

		this.shader.bind();


		this.shader.uniform("uTexturePos", "uniform1i", 0);
		texture.bind(this.shader, 0);

		// this.shader.uniform("uFadeAmount", "uniform1f", fadeAmount);


		this.draw(this.mesh);

		// this.transforms.pop();
	}
}
