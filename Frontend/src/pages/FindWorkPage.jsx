import { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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

export default function FindWorkPage() {
  const { user, loading } = useContext(AuthContext)
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  
  // Proposals check
  const [appliedProposals, setAppliedProposals] = useState([])
  
  // Search and filter states
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  // Proposal Form states
  const [bidAmount, setBidAmount] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [submittingProposal, setSubmittingProposal] = useState(false)
  const [proposalError, setProposalError] = useState('')
  const [proposalSuccess, setProposalSuccess] = useState('')

  // Fetch open projects
  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true)
      try {
        const res = await api.get('projects/list/')
        setProjects(res.data)
        if (res.data.length > 0) {
          setSelectedProject(res.data[0])
        }
      } catch (err) {
        console.error("Error fetching projects:", err)
      } finally {
        setLoadingProjects(false)
      }
    }
    fetchProjects()
  }, [])

  // Fetch freelancer proposals to verify apply status
  useEffect(() => {
    if (user && user.role === 'freelancer') {
      const fetchProposals = async () => {
        try {
          const res = await api.get(`proposals/freelancer/?email=${user.email}`)
          setAppliedProposals(res.data)
        } catch (err) {
          console.error("Error fetching proposals:", err)
        }
      }
      fetchProposals()
    }
  }, [user])

  const handleProposalSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    if (user.role !== 'freelancer') {
      setProposalError('Only freelancers can submit project applications')
      return
    }

    setSubmittingProposal(true)
    setProposalError('')
    setProposalSuccess('')

    try {
      const res = await api.post('proposals/submit/', {
        project_id: selectedProject.id,
        freelancer_email: user.email,
        bid_amount: bidAmount,
        cover_letter: coverLetter,
      })

      setProposalSuccess('Application submitted successfully! 🎉')
      
      // Update applied proposals state
      setAppliedProposals([...appliedProposals, res.data.proposal])
      
      // Reset form
      setBidAmount('')
      setCoverLetter('')
    } catch (err) {
      console.error(err)
      setProposalError(err?.response?.data?.message || 'Failed to submit proposal. Please try again.')
    } finally {
      setSubmittingProposal(false)
    }
  }

  // Filter projects based on search text and category dropdown
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(search.toLowerCase()) || 
                          project.description.toLowerCase().includes(search.toLowerCase()) ||
                          (project.skills_required && project.skills_required.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory = categoryFilter === 'All' || project.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Check if current freelancer has already applied to the active selected project
  const currentProposal = selectedProject 
    ? appliedProposals.find(p => p.project_id === selectedProject.id)
    : null

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#07070f', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, position: 'relative', overflow: 'hidden', paddingTop: '7.5rem', paddingBottom: '5rem' }}>
        {/* Background ambient orbs */}
        <div style={{ position: 'absolute', width: 500, height: 500, top: '-180px', left: '-180px', background: 'rgba(108,99,255,0.08)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 450, height: 450, bottom: '-120px', right: '-120px', background: 'rgba(67,233,123,0.05)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />

        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

        <div style={cx}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#6c63ff] mb-2">Freelance Gigs</span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
              Find <span className="neon-text">Work</span>
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>
              Browse top open opportunities, bid with your custom rate, and start working immediately.
            </p>
          </div>

          {/* Search and Filters panel */}
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }}>
                🔍
              </span>
              <input
                type="text"
                placeholder="Search projects, keywords, or skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ ...inputStyle, paddingLeft: '2.5rem', background: 'rgba(255,255,255,0.02)' }}
              />
            </div>
            <div style={{ flex: '0 1 200px' }}>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ ...inputStyle, background: 'rgba(255,255,255,0.02)' }}
              >
                <option style={{ background: '#0f0f23' }} value="All">All Categories</option>
                <option style={{ background: '#0f0f23' }} value="Development">Development & IT</option>
                <option style={{ background: '#0f0f23' }} value="Design">Design & Creative</option>
                <option style={{ background: '#0f0f23' }} value="AI & Data Science">AI & Data Science</option>
                <option style={{ background: '#0f0f23' }} value="Writing & Marketing">Writing & Marketing</option>
                <option style={{ background: '#0f0f23' }} value="Other">Other</option>
              </select>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
              Found {filteredProjects.length} open project(s)
            </div>
          </div>

          {/* Main workspace layout */}
          {loadingProjects ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'rgba(255,255,255,0.4)', gap: '1rem' }}>
              <svg style={{ width: 32, height: 32, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span>Loading projects database...</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <span style={{ fontSize: '2.5rem' }}>💼</span>
              <h3 style={{ margin: '1rem 0 0.5rem 0', fontSize: '1.25rem' }}>No projects available</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', maxWidth: '30rem', margin: '0 auto' }}>
                There are no open projects available right now. Check back later or log in as a client to post a project!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
              {/* Left Column: Projects List */}
              <div style={{ flex: '1 1 360px', display: 'flex', flexDirection: 'column', gap: '1rem', maxH: '800px', overflowY: 'auto' }}>
                {filteredProjects.length === 0 ? (
                  <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem' }}>
                    No search results match your criteria.
                  </div>
                ) : (
                  filteredProjects.map((project) => {
                    const isSelected = selectedProject && selectedProject.id === project.id
                    const alreadyApplied = appliedProposals.some(p => p.project_id === project.id)

                    return (
                      <div
                        key={project.id}
                        onClick={() => {
                          setSelectedProject(project)
                          setProposalError('')
                          setProposalSuccess('')
                        }}
                        style={{
                          background: isSelected ? 'rgba(108,99,255,0.08)' : 'rgba(255,255,255,0.02)',
                          border: isSelected ? '1px solid #6c63ff' : '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '16px',
                          padding: '1.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          position: 'relative',
                        }}
                        onMouseEnter={e => {
                          if (!isSelected) {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isSelected) {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                          }
                        }}
                      >
                        {alreadyApplied && (
                          <span style={{
                            position: 'absolute', top: 12, right: 12,
                            background: 'rgba(67,233,123,0.12)', color: '#43e97b', border: '1px solid rgba(67,233,123,0.25)',
                            borderRadius: '4px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase'
                          }}>
                            Applied
                          </span>
                        )}

                        <span style={{ fontSize: '0.7rem', color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', tracking: '0.05em' }}>
                          {project.category}
                        </span>
                        <h3 style={{ margin: '0.25rem 0 0.5rem 0', fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                          {project.title}
                        </h3>
                        <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                          {project.description.length > 110 ? `${project.description.substring(0, 110)}...` : project.description}
                        </p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: 700, color: '#43e97b' }}>
                            ${project.budget}{project.project_type === 'hourly' ? '/hr' : ''}
                          </span>
                          <span style={{ color: 'rgba(255,255,255,0.3)', textTransform: 'capitalize' }}>
                            {project.project_type}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Right Column: Project Details & Proposals Application */}
              <div style={{ flex: '2 1 500px' }}>
                {selectedProject ? (
                  <div className="glass-card" style={{ padding: '2.5rem', position: 'sticky', top: '7.5rem' }}>
                    
                    {/* Project Meta details */}
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ background: 'rgba(108,99,255,0.12)', color: '#a78bfa', border: '1px solid rgba(108,99,255,0.25)', borderRadius: '6px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600 }}>
                          📁 {selectedProject.category}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                          Posted by: {selectedProject.client_email}
                        </span>
                      </div>
                      
                      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: '0.5rem 0', fontFamily: "'Space Grotesk', sans-serif" }}>
                        {selectedProject.title}
                      </h2>

                      <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                        <div>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Budget</span>
                          <strong style={{ fontSize: '1.25rem', color: '#43e97b' }}>
                            ${selectedProject.budget}{selectedProject.project_type === 'hourly' ? '/hr' : ''}
                          </strong>
                        </div>
                        <div>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Project Type</span>
                          <strong style={{ fontSize: '1.1rem', textTransform: 'capitalize' }}>
                            {selectedProject.project_type}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Full Description */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Description</h4>
                      <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {selectedProject.description}
                      </p>
                    </div>

                    {/* Required Skills list */}
                    {selectedProject.skills_required && (
                      <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Skills Required</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {selectedProject.skills_required.split(',').map(s => s.trim()).filter(Boolean).map(tag => (
                            <span key={tag} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Application / Proposal Form Area */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
                      
                      {proposalSuccess && (
                        <div style={{ background: 'rgba(67,233,123,0.1)', border: '1px solid rgba(67,233,123,0.25)', borderRadius: 12, padding: '0.875rem 1.25rem', marginBottom: '1rem', color: '#43e97b', fontSize: '0.9rem' }}>
                          {proposalSuccess}
                        </div>
                      )}
                      {proposalError && (
                        <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.25)', borderRadius: 12, padding: '0.875rem 1.25rem', marginBottom: '1rem', color: '#ff6b6b', fontSize: '0.9rem' }}>
                          {proposalError}
                        </div>
                      )}

                      {!user ? (
                        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            You must be signed in as a freelancer to submit a proposal for this project.
                          </p>
                          <button className="btn-glow text-sm px-6 py-2.5 rounded-xl" onClick={() => navigate('/login')}>
                            Sign In to Apply
                          </button>
                        </div>
                      ) : user.role !== 'freelancer' ? (
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '1.25rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                          🏢 Viewing as a client. Only freelancer accounts can submit applications.
                        </div>
                      ) : currentProposal ? (
                        <div style={{ background: 'rgba(67,233,123,0.06)', border: '1px solid rgba(67,233,123,0.15)', borderRadius: 16, padding: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#43e97b', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                            <span>✅</span> You applied to this project
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Your Bid:</span>
                            <strong style={{ color: '#43e97b' }}>${currentProposal.bid_amount}</strong>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: 8 }}>
                            {currentProposal.cover_letter}
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleProposalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
                            Submit an Application
                          </h3>

                          {/* Bid Rate */}
                          <div>
                            <label style={{ ...labelStyle, fontSize: '0.7rem' }}>
                              Your Bid Rate ($ USD)
                            </label>
                            <div style={{ position: 'relative', width: '200px' }}>
                              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontWeight: 600, pointerEvents: 'none' }}>
                                $
                              </span>
                              <input
                                type="text"
                                placeholder={selectedProject.budget}
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                style={{ ...inputStyle, paddingLeft: '2.25rem' }}
                                required
                              />
                            </div>
                          </div>

                          {/* Cover Letter */}
                          <div>
                            <label style={{ ...labelStyle, fontSize: '0.7rem' }}>
                              Why are you a good fit for this project?
                            </label>
                            <textarea
                              rows="4"
                              placeholder="Introduce yourself and explain your plan to build this project..."
                              value={coverLetter}
                              onChange={(e) => setCoverLetter(e.target.value)}
                              style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }}
                              required
                            />
                          </div>

                          {/* Submit Button */}
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                              type="submit"
                              disabled={submittingProposal}
                              className="btn-glow text-sm px-6 py-2.5 rounded-xl"
                              style={{ minWidth: 160, justifyContent: 'center' }}
                            >
                              {submittingProposal ? (
                                <>
                                  <svg style={{ width: 14, height: 14, animation: 'spin 1s linear infinite', marginRight: 6 }} viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                  </svg>
                                  Submitting...
                                </>
                              ) : (
                                '🚀 Submit Proposal'
                              )}
                            </button>
                          </div>
                        </form>
                      )}

                    </div>

                  </div>
                ) : (
                  <div style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '3rem' }}>
                    Select a project from the left to view detailed requirements and submit proposals.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
