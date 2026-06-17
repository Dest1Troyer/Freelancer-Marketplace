import { useState } from 'react'

const popularTags = [
  'UI/UX Design', 'React Development', 'Node.js', 'Python AI/ML',
  'Video Editing', 'Copywriting', 'Blockchain', 'Data Analysis',
]

const cx = {
  maxWidth: '1280px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 'clamp(1rem, 4vw, 1.5rem)',
  paddingRight: 'clamp(1rem, 4vw, 1.5rem)',
  width: '100%',
}

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <section className="animated-bg relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20">
      {/* Ambient Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Dot Grid Overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full">
        <div style={{ ...cx, textAlign: 'center' }}>

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            className="fade-in-up bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#43e97b] animate-pulse" />
            <span>Over <strong className="text-white">500,000</strong> freelancers ready to work</span>
          </div>

          {/* Headline */}
          <h1
            className="fade-in-up delay-1 font-bold leading-tight mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}
          >
            Hire the World's{' '}
            <span className="neon-text">Top Freelancers</span>{' '}
            <br className="hidden sm:block" />
            in Minutes
          </h1>

          {/* Sub-headline */}
          <p
            className="fade-in-up delay-2 text-lg md:text-xl text-white/50 leading-relaxed mb-10"
            style={{ maxWidth: '42rem', marginLeft: 'auto', marginRight: 'auto' }}
          >
            Connect with elite freelancers for any project. Build faster, smarter, and without the overhead — trusted by 2M+ businesses worldwide.
          </p>

          {/* Search Bar */}
          <div className="fade-in-up delay-3 mb-8" style={{ maxWidth: '42rem', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-2 gap-2 backdrop-blur-sm focus-within:border-[#6c63ff]/50 focus-within:shadow-[0_0_30px_rgba(108,99,255,0.15)] transition-all duration-300">
              <div className="pl-3 text-white/40 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for any skill or service..."
                className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-base py-2 px-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn-glow py-3 px-7 rounded-xl text-sm flex-shrink-0">
                Search
              </button>
            </div>
          </div>

          {/* Popular Tags */}
          <div
            className="fade-in-up delay-4 mb-14"
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
          >
            <span className="text-sm text-white/30">Popular:</span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                className="floating-tag text-xs px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-[#6c63ff]/50 hover:bg-[#6c63ff]/10 transition-all duration-200"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Stats Row */}
          <div
            className="fade-in-up delay-5"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: '36rem', marginLeft: 'auto', marginRight: 'auto' }}
          >
            {[
              { label: 'Active Freelancers', value: '2.4M+' },
              { label: 'Projects Completed', value: '18M+' },
              { label: 'Client Satisfaction', value: '98.6%' },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div className="stat-num text-3xl font-bold mb-1">{value}</div>
                <div className="text-xs text-white/40">{label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#07070f] to-transparent pointer-events-none" />
    </section>
  )
}
