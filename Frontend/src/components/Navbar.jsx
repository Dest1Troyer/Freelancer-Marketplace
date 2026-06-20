import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const navLinks = ['Find Talent', 'Find Work', 'Why FreelanceHub', 'Enterprise']

const cx = {
  maxWidth: '1280px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 'clamp(1rem, 4vw, 1.5rem)',
  paddingRight: 'clamp(1rem, 4vw, 1.5rem)',
  width: '100%',
}

export default function Navbar() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}
      className={`transition-all duration-300 ${
        scrolled
          ? 'bg-[#07070f]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl'
          : 'bg-transparent'
      }`}
    >
      <div style={{ ...cx, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', paddingBottom: '1rem' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '14px',
            flexShrink: 0,
            boxShadow: '0 8px 20px rgba(108, 99, 255, 0.3)',
            color: '#fff'
          }}>
            FH
          </div>
          <span className="logo-text font-bold text-xl tracking-tight">
            Freelance<span style={{ color: '#6c63ff' }}>Hub</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ alignItems: 'center', gap: '2rem' }} className="hidden-mobile">
          {navLinks.map((link) => (
            <a key={link} href="#" className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-medium">
              {link}
            </a>
          ))}
        </nav>
 
        {/* Auth Buttons */}
        <div style={{ alignItems: 'center', gap: '0.75rem', flexShrink: 0 }} className="hidden-mobile">
          <button className="btn-outline text-sm px-5 py-2.5" onClick={() => navigate('/login')}>Log In</button>
          <button className="btn-glow text-sm px-5 py-2.5" onClick={() => navigate('/register')}>Get Started</button>
        </div>
 
        {/* Hamburger */}
        <button
          className="visible-mobile p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          style={{ flexDirection: 'column', gap: '4px', background: 'none' }}
        >
          <div style={{ width: '20px', height: '2px', background: '#fff' }} />
          <div style={{ width: '20px', height: '2px', background: '#fff' }} />
          <div style={{ width: '20px', height: '2px', background: '#fff' }} />
        </button>
      </div>
 
      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="visible-mobile-block mobile-menu-drawer">
          {navLinks.map((link) => (
            <a key={link} href="#" className="mobile-menu-link">
              {link}
            </a>
          ))}
          <div className="mobile-menu-btn-container">
            <button className="btn-outline text-sm py-3 justify-center" style={{ width: '100%' }} onClick={() => { navigate('/login'); setMobileOpen(false) }}>Log In</button>
            <button className="btn-glow text-sm py-3 justify-center" style={{ width: '100%' }} onClick={() => { navigate('/register'); setMobileOpen(false) }}>Get Started</button>
          </div>
        </div>
      )}
    </header>
  )
}
