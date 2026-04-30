import { useState, useRef } from 'react'

export default function WebsiteComparison({ oldSrc, newSrc, oldLabel = 'Before', newLabel = 'After' }) {
  const [active, setActive] = useState('new')
  const [oldLoaded, setOldLoaded] = useState(false)
  const [newLoaded, setNewLoaded] = useState(false)
  const oldVideoRef = useRef()
  const newVideoRef = useRef()

  function pick(key) {
    setActive(key)
    const ref = key === 'old' ? oldVideoRef : newVideoRef
    if (ref.current) {
      ref.current.currentTime = 0
      ref.current.play()
    }
  }

  const mediaStyle = {
    position: 'absolute', inset: 0,
    width: '100%', height: '100%',
    objectFit: 'cover', objectPosition: 'top center',
    pointerEvents: 'none', userSelect: 'none',
  }

  function isVideo(src) {
    return src && (src.includes('.mp4') || src.includes('.webm'))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Segmented control */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          display: 'flex',
          background: '#EFEFEF',
          borderRadius: '999px',
          padding: '4px',
          gap: '2px',
        }}>
          {[['old', oldLabel], ['new', newLabel]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => pick(key)}
              style={{
                padding: '8px 24px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '14px',
                fontWeight: '500',
                letterSpacing: '-0.5px',
                lineHeight: 1,
                background: active === key ? '#ffffff' : 'transparent',
                color: active === key ? '#171717' : 'rgba(0,0,0,0.4)',
                boxShadow: active === key ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Media */}
      <div style={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        aspectRatio: '1200 / 776',
        background: '#111',
      }}>
        {/* Old */}
        <div style={{
          position: 'absolute', inset: 0,
          opacity: active === 'old' && oldLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}>
          {isVideo(oldSrc)
            ? <video ref={oldVideoRef} src={oldSrc} style={mediaStyle} autoPlay loop muted playsInline onLoadedData={() => setOldLoaded(true)} />
            : oldSrc ? <img src={oldSrc} alt={oldLabel} style={mediaStyle} /> : null
          }
        </div>

        {/* New */}
        <div style={{
          position: 'absolute', inset: 0,
          opacity: active === 'new' && newLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}>
          {isVideo(newSrc)
            ? <video ref={newVideoRef} src={newSrc} style={mediaStyle} autoPlay loop muted playsInline onLoadedData={() => setNewLoaded(true)} />
            : newSrc ? <img src={newSrc} alt={newLabel} style={mediaStyle} /> : null
          }
        </div>
      </div>

    </div>
  )
}
