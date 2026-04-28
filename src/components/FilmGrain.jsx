import { useEffect, useRef } from 'react'

export default function FilmGrain({ fps = 12, opacity = 0.04 }){
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let lastTime = 0
    const interval = 1000 / fps

    const resize = () => {
      // 1/3 resolution — each grain particle covers ~3×3 screen pixels,
      // giving that chunky analogue silver-halide look.
      canvas.width  = Math.round(canvas.offsetWidth  / 2)
      canvas.height = Math.round(canvas.offsetHeight / 2)
    }

    const render = (time) => {
      raf = requestAnimationFrame(render)
      if (time - lastTime < interval) return
      lastTime = time

      const { width, height } = canvas
      const imageData = ctx.createImageData(width, height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const r = Math.random()
        // Bimodal: most particles cluster toward dark or bright,
        // skipping the flat midtone grey that kills perceived contrast.
        const v = r < 0.5
          ? (Math.random() * Math.random() * 140) | 0
          : (255 - (Math.random() * Math.random() * 140)) | 0
        data[i]     = v
        data[i + 1] = v
        data[i + 2] = v
        data[i + 3] = 255
      }
      ctx.putImageData(imageData, 0, 0)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    raf = requestAnimationFrame(render)

    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [fps])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  )
}
