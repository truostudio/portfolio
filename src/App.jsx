import { GlassFilters } from './components/LiquidGlass'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Work from './components/Work'
import Footer from './components/Footer'
import './index.css'

export default function App() {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <GlassFilters />
      <Navbar />
      <Hero />
      <Work />
      <Footer />
    </div>
  )
}
