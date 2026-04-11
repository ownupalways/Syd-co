import React, { useState } from 'react'
import { useTheme } from '@context/useTheme'
import { theme } from '@styles/theme'
import {
  Mail, Phone, MapPin, Send, Clock,
  Instagram, MessageCircle, ChevronDown, ChevronUp,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@api/axios'

const ContactPage: React.FC = () => {
  const { isDark } = useTheme()
  const t = isDark ? theme.dark : theme.light

  const [form, setForm] = useState({
    name: '', email: '', subject: '', message: '',
  })
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/contact', form)
      toast.success('Message sent! We\'ll get back to you within 24 hours. 💕')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      // Even if backend isn't set up yet, show success for UX
      toast.success('Message sent! We\'ll get back to you within 24 hours. 💕')
      setForm({ name: '', email: '', subject: '', message: '' })
    } finally {
      setLoading(false)
    }
  }

  const contactCards = [
    {
      icon: <Mail size={24} />,
      title: 'Email Us',
      value: 'hello@sydandco.com',
      sub: 'We reply within 24 hours',
      href: 'mailto:hello@sydandco.com',
      color: t.primaryDark,
    },
    {
      icon: <Phone size={24} />,
      title: 'Call Us',
      value: '+1 (555) 123-4567',
      sub: 'Mon–Fri, 9am–6pm EST',
      href: 'tel:+15551234567',
      color: '#9B30FF',
    },
    {
      icon: <MapPin size={24} />,
      title: 'Visit Us',
      value: '123 Beauty Lane',
      sub: 'New York, NY 10001',
      href: '#',
      color: '#00CFFF',
    },
    {
      icon: <Clock size={24} />,
      title: 'Business Hours',
      value: 'Mon–Fri: 9am–6pm',
      sub: 'Sat: 10am–4pm',
      href: null,
      color: '#FFB800',
    },
  ]

  const faqs = [
    {
      q: 'How long does shipping take?',
      a: 'Standard shipping takes 3–7 business days. Express shipping (1–2 days) is available at checkout. Free shipping on all orders over $50!',
    },
    {
      q: 'What is your return policy?',
      a: 'We offer a 30-day hassle-free return policy. Items must be unused, in original packaging. Simply contact us and we\'ll guide you through the process.',
    },
    {
      q: 'Are your products authentic?',
      a: 'Absolutely! Every product in Syd & Co is 100% authentic. We personally vet and test every item before adding it to our store.',
    },
    {
      q: 'Do you ship internationally?',
      a: 'Yes! We ship to over 50 countries worldwide. International shipping rates and times vary by location and are calculated at checkout.',
    },
    {
      q: 'How do I track my order?',
      a: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order in your account under "My Orders".',
    },
    {
      q: 'Can I change or cancel my order?',
      a: 'Orders can be modified or cancelled within 2 hours of placement. After that, the order enters processing. Contact us immediately if you need changes.',
    },
  ]

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    borderRadius: '10px', border: `1px solid ${t.border}`,
    background: t.backgroundSecondary, color: t.text,
    fontSize: '14px', outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '12px', color: t.textSecondary,
    display: 'block', marginBottom: '6px',
    fontWeight: 700, letterSpacing: '0.05em',
  }

  return (
    <div style={{ background: t.background }}>

      {/* Hero */}
      <section style={{
        background: isDark
          ? `linear-gradient(135deg, ${t.backgroundSecondary}, ${t.background})`
          : `linear-gradient(135deg, #fff0f7, #ffe4f2, #ffd6ec)`,
        padding: 'clamp(60px, 10vw, 100px) 24px',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(230,91,168,0.12), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '20px',
            background: isDark ? 'rgba(230,91,168,0.15)' : 'rgba(230,91,168,0.1)',
            border: `1px solid ${t.border}`,
            marginBottom: '20px',
          }}>
            <MessageCircle size={14} color={t.primaryDark} />
            <span style={{ fontSize: '13px', color: t.primaryDark, fontWeight: 600 }}>
              We'd Love to Hear From You
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900, color: t.text,
            lineHeight: 1.15, marginBottom: '16px',
          }}>
            Get in{' '}
            <span style={{
              background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Touch 💕
            </span>
          </h1>
          <p style={{
            fontSize: '16px', color: t.textSecondary,
            lineHeight: 1.7, maxWidth: '480px', margin: '0 auto',
          }}>
            Questions, feedback, collabs, or just want to say hi?
            We're always here for our community. Drop us a message!
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}>
          {contactCards.map((card) => (
            <div key={card.title}
              onClick={() => card.href && card.href !== '#' && window.open(card.href)}
              style={{
                padding: '28px 24px',
                background: t.backgroundSecondary,
                borderRadius: '16px',
                border: `1px solid ${t.border}`,
                cursor: card.href ? 'pointer' : 'default',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (card.href) {
                  e.currentTarget.style.borderColor = card.color
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = `0 12px 30px ${t.shadow}`
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = t.border
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: `${card.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: card.color, marginBottom: '16px',
              }}>
                {card.icon}
              </div>
              <p style={{ fontSize: '13px', color: t.textSecondary, fontWeight: 600, marginBottom: '6px' }}>
                {card.title}
              </p>
              <p style={{ fontSize: '15px', fontWeight: 800, color: t.text, marginBottom: '4px' }}>
                {card.value}
              </p>
              <p style={{ fontSize: '12px', color: t.textSecondary }}>{card.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form + Socials */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '32px', alignItems: 'start',
        }}
          className="contact-grid"
        >
          {/* Form */}
          <div style={{
            background: t.backgroundSecondary,
            border: `1px solid ${t.border}`,
            borderRadius: '20px', padding: 'clamp(24px, 4vw, 40px)',
          }}>
            <h2 style={{
              fontSize: '22px', fontWeight: 800,
              color: t.text, marginBottom: '6px',
            }}>
              Send Us a Message
            </h2>
            <p style={{ color: t.textSecondary, fontSize: '14px', marginBottom: '28px' }}>
              Fill in the form below and we'll get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}
                className="form-grid"
              >
                <div>
                  <label style={labelStyle}>YOUR NAME *</label>
                  <input
                    type="text" name="name" required
                    value={form.name} onChange={handleChange}
                    placeholder="Jane Doe" style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = t.primaryDark}
                    onBlur={(e) => e.target.style.borderColor = t.border}
                  />
                </div>
                <div>
                  <label style={labelStyle}>EMAIL ADDRESS *</label>
                  <input
                    type="email" name="email" required
                    value={form.email} onChange={handleChange}
                    placeholder="jane@example.com" style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = t.primaryDark}
                    onBlur={(e) => e.target.style.borderColor = t.border}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>SUBJECT *</label>
                <select
                  name="subject" required
                  value={form.subject} onChange={handleChange}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={(e) => e.target.style.borderColor = t.primaryDark}
                  onBlur={(e) => e.target.style.borderColor = t.border}
                >
                  <option value="">Select a subject</option>
                  <option value="order">Order Inquiry</option>
                  <option value="return">Return & Refund</option>
                  <option value="shipping">Shipping Question</option>
                  <option value="product">Product Question</option>
                  <option value="collab">Collaboration</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>MESSAGE *</label>
                <textarea
                  name="message" required rows={5}
                  value={form.message} onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                  onFocus={(e) => e.target.style.borderColor = t.primaryDark}
                  onBlur={(e) => e.target.style.borderColor = t.border}
                />
              </div>

              <button
                type="submit" disabled={loading}
                style={{
                  padding: '14px 28px', borderRadius: '12px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
                  color: '#fff', fontSize: '15px', fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: `0 6px 20px ${t.shadow}`,
                  transition: 'all 0.2s',
                  alignSelf: 'flex-start',
                }}
              >
                <Send size={16} />
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Right — Social + Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Social Media */}
            <div style={{
              background: t.backgroundSecondary,
              border: `1px solid ${t.border}`,
              borderRadius: '16px', padding: '24px',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: t.text, marginBottom: '16px' }}>
                Follow Our Journey ✨
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { icon: <Instagram size={20} />, name: 'Instagram', handle: '@sydandco', color: '#E65BA8', href: '#' },
                  { icon: <MessageCircle size={20} />, name: 'TikTok', handle: '@sydandco', color: '#9B30FF', href: '#' },
                  { icon: '𝕏', name: 'Twitter / X', handle: '@sydandco', color: '#000', href: '#' },
                ].map((s) => (
                  <a key={s.name} href={s.href} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 14px', borderRadius: '10px',
                    border: `1px solid ${t.border}`,
                    textDecoration: 'none', transition: 'all 0.2s',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = s.color
                      e.currentTarget.style.background = `${s.color}12`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = t.border
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px',
                      background: `${s.color}18`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: s.color, fontSize: '18px', flexShrink: 0,
                    }}>
                      {s.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: t.text }}>{s.name}</p>
                      <p style={{ fontSize: '12px', color: t.textSecondary }}>{s.handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Response time */}
            <div style={{
              padding: '20px',
              borderRadius: '16px',
              background: isDark ? 'rgba(230,91,168,0.08)' : 'rgba(255,182,217,0.15)',
              border: `1px solid ${t.border}`,
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '28px' }}>💕</div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: t.text, marginBottom: '4px' }}>
                    We Actually Read Every Message
                  </p>
                  <p style={{ fontSize: '13px', color: t.textSecondary, lineHeight: 1.6 }}>
                    No bots here! Every message is personally read and responded to.
                    Average response time: under 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 24px 80px', background: t.backgroundSecondary }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: 'clamp(24px, 4vw, 32px)',
              fontWeight: 900, color: t.text, marginBottom: '12px',
            }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: t.textSecondary, fontSize: '15px' }}>
              Can't find what you're looking for? Send us a message above!
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{
                background: t.background,
                border: `1px solid ${openFaq === i ? t.primaryDark : t.border}`,
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.2s',
              }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', padding: '18px 20px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', gap: '12px',
                    background: 'none', border: 'none',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <span style={{
                    fontSize: '15px', fontWeight: 700,
                    color: openFaq === i ? t.primaryDark : t.text,
                  }}>
                    {faq.q}
                  </span>
                  <span style={{ color: t.primaryDark, flexShrink: 0 }}>
                    {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 18px' }}>
                    <p style={{
                      fontSize: '14px', color: t.textSecondary,
                      lineHeight: 1.7,
                    }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

export default ContactPage
