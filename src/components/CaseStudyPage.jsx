import { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import FadeVideo from './FadeVideo'
import { useBreakpoint } from '../hooks/useBreakpoint'

// A case study laid out like the Makiverse one: the spinning tile and the
// title, then each section's clip at full width with its copy centred under it.
//
// A section is { src, lead, body } (a pair of clips is { pair: [a, b] }, and a
// section of words alone has no src). `ready: false` keeps a section off the
// page until its clip is rendered, so the page can ship before every clip has.

function Wrap({ children, style, isMobile, isTablet }) {
  return (
    <div style={{
      maxWidth: '1200px',
      marginInline: 'auto',
      paddingInline: isMobile ? '16px' : isTablet ? '80px' : '48px',
      boxSizing: 'border-box',
      ...style,
    }}>
      {children}
    </div>
  )
}

function Clip({ src, rev, style }) {
  return (
    <div style={{
      width: '100%',
      backgroundColor: '#ECECEC',
      border: '1px solid #E9E9E9',
      overflow: 'hidden',
      ...style,
    }}>
      <FadeVideo src={`${src}?v=${rev}`} />
    </div>
  )
}

export default function CaseStudyPage({ title, subtitle, Spinner, sections, rev = 1 }) {
  const { isMobile, isTablet } = useBreakpoint()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = `${title.replace(/ Design$/, '')} - Case Study`
    return () => { document.title = 'Robert Pham - Portfolio' }
  }, [title])

  const radius = isMobile ? '24px' : '48px'
  const gap = isMobile ? '80px' : '160px'
  const copy = (color, lineHeight) => ({
    margin: 0,
    fontSize: isMobile ? '17px' : '20px',
    fontWeight: '500',
    color,
    letterSpacing: '-0.5px',
    lineHeight,
    textAlign: 'center',
  })
  const wrap = { isMobile, isTablet }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Navbar />
      <Spinner />

      <div style={{ paddingTop: '32px', paddingBottom: isMobile ? '64px' : '120px', paddingInline: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '500', color: '#171717', letterSpacing: '-1px', lineHeight: 1.2, textAlign: 'center' }}>
            {title}
          </h1>
          <p style={{ ...copy('rgba(0,0,0,0.40)', 1.4), letterSpacing: '-1px', maxWidth: '520px' }}>
            {subtitle}
          </p>
        </div>
      </div>

      {sections.filter((s) => s.ready !== false).map((s, i) => (
        <div key={s.src || s.pair?.[0] || i}>
          {s.src && (
            <Wrap {...wrap} style={{ paddingBottom: gap }}>
              <Clip src={s.src} rev={rev} style={{ borderRadius: radius }} />
            </Wrap>
          )}
          {s.pair && (
            <Wrap {...wrap} style={{ paddingBottom: gap }}>
              <div style={{ display: 'flex', flexDirection: isTablet ? 'column' : 'row', gap: '16px' }}>
                {s.pair.map((src) => <Clip key={src} src={src} rev={rev} style={{ flex: 1, borderRadius: radius }} />)}
              </div>
            </Wrap>
          )}
          {(s.lead || s.body) && (
            <Wrap {...wrap} style={{ paddingBottom: gap, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              {s.lead && <p style={{ ...copy('#333333', 1.5), maxWidth: '580px' }}>{s.lead}</p>}
              {[].concat(s.body || []).map((b) => (
                <p key={b} style={{ ...copy('#333333', 1.6), maxWidth: '520px' }}>{b}</p>
              ))}
            </Wrap>
          )}
        </div>
      ))}

      <Footer />
    </div>
  )
}
