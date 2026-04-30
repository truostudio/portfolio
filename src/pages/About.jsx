import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

const previousWork = [
  { project: 'UI Update',        company: 'Uniblock',        date: 'April 2026'    },
  { project: 'Agentic Manga',    company: 'Makiverse',       date: 'April 2026'    },
  { project: 'Raise Announcement', company: 'Uniblock',      date: 'March 2026'    },
  { project: 'Component Library', company: 'Uniblock',       date: 'March 2026'    },
  { project: 'New Website',      company: 'Uniblock',        date: 'March 2026'    },
  { project: 'Rebrand',          company: 'Uniblock',        date: 'February 2026' },
  { project: 'Onboarding Redesign', company: 'Uniblock',     date: 'January 2026'  },
  { project: 'Branding',         company: 'Pump Pals',       date: 'October 2025'  },
  { project: 'Mobile Game',      company: 'NestEgg',         date: 'January 2025'  },
  { project: 'Agency Work',      company: 'dApp Technology', date: '2023 – 2025'   },
]

export default function About() {
  const { isMobile, isTablet, width } = useBreakpoint()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'About - Robert Pham'
    return () => { document.title = 'Robert Pham - Portfolio' }
  }, [])

  const gap = isTablet ? '16px' : '48px'
  const cardHeight = isTablet ? '300px' : '454px'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Navbar />

      <div style={{ maxWidth: '1554px', marginInline: 'auto', paddingInline: isMobile ? '16px' : '48px', paddingBottom: '120px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap, maxWidth: '1496px', marginInline: 'auto' }}>

          {/* Row 1 — wide single */}
          <div style={{ ...cardBase, height: cardHeight }} />

          {/* Row 2 — double */}
          <div style={{ display: 'flex', flexDirection: isTablet ? 'column' : 'row', gap }}>
            <div style={{ ...cardBase, flex: 1, height: cardHeight }} />
            <div style={{ ...cardBase, flex: 1, height: cardHeight }} />
          </div>

          {/* Row 3 — double */}
          <div style={{ display: 'flex', flexDirection: isTablet ? 'column' : 'row', gap }}>
            <div style={{ ...cardBase, flex: 1, height: cardHeight }} />
            <div style={{ ...cardBase, flex: 1, height: cardHeight }} />
          </div>

          {/* Row 4 — previous work */}
          <div style={{ ...cardBase, padding: isMobile ? '32px 24px' : '52px 64px', boxSizing: 'border-box' }}>
            <p style={{
              margin: '0 0 40px',
              fontSize: '20px',
              fontWeight: '500',
              color: '#171717',
              letterSpacing: '-1px',
            }}>
              Previous Work
            </p>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {previousWork.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr',
                    alignItems: 'center',
                    paddingBlock: '16px',
                    borderTop: '1px solid #F0F0F0',
                  }}
                >
                  <span style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '500', color: '#171717', letterSpacing: '-0.5px' }}>
                    {row.project}
                  </span>
                  {!isMobile && (
                    <span style={{ fontSize: '16px', fontWeight: '500', color: 'rgba(0,0,0,0.4)', letterSpacing: '-0.5px' }}>
                      {row.company}
                    </span>
                  )}
                  <span style={{ fontSize: isMobile ? '13px' : '16px', fontWeight: '500', color: 'rgba(0,0,0,0.4)', letterSpacing: '-0.5px', textAlign: 'right' }}>
                    {row.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
