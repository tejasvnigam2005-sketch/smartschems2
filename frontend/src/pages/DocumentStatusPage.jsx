import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const STATUS_CONFIG = {
  applied: { label: 'Applied', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  processing: { label: 'Processing', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99' },
  ready: { label: 'Ready to Collect', color: '#10B981', bg: 'rgba(16,185,129,0.1)', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  collected: { label: 'Collected', color: '#6B7280', bg: 'rgba(107,114,128,0.1)', icon: 'M4.5 12.75l6 6 9-13.5' },
};

export default function DocumentStatusPage() {
  const { t } = useLanguage();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('ss_doc_applications') || '[]');
      // Simulate status progression based on time elapsed
      const updated = stored.map(app => {
        const elapsed = (Date.now() - new Date(app.appliedAt).getTime()) / (1000 * 60 * 60);
        let status = app.status;
        if (elapsed > 72) status = 'ready';
        else if (elapsed > 24) status = 'processing';
        else status = 'applied';
        return { ...app, status };
      });
      setApps(updated);
      localStorage.setItem('ss_doc_applications', JSON.stringify(updated));
    } catch {}
  }, []);

  const updateStatus = (idx, newStatus) => {
    const updated = [...apps];
    updated[idx].status = newStatus;
    setApps(updated);
    localStorage.setItem('ss_doc_applications', JSON.stringify(updated));
  };

  const removeApp = (idx) => {
    const updated = apps.filter((_, i) => i !== idx);
    setApps(updated);
    localStorage.setItem('ss_doc_applications', JSON.stringify(updated));
  };

  const getProgress = (status) => {
    switch (status) {
      case 'applied': return 25;
      case 'processing': return 55;
      case 'ready': return 85;
      case 'collected': return 100;
      default: return 0;
    }
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return iso; }
  };

  return (
    <div className="page-enter" style={{ paddingTop: '100px', paddingBottom: '60px', minHeight: '100vh' }}>
      <div className="container-narrow">
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #0B6E4F, #10B981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>Document Application Status</h1>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Track your document applications across government portals</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {apps.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '32px' }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
              const count = apps.filter(a => a.status === key).length;
              return (
                <div key={key} style={{
                  padding: '16px', borderRadius: '14px',
                  background: cfg.bg, border: `1px solid ${cfg.color}20`,
                  textAlign: 'center', transition: 'all 0.25s ease',
                }}>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: cfg.color }}>{count}</p>
                  <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cfg.label}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Application List */}
        {apps.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {apps.map((app, i) => {
              const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
              const progress = getProgress(app.status);
              return (
                <div key={i} className="card-static" style={{
                  padding: '20px 24px',
                  animation: `fade-up 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s both`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    {/* Status Icon */}
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <svg width="18" height="18" fill="none" stroke={cfg.color} viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d={cfg.icon} />
                      </svg>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', flexWrap: 'wrap', gap: '6px' }}>
                        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827' }}>{app.docName}</h3>
                        <span style={{
                          fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase',
                          letterSpacing: '0.5px', padding: '3px 10px', borderRadius: '6px',
                          background: cfg.bg, color: cfg.color,
                          border: `1px solid ${cfg.color}25`,
                        }}>{cfg.label}</span>
                      </div>

                      {/* Applied date & estimated time */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.6875rem', color: '#9CA3AF', marginBottom: '10px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75" />
                          </svg>
                          Applied: {formatDate(app.appliedAt)}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path strokeLinecap="round" d="M12 6v6l4 2" />
                          </svg>
                          Est. Time: {app.estimatedTime}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div style={{ height: '6px', background: '#F3F4F6', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
                        <div style={{
                          height: '100%', borderRadius: '3px',
                          background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}99)`,
                          width: `${progress}%`,
                          transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
                        }} />
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {app.status !== 'collected' && (
                          <select
                            value={app.status}
                            onChange={(e) => updateStatus(i, e.target.value)}
                            style={{
                              padding: '4px 24px 4px 8px', borderRadius: '6px',
                              fontSize: '0.6875rem', fontWeight: 600,
                              background: '#F9FAFB', border: '1px solid #E5E7EB',
                              color: '#374151', cursor: 'pointer',
                              appearance: 'none',
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='none' stroke='%239CA3AF' viewBox='0 0 24 24' stroke-width='2'%3E%3Cpath stroke-linecap='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 6px center',
                            }}
                          >
                            <option value="applied">Applied</option>
                            <option value="processing">Processing</option>
                            <option value="ready">Ready to Collect</option>
                            <option value="collected">Collected</option>
                          </select>
                        )}
                        <a href={app.applyUrl} target="_blank" rel="noopener noreferrer" style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '4px 10px', borderRadius: '6px',
                          fontSize: '0.6875rem', fontWeight: 600,
                          background: 'rgba(11,110,79,0.06)', color: '#0B6E4F',
                          border: '1px solid rgba(11,110,79,0.1)',
                          textDecoration: 'none', transition: 'all 0.2s',
                        }}>
                          <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                          Visit Portal
                        </a>
                        <button onClick={() => removeApp(i)} style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '4px 10px', borderRadius: '6px',
                          fontSize: '0.6875rem', fontWeight: 500,
                          background: 'rgba(239,68,68,0.06)', color: '#EF4444',
                          border: '1px solid rgba(239,68,68,0.1)',
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}>
                          <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="card-static" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(11,110,79,0.08), rgba(59,130,246,0.08))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <svg width="28" height="28" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>No Document Applications Yet</h2>
            <p style={{ fontSize: '0.875rem', color: '#9CA3AF', maxWidth: '400px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              When you click "Apply for Document" on any scheme's required documents, your applications will appear here for tracking.
            </p>
            <Link to="/explore" className="btn-primary" style={{ display: 'inline-flex' }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Explore Schemes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
