import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
          <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827' }}>Welcome back</h1>
          <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginTop: '6px' }}>Login to access your saved schemes</p>
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
              <label className="form-label">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" className="form-input" />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="••••••••" className="form-input" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '24px', height: '48px' }}>
            {loading ? 'Logging in…' : 'Login'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#9CA3AF', marginTop: '20px' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#0B6E4F', fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
