import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await signup({ name: form.name, email: form.email, password: form.password });
      loginUser(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #F0FDF4 0%, #fff 50%, #F9FAFB 100%)',
      padding: '20px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #0B6E4F, #10B981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '1rem',
            margin: '0 auto 16px',
            boxShadow: '0 4px 12px rgba(11,110,79,0.2)',
          }}>
            S
          </div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827' }}>Create Account</h1>
          <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginTop: '6px' }}>Join SmartSchemes to save preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="card-static animate-fade-up delay-1" style={{ padding: '28px', borderRadius: '20px' }}>
          {error && (
            <div style={{
              marginBottom: '20px', padding: '12px 16px', borderRadius: '12px',
              background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)',
              fontSize: '0.8125rem', color: '#EF4444',
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="form-label">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="John Doe" className="form-input" />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" className="form-input" />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} placeholder="Min. 6 characters" className="form-input" />
            </div>
            <div>
              <label className="form-label">Confirm Password</label>
              <input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required placeholder="••••••••" className="form-input" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '24px', height: '48px' }}>
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#9CA3AF', marginTop: '20px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#0B6E4F', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
