import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

/* ─────────── Shared styles ─────────── */
const pageStyle = {
  minHeight: '100vh',
  width: '100%',
  background: '#07070f',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem 1rem',
  position: 'relative',
  overflow: 'hidden',
  fontFamily: "'Inter', sans-serif",
}

const orbBase = {
  position: 'absolute',
  borderRadius: '50%',
  filter: 'blur(90px)',
  pointerEvents: 'none',
}

const cardStyle = {
  position: 'relative',
  zIndex: 10,
  width: '100%',
  maxWidth: '480px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '24px',
  padding: '2.5rem 2rem',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset',
}

const labelStyle = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.5)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  marginBottom: '0.45rem',
}

const baseInput = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  padding: '0.875rem 1rem 0.875rem 2.75rem',
  color: '#fff',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  fontFamily: 'inherit',
}

const EyeIcon = ({ open }) => (
  <svg style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    {open
      ? <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></>
      : <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
    }
  </svg>
)

/* ─── Field wrapper with icon ─── */
function Field({ label, icon, error, children }) {
  return (
    <div>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
            {icon}
          </span>
        )}
        {children}
      </div>
      {error && <p style={{ color: '#ff6b6b', fontSize: '0.78rem', marginTop: '0.35rem' }}>{error}</p>}
    </div>
  )
}

/* ─── Steps config ─── */
const STEPS = [
  { id: 1, title: 'Your Role',       subtitle: 'How will you use FreelanceHub?' },
  { id: 2, title: 'Account Info',    subtitle: 'Create your login credentials' },
  { id: 3, title: 'Personal Info',   subtitle: 'Tell us a bit about yourself' },
  { id: 4, title: 'All Set! 🎉',     subtitle: 'Your account is ready to go' },
]

/* ─── Role card ─── */
function RoleCard({ icon, title, desc, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0.5rem',
        padding: '1.25rem',
        border: selected ? '2px solid rgba(108,99,255,0.7)' : '1px solid rgba(255,255,255,0.09)',
        borderRadius: '16px',
        background: selected ? 'rgba(108,99,255,0.12)' : 'rgba(255,255,255,0.04)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'left',
        fontFamily: 'inherit',
        boxShadow: selected ? '0 0 0 4px rgba(108,99,255,0.12)' : 'none',
        flex: 1,
      }}
    >
      <span style={{ fontSize: '2rem', lineHeight: 1 }}>{icon}</span>
      <span style={{ fontWeight: 700, color: selected ? '#fff' : 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>{title}</span>
      <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>{desc}</span>
    </button>
  )
}

/* ─── Strength bar ─── */
function PasswordStrength({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length
  const colors = ['#ff453a', '#ff9f0a', '#ffd60a', '#30d158']
  const labels = ['Weak', 'Fair', 'Good', 'Strong']
  if (!password) return null
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < score ? colors[score - 1] : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
        ))}
      </div>
      <p style={{ fontSize: '0.72rem', color: score > 0 ? colors[score - 1] : 'rgba(255,255,255,0.3)', margin: 0, fontWeight: 600 }}>
        {score > 0 ? labels[score - 1] : ''}
      </p>
    </div>
  )
}

/* ═══════════ Main component ═══════════ */
export default function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [focused, setFocused] = useState({})

  const [form, setForm] = useState({
    role: '',          // 'client' | 'freelancer'
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    country: '',
    agreeTerms: false,
  })

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  const inputS = (name) => ({
    ...baseInput,
    borderColor: errors[name] ? 'rgba(255,68,68,0.5)' : focused[name] ? 'rgba(108,99,255,0.6)' : 'rgba(255,255,255,0.1)',
    boxShadow: errors[name]
      ? '0 0 0 3px rgba(255,68,68,0.1)'
      : focused[name] ? '0 0 0 3px rgba(108,99,255,0.12)' : 'none',
  })

  /* ── Validation per step ── */
  const validate = () => {
    const e = {}
    if (step === 1 && !form.role) e.role = 'Please select a role to continue.'
    if (step === 2) {
      if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address.'
      if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters.'
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.'
    }
    if (step === 3) {
      if (!form.firstName.trim()) e.firstName = 'First name is required.'
      if (!form.lastName.trim()) e.lastName = 'Last name is required.'
      if (!form.agreeTerms) e.agreeTerms = 'You must agree to the terms.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validate()) return
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else handleSubmit()
  }

  const handleSubmit = async () => {
  console.log("HANDLE SUBMIT CALLED");
  console.log("FORM:", form);

  setLoading(true);

  try {
    const res = await api.post("register/", {
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      password: form.password,
      role: form.role,
      country: form.country,
    });

    console.log("SUCCESS:", res.data);

    await new Promise((r) => setTimeout(r, 1400));

    setStep(4);
  } catch (err) {
    console.log("ERROR:", err);

    setErrors({
      submit:
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Registration failed. Please try again.",
    });
  } finally {
    setLoading(false);
  }
};

  const iStep = (name) => ({
    onFocus: () => setFocused(f => ({ ...f, [name]: true })),
    onBlur: () => setFocused(f => ({ ...f, [name]: false })),
  })

  const ICON = {
    email: <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    lock: <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
    user: <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    globe: <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  }

  /* ── Progress bar ── */
  const progress = step === 4 ? 100 : ((step - 1) / (STEPS.length - 2)) * 100

  return (
    <div style={pageStyle}>
      {/* Ambient orbs */}
      <div style={{ ...orbBase, width: 500, height: 500, top: '-180px', right: '-180px', background: 'rgba(108,99,255,0.12)' }} />
      <div style={{ ...orbBase, width: 350, height: 350, bottom: '-80px', left: '-80px', background: 'rgba(255,101,132,0.1)' }} />

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      <div style={cardStyle}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1.75rem' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 13, color: '#fff',
            boxShadow: '0 8px 24px rgba(108,99,255,0.35)',
          }}>FH</div>
          <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#fff', letterSpacing: '-0.02em' }}>
            Freelance<span style={{ color: '#6c63ff' }}>Hub</span>
          </span>
        </Link>

        {/* Step indicator (skip for success screen) */}
        {step < 4 && (
          <>
            {/* Step dots */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              {STEPS.slice(0, 3).map((s, i) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: i + 1 < step ? 28 : 28, height: 28, borderRadius: '50%',
                    background: i + 1 < step ? 'rgba(108,99,255,0.8)' : i + 1 === step ? 'rgba(108,99,255,0.25)' : 'rgba(255,255,255,0.07)',
                    border: i + 1 === step ? '2px solid rgba(108,99,255,0.7)' : '2px solid transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700,
                    color: i + 1 <= step ? '#fff' : 'rgba(255,255,255,0.3)',
                    transition: 'all 0.3s',
                    flexShrink: 0,
                  }}>
                    {i + 1 < step ? '✓' : i + 1}
                  </div>
                  {i < 2 && <div style={{ width: 28, height: 2, background: i + 1 < step ? 'rgba(108,99,255,0.6)' : 'rgba(255,255,255,0.07)', borderRadius: 2, transition: 'background 0.3s' }} />}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: '1.75rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #6c63ff, #a855f7)', borderRadius: 2, transition: 'width 0.4s ease' }} />
            </div>
          </>
        )}

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.55rem', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.3, fontFamily: "'Space Grotesk', sans-serif" }}>
            {STEPS[step - 1].title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginTop: '0.4rem' }}>
            {STEPS[step - 1].subtitle}
          </p>
        </div>

        {/* ───── STEP 1 — Role ───── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="register-roles-container">
              <RoleCard
                icon="🏢"
                title="I'm a Client"
                desc="I need to hire skilled freelancers for my projects"
                selected={form.role === 'client'}
                onClick={() => set('role', 'client')}
              />
              <RoleCard
                icon="💼"
                title="I'm a Freelancer"
                desc="I want to offer my skills and find paid work"
                selected={form.role === 'freelancer'}
                onClick={() => set('role', 'freelancer')}
              />
            </div>
            {errors.role && <p style={{ color: '#ff6b6b', fontSize: '0.8rem', textAlign: 'center' }}>{errors.role}</p>}
          </div>
        )}

        {/* ───── STEP 2 — Account info ───── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <Field label="Email address" icon={ICON.email} error={errors.email}>
              <input
                id="reg-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                style={inputS('email')}
                {...iStep('email')}
              />
            </Field>

            <Field label="Password" icon={ICON.lock} error={errors.password}>
              <input
                id="reg-password"
                type={showPw ? 'text' : 'password'}
                name="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                style={{ ...inputS('password'), paddingRight: '3rem' }}
                {...iStep('password')}
              />
              <button type="button" onClick={() => setShowPw(s => !s)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 0, display: 'flex' }}>
                <EyeIcon open={showPw} />
              </button>
              <PasswordStrength password={form.password} />
            </Field>

            <Field label="Confirm Password" icon={ICON.lock} error={errors.confirmPassword}>
              <input
                id="reg-confirm-password"
                type={showPw2 ? 'text' : 'password'}
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={e => set('confirmPassword', e.target.value)}
                style={{ ...inputS('confirmPassword'), paddingRight: '3rem' }}
                {...iStep('confirmPassword')}
              />
              <button type="button" onClick={() => setShowPw2(s => !s)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 0, display: 'flex' }}>
                <EyeIcon open={showPw2} />
              </button>
            </Field>
          </div>
        )}

        {/* ───── STEP 3 — Personal info ───── */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div className="register-name-grid">
              <Field label="First Name" icon={ICON.user} error={errors.firstName}>
                <input
                  id="reg-first-name"
                  type="text"
                  placeholder="John"
                  value={form.firstName}
                  onChange={e => set('firstName', e.target.value)}
                  style={inputS('firstName')}
                  {...iStep('firstName')}
                />
              </Field>
              <Field label="Last Name" icon={ICON.user} error={errors.lastName}>
                <input
                  id="reg-last-name"
                  type="text"
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={e => set('lastName', e.target.value)}
                  style={inputS('lastName')}
                  {...iStep('lastName')}
                />
              </Field>
            </div>

            <Field label="Country" icon={ICON.globe} error={errors.country}>
              <select
                id="reg-country"
                value={form.country}
                onChange={e => set('country', e.target.value)}
                style={{ ...baseInput, paddingLeft: '2.75rem', appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}
                {...iStep('country')}
              >
                <option value="" style={{ background: '#0f0f23' }}>Select your country</option>
                {['Pakistan','United States','United Kingdom','Canada','Australia','India','Germany','France','Netherlands','Singapore','UAE','Other'].map(c => (
                  <option key={c} value={c} style={{ background: '#0f0f23' }}>{c}</option>
                ))}
              </select>
              <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'rgba(255,255,255,0.3)' }}>
                <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </span>
            </Field>

            {/* Terms */}
            <div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={form.agreeTerms}
                  onChange={e => set('agreeTerms', e.target.checked)}
                  style={{ width: 16, height: 16, marginTop: '2px', accentColor: '#6c63ff', cursor: 'pointer', flexShrink: 0 }}
                />
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                  I agree to FreelanceHub's{' '}
                  <a href="#" style={{ color: '#6c63ff', textDecoration: 'none' }}>Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" style={{ color: '#6c63ff', textDecoration: 'none' }}>Privacy Policy</a>
                </span>
              </label>
              {errors.agreeTerms && <p style={{ color: '#ff6b6b', fontSize: '0.78rem', marginTop: '0.35rem' }}>{errors.agreeTerms}</p>}
            </div>

            {errors.submit && (
              <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.25)', borderRadius: 10, padding: '0.75rem 1rem', color: '#ff6b6b', fontSize: '0.85rem' }}>
                {errors.submit}
              </div>
            )}
          </div>
        )}

        {/* ───── STEP 4 — Success ───── */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '1rem 0 0.5rem' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.08))',
              border: '2px solid rgba(52,211,153,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2rem',
              boxShadow: '0 0 40px rgba(52,211,153,0.2)',
            }}>
              ✅
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem', fontFamily: "'Space Grotesk', sans-serif" }}>
              Account created!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Welcome to FreelanceHub, <strong style={{ color: '#fff' }}>{form.firstName}</strong>! 🎉<br/>
              A confirmation email has been sent to<br/>
              <strong style={{ color: '#a78bfa' }}>{form.email}</strong>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => navigate('/login')}
                style={{
                  width: '100%', padding: '0.95rem', borderRadius: '14px', border: 'none',
                  background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
                  color: '#fff', fontWeight: 600, fontSize: '0.95rem',
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 8px 28px rgba(108,99,255,0.35)',
                }}
              >
                Sign in to your account
              </button>
              <button
                onClick={() => navigate('/')}
                style={{
                  width: '100%', padding: '0.95rem', borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: '0.9rem',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Go to Homepage
              </button>
            </div>
          </div>
        )}

        {/* ───── Nav buttons ───── */}
        {step < 4 && (
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', alignItems: 'center' }}>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                style={{
                  padding: '0.875rem 1.25rem', borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: '0.9rem',
                  cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                }}
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              id="register-next"
              onClick={next}
              disabled={loading}
              style={{
                flex: 1, padding: '0.95rem', borderRadius: '14px', border: 'none',
                background: loading ? 'rgba(108,99,255,0.5)' : 'linear-gradient(135deg, #6c63ff, #a855f7)',
                color: '#fff', fontWeight: 600, fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                boxShadow: loading ? 'none' : '0 8px 28px rgba(108,99,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}
            >
              {loading ? (
                <>
                  <svg style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Creating account…
                </>
              ) : step === 3 ? (
                'Create Account 🚀'
              ) : (
                'Continue →'
              )}
            </button>
          </div>
        )}

        {/* Login link */}
        {step < 4 && (
          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.35)' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{ color: '#6c63ff', fontWeight: 600, textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
            >
              Sign in
            </Link>
          </p>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
