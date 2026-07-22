import { useEffect, useRef, useState } from 'react'
import { acquireVideoSlot } from '../lib/videoLoadQueue'
import { posterForVideo } from '../lib/videoPoster'

/**
 * Autoplaying muted loop that:
 * - holds a dark surface + poster still (never looks empty/broken)
 * - only attaches `src` once near the viewport
 * - shares a global download queue (max 2) so clips don't contend
 * - fades the video in on top of the poster once a frame is ready
 */
export default function FadeVideo({
  src,
  style,
  rootMargin = '240px 0px',
  objectFit,
  poster,
  ...props
}) {
  const wrapRef = useRef(null)
  const releaseRef = useRef(null)
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === 'undefined',
  )
  const [grantedSrc, setGrantedSrc] = useState(null)
  const [loadedSrc, setLoadedSrc] = useState(null)
  const [posterReady, setPosterReady] = useState(false)
  const posterSrc = poster || posterForVideo(src)
  const active = grantedSrc === src
  const loaded = loadedSrc === src

  useEffect(() => {
    const el = wrapRef.current
    if (!el || inView) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [inView, rootMargin])

  useEffect(() => {
    if (!inView) return undefined

    let cancelled = false

    acquireVideoSlot().then((release) => {
      if (cancelled) {
        release()
        return
      }
      releaseRef.current = release
      setGrantedSrc(src)
    })

    return () => {
      cancelled = true
      releaseRef.current?.()
      releaseRef.current = null
      setGrantedSrc(null)
    }
  }, [inView, src])

  function releaseSlot() {
    releaseRef.current?.()
    releaseRef.current = null
  }

  const fill = Boolean(objectFit)
  const videoPinned = fill || Boolean(posterSrc)

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        width: '100%',
        height: fill ? '100%' : undefined,
        // Hold color while poster/video bytes arrive — never flash page white
        backgroundColor: '#0a0a0a',
        ...style,
      }}
    >
      {posterSrc && (
        <img
          src={posterSrc}
          alt=""
          aria-hidden="true"
          draggable={false}
          onLoad={() => setPosterReady(true)}
          style={{
            width: '100%',
            height: fill ? '100%' : 'auto',
            display: 'block',
            objectFit: objectFit || undefined,
            ...(fill ? { position: 'absolute', inset: 0 } : null),
            // Poster stays put under the video — no crossfade gap / white flash
            opacity: posterReady ? 1 : 0,
            transition: 'opacity 0.25s ease',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      )}
      <video
        src={active ? src : undefined}
        preload={active ? 'auto' : 'none'}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => {
          setLoadedSrc(src)
          releaseSlot()
        }}
        onError={releaseSlot}
        style={{
          width: '100%',
          display: 'block',
          ...(videoPinned
            ? {
                position: 'absolute',
                inset: 0,
                height: '100%',
                objectFit: objectFit || 'cover',
              }
            : null),
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
        {...props}
      />
    </div>
  )
}
