import { useRef, useState, useCallback } from 'react'

/**
 * Renders the SVG filter defs once at the app root.
 * lg-lens: Sobel normal-map → feDisplacementMap to refract backdrop pixels at glass edges.
 */
export function GlassFilters() {
  return (
    <svg
      aria-hidden
      style={{ position: 'fixed', width: 0, height: 0, top: 0, left: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      <defs>
        <filter
          id="lg-lens"
          x="-20%" y="-20%" width="140%" height="140%"
          colorInterpolationFilters="sRGB"
        >
          {/* Blur the alpha channel to create a smooth signed distance field */}
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="soft" />

          {/* Sobel X — encodes horizontal surface normal of the glass edge */}
          <feConvolveMatrix
            in="soft" order="3"
            kernelMatrix="-1 0 1  -2 0 2  -1 0 1"
            divisor="8" bias="0.5"
            result="sobelX"
          />
          {/*
            sobelX.A = horizontal gradient:
              left rim  → > 0.5 (normal points right)
              right rim → < 0.5 (normal points left)
              center    → = 0.5 (flat, no normal)
            Route A → R for xChannelSelector, freeze G=0.5 (neutral Y)
          */}
          <feColorMatrix in="sobelX" type="matrix"
            values="0 0 0 1 0
                    0 0 0 0 0.5
                    0 0 0 0 0
                    0 0 0 0 1"
            result="dispX"
          />

          {/* Sobel Y — encodes vertical surface normal */}
          <feConvolveMatrix
            in="soft" order="3"
            kernelMatrix="-1 -2 -1  0 0 0  1 2 1"
            divisor="8" bias="0.5"
            result="sobelY"
          />
          {/* Route A → G for yChannelSelector, freeze R=0.5 (neutral X) */}
          <feColorMatrix in="sobelY" type="matrix"
            values="0 0 0 0 0.5
                    0 0 0 1 0
                    0 0 0 0 0
                    0 0 0 0 1"
            result="dispY"
          />

          {/* Step 1: apply horizontal lens displacement */}
          <feDisplacementMap
            in="SourceGraphic" in2="dispX"
            scale="18" xChannelSelector="R" yChannelSelector="G"
            result="shiftedX"
          />
          {/* Step 2: apply vertical lens displacement on top */}
          <feDisplacementMap
            in="shiftedX" in2="dispY"
            scale="18" xChannelSelector="R" yChannelSelector="G"
            result="lensed"
          />

          {/* Clip back to original element bounds */}
          <feComposite in="lensed" in2="SourceAlpha" operator="in" />
        </filter>
      </defs>
    </svg>
  )
}

export default function LiquidGlass({
  children,
  as: Tag = 'div',
  radius = '999px',
  style,
  onClick,
  ...props
}) {
  const ref = useRef(null)
  const [mouse, setMouse] = useState({ x: 50, y: -40 })
  const [hovering, setHovering] = useState(false)
  const [pressing, setPressing] = useState(false)

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    setMouse({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHovering(false)
    setPressing(false)
    setMouse({ x: 50, y: -40 })
  }, [])

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => setPressing(false)}
      onClick={onClick}
      style={{
        position: 'relative',
        borderRadius: radius,
        border: '1px solid rgba(255,255,255,0.70)',
        boxShadow: [
          'inset 0 2px 2px rgba(255,255,255,0.90)',
          'inset 0 -1px 1px rgba(0,0,0,0.06)',
          'inset 1.5px 0 1px rgba(255,255,255,0.40)',
          'inset -1.5px 0 1px rgba(255,255,255,0.40)',
          '0 2px 6px rgba(0,0,0,0.05)',
          '0 8px 28px rgba(0,0,0,0.07)',
        ].join(', '),
        transform: pressing ? 'scale(0.96)' : hovering ? 'scale(1.02)' : 'scale(1)',
        transition: [
          'transform 0.18s cubic-bezier(0.34,1.56,0.64,1)',
          'box-shadow 0.2s ease',
        ].join(', '),
        overflow: 'hidden',
        cursor: 'pointer',
        userSelect: 'none',
        willChange: 'transform',
        isolation: 'isolate',
        ...style,
      }}
      {...props}
    >
      {/*
        Backdrop layer — the SVG lens filter runs on this element.
        backdrop-filter grabs content from behind the button,
        then filter:url(#lg-lens) displaces those blurred pixels
        at the edges to simulate looking through curved glass.
      */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          backdropFilter: 'blur(24px) saturate(1.9) brightness(1.05)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.9) brightness(1.05)',
          background: pressing
            ? 'rgba(195,210,240,0.40)'
            : hovering
            ? 'rgba(215,228,255,0.36)'
            : 'rgba(255,255,255,0.28)',
          filter: 'url(#lg-lens)',
          transition: 'background 0.2s ease',
        }}
      />

      {/* Dynamic specular highlight — tracks cursor like real glass catching light */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: `radial-gradient(
            ellipse 110px 60px at ${mouse.x}% ${mouse.y}%,
            rgba(255,255,255,${hovering ? 0.90 : 0.55}) 0%,
            rgba(255,255,255,0.16) 40%,
            transparent 65%
          )`,
          pointerEvents: 'none',
          zIndex: 1,
          transition: hovering ? 'none' : 'background 0.5s ease',
        }}
      />

      {/* Static rim lighting — top bright, bottom dark, like a lozenged glass puck */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: [
            'linear-gradient(180deg,',
            '  rgba(255,255,255,0.50) 0%,',
            '  rgba(255,255,255,0.06) 30%,',
            '  rgba(0,0,0,0.00) 60%,',
            '  rgba(0,0,0,0.06) 100%)',
          ].join(''),
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Content — sits above all filter layers, stays crisp */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center' }}>
        {children}
      </div>
    </Tag>
  )
}
