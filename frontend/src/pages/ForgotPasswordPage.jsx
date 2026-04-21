import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';

export default function ForgotPasswordPage() {
  const emailRef = useRef(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { emailRef.current?.focus(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (resetError) throw resetError;
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '1.5px solid #E5E7EB', fontSize: '0.875rem', color: '#111827',
    outline: 'none', transition: 'all 0.2s ease', background: '#FAFAFA',
  };

  if (sent) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #F0FDF4 0%, #fff 50%, #F9FAFB 100%)', padding: '20px',
      }}>
        <div className="animate-fade-up" style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
          }}>
            <svg width="28" height="28" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
            Check your email
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, marginBottom: '24px' }}>
            We've sent a password reset link to <strong style={{ color: '#111827' }}>{email}</strong>.
            Click the link in the email to reset your password.
          </p>
          <Link to="/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: '#0B6E4F', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none',
          }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #F0FDF4 0%, #fff 50%, #F9FAFB 100%)', padding: '20px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #0B6E4F, #10B981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '1.125rem',
            margin: '0 auto 16px',
            boxShadow: '0 4px 16px rgba(11,110,79,0.25)',
          }}>
            S
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>
            Reset Password
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginTop: '6px' }}>
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="animate-fade-up delay-1"
          style={{
            background: '#fff', borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            padding: '28px', border: '1px solid #F3F4F6',
          }}
        >
          {error && (
            <div style={{
              marginBottom: '20px', padding: '12px 16px', borderRadius: '12px',
              background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
              fontSize: '0.8125rem', color: '#DC2626', fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              ref={emailRef} type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              required placeholder="you@example.com"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#10B981'}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', marginTop: '20px', height: '48px',
              borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #0B6E4F, #10B981)',
              color: '#fff', fontWeight: 600, fontSize: '0.875rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 4px 12px rgba(11,110,79,0.2)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite',
                }} />
                Sending…
              </>
            ) : 'Send Reset Link'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#6B7280', marginTop: '20px' }}>
            <Link to="/login" style={{ color: '#0B6E4F', fontWeight: 600, textDecoration: 'none' }}>
              ← Back to Login
            </Link>
          </p>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
