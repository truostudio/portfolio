import { useEffect, useRef, useState } from 'react'
import { acquireVideoSlot } from '../lib/videoLoadQueue'
import { posterForVideo } from '../lib/videoPoster'

/**
 * Autoplaying muted loop that:
 * - shows a soft shimmer + poster still (never a black void)
 * - only attaches video `src` once near the viewport + download slot
 * - fades the video in only after a frame is ready / playback started
 */
export default function FadeVideo({
  src,
  style,
  rootMargin = '320px 0px',
  objectFit,
  poster,
  ...props
}) {
  const wrapRef = useRef(null)
  const videoRef = useRef(null)
  const releaseRef = useRef(null)
  const readyRef = useRef(false)
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === 'undefined',
  )
  const [grantedSrc, setGrantedSrc] = useState(null)
  const [loadedSrc, setLoadedSrc] = useState(null)
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

  // iOS often won't paint until play() resolves — kick it explicitly.
  useEffect(() => {
    if (!active) return undefined
    const video = videoRef.current
    if (!video) return undefined

    const tryPlay = () => {
      const playPromise = video.play()
      if (playPromise?.catch) playPromise.catch(() => {})
    }

    tryPlay()
    video.addEventListener('loadeddata', tryPlay)
    video.addEventListener('canplay', tryPlay)
    return () => {
      video.removeEventListener('loadeddata', tryPlay)
      video.removeEventListener('canplay', tryPlay)
    }
  }, [active, src])

  function releaseSlot() {
    releaseRef.current?.()
    releaseRef.current = null
  }

  function markReady() {
    if (readyRef.current && loadedSrc === src) return
    readyRef.current = true
    setLoadedSrc(src)
    releaseSlot()
  }

  const fill = Boolean(objectFit)

  return (
    <div
      ref={wrapRef}
      className={loaded ? undefined : 'video-shell-pending'}
      style={{
        position: 'relative',
        width: '100%',
        height: fill ? '100%' : undefined,
        overflow: 'hidden',
        backgroundColor: '#ECECEC',
        backgroundImage: posterSrc ? `url("${posterSrc}")` : undefined,
        backgroundSize: objectFit || 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        ...style,
      }}
    >
      {/* In-flow poster sizes the shell; stays visible under the video */}
      {posterSrc && (
        <img
          src={posterSrc}
          alt=""
          aria-hidden="true"
          draggable={false}
          decoding="async"
          fetchPriority={inView ? 'high' : 'low'}
          style={{
            width: '100%',
            height: fill ? '100%' : 'auto',
            display: 'block',
            objectFit: objectFit || 'cover',
            objectPosition: 'center top',
            position: fill ? 'absolute' : 'relative',
            ...(fill ? { inset: 0 } : null),
            zIndex: 1,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      )}
      <video
        ref={videoRef}
        src={active ? src : undefined}
        preload={active ? 'auto' : 'none'}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={markReady}
        onPlaying={markReady}
        onError={releaseSlot}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: objectFit || 'cover',
          objectPosition: 'center top',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
        {...props}
      />
    </div>
  )
}
