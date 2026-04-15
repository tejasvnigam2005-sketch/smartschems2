import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const links = [
    { path: '/', label: 'Home' },
    { path: '/explore', label: 'Explore Schemes' },
    { path: '/how-it-works', label: 'How It Works' },
    { path: '/updates', label: 'Updates' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #0B6E4F, #10B981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '0.875rem', fontWeight: 700,
              boxShadow: '0 2px 8px rgba(11,110,79,0.2)',
            }}>
              🏛️
            </div>
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
              Smart<span style={{ color: '#0B6E4F' }}>Schemes</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hidden md:flex">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: isActive(link.path) ? 600 : 500,
                  color: isActive(link.path) ? '#0B6E4F' : '#4B5563',
                  background: isActive(link.path) ? 'rgba(11,110,79,0.06)' : 'transparent',
                  transition: 'all 0.2s ease',
                  textDecoration: isActive(link.path) ? 'underline' : 'none',
                  textUnderlineOffset: '4px',
                  textDecorationColor: '#0B6E4F',
                  textDecorationThickness: '2px',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Search */}
            <div className="hidden sm:flex" style={{
              alignItems: 'center', gap: '8px',
              padding: '8px 16px',
              background: '#F3F4F6',
              borderRadius: '10px',
              minWidth: '180px',
            }}>
              <svg width="14" height="14" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="m21 21-4.35-4.35" />
              </svg>
              <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>Search schemes...</span>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden"
              style={{
                padding: '8px',
                borderRadius: '10px',
                color: '#4B5563',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                {open
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className="md:hidden"
          style={{
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            animation: 'fade-in 0.2s ease both',
          }}
        >
          <div className="container" style={{ padding: '12px 24px' }}>
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                style={{
                  display: 'block',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '0.9375rem',
                  fontWeight: isActive(link.path) ? 600 : 500,
                  color: isActive(link.path) ? '#0B6E4F' : '#4B5563',
                  background: isActive(link.path) ? 'rgba(11,110,79,0.06)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
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
