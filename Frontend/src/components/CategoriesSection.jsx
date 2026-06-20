const cx = {
  maxWidth: '1280px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 'clamp(1rem, 4vw, 1.5rem)',
  paddingRight: 'clamp(1rem, 4vw, 1.5rem)',
  width: '100%',
}

const categories = [
  { icon: '🎨', name: 'Design & Creative',       count: '42,000+ services', color: 'from-pink-500/20 to-rose-500/10',    accent: '#ff6584' },
  { icon: '💻', name: 'Development & Tech',       count: '85,000+ services', color: 'from-violet-500/20 to-purple-500/10', accent: '#6c63ff' },
  { icon: '📈', name: 'Digital Marketing',        count: '29,000+ services', color: 'from-orange-500/20 to-amber-500/10',  accent: '#f7971e' },
  { icon: '✍️', name: 'Writing & Translation',    count: '38,000+ services', color: 'from-teal-500/20 to-green-500/10',   accent: '#43e97b' },
  { icon: '🎬', name: 'Video & Animation',        count: '15,000+ services', color: 'from-blue-500/20 to-cyan-500/10',    accent: '#0a84ff' },
  { icon: '🤖', name: 'AI & Machine Learning',    count: '9,500+ services',  color: 'from-indigo-500/20 to-blue-500/10',  accent: '#bf5af2' },
  { icon: '🔒', name: 'Cybersecurity',            count: '6,200+ services',  color: 'from-red-500/20 to-rose-600/10',     accent: '#ff453a' },
  { icon: '📊', name: 'Data & Analytics',         count: '11,000+ services', color: 'from-cyan-500/20 to-sky-500/10',     accent: '#30d158' },
]

export default function CategoriesSection() {
  return (
    <section className="section-spacing bg-[#07070f] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-[#6c63ff] to-transparent" />

      <div style={cx}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#6c63ff] mb-3">
            Explore Services
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Browse by <span className="neon-text">Category</span>
          </h2>
          <p className="text-white/40" style={{ maxWidth: '36rem', marginLeft: 'auto', marginRight: 'auto' }}>
            Find the expertise you need from thousands of specialized services across every industry
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          {categories.map((cat, i) => (
            <div
              key={cat.name}
              className="cat-card p-6 fade-in-up"
              style={{ animationDelay: `${i * 0.07}s`, display: 'flex', flexDirection: 'column' }}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mb-4 border border-white/5 flex-shrink-0`}>
                {cat.icon}
              </div>
              <h3 className="font-semibold text-white/90 text-sm leading-snug mb-1">{cat.name}</h3>
              <p className="text-xs text-white/35 mb-4">{cat.count}</p>
              <div className="mt-auto flex items-center gap-1 text-xs font-semibold" style={{ color: cat.accent }}>
                <span>Explore</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
