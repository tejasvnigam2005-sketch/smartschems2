import { useLocation, Link, useNavigate } from 'react-router-dom';
import SchemeCard from '../components/SchemeCard';
import ComparisonTable from '../components/ComparisonTable';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, category } = location.state || {};
  const { t } = useLanguage();

  if (!data) {
    return (
      <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-fade-up" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}><svg width="48" height="48" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg></div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>{t('results.noResults')}</h2>
          <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '24px' }}>{t('results.noResultsDesc')}</p>
          <Link to="/" className="btn-primary">{t('results.goHome')}</Link>
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            {isBiz ? t('results.businessRec') : t('results.educationRec')}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            {t('results.rankedBy')} · {data.totalMatches} {t('results.matched')} · Top {schemes.length}
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
              {t('results.quickComparison')}
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
              {t('results.detailedResults')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 480px), 1fr))', gap: '20px' }}>
              {schemes.map((scheme, idx) => (
                <SchemeCard key={scheme._id || idx} scheme={scheme} index={idx} schemeType={category} />
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-up" style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}><svg width="48" height="48" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg></div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>{t('results.noMatching')}</h3>
            <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>{t('results.tryAdjusting')}</p>
          </div>
        )}

        {/* Actions */}
        <div className="animate-fade-up delay-3" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px' }}>
          <button onClick={() => navigate(-1)} className="btn-outline">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('results.modifySearch')}
          </button>
          <Link to="/" className="btn-primary">{t('results.backToHome')}</Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
