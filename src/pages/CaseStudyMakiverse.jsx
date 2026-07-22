import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MakiverseSpinner from '../components/MakiverseSpinner'
import FadeVideo from '../components/FadeVideo'
import { useBreakpoint } from '../hooks/useBreakpoint'

function Section({ children, style, isMobile, isTablet }) {
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

function VideoCard({ src, style }) {
  const busted = src
    ? `${src}${src.includes('?') ? '&' : '?'}v=5`
    : src

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#ECECEC',
      border: '1px solid #E9E9E9',
      overflow: 'hidden',
      ...style,
    }}>
      {busted
        ? <FadeVideo src={busted} />
        : <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#ECECEC' }} />
      }
    </div>
  )
}

export default function CaseStudyMakiverse() {
  const { isMobile, isTablet } = useBreakpoint()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Makiverse - Case Study'
    return () => { document.title = 'Robert Pham - Portfolio' }
  }, [])

  const cardRadius = isMobile ? '24px' : '48px'
  const sectionGap = isMobile ? '80px' : '160px'

  const heading = {
    margin: 0,
    fontSize: isMobile ? '17px' : '20px',
    fontWeight: '500',
    color: '#333333',
    letterSpacing: '-0.5px',
    lineHeight: 1.5,
    textAlign: 'center',
  }

  const body = {
    margin: 0,
    fontSize: isMobile ? '17px' : '20px',
    fontWeight: '500',
    color: '#333333',
    letterSpacing: '-0.5px',
    lineHeight: 1.6,
    textAlign: 'center',
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>

      <Navbar />
      <MakiverseSpinner />

      {/* Hero title */}
      <div style={{ paddingTop: '32px', paddingBottom: isMobile ? '64px' : '120px', paddingInline: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <h1 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '500',
            color: '#171717',
            letterSpacing: '-1px',
            lineHeight: 1.2,
            textAlign: 'center',
          }}>
            Makiverse Design
          </h1>
          <p style={{
            margin: 0,
            fontSize: isMobile ? '17px' : '20px',
            fontWeight: '500',
            color: 'rgba(0,0,0,0.40)',
            letterSpacing: '-1px',
            textAlign: 'center',
            maxWidth: '520px',
          }}>
            A full generative AI platform. Designed end to end.
          </p>
        </div>
      </div>

      {/* 0. Landing PoC — full-width video */}
      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap }}>
        <VideoCard src="/Maki%20Landing%20PoC.mp4" style={{ borderRadius: cardRadius }} />
      </Section>

      {/* 0. Landing PoC — copy */}
      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <p style={{ ...heading, maxWidth: '580px' }}>
          A landing page proof of concept, built to show every feature as simply as possible.
        </p>
        <p style={{ ...body, maxWidth: '520px' }}>
          The goal was to make every capability land before the user had to look for it.
        </p>
      </Section>

      {/* 1. Agent — full-width video */}
      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap }}>
        <VideoCard src="/maki-agent.mp4" style={{ borderRadius: cardRadius }} />
      </Section>

      {/* 1. Agent — copy */}
      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <p style={{ ...heading, maxWidth: '580px' }}>
          The agent navigates the full platform autonomously. One prompt generates the characters, panels, and the finished manga.
        </p>
        <p style={{ ...body, maxWidth: '520px' }}>
          Designing for an agent meant designing for both. The UI had to be legible to a human and navigable by a machine without intervention.
        </p>
      </Section>

      {/* 1b. Action bar — full-width video */}
      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap }}>
        <VideoCard src="/maki-action-bar.mp4" style={{ borderRadius: cardRadius }} />
      </Section>

      {/* 1b. Action bar — copy */}
      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <p style={{ ...heading, maxWidth: '580px' }}>
          One action bar holds the entire toolset. Simple on the surface, but loaded with everything the work demands.
        </p>
        <p style={{ ...body, maxWidth: '520px' }}>
          Polish turns a draft into a finished manga page, and image adjustment hands back precise cropping and resizing. Prototyped in Claude Code as a proof of concept.
        </p>
      </Section>

      {/* 2. Character gen — full-width video */}
      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap }}>
        <VideoCard src="/maki-character-generation.mp4" style={{ borderRadius: cardRadius }} />
      </Section>

      {/* 2. Character gen — copy */}
      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <p style={{ ...body, maxWidth: '560px' }}>
          Character consistency is the hardest problem in generative AI. My job was to make that complexity invisible.
        </p>
        <p style={{ ...body, maxWidth: '560px' }}>
          Working closely with the ML team, I designed an experience any user could pick up and run with.
        </p>
      </Section>

      {/* 3. Home page — full-width video */}
      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap }}>
        <VideoCard src="/maki-home.mp4" style={{ borderRadius: cardRadius }} />
      </Section>

      {/* 3. Home page — copy */}
      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap, display: 'flex', justifyContent: 'center' }}>
        <p style={{ ...body, maxWidth: '560px' }}>
          The home page sets the tone for the whole product. The goal was to make a complex platform feel immediately approachable.
        </p>
      </Section>

      {/* 3b. Anime Player — full-width video */}
      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap }}>
        <VideoCard src="/anime-player.mp4" style={{ borderRadius: cardRadius }} />
      </Section>

      {/* 3b. Anime Player — copy */}
      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <p style={{ ...heading, maxWidth: '580px' }}>
          An anime feed built for episode browsing and playback, with simple players that auto-scroll as you watch.
        </p>
        <p style={{ ...body, maxWidth: '520px' }}>
          Built for ease of use. Episode handling stays simple, and the player keeps you moving through the series.
        </p>
      </Section>

      {/* 3c. Anime Editor — full-width video */}
      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap }}>
        <VideoCard src="/anime-editor.mp4" style={{ borderRadius: cardRadius }} />
      </Section>

      {/* 3c. Anime Editor — copy */}
      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <p style={{ ...heading, maxWidth: '580px' }}>
          The editor brings the AI Assistant, timeline, and file handling into one surface.
        </p>
        <p style={{ ...body, maxWidth: '520px' }}>
          Designed so complex production tools feel approachable.
        </p>
      </Section>

      {/* 3d. AI Assistant — full-width video */}
      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap }}>
        <VideoCard src="/ai-assistant.mp4" style={{ borderRadius: cardRadius }} />
      </Section>

      {/* 3d. AI Assistant — copy */}
      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <p style={{ ...heading, maxWidth: '580px' }}>
          Mentions let you rename characters, set up scenes, and steer the assistant without leaving the flow.
        </p>
        <p style={{ ...body, maxWidth: '520px' }}>
          One interaction pattern that covers the moves you make most, kept light enough to feel native to the canvas.
        </p>
      </Section>

      {/* 4. Store variants — two-up */}
      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap }}>
        <div style={{ display: 'flex', flexDirection: isTablet ? 'column' : 'row', gap: '16px' }}>
          <VideoCard src="/maki-store1.mp4" style={{ flex: 1, borderRadius: cardRadius }} />
          <VideoCard src="/maki-store2.mp4" style={{ flex: 1, borderRadius: cardRadius }} />
        </div>
      </Section>

      {/* 5. Design language — copy */}
      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <p style={{ ...heading, maxWidth: '580px' }}>
          One design language across the full platform, built from scratch as the sole designer.
        </p>
        <p style={{ ...body, maxWidth: '520px' }}>
          From the generation tools to the editor to the storefront, every surface shares the same system. Built with enough structure to scale.
        </p>
        <p style={{ ...body, maxWidth: '520px' }}>
          The platform is still growing. More features are in the works.
        </p>
      </Section>

      <Footer />
    </div>
  )
}
