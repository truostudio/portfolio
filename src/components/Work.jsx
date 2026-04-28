import { useState } from 'react'
import { X } from '@phosphor-icons/react'

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

function GridCard({ bg, accent, title, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{ ...cardBase, height: '454px', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
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
        }}>
          <div style={{ width: '50%', height: '50%', borderRadius: '8px', background: accent, opacity: 0.15 }} />
        </div>
      </div>

      <HoverLabel title={title} hovered={hovered} />
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

      <div style={{ maxWidth: '1554px', marginInline: 'auto', paddingInline: '48px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '1496px', marginInline: 'auto' }}>

          {/* Row 1 — two phone cards */}
          <div style={{ display: 'flex', gap: '48px' }}>
            <div style={{ ...cardBase, flex: 1, aspectRatio: '724 / 840' }}>
              <PhoneFrame {...projects[0]} />
            </div>
            <div style={{ ...cardBase, flex: 1, aspectRatio: '724 / 840' }}>
              <PhoneFrame {...projects[1]} />
            </div>
          </div>

          {/* Row 2 — three grid cards, click → modal */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px' }}>
            {[projects[2], projects[3], projects[4]].map((p) => (
              <GridCard key={p.id} {...p} onClick={() => setActiveModal(p)} />
            ))}
          </div>

          {/* Row 3 — two more phone cards */}
          <div style={{ display: 'flex', gap: '48px' }}>
            <div style={{ ...cardBase, flex: 1, aspectRatio: '724 / 840' }}>
              <PhoneFrame {...projects[3]} />
            </div>
            <div style={{ ...cardBase, flex: 1, aspectRatio: '724 / 840' }}>
              <PhoneFrame {...projects[4]} />
            </div>
          </div>

          {/* Row 4 — wide card + square */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px' }}>
            <div style={{ ...cardBase, gridColumn: 'span 2', aspectRatio: '2.107 / 1' }}>
              <ProjectCardWide {...projects[0]} />
            </div>
            <div style={{ ...cardBase, aspectRatio: '1 / 1' }}>
              <div style={{
                height: '100%', background: projects[1].bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: '60%', height: '60%', borderRadius: '16px', background: projects[1].accent, opacity: 0.15 }} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {activeModal && <Modal project={activeModal} onClose={() => setActiveModal(null)} />}
    </section>
  )
}
