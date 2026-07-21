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

const previousWork = [
  { project: 'Anime Player',     company: 'Makiverse',       date: 'July 2026'    },
  { project: 'AI Assistant V2',  company: 'Makiverse',       date: 'July 2026'    },
  { project: 'Generation Animation', company: 'Makiverse',   date: 'July 2026'    },
  { project: 'Anime Editor',     company: 'Makiverse',       date: 'June 2026'    },
  { project: 'Content Search',   company: 'Makiverse',       date: 'June 2026'    },
  { project: 'Manga Reader V2', company: 'Makiverse',       date: 'June 2026'    },
  { project: '2 Enterprise Prototypes (NDA)', company: 'Uniblock', date: 'May 2026' },
  { project: 'Toolbar',          company: 'Makiverse',       date: 'May 2026'     },
  { project: 'UI Update',        company: 'Uniblock',        date: 'April 2026'    },
  { project: 'Agentic Manga',    company: 'Makiverse',       date: 'April 2026'    },
  { project: 'Raise Announcement', company: 'Uniblock',      date: 'March 2026'    },
  { project: 'Component Library', company: 'Uniblock',       date: 'March 2026'    },
  { project: 'New Website',      company: 'Uniblock',        date: 'March 2026'    },
  { project: 'Rebrand',          company: 'Uniblock',        date: 'February 2026' },
  { project: 'Onboarding Redesign', company: 'Uniblock',     date: 'January 2026'  },
  { project: 'Manga Editor',     company: 'Makiverse',       date: 'September 2025'},
  { project: 'Content Feed',     company: 'Makiverse',       date: 'September 2025'},
  { project: 'Generation Userflows', company: 'Makiverse',   date: 'July 2025'     },
  { project: 'Manga Reader',     company: 'Makiverse',       date: 'May 2025'      },
  { project: 'Branding',         company: 'Pump Pals',       date: 'April 2025'    },
  { project: 'Mobile Game',      company: 'NestEgg',         date: 'May 2024'      },
  { project: 'Web Design',       company: 'Personal Client', date: 'January 2024'  },
  { project: 'Agency Work',      company: 'dApp Technology', date: '2023 – 2025'   },
]

export default function About() {
  const { isMobile, isTablet } = useBreakpoint()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'About - Robert Pham'
    return () => { document.title = 'Robert Pham - Portfolio' }
  }, [])

  const gap = isTablet ? '16px' : '48px'
  const [me1Loaded, setMe1Loaded] = useState(false)
  const [me2Loaded, setMe2Loaded] = useState(false)
  const [hoveredRow, setHoveredRow] = useState(null)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Navbar />

      <div style={{ maxWidth: '1554px', marginInline: 'auto', marginTop: '-8px', paddingInline: isMobile ? '16px' : '48px', paddingBottom: '120px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap, maxWidth: '1496px', marginInline: 'auto' }}>

          {/* Row 1 — double */}
          <div style={{ display: 'flex', flexDirection: isTablet ? 'column' : 'row', gap }}>
            <div style={{ ...cardBase, flex: isTablet ? 'none' : 1, width: isTablet ? '100%' : undefined, height: isTablet ? '480px' : '640px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: isMobile ? '32px' : '64px', boxSizing: 'border-box', width: '100%' }}>
                <p style={{ margin: 0, fontSize: isMobile ? '15px' : '17px', fontWeight: '500', color: '#171717', letterSpacing: '-0.5px', lineHeight: 1.6 }}>
                  Currently I work at Uniblock & Makiverse. Previously, I worked with a design agency and had a professional esports career in VALORANT with Immortals, Complexity, and FaZe Clan.
                </p>
                <p style={{ margin: 0, fontSize: isMobile ? '15px' : '17px', fontWeight: '500', color: '#171717', letterSpacing: '-0.5px', lineHeight: 1.6 }}>
                  Design has always been how I think. I care about craft and getting something right visually, functionally, and in every detail in between.
                </p>
                <p style={{ margin: 0, fontSize: isMobile ? '15px' : '17px', fontWeight: '500', color: '#171717', letterSpacing: '-0.5px', lineHeight: 1.6 }}>
                  Lately I've been using Claude Code to build my own projects end to end, letting AI write the code for the first time and shipping things exactly as I imagined them.
                </p>
              </div>
            </div>
            <div style={{ ...cardBase, flex: isTablet ? 'none' : 1, width: isTablet ? '100%' : undefined, height: isTablet ? '480px' : '640px' }}>
              <img src="/me.jpg" alt="" onLoad={() => setMe1Loaded(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: me1Loaded ? 1 : 0, transition: 'opacity 0.4s ease' }} />
            </div>
          </div>

          {/* Row 3 — double */}
          <div style={{ display: 'flex', flexDirection: isTablet ? 'column-reverse' : 'row', gap }}>
            <div style={{ ...cardBase, flex: isTablet ? 'none' : 1, width: isTablet ? '100%' : undefined, height: isTablet ? '480px' : '640px' }}>
              <img src="/me2.jpg" alt="" onLoad={() => setMe2Loaded(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: me2Loaded ? 1 : 0, transition: 'opacity 0.4s ease' }} />
            </div>
            <div style={{ ...cardBase, flex: isTablet ? 'none' : 1, width: isTablet ? '100%' : undefined, height: isTablet ? '480px' : '640px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: isMobile ? '32px' : '64px', boxSizing: 'border-box', width: '100%' }}>
                <p style={{ margin: 0, fontSize: isMobile ? '15px' : '17px', fontWeight: '500', color: '#171717', letterSpacing: '-0.5px', lineHeight: 1.6 }}>
                  Design exists long before screens. It's in food, in competitive gaming, in art, in how anything is made or experienced.
                </p>
                <p style={{ margin: 0, fontSize: isMobile ? '15px' : '17px', fontWeight: '500', color: '#171717', letterSpacing: '-0.5px', lineHeight: 1.6 }}>
                  That breadth is what keeps me curious. There's always another domain to pull from and always more room to grow.
                </p>
              </div>
            </div>
          </div>

          {/* Row 4 — previous work */}
          <div style={{ ...cardBase, padding: isMobile ? '32px 24px' : '52px 64px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 40px' }}>
              <p style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '500',
                color: '#171717',
                letterSpacing: '-1px',
              }}>
                Previous Work
              </p>
              <a
                href="/Robert Pham - Product Design Resume.pdf"
                download="Robert Pham - Product Design Resume"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: 'rgba(0,0,0,0.4)',
                  letterSpacing: '-0.5px',
                  textDecoration: 'none',
                }}
              >
                Resume
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {previousWork.map((row, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr',
                    alignItems: 'center',
                    paddingBlock: '16px',
                    borderTop: '1px solid #F0F0F0',
                  }}
                >
                  <span style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '500', color: hoveredRow === i ? 'rgba(0,0,0,0.4)' : '#171717', letterSpacing: '-0.5px', transition: 'color 0.05s ease' }}>
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
