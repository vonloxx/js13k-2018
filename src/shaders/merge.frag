  precision mediump float;

  varying vec2 uv;
  uniform sampler2D t1;
  uniform sampler2D t2;

  void main() {
     vec4 color0 = texture2D(t1, uv);
     vec4 color1 = texture2D(t2, uv);
     // vec4 color = mix(color0, color1, 0.5);
     // gl_FragColor = color;
     gl_FragColor = color0 + color1;
  }