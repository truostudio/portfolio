import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshTransmissionMaterial, Environment } from '@react-three/drei'
import * as THREE from 'three'

// ── Context ───────────────────────────────────────────────────────────────────

const Ctx = createContext(null)
let uid = 0

export function GlassProvider({ children }) {
  const [pills, setPills] = useState([])

  const register = useCallback((id, ref, bg) => {
    setPills(p => [...p, { id, ref, bg }])
    return () => setPills(p => p.filter(x => x.id !== id))
  }, [])

  return (
    <Ctx.Provider value={{ register }}>
      {children}
      <GlassCanvas pills={pills} />
    </Ctx.Provider>
  )
}

export function useGlass(bg = '#f0f2f8') {
  const ctx = useContext(Ctx)
  const ref = useRef(null)
  const id = useRef(uid++)
  useEffect(() => {
    if (ctx?.register) return ctx.register(id.current, ref, bg)
  }, []) // eslint-disable-line
  return ref
}

// ── Pill geometry (shape-based, cached) ───────────────────────────────────────

const geoCache = new Map()

function makePillGeo(w, h) {
  const key = `${~~w}x${~~h}`
  if (geoCache.has(key)) return geoCache.get(key)

  const r = h / 2
  const shape = new THREE.Shape()
  // right cap: bottom → right → top
  shape.absarc(w / 2 - r, 0, r, -Math.PI / 2, Math.PI / 2, false)
  // left cap: top → left → bottom (line from top-right to top-left auto-added)
  shape.absarc(-(w / 2 - r), 0, r, Math.PI / 2, Math.PI * 1.5, false)
  shape.closePath()

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 10,
    bevelEnabled: true,
    bevelThickness: 4,
    bevelSize: 4,
    bevelSegments: 10,
    curveSegments: 24,
  })
  geo.center()
  geoCache.set(key, geo)
  return geo
}

// ── Background plane (sits behind each pill, provides the refraction source) ──

function BgPlane({ domRef, color }) {
  const ref = useRef()
  const { size } = useThree()

  useFrame(() => {
    if (!ref.current || !domRef.current) return
    const r = domRef.current.getBoundingClientRect()
    ref.current.position.set(
      r.left + r.width / 2 - size.width / 2,
      size.height / 2 - r.top - r.height / 2,
      -6
    )
    ref.current.scale.set(r.width + 8, r.height + 8, 1)
  })

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

// ── Glass pill ────────────────────────────────────────────────────────────────

function GlassPill({ domRef }) {
  const ref = useRef()
  const { size } = useThree()
  const [dims, setDims] = useState(null)

  useFrame(() => {
    if (!domRef.current) return
    const r = domRef.current.getBoundingClientRect()
    if (ref.current) {
      ref.current.position.set(
        r.left + r.width / 2 - size.width / 2,
        size.height / 2 - r.top - r.height / 2,
        0
      )
    }
    // Only re-render when size actually changes (avoids 60fps setState storms)
    setDims(d =>
      !d || Math.abs(d.w - r.width) > 1 || Math.abs(d.h - r.height) > 1
        ? { w: r.width, h: r.height }
        : d
    )
  })

  const geo = useMemo(() => (dims ? makePillGeo(dims.w, dims.h) : null), [dims])
  if (!geo) return null

  return (
    <mesh ref={ref} geometry={geo}>
      <MeshTransmissionMaterial
        resolution={512}
        transmission={1}
        roughness={0.0}
        ior={1.52}
        thickness={12}
        chromaticAberration={0.06}
        distortion={0.3}
        distortionScale={0.4}
        temporalDistortion={0.05}
        anisotropy={0.3}
        backside
        color="white"
        envMapIntensity={0.8}
      />
    </mesh>
  )
}

// ── Scene ─────────────────────────────────────────────────────────────────────

function Scene({ pills }) {
  return (
    <>
      <Environment preset="city" />
      {pills.map(({ id, ref, bg }) => (
        <BgPlane key={`bg-${id}`} domRef={ref} color={bg} />
      ))}
      {pills.map(({ id, ref }) => (
        <GlassPill key={`pill-${id}`} domRef={ref} />
      ))}
    </>
  )
}

// ── Canvas (fixed overlay, pointer-events none so HTML stays clickable) ───────

function GlassCanvas({ pills }) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 200], zoom: 1, near: 0.1, far: 1000 }}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 98,
      }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <Scene pills={pills} />
    </Canvas>
  )
}
