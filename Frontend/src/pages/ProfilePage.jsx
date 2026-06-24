import { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../api/axios'

const cx = {
  maxWidth: '1080px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 'clamp(1rem, 4vw, 1.5rem)',
  paddingRight: 'clamp(1rem, 4vw, 1.5rem)',
  width: '100%',
  position: 'relative',
  zIndex: 10,
}

export default function ProfilePage() {
  const { user, loginUser, logoutUser, loading } = useContext(AuthContext)
  const navigate = useNavigate()

  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(false)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    country: '',
    headline: '',
    bio: '',
    skills: '',
    hourlyRate: '',
    profilePicture: '',
  })
  const [hoverAvatar, setHoverAvatar] = useState(false)

  // Synchronize form state when user changes
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        country: user.country || '',
        headline: user.headline || '',
        bio: user.bio || '',
        skills: user.skills || '',
        hourlyRate: user.hourly_rate || '',
        profilePicture: user.profile_picture || '',
      })
    }
  }, [user])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  // Fetch client projects if role is client
  useEffect(() => {
    if (user && user.role === 'client') {
      const fetchProjects = async () => {
        setLoadingProjects(true)
        try {
          const res = await api.get(`projects/client/?email=${user.email}`)
          setProjects(res.data)
        } catch (err) {
          console.error("Error fetching projects:", err)
        } finally {
          setLoadingProjects(false)
        }
      }
      fetchProjects()
    }
  }, [user])

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', background: '#07070f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <svg style={{ width: 40, height: 40, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>Checking session...</span>
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 1500000) {
        setError('Profile picture must be under 1.5MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, profilePicture: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const res = await api.post('profile/update/', {
        email: user.email,
        first_name: form.firstName,
        last_name: form.lastName,
        country: form.country,
        headline: form.headline,
        bio: form.bio,
        skills: form.skills,
        hourly_rate: form.hourlyRate,
        profile_picture: form.profilePicture,
      })

      loginUser(res.data.user) // Save updated user to local state + context
      setSuccess('Profile updated successfully! 🎉')
      setEditMode(false)
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || 'Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setForm({
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      country: user.country || '',
      headline: user.headline || '',
      bio: user.bio || '',
      skills: user.skills || '',
      hourlyRate: user.hourly_rate || '',
      profilePicture: user.profile_picture || '',
    })
    setEditMode(false)
    setError('')
    setSuccess('')
  }

  const skillsList = form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : []
  const initialName = `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`.toUpperCase()

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#07070f', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, position: 'relative', overflow: 'hidden', paddingTop: '7.5rem', paddingBottom: '5rem' }}>
        {/* Ambient background designs */}
        <div style={{ position: 'absolute', width: 500, height: 500, top: '-180px', left: '-180px', background: 'rgba(108,99,255,0.12)', borderRadius: '50%', filter: 'blur(90px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, bottom: '-100px', right: '-100px', background: 'rgba(255,101,132,0.08)', borderRadius: '50%', filter: 'blur(90px)', pointerEvents: 'none' }} />

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

          {/* Success / Error Banners */}
          {success && (
            <div style={{ background: 'rgba(67,233,123,0.1)', border: '1px solid rgba(67,233,123,0.25)', borderRadius: 12, padding: '0.875rem 1.25rem', marginBottom: '1.5rem', color: '#43e97b', fontSize: '0.9rem' }}>
              {success}
            </div>
          )}
          {error && (
            <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.25)', borderRadius: 12, padding: '0.875rem 1.25rem', marginBottom: '1.5rem', color: '#ff6b6b', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          {/* Profile Card Layout */}
          <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '2.5rem' }}>
            
            {/* Left side card - user summary */}
            <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.06)', paddingRight: 'clamp(0px, 2vw, 2.5rem)', boxSizing: 'border-box' }} className="profile-sidebar">
              
              {/* Profile Avatar */}
              <div 
                style={{ 
                  position: 'relative', 
                  width: 96, 
                  height: 96, 
                  marginBottom: '1.5rem', 
                  cursor: editMode ? 'pointer' : 'default',
                  borderRadius: '50%'
                }}
                onClick={() => { if (editMode) document.getElementById('avatar-input').click() }}
                onMouseEnter={() => { if (editMode) setHoverAvatar(true) }}
                onMouseLeave={() => { if (editMode) setHoverAvatar(false) }}
              >
                <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', background: 'linear-gradient(135deg, #6c63ff, #ff6584)', opacity: 0.4, filter: 'blur(4px)' }} />
                
                {editMode ? (
                  form.profilePicture ? (
                    <img
                      src={form.profilePicture}
                      alt="Profile Preview"
                      style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block', zIndex: 5 }}
                    />
                  ) : (
                    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, #6c63ff, #a855f7)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem', fontWeight: 'bold', zIndex: 5 }}>
                      {initialName}
                    </div>
                  )
                ) : (
                  user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt="Profile"
                      style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block', zIndex: 5 }}
                    />
                  ) : (
                    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, #6c63ff, #a855f7)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem', fontWeight: 'bold', zIndex: 5 }}>
                      {initialName}
                    </div>
                  )
                )}

                {editMode && hoverAvatar && (
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '0.75rem', fontWeight: 600, zIndex: 10,
                  }}>
                    Change Photo
                  </div>
                )}
              </div>
              {editMode && (
                <input
                  type="file"
                  id="avatar-input"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              )}

              {/* User Identity */}
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem', fontFamily: "'Space Grotesk', sans-serif" }}>
                {user.first_name} {user.last_name}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>{user.email}</p>

              {/* Role badge */}
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{
                  background: user.role === 'client' ? 'rgba(247,151,30,0.15)' : 'rgba(108,99,255,0.15)',
                  color: user.role === 'client' ? '#f7971e' : '#a78bfa',
                  border: user.role === 'client' ? '1px solid rgba(247,151,30,0.25)' : '1px solid rgba(108,99,255,0.25)',
                  borderRadius: 999,
                  padding: '4px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {user.role === 'client' ? '🏢 Client' : '💻 Freelancer'}
                </span>
              </div>

              {/* Rate & Location stats card */}
              <div style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>Country</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.country || 'Not Specified'}</span>
                </div>
                {user.role === 'freelancer' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>Hourly Rate</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#43e97b' }}>
                      {user.hourly_rate ? `${user.hourly_rate}/hr` : 'Not Set'}
                    </span>
                  </div>
                )}
              </div>

              {/* Logout button */}
              <button onClick={() => { logoutUser(); navigate('/') }} className="btn-outline text-sm py-2.5 px-6" style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(255,68,68,0.25)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,68,68,0.5)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,68,68,0.25)'}
              >
                Log Out
              </button>

            </div>

            {/* Right side card - view/edit form info */}
            <div style={{ flex: '2 1 480px', display: 'flex', flexDirection: 'column' }}>
              
              {!editMode ? (
                /* ───── Profile View Mode ───── */
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 0.5rem', fontFamily: "'Space Grotesk', sans-serif" }}>
                        {user.headline || (user.role === 'client' ? 'Managing Projects' : 'Professional Freelancer')}
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                        Active User Profile overview
                      </p>
                    </div>
                    <button className="btn-glow text-sm px-6 py-2.5 rounded-xl" onClick={() => setEditMode(true)}>
                      ✍️ Edit Profile
                    </button>
                  </div>

                  {/* Biography section */}
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Biography</h4>
                    <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {user.bio || 'This user has not written a bio yet. Click Edit Profile to tell people about yourself!'}
                    </p>
                  </div>

                  {/* Skills tags section */}
                  {user.role === 'freelancer' && (
                    <div style={{ marginTop: 'auto' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Skills & Expertise</h4>
                      {skillsList.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {skillsList.map((tag) => (
                            <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60">
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)', italic: true }}>No skills listed yet.</p>
                      )}
                    </div>
                  )}

                  {/* Client's Posted Projects section */}
                  {user.role === 'client' && (
                    <div style={{ marginTop: '1rem' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                        My Job Postings
                      </h4>
                      {loadingProjects ? (
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Loading postings...</div>
                      ) : projects.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {projects.map((project) => (
                            <div
                              key={project.id}
                              style={{
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '12px',
                                padding: '1.25rem',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                                e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                                <h5 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                                  {project.title}
                                </h5>
                                <span style={{
                                  background: 'rgba(67,233,123,0.1)',
                                  color: '#43e97b',
                                  border: '1px solid rgba(67,233,123,0.25)',
                                  borderRadius: '999px',
                                  padding: '2px 10px',
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  textTransform: 'uppercase'
                                }}>
                                  {project.status}
                                </span>
                              </div>
                              <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                                {project.description.length > 150 ? `${project.description.substring(0, 150)}...` : project.description}
                              </p>
                              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                  <span>📁 <strong style={{ color: '#fff' }}>{project.category}</strong></span>
                                  <span>Budget: <strong style={{ color: '#43e97b' }}>${project.budget}{project.project_type === 'hourly' ? '/hr' : ''}</strong></span>
                                </div>
                                {project.skills_required && (
                                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                                    {project.skills_required.split(',').slice(0, 3).map(s => s.trim()).filter(Boolean).map(tag => (
                                      <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', padding: '2px 6px', fontSize: '0.7rem' }}>
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
                          <span style={{ fontSize: '1.5rem' }}>💼</span>
                          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', margin: '0.5rem 0 1rem 0' }}>
                            You haven't posted any jobs yet.
                          </p>
                          <Link to="/post-project" className="btn-glow text-xs py-2 px-4 rounded-lg" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                            Post a Project
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              ) : (
                /* ───── Profile Edit Mode ───── */
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.5rem', fontFamily: "'Space Grotesk', sans-serif" }}>Edit Profile Info</h3>

                  {/* Dual columns for name fields */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '0.45rem' }}>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '0.45rem' }}>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Dual columns for location & hourly rate */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '0.45rem' }}>Country</label>
                      <input
                        type="text"
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    {user.role === 'freelancer' && (
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '0.45rem' }}>Hourly Rate (e.g. $85)</label>
                        <input
                          type="text"
                          name="hourlyRate"
                          placeholder="$85"
                          value={form.hourlyRate}
                          onChange={handleChange}
                          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Headline */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '0.45rem' }}>Professional Title / Headline</label>
                    <input
                      type="text"
                      name="headline"
                      placeholder="e.g. Senior Frontend Architect"
                      value={form.headline}
                      onChange={handleChange}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '0.45rem' }}>Biography</label>
                    <textarea
                      name="bio"
                      rows="4"
                      placeholder="Tell us about yourself..."
                      value={form.bio}
                      onChange={handleChange}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }}
                    />
                  </div>

                  {/* Skills input */}
                  {user.role === 'freelancer' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '0.45rem' }}>Skills (comma-separated list)</label>
                      <input
                        type="text"
                        name="skills"
                        placeholder="React, Node.js, Python, Figma"
                        value={form.skills}
                        onChange={handleChange}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  )}

                  {/* Form Action Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                    <button type="button" onClick={handleCancel} className="btn-outline text-sm px-6 py-2.5 rounded-xl">
                      Cancel
                    </button>
                    <button type="submit" disabled={saving} className="btn-glow text-sm px-7 py-2.5 rounded-xl" style={{ minWidth: 100, justifyContent: 'center' }}>
                      {saving ? (
                        <>
                          <svg style={{ width: 14, height: 14, animation: 'spin 1s linear infinite', marginRight: 6 }} viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                            <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>

          </div>

        </div>
      </main>

      <Footer />
      <style>{`
        @media (max-width: 768px) {
          .profile-sidebar {
            border-right: none !important;
            padding-right: 0 !important;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            padding-bottom: 2rem;
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
