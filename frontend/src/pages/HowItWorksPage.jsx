import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const steps = [
  {
    num: '01',
    icon: '📝',
    title: 'Fill Your Profile',
    desc: 'Provide basic details like age, income, state, and occupation type. Choose between business or education schemes.',
    color: '#0B6E4F',
  },
  {
    num: '02',
    icon: '🤖',
    title: 'AI Processes Your Data',
    desc: 'Our NLP engine cross-references your profile against 2,000+ government schemes from Central and State databases in real-time.',
    color: '#3B82F6',
  },
  {
    num: '03',
    icon: '🎯',
    title: 'Relevance Scoring',
    desc: 'Each scheme is scored 0–100 based on how closely it matches your eligibility criteria. Higher scores mean better fit.',
    color: '#7C3AED',
  },
  {
    num: '04',
    icon: '📊',
    title: 'Compare & Decide',
    desc: 'View your top recommendations, compare them side-by-side, explore benefits, eligibility, and application steps.',
    color: '#D97706',
  },
  {
    num: '05',
    icon: '🔊',
    title: 'Listen in Your Language',
    desc: 'Use Text-to-Speech to hear scheme details in Hindi or English. Accessibility is built-in for every citizen.',
    color: '#10B981',
  },
];

const techStack = [
  { icon: '🧠', label: 'NLP Engine', desc: 'Natural Language Processing to parse & match schemes' },
  { icon: '📡', label: 'Live Data Sync', desc: 'Connected to official government portals for real-time updates' },
  { icon: '🔒', label: 'Privacy First', desc: 'No data stored — your information is processed and discarded' },
  { icon: '🌐', label: 'Multi-lingual', desc: 'Hindi and English support with voice readout' },
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
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#fff', position: 'relative', overflow: 'hidden' }} ref={sectionRef}>

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
          <div className="section-tag" style={{ margin: '0 auto 16px' }}>How It Works</div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', marginBottom: '12px' }}>
            From Your Profile to<br />Perfect Scheme Match
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#6B7280', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.7 }}>
            A transparent, 5-step AI pipeline that finds the best government schemes for you — in seconds.
          </p>
          <img src="/images/how-it-works-hero.png" alt="SmartSchemes AI workflow pipeline"
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
                  {step.icon}
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
                  background: '#FAFAFA',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  border: '1px solid #F3F4F6',
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
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>{step.title}</h3>
                  <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.6 }}>{step.desc}</p>
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
                { label: 'User Input', icon: '👤', bg: 'rgba(16,185,129,0.15)' },
                null, // arrow
                { label: 'API Gateway', icon: '🔗', bg: 'rgba(59,130,246,0.15)' },
                null,
                { label: 'AI Engine', icon: '🧠', bg: 'rgba(124,58,237,0.15)' },
                null,
                { label: 'Gov Database', icon: '🏛️', bg: 'rgba(217,119,6,0.15)' },
                null,
                { label: 'Results', icon: '📊', bg: 'rgba(16,185,129,0.15)' },
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
                    <div style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{item.icon}</div>
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
          <h2 className="scroll-reveal" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '24px', textAlign: 'center' }}>
            Built With Trust
          </h2>
          <div className="scroll-reveal" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
          }}>
            {techStack.map((tech, i) => (
              <div key={i} style={{
                background: '#FAFAFA',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #F3F4F6',
                textAlign: 'center',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: '10px' }}>{tech.icon}</div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>{tech.label}</h4>
                <p style={{ fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.5 }}>{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="scroll-reveal" style={{ padding: '0 0 80px' }}>
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827', marginBottom: '10px' }}>Ready to Find Your Schemes?</h2>
          <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '24px' }}>It takes less than 60 seconds.</p>
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
