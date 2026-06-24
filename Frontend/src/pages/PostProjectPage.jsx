import { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../api/axios'

const cx = {
  maxWidth: '720px',
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

export default function PostProjectPage() {
  const { user, loading } = useContext(AuthContext)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    category: 'Development',
    description: '',
    projectType: 'fixed',
    budget: '',
    skillsRequired: '',
  })
  
  const [focused, setFocused] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Protect page: redirect to login if not authenticated, or to home if not a client
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login')
      } else if (user.role !== 'client') {
        navigate('/')
      }
    }
  }, [user, loading, navigate])

  if (loading || !user || user.role !== 'client') {
    return (
      <div style={{ minHeight: '100vh', background: '#07070f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <svg style={{ width: 40, height: 40, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>Loading workspace...</span>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  const handleTypeSelect = (type) => {
    setForm({ ...form, projectType: type })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const res = await api.post('projects/create/', {
        client_email: user.email,
        title: form.title,
        category: form.category,
        description: form.description,
        project_type: form.projectType,
        budget: form.budget,
        skills_required: form.skillsRequired,
      })

      setSuccess('Project posted successfully! Redirecting to profile...')
      setTimeout(() => {
        navigate('/profile')
      }, 2000)
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || 'Failed to post project. Please check fields and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const getInputStyle = (name) => ({
    ...inputStyle,
    borderColor: focused[name] ? 'rgba(108,99,255,0.5)' : 'rgba(255,255,255,0.08)',
    boxShadow: focused[name] ? '0 0 0 3px rgba(108,99,255,0.12)' : 'none',
    background: focused[name] ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
  })

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#07070f', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, position: 'relative', overflow: 'hidden', paddingTop: '7.5rem', paddingBottom: '5rem' }}>
        {/* Ambient background designs */}
        <div style={{ position: 'absolute', width: 500, height: 500, top: '-180px', left: '-180px', background: 'rgba(108,99,255,0.1)', borderRadius: '50%', filter: 'blur(90px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, bottom: '-100px', right: '-100px', background: 'rgba(255,101,132,0.06)', borderRadius: '50%', filter: 'blur(90px)', pointerEvents: 'none' }} />

        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

        <div style={cx}>
          {/* Back link */}
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '2rem', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            ← Back to Talent Marketplace
          </Link>

          {/* Page Headers */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
              Post a New <span className="neon-text">Project</span>
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              Let talent know exactly what you need built. Complete details for high quality proposals.
            </p>
          </div>

          {/* Success / Error Banners */}
          {success && (
            <div style={{ background: 'rgba(67,233,123,0.1)', border: '1px solid rgba(67,233,123,0.25)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem', color: '#43e97b', fontSize: '0.9rem' }}>
              {success}
            </div>
          )}
          {error && (
            <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.25)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem', color: '#ff6b6b', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          {/* Glass Card Form */}
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Project Title */}
              <div>
                <label style={labelStyle}>Project Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Build a Responsive Portfolio with Next.js & Tailwind"
                  value={form.title}
                  onChange={handleChange}
                  onFocus={() => setFocused(prev => ({ ...prev, title: true }))}
                  onBlur={() => setFocused(prev => ({ ...prev, title: false }))}
                  style={getInputStyle('title')}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label style={labelStyle}>Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  onFocus={() => setFocused(prev => ({ ...prev, category: true }))}
                  onBlur={() => setFocused(prev => ({ ...prev, category: false }))}
                  style={getInputStyle('category')}
                  required
                >
                  <option style={{ background: '#0f0f23', color: '#fff' }} value="Development">Development & IT</option>
                  <option style={{ background: '#0f0f23', color: '#fff' }} value="Design">Design & Creative</option>
                  <option style={{ background: '#0f0f23', color: '#fff' }} value="AI & Data Science">AI, Data Science & ML</option>
                  <option style={{ background: '#0f0f23', color: '#fff' }} value="Writing & Marketing">Writing & Digital Marketing</option>
                  <option style={{ background: '#0f0f23', color: '#fff' }} value="Other">Other Category</option>
                </select>
              </div>

              {/* Project Description */}
              <div>
                <label style={labelStyle}>Project Description</label>
                <textarea
                  name="description"
                  rows="6"
                  placeholder="Describe your project, objectives, deliverables, and timeline in detail..."
                  value={form.description}
                  onChange={handleChange}
                  onFocus={() => setFocused(prev => ({ ...prev, description: true }))}
                  onBlur={() => setFocused(prev => ({ ...prev, description: false }))}
                  style={{ ...getInputStyle('description'), fontFamily: 'inherit', resize: 'vertical' }}
                  required
                />
              </div>

              {/* Project Type Pills */}
              <div>
                <label style={labelStyle}>Budget Type</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => handleTypeSelect('fixed')}
                    style={{
                      flex: 1,
                      padding: '1rem',
                      background: form.projectType === 'fixed' ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.02)',
                      border: form.projectType === 'fixed' ? '1px solid #6c63ff' : '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '12px',
                      color: form.projectType === 'fixed' ? '#fff' : 'rgba(255,255,255,0.6)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      transition: 'all 0.2s',
                      textAlign: 'center',
                    }}
                    onMouseEnter={e => { if (form.projectType !== 'fixed') e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                    onMouseLeave={e => { if (form.projectType !== 'fixed') e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
                  >
                    <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>🎯</div>
                    Fixed Price Project
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeSelect('hourly')}
                    style={{
                      flex: 1,
                      padding: '1rem',
                      background: form.projectType === 'hourly' ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.02)',
                      border: form.projectType === 'hourly' ? '1px solid #6c63ff' : '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '12px',
                      color: form.projectType === 'hourly' ? '#fff' : 'rgba(255,255,255,0.6)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      transition: 'all 0.2s',
                      textAlign: 'center',
                    }}
                    onMouseEnter={e => { if (form.projectType !== 'hourly') e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                    onMouseLeave={e => { if (form.projectType !== 'hourly') e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
                  >
                    <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>⏱️</div>
                    Hourly Contract
                  </button>
                </div>
              </div>

              {/* Budget Value */}
              <div>
                <label style={labelStyle}>
                  {form.projectType === 'fixed' ? 'Budget Amount ($ USD)' : 'Hourly Rate ($ USD / hour)'}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontWeight: 600, fontSize: '0.95rem', pointerEvents: 'none' }}>
                    $
                  </span>
                  <input
                    type="text"
                    name="budget"
                    placeholder={form.projectType === 'fixed' ? '500' : '45'}
                    value={form.budget}
                    onChange={handleChange}
                    onFocus={() => setFocused(prev => ({ ...prev, budget: true }))}
                    onBlur={() => setFocused(prev => ({ ...prev, budget: false }))}
                    style={{ ...getInputStyle('budget'), paddingLeft: '2.25rem' }}
                    required
                  />
                </div>
              </div>

              {/* Skills Required */}
              <div>
                <label style={labelStyle}>Skills & Expertise (comma separated)</label>
                <input
                  type="text"
                  name="skillsRequired"
                  placeholder="e.g. React, Node.js, Stripe, WebSocket"
                  value={form.skillsRequired}
                  onChange={handleChange}
                  onFocus={() => setFocused(prev => ({ ...prev, skillsRequired: true }))}
                  onBlur={() => setFocused(prev => ({ ...prev, skillsRequired: false }))}
                  style={getInputStyle('skillsRequired')}
                />
              </div>

              {/* Form Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
                <Link to="/profile" className="btn-outline text-sm px-6 py-2.5 rounded-xl" style={{ textDecoration: 'none' }}>
                  Cancel
                </Link>
                <button type="submit" disabled={submitting} className="btn-glow text-sm px-8 py-2.5 rounded-xl" style={{ minWidth: 140, justifyContent: 'center' }}>
                  {submitting ? (
                    <>
                      <svg style={{ width: 14, height: 14, animation: 'spin 1s linear infinite', marginRight: 6 }} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                        <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Posting...
                    </>
                  ) : (
                    '🚀 Post Project'
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </main>

      <Footer />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
