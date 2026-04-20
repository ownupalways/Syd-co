import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, UserPlus } from 'lucide-react';
import { useTheme } from '@context/useTheme';
import { theme } from '@styles/theme';

interface NotRegisteredModalProps {
  email: string;
  onClose: () => void;
}

const NotRegisteredModal: React.FC<NotRegisteredModalProps> = ({ email, onClose }) => {
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', background: 'rgba(0,0,0,0.7)',
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
          padding: '36px 28px', textAlign: 'center',
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
          Looks like you haven't registered yet with <span style={{ color: t.primaryDark, fontWeight: 600 }}>{email}</span>.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/register" replace style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
              background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
              color: '#fff', fontSize: '15px', fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: `0 6px 20px ${t.shadow}`,
            }}>
              <UserPlus size={18} /> Create Account Now
            </button>
          </Link>
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '12px', borderRadius: '12px',
              border: `1px solid ${t.border}`, background: 'transparent',
              color: t.textSecondary, fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default NotRegisteredModal;
