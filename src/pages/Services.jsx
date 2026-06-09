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
  { service: 'One-time brand setup', price: '$400', note: 'We start with a consultation to align on your brand, then I establish the foundations on my end so every piece I produce stays true to your identity and visuals. Done once.' },
  { service: 'Monthly newsletter', price: '$300 / mo', note: 'Design and layout, with distribution handled through your preferred email platform, such as Mailchimp.' },
]

const addOns = [
  { service: 'Postcard campaign', price: '$300', note: 'Print-ready design only. You handle the mail house separately.' },
  { service: 'Website draft / template', price: 'Scope-based', note: 'Depends on complexity. Full builds range from $3.5k to $20k.' },
  { service: 'Listing launch kit', price: '$500 to $600', note: 'A coordinated “Just Listed” set for one property: feature sheet, social graphics, postcard, and email announcement.' },
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

function MenuRow({ service, price, note, isMobile, first }) {
  if (isMobile) {
    return (
      <div style={{ paddingBlock: '16px', borderTop: first ? 'none' : '1px solid #F0F0F0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
          <span style={{ fontSize: '15px', fontWeight: '500', color: '#171717', letterSpacing: '-0.5px' }}>{service}</span>
          <span style={{ fontSize: '15px', fontWeight: '500', color: '#171717', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>{price}</span>
        </div>
        {note && <span style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(0,0,0,0.44)', letterSpacing: '-0.5px', lineHeight: 1.5 }}>{note}</span>}
      </div>
    )
  }
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1.3fr 0.8fr 2fr',
      alignItems: 'baseline',
      gap: '24px',
      paddingBlock: '20px',
      borderTop: first ? 'none' : '1px solid #F0F0F0',
    }}>
      <span style={{ fontSize: '16px', fontWeight: '500', color: '#171717', letterSpacing: '-0.5px' }}>{service}</span>
      <span style={{ fontSize: '16px', fontWeight: '500', color: '#171717', letterSpacing: '-0.5px' }}>{price}</span>
      <span style={{ fontSize: '16px', fontWeight: '500', color: 'rgba(0,0,0,0.44)', letterSpacing: '-0.5px', lineHeight: 1.5 }}>{note}</span>
    </div>
  )
}

export default function Services() {
  const { isMobile } = useBreakpoint()

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

          {/* Starter bundle: recommended starting point */}
          <div style={{
            ...cardBase,
            boxShadow: '0 12px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
            padding: isMobile ? '32px 24px' : '48px',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '560px' }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '500',
                letterSpacing: '-0.5px',
                color: '#171717',
                background: '#ffffff',
                border: '1px solid #ECECEC',
                borderRadius: '999px',
                padding: '6px 14px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                alignSelf: 'flex-start',
              }}>
                Most agents start here
              </span>
              <p style={{ margin: 0, fontSize: isMobile ? '16px' : '18px', fontWeight: '500', color: '#171717', letterSpacing: '-0.5px', lineHeight: 1.5 }}>
                Brand setup to get you looking sharp, plus a monthly newsletter to stay consistent. Layer on postcards and campaigns whenever a listing needs a push.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {bundle.map((row, i) => (
                <div key={row.service} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '16px',
                  paddingBlock: '16px',
                  borderTop: i === 0 ? 'none' : '1px solid #F0F0F0',
                }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <Check />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: isMobile ? '15px' : '16px', fontWeight: '500', color: '#171717', letterSpacing: '-0.5px' }}>{row.service}</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(0,0,0,0.44)', letterSpacing: '-0.5px', lineHeight: 1.5 }}>{row.note}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: isMobile ? '15px' : '16px', fontWeight: '500', color: '#171717', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>{row.price}</span>
                </div>
              ))}
            </div>

            <CTAButton label="Get Started" full={isMobile} onClick={mailto('Starter bundle inquiry')} />
          </div>

          {/* Full add-on menu */}
          <div style={{ ...cardBase, padding: isMobile ? '32px 24px' : '52px 64px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: isMobile ? '24px' : '32px', maxWidth: '560px' }}>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: '500', color: '#171717', letterSpacing: '-1px' }}>
                Add anything, anytime
              </p>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: '500', color: 'rgba(0,0,0,0.44)', letterSpacing: '-0.5px', lineHeight: 1.5 }}>
                Everything's à la carte, no lock-in. Add or pause pieces as you go.
              </p>
            </div>

            {!isMobile && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.3fr 0.8fr 2fr',
                gap: '24px',
                paddingBottom: '12px',
              }}>
                {['Service', 'Price', 'Note'].map((h) => (
                  <span key={h} style={{ fontSize: '13px', fontWeight: '500', color: 'rgba(0,0,0,0.4)', letterSpacing: '-0.5px' }}>{h}</span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {addOns.map((row, i) => (
                <MenuRow key={row.service} {...row} isMobile={isMobile} first={!isMobile && i === 0} />
              ))}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
