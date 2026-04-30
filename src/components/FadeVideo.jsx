import { useState } from 'react'

export default function FadeVideo({ src, style, ...props }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      onLoadedData={() => setLoaded(true)}
      style={{
        width: '100%',
        display: 'block',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.4s ease',
        ...style,
      }}
      {...props}
    />
  )
}
