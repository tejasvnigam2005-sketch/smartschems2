import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEligibility } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

function SchemeCard({ scheme, index }) {
  const [expanded, setExpanded] = useState(false);
  const isBiz = scheme.schemeType === 'business';
  const color = isBiz ? '#0B6E4F' : '#3B82F6';

  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F3F4F6', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden', transition: 'all 0.3s', animation: `cardIn 0.4s ease ${index * 0.06}s both` }}
      onMouseOver={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)'}
      onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'}>
      <div style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: color, background: `${color}10`, padding: '3px 10px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {isBiz ? '🏢 Business' : '🎓 Education'}
              </span>
              {scheme.ministry && <span style={{ fontSize: '0.6875rem', color: '#9CA3AF', padding: '3px 8px', borderRadius: '6px', background: '#F9FAFB' }}>{scheme.ministry}</span>}
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', lineHeight: 1.4, margin: 0 }}>{scheme.name}</h3>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `linear-gradient(135deg, ${color}15, ${color}08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: color }}>{scheme.relevanceScore}%</span>
          </div>
        </div>

        {/* Score bar */}
        <div style={{ height: '4px', borderRadius: '2px', background: '#F3F4F6', marginBottom: '12px' }}>
          <div style={{ height: '100%', borderRadius: '2px', background: `linear-gradient(90deg, ${color}, ${color}AA)`, width: `${scheme.relevanceScore}%`, transition: 'width 0.8s ease' }} />
        </div>

        <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.6, margin: '0 0 16px' }}>
          {scheme.description?.slice(0, 150)}{scheme.description?.length > 150 ? '…' : ''}
        </p>

        {/* Benefits */}
        {scheme.benefits?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {scheme.benefits.slice(0, 3).map((b, i) => (
              <span key={i} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '8px', background: '#F0FDF4', color: '#0B6E4F', fontWeight: 500 }}>✓ {b}</span>
            ))}
          </div>
        )}

        {/* Funding */}
        {scheme.funding_amount && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '10px', background: '#FFFBEB', marginBottom: '16px' }}>
            <span style={{ fontSize: '1rem' }}>💰</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#92400E' }}>Funding: {scheme.funding_amount}</span>
          </div>
        )}

        {/* Expandable */}
        {expanded && (
          <div style={{ animation: 'cardIn 0.3s ease' }}>
            {scheme.eligibility?.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Eligibility</h4>
                <ul style={{ margin: 0, paddingLeft: '18px' }}>
                  {scheme.eligibility.map((e, i) => <li key={i} style={{ fontSize: '0.75rem', color: '#6B7280', lineHeight: 1.6 }}>{e}</li>)}
                </ul>
              </div>
            )}
            {scheme.application_process?.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>How to Apply</h4>
                <ol style={{ margin: 0, paddingLeft: '18px' }}>
                  {scheme.application_process.map((s, i) => <li key={i} style={{ fontSize: '0.75rem', color: '#6B7280', lineHeight: 1.6 }}>{s}</li>)}
                </ol>
              </div>
            )}
            {scheme.website && (
              <a href={scheme.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: color, fontWeight: 600, textDecoration: 'none' }}>
                Visit Official Website →
              </a>
            )}
          </div>
        )}

        <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', color: color, fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', padding: '4px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {expanded ? '▲ Show Less' : '▼ View Details'}
        </button>
      </div>
    </div>
  );
}

export default function EligibleSchemesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const raw = localStorage.getItem('ss_eligibility');
    if (!raw) { navigate('/'); return; }
    const data = JSON.parse(raw);
    setProfile(data);

    getEligibility(data)
      .then(res => {
        setSchemes(res.data.results || []);
        setProfile(res.data.profile || data);
      })
      .catch(() => setError('Failed to fetch schemes. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? schemes : schemes.filter(s => s.schemeType === filter);
  const bizCount = schemes.filter(s => s.schemeType === 'business').length;
  const eduCount = schemes.filter(s => s.schemeType === 'education').length;

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#F9FAFB' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #fff 60%, #EFF6FF 100%)', padding: '48px 0 40px', borderBottom: '1px solid #F3F4F6' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎯</div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
            Your Eligible Schemes
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#6B7280', maxWidth: '500px', margin: '0 auto' }}>
            Based on your profile, we found <strong style={{ color: '#0B6E4F' }}>{schemes.length} schemes</strong> you may qualify for.
          </p>

          {/* Profile summary chips */}
          {profile && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '20px' }}>
              {profile.age && <span style={chipS}>🎂 Age: {profile.age}</span>}
              {profile.income && <span style={chipS}>💰 Income: ₹{Number(profile.income).toLocaleString('en-IN')}</span>}
              {profile.state && <span style={chipS}>📍 {profile.state}</span>}
              {profile.category && <span style={chipS}>📋 {profile.category}</span>}
              {profile.occupation && <span style={chipS}>💼 {profile.occupation}</span>}
            </div>
          )}

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '24px' }}>
            {[
              { k: 'all', label: `All (${schemes.length})` },
              { k: 'business', label: `🏢 Business (${bizCount})` },
              { k: 'education', label: `🎓 Education (${eduCount})` },
            ].map(f => (
              <button key={f.k} onClick={() => setFilter(f.k)} style={{ padding: '8px 18px', borderRadius: '10px', border: filter === f.k ? '2px solid #0B6E4F' : '1.5px solid #E5E7EB', background: filter === f.k ? 'rgba(11,110,79,0.06)' : '#fff', color: filter === f.k ? '#0B6E4F' : '#6B7280', fontWeight: filter === f.k ? 600 : 500, fontSize: '0.8125rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container" style={{ padding: '32px 24px 60px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #E5E7EB', borderTopColor: '#0B6E4F', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Finding your eligible schemes…</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: '#EF4444', fontSize: '0.875rem' }}>{error}</p>
            <button onClick={() => window.location.reload()} style={{ marginTop: '12px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#0B6E4F', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
            <h3 style={{ color: '#374151', fontWeight: 600 }}>No matching schemes found</h3>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Try adjusting your profile or explore all schemes.</p>
            <Link to="/explore" style={{ display: 'inline-block', marginTop: '16px', padding: '10px 24px', borderRadius: '10px', background: '#0B6E4F', color: '#fff', fontWeight: 600, textDecoration: 'none' }}>Explore All Schemes</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px', maxWidth: '720px', margin: '0 auto' }}>
            {filtered.map((s, i) => <SchemeCard key={s.id || i} scheme={s} index={i} />)}
          </div>
        )}

        {/* CTA */}
        {!loading && schemes.length > 0 && !user && (
          <div style={{ maxWidth: '720px', margin: '32px auto 0', padding: '24px', borderRadius: '16px', background: 'linear-gradient(135deg, #F0FDF4, #EFF6FF)', border: '1px solid #D1FAE5', textAlign: 'center' }}>
            <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>💡 Save your profile for personalized updates</p>
            <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginBottom: '16px' }}>Create an account to track applications and get notified about new schemes.</p>
            <Link to="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 24px', borderRadius: '10px', background: 'linear-gradient(135deg, #0B6E4F, #10B981)', color: '#fff', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', boxShadow: '0 4px 12px rgba(11,110,79,0.2)' }}>
              Sign Up Free →
            </Link>
          </div>
        )}
      </section>

      <Footer />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes cardIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

const chipS = { fontSize: '0.75rem', fontWeight: 500, color: '#374151', background: '#fff', border: '1px solid #E5E7EB', padding: '5px 12px', borderRadius: '8px' };
