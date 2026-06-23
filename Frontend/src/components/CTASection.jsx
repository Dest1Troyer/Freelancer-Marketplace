import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const cx = {
  maxWidth: '1280px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 'clamp(1rem, 4vw, 1.5rem)',
  paddingRight: 'clamp(1rem, 4vw, 1.5rem)',
  width: '100%',
  position: 'relative',
  zIndex: 10,
  textAlign: 'center',
}

export default function CTASection() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const handlePostProject = () => {
    if (!user) {
      navigate('/register')
    } else {
      navigate('/profile')
    }
  }

  const handleBrowseFreelancers = () => {
    const el = document.getElementById('featured-freelancers-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else if (!user) {
      navigate('/register')
    } else {
      navigate('/profile')
    }
  }

  return (
    <section className="section-spacing bg-[#07070f] relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[400px] bg-gradient-to-r from-[#6c63ff]/15 via-[#a855f7]/10 to-[#ff6584]/15 blur-[120px] rounded-full" />
      </div>
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />

      <div style={cx}>
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(to right, rgba(108,99,255,0.2), rgba(168,85,247,0.2))', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 999, padding: '8px 20px', fontSize: 14, color: '#a78bfa', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
          🎉 Join 2 million+ businesses on FreelanceHub
        </div>

        <h2
          className="text-5xl md:text-6xl font-black mb-6 leading-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif", maxWidth: '52rem', marginLeft: 'auto', marginRight: 'auto' }}
        >
          {user ? (
            user.role === 'client' ? (
              <>Ready to Build <span className="neon-text">Something Great?</span></>
            ) : (
              <>Ready to Find <span className="neon-text">Your Next Gig?</span></>
            )
          ) : (
            <>Ready to Build <span className="neon-text">Something Great?</span></>
          )}
        </h2>

        <p className="text-white/45 text-lg leading-relaxed" style={{ maxWidth: '36rem', marginLeft: 'auto', marginRight: 'auto', marginBottom: 'clamp(2rem, 5vw, 2.5rem)' }}>
          {user ? (
            user.role === 'client' ? (
              "Post your project for free today. No subscription required — only pay when you find the perfect match."
            ) : (
              "Update your profile rate, headline, and biography to stand out to premium clients looking to hire today."
            )
          ) : (
            "Post your project for free today. No subscription required — only pay when you find the perfect match."
          )}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', alignItems: 'center', marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
          {user ? (
            user.role === 'client' ? (
              <>
                <button className="btn-glow px-10 py-4 text-base rounded-2xl" onClick={handlePostProject}>🚀 Post a Project — It's Free</button>
                <button className="btn-outline px-10 py-4 text-base rounded-2xl" onClick={handleBrowseFreelancers}>Browse Freelancers</button>
              </>
            ) : (
              <>
                <button className="btn-glow px-10 py-4 text-base rounded-2xl" onClick={() => navigate('/profile')}>💻 Update My Profile</button>
                <button className="btn-outline px-10 py-4 text-base rounded-2xl" onClick={() => navigate('/profile')}>View My Dashboard</button>
              </>
            )
          ) : (
            <>
              <button className="btn-glow px-10 py-4 text-base rounded-2xl" onClick={handlePostProject}>🚀 Post a Project — It's Free</button>
              <button className="btn-outline px-10 py-4 text-base rounded-2xl" onClick={handleBrowseFreelancers}>Browse Freelancers</button>
            </>
          )}
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          {['✅ No credit card required', '🔒 Secure escrow payments', '⭐ 4.9/5 average rating', '🌍 190+ countries'].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
