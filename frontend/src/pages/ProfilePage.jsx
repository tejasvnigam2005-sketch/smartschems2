import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh', paddingTop: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#fff',
      }}>
        <div className="animate-fade-up" style={{ textAlign: 'center' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'rgba(11,110,79,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', margin: '0 auto 16px',
          }}>
            🔒
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>Login Required</h2>
          <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '24px' }}>Please login to view your profile</p>
          <Link to="/login" className="btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  const pref = user.preferences || {};
  const hasPrefs = pref.category || pref.state || pref.age || pref.income;
  const history = user.searchHistory || [];

  return (
    <div style={{ minHeight: '100vh', background: '#fff', paddingTop: '64px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 24px 56px' }}>
        {/* Profile Header */}
        <div className="card-static animate-fade-up" style={{ overflow: 'hidden', marginBottom: '24px', borderRadius: '20px' }}>
          <div style={{
            height: '100px',
            background: 'linear-gradient(135deg, #0B6E4F, #10B981, #34D399)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: '10%', right: '10%',
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
            }} />
          </div>
          <div style={{ padding: '0 24px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', marginTop: '-32px', marginBottom: '20px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '18px',
                background: 'linear-gradient(135deg, #0B6E4F, #10B981)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '1.5rem', fontWeight: 800,
                border: '3px solid #fff',
                boxShadow: '0 4px 12px rgba(11,110,79,0.2)',
              }}>
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div style={{ paddingBottom: '2px' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>{user.name}</h1>
                <p style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>{user.email}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(11,110,79,0.04)', borderRadius: '14px', padding: '14px 16px' }}>
                <p style={{ fontSize: '0.625rem', fontWeight: 600, color: '#0B6E4F', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Account</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0B6E4F' }}>Free Plan</p>
              </div>
              <div style={{ background: 'rgba(139,92,246,0.04)', borderRadius: '14px', padding: '14px 16px' }}>
                <p style={{ fontSize: '0.625rem', fontWeight: 600, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Joined</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#7C3AED' }}>
                  {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="card-static animate-fade-up delay-1" style={{ padding: '24px', marginBottom: '24px', borderRadius: '20px' }}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Saved Preferences
          </h2>
          {hasPrefs ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {pref.category && (
                <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '14px 16px' }}>
                  <p style={{ fontSize: '0.625rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginTop: '2px', textTransform: 'capitalize' }}>{pref.category}</p>
                </div>
              )}
              {pref.state && (
                <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '14px 16px' }}>
                  <p style={{ fontSize: '0.625rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px' }}>State</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginTop: '2px', textTransform: 'capitalize' }}>{pref.state}</p>
                </div>
              )}
              {pref.age && (
                <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '14px 16px' }}>
                  <p style={{ fontSize: '0.625rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px' }}>Age</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginTop: '2px' }}>{pref.age}</p>
                </div>
              )}
              {pref.income && (
                <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '14px 16px' }}>
                  <p style={{ fontSize: '0.625rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px' }}>Income</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginTop: '2px' }}>₹{pref.income?.toLocaleString()}</p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#D1D5DB' }}>
              <p style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📋</p>
              <p style={{ fontSize: '0.8125rem' }}>No preferences saved yet</p>
            </div>
          )}
        </div>

        {/* Search History */}
        <div className="card-static animate-fade-up delay-2" style={{ padding: '24px', marginBottom: '32px', borderRadius: '20px' }}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Past Searches
          </h2>
          {history.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {history.slice(-10).reverse().map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#F9FAFB', borderRadius: '12px', padding: '14px 16px',
                  transition: 'all 0.2s ease',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1rem' }}>{s.category === 'business' ? '💼' : '🎓'}</span>
                    <div>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', textTransform: 'capitalize' }}>{s.category} Search</p>
                      <p style={{ fontSize: '0.6875rem', color: '#9CA3AF' }}>
                        {new Date(s.searchedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 10px', borderRadius: '8px',
                    fontSize: '0.75rem', fontWeight: 600,
                    background: 'rgba(11,110,79,0.06)', color: '#0B6E4F',
                  }}>
                    {s.results?.length || 0} results
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#D1D5DB' }}>
              <p style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🔍</p>
              <p style={{ fontSize: '0.8125rem' }}>No searches yet</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="animate-fade-up delay-3" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/business" className="btn-primary">Explore Business Schemes</Link>
          <Link to="/education" className="btn-secondary">Explore Education Schemes</Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
