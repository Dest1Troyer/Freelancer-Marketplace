const cx = {
  maxWidth: '1280px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 'clamp(1rem, 4vw, 1.5rem)',
  paddingRight: 'clamp(1rem, 4vw, 1.5rem)',
  width: '100%',
  position: 'relative',
  zIndex: 10,
}

const steps = [
  { icon: '🎯', title: 'Post Your Project',     color: '#6c63ff', desc: 'Describe what you need. It only takes a few minutes to set up your project and define your requirements.' },
  { icon: '💬', title: 'Receive Proposals',     color: '#ff6584', desc: 'Get matched with the best freelancers who submit custom proposals tailored to your project.' },
  { icon: '🤝', title: 'Collaborate Securely',  color: '#43e97b', desc: 'Use our built-in tools to chat, share files, and track progress — all in one place with escrow protection.' },
  { icon: '🚀', title: 'Launch Your Work',      color: '#f7971e', desc: 'Review deliverables and release payment only when 100% satisfied. Simple, fast, and protected.' },
]

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-[#0f0f23] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(90deg, rgba(108,99,255,0.5) 1px, transparent 1px)', backgroundSize: '80px 80px' }}
      />

      <div style={cx}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#43e97b] mb-3">Simple Process</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            How <span className="neon-text">It Works</span>
          </h2>
          <p className="text-white/40" style={{ maxWidth: '36rem', marginLeft: 'auto', marginRight: 'auto' }}>
            From idea to delivered project in four seamless steps
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', position: 'relative' }}>
          {steps.map((step, i) => (
            <div key={step.title} className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', animationDelay: `${i * 0.12}s` }}>
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl border border-white/10 bg-white/3"
                  style={{ boxShadow: `0 0 30px ${step.color}33`, position: 'relative', zIndex: 1 }}
                >
                  {step.icon}
                </div>
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-10"
                  style={{ background: step.color, animationDuration: '3s', animationDelay: `${i * 0.5}s` }}
                />
                <span
                  className="absolute text-white font-bold text-xs flex items-center justify-center"
                  style={{ width: 28, height: 28, borderRadius: '50%', background: step.color, boxShadow: `0 0 12px ${step.color}80`, top: -8, right: -8, zIndex: 2 }}
                >
                  {i + 1}
                </span>
              </div>
              <h3 className="font-bold text-white text-lg mb-3 leading-tight">{step.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed" style={{ maxWidth: '13rem', margin: '0 auto' }}>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <button className="btn-glow px-10 py-4 text-base rounded-2xl">Start a Project Today →</button>
        </div>
      </div>
    </section>
  )
}
