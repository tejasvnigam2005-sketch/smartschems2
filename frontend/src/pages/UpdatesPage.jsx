import { Link } from 'react-router-dom';

const updates = [
  { type: 'NEW', color: '#16a34a', icon: '🎓', date: 'Mar 2026', title: 'PM Vidyalaxmi Scheme Extended', desc: 'Extended to cover NAAC B+ graded colleges for education loans with interest subvention.' },
  { type: 'UPDATED', color: '#2563eb', icon: '💼', date: 'Mar 2026', title: 'MUDRA Loan Limit Increased', desc: 'Tarun category increased from ₹10 lakh to ₹20 lakh for technology startups and manufacturing.' },
  { type: 'NEW', color: '#16a34a', icon: '🎓', date: 'Feb 2026', title: 'New AI & ML Scholarship by AICTE', desc: 'New scholarship for AI, ML, and Data Science students covering full tuition up to ₹2 lakh/year.' },
  { type: 'EXTENDED', color: '#d97706', icon: '💼', date: 'Feb 2026', title: 'Stand-Up India Extended to 2028', desc: 'Continuing support for SC/ST and women entrepreneurs with loans from ₹10 lakh to ₹1 crore.' },
  { type: 'LAUNCH', color: '#e85d04', icon: '🎓', date: 'Jan 2026', title: 'National Scholarship Portal 2.0', desc: 'Revamped NSP with Aadhaar-based authentication and real-time status tracking.' },
  { type: 'UPDATED', color: '#2563eb', icon: '💼', date: 'Jan 2026', title: 'CGTMSE Coverage Expanded', desc: 'Expanded to include micro enterprises in retail sector with increased ₹5 crore ceiling.' },
];

export default function UpdatesPage() {
  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: 'var(--color-surface)' }}>
      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-14">
        <div className="text-center mb-10 animate-fade-up">
          <div className="section-tag mx-auto mb-4">Feed</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.5px', marginBottom: '8px' }}>Latest Updates</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Recent changes to government schemes</p>
        </div>

        <div className="space-y-3">
          {updates.map((u, i) => (
            <div key={i} className="card p-5 flex items-start gap-4 animate-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="text-xl shrink-0 mt-0.5">{u.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="tag" style={{ background: `${u.color}12`, color: u.color, fontWeight: 700, fontSize: '0.6875rem' }}>{u.type}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{u.date}</span>
                </div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>{u.title}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{u.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 animate-fade-up delay-4">
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>Want to find schemes matching your profile?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/business" className="btn-primary no-underline">Business Schemes</Link>
            <Link to="/education" className="btn-outline no-underline">Education Schemes</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
