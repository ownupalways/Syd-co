import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, X, AlertCircle, UserPlus } from 'lucide-react'
import { useTheme } from '@context/useTheme'
import { theme } from '@styles/theme'
import { loginApi } from '@api/auth'
import { useAuthStore } from '@store/authStore'
import sydLogo from '../../assets/syd-logo.png'
import toast from 'react-hot-toast'

const LoginPage: React.FC = () => {
  const { isDark } = useTheme()
  const t = isDark ? theme.dark : theme.light
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [closeHover, setCloseHover] = useState(false)
  const [notRegisteredModal, setNotRegisteredModal] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await loginApi({ email, password })
      const { token, user } = res.data.data!
      setAuth(user, token)
      toast.success(`Welcome back, ${user.name}! 🎉`)
      navigate('/')
    } catch (err: unknown) {
  const error = err as { response?: { data?: { message?: string }; status?: number } }
  const status = error.response?.status

  if (status === 404) {
    // User doesn't exist
    setNotRegisteredModal(true)
  } else if (status === 401) {
    // Wrong password
    toast.error('Incorrect password. Please try again.')
  } else if (status === 403) {
    toast.error(error.response?.data?.message || 'Account access denied')
  } else if (status === 423) {
    toast.error('Account locked. Try again in 30 minutes.')
  } else {
    toast.error('Login failed. Please try again.')
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
            width: '100%', maxWidth: '420px',
            background: t.backgroundSecondary,
            borderRadius: '20px',
            border: `1px solid ${t.border}`,
            padding: 'clamp(24px, 5vw, 40px)',
            position: 'relative',
            boxShadow: `0 25px 60px rgba(0,0,0,0.3)`,
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
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img
              src={sydLogo}
              alt="Syd & Co"
              style={{borderRadius: '8px',
                height: '52px', display: 'block', margin: '0 auto', objectFit: 'contain',
                filter: 'drop-shadow(0 4px 12px rgba(230,91,168,0.3))',
              }}
            />
          </div>

          <h1 style={{
            color: t.text, marginBottom: '6px',
            textAlign: 'center', fontSize: 'clamp(20px, 4vw, 26px)',
            fontWeight: 800,
          }}>
            Welcome Back 👋
          </h1>
          <p style={{ color: t.textSecondary, textAlign: 'center', marginBottom: '28px', fontSize: '14px' }}>
            Sign in to your Syd & Co account
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={17} style={{
                position: 'absolute', left: '14px', top: '50%',
                transform: 'translateY(-50%)', color: t.textSecondary, pointerEvents: 'none',
              }} />
              <input
                type="email" placeholder="Email address" value={email}
                onChange={(e) => setEmail(e.target.value)} required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = t.primaryDark}
                onBlur={(e) => e.target.style.borderColor = t.border}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={17} style={{
                position: 'absolute', left: '14px', top: '50%',
                transform: 'translateY(-50%)', color: t.textSecondary, pointerEvents: 'none',
              }} />
              <input
                type={showPass ? 'text' : 'password'} placeholder="Password"
                value={password} onChange={(e) => setPassword(e.target.value)} required
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
              transition: 'all 0.2s',
              marginTop: '4px',
            }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', color: t.textSecondary, fontSize: '14px' }}>
            Don't have an account?{' '}
            <Link to="/register" replace style={{ color: t.primaryDark, fontWeight: 700, textDecoration: 'none' }}>
              Register free
            </Link>
          </p>
        </div>
      </div>

      {/* Not Registered Modal */}
      {notRegisteredModal && (
        <div
          onClick={() => setNotRegisteredModal(false)}
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
              <AlertCircle size={32} color={t.primaryDark} />
            </div>

            <h2 style={{ color: t.text, fontSize: '20px', fontWeight: 800, marginBottom: '10px' }}>
              Oops! Account Not Found 😕
            </h2>
            <p style={{ color: t.textSecondary, fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              Looks like you haven't registered yet with{' '}
              <span style={{ color: t.primaryDark, fontWeight: 600 }}>{email}</span>.
              Create a free account to start shopping!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/register" replace style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%', padding: '13px',
                  borderRadius: '12px', border: 'none',
                  background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
                  color: '#fff', fontSize: '15px', fontWeight: 700,
                  cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: `0 6px 20px ${t.shadow}`,
                }}>
                  <UserPlus size={18} /> Create Account Now
                </button>
              </Link>
              <button
                onClick={() => setNotRegisteredModal(false)}
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
                Try Again
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

export default LoginPage
