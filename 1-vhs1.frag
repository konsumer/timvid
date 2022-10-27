#ifdef GL_ES
precision mediump float;
#endif

#define range 0.05
#define noiseQuality 250.0
#define noiseIntensity 0.0088
#define offsetIntensity 0.02
#define colorOffsetIntensity 1.3

uniform sampler2D   u_tex0;

uniform vec2        u_tex0Resolution;
uniform float       u_tex0Time;
uniform float       u_tex0Duration;
uniform float       u_tex0CurrentFrame;
uniform float       u_tex0TotalFrames;
uniform float       u_tex0Fps;
uniform vec2        u_resolution;
varying vec2        v_texcoord;

// fake random
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

// make a vertical-bar distortion
float verticalBar(float pos, float uvY, float offset) {
    float edge0 = (pos - range);
    float edge1 = (pos + range);
    float x = smoothstep(edge0, pos, uvY) * offset;
    x -= smoothstep(pos, edge1, uvY) * offset;
    return x;
}


void main (void) {
    // black
    vec4 color = vec4(vec3(0.0), 1.0);
    
    // find the current pixel of the video frame and set color
    vec2 pixel = 1.0/u_resolution.xy;
    vec2 st = gl_FragCoord.xy * pixel;
    vec2 uv = v_texcoord;

    color = texture2D(u_tex0, st);

    vec2 uv = fragCoord.xy / iResolution.xy;
    
    for (float i = 0.0; i < 0.71; i += 0.1313) {
        float d = mod(iTime * i, 1.7);
        float o = sin(1.0 - tan(iTime * 0.24 * i));
        o *= offsetIntensity;
        uv.x += verticalBar(d, uv.y, o);
    }
    
    float uvY = uv.y;
    uvY *= noiseQuality;
    uvY = float(int(uvY)) * (1.0 / noiseQuality);
    float noise = rand(vec2(iTime * 0.00001, uvY));
    uv.x += noise * noiseIntensity;

    vec2 offsetR = vec2(0.006 * sin(iTime), 0.0) * colorOffsetIntensity;
    vec2 offsetG = vec2(0.0073 * (cos(iTime * 0.97)), 0.0) * colorOffsetIntensity;
    
    float r = texture(color, uv + offsetR).r;
    float g = texture(color, uv + offsetG).g;
    float b = texture(color, uv).b;

    // final output color
    gl_FragColor = vec4(r, g, b, 1.0);
}