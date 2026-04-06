import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useTheme } from '@context/useTheme'
import { theme } from '@styles/theme'
import { useCartStore } from '@store/cartStore'
import { useAuthStore } from '@store/authStore'
import api from '@api/axios'
import { saveAddressApi } from '@api/auth'
import toast from 'react-hot-toast'
import { ArrowLeft, Package, MapPin, Edit3 } from 'lucide-react'
import CheckoutForm from './CheckoutForm'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

interface ShippingForm {
  fullName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

const CheckoutPage: React.FC = () => {
  const { isDark } = useTheme()
  const t = isDark ? theme.dark : theme.light
  const { items, total } = useCartStore()
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()

  const [clientSecret, setClientSecret] = useState('')
  const [paymentIntentId, setPaymentIntentId] = useState('')
  const [pricing, setPricing] = useState({ total: 0, subtotal: 0, shippingCost: 0 })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping')
  const [saveAddress, setSaveAddress] = useState(true)
  const [usingSaved, setUsingSaved] = useState(false)

  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    fullName: user?.address?.fullName || user?.name || '',
    address: user?.address?.address || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
    phone: user?.address?.phone || user?.phone || '',
  })

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    if (items.length === 0) { navigate('/cart'); return }
  }, [isAuthenticated, items, navigate])

  // Auto-detect if user has saved address
  useEffect(() => {
    if (user?.address?.address) setUsingSaved(true)
  }, [user])

  const createPaymentIntent = async () => {
    setLoading(true)
    try {
      const res = await api.post('/orders/payment-intent', {
        items: items.map((i) => ({
          productId: i.product._id,
          quantity: i.quantity,
        })),
      })

      setClientSecret(res.data.data.clientSecret)
      setPaymentIntentId(res.data.data.paymentIntentId)
      setPricing({
        total: res.data.data.total,
        subtotal: res.data.data.subtotal,
        shippingCost: res.data.data.shippingCost,
      })

      // Save address to profile if checked
      if (saveAddress) {
        try {
          await saveAddressApi(shippingForm)
        } catch {
          // Non-blocking
        }
      }

      setStep('payment')
    } catch {
      toast.error('Failed to initialize payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    const { fullName, address, city, state, zipCode, country, phone } = shippingForm
    if (!fullName || !address || !city || !state || !zipCode || !country || !phone) {
      toast.error('Please fill in all required fields')
      return
    }
    createPaymentIntent()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    borderRadius: '10px', border: `1px solid ${t.border}`,
    background: t.background, color: t.text,
    fontSize: '14px', outline: 'none',
    transition: 'border-color 0.2s',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '11px', color: t.textSecondary,
    display: 'block', marginBottom: '6px',
    fontWeight: 700, letterSpacing: '0.05em',
  }

  return (
    <div style={{ background: t.background, minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Back */}
        <button onClick={() => navigate('/cart')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: t.textSecondary,
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '14px', fontWeight: 600, marginBottom: '24px',
          padding: '8px 0',
        }}>
          <ArrowLeft size={16} /> Back to Cart
        </button>

        <h1 style={{
          fontSize: 'clamp(22px, 4vw, 30px)',
          fontWeight: 800, color: t.text, marginBottom: '6px',
        }}>
          Checkout
        </h1>

        {/* Progress Steps */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '8px', marginBottom: '28px',
        }}>
          {(['shipping', 'payment'] as const).map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: step === s || (s === 'shipping' && step === 'payment')
                    ? t.primaryDark : t.border,
                  color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 800,
                }}>
                  {s === 'shipping' && step === 'payment' ? '✓' : i + 1}
                </div>
                <span style={{
                  fontSize: '14px', fontWeight: 600,
                  color: step === s ? t.text : t.textSecondary,
                  textTransform: 'capitalize',
                }}>
                  {s}
                </span>
              </div>
              {i === 0 && (
                <div style={{
                  flex: 1, height: '2px',
                  background: step === 'payment' ? t.primaryDark : t.border,
                  transition: 'background 0.3s',
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '24px', alignItems: 'start',
        }}
          className="checkout-grid"
        >
          {/* LEFT */}
          <div>
            {/* SHIPPING STEP */}
            {step === 'shipping' && (
              <div style={{
                background: t.backgroundSecondary,
                border: `1px solid ${t.border}`,
                borderRadius: '16px', padding: '24px',
              }}>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: t.text, marginBottom: '20px' }}>
                  Shipping Address
                </h2>

                {/* Saved address banner */}
                {user?.address?.address && (
                  <div style={{
                    padding: '14px 16px', borderRadius: '12px',
                    border: `1px solid ${usingSaved ? t.primaryDark : t.border}`,
                    background: usingSaved
                      ? isDark ? 'rgba(230,91,168,0.08)' : 'rgba(255,182,217,0.1)'
                      : t.background,
                    marginBottom: '20px',
                    transition: 'all 0.2s',
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'flex-start',
                      justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
                    }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <MapPin size={16} color={t.primaryDark} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: 700, color: t.text, marginBottom: '3px' }}>
                            {user.address.fullName}
                          </p>
                          <p style={{ fontSize: '12px', color: t.textSecondary, lineHeight: 1.5 }}>
                            {user.address.address}, {user.address.city},{' '}
                            {user.address.state} {user.address.zipCode}
                          </p>
                          <p style={{ fontSize: '12px', color: t.textSecondary }}>
                            {user.address.phone}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => {
                            setShippingForm({
                              fullName: user.address!.fullName,
                              phone: user.address!.phone,
                              address: user.address!.address,
                              city: user.address!.city,
                              state: user.address!.state,
                              zipCode: user.address!.zipCode,
                              country: user.address!.country,
                            })
                            setUsingSaved(true)
                          }}
                          style={{
                            padding: '6px 12px', borderRadius: '8px',
                            fontSize: '12px', fontWeight: 700, border: 'none',
                            cursor: 'pointer',
                            background: usingSaved
                              ? `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`
                              : t.backgroundSecondary,
                            color: usingSaved ? '#fff' : t.text,
                          }}
                        >
                          {usingSaved ? '✓ Using saved' : 'Use this'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShippingForm({
                              fullName: '', phone: '', address: '',
                              city: '', state: '', zipCode: '', country: '',
                            })
                            setUsingSaved(false)
                          }}
                          style={{
                            padding: '6px 12px', borderRadius: '8px',
                            fontSize: '12px', fontWeight: 600,
                            border: `1px solid ${t.border}`,
                            cursor: 'pointer', background: 'transparent',
                            color: t.textSecondary,
                            display: 'flex', alignItems: 'center', gap: '4px',
                          }}
                        >
                          <Edit3 size={11} /> New
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={labelStyle}>FULL NAME *</label>
                      <input
                        type="text" required value={shippingForm.fullName}
                        onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                        style={inputStyle} placeholder="Jane Doe"
                        onFocus={(e) => e.target.style.borderColor = t.primaryDark}
                        onBlur={(e) => e.target.style.borderColor = t.border}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>PHONE *</label>
                      <input
                        type="tel" required value={shippingForm.phone}
                        onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                        style={inputStyle} placeholder="+1 555 000 0000"
                        onFocus={(e) => e.target.style.borderColor = t.primaryDark}
                        onBlur={(e) => e.target.style.borderColor = t.border}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>STREET ADDRESS *</label>
                    <input
                      type="text" required value={shippingForm.address}
                      onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                      style={inputStyle} placeholder="123 Main Street, Apt 4B"
                      onFocus={(e) => e.target.style.borderColor = t.primaryDark}
                      onBlur={(e) => e.target.style.borderColor = t.border}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={labelStyle}>CITY *</label>
                      <input
                        type="text" required value={shippingForm.city}
                        onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                        style={inputStyle} placeholder="New York"
                        onFocus={(e) => e.target.style.borderColor = t.primaryDark}
                        onBlur={(e) => e.target.style.borderColor = t.border}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>STATE *</label>
                      <input
                        type="text" required value={shippingForm.state}
                        onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                        style={inputStyle} placeholder="NY"
                        onFocus={(e) => e.target.style.borderColor = t.primaryDark}
                        onBlur={(e) => e.target.style.borderColor = t.border}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={labelStyle}>ZIP CODE *</label>
                      <input
                        type="text" required value={shippingForm.zipCode}
                        onChange={(e) => setShippingForm({ ...shippingForm, zipCode: e.target.value })}
                        style={inputStyle} placeholder="10001"
                        onFocus={(e) => e.target.style.borderColor = t.primaryDark}
                        onBlur={(e) => e.target.style.borderColor = t.border}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>COUNTRY *</label>
                      <input
                        type="text" required value={shippingForm.country}
                        onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value })}
                        style={inputStyle} placeholder="United States"
                        onFocus={(e) => e.target.style.borderColor = t.primaryDark}
                        onBlur={(e) => e.target.style.borderColor = t.border}
                      />
                    </div>
                  </div>

                  {/* Save address checkbox */}
                  <div
                    onClick={() => setSaveAddress(!saveAddress)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '12px 14px', borderRadius: '10px',
                      border: `1px solid ${saveAddress ? t.primaryDark : t.border}`,
                      background: saveAddress
                        ? isDark ? 'rgba(230,91,168,0.08)' : 'rgba(255,182,217,0.1)'
                        : 'transparent',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '6px',
                      border: `2px solid ${saveAddress ? t.primaryDark : t.border}`,
                      background: saveAddress ? t.primaryDark : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.2s',
                    }}>
                      {saveAddress && (
                        <span style={{ color: '#fff', fontSize: '12px', fontWeight: 800 }}>✓</span>
                      )}
                    </div>
                    <span style={{ fontSize: '13px', color: t.text, fontWeight: 600 }}>
                      Save this address to my profile for future orders
                    </span>
                  </div>

                  {/* Continue button */}
                  <button
                    onClick={handleContinue}
                    disabled={loading}
                    style={{
                      width: '100%', padding: '14px',
                      borderRadius: '12px', border: 'none',
                      background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
                      color: '#fff', fontSize: '15px', fontWeight: 700,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1,
                      boxShadow: `0 6px 20px ${t.shadow}`,
                      marginTop: '4px',
                    }}
                  >
                    {loading ? 'Processing...' : 'Continue to Payment →'}
                  </button>
                </div>
              </div>
            )}

            {/* PAYMENT STEP */}
            {step === 'payment' && clientSecret && (
              <div style={{
                background: t.backgroundSecondary,
                border: `1px solid ${t.border}`,
                borderRadius: '16px', padding: '24px',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', marginBottom: '20px',
                }}>
                  <h2 style={{ fontSize: '17px', fontWeight: 700, color: t.text }}>
                    Payment Details
                  </h2>
                  <button onClick={() => setStep('shipping')} style={{
                    fontSize: '13px', color: t.primaryDark,
                    background: 'none', border: 'none',
                    cursor: 'pointer', fontWeight: 600,
                  }}>
                    ← Edit Shipping
                  </button>
                </div>

                {/* Shipping summary */}
                <div style={{
                  padding: '12px 16px', borderRadius: '10px',
                  background: t.background, border: `1px solid ${t.border}`,
                  marginBottom: '20px', fontSize: '13px', color: t.textSecondary,
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <MapPin size={14} color={t.primaryDark} />
                  <span>
                    {shippingForm.fullName} · {shippingForm.address},{' '}
                    {shippingForm.city}, {shippingForm.state}
                  </span>
                </div>

                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm
                    clientSecret={clientSecret}
                    paymentIntentId={paymentIntentId}
                    total={pricing.total}
                    subtotal={pricing.subtotal}
                    shippingCost={pricing.shippingCost}
                    shippingAddress={shippingForm}
                  />
                </Elements>
              </div>
            )}
          </div>

          {/* RIGHT — Order Summary */}
          <div style={{
            background: t.backgroundSecondary,
            border: `1px solid ${t.border}`,
            borderRadius: '16px', padding: '20px',
            position: 'sticky', top: '90px',
          }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: t.text, marginBottom: '16px' }}>
              Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h2>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {items.map(({ product, quantity }) => (
                <div key={product._id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img src={product.image} alt={product.name} style={{
                      width: '44px', height: '44px',
                      objectFit: 'cover', borderRadius: '8px',
                      border: `1px solid ${t.border}`,
                    }} />
                    <span style={{
                      position: 'absolute', top: '-5px', right: '-5px',
                      background: t.primaryDark, color: '#fff',
                      borderRadius: '50%', width: '16px', height: '16px',
                      fontSize: '10px', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {quantity}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: '13px', fontWeight: 600, color: t.text,
                      lineHeight: 1.3,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {product.name}
                    </p>
                    <p style={{ fontSize: '11px', color: t.textSecondary }}>{product.category}</p>
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: t.primaryDark, flexShrink: 0 }}>
                    ${(product.price * quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{
              borderTop: `1px solid ${t.border}`,
              paddingTop: '14px',
              display: 'flex', flexDirection: 'column', gap: '8px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: t.textSecondary, fontSize: '13px' }}>Subtotal</span>
                <span style={{ color: t.text, fontWeight: 600, fontSize: '13px' }}>
                  ${total().toFixed(2)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: t.textSecondary, fontSize: '13px' }}>Shipping</span>
                <span style={{
                  fontWeight: 600, fontSize: '13px',
                  color: total() >= 50 ? '#00e5a0' : t.text,
                }}>
                  {total() >= 50 ? '🎉 Free' : '$9.99'}
                </span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                paddingTop: '10px', borderTop: `1px solid ${t.border}`,
              }}>
                <span style={{ color: t.text, fontWeight: 800, fontSize: '16px' }}>Total</span>
                <span style={{ color: t.primaryDark, fontWeight: 800, fontSize: '18px' }}>
                  ${(total() + (total() >= 50 ? 0 : 9.99)).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Free shipping nudge */}
            <div style={{
              marginTop: '14px', padding: '10px 12px',
              borderRadius: '10px',
              background: total() >= 50 ? 'rgba(0,229,160,0.08)' : isDark ? 'rgba(230,91,168,0.08)' : 'rgba(255,182,217,0.15)',
              border: `1px solid ${total() >= 50 ? 'rgba(0,229,160,0.25)' : t.border}`,
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <Package size={14} color={total() >= 50 ? '#00e5a0' : t.primaryDark} />
              <span style={{
                fontSize: '12px', fontWeight: 600,
                color: total() >= 50 ? '#00e5a0' : t.primaryDark,
              }}>
                {total() >= 50
                  ? 'You qualify for free shipping!'
                  : `Add $${(50 - total()).toFixed(2)} more for free shipping`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

export default CheckoutPage
