import { useEffect, useState } from 'react'

/**
 * Whether `ref`'s element is on screen (with a margin, so loops are running
 * again before anything scrolls into view). Animations use it to rest while
 * nobody can see them.
 */
export function useInView(ref, rootMargin = '200px') {
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  return inView
}

/**
 * The same for a plain loop: calls `onChange(visible)` as the element comes
 * and goes. Returns the cleanup.
 */
export function watchInView(el, onChange, rootMargin = '200px') {
  if (typeof IntersectionObserver === 'undefined') return () => {}
  const io = new IntersectionObserver(([e]) => onChange(e.isIntersecting), { rootMargin })
  io.observe(el)
  return () => io.disconnect()
}
