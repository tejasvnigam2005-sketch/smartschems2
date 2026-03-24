import { Link } from 'react-router-dom';

const stats = [
  { value: '20+', label: 'Schemes' },
  { value: 'AI', label: 'Powered' },
  { value: '2', label: 'Categories' },
  { value: 'Free', label: 'Forever' },
];

const steps = [
  { num: '01', title: 'Choose Category', desc: 'Select between Business or Education schemes' },
  { num: '02', title: 'Enter Details', desc: 'Fill in your age, income, location and other criteria' },
  { num: '03', title: 'Get Results', desc: 'Our AI ranks and compares the best schemes for you' },
];

export default function LandingPage() {
  return (
    <div style={{ paddingTop: '64px' }}>
      {/* ── Hero ─────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #0f1b2d 0%, #1c3f6e 50%, #0f1b2d 100%)', padding: '80px 0 60px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(232,93,4,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-40px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="text-center animate-fade-up">
            <div className="section-tag mx-auto mb-6" style={{ border: '1px solid rgba(232,93,4,0.5)' }}>
              AI-Powered Platform
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: '16px' }}>
              Find the Right<br />
              <span style={{ color: '#e85d04' }}>Government Schemes</span>
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.55)', maxWidth: '520px', margin: '0 auto 40px', lineHeight: 1.7 }}>
              Intelligent filtering and AI-powered ranking to match you with the most relevant schemes — in seconds.
            </p>
          </div>

          {/* Category Cards */}
          <div className="flex flex-col sm:flex-row gap-5 max-w-xl mx-auto animate-fade-up delay-1">
            <Link to="/business" className="flex-1 no-underline" style={{ display: 'block' }}>
              <div className="card p-6 text-center" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(232,93,4,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                <div className="text-3xl mb-3">💼</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Business Schemes</h3>
                <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', marginBottom: '12px' }}>MUDRA loans, Startup India, MSME support & more</p>
                <span style={{ fontSize: '0.8125rem', color: '#e85d04', fontWeight: 600 }}>Explore →</span>
              </div>
            </Link>
            <Link to="/education" className="flex-1 no-underline" style={{ display: 'block' }}>
              <div className="card p-6 text-center" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(232,93,4,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                <div className="text-3xl mb-3">🎓</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Education Schemes</h3>
                <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', marginBottom: '12px' }}>Scholarships, fellowships & education loans</p>
                <span style={{ fontSize: '0.8125rem', color: '#e85d04', fontWeight: 600 }}>Explore →</span>
              </div>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 sm:gap-14 mt-12 animate-fade-up delay-2">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>{s.value}</div>
                <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────── */}
      <section style={{ background: 'var(--color-surface)', padding: '72px 0' }}>
        <div className="container">
          <div className="text-center mb-12 animate-fade-up">
            <div className="section-tag mx-auto mb-4">How It Works</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.5px' }}>
              Three Simple Steps
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
              Discover government schemes tailored specifically for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="card p-6 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-accent)', opacity: 0.2, marginBottom: '8px' }}>{step.num}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>{step.title}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────── */}
      <section style={{ background: '#fff', padding: '64px 0', borderTop: '1px solid var(--color-border-light)' }}>
        <div className="container text-center animate-fade-up">
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '12px' }}>
            Ready to find your perfect scheme?
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', marginBottom: '28px' }}>
            Start exploring government benefits designed for your needs
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/business" className="btn-primary no-underline">Business Schemes</Link>
            <Link to="/education" className="btn-outline no-underline">Education Schemes</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────── */}
      <footer style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border-light)', padding: '24px 0' }}>
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Smart<span style={{ color: 'var(--color-accent)' }}>Schemes</span></span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>© 2026 SmartSchemes. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
