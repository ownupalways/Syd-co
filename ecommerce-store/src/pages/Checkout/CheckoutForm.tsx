import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { useTheme } from "@context/useTheme";
import { theme } from "@styles/theme";
import { useCartStore } from "@store/cartStore";
import api from "@api/axios";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";

interface ShippingForm {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
}

interface Props {
    clientSecret: string;
    paymentIntentId: string;
    total: number;
    subtotal: number;
    shippingCost: number;
    shippingAddress: ShippingForm;
}

const CheckoutForm: React.FC<Props> = ({
    clientSecret,
    paymentIntentId,
    total,
    subtotal,
    shippingCost,
    shippingAddress,
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const t = isDark ? theme.dark : theme.light;
    const { items, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        try {
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) return;

            const { error, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: { card: cardElement },
                },
            );

            if (error) {
                toast.error(error.message || "Payment failed");
                return;
            }

            if (paymentIntent?.status === "succeeded") {
                const orderItems = items.map((item) => ({
                    productId: item.product._id,
                    quantity: item.quantity,
                }));

                const res = await api.post("/orders", {
                    items: orderItems,
                    shippingAddress,
                    paymentIntentId,
                    total,
                    subtotal,
                    shippingCost,
                });

                clearCart();
                toast.success("Order placed successfully! 🎉");
                navigate(`/order-success/${res.data.data.orderId}`);
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            {/* Card Input Wrapper */}
            <div className="card-input-container"
                style={{
                    padding: "16px", // Reduced from 20px for mobile-first
                    borderRadius: "12px",
                    border: `1px solid ${t.border}`,
                    background: t.background,
                    marginBottom: "16px",
                    width: "100%",
                    boxSizing: "border-box"
                }}>
                <p
                    style={{
                        fontSize: "11px",
                        color: t.textSecondary,
                        marginBottom: "14px",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                    }}>
                    CARD DETAILS
                </p>
                {/* 2. The Stripe Element */}
                <div style={{ width: '100%', overflow: 'hidden' }}>
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "16px", // Prevents iOS auto-zoom
                                    color: isDark ? "#ffffff" : "#333333",
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                    '::placeholder': { color: isDark ? "#666" : "#aaa" },
                                },
                                invalid: { color: "#ef4444" },
                            },
                        }}
                    />
                </div>
            </div>

            {/* Security note */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
                color: t.textSecondary,
                fontSize: "12px",
            }}>
                <Lock size={13} />
                <span>Secured by Stripe. We never store your card details.</span>
            </div>

            {/* Pay button */}
            <button
                type="submit"
                disabled={loading || !stripe}
                className="pay-button"
                style={{
                    width: "100%",
                    padding: "15px",
                    borderRadius: "12px",
                    border: "none",
                    background: loading || !stripe
                            ? t.border
                            : `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: 700,
                    cursor: loading || !stripe ? "not-allowed" : "pointer",
                    boxShadow: loading ? "none" : `0 8px 25px ${t.shadow}`,
                    transition: "all 0.2s",
                }}>
                {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
            </button>

            {/* Test hint */}
            <div style={{
                marginTop: "14px",
                padding: "12px",
                borderRadius: "10px",
                background: isDark ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.08)",
                border: "1px solid rgba(59,130,246,0.2)",
                fontSize: "12px",
                color: "#3b82f6",
                lineHeight: "1.4"
            }}>
                🧪 <strong>Test:</strong> 4242 4242 4242 4242 · Any date · Any CVC
            </div>

            <style>{`
                .checkout-form {
                    width: 100%;
                    max-width: 100%;
                }
                
                @media (max-width: 480px) {
                    .card-input-container {
                        padding: 12px !important;
                    }
                    .pay-button {
                        padding: 14px !important;
                        font-size: 15px !important;
                    }
                }
            `}</style>
        </form>
    );
};

export default CheckoutForm;
