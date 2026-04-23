import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const updates = [
  { type: 'NEW', color: '#10B981', svgD: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347', date: 'Mar 2026', title: 'PM Vidyalaxmi Scheme Extended', desc: 'Extended to cover NAAC B+ graded colleges for education loans with interest subvention.' },
  { type: 'UPDATED', color: '#3B82F6', svgD: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', date: 'Mar 2026', title: 'MUDRA Loan Limit Increased', desc: 'Tarun category increased from ₹10 lakh to ₹20 lakh for technology startups and manufacturing.' },
  { type: 'NEW', color: '#10B981', svgD: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347', date: 'Feb 2026', title: 'New Scholarship by AICTE', desc: 'New scholarship for students in emerging tech fields covering full tuition up to ₹2 lakh/year.' },
  { type: 'EXTENDED', color: '#F59E0B', svgD: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', date: 'Feb 2026', title: 'Stand-Up India Extended to 2028', desc: 'Continuing support for SC/ST and women entrepreneurs with loans from ₹10 lakh to ₹1 crore.' },
  { type: 'LAUNCH', color: '#3B82F6', svgD: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347', date: 'Jan 2026', title: 'National Scholarship Portal 2.0', desc: 'Revamped NSP with Aadhaar-based authentication and real-time status tracking.' },
  { type: 'UPDATED', color: '#3B82F6', svgD: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', date: 'Jan 2026', title: 'CGTMSE Coverage Expanded', desc: 'Expanded to include micro enterprises in retail sector with increased ₹5 crore ceiling.' },
];

export default function UpdatesPage() {
  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: 'var(--color-card)' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #F9FAFB 100%)',
        padding: '48px 0 40px',
        borderBottom: '1px solid rgba(11,110,79,0.06)',
      }}>
        <div className="container animate-fade-up" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.5px', marginBottom: '8px' }}>Latest Updates</h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>Recent changes to government schemes</p>
        </div>
      </div>

      <div style={{ maxWidth: '672px', margin: '0 auto', padding: '32px 24px 56px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {updates.map((u, i) => (
            <div
              key={i}
              className="card-static animate-fade-up"
              style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                animationDelay: `${i * 0.06}s`,
                borderRadius: '16px',
                transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                cursor: 'default',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.02)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'rgba(11,110,79,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="18" height="18" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d={u.svgD} />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '6px',
                    fontSize: '0.625rem', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                    background: `${u.color}0D`, color: u.color,
                  }}>
                    {u.type}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{u.date}</span>
                </div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>{u.title}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{u.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }} className="animate-fade-up delay-4">
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>Want to find schemes matching your profile?</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/business" className="btn-primary">Business Schemes</Link>
            <Link to="/education" className="btn-outline">Education Schemes</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
