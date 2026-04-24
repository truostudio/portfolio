import LiquidGlass from './LiquidGlass'

export default function Hero() {
  return (
    <section style={{ paddingBottom: '24px', marginTop: '-8px' }}>
      <div style={{ maxWidth: '1554px', marginInline: 'auto', paddingInline: '48px' }}>
        <div style={{ display: 'flex', gap: '48px', maxWidth: '1496px', marginInline: 'auto' }}>

          {/* Left — teal bio card */}
          <div style={{
            flex: 1, height: '640px', borderRadius: '48px',
            backgroundColor: '#004C63', overflow: 'clip', position: 'relative',
          }}>
            {/* Decorative star icon pill */}
            <div style={{ position: 'absolute', top: '36px', right: '36px' }}>
              <LiquidGlass>
                <div style={{
                  width: '48px', height: '48px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', color: 'rgba(255,255,255,0.8)',
                }}>
                  ✦
                </div>
              </LiquidGlass>
            </div>

            {/* Bio card at bottom */}
            <div style={{ position: 'absolute', bottom: '36px', left: '36px', right: '36px' }}>
              <div style={{
                borderRadius: '24px',
                backdropFilter: 'blur(20px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.22)',
                boxShadow: 'rgba(255,255,255,0.18) 0px 1px 0px inset, rgba(255,255,255,0.05) 0px 0px 16px inset, rgba(0,0,0,0.14) 0px 8px 32px',
                padding: '28px',
                display: 'flex', flexDirection: 'column', gap: '48px',
              }}>
                <p style={{
                  color: '#FFABDC', fontSize: '24px', lineHeight: '1.4',
                  margin: 0, paddingRight: '80px',
                  fontWeight: '300',
                }}>
                  Robert is a product designer and developer based in Toronto, Canada.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#FFABDC', fontSize: '16px', letterSpacing: '0.16px' }}>Open to work</span>
                  <span style={{ color: '#FFABDC', fontSize: '16px', letterSpacing: '0.16px' }}>Toronto, CA</span>
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
              padding: '36px',
              gap: '12px',
            }}>
              <LiquidGlass>
                <div style={{
                  paddingBlock: '14px', paddingInline: '28px',
                  color: 'rgba(255,255,255,0.88)', fontSize: '16px',
                  letterSpacing: '0.16px', whiteSpace: 'nowrap',
                }}>
                  Learn about me
                </div>
              </LiquidGlass>
              <LiquidGlass>
                <div style={{
                  width: '48px', height: '48px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.88)', fontSize: '20px',
                }}>
                  →
                </div>
              </LiquidGlass>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
