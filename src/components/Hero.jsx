import { useState, useEffect, useRef } from 'react'
import WaterShader from './WaterShader'
import FilmGrain from './FilmGrain'
import PhotoDither from './PhotoDither'
import { useBreakpoint } from '../hooks/useBreakpoint'

function LocalClock() {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span style={{ color: '#FFABDC', fontSize: '16px', letterSpacing: '-1px', fontWeight: '500' }}>
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} Local
    </span>
  )
}

const RIGHT_ANGLES = [-65, -35, -12, 10, 32, 58, 80]
const LEFT_ANGLES  = [115, 148, 168, 188, 210, 238, 260]

function ParticlesBurst({ side }) {
  if (!side) return null
  const angles    = side === 'right' ? RIGHT_ANGLES : LEFT_ANGLES
  const sizes     = [3, 4, 3, 5, 3, 4, 3]
  const delays    = [0, 25, 10, 40, 15, 30, 5]
  const distances = [18, 24, 16, 26, 20, 18, 14]
  return (
    <>
      {angles.map((angle, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: sizes[i], height: sizes[i],
          borderRadius: '50%',
          background: i % 2 === 0 ? '#FFABDC' : '#FFD0EE',
          boxShadow: '0 0 5px #FFABDC',
          top: '50%',
          marginTop: -(sizes[i] / 2),
          [side === 'right' ? 'right' : 'left']: sizes[i] / 2,
          '--angle': `${angle}deg`,
          '--dist': `${distances[i]}px`,
          animation: `particleFly 0.52s ease-out ${delays[i]}ms both`,
          pointerEvents: 'none',
        }} />
      ))}
    </>
  )
}

const glassPill = {
  borderRadius: '999px',
  backdropFilter: 'blur(6px) saturate(1.0)',
  WebkitBackdropFilter: 'blur(6px) saturate(1.0)',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: 'rgba(255,255,255,0.12) 0px 1px 0px inset, rgba(0,0,0,0.10) 0px 4px 16px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export default function Hero() {
  const { isMobile, isTablet } = useBreakpoint()
  const [sparkle, setSparkle]       = useState(0.5)
  const [choppy,  setChoppy]        = useState(0.5)
  const [sliderOpen, setSliderOpen] = useState(false)
  const [slamDirs, setSlamDirs]     = useState({ Sparkle: null, Choppy: null })
  const [slamKeys, setSlamKeys]     = useState({ Sparkle: 0, Choppy: 0 })
  const [pillAnim, setPillAnim]     = useState('none')
  const [photoHovered, setPhotoHovered] = useState(false)
  const [photoLocked,  setPhotoLocked]  = useState(true)
  const pillRef                     = useRef(null)

  useEffect(() => {
    if (!sliderOpen) return
    const handler = (e) => {
      if (pillRef.current && !pillRef.current.contains(e.target)) {
        setSliderOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [sliderOpen])

  return (
    <section style={{ paddingBottom: '24px', marginTop: '-8px' }}>
      <style>{`
        @keyframes gelHover {
          0%   { transform: scale(1); }
          10%  { transform: scale(1.20, 0.85); }
          22%  { transform: scale(0.92, 1.17); }
          35%  { transform: scale(1.14, 0.94); }
          48%  { transform: scale(1.01, 1.13); }
          60%  { transform: scale(1.12, 1.03); }
          71%  { transform: scale(1.05, 1.11); }
          81%  { transform: scale(1.10, 1.06); }
          90%  { transform: scale(1.07, 1.09); }
          100% { transform: scale(1.08); }
        }
        @keyframes gelOut {
          0%   { transform: scale(1.08); }
          40%  { transform: scale(0.95); }
          70%  { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
        @keyframes contentSlideIn {
          from { opacity: 0; transform: translate(14px, -10px); filter: blur(8px); }
          to   { opacity: 1; transform: translate(0,    0);     filter: blur(0);   }
        }
        @keyframes slamRight {
          0%   { transform: translateX(0);   }
          22%  { transform: translateX(2px); }
          58%  { transform: translateX(-1px);}
          100% { transform: translateX(0);   }
        }
        @keyframes slamLeft {
          0%   { transform: translateX(0);    }
          22%  { transform: translateX(-2px); }
          58%  { transform: translateX(1px);  }
          100% { transform: translateX(0);    }
        }
        @keyframes particleFly {
          0%   { opacity: 1;   transform: rotate(var(--angle)) translateX(0px)         scale(1);   }
          65%  { opacity: 0.7; }
          100% { opacity: 0;   transform: rotate(var(--angle)) translateX(var(--dist)) scale(0.3); }
        }
        input[type=range] {
          -webkit-appearance: none;
          appearance: none;
          height: 24px;
          border-radius: 999px;
          background: transparent;
          outline: none;
          border: none;
        }
        input[type=range]::-webkit-slider-runnable-track {
          height: 3px;
          border-radius: 999px;
          background: rgba(255,255,255,0.22);
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          margin-top: -5.5px;
        }
        input[type=range]::-moz-range-track {
          height: 3px;
          border-radius: 999px;
          background: rgba(255,255,255,0.22);
          border: none;
        }
        input[type=range]::-moz-range-thumb {
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
        }
      `}</style>
      <div style={{ maxWidth: '1554px', marginInline: 'auto', paddingInline: isTablet ? '16px' : '48px' }}>
        <div style={{ display: 'flex', flexDirection: isTablet ? 'column' : 'row', gap: isTablet ? '16px' : '48px', maxWidth: '1496px', marginInline: 'auto' }}>

          {/* Left — water shader card */}
          <div style={{
            flex: isTablet ? 'none' : 1, width: isTablet ? '100%' : undefined,
            height: isTablet ? '480px' : '640px', borderRadius: isTablet ? '32px' : '48px',
            backgroundColor: '#004C63', overflow: 'clip', position: 'relative',
          }}>
            <WaterShader sparkle={sparkle} choppy={choppy} />
            <FilmGrain />

            {/* Sparkle button — morphs into slider pill on click */}
            <div
              ref={pillRef}
              onClick={() => { setSliderOpen(o => !o); setPillAnim('none') }}
              onMouseEnter={() => { if (!sliderOpen) setPillAnim('in') }}
              onMouseLeave={() => { if (!sliderOpen) setPillAnim('out') }}
              style={{
                ...glassPill,
                position: 'absolute', top: isTablet ? '20px' : '36px', right: isTablet ? '20px' : '36px',
                zIndex: 1,
                height: 48,
                width: sliderOpen ? 240 : 48,
                height: sliderOpen ? 84 : 48,
                padding: sliderOpen ? '13px 24px' : '0',
                flexDirection: sliderOpen ? 'column' : 'row',
                alignItems: sliderOpen ? 'stretch' : 'center',
                justifyContent: 'center',
                gap: sliderOpen ? '10px' : '0',
                overflow: sliderOpen ? 'visible' : 'hidden',
                transition: 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1), height 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                animation: !sliderOpen
                  ? (pillAnim === 'in'  ? 'gelHover 0.55s ease forwards'
                  :  pillAnim === 'out' ? 'gelOut 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                  :  'none')
                  : 'none',
                flexShrink: 0,
                cursor: sliderOpen ? 'default' : 'pointer',
              }}
            >
              {sliderOpen ? (
                <>
                  {[
                    { label: 'Sparkle', value: sparkle, onChange: setSparkle },
                    { label: 'Choppy',  value: choppy,  onChange: setChoppy  },
                  ].map(({ label, value, onChange }) => (
                    <div key={label} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      animation: 'contentSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0s both',
                    }}>
                      <span style={{
                        fontSize: '14px', color: '#FFABDC', letterSpacing: '-1px', fontWeight: '500',
                        userSelect: 'none', whiteSpace: 'nowrap', width: '48px', flexShrink: 0,
                      }}>{label}</span>
                      <div
                        style={{
                          flex: 1, position: 'relative',
                          animation: slamDirs[label]
                            ? `slam${slamDirs[label] === 'right' ? 'Right' : 'Left'} 0.28s linear both`
                            : 'none',
                        }}
                        onAnimationEnd={() => setSlamDirs(d => ({ ...d, [label]: null }))}
                      >
                        <input
                          type="range" min="0" max="1" step="0.01" value={value}
                          onChange={e => {
                            const v = parseFloat(e.target.value)
                            onChange(v)
                            if (v <= 0) {
                              setSlamDirs(d => ({ ...d, [label]: 'left' }))
                              setSlamKeys(k => ({ ...k, [label]: k[label] + 1 }))
                            }
                            if (v >= 1) {
                              setSlamDirs(d => ({ ...d, [label]: 'right' }))
                              setSlamKeys(k => ({ ...k, [label]: k[label] + 1 }))
                            }
                          }}
                          onClick={e => e.stopPropagation()}
                          style={{ width: '100%', display: 'block', cursor: 'pointer' }}
                        />
                        <ParticlesBurst key={slamKeys[label]} side={slamDirs[label]} />
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <span style={{ fontSize: '22px', color: '#ffffff', userSelect: 'none' }}>✦</span>
              )}
            </div>

            {/* Bio overlay */}
            <div style={{ position: 'absolute', bottom: isTablet ? '20px' : '36px', left: isTablet ? '20px' : '36px', right: isTablet ? '20px' : '36px', zIndex: 1 }}>
              <div style={{
                borderRadius: '20px',
                backdropFilter: 'blur(6px) saturate(1.0)',
                WebkitBackdropFilter: 'blur(6px) saturate(1.0)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.18)',
                boxShadow: 'rgba(255,255,255,0.12) 0px 1px 0px inset, rgba(0,0,0,0.10) 0px 8px 32px',
                padding: isTablet ? '20px' : '28px',
                display: 'flex', flexDirection: 'column', gap: isTablet ? '36px' : '48px',
              }}>
                <p style={{ color: '#FFABDC', fontSize: isTablet ? '22px' : '24px', lineHeight: '1.4', margin: 0, paddingRight: isTablet ? '0' : '80px', fontWeight: '500', letterSpacing: '-1px' }}>
                  Robert is a product designer <span style={{ whiteSpace: 'nowrap' }}>based in Toronto, Canada.</span>
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#FFABDC', fontSize: '16px', letterSpacing: '-1px', fontWeight: '500' }}>Currently at Uniblock</span>
                  <LocalClock />
                </div>
              </div>
            </div>
          </div>

          {/* Right — photo card with Bayer dither on hover */}
          {!isTablet && (
            <div
              style={{
                flex: 1,
                height: '640px', borderRadius: '48px',
                backgroundColor: '#0a1628',
                overflow: 'clip', position: 'relative',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setPhotoHovered(true)}
              onMouseLeave={() => setPhotoHovered(false)}
              onClick={() => setPhotoLocked(l => !l)}
            >
              <PhotoDither hovered={photoHovered} locked={photoLocked} src="/photo.jpg" />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
                padding: '36px', gap: '12px',
                zIndex: 1,
              }}>
                <div style={{ ...glassPill, padding: '14px 28px' }}>
                  <span style={{ color: '#ffffff', fontSize: '16px', letterSpacing: '0.16px', whiteSpace: 'nowrap' }}>
                    Learn about me
                  </span>
                </div>
                <div style={{ ...glassPill, width: 48, height: 48 }}>
                  <span style={{ color: '#ffffff', fontSize: '20px' }}>→</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
