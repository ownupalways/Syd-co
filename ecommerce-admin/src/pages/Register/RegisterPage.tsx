import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      await axios.post('/api/v1/admin/auth/register', form)
      toast.success('Registration submitted! Awaiting super-admin approval.')
      navigate('/login')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'name', type: 'text', placeholder: 'Full name', icon: <User size={16} /> },
    { name: 'email', type: 'email', placeholder: 'Email address', icon: <Mail size={16} /> },
    { name: 'phone', type: 'tel', placeholder: 'Phone (optional)', icon: <Phone size={16} /> },
  ]

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '-200px', right: '-200px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(191,0,255,0.15), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%', maxWidth: '420px',
          background: 'var(--bg-card)',
          borderRadius: '24px',
          border: '1px solid var(--glass-border)',
          padding: '40px',
        }}
      >
        <Link to="/login" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: 'var(--text-secondary)', fontSize: '13px',
          textDecoration: 'none', marginBottom: '24px',
        }}>
          <ArrowLeft size={14} /> Back to login
        </Link>

        <h1 className="gradient-text" style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
          Request Access
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '28px' }}>
          Your account will be reviewed by a super-admin before activation.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {fields.map((f) => (
            <div key={f.name} style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '14px', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-secondary)',
                pointerEvents: 'none',
              }}>
                {f.icon}
              </span>
              <input
                type={f.type} placeholder={f.placeholder}
                value={form[f.name as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                required={f.name !== 'phone'}
                style={{
                  width: '100%', padding: '12px 12px 12px 42px',
                  borderRadius: '12px', border: '1px solid var(--border)',
                  background: 'var(--bg-hover)', color: 'var(--text)',
                  fontSize: '14px', outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--pink)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          ))}

          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{
              position: 'absolute', left: '14px', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-secondary)',
              pointerEvents: 'none',
            }} />
            <input
              type={showPass ? 'text' : 'password'} placeholder="Password (min 8 chars)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              style={{
                width: '100%', padding: '12px 42px 12px 42px',
                borderRadius: '12px', border: '1px solid var(--border)',
                background: 'var(--bg-hover)', color: 'var(--text)',
                fontSize: '14px', outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--pink)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{
              position: 'absolute', right: '14px', top: '50%',
              transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <motion.button
            type="submit" disabled={loading}
            whileTap={{ scale: 0.98 }}
            className="gradient-btn"
            style={{ padding: '13px', fontSize: '14px', fontWeight: 700, borderRadius: '12px', marginTop: '6px' }}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export default RegisterPage
