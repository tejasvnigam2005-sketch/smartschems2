import { useState, useEffect } from 'react';
import TTS from '../utils/tts';
import SchemeGuideModal from './SchemeGuideModal';
import { useLanguage } from '../context/LanguageContext';
import { useDashboard } from '../context/DashboardContext';

export default function SchemeCard({ scheme, index = 0, schemeType = 'business' }) {
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  
  const { t, lang } = useLanguage();
  const { saveScheme, removeSavedScheme, isSaved, addRecentlyViewed } = useDashboard();
  const saved = scheme._id ? isSaved(scheme._id) : false;

  // Track view only when user expands the card (not on mount — avoids infinite loop in Dashboard)
  const handleExpand = () => {
    const next = !expanded;
    setExpanded(next);
    if (next && scheme && (scheme._id || scheme.id)) {
      addRecentlyViewed({ ...scheme, type: schemeType });
    }
  };

  const handleTTS = () => {
    const text = TTS.schemeToSpeech(scheme, lang);
    const langCode = lang === 'hi' ? 'hi-IN' : 'en-IN';
    const isPlaying = TTS.toggle(text, langCode);
    setPlaying(isPlaying);
    if (isPlaying) {
      const check = setInterval(() => {
        if (!TTS.speaking) { setPlaying(false); clearInterval(check); }
      }, 500);
    }
  };

  const scoreClass = (s) =>
    s >= 80 ? 'score-excellent' : s >= 60 ? 'score-good' : s >= 40 ? 'score-fair' : 'score-low';

  const scoreLabel = (s) =>
    s >= 80 ? t('scheme.excellent') : s >= 60 ? t('scheme.good') : s >= 40 ? t('scheme.fair') : t('scheme.partial');

  return (<>
    <div
      className="scheme-card animate-fade-up"
      style={{ animationDelay: `${index * 0.08}s`, padding: 0, overflow: 'hidden' }}
    >
      {/* Top accent line */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #0B6E4F, #34D399, #0B6E4F)' }} />

      <div style={{ padding: '20px 24px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.4, marginBottom: '4px' }}>{scheme.name}</h3>
            {scheme.ministry && (
              <p style={{ fontSize: '0.6875rem', fontWeight: 500, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{scheme.ministry}</p>
            )}
          </div>
          {scheme.relevanceScore !== undefined && (
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div className={`score-badge ${scoreClass(scheme.relevanceScore)}`}>
                {scheme.relevanceScore}
              </div>
              <p style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', marginTop: '4px', fontWeight: 500 }}>{scoreLabel(scheme.relevanceScore)}</p>
            </div>
          )}
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>{scheme.description}</p>

        {/* Quick info chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {(scheme.fundingAmount || scheme.scholarshipAmount) && (
            <span className="tag-green" style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
              {scheme.fundingAmount || scheme.scholarshipAmount}
            </span>
          )}
          <span style={{
            padding: '5px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600,
            background: 'rgba(59,130,246,0.06)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.12)',
          }}>
            {scheme.deadline || t('scheme.ongoing')}
          </span>
          {scheme.website && (
            <a href={scheme.website} target="_blank" rel="noopener noreferrer" style={{
              padding: '5px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600,
              background: 'var(--color-surface)', color: 'var(--color-text-secondary)', textDecoration: 'none',
              transition: 'all 0.2s ease', display: 'inline-flex', alignItems: 'center', gap: '4px',
            }}>
              {t('scheme.website')}
              <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          )}
        </div>

        {/* Benefits */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{t('scheme.benefits')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {scheme.benefits?.slice(0, expanded ? undefined : 3).map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <svg style={{ width: '14px', height: '14px', marginTop: '2px', flexShrink: 0, color: '#0B6E4F' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fade-in 0.25s ease both' }}>
            <div>
              <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{t('scheme.eligibility')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {scheme.eligibility?.map((e, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0B6E4F', marginTop: '7px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{e}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{t('scheme.howToApply')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {scheme.applicationProcess?.map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: 'rgba(11,110,79,0.06)', color: '#0B6E4F',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.625rem', fontWeight: 800, flexShrink: 0, marginTop: '1px',
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Documents — inline from recommend API */}
            {scheme.requiredDocuments?.length > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(11,110,79,0.03), rgba(59,130,246,0.03))',
                border: '1px solid rgba(11,110,79,0.1)',
                borderRadius: '14px',
                padding: '18px 20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <svg width="16" height="16" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0B6E4F', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('scheme.documentsTime')}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {scheme.requiredDocuments.map((doc, i) => (
                    <div key={i} style={{
                      background: 'var(--color-card)',
                      border: '1px solid rgba(11,110,79,0.08)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      transition: 'all 0.2s ease',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <svg style={{ width: '14px', height: '14px', flexShrink: 0, color: '#0B6E4F' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{doc.name}</span>
                      </div>
                      {doc.description && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: '0 0 8px 22px' }}>{doc.description}</p>
                      )}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginLeft: '22px' }}>
                        <span style={{
                          fontSize: '0.6875rem', padding: '4px 10px', borderRadius: '6px',
                          background: 'rgba(59,130,246,0.08)', color: '#2563EB',
                          border: '1px solid rgba(59,130,246,0.12)',
                          fontWeight: 600,
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                        }}>
                          <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" />
                            <path strokeLinecap="round" d="M12 6v6l4 2" />
                          </svg>
                          {t('scheme.estimatedTime')}: {doc.estimatedTime}
                        </span>
                        <span style={{
                          fontSize: '0.6875rem', padding: '4px 10px', borderRadius: '6px',
                          background: 'rgba(11,110,79,0.06)', color: '#0B6E4F',
                          border: '1px solid rgba(11,110,79,0.1)',
                          fontWeight: 500, lineHeight: 1.4,
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                        }}>
                          <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {doc.howToObtain}
                        </span>
                      </div>
                      {/* Apply for Document */}
                      <div style={{ marginLeft: '22px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {doc.applyUrl ? (
                          <a
                            href={doc.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              try {
                                const apps = JSON.parse(localStorage.getItem('ss_doc_applications') || '[]');
                                const exists = apps.find(a => a.docName === doc.name);
                                if (!exists) {
                                  apps.push({ docName: doc.name, applyUrl: doc.applyUrl, appliedAt: new Date().toISOString(), status: 'applied', estimatedTime: doc.estimatedTime });
                                  localStorage.setItem('ss_doc_applications', JSON.stringify(apps));
                                }
                              } catch {}
                            }}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '5px',
                              padding: '5px 12px', borderRadius: '8px',
                              fontSize: '0.6875rem', fontWeight: 600,
                              background: 'linear-gradient(135deg, #0B6E4F, #10B981)',
                              color: '#fff', textDecoration: 'none',
                              boxShadow: '0 2px 8px rgba(11,110,79,0.2)',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                            Apply for Document
                          </a>
                        ) : (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            padding: '5px 12px', borderRadius: '8px',
                            fontSize: '0.6875rem', fontWeight: 500,
                            background: 'var(--color-surface)', color: 'var(--color-text-muted)',
                          }}>
                            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Self-arranged
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border-light)',
          flexWrap: 'wrap', gap: '8px',
        }}>
          <button
            onClick={handleExpand}
            style={{
              fontSize: '0.8125rem', fontWeight: 600, color: '#0B6E4F',
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'all 0.2s ease', padding: '4px 0',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}
          >
            {expanded ? t('scheme.less') : t('scheme.details')}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {/* Apply Guide button — only shown when scheme has a DB id */}
            {scheme._id && (
              <button
                onClick={() => setGuideOpen(true)}
                className="scheme-guide-btn"
                title="Document checklist &amp; step-by-step guide"
              >
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                {t('scheme.applyGuide')}
              </button>
            )}
            
            {scheme._id && (
              <button
                onClick={() => {
                  if (saved) removeSavedScheme(scheme._id);
                  else saveScheme({ ...scheme, type: schemeType });
                }}
                style={{
                  padding: '5px 10px', borderRadius: '8px',
                  fontSize: '0.6875rem', fontWeight: 600,
                  background: saved ? 'rgba(11,110,79,0.1)' : '#F3F4F6', 
                  color: saved ? '#0B6E4F' : '#6B7280',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center', gap: '4px'
                }}
              >
                {saved ? (
                   <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/></svg>
                ) : (
                   <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                )}
                {saved ? t('scheme.saved') : t('scheme.save')}
              </button>
            )}

            <button onClick={handleTTS} className={`audio-btn ${playing ? 'playing' : ''}`} title={playing ? 'Stop' : 'Listen'}>
              {playing ? (
                <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
              ) : (
                <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Scheme Guide Modal */}
    {guideOpen && scheme._id && (
      <SchemeGuideModal
        scheme={scheme}
        schemeType={schemeType}
        onClose={() => setGuideOpen(false)}
      />
    )}
  </>);
}
