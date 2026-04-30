import { BrowserRouter, Routes, Route, useLocation, ScrollRestoration } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Work from './components/Work'
import Footer from './components/Footer'
import CaseStudyUniblockRebrand from './pages/CaseStudyUniblockRebrand'
import CaseStudyMakiverse from './pages/CaseStudyMakiverse'
import About from './pages/About'
import './index.css'

function Home() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <Work />
      <Footer />
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <div key={location.pathname} style={{ animation: 'pageFadeIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/case-study/uniblock" element={<CaseStudyUniblockRebrand />} />
        <Route path="/case-study/makiverse" element={<CaseStudyMakiverse />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollRestoration />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
