// adapted from https://www.shadertoy.com/view/Ms3XWH

// settings - adjust these to tune
#define RANGE 0.05
#define NOISE_QUALITY 250.0
#define NOISE_INTENSITY 0.0088
#define OFFSET_INTENSITY 0.02
#define COLOR_OFFSET_INTENSITY 1.3

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_tex0;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_delta;
uniform int u_frame;
uniform float u_tex0Time;
varying vec2 v_texcoord;

// fake random
float rand(vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898, 78.233))) * 43758.5453);
}

// distored vertical bar
float verticalBar(float pos, float uvY, float offset) {
  float edge0 = (pos - RANGE);
  float edge1 = (pos + RANGE);
  float x = smoothstep(edge0, pos, uvY) * offset;
  x -= smoothstep(pos, edge1, uvY) * offset;
  return x;
}

void main (void) {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  for (float i = 0.0; i < 0.71; i += 0.1313) {
    float d = mod(u_time * i, 1.7);
    float o = sin(1.0 - tan(u_time * 0.24 * i));
    o *= OFFSET_INTENSITY;
    uv.x += verticalBar(d, uv.y, o);
  }
    
  float uvY = uv.y;
  uvY *= NOISE_QUALITY;
  uvY = float(int(uvY)) * (1.0 / NOISE_QUALITY);
  float noise = rand(vec2(u_time * 0.00001, uvY));
  uv.x += noise * NOISE_INTENSITY;

  vec2 offsetR = vec2(0.006 * sin(u_time), 0.0) * COLOR_OFFSET_INTENSITY;
  vec2 offsetG = vec2(0.0073 * (cos(u_time * 0.97)), 0.0) * COLOR_OFFSET_INTENSITY;
  
  float r = texture2D(u_tex0, uv + offsetR).r;
  float g = texture2D(u_tex0, uv + offsetG).g;
  float b = texture2D(u_tex0, uv).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}