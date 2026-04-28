import { useBreakpoint } from '../hooks/useBreakpoint'

export default function Footer() {
  const { isMobile } = useBreakpoint()
  const rows = [
    { label: 'Copyright', value: '© 2026' },
    { label: 'Made in', value: 'Toronto, Canada' },
    { label: 'Get in touch', value: 'Twitter · GitHub · LinkedIn' },
    { label: 'Typeface', value: 'Geist by Vercel' },
  ]

  return (
    <div style={{ paddingBottom: '8px', paddingTop: '24px' }}>
      <div style={{
        maxWidth: '1554px',
        marginInline: 'auto',
        paddingInline: isMobile ? '16px' : '48px',
        marginBottom: isMobile ? '24px' : '48px',
      }}>
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #EAEAE6',
          borderRadius: isMobile ? '32px' : '48px',
          padding: isMobile ? '24px' : '48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '48px',
        }}>
          {/* Big name / headline area */}
          <div style={{
            backgroundColor: '#F9F9F9',
            border: '1px solid #EAEAE6',
            borderRadius: '24px',
            height: isMobile ? '180px' : '320px',
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
