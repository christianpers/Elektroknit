precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D logoTexture;
uniform sampler2D bgTexture;

uniform float uFadeAmount;

void main(void) {
	vec4 logoBase = texture2D(logoTexture, vTextureCoord).rgba;
	vec3 bgBase = texture2D(bgTexture, vec2(vTextureCoord.s, vTextureCoord.t)).rgb;

	// bgBase *= vec3(.2, 2.0, 1.0);
	vec3 color = logoBase.rgb + vec3(.0);
	// bgBase *= vec3(.1, .5, .5);
	// color = mix(color, bgBase, 1.0);

	// color *= vec3(.2, .2, .2);


	// if (logoBase)
	// vec3 colorBase = texture2D(uTexturePos, vec2(vTextureCoord.s, vTextureCoord.t)).rgb;
	// vec3 colorOffset = texture2D(uTexturePos, vec2(vTextureCoord.s + .2, vTextureCoord.t)).rgb;
	// colorOffset -= vec3(1.0, 1.0 ,.1);
	// // colorOffset = mix(colorOffset, vec3(1.0, .23, .45), .3);

	// colorBase = mix(colorBase, vec3(.5, 1.0 , 2.0), .9);

	// vec3 color = colorBase + colorOffset;
	// vec3 color = mix(colorBase, colorOffset, .5);
	// color -= (uFadeAmount / 6.0) * 1.5;
	// color += colorOffset;
    // gl_FragColor = texture2D(uTexturePos, vec2(vTextureCoord.s, vTextureCoord.t));
    gl_FragColor = vec4(color,logoBase.a);
}