/** Map a video src (with optional ?v=) to its extracted WebP poster in /public/posters. */
export function posterForVideo(src) {
  if (!src) return undefined
  const pathname = decodeURIComponent(String(src).split('?')[0])
  const file = pathname.split('/').filter(Boolean).pop() || ''
  const base = file.replace(/\.mp4$/i, '')
  if (!base) return undefined
  return `/posters/${encodeURIComponent(base)}.webp`
}
