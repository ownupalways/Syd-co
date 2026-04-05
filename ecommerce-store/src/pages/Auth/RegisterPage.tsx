import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone, Eye, EyeOff, X, CheckCircle } from 'lucide-react'
import { useTheme } from '@context/useTheme'
import { theme } from '@styles/theme'
import { registerApi } from '@api/auth'
import { useAuthStore } from '@store/authStore'
import sydLogo from '../../assets/syd-logo.png'
import toast from 'react-hot-toast'

const RegisterPage: React.FC = () => {
  const { isDark } = useTheme()
  const t = isDark ? theme.dark : theme.light
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [closeHover, setCloseHover] = useState(false)
  const [alreadyExistsModal, setAlreadyExistsModal] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await registerApi(form)
      const { token, user } = res.data.data!
      setAuth(user, token)
      toast.success(`Welcome to Syd & Co, ${user.name}! 🎉`)
      navigate('/')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string }; status?: number } }
      const message = error.response?.data?.message || ''
      const status = error.response?.status

      if (status === 409 || message.toLowerCase().includes('already')) {
        setAlreadyExistsModal(true)
      } else {
        toast.error(message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 12px 12px 44px',
    borderRadius: '10px',
    border: `1px solid ${t.border}`,
    background: t.background,
    color: t.text,
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  const fields = [
    { name: 'name', type: 'text', placeholder: 'Full name', icon: <User size={17} /> },
    { name: 'email', type: 'email', placeholder: 'Email address', icon: <Mail size={17} /> },
    { name: 'phone', type: 'tel', placeholder: 'Phone (optional)', icon: <Phone size={17} /> },
  ]

  const perks = ['Free shipping on $50+', 'Exclusive member deals', 'Easy returns']

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => navigate(-1)}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(8px)',
          overflowY: 'auto',
        }}
      >
        {/* Card */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: '440px',
            background: t.backgroundSecondary,
            borderRadius: '20px',
            border: `1px solid ${t.border}`,
            padding: 'clamp(24px, 5vw, 40px)',
            position: 'relative',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            margin: 'auto',
          }}
        >
          {/* Close */}
          <button
            onClick={() => navigate(-1)}
            onMouseEnter={() => setCloseHover(true)}
            onMouseLeave={() => setCloseHover(false)}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: closeHover
                ? isDark ? 'rgba(230,91,168,0.2)' : 'rgba(230,91,168,0.1)'
                : 'transparent',
              border: `1px solid ${closeHover ? t.primaryDark : 'transparent'}`,
              cursor: 'pointer',
              color: closeHover ? t.primaryDark : t.textSecondary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '6px', borderRadius: '8px',
              transition: 'all 0.2s',
              transform: closeHover ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            <X size={18} />
          </button>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src={sydLogo}
              alt="Syd & Co"
              style={{ borderRadius: '8px',
                height: '52px', display: 'block', margin: '0 auto', objectFit: 'contain',
                filter: 'drop-shadow(0 4px 12px rgba(230,91,168,0.3))',
              }}
            />
          </div>

          <h1 style={{
            color: t.text, marginBottom: '6px',
            textAlign: 'center', fontSize: 'clamp(20px, 4vw, 24px)',
            fontWeight: 800,
          }}>
            Join Syd & Co ✨
          </h1>
          <p style={{ color: t.textSecondary, textAlign: 'center', marginBottom: '16px', fontSize: '14px' }}>
            Create your free account today
          </p>

          {/* Perks */}
          <div style={{
            display: 'flex', gap: '8px', flexWrap: 'wrap',
            justifyContent: 'center', marginBottom: '24px',
          }}>
            {perks.map((perk) => (
              <span key={perk} style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                background: isDark ? 'rgba(230,91,168,0.12)' : 'rgba(255,182,217,0.2)',
                color: t.primaryDark,
                border: `1px solid ${t.border}`,
              }}>
                <CheckCircle size={11} /> {perk}
              </span>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {fields.map((f) => (
              <div key={f.name} style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: t.textSecondary,
                  pointerEvents: 'none',
                }}>
                  {f.icon}
                </span>
                <input
                  type={f.type} name={f.name} placeholder={f.placeholder}
                  value={form[f.name as keyof typeof form]}
                  onChange={handleChange}
                  required={f.name !== 'phone'}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = t.primaryDark}
                  onBlur={(e) => e.target.style.borderColor = t.border}
                />
              </div>
            ))}

            <div style={{ position: 'relative' }}>
              <Lock size={17} style={{
                position: 'absolute', left: '14px', top: '50%',
                transform: 'translateY(-50%)', color: t.textSecondary, pointerEvents: 'none',
              }} />
              <input
                type={showPass ? 'text' : 'password'} name="password"
                placeholder="Password (min 6 characters)"
                value={form.password} onChange={handleChange} required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = t.primaryDark}
                onBlur={(e) => e.target.style.borderColor = t.border}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{
                position: 'absolute', right: '14px', top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: t.textSecondary,
              }}>
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            <button type="submit" disabled={loading} style={{
              background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
              color: '#fff', border: 'none',
              padding: '14px', borderRadius: '12px',
              fontSize: '16px', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: `0 6px 20px ${t.shadow}`,
              marginTop: '4px',
            }}>
              {loading ? 'Creating account...' : 'Create Account Free'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', color: t.textSecondary, fontSize: '14px' }}>
            Already have an account?{' '}
            <Link to="/login" replace style={{ color: t.primaryDark, fontWeight: 700, textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Already Exists Modal */}
      {alreadyExistsModal && (
        <div
          onClick={() => setAlreadyExistsModal(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '380px',
              background: t.backgroundSecondary,
              borderRadius: '20px',
              border: `1px solid ${t.border}`,
              padding: '36px 28px',
              textAlign: 'center',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              animation: 'popIn 0.3s ease',
            }}
          >
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: isDark ? 'rgba(230,91,168,0.15)' : 'rgba(255,182,217,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <CheckCircle size={32} color={t.primaryDark} />
            </div>

            <h2 style={{ color: t.text, fontSize: '20px', fontWeight: 800, marginBottom: '10px' }}>
              Account Already Exists! 👋
            </h2>
            <p style={{ color: t.textSecondary, fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              An account with{' '}
              <span style={{ color: t.primaryDark, fontWeight: 600 }}>{form.email}</span>{' '}
              already exists. Sign in instead?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/login" replace style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%', padding: '13px',
                  borderRadius: '12px', border: 'none',
                  background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
                  color: '#fff', fontSize: '15px', fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: `0 6px 20px ${t.shadow}`,
                }}>
                  Sign In Instead
                </button>
              </Link>
              <button
                onClick={() => setAlreadyExistsModal(false)}
                style={{
                  width: '100%', padding: '12px',
                  borderRadius: '12px',
                  border: `1px solid ${t.border}`,
                  background: 'transparent',
                  color: t.textSecondary,
                  fontSize: '14px', fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Use Different Email
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  )
}

export default RegisterPage
