import { useLocation, Link, useNavigate } from 'react-router-dom';
import SchemeCard from '../components/SchemeCard';
import ComparisonTable from '../components/ComparisonTable';
import Footer from '../components/Footer';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, category } = location.state || {};

  if (!data) {
    return (
      <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-fade-up" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>No Results</h2>
          <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '24px' }}>Fill the form first to get recommendations</p>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const schemes = data.results || [];
  const isBiz = category === 'business';

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#fff' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #F9FAFB 100%)',
        padding: '40px 0',
        borderBottom: '1px solid rgba(11,110,79,0.06)',
      }}>
        <div className="container animate-fade-up" style={{ textAlign: 'center' }}>
          <div className="section-tag" style={{ margin: '0 auto 16px' }}>Results</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            {isBiz ? 'Business' : 'Education'} Recommendations
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            AI-ranked by relevance · {data.totalMatches} matched · Top {schemes.length} shown
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px 64px' }}>
        {/* Comparison */}
        {schemes.length > 0 && (
          <div className="animate-fade-up delay-1" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              Quick Comparison
            </h2>
            <ComparisonTable schemes={schemes} schemeType={category} />
          </div>
        )}

        {/* Cards */}
        {schemes.length > 0 ? (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Detailed Results
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 480px), 1fr))', gap: '20px' }}>
              {schemes.map((scheme, idx) => (
                <SchemeCard key={scheme._id || idx} scheme={scheme} index={idx} schemeType={category} />
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-up" style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>😔</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>No matching schemes</h3>
            <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Try adjusting your criteria</p>
          </div>
        )}

        {/* Actions */}
        <div className="animate-fade-up delay-3" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px' }}>
          <button onClick={() => navigate(-1)} className="btn-outline">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Modify Search
          </button>
          <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
