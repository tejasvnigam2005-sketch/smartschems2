import { useState } from 'react';
import TTS from '../utils/tts';

export default function SchemeCard({ scheme, index = 0, schemeType = 'business' }) {
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [lang, setLang] = useState('en');

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
    s >= 80 ? 'Excellent' : s >= 60 ? 'Good' : s >= 40 ? 'Fair' : 'Partial';

  return (
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
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', lineHeight: 1.4, marginBottom: '4px' }}>{scheme.name}</h3>
            {scheme.ministry && (
              <p style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{scheme.ministry}</p>
            )}
          </div>
          {scheme.relevanceScore !== undefined && (
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div className={`score-badge ${scoreClass(scheme.relevanceScore)}`}>
                {scheme.relevanceScore}
              </div>
              <p style={{ fontSize: '0.625rem', color: '#9CA3AF', marginTop: '4px', fontWeight: 500 }}>{scoreLabel(scheme.relevanceScore)}</p>
            </div>
          )}
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '16px' }}>{scheme.description}</p>

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
            {scheme.deadline || 'Ongoing'}
          </span>
          {scheme.website && (
            <a href={scheme.website} target="_blank" rel="noopener noreferrer" style={{
              padding: '5px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600,
              background: '#F3F4F6', color: '#4B5563', textDecoration: 'none',
              transition: 'all 0.2s ease', display: 'inline-flex', alignItems: 'center', gap: '4px',
            }}>
              Website
              <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          )}
        </div>

        {/* Benefits */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Benefits</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {scheme.benefits?.slice(0, expanded ? undefined : 3).map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <svg style={{ width: '14px', height: '14px', marginTop: '2px', flexShrink: 0, color: '#0B6E4F' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.5 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fade-in 0.25s ease both' }}>
            <div>
              <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Eligibility</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {scheme.eligibility?.map((e, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0B6E4F', marginTop: '7px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.5 }}>{e}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>How to Apply</p>
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
                    <span style={{ fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.5 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F3F4F6',
        }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              fontSize: '0.8125rem', fontWeight: 600, color: '#0B6E4F',
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'all 0.2s ease', padding: '4px 0',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}
          >
            {expanded ? '← Less' : 'Details →'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
              style={{
                padding: '5px 10px', borderRadius: '8px',
                fontSize: '0.6875rem', fontWeight: 600,
                background: '#F3F4F6', color: '#6B7280',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {lang === 'en' ? 'हिंदी' : 'ENG'}
            </button>
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
  );
}
