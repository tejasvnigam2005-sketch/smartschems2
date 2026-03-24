import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { path: '/', label: 'Home' },
    { path: '/business', label: 'Business' },
    { path: '/education', label: 'Education' },
    { path: '/updates', label: 'Updates' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: '#1c3f6e', borderBottom: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
      <div className="container">
        <div className="flex items-center justify-between" style={{ height: '64px' }}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 no-underline">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)' }}>
              🏛️
            </div>
            <span className="text-lg font-extrabold text-white tracking-tight hidden sm:block">
              Smart<span style={{ color: '#e85d04' }}>Schemes</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="no-underline"
                style={{
                  padding: '7px 16px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: isActive(link.path) ? '#fff' : 'rgba(255,255,255,0.6)',
                  background: isActive(link.path) ? 'rgba(255,255,255,0.12)' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 -mr-2 rounded-lg transition-colors" style={{ color: 'rgba(255,255,255,0.7)', background: 'transparent', border: 'none' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden animate-fade-in" style={{ background: '#1c3f6e', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="container py-3 space-y-1">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className="block no-underline"
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: isActive(link.path) ? '#fff' : 'rgba(255,255,255,0.6)',
                  background: isActive(link.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
