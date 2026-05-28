import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from '@phosphor-icons/react'

/** Increment when you replace `public/action-bar.mp4` so cached copies refresh. */
const ACTION_BAR_REV = 1

export default function ActionBarCard({ style }) {
  const [hovered, setHovered] = useState(false)
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        style={{
          borderRadius: '48px',
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          backgroundColor: '#0a0a0a',
          transform: hovered ? 'scale(1.025)' : 'scale(1)',
          transition: hovered ? 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.2s ease-out',
          ...style,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setOpen(true)}
      >
        <video
          key={ACTION_BAR_REV}
          src={`/action-bar.mp4?v=${ACTION_BAR_REV}`}
          muted
          loop
          playsInline
          autoPlay
          aria-label="Mobile action bar prototype"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>

      {open && createPortal(
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
          onClick={() => setOpen(false)}
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
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute', top: '24px', right: '24px',
                width: 40, height: 40,
                background: '#ffffff',
                border: '1px solid #E9E9E9',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', padding: 0,
              }}
            >
              <X size={16} weight="bold" color="#171717" />
            </button>
            <h2 style={{ fontSize: '28px', fontWeight: '500', color: '#171717', letterSpacing: '-1px', margin: '0 0 16px', lineHeight: 1.2 }}>
              Makiverse Action Bar
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(0,0,0,0.48)', letterSpacing: '-1px', fontWeight: '500', lineHeight: 1.65, margin: 0 }}>
              Redesigned the Makiverse action bar to feel robust without feeling heavy. One clean bar on the surface, but it adapts as you work, surfacing the right tools for whatever you&apos;re doing instead of showing you everything at once.
            </p>
            <p style={{ fontSize: '16px', color: 'rgba(0,0,0,0.48)', letterSpacing: '-1px', fontWeight: '500', lineHeight: 1.65, margin: '16px 0 0' }}>
              It&apos;s also home to Polish, which runs a full pass over your draft and turns it into a real, professional-quality manga page, and Image Adjustment, which gives you fine control over cropping and resizing, all right in the flow without leaving the canvas.
            </p>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
