import { useState, useEffect } from 'react';

const TOASTS = [
  { id: 1, type: 'new', title: 'PM Vishwakarma Yojana', desc: 'New scheme for artisans — up to ₹3 Lakh loan at 5% interest.', color: '#10B981', icon: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z' },
  { id: 2, type: 'ending', title: 'Startup India Seed Fund', desc: 'Application window closing in 3 days!', color: '#EF4444', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 3, type: 'upcoming', title: 'Digital India Internship', desc: 'Winter session applications opening next week.', color: '#F59E0B', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5' },
];

export default function ToastNotifications() {
  const [visible, setVisible] = useState([]);
  const [dismissed, setDismissed] = useState(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem('ss_toasts_shown') || '[]');
      return stored;
    } catch { return []; }
  });

  useEffect(() => {
    const toShow = TOASTS.filter(t => !dismissed.includes(t.id));
    if (toShow.length === 0) return;

    // Stagger the appearance
    toShow.forEach((toast, i) => {
      const showTimer = setTimeout(() => {
        setVisible(prev => [...prev, toast]);
      }, 1500 + i * 2500);

      // Auto-dismiss after 6 seconds
      const hideTimer = setTimeout(() => {
        dismissToast(toast.id);
      }, 7500 + i * 2500);

      return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
    });
  }, []);

  const dismissToast = (id) => {
    setVisible(prev => prev.filter(t => t.id !== id));
    setDismissed(prev => {
      const next = [...prev, id];
      sessionStorage.setItem('ss_toasts_shown', JSON.stringify(next));
      return next;
    });
  };

  if (visible.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', top: '76px', right: '16px',
      zIndex: 9990, display: 'flex', flexDirection: 'column', gap: '10px',
      pointerEvents: 'none', maxWidth: '360px', width: '100%',
    }}>
      {visible.map((toast, i) => (
        <div key={toast.id} style={{
          pointerEvents: 'auto',
          display: 'flex', alignItems: 'flex-start', gap: '12px',
          padding: '14px 16px',
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(16px)',
          borderRadius: '14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          border: `1px solid ${toast.color}20`,
          borderLeft: `3px solid ${toast.color}`,
          animation: 'toastIn 0.4s cubic-bezier(0.16,1,0.3,1) both',
          animationDelay: `${i * 0.1}s`,
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        }}
          onClick={() => dismissToast(toast.id)}
        >
          {/* Icon */}
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: `${toast.color}15`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" fill="none" stroke={toast.color} viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d={toast.icon} />
            </svg>
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span style={{
                fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.5px', padding: '1px 6px', borderRadius: '4px',
                background: `${toast.color}15`, color: toast.color,
              }}>
                {toast.type === 'new' ? '● NEW' : toast.type === 'ending' ? '● ENDING SOON' : '● UPCOMING'}
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827', lineHeight: 1.3, marginBottom: '2px' }}>{toast.title}</p>
            <p style={{ fontSize: '0.6875rem', color: '#6B7280', lineHeight: 1.4 }}>{toast.desc}</p>
          </div>

          {/* Close */}
          <button onClick={(e) => { e.stopPropagation(); dismissToast(toast.id); }} style={{
            width: '22px', height: '22px', borderRadius: '6px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'background 0.15s',
          }}
            onMouseOver={e => e.currentTarget.style.background = '#F3F4F6'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="12" height="12" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Progress bar */}
          <div style={{
            position: 'absolute', bottom: 0, left: '3px', right: 0,
            height: '2px', borderRadius: '0 0 14px 0', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', background: toast.color,
              animation: 'toastProgress 6s linear both',
              animationDelay: `${1.5 + i * 2.5}s`,
            }} />
          </div>
        </div>
      ))}

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(100px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
