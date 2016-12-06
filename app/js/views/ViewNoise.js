import View from "../framework/View";
import Mesh from "../framework/Mesh";

export default class ViewCopy extends View {

	constructor(transforms) {

		super(transforms, require("../../shaders/copy.vert"), require("../../shaders/noise.frag"));

		var positions = [];
		var coords = [];
		var indices = [0, 1, 2, 0, 2, 3];

		this.counter = 0.1;
		

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

	render(permTexture, simplexTexture) {

		// this.transforms.push();

		this.shader.bind();


		this.shader.uniform("simplexTexture", "uniform1i", 0);
		this.shader.uniform("permTexture", "uniform1i", 1);

		simplexTexture.bind(this.shader, 0);
		permTexture.bind(this.shader, 1);

		this.shader.uniform("uCounter", "uniform1f", this.counter += 0.004);


		this.draw(this.mesh);

		// this.transforms.pop();
	}
}
