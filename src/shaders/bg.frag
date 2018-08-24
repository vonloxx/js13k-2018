#ifdef GL_ES
precision mediump float;
#endif

#define NUM_OCTAVES 16

uniform float time;
uniform vec2 resolution;
// uniform vec2 mouse;

mat3 rotX(float a) {
	float c = cos(a);
	float s = sin(a);
	return mat3(
		1, 0, 0,
		0, c, -s,
		0, s, c
	);
}
mat3 rotY(float a) {
	float c = cos(a);
	float s = sin(a);
	return mat3(
		c, 0, -s,
		0, 1, 0,
		s, 0, c
	);
}

float random(vec3 pos) {
	return fract(sin(dot(pos.xyz, vec3(23452.9898, 72358.233, 243.5651))) * 438.5453123);
}

float noise(vec3 pos) {
	vec3 i = floor(pos);
	vec3 f = fract(pos);
	float v000 = random(i + vec3(0.0, 0.0, 0.0));
	float v100 = random(i + vec3(1.0, 0.0, 0.0));
	float v010 = random(i + vec3(0.0, 1.0, 0.0));
	float v110 = random(i + vec3(1.0, 1.0, 0.0));
	float v001 = random(i + vec3(0.0, 0.0, 1.0));
	float v101 = random(i + vec3(1.0, 0.0, 1.0));
	float v011 = random(i + vec3(0.0, 1.0, 1.0));
	float v111 = random(i + vec3(1.0, 1.0, 1.0));
	vec3 u = f * f * (3.0 - 2.0 * f);
	
	float v00 = mix(v000, v001, u.z);
	float v01 = mix(v010, v011, u.z);
	float v10 = mix(v100, v101, u.z);
	float v11 = mix(v110, v111, u.z);
	
	float v0 = mix(v00, v01, u.y);
	float v1 = mix(v10, v11, u.y);
	
	float v = mix(v0,v1,u.x);
	
	return v;
}

float fbm(vec2 pos) {
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(100.0);
	mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
	for (int i=0; i<NUM_OCTAVES; i++) {
		v += a * noise(vec3(pos,(time / 100.0)));
		pos = rot * pos * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}

void main(void) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

	float t = 0.0, d;
	

	vec2 r = vec2(time/1000.0, 0.0);

	float f = fbm(p + r);
	vec3 color = mix(
		vec3(1.201961, 1.219608, 1.666667),
		vec3(1.266667, 1.266667, 1.498039),
		clamp((f * f) * 4.0, 0.0, 1.0)
	);




	

	color = (f *f * f + 0.6 * f * f + 0.5 * f) * color;
	
	gl_FragColor = vec4(color, 1.0);
}