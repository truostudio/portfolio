import { useEffect, useRef } from 'react'

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG = `
precision mediump float;
uniform sampler2D u_tex;
uniform float u_hover;
uniform float u_dpr;
uniform vec2  u_res;
uniform float u_imgAspect;
uniform vec2  u_mouse;
varying vec2 v_uv;

float bayer4(vec2 p) {
  float x = floor(mod(p.x, 4.0));
  float y = floor(mod(p.y, 4.0));
  float v;
  if      (y < 1.0) { if (x<1.0) v= 0.; else if (x<2.0) v= 8.; else if (x<3.0) v= 2.; else v=10.; }
  else if (y < 2.0) { if (x<1.0) v=12.; else if (x<2.0) v= 4.; else if (x<3.0) v=14.; else v= 6.; }
  else if (y < 3.0) { if (x<1.0) v= 3.; else if (x<2.0) v=11.; else if (x<3.0) v= 1.; else v= 9.; }
  else               { if (x<1.0) v=15.; else if (x<2.0) v= 7.; else if (x<3.0) v=13.; else v= 5.; }
  return v / 16.0;
}

void main() {
  // object-fit: cover — center-crop, divide to zoom in not out
  float canvasAspect = u_res.x / u_res.y;
  vec2 uv = v_uv;
  if (canvasAspect > u_imgAspect) {
    float s = canvasAspect / u_imgAspect;
    uv.y = (uv.y - 0.5) / s + 0.5;
  } else {
    float s = u_imgAspect / canvasAspect;
    uv.x = (uv.x - 0.5) / s + 0.5;
  }

  vec4 src = texture2D(u_tex, uv);
  float lum = dot(src.rgb, vec3(0.299, 0.587, 0.114));

  float t  = bayer4(gl_FragCoord.xy / (4.0 * u_dpr));
  float dl = clamp(lum + (t - 0.5) * 0.4, 0.0, 1.0);

  vec3 c0 = vec3(0.047, 0.102, 0.031); // #0C1A08 near-black shadow
  vec3 c1 = vec3(0.361, 0.702, 0.290); // #5CB34A vivid leaf green
  vec3 c2 = vec3(1.000, 0.373, 0.627); // #FF5FA0 hot pink
  vec3 c3 = vec3(1.000, 0.910, 0.961); // #FFE8F5 pale blush

  vec3 dithered;
  if      (dl < 0.25) dithered = c0;
  else if (dl < 0.50) dithered = c1;
  else if (dl < 0.75) dithered = c2;
  else                dithered = c3;

  // circular reveal around cursor; radius grows with u_hover
  float radius = u_hover * 200.0 * u_dpr;
  float dist   = length(gl_FragCoord.xy - u_mouse);
  float mask   = 1.0 - smoothstep(radius * 0.85, radius, dist);

  // full dither within circle (step(t, 1.0) is always 1 for t in [0,1))
  float flip = step(t, 1.0) * mask;
  gl_FragColor = vec4(mix(src.rgb, dithered, flip), 1.0);
}
`

function compile(gl, type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    console.error('Shader compile error:', gl.getShaderInfoLog(s))
  return s
}

function uploadTex(gl, source) {
  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return tex
}

function makePlaceholder(gl) {
  const S = 512
  const cv = document.createElement('canvas')
  cv.width = cv.height = S
  const ctx = cv.getContext('2d')
  const bg = ctx.createLinearGradient(0, 0, 0, S)
  bg.addColorStop(0,    '#bfb0cc')
  bg.addColorStop(0.42, '#6d829a')
  bg.addColorStop(1,    '#0a1628')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, S, S)
  const glow = ctx.createRadialGradient(S * 0.5, S * 0.18, 0, S * 0.5, S * 0.38, S * 0.58)
  glow.addColorStop(0,    'rgba(255, 235, 215, 0.82)')
  glow.addColorStop(0.45, 'rgba(200, 175, 165, 0.35)')
  glow.addColorStop(1,    'rgba(0, 0, 0, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, S, S)
  return uploadTex(gl, cv)
}

export default function PhotoDither({ hovered, src }) {
  const canvasRef      = useRef(null)
  const glRef          = useRef(null)
  const texRef         = useRef(null)
  const uHoverRef      = useRef(null)
  const uDprRef        = useRef(null)
  const uResRef        = useRef(null)
  const uImgAspectRef  = useRef(null)
  const uMouseRef      = useRef(null)
  const imgAspectRef   = useRef(1.0)
  const stateRef       = useRef({ hover: 0, target: 0, raf: null })
  const mouseRef       = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    stateRef.current.target = hovered ? 1 : 0
  }, [hovered])

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) return
    glRef.current = gl

    const prog = gl.createProgram()
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER,   VERT))
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
      console.error('Program link error:', gl.getProgramInfoLog(prog))
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    uHoverRef.current     = gl.getUniformLocation(prog, 'u_hover')
    uDprRef.current       = gl.getUniformLocation(prog, 'u_dpr')
    uResRef.current       = gl.getUniformLocation(prog, 'u_res')
    uImgAspectRef.current = gl.getUniformLocation(prog, 'u_imgAspect')
    uMouseRef.current     = gl.getUniformLocation(prog, 'u_mouse')
    gl.uniform1i(gl.getUniformLocation(prog, 'u_tex'), 0)

    texRef.current = makePlaceholder(gl)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texRef.current)

    const st = stateRef.current

    function resize() {
      const dpr = window.devicePixelRatio || 1
      const w = Math.round(canvas.clientWidth  * dpr)
      const h = Math.round(canvas.clientHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width  = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }

    function frame() {
      resize()
      const dpr = window.devicePixelRatio || 1
      st.hover += (st.target - st.hover) * 0.1
      if (Math.abs(st.target - st.hover) < 0.002) st.hover = st.target

      // convert CSS mouse coords to WebGL canvas coords (y flipped)
      const mx = mouseRef.current.x * dpr
      const my = canvas.height - mouseRef.current.y * dpr

      gl.uniform1f(uHoverRef.current,     st.hover)
      gl.uniform1f(uDprRef.current,       dpr)
      gl.uniform2f(uResRef.current,       canvas.width, canvas.height)
      gl.uniform1f(uImgAspectRef.current, imgAspectRef.current)
      gl.uniform2f(uMouseRef.current,     mx, my)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      st.raf = requestAnimationFrame(frame)
    }

    frame()

    return () => {
      cancelAnimationFrame(st.raf)
      if (texRef.current) gl.deleteTexture(texRef.current)
      gl.deleteProgram(prog)
    }
  }, [])

  useEffect(() => {
    if (!src || !glRef.current) return
    let cancelled = false
    const gl = glRef.current
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (cancelled) return
      imgAspectRef.current = img.naturalWidth / img.naturalHeight
      if (texRef.current) gl.deleteTexture(texRef.current)
      texRef.current = uploadTex(gl, img)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texRef.current)
    }
    img.src = src
    return () => { cancelled = true }
  }, [src])

  // window-level listener so the overlay div doesn't block mousemove events
  useEffect(() => {
    if (!hovered) return
    function onMove(e) {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [hovered])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  )
}
