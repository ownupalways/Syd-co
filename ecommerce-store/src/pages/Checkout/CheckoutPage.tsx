import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { useTheme } from '@context/useTheme'
import { theme } from '@styles/theme'
import { useCartStore } from '@store/cartStore'
import { useAuthStore } from '@store/authStore'
import api from '@api/axios'
import toast from 'react-hot-toast'
import { Lock, ArrowLeft, Package } from 'lucide-react'

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

const CheckoutForm: React.FC<{
  clientSecret: string
  paymentIntentId: string
  total: number
  subtotal: number
  shippingCost: number
  shippingAddress: ShippingForm
}> = ({ clientSecret, paymentIntentId, total, subtotal, shippingCost, shippingAddress }) => {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const t = isDark ? theme.dark : theme.light
  const { items, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    try {
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) return

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      })

      if (error) {
        toast.error(error.message || 'Payment failed')
        setLoading(false)
        return
      }

      if (paymentIntent?.status === 'succeeded') {
        // Create order in DB
        const orderItems = items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        }))

        const res = await api.post('/orders', {
          items: orderItems,
          shippingAddress,
          paymentIntentId,
          total,
          subtotal,
          shippingCost,
        })

        clearCart()
        toast.success('Order placed successfully! 🎉')
        navigate(`/order-success/${res.data.data.orderId}`)
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${t.border}`,
        background: t.backgroundSecondary,
        marginBottom: '20px',
      }}>
        <p style={{ fontSize: '13px', color: t.textSecondary, marginBottom: '12px', fontWeight: 600 }}>
          CARD DETAILS
        </p>
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: isDark ? '#ffffff' : '#333333',
              fontFamily: 'system-ui, sans-serif',
              '::placeholder': { color: isDark ? '#888' : '#aaa' },
            },
            invalid: { color: '#ef4444' },
          },
        }} />
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        marginBottom: '16px', color: t.textSecondary, fontSize: '13px',
      }}>
        <Lock size={14} />
        <span>Your payment is secured by Stripe. We never store card details.</span>
      </div>

      <button type="submit" disabled={loading || !stripe} style={{
        width: '100%', padding: '16px',
        borderRadius: '12px', border: 'none',
        background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
        color: '#fff', fontSize: '16px', fontWeight: 700,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
        boxShadow: `0 8px 25px ${t.shadow}`,
      }}>
        {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  )
}

const CheckoutPage: React.FC = () => {
  const { isDark } = useTheme()
  const t = isDark ? theme.dark : theme.light
  const { items, total } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const [clientSecret, setClientSecret] = useState('')
  const [paymentIntentId, setPaymentIntentId] = useState('')
  const [pricing, setPricing] = useState({ total: 0, subtotal: 0, shippingCost: 0 })
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping')
  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    fullName: '', address: '', city: '',
    state: '', zipCode: '', country: 'United States', phone: '',
  })

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    if (items.length === 0) { navigate('/cart'); return }
  }, [isAuthenticated, items, navigate])

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
      setStep('payment')
    } catch {
      toast.error('Failed to initialize payment')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    borderRadius: '10px', border: `1px solid ${t.border}`,
    background: t.backgroundSecondary, color: t.text,
    fontSize: '14px', outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{ background: t.background, minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <button onClick={() => navigate('/cart')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: t.textSecondary, display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '14px', fontWeight: 600,
          }}>
            <ArrowLeft size={18} /> Back to Cart
          </button>
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 800, color: t.text, marginBottom: '8px' }}>
          Checkout
        </h1>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', alignItems: 'center' }}>
          {['shipping', 'payment'].map((s, i) => (
            <React.Fragment key={s}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: step === s || (s === 'shipping' && step === 'payment')
                    ? t.primaryDark : t.border,
                  color: '#fff', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 700,
                }}>
                  {i + 1}
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
                <div style={{ flex: 1, height: '2px', background: step === 'payment' ? t.primaryDark : t.border }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: '24px',
          alignItems: 'start',
        }}
          className="checkout-grid"
        >
          {/* Left — Form */}
          <div>
            {step === 'shipping' && (
              <div style={{
                background: t.backgroundSecondary,
                border: `1px solid ${t.border}`,
                borderRadius: '16px', padding: '28px',
              }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: t.text, marginBottom: '20px' }}>
                  Shipping Address
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: t.textSecondary, display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                      FULL NAME *
                    </label>
                    <input
                      type="text" required value={shippingForm.fullName}
                      onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                      style={inputStyle} placeholder="John Doe"
                      onFocus={(e) => e.target.style.borderColor = t.primaryDark}
                      onBlur={(e) => e.target.style.borderColor = t.border}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: t.textSecondary, display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                      PHONE *
                    </label>
                    <input
                      type="tel" required value={shippingForm.phone}
                      onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                      style={inputStyle} placeholder="+1 (555) 000-0000"
                      onFocus={(e) => e.target.style.borderColor = t.primaryDark}
                      onBlur={(e) => e.target.style.borderColor = t.border}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: t.textSecondary, display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                      ADDRESS *
                    </label>
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
                      <label style={{ fontSize: '12px', color: t.textSecondary, display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                        CITY *
                      </label>
                      <input
                        type="text" required value={shippingForm.city}
                        onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                        style={inputStyle} placeholder="New York"
                        onFocus={(e) => e.target.style.borderColor = t.primaryDark}
                        onBlur={(e) => e.target.style.borderColor = t.border}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: t.textSecondary, display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                        STATE *
                      </label>
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
                      <label style={{ fontSize: '12px', color: t.textSecondary, display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                        ZIP CODE *
                      </label>
                      <input
                        type="text" required value={shippingForm.zipCode}
                        onChange={(e) => setShippingForm({ ...shippingForm, zipCode: e.target.value })}
                        style={inputStyle} placeholder="10001"
                        onFocus={(e) => e.target.style.borderColor = t.primaryDark}
                        onBlur={(e) => e.target.style.borderColor = t.border}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: t.textSecondary, display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                        COUNTRY *
                      </label>
                      <input
                        type="text" required value={shippingForm.country}
                        onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value })}
                        style={inputStyle} placeholder="United States"
                        onFocus={(e) => e.target.style.borderColor = t.primaryDark}
                        onBlur={(e) => e.target.style.borderColor = t.border}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const { fullName, address, city, state, zipCode, country, phone } = shippingForm
                      if (!fullName || !address || !city || !state || !zipCode || !country || !phone) {
                        toast.error('Please fill in all fields')
                        return
                      }
                      createPaymentIntent()
                    }}
                    disabled={loading}
                    style={{
                      width: '100%', padding: '14px',
                      borderRadius: '12px', border: 'none',
                      background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
                      color: '#fff', fontSize: '15px', fontWeight: 700,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      marginTop: '8px',
                    }}
                  >
                    {loading ? 'Processing...' : 'Continue to Payment →'}
                  </button>
                </div>
              </div>
            )}

            {step === 'payment' && clientSecret && (
              <div style={{
                background: t.backgroundSecondary,
                border: `1px solid ${t.border}`,
                borderRadius: '16px', padding: '28px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: t.text }}>
                    Payment Details
                  </h2>
                  <button onClick={() => setStep('shipping')} style={{
                    fontSize: '13px', color: t.primaryDark,
                    background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600,
                  }}>
                    ← Edit Shipping
                  </button>
                </div>

                {/* Shipping summary */}
                <div style={{
                  padding: '12px 16px', borderRadius: '10px',
                  background: t.background, border: `1px solid ${t.border}`,
                  marginBottom: '20px', fontSize: '13px', color: t.textSecondary,
                }}>
                  📦 {shippingForm.fullName} · {shippingForm.address}, {shippingForm.city}, {shippingForm.state}
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

                {/* Test card hint */}
                <div style={{
                  marginTop: '16px', padding: '12px 16px',
                  borderRadius: '10px', background: 'rgba(59,130,246,0.08)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  fontSize: '12px', color: '#3b82f6',
                }}>
                  🧪 Test card: <strong>4242 4242 4242 4242</strong> · Any future date · Any CVC
                </div>
              </div>
            )}
          </div>

          {/* Right — Order Summary */}
          <div style={{
            background: t.backgroundSecondary,
            border: `1px solid ${t.border}`,
            borderRadius: '16px', padding: '24px',
            position: 'sticky', top: '90px',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: t.text, marginBottom: '16px' }}>
              Order Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {items.map(({ product, quantity }) => (
                <div key={product._id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={product.image} alt={product.name} style={{
                      width: '48px', height: '48px',
                      objectFit: 'cover', borderRadius: '8px',
                      border: `1px solid ${t.border}`,
                    }} />
                    <span style={{
                      position: 'absolute', top: '-6px', right: '-6px',
                      background: t.primaryDark, color: '#fff',
                      borderRadius: '50%', width: '18px', height: '18px',
                      fontSize: '11px', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {quantity}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: t.text, lineHeight: 1.3 }}>
                      {product.name}
                    </p>
                    <p style={{ fontSize: '12px', color: t.textSecondary }}>{product.category}</p>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: t.primaryDark }}>
                    ${(product.price * quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: t.textSecondary, fontSize: '14px' }}>Subtotal</span>
                <span style={{ color: t.text, fontWeight: 600 }}>${total().toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: t.textSecondary, fontSize: '14px' }}>Shipping</span>
                <span style={{ color: total() >= 50 ? 'green' : t.text, fontWeight: 600 }}>
                  {total() >= 50 ? 'Free' : '$9.99'}
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

            <div style={{
              marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 14px', borderRadius: '10px',
              background: isDark ? 'rgba(0,229,160,0.08)' : 'rgba(0,229,160,0.1)',
              border: '1px solid rgba(0,229,160,0.2)',
            }}>
              <Package size={16} color="#00e5a0" />
              <span style={{ fontSize: '12px', color: '#00e5a0', fontWeight: 600 }}>
                {total() >= 50 ? 'You qualify for free shipping!' : `Add $${(50 - total()).toFixed(2)} more for free shipping`}
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
