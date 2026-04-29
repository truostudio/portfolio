import { MeshGradient } from '@paper-design/shaders-react'
import { useBreakpoint } from '../hooks/useBreakpoint'

export default function Footer() {
  const { isTablet } = useBreakpoint()
  const rows = [
    { label: 'Made in', value: 'Toronto, Canada' },
    {
      label: 'Get in touch', value: (
        <span>
          <a href="mailto:robert@truo.studio" className="footer-link">robert@truo.studio</a>
          {' · '}
          <a href="https://github.com/truostudio" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
          {' · '}
          <a href="https://www.linkedin.com/in/robertpham-/" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
        </span>
      )
    },
    { label: 'Typeface', value: 'Geist by Vercel' },
  ]

  return (
    <div style={{ paddingBottom: '8px', paddingTop: '24px' }}>
      <style>{`
        .footer-link {
          color: #171717;
          text-decoration: none;
        }
      `}</style>
      <div style={{
        maxWidth: '1554px',
        marginInline: 'auto',
        paddingInline: isTablet ? '16px' : '48px',
        marginBottom: isTablet ? '24px' : '48px',
      }}>
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #EAEAE6',
          borderRadius: isTablet ? '32px' : '48px',
          padding: isTablet ? '24px' : '48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '48px',
        }}>
          {/* Big name / headline area */}
          <div style={{
            borderRadius: '24px',
            height: isTablet ? '180px' : '320px',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <MeshGradient
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              colors={['#e0eaff', '#241d9a', '#f75092', '#9f50d3']}
              distortion={0}
              swirl={0.06}
              grainMixer={0.1}
              grainOverlay={0.27}
              speed={1.72}
              scale={1.12}
              offsetX={-0.24}
            />
            <div style={{
              position: 'relative',
              fontSize: 'clamp(28px, 4vw, 56px)',
              fontWeight: '500',
              color: '#ffffff',
              letterSpacing: '-1px',
              lineHeight: 1,
              textAlign: 'center',
              padding: '48px',
              mixBlendMode: 'overlay',
            }}>
              Get in touch
            </div>
          </div>

          {/* Meta rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {rows.map(({ label, value }) => (
              <div key={label} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #F0F0F0',
                paddingBlock: '8px',
              }}>
                <span style={{ color: 'rgba(0,0,0,0.44)', fontSize: '16px', lineHeight: '1.6', fontWeight: '500', letterSpacing: '-1px' }}>{label}</span>
                <span style={{ color: '#171717', fontSize: '16px', lineHeight: '1.6', fontWeight: '500', letterSpacing: '-1px', textAlign: 'right' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
