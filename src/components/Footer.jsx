export default function Footer() {
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
        paddingInline: '48px',
        marginBottom: '48px',
      }}>
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #EAEAE6',
          borderRadius: '48px',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '48px',
        }}>
          {/* Big name / headline area */}
          <div style={{
            backgroundColor: '#F9F9F9',
            border: '1px solid #EAEAE6',
            borderRadius: '24px',
            height: '320px',
            overflow: 'clip',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              fontSize: 'clamp(48px, 8vw, 120px)',
              fontWeight: '300',
              color: '#171717',
              letterSpacing: '-0.04em',
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
                <span style={{ color: 'rgba(0,0,0,0.44)', fontSize: '16px', lineHeight: '1.6' }}>{label}</span>
                <span style={{ color: '#171717', fontSize: '16px', lineHeight: '1.6', textAlign: 'right' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
