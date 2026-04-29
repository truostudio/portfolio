import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from '@phosphor-icons/react'
import { useBreakpoint } from '../hooks/useBreakpoint'

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
    id: 1,
    title: 'Vanta Mobile',
    body: 'A mobile banking app redesign focused on reducing cognitive load during transactions. Built for iOS with a strong emphasis on clarity and accessibility.',
    bg: '#F0F4FF',
    accent: '#3B5BDB',
  },
  {
    id: 2,
    title: 'Studio Platform',
    body: 'A collaborative design platform for distributed teams. Streamlines the handoff between design and engineering at scale.',
    bg: '#FFF0F6',
    accent: '#C2255C',
  },
  {
    id: 3,
    title: 'Atlas Design System',
    body: 'A component library built for product teams at scale. Covers tokens, patterns, and living documentation across platforms.',
    bg: '#F0FFF4',
    accent: '#2F9E44',
  },
  {
    id: 4,
    title: 'Orbit Dashboard',
    body: 'An analytics dashboard for ops teams. Surfaces real-time data with a focus on legibility and fast decision-making.',
    bg: '#FFF9DB',
    accent: '#E67700',
  },
  {
    id: 5,
    title: 'Lens App',
    body: 'A photography companion app for managing shoots and editing workflows. Designed around a minimal, distraction-free interface.',
    bg: '#F3F0FF',
    accent: '#6741D9',
  },
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

function PhoneFrame({ bg, accent, title }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{ position: 'relative', height: '100%', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: hovered ? 'scale(1.07)' : 'scale(1)',
        transition: 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <div style={{
          width: '200px',
          aspectRatio: '76.7 / 161.9',
          backgroundColor: '#1D1D1F',
          borderRadius: '32px',
          padding: '5px',
          boxShadow: hovered
            ? '0 12px 32px rgba(0,0,0,0.18), 0 4px 8px rgba(0,0,0,0.10)'
            : '0 3px 3px rgba(0,0,0,0.09), 0 8px 5px rgba(0,0,0,0.05), 0 14px 5px rgba(0,0,0,0.01)',
          transition: 'box-shadow 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
          maxHeight: '460px',
        }}>
          <div style={{
            width: '100%', height: '100%',
            borderRadius: '27px',
            border: '1px solid rgba(0,0,0,0.1)',
            overflow: 'clip',
            background: bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: '60%', height: '60%', borderRadius: '12px', background: accent, opacity: 0.2 }} />
          </div>
        </div>
      </div>

      <HoverLabel title={title} hovered={hovered} />
    </div>
  )
}

function GridCard({ bg, accent, title, image, onClick }) {
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const { isTablet } = useBreakpoint()

  function onMove(e) {
    if (!image) return
    const rect = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - rect.left)  / rect.width  - 0.5
    const ny = (e.clientY - rect.top)   / rect.height - 0.5
    setTilt({ x: ny * -14, y: nx * 14 })
  }

  function onLeave() {
    setHovered(false)
    setTilt({ x: 0, y: 0 })
  }

  return (
    <div
      style={{ ...cardBase, height: isTablet ? '300px' : '454px', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      onClick={onClick}
    >
      {image ? (
        <div style={{
          padding: '52px', width: '100%', height: '100%',
          boxSizing: 'border-box',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          perspective: '900px',
        }}>
          <img
            src={image} alt={title}
            style={{
              maxWidth: '100%', maxHeight: '100%',
              objectFit: 'contain', display: 'block',
              borderRadius: '8px',
              outline: '1px solid rgba(0,0,0,0.06)',
              boxShadow: hovered
                ? '0 12px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)'
                : '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
              transform: hovered
                ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.05)`
                : 'rotateX(0deg) rotateY(0deg) scale(1)',
              transition: hovered
                ? 'transform 0.08s linear, box-shadow 0.2s ease'
                : 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease',
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

function ProjectCardWide({ bg, accent, title }) {
  return (
    <div style={{ ...cardBase, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, background: bg, position: 'relative', overflow: 'clip' }}>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: '40%', height: '50%', borderRadius: '16px', background: accent, opacity: 0.12 }} />
        </div>
      </div>
      <div style={{ padding: '24px 32px', borderTop: '1px solid #E9E9E9' }}>
        <div style={{ fontSize: '18px', fontWeight: '500', color: '#171717', letterSpacing: '-1px' }}>{title}</div>
      </div>
    </div>
  )
}

function RebrandCard() {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const videoRef = useRef(null)

  return (
    <div
      style={{ ...cardBase, aspectRatio: '724 / 840', flex: 1, cursor: 'pointer', background: '#0a0a0a' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate('/case-study/uniblock')}
    >
      <video
        ref={videoRef}
        src="/new-site.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'top center',
          transform: hovered ? 'scale(1.03)' : 'scale(1)',
          transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
      <HoverLabel title="Uniblock Design" hovered={hovered} />
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
  const { isTablet, width } = useBreakpoint()

  const gap = isTablet ? '16px' : '48px'
  const gridCols3 = width < 640 ? '1fr' : width < 1100 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'

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

      <div style={{ maxWidth: '1554px', marginInline: 'auto', paddingInline: isTablet ? '16px' : '48px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap, maxWidth: '1496px', marginInline: 'auto' }}>

          {/* Row 1 — rebrand case study + phone card */}
          <div style={{ display: 'flex', flexDirection: isTablet ? 'column' : 'row', gap }}>
            <RebrandCard />
            <div style={{ ...cardBase, flex: isTablet ? 'none' : 1, width: isTablet ? '100%' : undefined, aspectRatio: '724 / 840' }}>
              <PhoneFrame {...projects[1]} />
            </div>
          </div>

          {/* Row 2 — three grid cards, click → modal */}
          <div style={{ display: 'grid', gridTemplateColumns: gridCols3, gap }}>
            {[projects[2], projects[3], projects[4]].map((p) => (
              <GridCard key={p.id} {...p} onClick={() => setActiveModal(p)} />
            ))}
          </div>

          {/* Row 3 — two more phone cards */}
          <div style={{ display: 'flex', flexDirection: isTablet ? 'column' : 'row', gap }}>
            <div style={{ ...cardBase, flex: isTablet ? 'none' : 1, width: isTablet ? '100%' : undefined, aspectRatio: '724 / 840' }}>
              <PhoneFrame {...projects[3]} />
            </div>
            <div style={{ ...cardBase, flex: isTablet ? 'none' : 1, width: isTablet ? '100%' : undefined, aspectRatio: '724 / 840' }}>
              <PhoneFrame {...projects[4]} />
            </div>
          </div>

          {/* Row 4 — three grid cards, click → modal */}
          <div style={{ display: 'grid', gridTemplateColumns: gridCols3, gap }}>
            {[projects[5], projects[6], projects[7]].map((p) => (
              <GridCard key={p.id} {...p} onClick={() => setActiveModal(p)} />
            ))}
          </div>

        </div>
      </div>

      {activeModal && <Modal project={activeModal} onClose={() => setActiveModal(null)} />}
    </section>
  )
}
