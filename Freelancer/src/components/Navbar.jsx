import { useState, useEffect } from 'react'

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6c63ff] to-[#a855f7] flex items-center justify-center font-bold text-sm shadow-lg shadow-purple-500/30">
            FH
          </div>
          <span className="font-bold text-xl tracking-tight">
            Freelance<span className="text-[#6c63ff]">Hub</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden md:flex">
          {navLinks.map((link) => (
            <a key={link} href="#" className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-medium">
              {link}
            </a>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }} className="hidden md:flex">
          <button className="btn-outline text-sm px-5 py-2.5">Log In</button>
          <button className="btn-glow text-sm px-5 py-2.5">Get Started</button>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-0.5 bg-white mb-1" />
          <div className="w-5 h-0.5 bg-white mb-1" />
          <div className="w-5 h-0.5 bg-white" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0f0f23]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4">
          {navLinks.map((link) => (
            <a key={link} href="#" className="block py-3 text-white/70 hover:text-white border-b border-white/5 text-sm font-medium transition-colors">
              {link}
            </a>
          ))}
          <div className="flex gap-3 mt-4">
            <button className="btn-outline text-sm flex-1 justify-center py-2.5">Log In</button>
            <button className="btn-glow text-sm flex-1 justify-center py-2.5">Get Started</button>
          </div>
        </div>
      )}
    </header>
  )
}
