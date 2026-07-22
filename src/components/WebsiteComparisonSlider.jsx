import { useEffect, useRef, useState } from 'react'
import { acquireVideoSlot } from '../lib/videoLoadQueue'
import { posterForVideo } from '../lib/videoPoster'

function isVideo(src) {
  return Boolean(src && (src.includes('.mp4') || src.includes('.webm')))
}

export default function WebsiteComparison({ oldSrc, newSrc, oldLabel = 'Before', newLabel = 'After' }) {
  const [active, setActive] = useState('new')
  const [oldLoaded, setOldLoaded] = useState(false)
  const [newLoaded, setNewLoaded] = useState(false)
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === 'undefined',
  )
  const [oldGranted, setOldGranted] = useState(false)
  const [newGranted, setNewGranted] = useState(false)
  const frameRef = useRef(null)
  const oldVideoRef = useRef()
  const newVideoRef = useRef()
  const oldReleaseRef = useRef(null)
  const newReleaseRef = useRef(null)
  const pendingOldRef = useRef(false)
  const pendingNewRef = useRef(false)

  const oldPoster = posterForVideo(oldSrc)
  const newPoster = posterForVideo(newSrc)

  useEffect(() => {
    const el = frameRef.current
    if (!el || inView) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '240px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [inView])

  // Active side first; once it has a frame, enqueue the other side.
  useEffect(() => {
    if (!inView) return undefined

    let cancelled = false
    const wantOld = isVideo(oldSrc) && (active === 'old' || newLoaded)
    const wantNew = isVideo(newSrc) && (active === 'new' || oldLoaded)

    if (wantNew && !newGranted && !pendingNewRef.current) {
      pendingNewRef.current = true
      acquireVideoSlot().then((release) => {
        if (cancelled) {
          release()
          pendingNewRef.current = false
          return
        }
        newReleaseRef.current = release
        setNewGranted(true)
      })
    }

    if (wantOld && !oldGranted && !pendingOldRef.current) {
      pendingOldRef.current = true
      acquireVideoSlot().then((release) => {
        if (cancelled) {
          release()
          pendingOldRef.current = false
          return
        }
        oldReleaseRef.current = release
        setOldGranted(true)
      })
    }

    return () => {
      cancelled = true
    }
  }, [inView, active, oldLoaded, newLoaded, oldGranted, newGranted, oldSrc, newSrc])

  useEffect(() => () => {
    oldReleaseRef.current?.()
    newReleaseRef.current?.()
  }, [])

  function pick(key) {
    setActive(key)
    const next = key === 'old' ? oldVideoRef : newVideoRef
    const prev = key === 'old' ? newVideoRef : oldVideoRef
    prev.current?.pause()
    if (next.current) {
      next.current.currentTime = 0
      next.current.play()
    }
  }

  const mediaStyle = {
    position: 'absolute', inset: 0,
    width: '100%', height: '100%',
    objectFit: 'cover', objectPosition: 'top center',
    pointerEvents: 'none', userSelect: 'none',
  }

  function releaseOld() {
    oldReleaseRef.current?.()
    oldReleaseRef.current = null
  }

  function releaseNew() {
    newReleaseRef.current?.()
    newReleaseRef.current = null
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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

      <div
        ref={frameRef}
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          aspectRatio: '1200 / 776',
          background: '#0a0a0a',
        }}
      >
        {/* Posters stay under the video so the frame is never empty */}
        {oldPoster && active === 'old' && (
          <img src={oldPoster} alt="" aria-hidden="true" style={mediaStyle} />
        )}
        {newPoster && active === 'new' && (
          <img src={newPoster} alt="" aria-hidden="true" style={mediaStyle} />
        )}

        <div style={{
          position: 'absolute', inset: 0,
          opacity: active === 'old' && oldLoaded ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}>
          {isVideo(oldSrc)
            ? (
              <video
                ref={oldVideoRef}
                src={oldGranted ? oldSrc : undefined}
                preload={oldGranted ? 'auto' : 'none'}
                style={mediaStyle}
                autoPlay={active === 'old'}
                loop
                muted
                playsInline
                onLoadedData={() => {
                  setOldLoaded(true)
                  releaseOld()
                }}
                onError={releaseOld}
              />
            )
            : oldSrc ? <img src={oldSrc} alt={oldLabel} style={mediaStyle} /> : null
          }
        </div>

        <div style={{
          position: 'absolute', inset: 0,
          opacity: active === 'new' && newLoaded ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}>
          {isVideo(newSrc)
            ? (
              <video
                ref={newVideoRef}
                src={newGranted ? newSrc : undefined}
                preload={newGranted ? 'auto' : 'none'}
                style={mediaStyle}
                autoPlay={active === 'new'}
                loop
                muted
                playsInline
                onLoadedData={() => {
                  setNewLoaded(true)
                  releaseNew()
                }}
                onError={releaseNew}
              />
            )
            : newSrc ? <img src={newSrc} alt={newLabel} style={mediaStyle} /> : null
          }
        </div>
      </div>
    </div>
  )
}
