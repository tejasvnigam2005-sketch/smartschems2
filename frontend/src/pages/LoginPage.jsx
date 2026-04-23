import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const emailRef = useRef(null);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { emailRef.current?.focus(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      // Check before sync clears it
      const hadPendingEligibility = !!localStorage.getItem('ss_eligibility');
      await loginUser(res.data);
      // If user had pending questionnaire data, go to results
      if (hadPendingEligibility) {
        navigate('/eligible-schemes');
      } else {
        navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      if (msg.toLowerCase().includes('verify')) {
        setError('Please verify your email before logging in. Check your inbox.');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '1.5px solid var(--color-border)', fontSize: '0.875rem', color: 'var(--color-text-primary)',
    outline: 'none', transition: 'all 0.2s ease', background: 'var(--color-surface)',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(11,110,79,0.06) 0%, var(--color-card) 50%, var(--color-surface) 100%)', padding: '20px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo & Header */}
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.3px' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
            Login to access your saved schemes & preferences
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="animate-fade-up delay-1"
          style={{
            background: 'var(--color-card)', borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            padding: '28px', border: '1px solid var(--color-border-light)',
          }}
        >
          {error && (
            <div style={{
              marginBottom: '20px', padding: '12px 16px', borderRadius: '12px',
              background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
              fontSize: '0.8125rem', color: '#DC2626', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" />
              </svg>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                ref={emailRef} type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required placeholder="you@example.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#10B981'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                  Password
                </label>
                <Link to="/forgot-password" style={{
                  fontSize: '0.75rem', color: '#0B6E4F', fontWeight: 500,
                  textDecoration: 'none', transition: 'color 0.15s',
                }}>
                  Forgot Password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: '44px' }}
                  onFocus={e => e.target.style.borderColor = '#10B981'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)',
                    padding: '4px', display: 'flex', alignItems: 'center',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', marginTop: '24px', height: '48px',
              borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #0B6E4F, #10B981)',
              color: '#fff', fontWeight: 600, fontSize: '0.875rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(11,110,79,0.2)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                }} />
                Logging in…
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Login
              </>
            )}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#0B6E4F', fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
          </p>
        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
