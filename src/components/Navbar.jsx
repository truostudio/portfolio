function ChevronDown() {
  return (
    <svg width="8" height="5" viewBox="0 0 10 6" fill="none" style={{ flexShrink: 0 }}>
      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const pill = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 20px',
  borderRadius: '999px',
  background: '#ffffff',
  border: '1px solid #ECECEC',
  cursor: 'pointer',
  fontSize: '16px',
  lineHeight: '20px',
  color: '#171717',
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
}

export default function Navbar() {
  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, paddingBlock: '20px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1554px',
        marginInline: 'auto',
        paddingInline: '96px',
      }}>

        <div style={pill}>Robert P</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={pill}>Work <ChevronDown /></div>
          <div style={pill}>About</div>
          <div style={pill}>Contact <ChevronDown /></div>
        </div>

      </div>
    </nav>
  )
}
