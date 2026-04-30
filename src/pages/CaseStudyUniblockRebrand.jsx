import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import UniblockSpinner from '../components/UniblockSpinner'
import WebsiteComparisonSlider from '../components/WebsiteComparisonSlider'
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

export default function CaseStudyUniblockRebrand() {
  const { isMobile, isTablet } = useBreakpoint()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Uniblock Redesign - Case Study'
    return () => { document.title = 'Robert Pham - Portfolio' }
  }, [])

  const cardRadius = isMobile ? '24px' : '48px'
  const sectionGap = isMobile ? '80px' : '160px'
  const cardPad = isMobile ? '16px' : '32px'

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
      <UniblockSpinner />

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
            Uniblock Design
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
            The goal was to position Uniblock as the infrastructure layer developers can build on.
          </p>
        </div>
      </div>

      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap }}>
        <div style={{
          backgroundColor: '#F9F9F9',
          border: '1px solid #EAEAE6',
          borderRadius: cardRadius,
          padding: cardPad,
        }}>
          <WebsiteComparisonSlider
            oldSrc="/old-site.mp4"
            newSrc="/new-site.mp4?v=2"
            oldLabel="2024"
            newLabel="2026"
          />
        </div>
      </Section>

      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '560px' }}>
          <p style={body}>
            The existing identity didn't reflect the caliber of the product. I was brought in to rebuild the company image from the ground up, starting with the visual identity.
          </p>
          <p style={body}>
            The design language was rooted in the blueprint. Precise, lightweight, and built to feel native to the developer and inspire confidence in the infrastructure beneath them.
          </p>
        </div>
      </Section>

      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap }}>
        <div style={{ display: 'flex', flexDirection: isTablet ? 'column' : 'row', gap: '16px' }}>
          <div style={{
            flex: 1,
            backgroundColor: '#fff',
            border: '1px solid #E9E9E9',
            borderRadius: cardRadius,
            overflow: 'hidden',
          }}>
            <FadeVideo src="/api-list.mp4" />
          </div>
          <div style={{
            flex: 1,
            backgroundColor: '#fff',
            border: '1px solid #E9E9E9',
            borderRadius: cardRadius,
            overflow: 'hidden',
          }}>
            <FadeVideo src="/pricing.mp4" />
          </div>
        </div>
      </Section>

      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap, display: 'flex', justifyContent: 'center' }}>
        <p style={{ ...body, maxWidth: '560px' }}>
          I updated every surface to reflect the new design language, from the API catalog to the pricing page.
        </p>
      </Section>

      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap }}>
        <div style={{
          width: '100%',
          backgroundColor: '#fff',
          border: '1px solid #E9E9E9',
          borderRadius: cardRadius,
          overflow: 'hidden',
        }}>
          <FadeVideo src="/component-library.mp4" />
        </div>
      </Section>

      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <p style={{ ...heading, maxWidth: '580px' }}>
          I built a shared component library using Claude Code, giving developers and product managers one source of truth to ship from.
        </p>
        <p style={{ ...body, maxWidth: '520px' }}>
          It includes agent context so AI tools can contribute to the codebase without breaking the design system.
        </p>
      </Section>

      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap }}>
        <div style={{
          width: '100%',
          backgroundColor: '#F9F9F9',
          border: '1px solid #EAEAE6',
          borderRadius: cardRadius,
          padding: cardPad,
          boxSizing: 'border-box',
        }}>
          <WebsiteComparisonSlider
            oldSrc="/beforedocsux.mp4"
            newSrc="/newdocsux.mp4"
            oldLabel="Before"
            newLabel="After"
          />
        </div>
      </Section>

      <Section isMobile={isMobile} isTablet={isTablet} style={{ paddingBottom: sectionGap, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <p style={{ ...heading, maxWidth: '580px' }}>
          The goal was to reduce the time a developer spends searching and get them back to building faster.
        </p>
        <p style={{ ...body, maxWidth: '520px' }}>
          I redesigned the navigation, information hierarchy, and overall structure of the docs experience.
        </p>
      </Section>

      <Footer />
    </div>
  )
}
