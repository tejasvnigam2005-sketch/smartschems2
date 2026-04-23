import { useState, useEffect } from 'react';
import DocumentChecklist from './DocumentChecklist';
import ApplicationGuide from './ApplicationGuide';

export default function SchemeGuideModal({ scheme, schemeType, onClose }) {
  const [activeTab, setActiveTab] = useState('checklist');

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const schemeId = scheme._id;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          animation: 'fade-in 0.2s ease both',
        }}
      />

      {/* Modal Panel */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: '100%', maxWidth: '540px',
          zIndex: 101,
          background: 'var(--color-card)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
          display: 'flex', flexDirection: 'column',
          animation: 'slide-in-right 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 24px 20px',
          borderBottom: '1px solid var(--color-border-light)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '1px',
                  textTransform: 'uppercase', color: '#0B6E4F',
                  background: 'rgba(11,110,79,0.08)', padding: '3px 8px', borderRadius: '6px',
                }}>
                  {schemeType === 'business' ? 'Business' : 'Education'} Scheme
                </span>
              </div>
              <h2 style={{
                fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-primary)',
                lineHeight: 1.3, margin: 0,
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {scheme.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'var(--color-surface)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'background 0.2s ease',
                color: 'var(--color-text-secondary)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#E5E7EB'}
              onMouseLeave={e => e.currentTarget.style.background = '#F3F4F6'}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: '4px',
            background: 'var(--color-surface)', borderRadius: '10px',
            padding: '4px', marginTop: '20px',
          }}>
            {[
              {
                key: 'checklist',
                label: 'Document Checklist',
                icon: (
                  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
              },
              {
                key: 'guide',
                label: 'Application Guide',
                icon: (
                  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
              },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flex: 1, padding: '9px 10px',
                  borderRadius: '7px', border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.8125rem', fontWeight: 600,
                  transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                  background: activeTab === tab.key ? '#fff' : 'transparent',
                  color: activeTab === tab.key ? '#0B6E4F' : '#6B7280',
                  boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '24px',
          WebkitOverflowScrolling: 'touch',
        }}>
          {activeTab === 'checklist' ? (
            <DocumentChecklist schemeType={schemeType} schemeId={schemeId} />
          ) : (
            <ApplicationGuide schemeType={schemeType} schemeId={schemeId} />
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--color-border-light)',
          flexShrink: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Progress auto-saved locally
          </p>
          {scheme.website && (
            <a href={scheme.website} target="_blank" rel="noopener noreferrer" className="btn-primary"
              style={{ padding: '9px 18px', fontSize: '0.8125rem', borderRadius: '10px' }}
            >
              Official Website
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </>
  );
}
