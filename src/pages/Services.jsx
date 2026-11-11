import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useBreakpoint } from '../hooks/useBreakpoint'

const cardBase = {
  backgroundColor: '#fff',
  border: '1px solid #E9E9E9',
  borderRadius: '48px',
  overflow: 'hidden',
  position: 'relative',
}

// Most agents start here; surfaced as the recommended bundle.
const bundle = [
  { service: 'One-time brand setup', price: '$300', note: 'We start with a consultation to align on your brand, then I establish the foundations on my end so every piece I produce stays true to your identity and visuals. Done once.' },
  { service: 'Monthly newsletter', price: '$300 / mo', note: 'Design and layout, with distribution handled through your preferred email platform, such as Mailchimp.' },
]

const addOns = [
  { service: 'Postcard campaign', price: '$300', note: 'Print-ready design, delivered as final files ready to print.' },
  { service: 'Website draft or template', price: 'Scoped', note: 'Depends on complexity. Full builds range from $3.5k to $20k.' },
  { service: 'Listing launch kit', price: '$500–$600', note: 'A coordinated “Just Listed” set for one property: feature sheet, social graphics, postcard, and email announcement.' },
]

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: '4px' }}>
      <path d="M3 8L6 11L12 4" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CTAButton({ label, onClick, full }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: full ? '100%' : 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px 24px',
        borderRadius: '999px',
        fontSize: '16px',
        fontWeight: '500',
        letterSpacing: '-1px',
        color: '#171717',
        background: hovered ? '#F9F9F9' : '#ffffff',
        border: '1px solid #ECECEC',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'background 0.15s ease',
        boxSizing: 'border-box',
      }}
    >
      {label}
    </button>
  )
}

const ink = '#171717'
const mute = 'rgba(0,0,0,0.44)'
const type = (size, color = ink) => ({ margin: 0, fontSize: size, fontWeight: '500', color, letterSpacing: size >= 20 ? '-1px' : '-0.5px', lineHeight: size >= 24 ? 1.15 : 1.5 })

function Eyebrow({ children }) {
  return <span style={{ ...type('14px', mute) }}>{children}</span>
}

function AddOnCard({ service, price, note, isMobile }) {
  return (
    <div style={{
      background: '#F7F7F7',
      borderRadius: '32px',
      padding: isMobile ? '24px' : '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      flex: 1,
      minWidth: 0,
    }}>
      <p style={type(isMobile ? '24px' : '28px')}>{price}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <p style={type('16px')}>{service}</p>
        <p style={type('15px', mute)}>{note}</p>
      </div>
    </div>
  )
}

export default function Services() {
  const { isMobile, isTablet } = useBreakpoint()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Services - Robert Pham'
    return () => { document.title = 'Robert Pham - Portfolio' }
  }, [])

  const mailto = (subject) => () => { window.location.href = `mailto:robert@truo.studio?subject=${encodeURIComponent(subject)}` }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Navbar />

      <div style={{ maxWidth: '1554px', marginInline: 'auto', marginTop: '-8px', paddingInline: isMobile ? '16px' : '48px', paddingBottom: '120px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '24px' : '48px', maxWidth: '1496px', marginInline: 'auto' }}>

          {/* Intro */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '780px' }}>
            <h1 style={{
              margin: 0,
              fontSize: isMobile ? '34px' : 'clamp(40px, 5vw, 60px)',
              fontWeight: '500',
              color: '#171717',
              letterSpacing: '-1px',
              lineHeight: 1.05,
            }}>
              Design that works while you close.
            </h1>
            <p style={{
              margin: 0,
              fontSize: isMobile ? '17px' : '20px',
              fontWeight: '500',
              color: 'rgba(0,0,0,0.44)',
              letterSpacing: '-0.5px',
              lineHeight: 1.5,
              maxWidth: '640px',
            }}>
              No big contract. It's modular, so you pick the pieces you need and add or pause anytime as listings come up.
            </p>
          </div>

          {/* Starter bundle: the recommended starting point */}
          <div style={{
            ...cardBase,
            boxShadow: '0 12px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
            padding: isMobile ? '32px 24px' : '56px',
            display: 'flex',
            flexDirection: isTablet ? 'column' : 'row',
            gap: isTablet ? '32px' : '64px',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: isTablet ? 'none' : '0 0 38%' }}>
              <span style={{
                ...type('14px'),
                background: '#ffffff',
                border: '1px solid #ECECEC',
                borderRadius: '999px',
                padding: '6px 14px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                alignSelf: 'flex-start',
              }}>
                Most agents start here
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={type(isMobile ? '28px' : '36px')}>Starter</p>
                <p style={type(isMobile ? '17px' : '20px')}>$300 to set up, then $300 / mo</p>
              </div>
              <p style={type(isMobile ? '15px' : '16px', mute)}>
                Look sharp from day one and stay consistent every month. Layer on postcards and campaigns whenever a listing needs a push.
              </p>
              {!isTablet && <div style={{ marginTop: 'auto' }}><CTAButton label="Get started" full onClick={mailto('Starter bundle inquiry')} /></div>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, minWidth: 0 }}>
              <Eyebrow>What's included</Eyebrow>
              {bundle.map((row) => (
                <div key={row.service} style={{ background: '#F7F7F7', borderRadius: '32px', padding: isMobile ? '20px 24px' : '28px 32px', display: 'flex', gap: '12px' }}>
                  <Check />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px' }}>
                      <span style={type('16px')}>{row.service}</span>
                      <span style={{ ...type('16px'), whiteSpace: 'nowrap' }}>{row.price}</span>
                    </div>
                    <span style={type('15px', mute)}>{row.note}</span>
                  </div>
                </div>
              ))}
            </div>

            {isTablet && <CTAButton label="Get started" full onClick={mailto('Starter bundle inquiry')} />}
          </div>

          {/* Add-ons */}
          <div style={{ ...cardBase, padding: isMobile ? '32px 24px' : '56px', display: 'flex', flexDirection: 'column', gap: isMobile ? '24px' : '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '560px' }}>
              <p style={type(isMobile ? '28px' : '36px')}>Add-ons</p>
              <p style={type(isMobile ? '15px' : '16px', mute)}>À la carte, no lock-in. Add or pause pieces as you go.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: isTablet ? 'column' : 'row', gap: isMobile ? '12px' : '16px' }}>
              {addOns.map((row) => <AddOnCard key={row.service} {...row} isMobile={isMobile} />)}
            </div>

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '4px' : '24px', alignItems: 'baseline' }}>
              <span style={{ ...type('15px'), flex: 'none' }}>Revisions</span>
              <span style={type('15px', mute)}>Every deliverable includes 2 minor revisions and 1 major revision. Anything beyond that is $40 an hour.</span>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
