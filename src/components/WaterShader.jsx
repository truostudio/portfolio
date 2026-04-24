import { useEffect, useRef } from 'react'

// "Seascape" by Alexander Alekseev aka TDM - 2014
// License: CC BY-NC-SA 3.0  https://www.shadertoy.com/view/Ms2SD1
// Two-pass render: ocean → FBO, then star-filter pass on top.

const QUAD_VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

// ── Pass 1: ocean ─────────────────────────────────────────────────────────────
const OCEAN_FRAG = `
  precision highp float;
  uniform vec2  u_res;
  uniform float u_time;

  const int   NUM_STEPS = 8;
  const float PI        = 3.141592;
  const float EPSILON   = 1e-3;
  #define EPSILON_NRM (0.1 / u_res.x)

  const int   ITER_GEOMETRY = 3;
  const int   ITER_FRAGMENT = 5;
  const float SEA_HEIGHT    = 0.6;
  const float SEA_CHOPPY    = 5.0;
  const float SEA_SPEED     = 0.25;
  const float SEA_FREQ      = 0.16;
  const vec3  SEA_BASE        = vec3(0.0, 0.22, 0.38);
  const vec3  SEA_WATER_COLOR = vec3(0.10, 0.92, 0.98) * 0.80;
  #define SEA_TIME (1.0 + u_time * SEA_SPEED)
  const mat2 octave_m = mat2(1.6, 1.2, -1.2, 1.6);

  mat3 fromEuler(vec3 ang) {
    vec2 a1=vec2(sin(ang.x),cos(ang.x));
    vec2 a2=vec2(sin(ang.y),cos(ang.y));
    vec2 a3=vec2(sin(ang.z),cos(ang.z));
    mat3 m;
    m[0]=vec3(a1.y*a3.y+a1.x*a2.x*a3.x, a1.y*a2.x*a3.x+a3.y*a1.x, -a2.y*a3.x);
    m[1]=vec3(-a2.y*a1.x, a1.y*a2.y, a2.x);
    m[2]=vec3(a3.y*a1.x*a2.x+a1.y*a3.x, a1.x*a3.x-a1.y*a3.y*a2.x, a2.y*a3.y);
    return m;
  }
  float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123); }
  float noise(in vec2 p){
    vec2 i=floor(p), f=fract(p), u=f*f*(3.0-2.0*f);
    return -1.0+2.0*mix(mix(hash(i),hash(i+vec2(1,0)),u.x),
                        mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
  }
  float diffuse(vec3 n,vec3 l,float p){ return pow(dot(n,l)*0.4+0.6,p); }
  float specular(vec3 n,vec3 l,vec3 e,float s){
    float nrm=(s+8.0)/(PI*8.0);
    return pow(max(dot(reflect(e,n),l),0.0),s)*nrm;
  }
  vec3 getSkyColor(vec3 e){
    e.y=(max(e.y,0.0)*0.8+0.2)*0.8;
    return vec3(pow(1.0-e.y,2.0)*0.4,(1.0-e.y)*0.6,0.7+(1.0-e.y)*0.3)*0.9;
  }
  float sea_octave(vec2 uv,float choppy){
    uv+=noise(uv);
    vec2 wv=1.0-abs(sin(uv)), swv=abs(cos(uv));
    wv=mix(wv,swv,wv);
    return pow(1.0-pow(wv.x*wv.y,0.65),choppy);
  }
  float map(vec3 p){
    float freq=SEA_FREQ,amp=SEA_HEIGHT,choppy=SEA_CHOPPY;
    vec2 uv=p.xz; uv.x*=0.75;
    float d,h=0.0;
    for(int i=0;i<ITER_GEOMETRY;i++){
      d=sea_octave((uv+SEA_TIME)*freq,choppy)+sea_octave((uv-SEA_TIME)*freq,choppy);
      h+=d*amp; uv*=octave_m; freq*=1.9; amp*=0.22; choppy=mix(choppy,1.0,0.2);
    }
    return p.y-h;
  }
  float map_detailed(vec3 p){
    float freq=SEA_FREQ,amp=SEA_HEIGHT,choppy=SEA_CHOPPY;
    vec2 uv=p.xz; uv.x*=0.75;
    float d,h=0.0;
    for(int i=0;i<ITER_FRAGMENT;i++){
      d=sea_octave((uv+SEA_TIME)*freq,choppy)+sea_octave((uv-SEA_TIME)*freq,choppy);
      h+=d*amp; uv*=octave_m; freq*=1.9; amp*=0.22; choppy=mix(choppy,1.0,0.2);
    }
    return p.y-h;
  }
  vec3 getSeaColor(vec3 p,vec3 n,vec3 l,vec3 eye,vec3 dist){
    float fresnel=clamp(1.0-dot(n,-eye),0.0,1.0);
    fresnel=min(pow(fresnel,3.0),0.5);
    vec3 reflected=getSkyColor(reflect(eye,n));
    vec3 refracted=SEA_BASE+diffuse(n,l,80.0)*SEA_WATER_COLOR*0.12;
    vec3 color=mix(refracted,reflected,fresnel);
    float atten=max(1.0-dot(dist,dist)*0.001,0.0);
    color+=SEA_WATER_COLOR*(p.y-SEA_HEIGHT)*0.18*atten;
    color+=specular(n,l,eye,500.0*inversesqrt(dot(dist,dist)));
    return color;
  }
  vec3 getNormal(vec3 p,float eps){
    vec3 n; n.y=map_detailed(p);
    n.x=map_detailed(vec3(p.x+eps,p.y,p.z))-n.y;
    n.z=map_detailed(vec3(p.x,p.y,p.z+eps))-n.y;
    n.y=eps; return normalize(n);
  }
  float heightMapTracing(vec3 ori,vec3 dir,out vec3 p){
    float tm=0.0,tx=1000.0,hx=map(ori+dir*tx);
    if(hx>0.0){p=ori+dir*tx;return tx;}
    float hm=map(ori);
    for(int i=0;i<NUM_STEPS;i++){
      float tmid=mix(tm,tx,hm/(hm-hx)); p=ori+dir*tmid;
      float hmid=map(p);
      if(hmid<0.0){tx=tmid;hx=hmid;}else{tm=tmid;hm=hmid;}
      if(abs(hmid)<EPSILON)break;
    }
    return mix(tm,tx,hm/(hm-hx));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_res;
    uv = uv*2.0-1.0;
    uv.x *= u_res.x / u_res.y;

    // Camera: fully fixed, top-down tilt
    vec3 ang = vec3(0.0, 0.75, 0.0);
    vec3 ori = vec3(0.0, 4.5, 0.0);
    vec3 dir = normalize(vec3(uv.xy, -3.5));
    dir.z += length(uv)*0.08;
    dir = normalize(dir) * fromEuler(ang);

    vec3 p;
    heightMapTracing(ori, dir, p);
    vec3 dist  = p - ori;
    vec3 n     = getNormal(p, dot(dist,dist)*EPSILON_NRM);
    vec3 light = normalize(vec3(0.0, 1.0, 0.8));

    vec3 color = mix(
      getSkyColor(dir),
      getSeaColor(p, n, light, dir, dist),
      pow(smoothstep(0.0,-0.02,dir.y),0.2)
    );
    gl_FragColor = vec4(pow(color, vec3(0.65)), 1.0);
  }
`

// ── Pass 2: star filter ───────────────────────────────────────────────────────
const STAR_FRAG = `
  precision highp float;
  uniform sampler2D u_tex;
  uniform vec2      u_res;
  uniform float     u_sparkle;
  uniform float     u_time;

  const int N = 16;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // Returns contribution from only the FIRST qualifying pixel along this arm.
  // One bright pixel = one fixed-brightness arm. Threshold controls quantity, not brightness.
  vec3 arm(vec2 uv, vec2 dir, float thresh) {
    vec3  result = vec3(0.0);
    float found  = 0.0;
    for (int i = 1; i <= N; i++) {
      float t   = float(i) / float(N);
      vec3  s   = texture2D(u_tex, uv + dir * t).rgb;
      float lum = dot(s, vec3(0.299, 0.587, 0.114));
      float q   = step(thresh, lum) * (1.0 - min(found, 1.0));
      result   += s * q * pow(1.0 - t, 1.5);
      found    += q;
    }
    return result;
  }

  void main() {
    vec2  uv    = gl_FragCoord.xy / u_res;
    vec3  scene = texture2D(u_tex, uv).rgb;

    // Sparkles — slider only moves threshold, arm length and intensity are fixed
    float thresh = mix(0.55, 0.18, u_sparkle);
    // Diagonal arms → ✦ shape. 0.707 normalises the diagonal step length.
    float s = 0.07 * 0.707 / float(N);

    vec3 star = arm(uv, vec2( s,  s), thresh)
              + arm(uv, vec2(-s,  s), thresh)
              + arm(uv, vec2( s, -s), thresh)
              + arm(uv, vec2(-s, -s), thresh);

    scene = min(scene + star * 4.0, 1.0);

    // Film grain
    float g1 = hash(floor(uv * u_res * 0.55) + fract(u_time * 37.0));
    float g2 = hash(floor(uv * u_res * 0.40) + fract(u_time * 73.0));
    float grain = (g1 + g2) * 0.5 - 0.5;
    scene += grain * 0.48;

    gl_FragColor = vec4(clamp(scene, 0.0, 1.0), 1.0);
  }
`

function makeProgram(gl, vert, frag) {
  const vs = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vs, vert); gl.compileShader(vs)
  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(vs))

  const fs = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fs, frag); gl.compileShader(fs)
  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(fs))

  const prog = gl.createProgram()
  gl.attachShader(prog, vs); gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  return prog
}

export default function WaterShader({ sparkle = 0 }) {
  const canvasRef  = useRef(null)
  const sparkleRef = useRef(sparkle)
  useEffect(() => { sparkleRef.current = sparkle }, [sparkle])

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) return

    // ── programs ──────────────────────────────────────────────────────────────
    const oceanProg = makeProgram(gl, QUAD_VERT, OCEAN_FRAG)
    const starProg  = makeProgram(gl, QUAD_VERT, STAR_FRAG)

    // ── shared quad buffer ────────────────────────────────────────────────────
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)

    function bindQuad(prog) {
      const loc = gl.getAttribLocation(prog, 'a_pos')
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    }

    // ── FBO + texture for pass 1 output ──────────────────────────────────────
    const fboTex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, fboTex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    const fbo = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fboTex, 0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    // ── uniforms ──────────────────────────────────────────────────────────────
    const uOceanRes  = gl.getUniformLocation(oceanProg, 'u_res')
    const uOceanTime = gl.getUniformLocation(oceanProg, 'u_time')
    const uStarTex   = gl.getUniformLocation(starProg,  'u_tex')
    const uStarRes   = gl.getUniformLocation(starProg,  'u_res')
    const uStarSp    = gl.getUniformLocation(starProg,  'u_sparkle')
    const uStarTime  = gl.getUniformLocation(starProg,  'u_time')

    const start = performance.now()
    let raf

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width  = Math.round(canvas.offsetWidth  * dpr)
      canvas.height = Math.round(canvas.offsetHeight * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      // Resize FBO texture to match
      gl.bindTexture(gl.TEXTURE_2D, fboTex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    const render = () => {
      const t = (performance.now() - start) / 1000
      const w = canvas.width, h = canvas.height

      // Pass 1 — ocean → FBO
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
      gl.useProgram(oceanProg)
      bindQuad(oceanProg)
      gl.uniform2f(uOceanRes, w, h)
      gl.uniform1f(uOceanTime, t)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      // Pass 2 — star filter → screen
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.useProgram(starProg)
      bindQuad(starProg)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, fboTex)
      gl.uniform1i(uStarTex, 0)
      gl.uniform2f(uStarRes, w, h)
      gl.uniform1f(uStarSp, sparkleRef.current)
      gl.uniform1f(uStarTime, t)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      raf = requestAnimationFrame(render)
    }
    render()

    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  )
}
