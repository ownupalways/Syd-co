import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { useTheme } from '@context/useTheme';
import { theme } from '@styles/theme';
import { registerApi } from '@api/auth';
import { useAuthStore } from "@store/authStore";
import { User as UserType } from "@typings/index";
import AuthInput from './components/AuthInput';
import AlreadyExistsModal from './components/AlreadyExistsModal';
import sydLogo from '../../assets/syd-logo.webp';



interface RegisterResponse {
	data: {
		data: {
			user: UserType; // ← was UserProfile
			token: string;
		};
	};
}

interface ApiError {
    response?: {
        status?: number;
        data?: { message?: string };
    };
}

const RegisterPage: React.FC = () => {
    const { isDark } = useTheme();
    const t = isDark ? theme.dark : theme.light;
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);

    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [closeHover, setCloseHover] = useState(false);
    const [alreadyExistsModal, setAlreadyExistsModal] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = (await registerApi(form)) as RegisterResponse;
            const { user } = res.data.data;

            setAuth(user);  // ← was setAuth(user, token) — store only needs user ✓

            toast.success(`Welcome to Syd & Co, ${user.name}! 🎉`);
            navigate("/");
        } catch (err: unknown) {
            const error = err as ApiError;
            const message = error.response?.data?.message || "";
            const status = error.response?.status;

            if (status === 409 || message.toLowerCase().includes("already")) {
                setAlreadyExistsModal(true);
            } else {
                toast.error(message || "Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const perks = ['Free shipping on $50+', 'Exclusive member deals', 'Easy returns'];

    return (
        <div
            onClick={() => navigate(-1)}
            style={{
                position: 'fixed', inset: 0, zIndex: 200, display: 'flex',
                alignItems: 'center', justifyContent: 'center', padding: '16px',
                background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', overflowY: 'auto',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: '100%', maxWidth: '440px', background: t.backgroundSecondary,
                    borderRadius: '20px', border: `1px solid ${t.border}`,
                    padding: 'clamp(24px, 5vw, 40px)', position: 'relative',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.3)', margin: 'auto',
                }}
            >
                <button
                    onClick={() => navigate(-1)}
                    onMouseEnter={() => setCloseHover(true)}
                    onMouseLeave={() => setCloseHover(false)}
                    style={{
                        position: 'absolute', top: '16px', right: '16px', background: 'none',
                        border: 'none', cursor: 'pointer', color: closeHover ? t.primaryDark : t.textSecondary,
                        padding: '6px', borderRadius: '8px', transition: 'all 0.2s',
                    }}
                >
                    <X size={18} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <img src={sydLogo} alt="Syd & Co" style={{ height: '52px', filter: 'drop-shadow(0 4px 12px rgba(230,91,168,0.3))' }} />
                    <h1 style={{ color: t.text, marginTop: '16px', fontSize: '24px', fontWeight: 800 }}>Join Syd & Co ✨</h1>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' }}>
                    {perks.map((perk) => (
                        <span key={perk} style={{
                            padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                            background: isDark ? 'rgba(230,91,168,0.12)' : 'rgba(255,182,217,0.2)',
                            color: t.primaryDark, border: `1px solid ${t.border}`,
                        }}>
                            <CheckCircle size={11} style={{ marginRight: '4px' }} /> {perk}
                        </span>
                    ))}
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <AuthInput icon={User} name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
                    <AuthInput icon={Mail} name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required />
                    <AuthInput icon={Phone} name="phone" type="tel" placeholder="Phone (optional)" value={form.phone} onChange={handleChange} />
                    <AuthInput icon={Lock} name="password" type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={handleChange} required />

                    <button
                        type="submit" disabled={loading}
                        style={{
                            background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
                            color: '#fff', border: 'none', padding: '14px', borderRadius: '12px',
                            fontSize: '16px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1, marginTop: '8px',
                        }}
                    >
                        {loading ? 'Creating account...' : 'Create Account Free'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', color: t.textSecondary, fontSize: '14px' }}>
                    Already have an account? <Link to="/login" replace style={{ color: t.primaryDark, fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
                </p>
            </div>

            {alreadyExistsModal && (
                <AlreadyExistsModal email={form.email} onClose={() => setAlreadyExistsModal(false)} />
            )}
        </div>
    );
};

export default RegisterPage;
