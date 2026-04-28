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
  uniform float u_choppy;

  const int   NUM_STEPS = 8;
  const float PI        = 3.141592;
  const float EPSILON   = 1e-3;
  #define EPSILON_NRM (0.1 / u_res.x)

  const int   ITER_GEOMETRY = 5;
  const int   ITER_FRAGMENT = 7;
  const float SEA_HEIGHT    = 0.6;
  // SEA_CHOPPY driven by u_choppy uniform (slider 0→1 maps to 1→9, default 5)
  const float SEA_SPEED     = 0.96;
  const float SEA_FREQ      = 0.16;
  const vec3  SEA_BASE        = vec3(0.02, 0.32, 0.52);
  const vec3  SEA_WATER_COLOR = vec3(0.08, 0.88, 0.98) * 0.92;
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
    return vec3(pow(1.0-e.y,2.0)*0.32,(1.0-e.y)*0.62,0.78+(1.0-e.y)*0.22)*0.95;
  }
  float sea_octave(vec2 uv,float choppy){
    uv+=noise(uv);
    vec2 wv=1.0-abs(sin(uv)), swv=abs(cos(uv));
    wv=mix(wv,swv,wv);
    return pow(1.0-pow(wv.x*wv.y,0.65),choppy);
  }
  float map(vec3 p){
    float freq=SEA_FREQ,amp=SEA_HEIGHT,choppy=u_choppy;
    vec2 uv=p.xz; uv.x*=0.75;
    float d,h=0.0;
    for(int i=0;i<ITER_GEOMETRY;i++){
      d=sea_octave((uv+SEA_TIME)*freq,choppy)+sea_octave((uv-SEA_TIME)*freq,choppy);
      h+=d*amp; uv*=octave_m; freq*=1.9; amp*=0.22; choppy=mix(choppy,1.0,0.2);
    }
    return p.y-h;
  }
  float map_detailed(vec3 p){
    float freq=SEA_FREQ,amp=SEA_HEIGHT,choppy=u_choppy;
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
    color+=specular(n,l,eye,500.0*inversesqrt(dot(dist,dist)))*1.2;
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
    vec3 ori = vec3(0.0, 2.8, 0.0);
    vec3 dir = normalize(vec3(uv.xy, -5.0));
    dir.z += length(uv)*0.08;
    dir = normalize(dir) * fromEuler(ang);

    vec3 p;
    heightMapTracing(ori, dir, p);
    vec3 dist  = p - ori;
    vec3 n     = getNormal(p, dot(dist,dist)*EPSILON_NRM);
    vec3 light = normalize(vec3(0.4, 1.0, 0.0));

    vec3 color = mix(
      getSkyColor(dir),
      getSeaColor(p, n, light, dir, dist),
      pow(smoothstep(0.0,-0.02,dir.y),0.2)
    );
    gl_FragColor = vec4(pow(color, vec3(0.65)), 1.0);
  }
`

// ── Pass 2: anime sparkle overlay ────────────────────────────────────────────
const STAR_FRAG = `
  precision highp float;
  uniform sampler2D u_tex;
  uniform vec2      u_res;
  uniform float     u_sparkle;
  uniform float     u_time;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

  // ✦ shape: 4 long cardinal spikes + 4 shorter diagonal spikes + soft bloom.
  // delta is offset in pixels from the sparkle center.
  float sparkleShape(vec2 delta, float size) {
    float r     = length(delta);
    float theta = atan(delta.y, delta.x);

    float arms4     = pow(abs(cos(2.0 * theta)), 16.0);
    float spike     = arms4 * size / (r + size * 0.06);

    float arms4d    = pow(abs(sin(2.0 * theta)), 16.0);
    float spikeDiag = arms4d * (size * 0.38) / (r + size * 0.10);

    float bloom = size * 0.22 / (r + size * 0.07);
    bloom *= bloom;

    return (spike + spikeDiag + bloom) * smoothstep(size * 2.4, 0.0, r);
  }

  void main() {
    vec2 uv    = gl_FragCoord.xy / u_res;
    vec3 scene = texture2D(u_tex, uv).rgb;

    // Cell grid: one random candidate sparkle point per cell.
    // 5x5 neighborhood ensures arms up to 2*cellPx reach current pixel.
    float cellPx = 18.0;
    vec2  cell   = floor(gl_FragCoord.xy / cellPx);
    float thresh = mix(0.84, 0.64, u_sparkle);

    vec3 glow = vec3(0.0);

    for (int cx = -2; cx <= 2; cx++) {
      for (int cy = -2; cy <= 2; cy++) {
        vec2 c = cell + vec2(float(cx), float(cy));

        // Jitter candidate within its cell
        vec2 jitter      = vec2(hash(c), hash(c + vec2(17.3, 41.7)));
        vec2 candPx      = (c + jitter) * cellPx;
        vec2 candUV      = candPx / u_res;

        if (candUV.x < 0.01 || candUV.x > 0.99 ||
            candUV.y < 0.01 || candUV.y > 0.99) continue;

        // Brightness check
        float cl = luma(texture2D(u_tex, candUV).rgb);
        if (cl < thresh) continue;

        // Local contrast: must be a peak, not a broad reflection
        vec2  px  = 5.0 / u_res;
        float avg = (luma(texture2D(u_tex, candUV + vec2( px.x, 0.0)).rgb)
                   + luma(texture2D(u_tex, candUV - vec2( px.x, 0.0)).rgb)
                   + luma(texture2D(u_tex, candUV + vec2(0.0,  px.y)).rgb)
                   + luma(texture2D(u_tex, candUV - vec2(0.0,  px.y)).rgb)) * 0.25;
        if (cl < avg + 0.07) continue;

        // Per-sparkle twinkle with unique phase and rate
        float phase   = hash(c + vec2(5.3,  13.7)) * 6.2832;
        float rate    = 0.9 + hash(c + vec2(2.9,   7.1)) * 1.4;
        float twinkle = pow(0.5 + 0.5 * sin(u_time * rate + phase), 2.0);
        if (twinkle < 0.005) continue;

        // Size driven by hotspot brightness + slider
        float size = (3.5 + cl * 10.5) * mix(0.45, 1.0, u_sparkle);

        vec2  delta = gl_FragCoord.xy - candPx;
        float shape = sparkleShape(delta, size);
        if (shape < 0.002) continue;

        // Cool-white with slight per-sparkle hue shift (white → soft lavender)
        float hv    = hash(c + vec2(11.1, 23.3));
        vec3  color = mix(vec3(0.88, 0.95, 1.00), vec3(0.95, 0.88, 1.00), hv * 0.45);

        glow += color * shape * twinkle;
      }
    }

    // Slider drives intensity: subtle at 0, dramatic at 1
    float intensity = mix(0.35, 1.4, u_sparkle);
    gl_FragColor = vec4(clamp(scene + glow * intensity, 0.0, 1.0), 1.0);
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

export default function WaterShader({ sparkle = 0.5, choppy = 0.5 }) {
  const canvasRef  = useRef(null)
  const sparkleRef = useRef(sparkle)
  const choppyRef  = useRef(choppy)
  useEffect(() => { sparkleRef.current = sparkle }, [sparkle])
  useEffect(() => { choppyRef.current  = choppy  }, [choppy])

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
    const uOceanRes    = gl.getUniformLocation(oceanProg, 'u_res')
    const uOceanTime   = gl.getUniformLocation(oceanProg, 'u_time')
    const uOceanChoppy = gl.getUniformLocation(oceanProg, 'u_choppy')
    const uStarTex   = gl.getUniformLocation(starProg,  'u_tex')
    const uStarRes   = gl.getUniformLocation(starProg,  'u_res')
    const uStarSp    = gl.getUniformLocation(starProg,  'u_sparkle')
    const uStarTime  = gl.getUniformLocation(starProg,  'u_time')

    const start = performance.now()
    let raf

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
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
      gl.uniform1f(uOceanChoppy, 1.0 + choppyRef.current * 8.0)
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
