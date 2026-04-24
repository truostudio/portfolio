import { useState, useEffect } from 'react'
import WaterShader from './WaterShader'

function LocalClock() {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span style={{ color: '#FFABDC', fontSize: '16px', letterSpacing: '0.16px' }}>
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} Local
    </span>
  )
}

const glassPill = {
  borderRadius: '999px',
  backdropFilter: 'blur(20px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
  background: 'rgba(255,255,255,0.18)',
  border: '1px solid rgba(255,255,255,0.28)',
  boxShadow: 'rgba(255,255,255,0.22) 0px 1px 0px inset, rgba(0,0,0,0.12) 0px 4px 16px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export default function Hero() {
  const [sparkle, setSparkle]         = useState(0)
  const [sliderOpen, setSliderOpen]   = useState(false)

  return (
    <section style={{ paddingBottom: '24px', marginTop: '-8px' }}>
      <div style={{ maxWidth: '1554px', marginInline: 'auto', paddingInline: '48px' }}>
        <div style={{ display: 'flex', gap: '48px', maxWidth: '1496px', marginInline: 'auto' }}>

          {/* Left — water shader card */}
          <div style={{
            flex: 1, height: '640px', borderRadius: '48px',
            backgroundColor: '#004C63', overflow: 'clip', position: 'relative',
          }}>
            <WaterShader sparkle={sparkle} />

            {/* Top-right controls */}
            <div style={{
              position: 'absolute', top: '36px', right: '36px',
              display: 'flex', alignItems: 'center', gap: '10px',
              zIndex: 1,
            }}>
              {/* Slider panel */}
              {sliderOpen && (
                <div style={{
                  ...glassPill,
                  borderRadius: '999px',
                  padding: '10px 18px',
                  gap: '10px',
                  cursor: 'default',
                }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', userSelect: 'none' }}>
                    SPARKLE
                  </span>
                  <input
                    type="range"
                    min="0" max="1" step="0.01"
                    value={sparkle}
                    onChange={e => setSparkle(parseFloat(e.target.value))}
                    style={{
                      width: '100px',
                      accentColor: '#ffffff',
                      cursor: 'pointer',
                    }}
                  />
                </div>
              )}

              {/* Star button */}
              <div
                onClick={() => setSliderOpen(o => !o)}
                style={{ ...glassPill, width: 48, height: 48 }}
              >
                <span style={{ fontSize: '16px', color: '#171717', userSelect: 'none' }}>✦</span>
              </div>
            </div>

            {/* Bio overlay */}
            <div style={{ position: 'absolute', bottom: '36px', left: '36px', right: '36px', zIndex: 1 }}>
              <div style={{
                borderRadius: '24px',
                backdropFilter: 'blur(20px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.22)',
                boxShadow: 'rgba(255,255,255,0.18) 0px 1px 0px inset, rgba(0,0,0,0.14) 0px 8px 32px',
                padding: '28px',
                display: 'flex', flexDirection: 'column', gap: '48px',
              }}>
                <p style={{ color: '#FFABDC', fontSize: '24px', lineHeight: '1.4', margin: 0, paddingRight: '80px', fontWeight: '300' }}>
                  Robert is a product designer and developer based in Toronto, Canada.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#FFABDC', fontSize: '16px', letterSpacing: '0.16px' }}>Currently at Uniblock</span>
                  <LocalClock />
                </div>
              </div>
            </div>
          </div>

          {/* Right — gradient photo card */}
          <div style={{
            flex: 1, height: '640px', borderRadius: '48px',
            background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 45%, #0f3460 100%)',
            overflow: 'clip', position: 'relative',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
              padding: '36px', gap: '12px',
            }}>
              <div style={{ ...glassPill, padding: '14px 28px' }}>
                <span style={{ color: '#171717', fontSize: '16px', letterSpacing: '0.16px', whiteSpace: 'nowrap' }}>
                  Learn about me
                </span>
              </div>
              <div style={{ ...glassPill, width: 48, height: 48 }}>
                <span style={{ color: '#171717', fontSize: '20px' }}>→</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
