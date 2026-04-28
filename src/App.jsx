import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Work from './components/Work'
import Footer from './components/Footer'
import './index.css'

const NEEDLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" role="img" aria-label="Needle"><title>Needle</title><desc>A 3-cell needle pivots around the center through eight directions.</desc><defs><circle id="b" r="2.4" fill="#ffffff" opacity="0.07"/><circle id="l" r="3.1"/></defs><style>.l{fill:#ffffff;opacity:0;animation:icon-41-k 2400ms linear infinite both;}@keyframes icon-41-k{0%{opacity:0;}8%{opacity:1;}36%{opacity:0.05;}100%{opacity:0;}}@media (prefers-reduced-motion:reduce){.l{animation:none;opacity:0.45;}}.d00,.d11{animation-delay:2100ms;}.d02,.d12,.d22{animation-delay:0ms;}.d04,.d13{animation-delay:300ms;}.d20,.d21{animation-delay:1800ms;}.d23,.d24{animation-delay:600ms;}.d31,.d40{animation-delay:1500ms;}.d32,.d42{animation-delay:1200ms;}.d33,.d44{animation-delay:900ms;}</style><use href="#b" x="6" y="6"/><use href="#b" x="17" y="6"/><use href="#b" x="28" y="6"/><use href="#b" x="39" y="6"/><use href="#b" x="50" y="6"/><use href="#b" x="6" y="17"/><use href="#b" x="17" y="17"/><use href="#b" x="28" y="17"/><use href="#b" x="39" y="17"/><use href="#b" x="50" y="17"/><use href="#b" x="6" y="28"/><use href="#b" x="17" y="28"/><use href="#b" x="28" y="28"/><use href="#b" x="39" y="28"/><use href="#b" x="50" y="28"/><use href="#b" x="6" y="39"/><use href="#b" x="17" y="39"/><use href="#b" x="28" y="39"/><use href="#b" x="39" y="39"/><use href="#b" x="50" y="39"/><use href="#b" x="6" y="50"/><use href="#b" x="17" y="50"/><use href="#b" x="28" y="50"/><use href="#b" x="39" y="50"/><use href="#b" x="50" y="50"/><use class="l d00" href="#l" x="6" y="6"/><use class="l d02" href="#l" x="28" y="6"/><use class="l d04" href="#l" x="50" y="6"/><use class="l d11" href="#l" x="17" y="17"/><use class="l d12" href="#l" x="28" y="17"/><use class="l d13" href="#l" x="39" y="17"/><use class="l d20" href="#l" x="6" y="28"/><use class="l d21" href="#l" x="17" y="28"/><use class="l d22" href="#l" x="28" y="28"/><use class="l d23" href="#l" x="39" y="28"/><use class="l d24" href="#l" x="50" y="28"/><use class="l d31" href="#l" x="17" y="39"/><use class="l d32" href="#l" x="28" y="39"/><use class="l d33" href="#l" x="39" y="39"/><use class="l d40" href="#l" x="6" y="50"/><use class="l d42" href="#l" x="28" y="50"/><use class="l d44" href="#l" x="50" y="50"/></svg>`

function LoadingScreen({ visible }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0a0f1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
      pointerEvents: visible ? 'all' : 'none',
    }}>
      <div
        style={{ width: 56, height: 56 }}
        dangerouslySetInnerHTML={{ __html: NEEDLE_SVG }}
      />
    </div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const done = () => setLoaded(true)
    if (document.readyState === 'complete') {
      setTimeout(done, 600)
    } else {
      window.addEventListener('load', () => setTimeout(done, 600), { once: true })
    }
  }, [])

  return (
    <div style={{ minHeight: '100vh' }}>
      <LoadingScreen visible={!loaded} />
      <Navbar />
      <Hero />
      <Work />
      <Footer />
    </div>
  )
}
