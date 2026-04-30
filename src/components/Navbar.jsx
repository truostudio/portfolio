import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { GithubLogo, LinkedinLogo, EnvelopeSimple, FileArrowDown } from '@phosphor-icons/react'

function ChevronDown() {
  return (
    <svg width="8" height="5" viewBox="0 0 10 6" fill="none" style={{ flexShrink: 0 }}>
      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Popover({ items, visible }) {
  return (
    <div style={{
      position: 'absolute',
      top: 'calc(100% + 8px)',
      right: 0,
      background: '#ffffff',
      border: '1px solid #ECECEC',
      borderRadius: '16px',
      padding: '6px',
      minWidth: '180px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'auto' : 'none',
      transform: visible ? 'translateY(0)' : 'translateY(-4px)',
      transition: 'opacity 0.15s ease, transform 0.15s ease',
      zIndex: 100,
    }}>
      {items.map(({ label, onClick, thumbnail, icon }) => (
        <div
          key={label}
          onClick={onClick}
          onMouseEnter={e => e.currentTarget.style.background = '#F9F9F9'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 10px',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '500',
            letterSpacing: '-0.5px',
            color: '#171717',
            cursor: 'pointer',
            background: 'transparent',
            transition: 'background 0.1s ease',
          }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            flexShrink: 0,
            background: '#ffffff',
            border: '1px solid #ECECEC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: thumbnail ? '5px' : '0',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}>
            {thumbnail && <img src={thumbnail} alt={label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
            {icon && icon}
          </div>
          {label}
        </div>
      ))}
    </div>
  )
}

function NavPill({ children, onClick, popover, style }) {
  const [hovered, setHovered] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    if (!popover) return
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [popover])

  return (
    <div
      ref={ref}
      style={{ position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); if (!open) {} }}
    >
      <div
        onClick={popover ? () => setOpen(o => !o) : onClick}
        style={{
          ...style,
          background: hovered || open ? '#F9F9F9' : '#ffffff',
          transition: 'background 0.15s ease',
          cursor: 'pointer',
        }}
      >
        {children}
      </div>
      {popover && <Popover items={popover} visible={open} />}
    </div>
  )
}

export default function Navbar() {
  const navigate = useNavigate()
  const { isTablet } = useBreakpoint()

  const pill = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: isTablet ? '10px 14px' : '10px 20px',
    borderRadius: '999px',
    background: '#ffffff',
    border: '1px solid #ECECEC',
    fontSize: isTablet ? '14px' : '16px',
    lineHeight: '20px',
    color: '#171717',
    fontFamily: 'inherit',
    fontWeight: isTablet ? '700' : '500',
    letterSpacing: '-1px',
    whiteSpace: 'nowrap',
  }

  const workItems = [
    { label: 'Uniblock', onClick: () => navigate('/case-study/uniblock'), thumbnail: '/uniblock-logo.svg' },
    { label: 'Makiverse', onClick: () => navigate('/case-study/makiverse'), thumbnail: '/makiverse-logo.svg' },
  ]

  const contactItems = [
    { label: 'Email', onClick: () => window.location.href = 'mailto:robert@truo.studio', icon: <EnvelopeSimple size={16} weight="fill" /> },
    { label: 'GitHub', onClick: () => window.open('https://github.com/truostudio', '_blank'), icon: <GithubLogo size={16} weight="fill" /> },
    { label: 'LinkedIn', onClick: () => window.open('https://www.linkedin.com/in/robertpham-/', '_blank'), icon: <LinkedinLogo size={16} weight="fill" /> },
    { label: 'Resume', onClick: () => { const a = document.createElement('a'); a.href = '/Robert Pham - Product Design Resume.pdf'; a.download = 'Robert Pham - Product Design Resume.pdf'; a.click() }, icon: <FileArrowDown size={16} weight="fill" /> },
  ]

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

        <NavPill style={pill} onClick={() => navigate('/')}>Robert P</NavPill>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end' }}>
          <NavPill style={pill} popover={workItems}>Work <ChevronDown /></NavPill>
          <NavPill style={pill} onClick={() => navigate('/about')}>About</NavPill>
          <NavPill style={pill} popover={contactItems}>Contact <ChevronDown /></NavPill>
        </div>

      </div>
    </nav>
  )
}
