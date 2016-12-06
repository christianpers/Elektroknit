export default class BaseCamera{

	constructor(type) {

		this.type = type;

		if (this.type == 'ortho'){
			this.projMatrix = mat4.create();
			this.viewMatrix = mat4.create();

			return;
		}

		// Raw Position Values
		this.left = vec3.fromValues(1.0, 0.0, 0.0); // Camera Left vector
		this.up = vec3.fromValues(0.0, 1.0, 0.0); // Camera Up vector
		this.dir = vec3.fromValues(0.0, 0.0, 1.0); // The direction its looking at
		this.pos = vec3.fromValues(0.0, 0.0, 0.0); // Camera eye position
		this.projectionTransform = null;
		this.projMatrix;
		this.viewMatrix;

		this.fieldOfView = 45;
		this.nearClippingPlane = 0.1;
		this.farClippingPlane = 1000.0;

	}

	apply(aspectRatio) {

		function degToRadian(degrees) {
		  return degrees * Math.PI / 180;
		};

		var matView=mat4.create();
		var lookAtPosition=vec3.create();
		vec3.add(lookAtPosition, this.pos, this.dir);
		mat4.lookAt(matView, this.pos, lookAtPosition, this.up);
		mat4.translate(matView, matView, vec3.fromValues(-this.pos[0], -this.pos[1], -this.pos[2]));
		this.viewMatrix = matView;

		// console.log(this.dir, this.up);

		// Create a projection matrix and store it inside a globally accessible place.
		this.projMatrix=mat4.create();
		mat4.perspective(this.projMatrix, degToRadian(this.fieldOfView), aspectRatio, this.nearClippingPlane, this.farClippingPlane)

	}

	getFarClippingPlane() {
		return this.farClippingPlane;
	}

	getFieldOfView() {
		return this.fieldOfView;
	}

	getLeft() {

		return vec3.clone(this.left);
	}

	getNearClippingPlane() {

		return this.nearClippingPlane;
	}

	getPosition() {

		return vec3.clone(this.pos);
	}

	getProjectionMatrix() {

		return mat4.clone(this.projMatrix);
	}

	getViewMatrix() {

		return mat4.clone(this.viewMatrix);
	}

	getUp() {

		return vec3.clone(this.up);
	}

	setFarClippingPlane() {

		if (fcp > 0)
		{
			this.farClippingPlane = fcp;
		}
	}

	setFieldOfView(fov) {

		if (fov > 0 && fov < 180)
		{
			this.fieldOfView = fov;
		}
	}

	setNearClippingPlane(ncp) {

		if (ncp > 0)
		{
			this.nearClippingPlane = ncp;
		}
	}

	update(timeStep, lineVel, angularVel) { 

		if (vec3.squaredLength(linVel)==0 && vec3.squaredLength(angularVel)==0) return false;

		if (vec3.squaredLength(linVel) > 0.0)
		{
			// Add a velocity to the position
			vec3.scale(velVec,velVec, timeStep);

			vec3.add(this.pos, velVec, this.pos);
		}

		if (vec3.squaredLength(angularVel) > 0.0)
		{
			// Apply some rotations to the orientation from the angular velocity
			this.pitch(angularVel[0] * timeStep);
			this.yaw(angularVel[1] * timeStep);
			this.roll(angularVel[2] * timeStep);
		}

		return true;
	}
}