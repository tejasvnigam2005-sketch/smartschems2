import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const NOTIFICATIONS = [
  { id: 1, type: 'new', title: 'PM Vishwakarma Yojana', desc: 'New scheme launched for traditional artisans — up to ₹3 Lakh loan at 5% interest.', time: '2 hours ago', color: '#10B981' },
  { id: 2, type: 'ending', title: 'Startup India Seed Fund', desc: 'Application window closing in 3 days. Apply before deadline.', time: '1 day ago', color: '#EF4444' },
  { id: 3, type: 'upcoming', title: 'Digital India Internship', desc: 'Winter session applications opening next week. Stay prepared.', time: '2 days ago', color: '#F59E0B' },
  { id: 4, type: 'new', title: 'Agri-Clinics Scheme Updated', desc: 'Revised eligibility criteria — now includes graduates from any stream.', time: '3 days ago', color: '#10B981' },
  { id: 5, type: 'ending', title: 'Kisan Scholarship 2026', desc: 'Merit scholarship deadline is in 5 days. Submit documents now.', time: '4 days ago', color: '#EF4444' },
];

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const [dismissedIds, setDismissedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ss_dismissed_notifs') || '[]'); } catch { return []; }
  });

  const activeNotifs = NOTIFICATIONS.filter(n => !dismissedIds.includes(n.id));
  const unreadCount = activeNotifs.length;

  useEffect(() => {
    const h = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const btnBg = theme === 'dark' ? 'rgba(255,255,255,0.08)' : '#F3F4F6';

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

            {/* LEFT: Hamburger + Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setSidebarOpen(true)} aria-label="Open menu" style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: btnBg, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}>
                <svg width="18" height="18" fill="none" stroke="var(--color-text-secondary)" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>

              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                <img
                  src="/logo.jpg"
                  alt="SmartSchemes"
                  style={{ height: '48px', width: 'auto', objectFit: 'contain', display: 'block' }}
                />
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '0.5px', fontFamily: "'Playfair Display', Georgia, serif" }}>
                  SMART<span style={{ color: '#1B3A5C' }}>SCHEMES</span>
                </span>
              </Link>
            </div>

            {/* RIGHT: Notifications + Auth */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Notifications */}
              <div ref={notifRef} style={{ position: 'relative' }}>
                <button onClick={() => setNotifOpen(!notifOpen)} style={{
                  position: 'relative', width: '36px', height: '36px', borderRadius: '10px',
                  background: notifOpen ? 'rgba(11,110,79,0.1)' : btnBg,
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}>
                  <svg width="16" height="16" fill="none" stroke={notifOpen ? '#0B6E4F' : 'var(--color-text-muted)'} viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute', top: '-2px', right: '-2px',
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: '#EF4444', color: '#fff',
                      fontSize: '0.625rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid var(--color-card)',
                    }}>{unreadCount}</span>
                  )}
                </button>

                {notifOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    width: '340px', maxHeight: '420px',
                    background: 'var(--color-card)', borderRadius: '16px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.12)', border: '1px solid var(--color-border-light)',
                    zIndex: 100, overflow: 'hidden',
                    animation: 'fade-up 0.25s cubic-bezier(0.16,1,0.3,1) both',
                  }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Notifications</span>
                        {unreadCount > 0 && (
                          <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.625rem', fontWeight: 700, background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>{unreadCount} new</span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button onClick={() => {
                          const all = NOTIFICATIONS.map(n => n.id);
                          setDismissedIds(all);
                          localStorage.setItem('ss_dismissed_notifs', JSON.stringify(all));
                        }} style={{ fontSize: '0.6875rem', color: '#0B6E4F', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Clear all</button>
                      )}
                    </div>
                    <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                      {activeNotifs.length > 0 ? activeNotifs.map(n => (
                        <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', gap: '10px', alignItems: 'flex-start', transition: 'background 0.15s', cursor: 'pointer' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.color, flexShrink: 0, marginTop: '6px' }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '1px 6px', borderRadius: '4px', background: n.type === 'new' ? 'rgba(16,185,129,0.1)' : n.type === 'ending' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: n.color }}>{n.type === 'new' ? 'New' : n.type === 'ending' ? 'Ending Soon' : 'Upcoming'}</span>
                            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '2px', marginTop: '4px', lineHeight: 1.3 }}>{n.title}</p>
                            <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{n.desc}</p>
                            <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>{n.time}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); const next = [...dismissedIds, n.id]; setDismissedIds(next); localStorage.setItem('ss_dismissed_notifs', JSON.stringify(next)); }} style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'var(--color-surface)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="10" height="10" fill="none" stroke="var(--color-text-muted)" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      )) : (
                        <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>All caught up!</p>
                        </div>
                      )}
                    </div>
                    <Link to="/updates" onClick={() => setNotifOpen(false)} style={{ display: 'block', padding: '10px 16px', borderTop: '1px solid var(--color-border-light)', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#0B6E4F', textDecoration: 'none' }}>View all updates →</Link>
                  </div>
                )}
              </div>

              {/* Auth button (compact) */}
              {!authLoading && (
                user ? (
                  <Link to="/profile" style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #0B6E4F, #10B981)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '0.75rem', fontWeight: 700,
                    textDecoration: 'none',
                  }}>
                    {(user.name || user.email || '?')[0].toUpperCase()}
                  </Link>
                ) : (
                  <Link to="/login" style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #0B6E4F, #10B981)',
                    color: '#fff', fontSize: '0.8125rem', fontWeight: 600,
                    textDecoration: 'none', boxShadow: '0 2px 8px rgba(11,110,79,0.2)',
                  }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>
                    Login
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Drawer */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
