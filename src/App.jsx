import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Work from './components/Work'
import Footer from './components/Footer'
import CaseStudyUniblockRebrand from './pages/CaseStudyUniblockRebrand'
import CaseStudyMakiverse from './pages/CaseStudyMakiverse'
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/case-study/uniblock" element={<CaseStudyUniblockRebrand />} />
        <Route path="/case-study/makiverse" element={<CaseStudyMakiverse />} />
      </Routes>
    </BrowserRouter>
  )
}
