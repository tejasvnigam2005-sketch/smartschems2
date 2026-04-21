import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import TermsModal from '../components/auth/TermsModal';
import PrivacyModal from '../components/auth/PrivacyModal';

function PasswordStrength({ password }) {
  const getStrength = (pw) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  const strength = getStrength(password);
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#EF4444', '#F59E0B', '#3B82F6', '#10B981'];

  if (!password) return null;

  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: '3px', borderRadius: '2px',
            background: i <= strength ? colors[strength] : '#E5E7EB',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>
      <p style={{ fontSize: '0.6875rem', color: colors[strength], margin: 0, fontWeight: 500 }}>
        {labels[strength]}
      </p>
    </div>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const nameRef = useRef(null);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Modals
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => { nameRef.current?.focus(); }, []);

  const validateField = (name, value) => {
    const errs = { ...fieldErrors };
    switch (name) {
      case 'name':
        errs.name = value.length < 2 ? 'Name must be at least 2 characters' : '';
        break;
      case 'email':
        errs.email = !/^\S+@\S+\.\S+$/.test(value) ? 'Enter a valid email address' : '';
        break;
      case 'password':
        errs.password = value.length < 8 ? 'Password must be at least 8 characters' : '';
        if (form.confirmPassword && value !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
        else if (form.confirmPassword) errs.confirmPassword = '';
        break;
      case 'confirmPassword':
        errs.confirmPassword = value !== form.password ? 'Passwords do not match' : '';
        break;
    }
    setFieldErrors(errs);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    validateField(e.target.name, e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    const errs = {};
    if (form.name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setFieldErrors(errs);
    if (Object.values(errs).some(e => e)) return;

    if (!acceptedTerms) {
      setTermsError(true);
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        acceptedTerms: true
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (fieldName) => ({
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: `1.5px solid ${fieldErrors[fieldName] ? '#EF4444' : '#E5E7EB'}`,
    fontSize: '0.875rem', color: '#111827',
    outline: 'none', transition: 'all 0.2s ease',
    background: '#FAFAFA',
  });

  const EyeIcon = ({ show, onClick }) => (
    <button type="button" onClick={onClick} tabIndex={-1}
      style={{
        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF',
        padding: '4px', display: 'flex', alignItems: 'center',
      }}
      aria-label={show ? 'Hide password' : 'Show password'}
    >
      {show ? (
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
  );

  if (success) {
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
            <svg width="32" height="32" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
            🎉 Account Created!
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6 }}>
            Welcome to SmartSchemes! Redirecting you to login…
          </p>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '8px' }}>
            Please sign in with your new credentials.
          </p>
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>
            Create Account
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginTop: '6px' }}>
            Join SmartSchemes to discover government schemes
          </p>
        </div>

        {/* Form Card */}
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
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" />
              </svg>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Full Name <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                ref={nameRef} type="text" name="name" value={form.name}
                onChange={handleChange} onBlur={handleBlur}
                required minLength={2} placeholder="Your full name"
                style={inputStyle('name')}
                onFocus={e => e.target.style.borderColor = '#10B981'}
                onBlurCapture={e => { if (!fieldErrors.name) e.target.style.borderColor = '#E5E7EB'; }}
              />
              {fieldErrors.name && <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '4px', fontWeight: 500 }}>{fieldErrors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Email Address <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} onBlur={handleBlur}
                required placeholder="you@example.com"
                style={inputStyle('email')}
                onFocus={e => e.target.style.borderColor = '#10B981'}
                onBlurCapture={e => { if (!fieldErrors.email) e.target.style.borderColor = '#E5E7EB'; }}
              />
              {fieldErrors.email && <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '4px', fontWeight: 500 }}>{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Password <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} onBlur={handleBlur}
                  required minLength={8} placeholder="Min. 8 characters"
                  style={{ ...inputStyle('password'), paddingRight: '44px' }}
                  onFocus={e => e.target.style.borderColor = '#10B981'}
                  onBlurCapture={e => { if (!fieldErrors.password) e.target.style.borderColor = '#E5E7EB'; }}
                />
                <EyeIcon show={showPassword} onClick={() => setShowPassword(!showPassword)} />
              </div>
              {fieldErrors.password && <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '4px', fontWeight: 500 }}>{fieldErrors.password}</p>}
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Confirm Password <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword}
                  onChange={handleChange} onBlur={handleBlur}
                  required placeholder="Re-enter password"
                  style={{ ...inputStyle('confirmPassword'), paddingRight: '44px' }}
                  onFocus={e => e.target.style.borderColor = '#10B981'}
                  onBlurCapture={e => { if (!fieldErrors.confirmPassword) e.target.style.borderColor = '#E5E7EB'; }}
                />
                <EyeIcon show={showConfirm} onClick={() => setShowConfirm(!showConfirm)} />
              </div>
              {fieldErrors.confirmPassword && <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '4px', fontWeight: 500 }}>{fieldErrors.confirmPassword}</p>}
            </div>
          </div>

          {/* Consent Checkbox */}
          <div style={{
            marginTop: '24px', padding: '14px 16px', borderRadius: '12px',
            background: termsError ? 'rgba(239,68,68,0.04)' : '#F9FAFB',
            border: `1.5px solid ${termsError ? '#EF4444' : '#E5E7EB'}`,
            transition: 'all 0.3s ease',
            animation: termsError ? 'pulse 0.5s ease' : 'none',
          }}>
            <label style={{ display: 'flex', gap: '10px', cursor: 'pointer', alignItems: 'flex-start' }}>
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => { setAcceptedTerms(e.target.checked); setTermsError(false); }}
                style={{
                  width: '18px', height: '18px', marginTop: '2px',
                  accentColor: '#0B6E4F', cursor: 'pointer', flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: '#4B5563' }}>
                I have read and agree to the{' '}
                <button type="button" onClick={() => setShowTerms(true)}
                  style={{ color: '#0B6E4F', fontWeight: 600, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}>
                  Terms & Conditions
                </button>{' '}
                and{' '}
                <button type="button" onClick={() => setShowPrivacy(true)}
                  style={{ color: '#0B6E4F', fontWeight: 600, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}>
                  Privacy Policy
                </button>.
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#9CA3AF', marginTop: '2px' }}>
                  By creating an account, you consent to data processing as described in our Privacy Policy.
                </span>
              </span>
            </label>
            {termsError && (
              <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '8px', fontWeight: 500, marginLeft: '28px' }}>
                You must accept the Terms & Conditions to continue.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !acceptedTerms}
            style={{
              width: '100%', marginTop: '20px', height: '48px',
              borderRadius: '10px', border: 'none',
              background: acceptedTerms ? 'linear-gradient(135deg, #0B6E4F, #10B981)' : '#D1D5DB',
              color: '#fff', fontWeight: 600, fontSize: '0.875rem',
              cursor: acceptedTerms && !loading ? 'pointer' : 'not-allowed',
              opacity: acceptedTerms ? 1 : 0.6,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: acceptedTerms ? '0 4px 12px rgba(11,110,79,0.2)' : 'none',
            }}
            onClick={(e) => {
              if (!acceptedTerms) {
                e.preventDefault();
                setTermsError(true);
              }
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                }} />
                Creating Account…
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
                Create Account
              </>
            )}
          </button>

          {/* Footer text */}
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9CA3AF', marginTop: '16px', lineHeight: 1.5 }}>
            By creating an account, you agree to our{' '}
            <button type="button" onClick={() => setShowTerms(true)}
              style={{ color: '#0B6E4F', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', padding: 0, textDecoration: 'underline' }}>
              Terms
            </button>{' '}and{' '}
            <button type="button" onClick={() => setShowPrivacy(true)}
              style={{ color: '#0B6E4F', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', padding: 0, textDecoration: 'underline' }}>
              Privacy Policy
            </button>.
          </p>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#6B7280' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#0B6E4F', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
          </p>
        </form>
      </div>

      {/* Modals */}
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.01); } }
      `}</style>
    </div>
  );
}
