import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../api/axios'

const cx = {
  maxWidth: '1200px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 'clamp(1rem, 4vw, 1.5rem)',
  paddingRight: 'clamp(1rem, 4vw, 1.5rem)',
  width: '100%',
  position: 'relative',
  zIndex: 10,
}

const labelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.5)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  marginBottom: '0.45rem',
}

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '0.875rem 1rem',
  color: '#fff',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'all 0.2s',
}

export default function FindTalentPage() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [freelancers, setFreelancers] = useState([])
  const [loadingFreelancers, setLoadingFreelancers] = useState(true)

  // Search and filter states
  const [search, setSearch] = useState('')
  const [skills, setSkills] = useState('')
  const [minRate, setMinRate] = useState('')
  const [maxRate, setMaxRate] = useState('')
  const [country, setCountry] = useState('')

  const fetchFreelancers = async () => {
    setLoadingFreelancers(true)
    try {
      const res = await api.get('freelancers/', {
        params: {
          search,
          skills,
          min_rate: minRate,
          max_rate: maxRate,
          country
        }
      })
      setFreelancers(res.data)
    } catch (err) {
      console.error("Error fetching freelancers:", err)
    } finally {
      setLoadingFreelancers(false)
    }
  }

  // Load list on mount
  useEffect(() => {
    fetchFreelancers()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchFreelancers()
  }

  const handleReset = () => {
    setSearch('')
    setSkills('')
    setMinRate('')
    setMaxRate('')
    setCountry('')
    // We cannot guarantee setState runs synchronously so we make a direct call
    setLoadingFreelancers(true)
    api.get('freelancers/')
      .then(res => setFreelancers(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoadingFreelancers(false))
  }

  const handleMessageClick = (freelancerEmail) => {
    if (!user) {
      navigate('/login')
    } else {
      navigate(`/chat?email=${freelancerEmail}`)
    }
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#07070f', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, position: 'relative', overflow: 'hidden', paddingTop: '7.5rem', paddingBottom: '5rem' }}>
        {/* Ambient glows */}
        <div style={{ position: 'absolute', width: 500, height: 500, top: '-180px', left: '-180px', background: 'rgba(108,99,255,0.12)', borderRadius: '50%', filter: 'blur(90px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, bottom: '-100px', right: '-100px', background: 'rgba(255,101,132,0.08)', borderRadius: '50%', filter: 'blur(90px)', pointerEvents: 'none' }} />

        {/* Grid pattern background */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

        <div style={cx}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 0.5rem', fontFamily: "'Space Grotesk', sans-serif", background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Find Top Talent
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              Search and filter high-quality freelancers for your projects.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
            {/* Left sidebar - Filters */}
            <form onSubmit={handleSubmit} className="glass-card" style={{ flex: '1 1 300px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                Filter Talents
              </h3>

              <div>
                <label style={labelStyle}>Keyword Search</label>
                <input
                  type="text"
                  placeholder="e.g. React Designer"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Skills (comma-separated)</label>
                <input
                  type="text"
                  placeholder="React, CSS, Django"
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Hourly Rate Range</label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input
                    type="number"
                    placeholder="Min ($)"
                    value={minRate}
                    onChange={e => setMinRate(e.target.value)}
                    style={{ ...inputStyle, padding: '0.75rem' }}
                  />
                  <span style={{ color: 'rgba(255,255,255,0.3)' }}>to</span>
                  <input
                    type="number"
                    placeholder="Max ($)"
                    value={maxRate}
                    onChange={e => setMaxRate(e.target.value)}
                    style={{ ...inputStyle, padding: '0.75rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Country</label>
                <input
                  type="text"
                  placeholder="e.g. Canada"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-outline text-sm"
                  style={{ flex: 1, justifyContent: 'center', padding: '0.75rem' }}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="btn-glow text-sm"
                  style={{ flex: 1, justifyContent: 'center', padding: '0.75rem' }}
                >
                  Apply
                </button>
              </div>
            </form>

            {/* Right panel - Freelancers List */}
            <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {loadingFreelancers ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="glass-card" style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>Loading credentials...</span>
                    </div>
                  ))}
                </div>
              ) : freelancers.length > 0 ? (
                freelancers.map((f) => {
                  const initialName = `${f.first_name ? f.first_name[0] : ''}${f.last_name ? f.last_name[0] : ''}`
                  const skillsTags = f.skills ? f.skills.split(',').map(s => s.trim()).filter(Boolean) : []

                  return (
                    <div
                      key={f.email}
                      className="glass-card"
                      style={{
                        padding: '1.5rem',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1.5rem',
                        transition: 'all 0.2s',
                        position: 'relative'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                      }}
                    >
                      {/* Avatar & Ratings Section */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '90px' }}>
                        <div style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '50%' }}>
                          <div style={{ position: 'absolute', inset: -2, borderRadius: '50%', background: 'linear-gradient(135deg, #6c63ff, #ff6584)', opacity: 0.3, filter: 'blur(3px)' }} />
                          {f.profile_picture ? (
                            <img
                              src={f.profile_picture}
                              alt="Freelancer Profile"
                              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', position: 'relative', zIndex: 2 }}
                            />
                          ) : (
                            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, #6c63ff, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.25rem', position: 'relative', zIndex: 2 }}>
                              {initialName}
                            </div>
                          )}
                        </div>

                        {f.review_count > 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem', color: '#f7971e' }}>
                            <span>★</span>
                            <strong style={{ color: '#fff' }}>{f.average_rating}</strong>
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>({f.review_count})</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>No reviews</span>
                        )}
                      </div>

                      {/* Bio & Skills details */}
                      <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                              {f.first_name} {f.last_name}
                            </h4>
                            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                              {f.headline || 'Professional Freelancer'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.85rem' }}>
                            <strong style={{ color: '#43e97b', fontSize: '1rem' }}>
                              {f.hourly_rate ? `$${f.hourly_rate}/hr` : 'Rate Negotiable'}
                            </strong>
                            <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                              📍 {f.country || 'Remote'}
                            </span>
                          </div>
                        </div>

                        <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {f.bio || 'This freelancer hasn\'t written a detailed bio yet.'}
                        </p>

                        {/* Skills tag labels */}
                        {skillsTags.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
                            {skillsTags.map(tag => (
                              <span
                                key={tag}
                                style={{
                                  background: 'rgba(255,255,255,0.04)',
                                  border: '1px solid rgba(255,255,255,0.08)',
                                  color: 'rgba(255,255,255,0.6)',
                                  borderRadius: '6px',
                                  padding: '2px 8px',
                                  fontSize: '0.75rem',
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quick Chat Invite Link */}
                      <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                        <button
                          type="button"
                          onClick={() => handleMessageClick(f.email)}
                          className="btn-glow text-xs py-1.5 px-4 rounded-xl"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}
                        >
                          💬 Message Talent
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '16px', padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.1rem' }}>No Freelancers Found</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>Try refining your search queries or clearing the filter inputs.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
