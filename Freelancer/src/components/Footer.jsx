const cx = {
  maxWidth: '1280px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 'clamp(1rem, 4vw, 1.5rem)',
  paddingRight: 'clamp(1rem, 4vw, 1.5rem)',
  width: '100%',
}

const footerLinks = {
  'For Clients':      ['How to Hire', 'Talent Marketplace', 'Project Catalog', 'Hire an Agency', 'Enterprise'],
  'For Freelancers':  ['How to Find Work', 'Direct Contracts', 'Find Freelance Jobs', 'Community Forum', 'Success Stories'],
  'Resources':        ['Help & Support', 'Blog & Insights', 'Freelancer Resources', 'Sitemap', 'Accessibility'],
  'Company':          ['About Us', 'Careers', 'Press', 'Investor Relations', 'Trust & Safety'],
}

export default function Footer() {
  return (
    <footer style={{ background: '#070710', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div style={cx}>
        {/* Top grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2.5rem', marginBottom: '3.5rem' }}>
          {/* Brand column */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6c63ff] to-[#a855f7] flex items-center justify-center font-bold text-sm shadow-lg shadow-purple-500/30" style={{ flexShrink: 0 }}>
                FH
              </div>
              <span className="font-bold text-xl tracking-tight">
                Freelance<span className="text-[#6c63ff]">Hub</span>
              </span>
            </div>
            <p className="text-white/35 text-sm leading-relaxed mb-6" style={{ maxWidth: '18rem' }}>
              The world's premier platform connecting top-tier freelancers with businesses ready to grow. Fast, secure, and trusted.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['𝕏', 'in', 'f', '▶'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-[#6c63ff]/30 transition-all duration-200 text-xs font-bold"
                  style={{ flexShrink: 0 }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-white/50 mb-4">{section}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/30 hover:text-white/80 transition-colors duration-200">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs text-white/20">© 2026 FreelanceHub, Inc. All rights reserved.</p>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[['🍎', 'App Store'], ['🤖', 'Google Play']].map(([icon, label]) => (
              <div
                key={label}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
              >
                <span>{icon}</span>{label}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((item) => (
              <a key={item} href="#" className="text-xs text-white/20 hover:text-white/50 transition-colors duration-200" style={{ whiteSpace: 'nowrap' }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
