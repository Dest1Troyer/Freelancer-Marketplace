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

const enterpriseFeatures = [
  {
    icon: '🏢',
    title: 'Dedicated Account Manager',
    desc: 'A single point of contact who understands your business, curates talent shortlists, and ensures every engagement runs smoothly.',
  },
  {
    icon: '🔐',
    title: 'Enterprise-Grade Security',
    desc: 'SOC 2 Type II compliant infrastructure, end-to-end encryption, custom NDAs, and IP protection built into every contract.',
  },
  {
    icon: '📊',
    title: 'Advanced Analytics & Reporting',
    desc: 'Real-time dashboards for spend tracking, team utilization, project velocity, and ROI measurement across all engagements.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Talent Curation',
    desc: 'Our proprietary matching engine analyzes 50+ data points to surface the top 1% of talent for your specific technical requirements.',
  },
  {
    icon: '⚡',
    title: 'Priority Talent Access',
    desc: 'Skip the queue. Enterprise clients get first access to newly verified top-tier freelancers before they appear on the public marketplace.',
  },
  {
    icon: '🌐',
    title: 'Global Compliance & Payments',
    desc: 'Automated invoicing, tax compliance across 190+ countries, consolidated billing, and flexible payment terms up to Net-60.',
  },
]

const logos = [
  'TechCorp', 'InnovateCo', 'GlobalFin', 'DataDriven', 'ScaleUp', 'NextGen',
]

const plans = [
  {
    name: 'Growth',
    price: '$499',
    period: '/month',
    desc: 'For scaling teams that need reliable access to vetted freelancers.',
    features: [
      'Up to 10 active projects',
      'Dedicated account manager',
      'Priority talent matching',
      'Basic analytics dashboard',
      'Standard support (24h SLA)',
      'NDA templates included',
    ],
    highlight: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For large organizations with complex workforce and compliance needs.',
    features: [
      'Unlimited active projects',
      'Senior account executive',
      'AI talent curation (top 1%)',
      'Advanced analytics & API access',
      'Priority support (4h SLA)',
      'Custom contracts & compliance',
      'SSO & team management',
      'Quarterly business reviews',
    ],
    highlight: true,
  },
  {
    name: 'Agency',
    price: '$299',
    period: '/month',
    desc: 'Built for agencies managing multiple client engagements simultaneously.',
    features: [
      'Up to 25 active projects',
      'Multi-client workspace',
      'White-label deliverables',
      'Team collaboration tools',
      'Standard support (24h SLA)',
      'Consolidated invoicing',
    ],
    highlight: false,
  },
]

const useCases = [
  {
    icon: '💻',
    title: 'Product Development',
    desc: 'Scale your engineering team overnight. Add React, Python, or ML engineers on-demand without the 3-month hiring cycle.',
  },
  {
    icon: '🎨',
    title: 'Design & Creative',
    desc: 'Access world-class designers for brand refreshes, product design, and marketing campaigns — at a fraction of agency costs.',
  },
  {
    icon: '📈',
    title: 'Data & Analytics',
    desc: 'Hire data scientists, BI analysts, and ML engineers to unlock insights from your data without building an in-house team.',
  },
  {
    icon: '📝',
    title: 'Content & Marketing',
    desc: 'From SEO copywriting to video production — scale your content output with specialized freelancers who know your industry.',
  },
]

export default function EnterprisePage() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#07070f', color: '#fff' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section
        className="animated-bg relative overflow-hidden"
        style={{
          paddingTop: 'clamp(7rem, 14vw, 10rem)',
          paddingBottom: 'clamp(4rem, 8vw, 6rem)',
        }}
      >
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
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
              background: 'linear-gradient(to right, rgba(108,99,255,0.2), rgba(168,85,247,0.2))',
              border: '1px solid rgba(108,99,255,0.3)',
              borderRadius: 999,
              padding: '8px 20px',
              fontSize: 14,
              color: '#a78bfa',
              marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
            }}
          >
            🏢 Built for Teams & Organizations
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
            FreelanceHub for{' '}
            <span className="neon-text">Enterprise</span>
          </h1>

          <p
            className="fade-in-up delay-2"
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
              maxWidth: '46rem',
              margin: '0 auto',
              marginBottom: 'clamp(2rem, 5vw, 3rem)',
              lineHeight: 1.7,
            }}
          >
            The most trusted enterprise workforce solution. Scale your team with
            vetted, world-class freelancers — backed by dedicated support,
            enterprise security, and full compliance.
          </p>

          <div className="fade-in-up delay-3" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/register" className="btn-glow" style={{ padding: '16px 40px', fontSize: 16, borderRadius: 16, textDecoration: 'none' }}>
              Request a Demo
            </Link>
            <Link to="/" className="btn-outline" style={{ padding: '15px 40px', fontSize: 16, borderRadius: 16, textDecoration: 'none' }}>
              View Solutions
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#07070f] to-transparent pointer-events-none" />
      </section>

      {/* ── Trusted Logos ── */}
      <section style={{ background: '#07070f', paddingTop: 'clamp(2rem, 4vw, 3rem)', paddingBottom: 'clamp(2rem, 4vw, 3rem)' }}>
        <div style={{ ...cx, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
            Trusted by industry leaders
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(1.5rem, 4vw, 3rem)', alignItems: 'center' }}>
            {logos.map((name) => (
              <div
                key={name}
                style={{
                  padding: '10px 28px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  fontWeight: 700,
                  fontSize: 'clamp(14px, 2vw, 16px)',
                  color: 'rgba(255,255,255,0.25)',
                  letterSpacing: '0.05em',
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Enterprise Features Grid ── */}
      <section className="section-spacing" style={{ background: '#0a0a18' }}>
        <div style={cx}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 6vw, 4rem)' }}>
            <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6c63ff', marginBottom: 12 }}>
              Enterprise Features
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
              Built for <span className="neon-text">Scale & Security</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '38rem', margin: '0 auto', lineHeight: 1.7 }}>
              Everything your organization needs to manage a global freelance workforce — securely, efficiently, and at scale.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'clamp(1rem, 3vw, 1.5rem)',
            }}
          >
            {enterpriseFeatures.map(({ icon, title, desc }) => (
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

      {/* ── Use Cases ── */}
      <section className="section-spacing" style={{ background: '#07070f' }}>
        <div style={cx}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 6vw, 4rem)' }}>
            <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#43e97b', marginBottom: 12 }}>
              Use Cases
            </p>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.15,
              }}
            >
              How Teams Use <span className="neon-text">FreelanceHub</span>
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 'clamp(1rem, 3vw, 1.5rem)',
            }}
          >
            {useCases.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="glass-card"
                style={{ padding: 'clamp(1.5rem, 4vw, 2rem)', textAlign: 'center' }}
              >
                <div style={{ fontSize: 40, marginBottom: 16 }}>{icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Tiers ── */}
      <section className="section-spacing" style={{ background: '#0a0a18' }}>
        <div style={cx}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 6vw, 4rem)' }}>
            <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ff6584', marginBottom: 12 }}>
              Plans & Pricing
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
              Simple, <span className="neon-text">Transparent</span> Pricing
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '34rem', margin: '0 auto', lineHeight: 1.7 }}>
              No hidden fees. Choose the plan that fits your team, and scale as you grow.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'clamp(1rem, 3vw, 1.5rem)',
              maxWidth: '1000px',
              margin: '0 auto',
            }}
          >
            {plans.map(({ name, price, period, desc, features, highlight }) => (
              <div
                key={name}
                className="glass-card"
                style={{
                  padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                  border: highlight ? '2px solid rgba(108,99,255,0.5)' : undefined,
                  background: highlight ? 'rgba(108,99,255,0.06)' : undefined,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {highlight && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: -30,
                      background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '4px 40px',
                      transform: 'rotate(45deg)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    POPULAR
                  </div>
                )}

                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>{desc}</p>

                <div style={{ marginBottom: 24 }}>
                  <span
                    className="stat-num"
                    style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 800 }}
                  >
                    {price}
                  </span>
                  {period && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>{period}</span>}
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {features.map((f) => (
                    <li key={f} style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ color: '#43e97b', fontSize: 14, flexShrink: 0, marginTop: 2 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={highlight ? 'btn-glow' : 'btn-outline'}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '14px 0',
                    fontSize: 14,
                    borderRadius: 14,
                    textDecoration: 'none',
                    textAlign: 'center',
                  }}
                >
                  {highlight ? 'Contact Sales' : 'Get Started'}
                </Link>
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
            Scale Your Team with <span className="neon-text">Confidence</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '34rem', margin: '0 auto', marginBottom: 'clamp(2rem, 5vw, 2.5rem)', lineHeight: 1.7 }}>
            Talk to our enterprise team today and discover how FreelanceHub can transform the way your organization works.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/register" className="btn-glow" style={{ padding: '16px 40px', fontSize: 16, borderRadius: 16, textDecoration: 'none' }}>
              📞 Talk to Sales
            </Link>
            <Link to="/why-freelancehub" className="btn-outline" style={{ padding: '15px 40px', fontSize: 16, borderRadius: 16, textDecoration: 'none' }}>
              Why FreelanceHub?
            </Link>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
            {['🔒 SOC 2 Compliant', '📋 Custom NDAs', '🌍 190+ Countries', '⚡ 4h Support SLA'].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
