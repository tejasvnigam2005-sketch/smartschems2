import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage, LANGUAGE_OPTIONS } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, lang, setLanguage } = useLanguage();
  const { user, loading: authLoading, logoutUser } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false); };
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
    padding: '6px 12px', borderRadius: '8px', fontSize: '0.875rem',
    fontWeight: isActive(p) ? 600 : 500,
    color: isActive(p) ? '#0B6E4F' : '#4B5563',
    textDecoration: isActive(p) ? 'underline' : 'none',
    textUnderlineOffset: '4px', textDecorationThickness: '2px',
    transition: 'all 0.2s', whiteSpace: 'nowrap',
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }} className="hidden md:flex">
              {links.map(l => <Link key={l.path} to={l.path} style={linkStyle(l.path)}>{l.label}</Link>)}
            </div>
          </div>

          {/* RIGHT: Search + Language + Auth + Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {/* Search */}
            <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '8px', padding: '7px 14px', background: '#F3F4F6', borderRadius: '8px', minWidth: '160px' }}>
              <svg width="14" height="14" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" /></svg>
              <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>{t('nav.search')}</span>
            </div>

            {/* Language */}
            <select value={lang} onChange={e => setLanguage(e.target.value)} style={{ padding: '6px 24px 6px 10px', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 600, color: '#0B6E4F', background: 'rgba(11,110,79,0.1)', border: '1px solid rgba(11,110,79,0.2)', cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%230B6E4F' viewBox='0 0 24 24' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center' }}>
              {LANGUAGE_OPTIONS.map(o => <option key={o.code} value={o.code}>{o.name}</option>)}
            </select>

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
                        <Link to="/dashboard" onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.8125rem', color: '#374151', textDecoration: 'none' }}>Dashboard</Link>
                        <button onClick={() => { setProfileOpen(false); logoutUser(); navigate('/'); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 16px', fontSize: '0.8125rem', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>Logout</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '10px', background: 'linear-gradient(135deg, #0B6E4F, #10B981)', color: '#fff', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none', boxShadow: '0 2px 8px rgba(11,110,79,0.2)' }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>
                    Login
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
                  <div style={{ padding: '12px 16px', fontSize: '0.8125rem', color: '#9CA3AF' }}>Signed in as <strong style={{ color: '#111827' }}>{user.name || user.email}</strong></div>
                  <button onClick={() => { setOpen(false); logoutUser(); navigate('/'); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: '10px', fontSize: '0.9375rem', fontWeight: 500, color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer' }}>Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} style={{ display: 'block', padding: '12px 16px', borderRadius: '10px', fontSize: '0.9375rem', fontWeight: 600, color: '#0B6E4F', textDecoration: 'none', background: 'rgba(11,110,79,0.06)' }}>Login / Sign Up</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
