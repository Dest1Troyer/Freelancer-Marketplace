import { useState, useEffect, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const allLinks = [
  { label: 'Find Talent', to: '/find-talent', isHash: false, hideForRole: 'freelancer' },
  { label: 'Find Work', to: '/find-work', isHash: false, hideForRole: 'client' },
  { label: 'Why FreelanceHub', to: '/why-freelancehub', isHash: false },
  { label: 'Enterprise', to: '/enterprise', isHash: false },
]

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
  const { user, logoutUser } = useContext(AuthContext)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Filter links based on user role
  const links = allLinks.filter(link => {
    if (!link.hideForRole) return true
    if (!user) return true // Show all links when not logged in
    return user.role !== link.hideForRole
  })

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
          <div className='flex' style={{
            gap:'2rem',
            transform:!user?'translateX(4rem)':""
          }} >
        {/* Desktop Nav */}
        <nav style={{ alignItems: 'center', gap: '2rem' }} className="hidden-mobile">
          {links.map((link) => (
            link.isHash ? (
              <a key={link.label} href={link.to} className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-medium">
                {link.label}
              </a>
            ) : (
              <Link key={link.label} to={link.to} className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-medium" style={{ textDecoration: 'none' }}>
                {link.label}
              </Link>
            )
          ))}
        </nav>
 
        {/* Auth Buttons */}
        {!user ? (
          <div></div>
        ) : (
          <div style={{ alignItems: 'center', gap: '2rem', flexShrink: 0 }} className="hidden-mobile">
            <button className=" text-sm text-white/60 hover:text-white transition-colors duration-200 font-medium" onClick={() => navigate('/chat')}>
              Messages
            </button>
            {user.role === 'client' && (
              <button className=" text-sm text-white/60 hover:text-white transition-colors duration-200 font-medium" onClick={() => navigate('/post-project')}>Post Project</button>
            )}
            <button 
              className=" text-sm text-white/60 hover:text-white transition-colors duration-200 font-medium" 
              onClick={() => navigate('/profile')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              
              <span>My Profile</span>
            </button>
          </div>
        )}

        </div>
        {!user?(
          <div style={{ alignItems: 'center', gap: '0.75rem', flexShrink: 0 }} className="hidden-mobile">
          <button className="btn-outline text-sm px-5 py-2.5" onClick={() => navigate('/register')}>Get Started</button>
          <button className="btn-glow text-sm px-5 py-2.5" onClick={() => navigate('/login')}>Log In</button>
          </div>

        ):(
          
          <button className="hidden-mobile btn-glow text-sm px-5 py-2.5" style={{ borderColor: 'rgba(255,68,68,0.25)' }} onClick={() => { logoutUser(); navigate('/') }}>Log Out</button>
            
        )}
        
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
          {links.map((link) => (
            link.isHash ? (
              <a key={link.label} href={link.to} className="mobile-menu-link" onClick={() => setMobileOpen(false)}>
                {link.label}
              </a>
            ) : (
              <Link key={link.label} to={link.to} className="mobile-menu-link" style={{ textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            )
          ))}
          {!user ? (
            <div className="mobile-menu-btn-container">
              <button className="btn-outline text-sm py-3 justify-center" style={{ width: '100%' }} onClick={() => { navigate('/login'); setMobileOpen(false) }}>Log In</button>
              <button className="btn-glow text-sm py-3 justify-center" style={{ width: '100%' }} onClick={() => { navigate('/register'); setMobileOpen(false) }}>Get Started</button>
            </div>
          ) : (
            <div className="mobile-menu-btn-container">
              <button className="btn-outline text-sm py-3 justify-center" style={{ width: '100%' }} onClick={() => { navigate('/chat'); setMobileOpen(false) }}>💬 Messages</button>
              {user.role === 'client' && (
                <button className="btn-glow text-sm py-3 justify-center" style={{ width: '100%' }} onClick={() => { navigate('/post-project'); setMobileOpen(false) }}>Post a Project</button>
              )}
              <button 
                className="btn-outline text-sm py-3 justify-center" 
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} 
                onClick={() => { navigate('/profile'); setMobileOpen(false) }}
              >
                {user.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt="Avatar"
                    style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '0.85rem' }}>👤</span>
                )}
                <span>My Profile</span>
              </button>
              <button className="btn-glow text-sm py-3 justify-center" style={{ width: '100%', borderColor: 'rgba(255,68,68,0.25)' }} onClick={() => { logoutUser(); setMobileOpen(false); navigate('/') }}>Log Out</button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
