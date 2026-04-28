import { useBreakpoint } from '../hooks/useBreakpoint'

export default function Footer() {
  const { isTablet } = useBreakpoint()
  const rows = [
    { label: 'Made in', value: 'Toronto, Canada' },
    {
      label: 'Get in touch', value: (
        <span>
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
          position: relative;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 1px;
          background: #171717;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .footer-link:hover::after {
          transform: scaleX(1);
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
            backgroundColor: '#F9F9F9',
            border: '1px solid #EAEAE6',
            borderRadius: '24px',
            height: isTablet ? '180px' : '320px',
            overflow: 'clip',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              fontSize: 'clamp(48px, 8vw, 120px)',
              fontWeight: '500',
              color: '#171717',
              letterSpacing: '-1px',
              lineHeight: 1,
              textAlign: 'center',
              padding: '48px',
            }}>
              Robert P
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
