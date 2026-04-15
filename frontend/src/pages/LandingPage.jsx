import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Footer from '../components/Footer';

const topSchemes = [
  {
    icon: '🌾',
    tags: [{ label: 'FARMER', color: '#0B6E4F' }],
    title: 'PM-Kisan Samman Nidhi',
    desc: 'Direct income support of ₹6,000 per year to all landholding farmer families across the country.',
    benefits: ['₹6,000 annual direct benefit', 'Direct Bank Transfer (DBT)'],
  },
  {
    icon: '🚀',
    tags: [{ label: 'STARTUP', color: '#3B82F6' }],
    title: 'Startup India Seed Fund',
    desc: 'Financial assistance to startups for proof of concept, prototype development, and product trials.',
    benefits: ['Up to ₹20 Lakhs grant', 'Equity free initial funding'],
  },
  {
    icon: '💼',
    tags: [{ label: 'MSME', color: '#0B6E4F' }, { label: 'MUDRA', color: '#D97706' }],
    title: 'PMMY - Mudra Yojana',
    desc: 'Loans up to ₹10 Lakhs to non-corporate, non-farm small/micro enterprises for business growth.',
    benefits: ['No collateral required', 'Low interest rates'],
  },
];

const features = [
  { icon: '🤖', title: 'AI Matching', desc: 'Smart relevance scoring ranks schemes by your profile' },
  { icon: '⚡', title: 'Instant Results', desc: 'Get personalized recommendations in seconds' },
  { icon: '🔍', title: 'Compare Easily', desc: 'Side-by-side comparison of top matching schemes' },
  { icon: '🔊', title: 'Voice Support', desc: 'Listen to scheme details in Hindi or English' },
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

export default function LandingPage() {
  const sectionRef = useScrollReveal();
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [zooming, setZooming] = useState(false);

  const handleFindSchemes = (e) => {
    e.preventDefault();
    setZooming(true);
    setTimeout(() => navigate('/explore'), 600);
  };

  return (
    <div style={{ paddingTop: '64px' }} ref={sectionRef} className={zooming ? 'page-zoom-out' : ''}>

      {/* ── Hero Section ─────────────────── */}
      <section style={{
        background: '#fff',
        padding: '80px 0 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated background shapes */}
        <div style={{
          position: 'absolute', top: '-120px', right: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(11,110,79,0.05) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-40px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(11,110,79,0.04) 0%, transparent 70%)',
          animation: 'float 10s ease-in-out infinite reverse',
        }} />
        <div style={{
          position: 'absolute', top: '20%', left: '5%',
          width: '14px', height: '14px', borderRadius: '50%',
          background: 'rgba(11,110,79,0.08)',
          animation: 'float 5s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '8%',
          width: '10px', height: '10px', borderRadius: '4px',
          background: 'rgba(255,153,51,0.1)',
          animation: 'float 7s ease-in-out 1s infinite',
          transform: 'rotate(45deg)',
        }} />
        <div style={{
          position: 'absolute', bottom: '30%', left: '15%',
          width: '8px', height: '8px', borderRadius: '50%',
          background: 'rgba(59,130,246,0.06)',
          animation: 'float 6s ease-in-out 2s infinite',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-up" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto', marginBottom: '48px' }}>
            <div className="section-tag" style={{ margin: '0 auto 20px' }}>
              Powered By Advanced AI
            </div>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 800,
              color: '#111827',
              lineHeight: 1.15,
              letterSpacing: '-1px',
              marginBottom: '18px',
            }}>
              Find the Best{' '}
              <br />
              Government Schemes{' '}
              <br />
              for You in{' '}
              <span style={{
                color: '#0B6E4F',
                textDecoration: 'underline',
                textDecorationColor: '#0B6E4F',
                textUnderlineOffset: '4px',
                textDecorationThickness: '3px',
              }}>India</span>
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#6B7280',
              maxWidth: '480px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}>
              Personalized recommendations tailored to your profile. Navigate the complex landscape of subsidies, grants, and social welfare with ease.
            </p>
          </div>

          {/* Hero illustration image */}
          <div className="animate-fade-up delay-1" style={{
            display: 'flex', justifyContent: 'center', marginBottom: '-20px',
          }}>
            <img src="/images/hero-illustration.png" alt="SmartSchemes helps citizens discover government schemes"
              style={{
                width: '280px', height: 'auto',
                filter: 'drop-shadow(0 10px 30px rgba(11,110,79,0.1))',
                animation: 'float 6s ease-in-out infinite',
              }}
            />
          </div>

          {/* ── Hero Search Bar ────────────── */}
          <div className="animate-fade-up delay-1" style={{ maxWidth: '720px', margin: '0 auto' }}>
            <div className="hero-search">
              <div className="hero-search-grid">
                <div>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', display: 'block' }}>Your Age</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827' }}>25</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', display: 'block' }}>Annual Income (₹)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827' }}>5,00,000</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', display: 'block' }}>State</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Select State</span>
                    <svg width="12" height="12" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24" strokeWidth="2.5" style={{ marginLeft: 'auto' }}>
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', display: 'block' }}>Category</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Select Category</span>
                    <svg width="12" height="12" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24" strokeWidth="2.5" style={{ marginLeft: 'auto' }}>
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <button onClick={handleFindSchemes} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                width: '100%', padding: '14px',
                background: 'linear-gradient(135deg, #0B6E4F, #0D7A58)',
                color: '#fff', fontWeight: 600, fontSize: '0.9375rem',
                borderRadius: '14px', border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(11,110,79,0.25)',
                transition: 'all 0.25s ease',
              }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <path strokeLinecap="round" d="m21 21-4.35-4.35" />
                </svg>
                Find My Schemes
              </button>
            </div>
          </div>
        </div>

        {/* Curved divider */}
        <div style={{ marginTop: '60px', lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" style={{ width: '100%', display: 'block' }}>
            <path d="M0 60V20C240 0 480 0 720 20C960 40 1200 40 1440 20V60H0Z" fill="#F9FAFB" />
          </svg>
        </div>
      </section>

      {/* ── Top Schemes Section ──────────── */}
      <section style={{ padding: '60px 0 80px', background: '#F9FAFB' }}>
        <div className="container">
          <div className="scroll-reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>Top Schemes For You</h2>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '4px' }}>Based on current trends and demographic eligibility in your region.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                width: '36px', height: '36px', borderRadius: '50%',
                border: '1px solid #E5E7EB', background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s ease',
                color: '#6B7280',
              }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button style={{
                width: '36px', height: '36px', borderRadius: '50%',
                border: '1px solid #E5E7EB', background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s ease',
                color: '#6B7280',
              }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scheme Cards Carousel */}
          <div className="schemes-carousel scroll-reveal">
            {topSchemes.map((scheme, i) => (
              <div
                key={i}
                className="scheme-card"
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Icon */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: 'rgba(11,110,79,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem', marginBottom: '14px',
                }}>
                  {scheme.icon}
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  {scheme.tags.map((tag, j) => (
                    <span key={j} style={{
                      padding: '3px 10px', borderRadius: '6px',
                      fontSize: '0.625rem', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                      background: `${tag.color}0D`, color: tag.color,
                    }}>
                      {tag.label}
                    </span>
                  ))}
                </div>

                {/* Title & Desc */}
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '8px', lineHeight: 1.3 }}>
                  {scheme.title}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.6, marginBottom: '16px' }}>
                  {scheme.desc}
                </p>

                {/* Benefits */}
                <div style={{ marginBottom: '16px' }}>
                  {scheme.benefits.map((b, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <svg width="14" height="14" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span style={{ fontSize: '0.8125rem', color: '#4B5563' }}>{b}</span>
                    </div>
                  ))}
                </div>

                {/* View Details */}
                <Link to="/explore" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  fontSize: '0.8125rem', fontWeight: 600, color: '#0B6E4F',
                  textDecoration: 'none', transition: 'all 0.2s ease',
                  paddingTop: '12px', borderTop: '1px solid #F3F4F6', width: '100%',
                }}>
                  View Details
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Advantage Section ──────────── */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <div className="scroll-reveal ai-grid">
            {/* Left - AI Visual Card with real image */}
            <div style={{
              borderRadius: '24px',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '320px',
            }}>
              <img src="/images/ai-brain.png" alt="AI Neural Network powering SmartSchemes" style={{
                width: '100%', height: '100%', objectFit: 'cover',
                position: 'absolute', inset: 0,
              }} />
              {/* Overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(145deg, rgba(11,110,79,0.7), rgba(6,78,53,0.85))',
              }} />
              <div style={{ position: 'relative', zIndex: 1, padding: '40px 32px' }}>
                <div style={{
                  fontSize: '4rem', fontWeight: 900,
                  textAlign: 'center', color: '#fff',
                  marginBottom: '20px',
                  textShadow: '0 2px 20px rgba(0,0,0,0.2)',
                  animation: 'float 6s ease-in-out infinite',
                }}>
                  AI
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.12)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>98%</div>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                    Success rate in identifying eligible schemes
                  </p>
                </div>

                {/* Trust badge */}
                <div style={{
                  position: 'absolute', bottom: '20px', right: '20px',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: '#10B981',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="12" height="12" fill="#fff" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>Trust Verified</span>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <h2 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 800,
                color: '#111827',
                lineHeight: 1.2,
                letterSpacing: '-0.5px',
                marginBottom: '16px',
              }}>
                The AI Advantage in<br />Citizen Welfare
              </h2>
              <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '28px' }}>
                Gone are the days of manual searching through endless PDF documents. SmartSchemes uses natural language processing to match your specific profile with the latest updates from the Government of India.
              </p>

              <div className="feature-sub-grid" style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'rgba(11,110,79,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <svg width="16" height="16" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Instant Match</h4>
                    <p style={{ fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.5 }}>Get results in under 2 seconds across 2,000+ active schemes.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'rgba(11,110,79,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <svg width="16" height="16" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Multi-lingual</h4>
                    <p style={{ fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.5 }}>Access complex information in your preferred local Indian language.</p>
                  </div>
                </div>
              </div>

              <Link to="/how-it-works" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 24px',
                background: 'rgba(11,110,79,0.06)',
                border: '1px solid rgba(11,110,79,0.15)',
                borderRadius: '12px',
                color: '#0B6E4F',
                fontWeight: 600,
                fontSize: '0.875rem',
                textDecoration: 'none',
                transition: 'all 0.25s ease',
              }}>
                Learn How it Works
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA + Deadlines Row ──────────── */}
      <section style={{ padding: '0 0 80px', background: '#fff' }}>
        <div className="container">
          <div className="scroll-reveal cta-grid">
            {/* CTA Card */}
            <div style={{
              borderRadius: '20px',
              padding: '40px',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '280px',
            }}>
              {/* Parliament background image */}
              <img src="/images/parliament.png" alt="" style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%', objectFit: 'cover',
              }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(145deg, rgba(31,41,55,0.92), rgba(17,24,39,0.95))',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                fontSize: '0.625rem', fontWeight: 700, color: '#34D399',
                textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px',
              }}>
                EXCLUSIVE INITIATIVE
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: '12px' }}>
                Vocal for Local: Digital MSME Transformation
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '24px' }}>
                Access zero-interest loans and technology grants to take your local business to the global market. Over 2,000 businesses joined last month.
              </p>
              <Link to="/explore" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px',
                background: '#0B6E4F',
                borderRadius: '10px',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.8125rem',
                textDecoration: 'none',
                transition: 'all 0.25s ease',
              }}>
                Apply for Digital Grant
              </Link>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div style={{
              background: 'var(--color-saffron-50)',
              border: '1px solid var(--color-saffron-100)',
              borderRadius: '20px',
              padding: '32px',
            }}>
              <h3 style={{
                fontSize: '1.125rem', fontWeight: 700,
                color: '#92400E', marginBottom: '20px',
              }}>
                Upcoming Deadlines
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                {[
                  { day: '15', month: '', title: 'Digital India Internship', desc: 'Winter session applications closing soon.' },
                  { day: '22', month: '', title: 'Startup Seed Fund', desc: 'Grant window for Agri-tech innovations.' },
                  { day: '02', month: '', title: 'Kisan Scholarship', desc: 'Merit scholarship for children of farmers.' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem', fontWeight: 800, color: '#92400E', flexShrink: 0,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    }}>
                      {item.day}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.75rem', color: '#6B7280', lineHeight: 1.4 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/updates" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px', borderRadius: '10px',
                border: '1px solid #D97706',
                color: '#92400E', fontWeight: 600, fontSize: '0.8125rem',
                textDecoration: 'none', transition: 'all 0.2s ease',
              }}>
                View All Deadlines
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────── */}
      <Footer />
    </div>
  );
}
