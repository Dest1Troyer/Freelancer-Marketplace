import { useState, useContext, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Navbar from '../components/Navbar'
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

export default function ChatPage() {
  const { user, loading } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  
  const [conversations, setConversations] = useState([])
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [activeContact, setActiveContact] = useState(null)
  const activeContactRef = useRef(null)
  
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)

  const messagesEndRef = useRef(null)

  // Keep ref in sync with state so effects always have current value
  useEffect(() => {
    activeContactRef.current = activeContact
  }, [activeContact])
  
  // Parse query parameter email
  const queryParams = new URLSearchParams(location.search)
  const queryEmail = queryParams.get('email')

  // Guard page access
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  // Fetch active conversations list
  useEffect(() => {
    if (user) {
      const fetchConversationsList = async () => {
        setLoadingConversations(true)
        try {
          const res = await api.get(`chat/conversations/?email=${user.email}`)
          setConversations(res.data)
          
          // Determine if we should open a deep-linked conversation
          if (queryEmail) {
            const existing = res.data.find(c => c.contact.email === queryEmail)
            if (existing) {
              setActiveContact(existing.contact)
            } else {
              // Lookup profile details to start new conversation
              try {
                const profileRes = await api.get(`profile/get/?email=${queryEmail}`)
                const profileData = profileRes.data
                // Ensure contact object has all required fields
                const contactObj = {
                  email: profileData.email || queryEmail,
                  first_name: profileData.first_name || '',
                  last_name: profileData.last_name || '',
                  role: profileData.role || '',
                  profile_picture: profileData.profile_picture || '',
                }
                const newContactInfo = {
                  contact: contactObj,
                  last_message: { text: 'Start your conversation!', sender_email: '', created_at: null },
                  unread_count: 0
                }
                setConversations(prev => {
                  if (prev.some(c => c.contact.email === contactObj.email)) {
                    return prev
                  }
                  return [newContactInfo, ...prev]
                })
                setActiveContact(contactObj)
              } catch (profileErr) {
                console.error("Error looking up linked user profile:", profileErr)
              }
            }
          } else if (res.data.length > 0 && !activeContactRef.current) {
            // Default to first conversation (use ref to avoid stale closure)
            setActiveContact(res.data[0].contact)
          }
        } catch (err) {
          console.error("Error fetching conversations list:", err)
        } finally {
          setLoadingConversations(false)
        }
      }
      fetchConversationsList()
    }
  }, [user, queryEmail])

  // Fetch active chat messages
  const fetchChatHistory = async (otherEmail, showSpinner = false) => {
    if (!user || !otherEmail) return
    if (showSpinner) setHistoryLoading(true)
    try {
      const res = await api.get(`chat/history/?user_email=${user.email}&other_email=${otherEmail}`)
      setMessages(res.data)
    } catch (err) {
      console.error("Error loading history:", err)
    } finally {
      if (showSpinner) setHistoryLoading(false)
    }
  }

  // Poll for new messages and refresh conversations sidebar
  useEffect(() => {
    if (user && activeContact) {
      fetchChatHistory(activeContact.email, true)
      
      const msgInterval = setInterval(() => {
        fetchChatHistory(activeContact.email)
      }, 3000)

      // Also refresh conversations sidebar every 10s to show new contacts
      const convInterval = setInterval(async () => {
        try {
          const res = await api.get(`chat/conversations/?email=${user.email}`)
          setConversations(res.data)
        } catch (err) {
          console.error("Error refreshing conversations:", err)
        }
      }, 10000)
      
      return () => {
        clearInterval(msgInterval)
        clearInterval(convInterval)
      }
    }
  }, [user, activeContact])

  // Auto scroll to message bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || !activeContact || sending) return
    
    setSending(true)
    const textToSend = newMessage
    setNewMessage('') // Clear input immediately for responsive feel

    try {
      const res = await api.post('chat/send/', {
        sender_email: user.email,
        receiver_email: activeContact.email,
        message_text: textToSend,
      })

      // Add to messages list dynamically
      setMessages(prev => [...prev, res.data.msg])
      
      // Update conversations sidebar last message
      setConversations(prev => {
        return prev.map(c => {
          if (c.contact.email === activeContact.email) {
            return {
              ...c,
              last_message: {
                text: textToSend,
                created_at: new Date().toISOString(),
                sender_email: user.email
              }
            }
          }
          return c
        })
      })
    } catch (err) {
      console.error("Failed to send message:", err)
      setNewMessage(textToSend) // Restore text on failure
    } finally {
      setSending(false)
    }
  }

  // Format creation timestamp cleanly
  const formatTime = (isoString) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', background: '#07070f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <svg style={{ width: 40, height: 40, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>Connecting chat engine...</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100vh', background: '#07070f', color: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Navbar />

      <main style={{ flex: 1, position: 'relative', overflow: 'hidden', paddingTop: '5rem', display: 'flex', alignItems: 'stretch' }}>
        {/* Ambient glow backgrounds */}
        <div style={{ position: 'absolute', width: 450, height: 450, top: '-180px', left: '-180px', background: 'rgba(108,99,255,0.06)', borderRadius: '50%', filter: 'blur(90px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, bottom: '-100px', right: '-100px', background: 'rgba(255,101,132,0.04)', borderRadius: '50%', filter: 'blur(90px)', pointerEvents: 'none' }} />

        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

        <div className="chat-container" style={{ ...cx, display: 'flex', gap: '1.5rem', height: '100%', alignItems: 'stretch', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
          
          {/* Left Panel: Conversations list */}
          <div className={`glass-card chat-sidebar ${activeContact ? 'mobile-hidden' : ''}`} style={{ flex: '1 1 300px', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1.25rem 0', fontFamily: "'Space Grotesk', sans-serif" }}>
              📩 Inbox
            </h2>
            
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {loadingConversations ? (
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', padding: '1rem', textAlign: 'center' }}>
                  Loading inbox list...
                </div>
              ) : conversations.length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', padding: '2rem 1rem', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 12 }}>
                  Your inbox is empty.<br/>Browse jobs or freelancers to start a conversation!
                </div>
              ) : (
                conversations.map((conv) => {
                  const isActive = activeContact && activeContact.email === conv.contact.email
                  const initialName = `${conv.contact.first_name?.charAt(0) || ''}${conv.contact.last_name?.charAt(0) || ''}`.toUpperCase()

                  return (
                    <div
                      key={conv.contact.email}
                      onClick={() => {
                        setActiveContact(conv.contact)
                        setMessages([])
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.875rem 1rem',
                        background: isActive ? 'rgba(108,99,255,0.08)' : 'rgba(255,255,255,0.02)',
                        border: isActive ? '1px solid #6c63ff' : '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        position: 'relative'
                      }}
                      onMouseEnter={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                        }
                      }}
                    >
                      {/* Avatar */}
                      <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                        {conv.contact.profile_picture ? (
                          <img src={conv.contact.profile_picture} alt="Contact" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #6c63ff, #ff6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 'bold' }}>
                            {initialName}
                          </div>
                        )}
                        {conv.unread_count > 0 && (
                          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: '50%', background: '#ff4444', border: '2px solid #07070f' }} />
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: conv.unread_count > 0 ? 700 : 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {conv.contact.first_name} {conv.contact.last_name}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
                            {conv.contact.role === 'client' ? '🏢' : '💻'}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: conv.unread_count > 0 ? '#fff' : 'rgba(255,255,255,0.4)', fontWeight: conv.unread_count > 0 ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {conv.last_message.text}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Right Panel: Conversation View */}
          <div className={`glass-card chat-main ${!activeContact ? 'mobile-hidden' : ''}`} style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {activeContact ? (
              <>
                {/* Contact Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
                  <button
                    onClick={() => setActiveContact(null)}
                    className="visible-mobile btn-outline"
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      marginRight: '0.5rem',
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      width: 'fit-content',
                      height: 'fit-content'
                    }}
                  >
                    ← Back
                  </button>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                    {activeContact.profile_picture ? (
                      <img src={activeContact.profile_picture} alt="Contact" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #6c63ff, #ff6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {`${activeContact.first_name?.charAt(0) || ''}${activeContact.last_name?.charAt(0) || ''}`.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                      {activeContact.first_name} {activeContact.last_name}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>
                      {activeContact.role} • {activeContact.email}
                    </span>
                  </div>
                </div>

                {/* Messages Body */}
                <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {historyLoading && messages.length === 0 ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                      Fetching conversation...
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender_email === user.email
                      
                      return (
                        <div
                          key={msg.id}
                          style={{
                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                            maxWidth: '70%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: isMe ? 'flex-end' : 'flex-start',
                          }}
                        >
                          <div
                            style={{
                              background: isMe ? 'linear-gradient(135deg, #6c63ff, #a855f7)' : 'rgba(255,255,255,0.05)',
                              border: isMe ? 'none' : '1px solid rgba(255,255,255,0.08)',
                              borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                              padding: '0.75rem 1rem',
                              color: '#fff',
                              fontSize: '0.9rem',
                              lineHeight: 1.45,
                              wordBreak: 'break-word',
                              boxShadow: isMe ? '0 4px 12px rgba(108,99,255,0.25)' : 'none',
                            }}
                          >
                            {msg.message_text}
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                            {formatTime(msg.created_at)}
                          </span>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Bottom Form */}
                <form onSubmit={handleSendMessage} style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)', display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Type your message here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{ ...inputStyle, background: 'rgba(255,255,255,0.02)' }}
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="btn-glow rounded-xl"
                    style={{ padding: '0 1.5rem', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 100 }}
                  >
                    {sending ? (
                      <svg style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                        <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    ) : (
                      'Send 🚀'
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', padding: '2rem', textAlign: 'center' }}>
                <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>No Active Conversation</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', maxWidth: '24rem', marginTop: '0.5rem' }}>
                  Select a contact from the inbox list on the left, or initiate messaging directly from the job dashboard or proposal boards.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
