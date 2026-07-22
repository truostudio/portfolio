import { useEffect, useRef, useState } from 'react'

/**
 * Autoplaying muted loop that only attaches `src` once near the viewport,
 * then fades in on the first decoded frame.
 */
export default function FadeVideo({
  src,
  style,
  rootMargin = '240px 0px',
  objectFit,
  ...props
}) {
  const ref = useRef(null)
  const [active, setActive] = useState(
    () => typeof IntersectionObserver === 'undefined',
  )
  const [loadedSrc, setLoadedSrc] = useState(null)
  const loaded = active && loadedSrc === src

  useEffect(() => {
    const el = ref.current
    if (!el || active) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [active, rootMargin])

  return (
    <video
      ref={ref}
      src={active ? src : undefined}
      preload={active ? 'metadata' : 'none'}
      autoPlay
      loop
      muted
      playsInline
      onLoadedData={() => setLoadedSrc(src)}
      style={{
        width: '100%',
        display: 'block',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.4s ease',
        ...(objectFit ? { objectFit, height: '100%' } : null),
        ...style,
      }}
      {...props}
    />
  )
}
