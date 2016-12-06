precision highp float;



varying float noise;
varying float vCounter;
varying vec3 vPos;
// varying vec2 vTextureCoord;

void main(void) {

	vec3 newPos = vPos;
	// float noiseVal = noise;
	vec3 baseColor = vec3(1.0, 1.0, 1.0);
	// vec3 otherColor = vec3(.2, .1, .2);
	// vec3 color = mix(vPos, vec3(noise), vCounter);
	// newPos += vec3(.2);
	// newPos *= vec3(.1);
	// newPos.y += 1.0;

	// vec3 color = vec3((abs(vPos.y)/abs(vPos.x))*(noise*2.0), 1.0, 1.0);

	vec3 color = mix(baseColor, newPos * vec3(noise), .4);
	// color *= vec3(1.6);
	color *= vec3(1.5);
	// color = min(color, .5);

	// color = clamp(color, vec3(0.0), vec3(.5));
	// if (color.r >= .5)
	// 	color = vec3(1.0);

	// color 


	// color += vec3(.5);

	// color *= vec3(1.1, 1.1, 1.0);



	// color = inversesqrt(color);

	// vec3 color = newPos;
	// vec3 color = baseColor;
	// color += vec3(.3);
	// color *= vec3(4.0, 3.3, 3.5);

	// color = mix(baseColor, color, .005);
	// color *= vec3(2.2, 2.2, 2.2);
	// color = clamp(color, vec3(.9, .9, .9), baseColor);
	
	// color = mix(color, vec3(.4, .8, .2), 1.0 - colorPick);

    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(vec3(.5, .3, .3), 1.0);

}