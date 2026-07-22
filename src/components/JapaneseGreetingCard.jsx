import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from '@phosphor-icons/react'
import FadeVideo from './FadeVideo'

/** Increment when you replace `public/Japanese-greeting.mp4` so cached copies refresh. */
const JAPANESE_GREETING_REV = 5

export default function JapaneseGreetingCard({ style }) {
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
          backgroundColor: '#ECECEC',
          transform: hovered ? 'scale(1.025)' : 'scale(1)',
          transition: hovered ? 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.2s ease-out',
          ...style,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setOpen(true)}
      >
        <FadeVideo
          key={JAPANESE_GREETING_REV}
          src={`/Japanese-greeting.mp4?v=${JAPANESE_GREETING_REV}`}
          objectFit="cover"
          aria-label="Learning Japanese video"
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
              Learning Japanese
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(0,0,0,0.48)', letterSpacing: '-1px', fontWeight: '500', lineHeight: 1.65, margin: 0 }}>
              As part of learning Japanese, I built a small personal project focused on everyday greetings and farewells.
            </p>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
