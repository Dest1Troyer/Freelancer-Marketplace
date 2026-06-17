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

const testimonials = [
  {
    name: 'Ethan Brooks',  role: 'CTO at NovaTech',            avatar: 'EB', gradient: 'from-blue-500 to-indigo-400',
    quote: "FreelanceHub transformed how we build software. We hired a senior React engineer in 48 hours and the quality blew us away. It's now our go-to for all dev talent.",
    rating: 5, project: 'E-commerce Platform Rebuild',
  },
  {
    name: 'Priya Sharma',  role: 'Founder, Bloom Agency',      avatar: 'PS', gradient: 'from-rose-500 to-pink-400',
    quote: 'I scaled my design agency by 3x using FreelanceHub. The talent pool is exceptional and the escrow payment system gives me complete confidence in every project.',
    rating: 5, project: 'Brand Identity Design',
  },
  {
    name: 'James Olivier', role: 'Product Manager, FinanceAI', avatar: 'JO', gradient: 'from-teal-500 to-emerald-400',
    quote: 'We needed a specialized ML engineer for a 6-week contract. Found the perfect match within a day. The work was outstanding and delivered ahead of schedule.',
    rating: 5, project: 'ML Model Development',
  },
]

function QuoteIcon() {
  return (
    <svg style={{ width: 32, height: 32, opacity: 0.2, color: '#6c63ff', fill: 'currentColor' }} viewBox="0 0 24 24">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0f0f23] to-[#07070f] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#6c63ff]/8 blur-[100px] rounded-full pointer-events-none" />

      <div style={cx}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#f7971e] mb-3">Client Stories</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Trusted by <span className="neon-text">Thousands</span>
          </h2>
          <p className="text-white/40" style={{ maxWidth: '36rem', marginLeft: 'auto', marginRight: 'auto' }}>
            Real stories from businesses and teams who scaled with FreelanceHub
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="glass-card p-7 fade-in-up"
              style={{ display: 'flex', flexDirection: 'column', animationDelay: `${i * 0.15}s` }}
            >
              {/* Stars */}
              <div style={{ display: 'flex', gap: 4, marginBottom: '1rem' }}>
                {Array.from({ length: t.rating }).map((_, si) => (
                  <svg key={si} style={{ width: 16, height: 16, color: '#f7971e', flexShrink: 0, fill: 'currentColor' }} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <div style={{ marginBottom: 8 }}><QuoteIcon /></div>

              <p className="text-white/65 text-sm leading-relaxed italic" style={{ flex: 1, marginBottom: '1.5rem' }}>
                "{t.quote}"
              </p>

              <div style={{ marginBottom: '1.25rem' }}>
                <span
                  className="text-xs text-[#a78bfa]"
                  style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: 999, padding: '4px 12px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  📁 {t.project}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xs font-bold`}>{t.avatar}</div>
                  <div className={`absolute -inset-0.5 rounded-full bg-gradient-to-br ${t.gradient} opacity-25 blur-sm`} style={{ zIndex: -1 }} />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm leading-tight">{t.name}</div>
                  <div className="text-xs text-white/40 mt-0.5">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
