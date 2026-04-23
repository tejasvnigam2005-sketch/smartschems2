import { Link, useLocation } from 'react-router-dom';
import { useLanguage, LANGUAGE_OPTIONS } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1' },
  { path: '/explore', icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' },
  { path: '/dashboard', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
  { path: '/how-it-works', icon: 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z' },
  { path: '/updates', icon: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0' },
  { path: '/subscription', icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z' },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { t, lang, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logoutUser } = useAuth();

  const labels = {
    '/': t('nav.home'),
    '/explore': t('nav.explore'),
    '/dashboard': t('nav.dashboard'),
    '/how-it-works': t('nav.howItWorks'),
    '/updates': t('nav.updates'),
    '/subscription': t('nav.subscription') || 'Subscription',
  };

  const isActive = (p) => location.pathname === p;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0, zIndex: 998,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          animation: 'fade-in 0.2s ease both',
        }} />
      )}

      {/* Sidebar Panel */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: '280px', zIndex: 999,
        background: 'var(--color-card)',
        borderRight: '1px solid var(--color-border-light)',
        boxShadow: isOpen ? '8px 0 30px rgba(0,0,0,0.1)' : 'none',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 20px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-border-light)',
        }}>
          <Link to="/" onClick={onClose} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            textDecoration: 'none',
          }}>
            <img
              src="/logo.jpg"
              alt="SmartSchemes"
              style={{ height: '44px', width: 'auto', objectFit: 'contain', display: 'block' }}
            />
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.5px' }}>
              Smart<span style={{ color: '#0B6E4F' }}>Schemes</span>
            </span>
          </Link>
          <button onClick={onClose} style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'var(--color-surface)', border: 'none',
            cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" fill="none" stroke="var(--color-text-muted)" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          <div style={{ marginBottom: '8px', padding: '0 8px' }}>
            <span style={{
              fontSize: '0.625rem', fontWeight: 700, letterSpacing: '1.5px',
              textTransform: 'uppercase', color: 'var(--color-text-muted)',
            }}>Navigation</span>
          </div>
          {NAV_LINKS.map(link => (
            <Link key={link.path} to={link.path} onClick={onClose} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 14px', borderRadius: '12px',
              marginBottom: '2px', textDecoration: 'none',
              fontSize: '0.875rem', fontWeight: isActive(link.path) ? 650 : 500,
              color: isActive(link.path) ? '#0B6E4F' : 'var(--color-text-secondary)',
              background: isActive(link.path) ? 'rgba(11,110,79,0.08)' : 'transparent',
              transition: 'all 0.2s ease',
            }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
                <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
              </svg>
              {labels[link.path]}
            </Link>
          ))}
        </div>

        {/* Bottom Section */}
        <div style={{
          padding: '16px', borderTop: '1px solid var(--color-border-light)',
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          {/* Theme + Language row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={toggleTheme} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '9px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: 'var(--color-surface)', color: 'var(--color-text-secondary)',
              fontSize: '0.75rem', fontWeight: 600,
            }}>
              {theme === 'dark' ? (
                <svg width="14" height="14" fill="none" stroke="#F59E0B" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <select value={lang} onChange={e => setLanguage(e.target.value)} style={{
              flex: 1, padding: '9px 8px', borderRadius: '10px',
              fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)',
              background: 'var(--color-surface)', border: 'none', cursor: 'pointer',
              appearance: 'none', textAlign: 'center',
            }}>
              {LANGUAGE_OPTIONS.map(o => <option key={o.code} value={o.code}>{o.name}</option>)}
            </select>
          </div>

          {/* Auth */}
          {user ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '12px',
              background: 'var(--color-surface)',
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #0B6E4F, #10B981)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
              }}>
                {(user.name || user.email || '?')[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name || 'User'}</p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', margin: 0 }}>{user.email}</p>
              </div>
            </div>
          ) : (
            <Link to="/login" onClick={onClose} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '11px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #0B6E4F, #10B981)',
              color: '#fff', fontSize: '0.8125rem', fontWeight: 650,
              textDecoration: 'none',
            }}>
              {t('nav.login')}
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
