import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const steps = [
  {
    num: '01',
    svgPath: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10',
    title: 'Fill Your Profile',
    desc: 'Provide basic details like age, income, state, and occupation type. Choose between business or education schemes.',
    color: '#0B6E4F',
  },
  {
    num: '02',
    svgPath: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
    title: 'Profile Analysis',
    desc: 'Your profile is cross-referenced against 2,000+ government schemes from Central and State databases in real-time.',
    color: '#3B82F6',
  },
  {
    num: '03',
    svgPath: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
    title: 'Relevance Scoring',
    desc: 'Each scheme is scored 0–100 based on how closely it matches your eligibility criteria. Higher scores mean better fit.',
    color: '#7C3AED',
  },
  {
    num: '04',
    svgPath: 'M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z',
    title: 'Compare & Decide',
    desc: 'View your top recommendations, compare them side-by-side, explore benefits, eligibility, and application steps.',
    color: '#D97706',
  },
  {
    num: '05',
    svgPath: 'M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z',
    title: 'Listen in Your Language',
    desc: 'Use Text-to-Speech to hear scheme details in Hindi or English. Accessibility is built-in for every citizen.',
    color: '#10B981',
  },
];

const techStack = [
  { svgPath: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5m4.75-11.396c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 14.4', label: 'Smart Engine', desc: 'Intelligent matching to parse & rank schemes' },
  { svgPath: 'M8.288 15.038a5.25 5.25 0 010-7.424m7.424 7.424a5.25 5.25 0 000-7.424M5.636 17.69a9 9 0 010-12.728m12.728 12.728a9 9 0 000-12.728', label: 'Live Data Sync', desc: 'Connected to official government portals' },
  { svgPath: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z', label: 'Privacy First', desc: 'No data stored — processed and discarded' },
  { svgPath: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582', label: 'Multi-lingual', desc: 'Hindi and English with voice readout' },
];

function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    const els = ref.current?.querySelectorAll('.scroll-reveal');
    els?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function HowItWorksPage() {
  const sectionRef = useScrollReveal();

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: 'var(--color-card)', position: 'relative', overflow: 'hidden' }} ref={sectionRef}>

      {/* Animated background particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '10%', right: '5%',
          width: '16px', height: '16px', borderRadius: '50%',
          background: 'rgba(11,110,79,0.06)',
          animation: 'float 7s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '30%', left: '3%',
          width: '10px', height: '10px', borderRadius: '4px',
          background: 'rgba(59,130,246,0.06)',
          animation: 'float 5s ease-in-out 1s infinite',
          transform: 'rotate(45deg)',
        }} />
        <div style={{
          position: 'absolute', top: '60%', right: '8%',
          width: '8px', height: '8px', borderRadius: '50%',
          background: 'rgba(124,58,237,0.05)',
          animation: 'float 6s ease-in-out 2s infinite',
        }} />
        <div style={{
          position: 'absolute', top: '80%', left: '10%',
          width: '12px', height: '12px', borderRadius: '50%',
          background: 'rgba(217,119,6,0.05)',
          animation: 'float 8s ease-in-out infinite reverse',
        }} />
      </div>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #F9FAFB 100%)',
        padding: '56px 0 48px',
        borderBottom: '1px solid rgba(11,110,79,0.06)',
        position: 'relative', zIndex: 1,
      }}>
        <div className="container animate-fade-up" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.5px', marginBottom: '12px' }}>
            From Your Profile to<br />Perfect Scheme Match
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.7 }}>
            A transparent, 5-step process that finds the best government schemes for you — in seconds.
          </p>
          <img src="/images/how-it-works-hero.png" alt="SmartSchemes workflow pipeline"
            style={{
              width: '260px', height: 'auto', margin: '0 auto',
              filter: 'drop-shadow(0 10px 25px rgba(11,110,79,0.1))',
              animation: 'float 6s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* ── Flow Diagram ── */}
      <section style={{ padding: '64px 0 80px' }}>
        <div className="container" style={{ maxWidth: '720px', margin: '0 auto' }}>

          {/* Visual pipeline */}
          <div style={{ position: 'relative' }}>

            {/* Vertical connector line */}
            <div style={{
              position: 'absolute',
              left: '32px',
              top: '48px',
              bottom: '48px',
              width: '2px',
              background: 'linear-gradient(to bottom, #0B6E4F, #3B82F6, #7C3AED, #D97706, #10B981)',
              borderRadius: '2px',
              zIndex: 0,
            }} className="hidden md:block" />

            {steps.map((step, i) => (
              <div
                key={i}
                className="scroll-reveal"
                style={{
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'flex-start',
                  marginBottom: i < steps.length - 1 ? '24px' : '0',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {/* Step number circle */}
                <div style={{
                  width: '64px', height: '64px',
                  borderRadius: '20px',
                  background: `${step.color}0D`,
                  border: `2px solid ${step.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                }}>
                  <svg width="24" height="24" fill="none" stroke={step.color} viewBox="0 0 24 24" strokeWidth="1.75">
                    <path strokeLinecap="round" strokeLinejoin="round" d={step.svgPath} />
                  </svg>
                  {/* Pulse ring */}
                  <div style={{
                    position: 'absolute',
                    inset: '-4px',
                    borderRadius: '22px',
                    border: `1px solid ${step.color}15`,
                    animation: `pulse-glow 3s ease-in-out ${i * 0.5}s infinite`,
                  }} />
                </div>

                {/* Content card */}
                <div style={{
                  flex: 1,
                  background: 'var(--color-surface)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  border: '1px solid var(--color-border-light)',
                  transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                  cursor: 'default',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 20px ${step.color}15`; e.currentTarget.style.borderColor = `${step.color}25`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#F3F4F6'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '0.625rem', fontWeight: 800,
                      color: step.color, letterSpacing: '1px',
                    }}>
                      STEP {step.num}
                    </span>
                    <div style={{ flex: 1, height: '1px', background: `${step.color}15` }} />
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>{step.title}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            ))}

            {/* Arrow connectors between steps */}
            {steps.slice(0, -1).map((_, i) => (
              <div key={i} className="hidden md:flex" style={{
                position: 'absolute',
                left: '30px',
                top: `${86 + i * 112}px`,
                display: 'flex', justifyContent: 'center',
              }}>
                <svg width="8" height="16" viewBox="0 0 8 16" fill={steps[i].color} style={{ opacity: 0.3 }}>
                  <path d="M4 0L4 12L1 9L4 16L7 9L4 12L4 0Z" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Architecture Diagram ── */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="scroll-reveal" style={{
            background: 'linear-gradient(145deg, #1F2937, #111827)',
            borderRadius: '24px',
            padding: '40px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: '250px', height: '250px',
              background: 'radial-gradient(circle, rgba(11,110,79,0.15) 0%, transparent 70%)',
            }} />

            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '8px', position: 'relative' }}>
              System Architecture
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', marginBottom: '32px', position: 'relative' }}>
              How data flows through SmartSchemes
            </p>

            {/* Flow diagram */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              position: 'relative',
            }}>
              {[
                { label: 'User Input', svgD: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0', bg: 'rgba(16,185,129,0.15)' },
                null,
                { label: 'API Gateway', svgD: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244', bg: 'rgba(59,130,246,0.15)' },
                null,
                { label: 'Smart Engine', svgD: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5', bg: 'rgba(124,58,237,0.15)' },
                null,
                { label: 'Gov Database', svgD: 'M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332', bg: 'rgba(217,119,6,0.15)' },
                null,
                { label: 'Results', svgD: 'M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9', bg: 'rgba(16,185,129,0.15)' },
              ].map((item, i) => {
                if (!item) {
                  return (
                    <svg key={i} width="24" height="12" viewBox="0 0 24 12" fill="rgba(255,255,255,0.2)" style={{ flexShrink: 0 }}>
                      <path d="M0 6H20L16 2M20 6L16 10" stroke="rgba(255,255,255,0.3)" fill="none" strokeWidth="1.5" />
                    </svg>
                  );
                }
                return (
                  <div key={i} style={{
                    background: item.bg,
                    borderRadius: '14px',
                    padding: '14px 18px',
                    textAlign: 'center',
                    minWidth: '90px',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.3s ease',
                  }}>
                    <div style={{ marginBottom: '6px' }}>
                      <svg width="20" height="20" fill="none" stroke="rgba(255,255,255,0.8)" viewBox="0 0 24 24" strokeWidth="1.75">
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.svgD} />
                      </svg>
                    </div>
                    <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="scroll-reveal" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '24px', textAlign: 'center' }}>
            Built With Trust
          </h2>
          <div className="scroll-reveal" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
          }}>
            {techStack.map((tech, i) => (
              <div key={i} style={{
                background: 'var(--color-surface)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid var(--color-border-light)',
                textAlign: 'center',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                  <svg width="28" height="28" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d={tech.svgPath} />
                  </svg>
                </div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>{tech.label}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="scroll-reveal" style={{ padding: '0 0 80px' }}>
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '10px' }}>Ready to Find Your Schemes?</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}>It takes less than 60 seconds.</p>
          <Link to="/explore" className="btn-primary" style={{ padding: '14px 32px' }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="m21 21-4.35-4.35" />
            </svg>
            Explore Schemes Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
