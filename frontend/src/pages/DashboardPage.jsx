import { Link } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { useLanguage } from '../context/LanguageContext';
import SchemeCard from '../components/SchemeCard';
import Footer from '../components/Footer';

export default function DashboardPage() {
  const { savedSchemes, recentlyViewed, applicationProgress } = useDashboard();
  const { t } = useLanguage();

  const progressArray = Object.values(applicationProgress).sort((a, b) => 
    new Date(b.lastUpdated) - new Date(a.lastUpdated)
  );

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: 'var(--color-card)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(11,110,79,0.08) 0%, rgba(11,110,79,0.04) 50%, var(--color-surface) 100%)',
        padding: '40px 0',
        borderBottom: '1px solid rgba(11,110,79,0.06)',
      }}>
        <div className="container animate-fade-up">
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            {t('dashboard.title')}
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
            {t('dashboard.subtitle')}
          </p>
          <Link to="/document-status" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            marginTop: '14px', padding: '8px 18px', borderRadius: '10px',
            background: 'rgba(11,110,79,0.08)', color: '#0B6E4F',
            fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none',
            border: '1px solid rgba(11,110,79,0.12)', transition: 'all 0.2s ease',
          }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
            Track Document Applications →
          </Link>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px' }}>

          {/* Recently Viewed — Horizontal Quick-Access Strip */}
          <section className="animate-fade-up delay-1">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <svg width="20" height="20" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('dashboard.recentlyViewed')}
              </h2>
              {recentlyViewed.length > 0 && (
                <Link to="/explore" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0B6E4F', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View all
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                </Link>
              )}
            </div>

            {recentlyViewed.length > 0 ? (
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
                {recentlyViewed.map((scheme, idx) => (
                  <Link key={`recent-${scheme._id}`} to="/explore" style={{
                    minWidth: '260px', maxWidth: '300px', scrollSnapAlign: 'start', textDecoration: 'none',
                    background: 'var(--color-surface)', border: '1px solid var(--color-border-light)',
                    borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px',
                    transition: 'all 0.25s ease', cursor: 'pointer', flexShrink: 0,
                  }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(11,110,79,0.3)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--color-border-light)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: idx % 3 === 0 ? 'rgba(11,110,79,0.08)' : idx % 3 === 1 ? 'rgba(217,119,6,0.08)' : 'rgba(59,130,246,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <svg width="18" height="18" fill="none" stroke={idx % 3 === 0 ? '#0B6E4F' : idx % 3 === 1 ? '#D97706' : '#3B82F6'} viewBox="0 0 24 24" strokeWidth="1.75">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 650, color: 'var(--color-text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{scheme.name || scheme.schemeName || 'Scheme'}</p>
                      <span style={{
                        display: 'inline-block', marginTop: '4px', fontSize: '0.625rem', fontWeight: 600,
                        padding: '2px 8px', borderRadius: '6px',
                        background: (scheme.type || 'business') === 'business' ? 'rgba(11,110,79,0.08)' : 'rgba(59,130,246,0.08)',
                        color: (scheme.type || 'business') === 'business' ? '#0B6E4F' : '#3B82F6',
                        textTransform: 'uppercase', letterSpacing: '0.5px',
                      }}>{scheme.type || 'business'}</span>
                    </div>
                    <svg width="16" height="16" fill="none" stroke="var(--color-text-muted)" viewBox="0 0 24 24" strokeWidth="2" style={{ flexShrink: 0 }}>
                      <path strokeLinecap="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', background: 'var(--color-surface)', borderRadius: '16px', border: '1px dashed var(--color-border)' }}>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '8px' }}>{t('dashboard.noRecent')}</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{t('dashboard.noRecentDesc')}</p>
              </div>
            )}
          </section>
          
          {/* Progress Section */}
          <section className="animate-fade-up delay-2">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="20" height="20" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {t('dashboard.applicationProgress')}
            </h2>
            {progressArray.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {progressArray.map(prog => {
                  const pct = Math.round((prog.stepsCompleted / prog.totalSteps) * 100) || 0;
                  return (
                    <div key={prog.schemeId} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>{prog.schemeName}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8125rem' }}>
                        <span style={{ color: 'var(--color-text-secondary)' }}>{prog.stepsCompleted} {t('dashboard.of')} {prog.totalSteps} {t('dashboard.stepsCompleted')}</span>
                        <span style={{ fontWeight: 600, color: '#0B6E4F' }}>{pct}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'var(--color-card)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'linear-gradient(90deg, #0B6E4F, #34D399)', width: `${pct}%`, transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', background: 'var(--color-surface)', borderRadius: '16px', border: '1px dashed var(--color-border)' }}>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '8px' }}>{t('dashboard.noProgress')}</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{t('dashboard.noProgressDesc')}</p>
              </div>
            )}
          </section>

          {/* Saved Schemes */}
          <section className="animate-fade-up delay-3">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="20" height="20" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {t('dashboard.savedSchemes')} ({savedSchemes.length})
            </h2>
            {savedSchemes.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>
                {savedSchemes.map((scheme, idx) => (
                  <SchemeCard key={`saved-${scheme._id}`} scheme={scheme} index={idx} schemeType={scheme.type || 'business'} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', background: 'var(--color-surface)', borderRadius: '16px', border: '1px dashed var(--color-border)' }}>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '8px' }}>{t('dashboard.noSaved')}</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>{t('dashboard.noSavedDesc')}</p>
                <Link to="/explore" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.8125rem' }}>
                  {t('dashboard.exploreSchemes')}
                </Link>
              </div>
            )}
          </section>

        </div>
      </div>
      <Footer />
    </div>
  );
}
