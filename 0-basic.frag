#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   iChannel0;

uniform vec2        u_tex0Resolution;
uniform float       u_tex0Time;
uniform float       u_tex0Duration;
uniform float       u_tex0CurrentFrame;
uniform float       u_tex0TotalFrames;
uniform float       u_tex0Fps;
uniform vec2        u_resolution;
varying vec2        v_texcoord;

void main (void) {
    // black
    vec4 color = vec4(vec3(0.0), 1.0);
    
    // find the current pixel of the video frame and set color
    vec2 pixel = 1.0/u_resolution.xy;
    vec2 st = gl_FragCoord.xy * pixel;
    vec2 uv = v_texcoord;
    color = texture2D(iChannel0, st);

    // add some colored lines representing u_tex0Time/u_tex0Duration, u_tex0CurrentFrame/u_tex0TotalFrames, and u_tex0CurrentFrame
    color.rgb = mix( color.rgb, vec3(step(st.x, u_tex0Time/ u_tex0Duration), 0.0, 0.0), step(st.y-0.02, 0.006) );
    color.rgb = mix( color.rgb, vec3(0., step(st.x, u_tex0CurrentFrame/u_tex0TotalFrames), 0.0), step(st.y-0.01, 0.009) );
    color.rgb = mix( color.rgb, vec3(0., 0., step(st.x, fract(u_tex0CurrentFrame))) , step(st.y - 0.008, 0.003) );

    // final output color
    gl_FragColor = color;
}
