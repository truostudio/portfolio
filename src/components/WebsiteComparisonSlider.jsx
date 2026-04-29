import { useRef, useState, useEffect } from 'react'

const POSITIONS = [75, 25]
const HOLD_MS   = 2200
const EASE_MS   = 1400

export default function WebsiteComparisonSlider({ oldSrc, newSrc, oldLabel = 'Before', newLabel = 'After' }) {
  const containerRef = useRef()
  const draggingRef  = useRef(false)
  const [pct, setPct]         = useState(75)
  const [dragging, setDragging] = useState(false)
  const [animate, setAnimate]   = useState(false)
  const idxRef = useRef(0)

  useEffect(() => {
    let timeout
    function step() {
      if (draggingRef.current) { timeout = setTimeout(step, 200); return }
      idxRef.current = (idxRef.current + 1) % POSITIONS.length
      setAnimate(true)
      setPct(POSITIONS[idxRef.current])
      timeout = setTimeout(() => {
        setAnimate(false)
        timeout = setTimeout(step, HOLD_MS)
      }, EASE_MS)
    }
    timeout = setTimeout(step, HOLD_MS)
    return () => clearTimeout(timeout)
  }, [])

  function getX(e) {
    const rect = containerRef.current.getBoundingClientRect()
    return Math.max(4, Math.min(96, (e.clientX - rect.left) / rect.width * 100))
  }

  function onPointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId)
    draggingRef.current = true
    setDragging(true)
    setAnimate(false)
    setPct(getX(e))
  }

  function onPointerMove(e) {
    if (!draggingRef.current) return
    setPct(getX(e))
  }

  function onPointerUp() {
    draggingRef.current = false
    setDragging(false)
  }

  const imgStyle = {
    position: 'absolute', inset: 0,
    width: '100%', height: '100%',
    objectFit: 'cover', objectPosition: 'top center',
    userSelect: 'none', pointerEvents: 'none',
    imageRendering: 'high-quality',
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        aspectRatio: '2082 / 1268',
        userSelect: 'none',
        cursor: dragging ? 'ew-resize' : 'default',
      }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Old — left side, sits underneath */}
      {oldSrc
        ? <img src={oldSrc} alt={oldLabel} style={imgStyle} />
        : <div style={{ position: 'absolute', inset: 0, background: '#0A1628' }} />
      }

      {/* New — right side, clips in from the right */}
      <div style={{
        position: 'absolute', inset: 0,
        clipPath: `inset(0 0 0 ${pct}%)`,
        transition: animate ? `clip-path ${EASE_MS}ms cubic-bezier(0.76, 0, 0.24, 1)` : 'none',
      }}>
        {newSrc
          ? <img src={newSrc} alt={newLabel} style={imgStyle} />
          : <div style={{ width: '100%', height: '100%', background: '#F5FBFF' }} />
        }
      </div>

      {/* Divider */}
      <div
        style={{
          position: 'absolute', top: 0, bottom: 0,
          left: `${pct}%`,
          width: '1px',
          background: 'rgba(255,255,255,0.6)',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          transition: animate ? `left ${EASE_MS}ms cubic-bezier(0.76, 0, 0.24, 1)` : 'none',
        }}
      />

      {/* Handle */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: `${pct}%`,
          transform: 'translate(-50%, -50%)',
          transition: animate ? `left ${EASE_MS}ms cubic-bezier(0.76, 0, 0.24, 1)` : 'none',
          width: '36px', height: '36px',
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
          cursor: 'ew-resize',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10,
          flexShrink: 0,
        }}
        onPointerDown={onPointerDown}
      >
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
          <path d="M1 5H13M1 5L3.5 2.5M1 5L3.5 7.5M13 5L10.5 2.5M13 5L10.5 7.5" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Labels */}
      <div style={{
        position: 'absolute', bottom: '20px', left: '20px',
        fontSize: '12px', fontWeight: '500', letterSpacing: '0.5px',
        color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase',
        pointerEvents: 'none',
        opacity: pct > 12 ? 1 : 0, transition: 'opacity 0.4s',
      }}>
        {oldLabel}
      </div>
      <div style={{
        position: 'absolute', bottom: '20px', right: '20px',
        fontSize: '12px', fontWeight: '500', letterSpacing: '0.5px',
        color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase',
        pointerEvents: 'none',
        opacity: pct < 88 ? 1 : 0, transition: 'opacity 0.4s',
      }}>
        {newLabel}
      </div>
    </div>
  )
}
