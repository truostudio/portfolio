import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from '@phosphor-icons/react'
import { useBreakpoint } from '../hooks/useBreakpoint'
import UniblockSpinner from './UniblockSpinner'
import MakiverseSpinner from './MakiverseSpinner'
import GenerateButton from './GenerateButton'
import GrainGradientCard from './GrainGradientCard'
import DitheringCard from './DitheringCard'

const cardBase = {
  backgroundColor: '#fff',
  border: '1px solid #E9E9E9',
  borderRadius: '48px',
  overflow: 'hidden',
  position: 'relative',
}

const labelPill = {
  background: '#ffffff',
  border: '1px solid #ECECEC',
  borderRadius: '999px',
  padding: '10px 20px',
  fontSize: '16px',
  fontWeight: '500',
  letterSpacing: '-1px',
  color: '#171717',
  whiteSpace: 'nowrap',
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
}

const rebrand = {
  id: 'rebrand',
  title: 'Uniblock Design',
  body: 'A full brand overhaul for Uniblock. Shifted the visual identity from a heavy royal blue to a lighter, more accessible sky blue. The mark stayed the same — the color was the transformation.',
}

const projects = [
  {
    id: 6,
    title: 'ApeChain × Uniblock',
    body: 'ApeChain has a passionate, cult-like community. The goal was to grab their attention first, then bring them into the partnership story. Visually it needed to feel like we were reaching into their world and pulling them in. Applied the dither treatment to keep it on-brand for Uniblock while matching the energy of the audience.',
    image: '/poster-apechain.png',
    bg: '#EEF2FF',
    accent: '#3B5BDB',
  },
  {
    id: 7,
    title: 'Ecosystem Announcement',
    body: 'Used Zora\'s logo as a playful double entendre. "Ecosystem" refers to Uniblock\'s position hosting and controlling endpoints across all blockchains, but their mark reads as a spherical planet, so it lives in space. Applied Uniblock\'s dither design language for consistency across the brand. Also drew on Artemis II themes given its relevancy at the time.',
    image: '/poster-blockchains.webp',
    bg: '#0a0a12',
    accent: '#3B82F6',
  },
  {
    id: 8,
    title: 'Midnight × Uniblock',
    body: 'Placed Midnight\'s logo over a dark horse, a double entendre since the dark horse is shorthand for the underdog. Fitting given Midnight Build Club is geared toward founders and startups. Midnight\'s 3-dot logo, usually nested in a circle, is layered on top of the horse to pull focus to the center of the composition. Ties into the "We Run the Infra" headline, the feeling that we\'re about to take over.',
    image: '/poster-midnight.png',
    bg: '#EEF2FF',
    accent: '#3B5BDB',
  },
]

function HoverLabel({ title, hovered }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 28,
      left: '50%',
      transform: hovered
        ? 'translateX(-50%) translateY(0)'
        : 'translateX(-50%) translateY(80px)',
      opacity: hovered ? 1 : 0,
      transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease',
      zIndex: 2,
      pointerEvents: 'none',
    }}>
      <div style={labelPill}>{title}</div>
    </div>
  )
}

function PixelMascot() {
  const P = 4
  const PAD = 10
  const colors = { 1: '#2A2A2A', 2: '#8A8A8A', 3: '#C8C8C8', 4: '#FFFFFF', 5: '#E0E0E0' }
  const grid = [
    [0,0,1,1,1,1,1,1,1,1,0,0],
    [0,1,3,3,3,3,3,3,3,3,1,0],
    [1,2,3,3,3,3,3,3,3,3,2,1],
    [1,2,3,1,1,3,3,1,1,3,2,1],
    [1,2,3,1,4,3,3,4,1,3,2,1],
    [1,2,3,3,3,3,3,3,3,3,2,1],
    [0,1,3,3,3,1,1,3,3,3,1,0],
    [0,0,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,1,2,2,1,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [1,2,1,2,2,2,2,2,2,1,2,1],
    [1,2,1,2,5,5,5,5,2,1,2,1],
    [1,2,1,2,1,2,2,1,2,1,2,1],
    [1,2,1,2,2,2,2,2,2,1,2,1],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,1,1,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,1,1,0,0,0],
    [0,0,1,1,1,0,0,1,1,1,0,0],
  ]
  const GW = 12, GH = 18
  const svgW = GW * P + PAD * 2
  const svgH = GH * P + PAD * 2
  const sparks = [
    { cx: 6, cy: 8 }, { cx: svgW - 7, cy: 4 },
    { cx: svgW - 3, cy: 26 }, { cx: 3, cy: 34 },
  ]
  return (
    <svg width={svgW} height={svgH} style={{ imageRendering: 'pixelated', overflow: 'visible' }}>
      {grid.map((row, r) => row.map((v, c) => v ? (
        <rect key={`${r}-${c}`} x={PAD + c * P} y={PAD + r * P} width={P} height={P} fill={colors[v]} />
      ) : null))}
      {sparks.map(({ cx, cy }, i) => (
        <g key={i} fill="#BBBBBB">
          <rect x={cx - 4} y={cy} width={9} height={1} />
          <rect x={cx} y={cy - 4} width={1} height={9} />
        </g>
      ))}
    </svg>
  )
}

function WIPCard({ style }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={{
        ...cardBase, ...style,
        transform: hovered ? 'scale(1.025)' : 'scale(1)',
        transition: hovered ? 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.2s ease-out',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <PixelMascot />
      </div>
      <HoverLabel title="Working on it" hovered={hovered} />
    </div>
  )
}

function GridCard({ bg, accent, title, image, onClick }) {
  const [hovered, setHovered] = useState(false)
  const { isTablet } = useBreakpoint()
  const imgRef = useRef(null)
  const target = useRef({ rx: 0, ry: 0, s: 1 })
  const current = useRef({ rx: 0, ry: 0, s: 1 })
  const rafRef = useRef(null)

  function tick() {
    if (!imgRef.current) { rafRef.current = null; return }
    const t = target.current, c = current.current
    c.rx += (t.rx - c.rx) * 0.13
    c.ry += (t.ry - c.ry) * 0.13
    c.s  += (t.s  - c.s)  * 0.13
    imgRef.current.style.transform = `rotateX(${c.rx}deg) rotateY(${c.ry}deg) scale(${c.s})`
    const done = Math.abs(t.rx - c.rx) < 0.01 && Math.abs(t.ry - c.ry) < 0.01 && Math.abs(t.s - c.s) < 0.0005
    rafRef.current = done ? null : requestAnimationFrame(tick)
  }

  function startTick() {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tick)
  }

  function onEnter() {
    setHovered(true)
    target.current.s = 1.05
    if (imgRef.current) {
      imgRef.current.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)'
      imgRef.current.style.transition = 'box-shadow 0.2s ease'
    }
    startTick()
  }

  function onMove(e) {
    if (!image) return
    const rect = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top)  / rect.height - 0.5
    target.current.rx = ny * -14
    target.current.ry = nx * 14
    startTick()
  }

  function onLeave() {
    setHovered(false)
    target.current = { rx: 0, ry: 0, s: 1 }
    if (imgRef.current) {
      imgRef.current.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
      imgRef.current.style.transition = 'box-shadow 0.4s ease'
    }
    startTick()
  }

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  return (
    <div
      style={{ ...cardBase, aspectRatio: isTablet ? '724 / 840' : undefined, height: isTablet ? undefined : '454px', cursor: 'pointer' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      onClick={onClick}
    >
      {image ? (
        <div style={{
          padding: isTablet ? '80px' : '52px', width: '100%', height: '100%',
          boxSizing: 'border-box',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          perspective: '900px',
        }}>
          <img
            ref={imgRef}
            src={image} alt={title}
            style={{
              maxWidth: '100%', maxHeight: '100%',
              objectFit: 'contain', display: 'block',
              borderRadius: '8px',
              outline: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
              willChange: 'transform',
            }}
          />
        </div>
      ) : (
        <div style={{
          padding: '32px', width: '100%', height: '100%',
          boxSizing: 'border-box',
          display: 'flex', alignItems: 'center',
        }}>
          <div style={{
            width: '100%', aspectRatio: '4/3',
            background: bg,
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 3px 3px rgba(0,0,0,0.09), 0 8px 5px rgba(0,0,0,0.05)',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            <div style={{ width: '50%', height: '50%', borderRadius: '8px', background: accent, opacity: 0.15 }} />
          </div>
        </div>
      )}

      {!image && <HoverLabel title={title} hovered={hovered} />}
    </div>
  )
}


function GenerateButtonCard() {
  const [hovered, setHovered] = useState(false)
  const [open, setOpen] = useState(false)
  const { isTablet } = useBreakpoint()

  return (
    <>
      <div
        style={{
          ...cardBase, backgroundColor: '#ffffff',
          aspectRatio: isTablet ? '724 / 840' : undefined, height: isTablet ? undefined : '454px', cursor: 'pointer',
          transform: hovered ? 'scale(1.025)' : 'scale(1)',
          transition: hovered ? 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.2s ease-out',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setOpen(true)}
      >
        <div style={{
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <GenerateButton />
        </div>
      </div>

      {open && (
        <Modal
          project={{
            title: 'Heatmap Shader',
            body: 'A shader that pulses with the generation process. The button reacts in real time, alive before you even tap it. Shipped to production.',
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

function DotGrid({ mouseRef }) {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const SPACING = 22
    const BASE_R = 0.8
    const HOVER_R = 2.8
    const EFFECT_R = 90
    const FRAME_MS = 1000 / 60
    let raf
    let lastDraw = 0

    function resize() {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    const dots = []
    function buildDots() {
      dots.length = 0
      const W = canvas.width, H = canvas.height
      const ox = (W % SPACING) / 2, oy = (H % SPACING) / 2
      for (let r = 0; r * SPACING + oy <= H + SPACING; r++)
        for (let c = 0; c * SPACING + ox <= W + SPACING; c++)
          dots.push({ x: ox + c * SPACING, y: oy + r * SPACING, size: BASE_R })
    }
    buildDots()

    function draw(now) {
      raf = requestAnimationFrame(draw)
      if (now - lastDraw < FRAME_MS) return
      lastDraw = now
      const W = canvas.offsetWidth, H = canvas.offsetHeight
      if (canvas.width !== W || canvas.height !== H) { resize(); buildDots() }
      ctx.clearRect(0, 0, W, H)
      const { x: mx, y: my, inside } = mouseRef.current
      for (const d of dots) {
        const dist = inside ? Math.hypot(d.x - mx, d.y - my) : Infinity
        const falloff = Math.max(0, 1 - dist / EFFECT_R)
        const target = BASE_R + (HOVER_R - BASE_R) * falloff * falloff
        d.size += (target - d.size) * 0.12
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2)
        ctx.fillStyle = '#ebebeb'
        ctx.fill()
      }
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [mouseRef])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
}

/** Updated on pointermove; scroll/resize recomputes vs rect (avoids bogus mouseenter/leave while scrolling). */
const globalPointerClientRef = {
  x: Number.NEGATIVE_INFINITY,
  y: Number.NEGATIVE_INFINITY,
}

function useCaseStudyCardHover(mouseRef) {
  const rootRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const tick = (fromScroll = false) => {
      const el = rootRef.current
      if (!el) return
      const { x, y } = globalPointerClientRef
      const r = el.getBoundingClientRect()
      const inside = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
      setHovered((prev) => {
        // scroll can only clear hover, never activate it
        if (fromScroll && !prev && inside) return prev
        if (inside) {
          mouseRef.current.x = x - r.left
          mouseRef.current.y = y - r.top
        }
        if (prev === inside) return prev
        mouseRef.current.inside = inside
        return inside
      })
    }

    const onPointerMove = (e) => {
      globalPointerClientRef.x = e.clientX
      globalPointerClientRef.y = e.clientY
      tick(false)
    }
    const onScrollOrResize = () => tick(true)

    document.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)

    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [mouseRef])

  return [rootRef, hovered]
}

function RebrandCard() {
  const navigate = useNavigate()
  const { isTablet } = useBreakpoint()
  const mouseRef = useRef({ x: -999, y: -999, inside: false })
  const [rootRef, hovered] = useCaseStudyCardHover(mouseRef)

  return (
    <div
      ref={rootRef}
      style={{ position: 'relative', aspectRatio: '724 / 840', flex: 1, cursor: 'pointer' }}
      onClick={() => navigate('/case-study/uniblock')}
    >
      <div style={{ ...cardBase, position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <DotGrid mouseRef={mouseRef} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 15%, rgba(255,255,255,0.85) 55%, #ffffff 72%)',
          pointerEvents: 'none',
        }} />
        <HoverLabel title="Uniblock Design" hovered={hovered} />
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <UniblockSpinner size={isTablet ? 96 : 140} interactive={false} />
      </div>
    </div>
  )
}

function MakiverseCard() {
  const navigate = useNavigate()
  const { isTablet } = useBreakpoint()
  const mouseRef = useRef({ x: -999, y: -999, inside: false })
  const [rootRef, hovered] = useCaseStudyCardHover(mouseRef)

  return (
    <div
      ref={rootRef}
      style={{ position: 'relative', aspectRatio: '724 / 840', flex: 1, cursor: 'pointer' }}
      onClick={() => navigate('/case-study/makiverse')}
    >
      <div style={{ ...cardBase, position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <DotGrid mouseRef={mouseRef} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 15%, rgba(255,255,255,0.85) 55%, #ffffff 72%)',
          pointerEvents: 'none',
        }} />
        <HoverLabel title="Makiverse Design" hovered={hovered} />
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <MakiverseSpinner size={isTablet ? 96 : 140} interactive={false} />
      </div>
    </div>
  )
}

function Modal({ project, onClose }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.32)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        animation: 'modalFadeIn 0.2s ease both',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '48px',
          padding: '52px',
          maxWidth: '560px',
          width: '100%',
          position: 'relative',
          animation: 'modalSlideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '24px', right: '24px',
            width: 40, height: 40,
            background: '#ffffff',
            border: '1px solid #E9E9E9',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <X size={16} weight="bold" color="#171717" />
        </button>

        <h2 style={{
          fontSize: '28px',
          fontWeight: '500',
          color: '#171717',
          letterSpacing: '-1px',
          margin: '0 0 16px',
          lineHeight: 1.2,
        }}>
          {project.title}
        </h2>
        <p style={{
          fontSize: '16px',
          color: 'rgba(0,0,0,0.48)',
          letterSpacing: '-1px',
          fontWeight: '500',
          lineHeight: 1.65,
          margin: 0,
        }}>
          {project.body}
        </p>
      </div>
    </div>
  )
}

export default function Work() {
  const [activeModal, setActiveModal] = useState(null)
  const { isMobile, isTablet, width } = useBreakpoint()

  const gap = isMobile ? '24px' : '48px'
  const gridCols3 = width < 1100 ? '1fr' : 'repeat(3, 1fr)'

  return (
    <section style={{ paddingBlock: '24px' }}>
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>

      <div style={{ maxWidth: '1554px', marginInline: 'auto', paddingInline: isMobile ? '16px' : isTablet ? '80px' : '48px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap, maxWidth: '1496px', marginInline: 'auto' }}>

          {/* Row 1 — rebrand + makiverse case studies */}
          <div style={{ display: 'flex', flexDirection: isTablet ? 'column' : 'row', gap }}>
            <RebrandCard />
            <MakiverseCard />
          </div>

          {/* Row 2 — three poster grid cards */}
          <div style={{ display: 'grid', gridTemplateColumns: gridCols3, gap }}>
            {projects.map((p) => (
              <GridCard key={p.id} {...p} onClick={() => setActiveModal(p)} />
            ))}
          </div>

          {/* Row 3 — dithering (span 2) + grain gradient */}
          <div style={{ display: 'grid', gridTemplateColumns: gridCols3, gap }}>
            <DitheringCard style={{ gridColumn: width >= 1100 ? 'span 2' : 'span 1', aspectRatio: isTablet ? '724 / 840' : undefined, height: isTablet ? undefined : '454px' }} />
            <GrainGradientCard style={{ aspectRatio: isTablet ? '724 / 840' : undefined, height: isTablet ? undefined : '454px' }} />
          </div>

        </div>
      </div>

      {activeModal && <Modal project={activeModal} onClose={() => setActiveModal(null)} />}
    </section>
  )
}
