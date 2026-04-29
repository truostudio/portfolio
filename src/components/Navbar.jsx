import { useNavigate } from 'react-router-dom'
import { useBreakpoint } from '../hooks/useBreakpoint'

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
  fontWeight: '500',
  letterSpacing: '-1px',
  whiteSpace: 'nowrap',
}

export default function Navbar() {
  const navigate = useNavigate()
  const { isTablet } = useBreakpoint()
  const pillStyle = { ...pill, fontWeight: isTablet ? '700' : '500', padding: isTablet ? '10px 14px' : '10px 20px', fontSize: isTablet ? '14px' : '16px' }
  return (
    <nav style={{ paddingBlock: isTablet ? '24px' : '48px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1554px',
        marginInline: 'auto',
        paddingInline: isTablet ? '20px' : '96px',
      }}>

        <div style={pillStyle} onClick={() => navigate('/')}>Robert P</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end' }}>
          <div style={pillStyle}>Work <ChevronDown /></div>
          <div style={pillStyle}>About</div>
          <div style={pillStyle}>Contact <ChevronDown /></div>
        </div>

      </div>
    </nav>
  )
}
