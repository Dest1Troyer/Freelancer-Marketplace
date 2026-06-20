const cx = {
  maxWidth: '1280px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 'clamp(1rem, 4vw, 1.5rem)',
  paddingRight: 'clamp(1rem, 4vw, 1.5rem)',
  width: '100%',
}

const freelancers = [
  { name: 'Sophia Chen',   title: 'Senior UI/UX Designer',   avatar: 'SC', rating: 4.99, reviews: 312, hourlyRate: '$85',  tags: ['Figma', 'Prototyping', 'Design Systems'], badge: '🏆 Top Rated',   gradient: 'from-pink-500 to-rose-400',    available: true  },
  { name: 'Marcus Rivera', title: 'Full Stack Engineer',      avatar: 'MR', rating: 4.97, reviews: 528, hourlyRate: '$110', tags: ['React', 'Node.js', 'AWS'],                badge: '⚡ Rising Star', gradient: 'from-violet-500 to-indigo-400', available: true  },
  { name: 'Aisha Johnson', title: 'AI/ML Specialist',        avatar: 'AJ', rating: 5.0,  reviews: 189, hourlyRate: '$135', tags: ['Python', 'TensorFlow', 'LLMs'],           badge: '🤖 Expert',      gradient: 'from-teal-500 to-cyan-400',    available: false },
  { name: 'Luca Martini',  title: 'Brand & Motion Designer', avatar: 'LM', rating: 4.95, reviews: 247, hourlyRate: '$75',  tags: ['After Effects', 'Branding', '3D'],        badge: '✨ Pro',          gradient: 'from-amber-500 to-orange-400', available: true  },
]

function Stars({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
      {[1,2,3,4,5].map((s) => (
        <svg key={s} style={{ width: 14, height: 14, flexShrink: 0 }} fill={s <= Math.round(rating) ? '#f7971e' : 'rgba(255,255,255,0.15)'} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginLeft: 2 }}>{rating.toFixed(2)}</span>
    </div>
  )
}

export default function FreelancersSection() {
  return (
    <section className="section-spacing bg-gradient-to-b from-[#07070f] to-[#0f0f23] relative overflow-hidden">
      <div style={cx}>
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', marginBottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#ff6584] mb-3">
              Top Talent
            </span>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Featured <span className="neon-text">Freelancers</span>
            </h2>
          </div>
          <button className="btn-outline text-sm">View all freelancers →</button>
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {freelancers.map((f, i) => (
            <div
              key={f.name}
              className="glass-card p-5 fade-in-up"
              style={{ animationDelay: `${i * 0.1}s`, display: 'flex', flexDirection: 'column' }}
            >
              {/* Badge + availability */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/60">{f.badge}</span>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={f.available
                    ? { background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }
                    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)' }
                  }
                >
                  {f.available ? '● Available' : '○ Busy'}
                </span>
              </div>

              {/* Avatar + name centred */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{ position: 'relative', width: 64, height: 64, marginBottom: '0.75rem' }}>
                  <div className={`absolute -inset-0.5 rounded-full bg-gradient-to-br ${f.gradient} opacity-30 blur-sm`} />
                  <div className={`relative w-full h-full rounded-full bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                    {f.avatar}
                  </div>
                </div>
                <h3 className="font-semibold text-white text-base leading-tight">{f.name}</h3>
                <p className="text-xs text-white/45 mt-0.5">{f.title}</p>
              </div>

              {/* Rating */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <Stars rating={f.rating} />
                <span className="text-xs text-white/35">({f.reviews})</span>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.25rem' }}>
                {f.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/50">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <span className="text-xs text-white/35">From </span>
                  <span className="font-bold text-white">{f.hourlyRate}</span>
                  <span className="text-xs text-white/35">/hr</span>
                </div>
                <button className="btn-glow text-xs px-4 py-2 rounded-lg">View Profile</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
