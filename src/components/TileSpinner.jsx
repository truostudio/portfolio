// A white 3D tile that spins with a logo on both faces: the Uniblock and
// Makiverse spinners' tile, with the logo passed in.
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, useState, forwardRef } from 'react'
import * as THREE from 'three'
import { useInView } from '../hooks/useInView'
import WakeOnShow from './WakeOnShow'

const CORNER_R = 0.20
const DEPTH = 0.03

function makeRoundedRectShape(w, h, r) {
  const s = new THREE.Shape()
  const x = -w / 2, y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  return s
}

function makeBorderTex() {
  const S = 512, r = S * CORNER_R, b = 10
  const cv = document.createElement('canvas')
  cv.width = cv.height = S
  const ctx = cv.getContext('2d')
  ctx.beginPath()
  const x = b / 2, w = S - b
  ctx.moveTo(x + r, x)
  ctx.lineTo(x + w - r, x)
  ctx.arcTo(x + w, x, x + w, x + r, r)
  ctx.lineTo(x + w, x + w - r)
  ctx.arcTo(x + w, x + w, x + w - r, x + w, r)
  ctx.lineTo(x + r, x + w)
  ctx.arcTo(x, x + w, x, x + w - r, r)
  ctx.lineTo(x, x + r)
  ctx.arcTo(x, x, x + r, x, r)
  ctx.closePath()
  ctx.strokeStyle = '#d0d0d0'
  ctx.lineWidth = b
  ctx.stroke()
  return new THREE.CanvasTexture(cv)
}

// The logo on both faces: drawn by `draw(ctx, size)`, or an image at `src`
// (the texture updates once it loads)
function makeLogoTex(draw, src) {
  const S = 512
  const cv = document.createElement('canvas')
  cv.width = cv.height = S
  const ctx = cv.getContext('2d')
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  if (draw) draw(ctx, S)
  if (src) {
    const img = new Image()
    img.onload = () => { ctx.drawImage(img, 0, 0, S, S); tex.needsUpdate = true }
    img.src = src
  }
  return tex
}

const IDLE_VEL = 1.5
const FRAME_MIN = 1 / 60

function Chip({ stateRef, draw, src, logoSize }) {
  const groupRef = useRef()
  const borderTex = useMemo(() => makeBorderTex(), [])
  const logoTex   = useMemo(() => makeLogoTex(draw, src), [draw, src])
  const lastFrame = useRef(0)

  const [chipGeo, faceMat, edgeMat] = useMemo(() => {
    const shape = makeRoundedRectShape(1.0, 1.0, CORNER_R)
    const geo = new THREE.ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: false })
    geo.translate(0, 0, -DEPTH / 2)
    const face = new THREE.MeshStandardMaterial({
      color: '#ffffff', roughness: 0.3, metalness: 0,
      emissive: '#ffffff', emissiveIntensity: 0.3,
    })
    const edge = new THREE.MeshStandardMaterial({ color: '#e0e0e0', roughness: 0.5, metalness: 0 })
    return [geo, face, edge]
  }, [])

  useFrame((state, dt) => {
    const now = state.clock.elapsedTime
    // The clock starts again from 0 when the tile comes back on screen
    if (now < lastFrame.current) lastFrame.current = now - FRAME_MIN
    if (now - lastFrame.current < FRAME_MIN) return
    lastFrame.current = now
    const s = stateRef.current
    const g = groupRef.current
    if (!g) return
    const step = Math.min(dt, FRAME_MIN)
    if (!s.dragging) {
      s.velY += (IDLE_VEL - s.velY) * 3.0 * step
      s.rotY += s.velY * step
      s.velX += (-s.rotX * 14 - s.velX * 9) * step
      s.rotX += s.velX * step
    }
    g.rotation.x = s.rotX
    g.rotation.y = s.rotY
  })

  const FACE_Z  = DEPTH / 2 + 0.002
  const LOGO_SZ = logoSize

  return (
    <group ref={groupRef}>
      <mesh geometry={chipGeo} material={[faceMat, edgeMat]} />

      <mesh position={[0, 0, FACE_Z]}>
        <planeGeometry args={[1.0, 1.0]} />
        <meshBasicMaterial map={borderTex} transparent />
      </mesh>

      <mesh position={[0, 0, FACE_Z + 0.001]}>
        <planeGeometry args={[LOGO_SZ, LOGO_SZ]} />
        <meshBasicMaterial map={logoTex} transparent alphaTest={0.01} />
      </mesh>

      <mesh position={[0, 0, -FACE_Z]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.0, 1.0]} />
        <meshBasicMaterial map={borderTex} transparent />
      </mesh>

      <mesh position={[0, 0, -FACE_Z - 0.001]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[LOGO_SZ, LOGO_SZ]} />
        <meshBasicMaterial map={logoTex} transparent alphaTest={0.01} />
      </mesh>
    </group>
  )
}

const TileSpinner = forwardRef(function TileSpinner({ size = 72, interactive = true, draw, src, logoSize = 0.62 }, ref) {
  const stateRef = useRef({
    rotX: 0, rotY: 0,
    velX: 0, velY: 9,
    dragging: false,
    lastX: 0, lastY: 0, lastTime: 0,
  })
  const [grabbing, setGrabbing] = useState(false)
  // Each tile is a WebGL scene of its own: it renders only while on screen
  const boxRef = useRef(null)
  const live = useInView(boxRef)

  function onPointerDown(e) {
    if (!interactive) return
    const s = stateRef.current
    e.currentTarget.setPointerCapture(e.pointerId)
    s.dragging = true
    s.lastX = e.clientX; s.lastY = e.clientY
    s.velX = 0; s.velY = 0
    s.lastTime = performance.now()
    setGrabbing(true)
  }

  function onPointerMove(e) {
    if (!interactive) return
    const s = stateRef.current
    if (!s.dragging) return
    const now = performance.now()
    const dt  = Math.max((now - s.lastTime) / 1000, 0.001)
    s.lastTime = now
    const dx = e.clientX - s.lastX
    const dy = e.clientY - s.lastY
    s.lastX = e.clientX; s.lastY = e.clientY
    const dY = dx * 0.013, dX = dy * 0.013
    s.rotY += dY
    s.rotX  = Math.max(-Math.PI * 0.45, Math.min(Math.PI * 0.45, s.rotX + dX))
    const MAX = 10
    s.velY = Math.max(-MAX, Math.min(MAX, dY / dt))
    s.velX = Math.max(-MAX, Math.min(MAX, dX / dt))
  }

  function onPointerUp() {
    if (!interactive) return
    stateRef.current.dragging = false
    setGrabbing(false)
  }

  return (
    <div ref={ref} style={{ display: 'flex', justifyContent: 'center', paddingBlock: '8px' }}>
      <div
        ref={boxRef}
        style={{ width: size, height: size, cursor: interactive ? (grabbing ? 'grabbing' : 'grab') : 'inherit' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <Canvas
          frameloop={live ? 'always' : 'never'}
          flat
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 0, 2.2], fov: 38 }}
        >
          <directionalLight position={[0, 0, 5]} intensity={1.2} />
          <directionalLight position={[2, 4, 4]} intensity={1.4} />
          <directionalLight position={[-2, -1, 2]} intensity={0.2} color="#ddeeff" />
          <ambientLight intensity={1.0} />
          <WakeOnShow live={live} />
          <Chip stateRef={stateRef} draw={draw} src={src} logoSize={logoSize} />
        </Canvas>
      </div>
    </div>
  )
})

export default TileSpinner
