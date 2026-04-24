import LiquidGlass from './LiquidGlass'

function ChevronDown() {
  return (
    <svg width="8" height="5" viewBox="0 0 10 6" fill="none" style={{ flexShrink: 0 }}>
      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const labelStyle = {
  fontSize: '16px',
  lineHeight: '20px',
  color: '#171717',
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
}

export default function Navbar() {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      paddingBlock: '20px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1554px',
        marginInline: 'auto',
        paddingInline: '96px',
      }}>

        {/* Brand */}
        <LiquidGlass>
          <div style={{ paddingInline: '20px', paddingBlock: '10px', paddingBottom: '12px', ...labelStyle }}>
            Robert P
          </div>
        </LiquidGlass>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <LiquidGlass>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingInline: '20px', paddingBlock: '10px', paddingBottom: '12px' }}>
              <span style={labelStyle}>Work</span>
              <span style={{ ...labelStyle, fontSize: '12px' }}><ChevronDown /></span>
            </div>
          </LiquidGlass>

          <LiquidGlass>
            <div style={{ paddingInline: '20px', paddingBlock: '10px', paddingBottom: '12px', ...labelStyle }}>
              About
            </div>
          </LiquidGlass>

          <LiquidGlass>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingInline: '20px', paddingBlock: '10px', paddingBottom: '12px' }}>
              <span style={labelStyle}>Contact</span>
              <span style={{ ...labelStyle, fontSize: '12px' }}><ChevronDown /></span>
            </div>
          </LiquidGlass>
        </div>

      </div>
    </nav>
  )
}
