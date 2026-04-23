import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage, LANGUAGE_OPTIONS } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const NOTIFICATIONS = [
  { id: 1, type: 'new', title: 'PM Vishwakarma Yojana', desc: 'New scheme launched for traditional artisans — up to ₹3 Lakh loan at 5% interest.', time: '2 hours ago', color: '#10B981' },
  { id: 2, type: 'ending', title: 'Startup India Seed Fund', desc: 'Application window closing in 3 days. Apply before deadline.', time: '1 day ago', color: '#EF4444' },
  { id: 3, type: 'upcoming', title: 'Digital India Internship', desc: 'Winter session applications opening next week. Stay prepared.', time: '2 days ago', color: '#F59E0B' },
  { id: 4, type: 'new', title: 'Agri-Clinics Scheme Updated', desc: 'Revised eligibility criteria — now includes graduates from any stream.', time: '3 days ago', color: '#10B981' },
  { id: 5, type: 'ending', title: 'Kisan Scholarship 2026', desc: 'Merit scholarship deadline is in 5 days. Submit documents now.', time: '4 days ago', color: '#EF4444' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, lang, setLanguage } = useLanguage();
  const { user, loading: authLoading, logoutUser } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const [dismissedIds, setDismissedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ss_dismissed_notifs') || '[]'); } catch { return []; }
  });

  const activeNotifs = NOTIFICATIONS.filter(n => !dismissedIds.includes(n.id));
  const unreadCount = activeNotifs.length;

  useEffect(() => {
    const h = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
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

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const links = [
    { path: '/', label: t('nav.home') },
    { path: '/explore', label: t('nav.explore') },
    { path: '/dashboard', label: t('nav.dashboard') },
    { path: '/how-it-works', label: t('nav.howItWorks') },
    { path: '/updates', label: t('nav.updates') },
  ];

  const isActive = (p) => location.pathname === p;

  const linkStyle = (p) => ({
    padding: '6px 14px', borderRadius: '8px', fontSize: '0.8125rem',
    fontWeight: isActive(p) ? 600 : 500,
    color: isActive(p) ? '#0B6E4F' : '#4B5563',
    background: isActive(p) ? 'rgba(11,110,79,0.06)' : 'transparent',
    textDecoration: 'none',
    transition: 'all 0.25s ease', whiteSpace: 'nowrap',
  });

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

          {/* LEFT: Logo + Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', minWidth: 0 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #0B6E4F, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.875rem', fontWeight: 700, boxShadow: '0 2px 8px rgba(11,110,79,0.2)' }}>
                <svg width="16" height="16" fill="#fff" viewBox="0 0 24 24"><path d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18" /></svg>
              </div>
              <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
                Smart<span style={{ color: '#0B6E4F' }}>Schemes</span>
              </span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hidden md:flex">
              {links.map(l => <Link key={l.path} to={l.path} style={linkStyle(l.path)}>{l.label}</Link>)}
            </div>
          </div>

          {/* RIGHT: Search + Language + Auth + Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Search */}
            <Link to="/explore" className="hidden xl:flex" style={{
              alignItems: 'center', gap: '8px', padding: '7px 14px',
              background: '#F3F4F6', borderRadius: '8px', minWidth: '140px',
              textDecoration: 'none', cursor: 'pointer',
              transition: 'background 0.2s',
            }}
              onMouseOver={e => e.currentTarget.style.background = '#E5E7EB'}
              onMouseOut={e => e.currentTarget.style.background = '#F3F4F6'}
            >
              <svg width="14" height="14" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" /></svg>
              <span style={{ fontSize: '0.8125rem', color: '#6B7280', fontWeight: 500 }}>{t('nav.search')}</span>
            </Link>

            {/* Language */}
            <select value={lang} onChange={e => setLanguage(e.target.value)} style={{ padding: '6px 24px 6px 10px', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 600, color: '#0B6E4F', background: 'rgba(11,110,79,0.1)', border: '1px solid rgba(11,110,79,0.2)', cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%230B6E4F' viewBox='0 0 24 24' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center' }}>
              {LANGUAGE_OPTIONS.map(o => <option key={o.code} value={o.code}>{o.name}</option>)}
            </select>

            {/* Notifications Bell */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button onClick={() => setNotifOpen(!notifOpen)} style={{
                position: 'relative', width: '36px', height: '36px', borderRadius: '10px',
                background: notifOpen ? 'rgba(11,110,79,0.1)' : '#F3F4F6',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}>
                <svg width="16" height="16" fill="none" stroke={notifOpen ? '#0B6E4F' : '#6B7280'} viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-2px', right: '-2px',
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: '#EF4444', color: '#fff',
                    fontSize: '0.625rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid #fff',
                    animation: 'pulse-glow 2s infinite',
                  }}>{unreadCount}</span>
                )}
              </button>

              {notifOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  width: '340px', maxHeight: '420px',
                  background: '#fff', borderRadius: '16px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.12)', border: '1px solid #F3F4F6',
                  zIndex: 100, overflow: 'hidden',
                  animation: 'fade-up 0.25s cubic-bezier(0.16,1,0.3,1) both',
                }}>
                  {/* Header */}
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>Notifications</span>
                      {unreadCount > 0 && (
                        <span style={{
                          padding: '2px 8px', borderRadius: '10px', fontSize: '0.625rem', fontWeight: 700,
                          background: 'rgba(239,68,68,0.1)', color: '#EF4444',
                        }}>{unreadCount} new</span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={() => {
                        const all = NOTIFICATIONS.map(n => n.id);
                        setDismissedIds(all);
                        localStorage.setItem('ss_dismissed_notifs', JSON.stringify(all));
                      }} style={{
                        fontSize: '0.6875rem', color: '#0B6E4F', fontWeight: 600,
                        background: 'none', border: 'none', cursor: 'pointer',
                      }}>Clear all</button>
                    )}
                  </div>

                  {/* Notification items */}
                  <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                    {activeNotifs.length > 0 ? activeNotifs.map(n => (
                      <div key={n.id} style={{
                        padding: '12px 16px', borderBottom: '1px solid #FAFAFA',
                        display: 'flex', gap: '10px', alignItems: 'flex-start',
                        transition: 'background 0.15s', cursor: 'pointer',
                      }}
                        onMouseOver={e => e.currentTarget.style.background = '#FAFAFA'}
                        onMouseOut={e => e.currentTarget.style.background = '#fff'}
                      >
                        <div style={{
                          width: '8px', height: '8px', borderRadius: '50%',
                          background: n.color, flexShrink: 0, marginTop: '6px',
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                            <span style={{
                              fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                              padding: '1px 6px', borderRadius: '4px',
                              background: n.type === 'new' ? 'rgba(16,185,129,0.1)' : n.type === 'ending' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                              color: n.color,
                            }}>{n.type === 'new' ? 'New' : n.type === 'ending' ? 'Ending Soon' : 'Upcoming'}</span>
                          </div>
                          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827', marginBottom: '2px', lineHeight: 1.3 }}>{n.title}</p>
                          <p style={{ fontSize: '0.6875rem', color: '#6B7280', lineHeight: 1.4, marginBottom: '4px' }}>{n.desc}</p>
                          <span style={{ fontSize: '0.625rem', color: '#9CA3AF' }}>{n.time}</span>
                        </div>
                        <button onClick={(e) => {
                          e.stopPropagation();
                          const next = [...dismissedIds, n.id];
                          setDismissedIds(next);
                          localStorage.setItem('ss_dismissed_notifs', JSON.stringify(next));
                        }} style={{
                          width: '20px', height: '20px', borderRadius: '6px',
                          background: '#F3F4F6', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <svg width="10" height="10" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )) : (
                      <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                        <svg width="32" height="32" fill="none" stroke="#D1D5DB" viewBox="0 0 24 24" strokeWidth="1.5" style={{ margin: '0 auto 8px' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                        </svg>
                        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>All caught up!</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <Link to="/updates" onClick={() => setNotifOpen(false)} style={{
                    display: 'block', padding: '10px 16px',
                    borderTop: '1px solid #F3F4F6', textAlign: 'center',
                    fontSize: '0.75rem', fontWeight: 600, color: '#0B6E4F',
                    textDecoration: 'none', transition: 'background 0.15s',
                  }}
                    onMouseOver={e => e.currentTarget.style.background = '#F0FDF4'}
                    onMouseOut={e => e.currentTarget.style.background = '#fff'}
                  >View all updates →</Link>
                </div>
              )}
            </div>

            {/* Auth */}
            {!authLoading && (
              <div className="hidden sm:flex" style={{ alignItems: 'center' }}>
                {user ? (
                  <div ref={profileRef} style={{ position: 'relative' }}>
                    <button onClick={() => setProfileOpen(!profileOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 10px 5px 5px', borderRadius: '10px', border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #0B6E4F, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>
                        {(user.name || user.email || '?')[0].toUpperCase()}
                      </div>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name || 'User'}</span>
                      <svg width="12" height="12" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {profileOpen && (
                      <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: '#fff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', border: '1px solid #F3F4F6', minWidth: '180px', zIndex: 100, overflow: 'hidden' }}>
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6' }}>
                          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827', margin: 0 }}>{user.name || 'User'}</p>
                          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '2px 0 0' }}>{user.email}</p>
                        </div>
                        <Link to="/dashboard" onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.8125rem', color: '#374151', textDecoration: 'none' }}>{t('nav.dashboard')}</Link>
                        <button onClick={() => { setProfileOpen(false); logoutUser(); navigate('/'); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 16px', fontSize: '0.8125rem', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>{t('nav.logout')}</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '10px', background: 'linear-gradient(135deg, #0B6E4F, #10B981)', color: '#fff', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none', boxShadow: '0 2px 8px rgba(11,110,79,0.2)' }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>
                    {t('nav.login')}
                  </Link>
                )}
              </div>
            )}

            {/* Mobile Toggle */}
            <button onClick={() => setOpen(!open)} className="md:hidden" style={{ padding: '8px', borderRadius: '10px', color: '#4B5563', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                {open ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden" style={{ background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="container" style={{ padding: '12px 24px' }}>
            {links.map(l => (
              <Link key={l.path} to={l.path} onClick={() => setOpen(false)} style={{ display: 'block', padding: '12px 16px', borderRadius: '10px', fontSize: '0.9375rem', fontWeight: isActive(l.path) ? 600 : 500, color: isActive(l.path) ? '#0B6E4F' : '#4B5563', background: isActive(l.path) ? 'rgba(11,110,79,0.06)' : 'transparent', textDecoration: 'none' }}>{l.label}</Link>
            ))}
            <div style={{ borderTop: '1px solid #F3F4F6', marginTop: '8px', paddingTop: '8px' }}>
              {user ? (
                <>
                  <div style={{ padding: '12px 16px', fontSize: '0.8125rem', color: '#9CA3AF' }}>{t('nav.signedInAs')} <strong style={{ color: '#111827' }}>{user.name || user.email}</strong></div>
                  <button onClick={() => { setOpen(false); logoutUser(); navigate('/'); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: '10px', fontSize: '0.9375rem', fontWeight: 500, color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer' }}>{t('nav.logout')}</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} style={{ display: 'block', padding: '12px 16px', borderRadius: '10px', fontSize: '0.9375rem', fontWeight: 600, color: '#0B6E4F', textDecoration: 'none', background: 'rgba(11,110,79,0.06)' }}>{t('nav.loginSignUp')}</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
