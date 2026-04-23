import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #0B6E4F, #10B981)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '0.75rem', fontWeight: 700,
              }}>
                <svg width="14" height="14" fill="#fff" viewBox="0 0 24 24"><path d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18" /></svg>
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                Smart<span style={{ color: '#0B6E4F' }}>Schemes</span>
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: '280px', marginBottom: '20px' }}>
              {t('footer.desc')}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href="#" style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-text-secondary)', transition: 'all 0.2s ease', textDecoration: 'none',
              }}>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-text-secondary)', transition: 'all 0.2s ease', textDecoration: 'none',
              }}>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px' }}>{t('footer.resources')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: t('footer.officialPortals'), href: '#' },
                { label: 'MyGov India', href: 'https://mygov.in' },
                { label: 'National Portal', href: 'https://india.gov.in' },
              ].map(link => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" style={{
                  fontSize: '0.8125rem', color: 'var(--color-text-secondary)', transition: 'color 0.2s ease', textDecoration: 'none',
                }}>
                  {link.label}
                </a>
              ))}
              <Link to="/subscription" style={{
                fontSize: '0.8125rem', color: 'var(--color-text-secondary)', transition: 'color 0.2s ease', textDecoration: 'none',
              }}>
                {t('nav.subscription') || 'Pricing'}
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px' }}>{t('footer.legal')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: t('footer.privacy'), path: '#' },
                { label: t('footer.terms'), path: '#' },
                { label: t('footer.disclaimer'), path: '#' },
              ].map(link => (
                <Link key={link.label} to={link.path} style={{
                  fontSize: '0.8125rem', color: 'var(--color-text-secondary)', transition: 'color 0.2s ease', textDecoration: 'none',
                }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid var(--color-border-light)',
          paddingTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {t('footer.copyright')}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>{t('footer.systemStatus')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
