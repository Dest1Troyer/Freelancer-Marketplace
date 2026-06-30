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
  const [expandedProposalsProjectId, setExpandedProposalsProjectId] = useState(null)
  const [activeProposals, setActiveProposals] = useState([])
  const [loadingProposals, setLoadingProposals] = useState(false)

  // Tab & Freelancer specific states
  const [activeTab, setActiveTab] = useState('overview')
  const [freelancerProposals, setFreelancerProposals] = useState([])
  const [loadingFreelancerProposals, setLoadingFreelancerProposals] = useState(false)
  const [freelancerProjects, setFreelancerProjects] = useState([])
  const [loadingFreelancerProjects, setLoadingFreelancerProjects] = useState(false)

  // Review & Rating specific states
  const [reviews, setReviews] = useState([])
  const [reviewsStats, setReviewsStats] = useState({
    average_rating: 0.0,
    count: 0,
    breakdown: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }
  })
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewTarget, setReviewTarget] = useState(null)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  // Payments specific states
  const [transactions, setTransactions] = useState([])
  const [loadingTransactions, setLoadingTransactions] = useState(false)

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

  // Fetch freelancer proposals and projects if role is freelancer
  useEffect(() => {
    if (user && user.role === 'freelancer') {
      const fetchFreelancerData = async () => {
        setLoadingFreelancerProposals(true)
        setLoadingFreelancerProjects(true)
        try {
          const propRes = await api.get(`proposals/freelancer/?email=${user.email}`)
          setFreelancerProposals(propRes.data)
        } catch (err) {
          console.error("Error fetching freelancer proposals:", err)
        } finally {
          setLoadingFreelancerProposals(false)
        }
        
        try {
          const projRes = await api.get(`projects/freelancer-active/?email=${user.email}`)
          setFreelancerProjects(projRes.data)
        } catch (err) {
          console.error("Error fetching freelancer projects:", err)
        } finally {
          setLoadingFreelancerProjects(false)
        }
      }
      fetchFreelancerData()
    }
  }, [user])

  // Fetch reviews for active user
  useEffect(() => {
    if (user) {
      const fetchReviews = async () => {
        setLoadingReviews(true)
        try {
          const res = await api.get(`reviews/user/?email=${user.email}`)
          setReviews(res.data.reviews)
          setReviewsStats(res.data.stats)
        } catch (err) {
          console.error("Error fetching user reviews:", err)
        } finally {
          setLoadingReviews(false)
        }
      }
      fetchReviews()
    }
  }, [user])

  const openLeaveReview = (projectId, revieweeEmail, role) => {
    setReviewTarget({
      project_id: projectId,
      reviewee_email: revieweeEmail,
      reviewer_role: role
    })
    setReviewForm({ rating: 5, comment: '' })
    setReviewModalOpen(true)
    setError('')
    setSuccess('')
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!reviewTarget || submittingReview) return
    setSubmittingReview(true)
    setError('')
    setSuccess('')
    try {
      await api.post('reviews/submit/', {
        project_id: reviewTarget.project_id,
        reviewer_email: user.email,
        reviewee_email: reviewTarget.reviewee_email,
        reviewer_role: reviewTarget.reviewer_role,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      })
      setSuccess("Thank you for your feedback! Review submitted successfully. 🎉")
      setReviewModalOpen(false)
      setReviewTarget(null)
      
      // Re-fetch reviews to update metrics
      const res = await api.get(`reviews/user/?email=${user.email}`)
      setReviews(res.data.reviews)
      setReviewsStats(res.data.stats)
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || 'Failed to submit review. Note: You can only review once per project.')
    } finally {
      setSubmittingReview(false)
    }
  }

  // Fetch transactions for active user
  useEffect(() => {
    if (user) {
      const fetchTransactions = async () => {
        setLoadingTransactions(true)
        try {
          const res = await api.get(`payments/user/?email=${user.email}`)
          setTransactions(res.data)
        } catch (err) {
          console.error("Error fetching user transactions:", err)
        } finally {
          setLoadingTransactions(false)
        }
      }
      fetchTransactions()
    }
  }, [user])

  const handleReleaseEscrow = async (projectId) => {
    if (!window.confirm("Are you sure you want to release the escrow payment for this project to the freelancer? This action cannot be undone.")) {
      return
    }
    setError('')
    setSuccess('')
    try {
      await api.post('payments/release/', {
        project_id: projectId,
        client_email: user.email
      })
      setSuccess("Escrow payment released successfully! 💸")
      
      // Update local transactions list
      const txRes = await api.get(`payments/user/?email=${user.email}`)
      setTransactions(txRes.data)
      
      // Re-fetch project list to update UI indicator
      if (user.role === 'client') {
        const projRes = await api.get(`projects/client/?email=${user.email}`)
        setProjects(projRes.data)
      }
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || 'Failed to release escrow payment.')
    }
  }

  const getProjectEscrow = (projectId) => {
    return transactions.find(t => t.project_id === projectId)
  }

  const handleAcceptProposal = async (proposalId, projectId) => {
    if (!window.confirm("Are you sure you want to hire this freelancer? This will mark your project as in-progress and reject all other proposals.")) {
      return
    }
    setError('')
    setSuccess('')
    try {
      const res = await api.post('proposals/accept/', {
        proposal_id: proposalId,
        client_email: user.email
      })
      setSuccess("Freelancer hired successfully! Project is now in-progress. 🎉")
      
      // Update local proposals list
      setActiveProposals(prev => prev.map(p => {
        if (p.id === proposalId) return { ...p, status: 'accepted' }
        return { ...p, status: 'rejected' }
      }))
      
      // Update local projects list to change status to in-progress
      setProjects(prev => prev.map(p => {
        if (p.id === projectId) return { ...p, status: 'in-progress', hired_freelancer_email: res.data.proposal.freelancer_email }
        return p
      }))
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || 'Failed to hire freelancer. Please try again.')
    }
  }

  const handleRejectProposal = async (proposalId) => {
    if (!window.confirm("Are you sure you want to reject this proposal?")) {
      return
    }
    setError('')
    setSuccess('')
    try {
      await api.post('proposals/reject/', {
        proposal_id: proposalId,
        client_email: user.email
      })
      setSuccess("Proposal rejected successfully.")
      
      // Update local proposals list
      setActiveProposals(prev => prev.map(p => {
        if (p.id === proposalId) return { ...p, status: 'rejected' }
        return p
      }))
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || 'Failed to reject proposal.')
    }
  }

  const handleCompleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to mark this project as completed?")) {
      return
    }
    setError('')
    setSuccess('')
    try {
      await api.post('projects/complete/', {
        project_id: projectId,
        client_email: user.email
      })
      setSuccess("Project marked as completed! Good job. 🏆")
      
      // Update local projects list
      setProjects(prev => prev.map(p => {
        if (p.id === projectId) return { ...p, status: 'completed' }
        return p
      }))
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || 'Failed to mark project as completed.')
    }
  }

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

  const handleToggleProposals = async (projectId) => {
    if (expandedProposalsProjectId === projectId) {
      setExpandedProposalsProjectId(null)
      setActiveProposals([])
      return
    }

    setExpandedProposalsProjectId(projectId)
    setLoadingProposals(true)
    setActiveProposals([])

    try {
      const res = await api.get(`proposals/project/?project_id=${projectId}`)
      setActiveProposals(res.data)
    } catch (err) {
      console.error("Error loading proposals:", err)
    } finally {
      setLoadingProposals(false)
    }
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
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem' }}>{user.email}</p>

              {/* Ratings Summary */}
              {reviewsStats.count > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '999px', padding: '4px 12px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#f7971e', fontSize: '1rem' }}>★</span>
                  <strong style={{ color: '#fff' }}>{reviewsStats.average_rating}</strong>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>({reviewsStats.count} {reviewsStats.count === 1 ? 'review' : 'reviews'})</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '999px', padding: '4px 12px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
                  <span>No reviews yet</span>
                </div>
              )}

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
                  
                  {/* Headline & Edit Profile Button */}
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

                  {/* Tabs Navigation */}
                  <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem', marginBottom: '1.75rem' }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab('overview')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'overview' ? '2px solid #6c63ff' : '2px solid transparent',
                        color: activeTab === 'overview' ? '#fff' : 'rgba(255,255,255,0.4)',
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        marginBottom: '-0.75rem'
                      }}
                    >
                      Overview
                    </button>
                    {user.role === 'client' && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('postings')}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          borderBottom: activeTab === 'postings' ? '2px solid #6c63ff' : '2px solid transparent',
                          color: activeTab === 'postings' ? '#fff' : 'rgba(255,255,255,0.4)',
                          padding: '0.5rem 1rem',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          marginBottom: '-0.75rem'
                        }}
                      >
                        My Job Postings
                      </button>
                    )}
                    {user.role === 'freelancer' && (
                      <>
                        <button
                          type="button"
                          onClick={() => setActiveTab('proposals')}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === 'proposals' ? '2px solid #6c63ff' : '2px solid transparent',
                            color: activeTab === 'proposals' ? '#fff' : 'rgba(255,255,255,0.4)',
                            padding: '0.5rem 1rem',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            marginBottom: '-0.75rem'
                          }}
                        >
                          My Bids
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('contracts')}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === 'contracts' ? '2px solid #6c63ff' : '2px solid transparent',
                            color: activeTab === 'contracts' ? '#fff' : 'rgba(255,255,255,0.4)',
                            padding: '0.5rem 1rem',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            marginBottom: '-0.75rem'
                          }}
                        >
                          Active Contracts
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => setActiveTab('reviews')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'reviews' ? '2px solid #6c63ff' : '2px solid transparent',
                        color: activeTab === 'reviews' ? '#fff' : 'rgba(255,255,255,0.4)',
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        marginBottom: '-0.75rem'
                      }}
                    >
                      Reviews ({reviewsStats.count})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('payments')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'payments' ? '2px solid #6c63ff' : '2px solid transparent',
                        color: activeTab === 'payments' ? '#fff' : 'rgba(255,255,255,0.4)',
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        marginBottom: '-0.75rem'
                      }}
                    >
                      Payments ({transactions.length})
                    </button>
                  </div>

                  {/* Tab content: Overview */}
                  {activeTab === 'overview' && (
                    <>
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
                            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>No skills listed yet.</p>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* Tab content: Client Job Postings */}
                  {activeTab === 'postings' && user.role === 'client' && (
                    <div style={{ marginTop: '0.5rem' }}>
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
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                  {getProjectEscrow(project.id) && (
                                    <span style={{
                                      background: getProjectEscrow(project.id).status === 'released' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                                      color: getProjectEscrow(project.id).status === 'released' ? '#10b981' : '#f59e0b',
                                      border: getProjectEscrow(project.id).status === 'released' ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(245,158,11,0.25)',
                                      borderRadius: '999px',
                                      padding: '2px 10px',
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      textTransform: 'uppercase'
                                    }}>
                                      {getProjectEscrow(project.id).status === 'released' ? '💸 Escrow Released' : '🔒 Escrow Funded'}
                                    </span>
                                  )}
                                  <span style={{
                                    background: project.status === 'completed' ? 'rgba(59,130,246,0.15)' :
                                                project.status === 'in-progress' ? 'rgba(168,85,247,0.15)' : 'rgba(67,233,123,0.15)',
                                    color: project.status === 'completed' ? '#3b82f6' :
                                           project.status === 'in-progress' ? '#c084fc' : '#43e97b',
                                    border: project.status === 'completed' ? '1px solid rgba(59,130,246,0.25)' :
                                            project.status === 'in-progress' ? '1px solid rgba(168,85,247,0.25)' : '1px solid rgba(67,233,123,0.25)',
                                    borderRadius: '999px',
                                    padding: '2px 10px',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase'
                                  }}>
                                    {project.status}
                                  </span>
                                </div>
                              </div>
                              <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                                {project.description}
                              </p>
                              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                  <span>📁 <strong style={{ color: '#fff' }}>{project.category}</strong></span>
                                  <span>Budget: <strong style={{ color: '#43e97b' }}>${project.budget}{project.project_type === 'hourly' ? '/hr' : ''}</strong></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  {project.status === 'in-progress' && (
                                    <button
                                      type="button"
                                      onClick={() => handleCompleteProject(project.id)}
                                      className="btn-glow text-xs py-1.5 px-3 rounded-lg"
                                      style={{
                                        fontSize: '0.75rem',
                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                        border: 'none',
                                        color: '#fff',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      Mark Completed 🏆
                                    </button>
                                  )}
                                  {getProjectEscrow(project.id) && getProjectEscrow(project.id).status === 'funded' && (
                                    <button
                                      type="button"
                                      onClick={() => handleReleaseEscrow(project.id)}
                                      className="btn-glow text-xs py-1.5 px-3 rounded-lg"
                                      style={{
                                        fontSize: '0.75rem',
                                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                        border: 'none',
                                        color: '#fff',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      Release Escrow 💸
                                    </button>
                                  )}
                                  {project.status === 'completed' && project.hired_freelancer_email && (
                                    <button
                                      type="button"
                                      onClick={() => openLeaveReview(project.id, project.hired_freelancer_email, 'client')}
                                      className="btn-glow text-xs py-1.5 px-3 rounded-lg"
                                      style={{
                                        fontSize: '0.75rem',
                                        background: 'linear-gradient(135deg, #f7971e, #ffd200)',
                                        border: 'none',
                                        color: '#000',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      ⭐ Review Freelancer
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleProposals(project.id)}
                                    className="btn-glow text-xs py-1.5 px-3 rounded-lg"
                                    style={{
                                      fontSize: '0.75rem',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {expandedProposalsProjectId === project.id ? 'Hide Proposals' : 'View Proposals'}
                                  </button>
                                </div>
                              </div>

                              {/* Proposals list block */}
                              {expandedProposalsProjectId === project.id && (
                                <div style={{
                                  marginTop: '1.5rem',
                                  borderTop: '1px solid rgba(255,255,255,0.06)',
                                  paddingTop: '1rem',
                                }}>
                                  <h6 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                                    Received Proposals
                                  </h6>
                                  {loadingProposals ? (
                                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Loading proposals...</div>
                                  ) : activeProposals.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                      {activeProposals.map((proposal) => {
                                        const pStatus = proposal.status || 'pending'
                                        const statusColor = pStatus === 'accepted' ? '#43e97b' :
                                                            pStatus === 'rejected' ? '#ff6b6b' : '#f7971e'
                                        const statusBg = pStatus === 'accepted' ? 'rgba(67,233,123,0.1)' :
                                                          pStatus === 'rejected' ? 'rgba(255,107,107,0.1)' : 'rgba(247,151,30,0.1)'

                                        return (
                                          <div
                                            key={proposal.id}
                                            style={{
                                              background: 'rgba(255,255,255,0.02)',
                                              border: '1px solid rgba(255,255,255,0.04)',
                                              borderRadius: '8px',
                                              padding: '1rem',
                                            }}
                                          >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                              <div>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                                                  {proposal.freelancer_name || 'Freelancer'}
                                                </span>
                                                <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                                                  {proposal.freelancer_email}
                                                </span>
                                              </div>
                                              
                                              {/* Actions & Status badges */}
                                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                {project.status === 'open' && pStatus === 'pending' ? (
                                                  <>
                                                    <button
                                                      type="button"
                                                      onClick={() => handleAcceptProposal(proposal.id, project.id)}
                                                      className="btn-glow text-xs py-1.5 px-3 rounded-lg"
                                                      style={{
                                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                                        border: 'none',
                                                        color: '#fff',
                                                        cursor: 'pointer',
                                                      }}
                                                    >
                                                      Hire 🤝
                                                    </button>
                                                    <button
                                                      type="button"
                                                      onClick={() => handleRejectProposal(proposal.id)}
                                                      className="btn-outline text-xs py-1.5 px-3 rounded-lg"
                                                      style={{
                                                        borderColor: 'rgba(255,68,68,0.25)',
                                                        color: '#ff6b6b',
                                                        cursor: 'pointer',
                                                      }}
                                                    >
                                                      Reject
                                                    </button>
                                                  </>
                                                ) : (
                                                  <span style={{
                                                    background: statusBg,
                                                    color: statusColor,
                                                    border: `1px solid ${statusColor}40`,
                                                    borderRadius: '999px',
                                                    padding: '2px 10px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 600,
                                                    textTransform: 'uppercase'
                                                  }}>
                                                    {pStatus === 'accepted' ? 'Hired' : pStatus}
                                                  </span>
                                                )}
                                                
                                                <button
                                                  type="button"
                                                  onClick={() => navigate(`/chat?email=${proposal.freelancer_email}`)}
                                                  className="btn-outline text-xs py-1.5 px-3 rounded-lg"
                                                  style={{ fontSize: '0.75rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff' }}
                                                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                >
                                                  💬 Message
                                                </button>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#43e97b' }}>
                                                  Bid: ${proposal.bid_amount}
                                                </span>
                                              </div>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>
                                              {proposal.cover_letter}
                                            </p>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  ) : (
                                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                                      No proposals received yet for this project.
                                    </div>
                                  )}
                                </div>
                              )}
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

                  {/* Tab content: Freelancer Bids & Proposals */}
                  {activeTab === 'proposals' && user.role === 'freelancer' && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                        My Bids & Submitted Proposals
                      </h4>
                      {loadingFreelancerProposals ? (
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Loading bids...</div>
                      ) : freelancerProposals.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {freelancerProposals.map((proposal) => {
                            const pStatus = proposal.status || 'pending'
                            const statusColor = pStatus === 'accepted' ? '#43e97b' :
                                                pStatus === 'rejected' ? '#ff6b6b' : '#f7971e'
                            const statusBg = pStatus === 'accepted' ? 'rgba(67,233,123,0.1)' :
                                              pStatus === 'rejected' ? 'rgba(255,107,107,0.1)' : 'rgba(247,151,30,0.1)'
                            
                            return (
                              <div
                                key={proposal.id}
                                style={{
                                  background: 'rgba(255,255,255,0.02)',
                                  border: '1px solid rgba(255,255,255,0.05)',
                                  borderRadius: '12px',
                                  padding: '1.25rem',
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                                  <h5 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                                    {proposal.project_title}
                                  </h5>
                                  <span style={{
                                    background: statusBg,
                                    color: statusColor,
                                    border: `1px solid ${statusColor}40`,
                                    borderRadius: '999px',
                                    padding: '2px 10px',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase'
                                  }}>
                                    {pStatus === 'accepted' ? 'Hired' : pStatus}
                                  </span>
                                </div>
                                <p style={{ margin: '0 0 1rem 0', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.45 }}>
                                  <strong style={{ color: '#fff' }}>Cover Letter:</strong> {proposal.cover_letter}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                                  <span>My Bid: <strong style={{ color: '#43e97b' }}>${proposal.bid_amount}</strong></span>
                                  {proposal.client_email && (
                                    <button
                                      type="button"
                                      onClick={() => navigate(`/chat?email=${proposal.client_email}`)}
                                      className="btn-outline text-xs py-1 px-3 rounded-lg"
                                      style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', cursor: 'pointer' }}
                                    >
                                      💬 Chat with Client
                                    </button>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
                          <span style={{ fontSize: '1.5rem' }}>📄</span>
                          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', margin: '0.5rem 0 1rem 0' }}>
                            You haven't submitted any proposals yet.
                          </p>
                          <Link to="/find-work" className="btn-glow text-xs py-2 px-4 rounded-lg" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                            Browse Open Jobs
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab content: Freelancer Active Contracts */}
                  {activeTab === 'contracts' && user.role === 'freelancer' && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                        My Active Projects & Contracts
                      </h4>
                      {loadingFreelancerProjects ? (
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Loading contracts...</div>
                      ) : freelancerProjects.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {freelancerProjects.map((project) => (
                            <div
                              key={project.id}
                              style={{
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '12px',
                                padding: '1.25rem',
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                                <h5 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                                  {project.title}
                                </h5>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                  {getProjectEscrow(project.id) && (
                                    <span style={{
                                      background: getProjectEscrow(project.id).status === 'released' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                                      color: getProjectEscrow(project.id).status === 'released' ? '#10b981' : '#f59e0b',
                                      border: getProjectEscrow(project.id).status === 'released' ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(245,158,11,0.25)',
                                      borderRadius: '999px',
                                      padding: '2px 10px',
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      textTransform: 'uppercase'
                                    }}>
                                      {getProjectEscrow(project.id).status === 'released' ? '💸 Escrow Released' : '🔒 Escrow Funded'}
                                    </span>
                                  )}
                                  <span style={{
                                    background: project.status === 'completed' ? 'rgba(59,130,246,0.15)' : 'rgba(168,85,247,0.15)',
                                    color: project.status === 'completed' ? '#3b82f6' : '#c084fc',
                                    border: project.status === 'completed' ? '1px solid rgba(59,130,246,0.25)' : '1px solid rgba(168,85,247,0.25)',
                                    borderRadius: '999px',
                                    padding: '2px 10px',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase'
                                  }}>
                                    {project.status === 'completed' ? 'Completed' : 'Hired / Active'}
                                  </span>
                                </div>
                              </div>
                              <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                                {project.description}
                              </p>
                              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                  <span>📁 <strong style={{ color: '#fff' }}>{project.category}</strong></span>
                                  <span>Contract Budget: <strong style={{ color: '#43e97b' }}>${project.budget}</strong></span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  {project.status === 'completed' && (
                                    <button
                                      type="button"
                                      onClick={() => openLeaveReview(project.id, project.client_email, 'freelancer')}
                                      className="btn-glow text-xs py-1.5 px-3 rounded-lg"
                                      style={{
                                        fontSize: '0.75rem',
                                        background: 'linear-gradient(135deg, #f7971e, #ffd200)',
                                        border: 'none',
                                        color: '#000',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      ⭐ Review Client
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => navigate(`/chat?email=${project.client_email}`)}
                                    className="btn-glow text-xs py-1.5 px-3 rounded-lg"
                                    style={{ fontSize: '0.75rem', cursor: 'pointer' }}
                                  >
                                    💬 Message Client
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
                          <span style={{ fontSize: '1.5rem' }}>🤝</span>
                          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', margin: '0.5rem 0 1rem 0' }}>
                            No active contracts yet. Submit bids to start working!
                          </p>
                          <Link to="/find-work" className="btn-glow text-xs py-2 px-4 rounded-lg" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                            Browse Open Jobs
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab content: Reviews & Ratings */}
                  {activeTab === 'reviews' && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                        Client & Freelancer Feedback
                      </h4>

                      {/* Ratings Breakdown Summary Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '1.5rem',
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        alignItems: 'center'
                      }}>
                        {/* Overall Big Number Score */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.06)', paddingRight: '1rem' }}>
                          <span style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                            {reviewsStats.average_rating}
                          </span>
                          <div style={{ display: 'flex', gap: '0.1rem', margin: '0.5rem 0' }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} style={{ color: i < Math.round(reviewsStats.average_rating) ? '#f7971e' : 'rgba(255,255,255,0.1)', fontSize: '1.25rem' }}>★</span>
                            ))}
                          </div>
                          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
                            Based on {reviewsStats.count} {reviewsStats.count === 1 ? 'rating' : 'ratings'}
                          </span>
                        </div>

                        {/* Breakdown Progress Bars */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {['5', '4', '3', '2', '1'].map((stars) => {
                            const count = reviewsStats.breakdown[stars] || 0
                            const percentage = reviewsStats.count > 0 ? (count / reviewsStats.count) * 100 : 0
                            return (
                              <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                                <span style={{ width: '45px', color: 'rgba(255,255,255,0.5)', textAlign: 'right' }}>{stars} Star</span>
                                <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '999px', overflow: 'hidden' }}>
                                  <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, #6c63ff, #ff6584)', borderRadius: '999px' }} />
                                </div>
                                <span style={{ width: '25px', color: 'rgba(255,255,255,0.4)', textAlign: 'left' }}>{count}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Individual Reviews Listing */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {loadingReviews ? (
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Loading feedback list...</div>
                        ) : reviews.length > 0 ? (
                          reviews.map((rev) => (
                            <div key={rev.id} style={{
                              background: 'rgba(255,255,255,0.01)',
                              border: '1px solid rgba(255,255,255,0.04)',
                              borderRadius: '12px',
                              padding: '1.25rem'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                                <div>
                                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                                    {rev.reviewer_name}
                                  </span>
                                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>
                                    {rev.reviewer_role === 'client' ? '🏢 Client' : '💻 Freelancer'}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                                  <div style={{ display: 'flex', gap: '0.05rem' }}>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <span key={i} style={{ color: i < rev.rating ? '#f7971e' : 'rgba(255,255,255,0.1)', fontSize: '0.9rem' }}>★</span>
                                    ))}
                                  </div>
                                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
                                    {new Date(rev.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                  </span>
                                </div>
                              </div>
                              <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
                                "{rev.comment || 'No comment provided.'}"
                              </p>
                            </div>
                          ))
                        ) : (
                          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '12px', padding: '2.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                            No feedback reviews received yet.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab content: Payments & Ledger */}
                  {activeTab === 'payments' && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                        Escrow & Payment Transactions Ledger
                      </h4>

                      {/* Summary Metrics Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                      }}>
                        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.25rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.25rem' }}>Total Funded Escrow</span>
                          <strong style={{ fontSize: '1.5rem', color: '#f59e0b', fontFamily: "'Space Grotesk', sans-serif" }}>
                            ${transactions
                              .filter(t => t.status === 'funded')
                              .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
                              .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </strong>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.25rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.25rem' }}>Total Released Earnings</span>
                          <strong style={{ fontSize: '1.5rem', color: '#10b981', fontFamily: "'Space Grotesk', sans-serif" }}>
                            ${transactions
                              .filter(t => t.status === 'released')
                              .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
                              .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </strong>
                        </div>
                      </div>

                      {/* Transaction Table List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {loadingTransactions ? (
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Loading transaction records...</div>
                        ) : transactions.length > 0 ? (
                          transactions.map((tx) => {
                            const statusColor = tx.status === 'released' ? '#10b981' :
                                                tx.status === 'refunded' ? '#ff6b6b' : '#f59e0b'
                            const statusBg = tx.status === 'released' ? 'rgba(16,185,129,0.1)' :
                                              tx.status === 'refunded' ? 'rgba(255,107,107,0.1)' : 'rgba(245,158,11,0.1)'
                            
                            const isOutgoing = tx.client_email === user.email
                            const counterpartyRole = isOutgoing ? 'Freelancer' : 'Client'
                            const counterpartyEmail = isOutgoing ? tx.freelancer_email : tx.client_email

                            return (
                              <div
                                key={tx.id}
                                style={{
                                  background: 'rgba(255,255,255,0.01)',
                                  border: '1px solid rgba(255,255,255,0.04)',
                                  borderRadius: '12px',
                                  padding: '1rem 1.25rem',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  flexWrap: 'wrap',
                                  gap: '1rem'
                                }}
                              >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                                    {tx.project_title}
                                  </span>
                                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                                    {isOutgoing ? '📤 Paid to' : '📥 Received from'}: <strong>{counterpartyEmail}</strong> ({counterpartyRole})
                                  </span>
                                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
                                    {new Date(tx.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                  <strong style={{ fontSize: '1.2rem', color: isOutgoing ? '#ff6584' : '#43e97b' }}>
                                    {isOutgoing ? '-' : '+'}${parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                  </strong>
                                  <span style={{
                                    background: statusBg,
                                    color: statusColor,
                                    border: `1px solid ${statusColor}40`,
                                    borderRadius: '999px',
                                    padding: '3px 12px',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase'
                                  }}>
                                    {tx.status}
                                  </span>
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '12px', padding: '2.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                            No payment transactions recorded yet.
                          </div>
                        )}
                      </div>
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
      {/* Leave Review Overlay Modal */}
      {reviewModalOpen && reviewTarget && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)',
          padding: '1rem'
        }}>
          <div className="glass-card" style={{
            width: '100%', maxWidth: '480px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                ⭐ Write a Review
              </h3>
              <button 
                type="button" 
                onClick={() => { setReviewModalOpen(false); setReviewTarget(null); }}
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
              Share your feedback for <strong>{reviewTarget.reviewee_email}</strong>. Ratings are displayed publicly on user profiles.
            </p>

            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Star Rating Interactive Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Rating
                </label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      style={{
                        background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                        fontSize: '2.5rem', transition: 'transform 0.1s',
                        color: star <= reviewForm.rating ? '#f7971e' : 'rgba(255,255,255,0.1)'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Comment Textarea */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                  Comments
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Describe your experience working on this project..."
                  value={reviewForm.comment}
                  onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none',
                    boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical'
                  }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => { setReviewModalOpen(false); setReviewTarget(null); }} 
                  className="btn-outline text-sm px-5 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submittingReview} 
                  className="btn-glow text-sm px-6 py-2 rounded-xl"
                  style={{ minWidth: 100, justifyContent: 'center' }}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
