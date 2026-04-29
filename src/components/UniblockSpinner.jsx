import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, useState, forwardRef } from 'react'
import * as THREE from 'three'

const MARK_PATHS = [
  "M35.6204 67.0001C35.0167 67.0001 34.3123 66.8995 33.8092 66.5976L2.2137 50.1958C0.804982 49.4914 0 48.0826 0 46.6739V12.4615C0 10.2478 1.81121 8.43652 4.02491 8.43652C6.23861 8.43652 8.04982 10.2478 8.04982 12.4615V44.2589L35.6204 58.5476L63.1911 44.2589V12.4615C63.1911 10.2478 65.0023 8.43652 67.216 8.43652C69.4297 8.43652 71.2409 10.2478 71.2409 12.4615V46.6739C71.2409 48.1833 70.4359 49.592 69.0272 50.2964L37.4317 66.5976C36.9285 66.8995 36.2242 67.0001 35.6204 67.0001Z",
  "M20.6796 16.9606L35.0798 8.60879C35.5091 8.39352 35.7284 8.39791 36.1662 8.60875L50.5646 16.9623C51.2689 17.3648 51.2689 18.3693 50.5646 18.7718L36.1663 27.0231C35.7575 27.228 35.4824 27.2243 35.0799 27.0231L20.6796 18.7718C19.9753 18.3694 19.9753 17.3631 20.6796 16.9606Z",
  "M18.5137 37.3684V20.7653C18.5137 19.9603 19.4193 19.4572 20.1237 19.8597L34.5127 28.1109C34.8146 28.3122 35.0159 28.614 35.0159 29.0165V45.6196C35.0159 46.4246 34.1103 46.9277 33.4059 46.5252L19.0168 38.274C18.715 38.0727 18.5137 37.6703 18.5137 37.3684Z",
  "M36.7282 28.1109L51.1173 19.8597C51.8216 19.4572 52.7272 19.9603 52.7272 20.7653V37.3684C52.7272 37.7709 52.526 38.0727 52.2241 38.274L37.8351 46.5252C37.1307 46.9277 36.2251 46.4246 36.2251 45.6196V29.0165C36.2251 28.614 36.4263 28.3122 36.7282 28.1109Z",
]

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

function makeLogoTex() {
  const S = 512
  const cv = document.createElement('canvas')
  cv.width = cv.height = S
  const ctx = cv.getContext('2d')
  const W = 71.2409, H = 67
  const scale = (S * 0.62) / Math.max(W, H)
  ctx.save()
  ctx.translate((S - W * scale) / 2, (S - H * scale) / 2)
  ctx.scale(scale, scale)
  ctx.fillStyle = '#1FB6FF'
  MARK_PATHS.forEach(d => ctx.fill(new Path2D(d)))
  ctx.restore()
  return new THREE.CanvasTexture(cv)
}

const IDLE_VEL = 0.45
const FRAME_MIN = 1 / 60

function Chip({ stateRef }) {
  const groupRef = useRef()
  const borderTex = useMemo(() => makeBorderTex(), [])
  const logoTex   = useMemo(() => makeLogoTex(), [])
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
  const LOGO_SZ = 0.62

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

const UniblockSpinner = forwardRef(function UniblockSpinner({ size = 72, interactive = true }, ref) {
  const stateRef = useRef({
    rotX: 0, rotY: 0,
    velX: 0, velY: 9,
    dragging: false,
    lastX: 0, lastY: 0, lastTime: 0,
  })
  const [grabbing, setGrabbing] = useState(false)

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
        style={{ width: size, height: size, cursor: interactive ? (grabbing ? 'grabbing' : 'grab') : 'default' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <Canvas
          flat
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 0, 2.2], fov: 38 }}
        >
          <directionalLight position={[0, 0, 5]} intensity={1.2} />
          <directionalLight position={[2, 4, 4]} intensity={1.4} />
          <directionalLight position={[-2, -1, 2]} intensity={0.2} color="#ddeeff" />
          <ambientLight intensity={1.0} />
          <Chip stateRef={stateRef} />
        </Canvas>
      </div>
    </div>
  )
})

export default UniblockSpinner
