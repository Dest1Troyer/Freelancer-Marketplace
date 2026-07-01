import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const cx = {
  maxWidth: '1280px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 'clamp(1rem, 4vw, 1.5rem)',
  paddingRight: 'clamp(1rem, 4vw, 1.5rem)',
  width: '100%',
}

const features = [
  {
    icon: '🌍',
    title: 'Global Talent Pool',
    desc: 'Access 2.4M+ verified freelancers across 190+ countries. From designers to blockchain engineers — find the perfect match in minutes, not weeks.',
  },
  {
    icon: '🔒',
    title: 'Secure Escrow Payments',
    desc: 'Every payment is held in escrow until you approve the work. Your money is protected, and freelancers are guaranteed fair compensation.',
  },
  {
    icon: '⚡',
    title: 'Lightning-Fast Matching',
    desc: 'Our AI-powered matching engine analyzes your project requirements and surfaces the top 5% of talent — so you hire faster with confidence.',
  },
  {
    icon: '⭐',
    title: '98.6% Client Satisfaction',
    desc: 'Real reviews, verified portfolios, and a rigorous vetting process ensure you only work with professionals who deliver excellence.',
  },
  {
    icon: '💬',
    title: 'Built-In Collaboration',
    desc: 'Real-time messaging, file sharing, and milestone tracking — everything you need to collaborate seamlessly, all in one place.',
  },
  {
    icon: '🛡️',
    title: 'Zero Risk, All Reward',
    desc: 'Post projects for free. No subscriptions, no hidden fees. You only pay when you find the right freelancer and approve their work.',
  },
]

const stats = [
  { value: '2.4M+', label: 'Active Freelancers' },
  { value: '18M+', label: 'Projects Completed' },
  { value: '190+', label: 'Countries' },
  { value: '98.6%', label: 'Satisfaction Rate' },
]

const comparisons = [
  { feature: 'Escrow Protection', us: true, others: false },
  { feature: 'AI Talent Matching', us: true, others: false },
  { feature: 'No Subscription Fees', us: true, others: false },
  { feature: 'Verified Portfolios', us: true, others: true },
  { feature: 'Real-Time Messaging', us: true, others: true },
  { feature: '24/7 Support', us: true, others: false },
  { feature: 'Milestone Payments', us: true, others: false },
  { feature: 'NDA & IP Protection', us: true, others: false },
]

const testimonials = [
  {
    quote: "FreelanceHub completely changed how we build products. We shipped our MVP in 3 weeks with a team we found in a single afternoon.",
    name: 'Sarah Chen',
    role: 'CTO, Vortex Labs',
    avatar: '👩‍💻',
  },
  {
    quote: "The quality of freelancers here is unmatched. Every hire has exceeded our expectations. We've saved over $200K in recruitment costs.",
    name: 'Marcus Johnson',
    role: 'VP Engineering, NovaTech',
    avatar: '👨‍💼',
  },
  {
    quote: "As a freelancer, this platform gave me access to premium clients I'd never reach otherwise. My income tripled in 6 months.",
    name: 'Priya Sharma',
    role: 'Senior UI/UX Designer',
    avatar: '👩‍🎨',
  },
]

export default function WhyFreelanceHubPage() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#07070f', color: '#fff' }}>
      <Navbar />

      {/* ── Hero Section ── */}
      <section
        className="animated-bg relative overflow-hidden"
        style={{
          paddingTop: 'clamp(7rem, 14vw, 10rem)',
          paddingBottom: 'clamp(4rem, 8vw, 6rem)',
        }}
      >
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

        <div className="relative z-10" style={{ ...cx, textAlign: 'center' }}>
          <div
            className="fade-in-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 999,
              padding: '8px 20px',
              fontSize: 14,
              color: 'rgba(255,255,255,0.7)',
              marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#43e97b', display: 'inline-block' }} />
            Trusted by 2M+ businesses worldwide
          </div>

          <h1
            className="fade-in-up delay-1"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
            }}
          >
            Why Choose{' '}
            <span className="neon-text">FreelanceHub</span>?
          </h1>

          <p
            className="fade-in-up delay-2"
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
              maxWidth: '44rem',
              margin: '0 auto',
              marginBottom: 'clamp(2rem, 5vw, 3rem)',
              lineHeight: 1.7,
            }}
          >
            We built the platform we wished existed — one where finding incredible
            talent is effortless, payments are safe, and every project is set up to
            succeed from day one.
          </p>

          {/* Stats row */}
          <div
            className="fade-in-up delay-3"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1.5rem',
              maxWidth: '52rem',
              margin: '0 auto',
            }}
          >
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="glass-card"
                style={{ padding: 'clamp(1.25rem, 3vw, 1.75rem)', textAlign: 'center' }}
              >
                <div className="stat-num" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 800, marginBottom: 4 }}>
                  {value}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#07070f] to-transparent pointer-events-none" />
      </section>

      {/* ── Features Grid ── */}
      <section className="section-spacing" style={{ background: '#07070f' }}>
        <div style={cx}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 6vw, 4rem)' }}>
            <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6c63ff', marginBottom: 12 }}>
              Platform Advantages
            </p>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: 16,
              }}
            >
              Everything You Need to{' '}
              <span className="neon-text">Succeed</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '36rem', margin: '0 auto', lineHeight: 1.7 }}>
              From finding the right talent to managing payments — we've thought of everything so you can focus on what matters.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'clamp(1rem, 3vw, 1.5rem)',
            }}
          >
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="glass-card" style={{ padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(168,85,247,0.15))',
                    border: '1px solid rgba(108,99,255,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    marginBottom: 16,
                  }}
                >
                  {icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="section-spacing" style={{ background: '#0a0a18' }}>
        <div style={cx}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 6vw, 4rem)' }}>
            <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ff6584', marginBottom: 12 }}>
              The FreelanceHub Difference
            </p>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.15,
              }}
            >
              How We <span className="neon-text">Compare</span>
            </h2>
          </div>

          <div
            className="glass-card"
            style={{
              maxWidth: '700px',
              margin: '0 auto',
              overflow: 'hidden',
              borderRadius: 20,
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 120px',
                gap: 0,
                padding: '16px 24px',
                background: 'rgba(108,99,255,0.1)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              <span>Feature</span>
              <span style={{ textAlign: 'center', color: '#6c63ff' }}>FreelanceHub</span>
              <span style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Others</span>
            </div>
            {comparisons.map(({ feature, us, others }, i) => (
              <div
                key={feature}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 120px 120px',
                  gap: 0,
                  padding: '14px 24px',
                  borderBottom: i < comparisons.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                <span>{feature}</span>
                <span style={{ textAlign: 'center', fontSize: 18 }}>{us ? '✅' : '❌'}</span>
                <span style={{ textAlign: 'center', fontSize: 18 }}>{others ? '✅' : '❌'}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section-spacing" style={{ background: '#07070f' }}>
        <div style={cx}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 6vw, 4rem)' }}>
            <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#43e97b', marginBottom: 12 }}>
              Success Stories
            </p>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.15,
              }}
            >
              Loved by <span className="neon-text">Millions</span>
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'clamp(1rem, 3vw, 1.5rem)',
            }}
          >
            {testimonials.map(({ quote, name, role, avatar }) => (
              <div key={name} className="glass-card" style={{ padding: 'clamp(1.5rem, 4vw, 2rem)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.75, marginBottom: 24, fontStyle: 'italic' }}>
                  "{quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, rgba(108,99,255,0.3), rgba(168,85,247,0.2))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      flexShrink: 0,
                    }}
                  >
                    {avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="section-spacing" style={{ background: '#07070f', position: 'relative', overflow: 'hidden' }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[350px] bg-gradient-to-r from-[#6c63ff]/15 via-[#a855f7]/10 to-[#ff6584]/15 blur-[120px] rounded-full" />
        </div>
        <div style={{ ...cx, textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            Ready to Get <span className="neon-text">Started</span>?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '32rem', margin: '0 auto', marginBottom: 'clamp(2rem, 5vw, 2.5rem)', lineHeight: 1.7 }}>
            Join millions of businesses and freelancers who trust FreelanceHub to make great work happen — every single day.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/register" className="btn-glow" style={{ padding: '16px 40px', fontSize: 16, borderRadius: 16, textDecoration: 'none' }}>
              🚀 Sign Up Free
            </Link>
            <Link to="/" className="btn-outline" style={{ padding: '15px 40px', fontSize: 16, borderRadius: 16, textDecoration: 'none' }}>
              Explore the Platform
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
