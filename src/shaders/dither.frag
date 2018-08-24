// Adapted to OpenCL 2.0 from http://kpulv.com/368/Index_Palette_Shader/
precision mediump float;

uniform sampler2D texture;
uniform sampler2D palette;
uniform float time;
uniform float shiftPal;
uniform float offset;
uniform float scale;
uniform vec2 dim;
uniform float noiseAlpha;
varying vec2 uv;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec2 dimScaled = scale * dim;
  vec2 pixpos = uv.xy;

  vec2 overlayCoord = floor(gl_FragCoord.xy / scale);
  float overlayPixelColor = mod(overlayCoord.x + overlayCoord.y, 2.0);
  vec4 overlayPixel = vec4(overlayPixelColor, overlayPixelColor, overlayPixelColor, 1);

  vec2 scaledpos = floor(pixpos * dimScaled);
  scaledpos -= mod(scaledpos, scale);
  scaledpos /= dimScaled;

  vec4 pixcol = texture2D(texture, pixpos);
  pixcol = mix(pixcol, overlayPixel, 0.1);

  float gray = (pixcol.r + pixcol.g + pixcol.b) / 3.0;
  gray = floor(gray / 0.125 + 0.125) * 0.125;
  gray += (rand(scaledpos + offset) * 2.0 - 1.0) * noiseAlpha;

  // vec4 pixcol2 = texture2D(palette, vec2(gray, shiftPal));
  // gl_FragColor = pixcol2; // * pixcol; // texture2D(texture, uv); // gl_Color;

  // crt lines
  vec3 color = texture2D(palette, vec2(gray, shiftPal)).rgb;
  color -= abs(sin(uv.y * 100.0 + time * 5.0)) * 0.08; // (1)
  color -= abs(sin(uv.y * 300.0 - time * 10.0)) * 0.05; // (2)

  // crt distortion
  vec2 coord = uv * dim;
  coord -= dim/2.;
  float dis = length(coord);
  if (dis < 1000.) {
      float percent = dis / 1000.;
      coord *= mix(1., smoothstep(0.0, 1000. / dis, percent), .225);
  }
  coord += dim/2.;
  float dist = distance(uv, vec2(.5, .5));
  color *= smoothstep(.8, .2*.8, dist);

  gl_FragColor = vec4(color, 1.0).rgba;
}