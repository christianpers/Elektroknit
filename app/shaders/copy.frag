precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uTexturePos;

uniform float uFadeAmount;

void main(void) {
	vec3 colorBase = texture2D(uTexturePos, vec2(vTextureCoord.s, vTextureCoord.t)).rgb;
	
    gl_FragColor = vec4(colorBase, 1.0);
}