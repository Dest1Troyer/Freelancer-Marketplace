const brands = [
  'Google', 'Microsoft', 'Airbnb', 'Spotify', 'Stripe',
  'Notion', 'Figma', 'Shopify', 'Netflix', 'Slack',
]

export default function TrustBannerSection() {
  const doubled = [...brands, ...brands]

  return (
    <section style={{ padding: '4rem 0', background: '#07070f', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
      {/* Label */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500 }}>
          Trusted by teams at world-class companies
        </p>
      </div>

      {/* Marquee wrapper */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        {/* Fade masks */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 96, background: 'linear-gradient(to right, #07070f, transparent)', zIndex: 10, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 96, background: 'linear-gradient(to left, #07070f, transparent)', zIndex: 10, pointerEvents: 'none' }} />

        <div className="marquee-track">
          {doubled.map((brand, i) => (
            <div
              key={`${brand}-${i}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 24px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
                whiteSpace: 'nowrap',
                color: 'rgba(255,255,255,0.3)',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'default',
                flexShrink: 0,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', flexShrink: 0, display: 'inline-block' }} />
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
