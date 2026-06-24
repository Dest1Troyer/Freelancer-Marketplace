import './index.css'
import { Routes, Route } from 'react-router-dom'

// Home page sections
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import TrustBannerSection from './components/TrustBannerSection'
import CategoriesSection from './components/CategoriesSection'
import FreelancersSection from './components/FreelancersSection'
import HowItWorksSection from './components/HowItWorksSection'
import TestimonialsSection from './components/TestimonialsSection'
import CTASection from './components/CTASection'
import Footer from './components/Footer'

// Auth pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import PostProjectPage from './pages/PostProjectPage'
import FindWorkPage from './pages/FindWorkPage'

function HomePage() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#07070f', color: '#fff' }}>
      <Navbar />
      <main style={{ width: '100%' }}>
        <HeroSection />
        <TrustBannerSection />
        <CategoriesSection />
        <FreelancersSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/"          element={<HomePage />} />
      <Route path="/login"     element={<LoginPage />} />
      <Route path="/register"  element={<RegisterPage />} />
      <Route path="/profile"   element={<ProfilePage />} />
      <Route path="/post-project" element={<PostProjectPage />} />
      <Route path="/find-work"  element={<FindWorkPage />} />
    </Routes>
  )
}

export default App