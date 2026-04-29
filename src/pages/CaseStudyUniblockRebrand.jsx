import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import UniblockSpinner from '../components/UniblockSpinner'
import WebsiteComparisonSlider from '../components/WebsiteComparisonSlider'

function Section({ children, style }) {
  return (
    <div style={{ maxWidth: '1554px', marginInline: 'auto', paddingInline: '48px', boxSizing: 'border-box', ...style }}>
      {children}
    </div>
  )
}

export default function CaseStudyUniblockRebrand() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>

      <Navbar />
      <UniblockSpinner />

      <div style={{ paddingTop: '32px', paddingBottom: '96px' }}>
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
            fontSize: '20px',
            fontWeight: '500',
            color: 'rgba(0,0,0,0.40)',
            letterSpacing: '-1px',
            textAlign: 'center',
            maxWidth: '480px',
          }}>
            Shifting the visual identity from royal blue to sky blue.
          </p>
        </div>
      </div>

      <Section style={{ paddingBottom: '160px' }}>
        <div style={{
          backgroundColor: '#F9F9F9',
          border: '1px solid #EAEAE6',
          borderRadius: '48px',
          padding: '32px',
        }}>
          <WebsiteComparisonSlider
            oldSrc="/old-site.png"
            newSrc="/new-site.png"
            oldLabel="2023"
            newLabel="2024"
          />
        </div>
      </Section>

      <Footer />
    </div>
  )
}
