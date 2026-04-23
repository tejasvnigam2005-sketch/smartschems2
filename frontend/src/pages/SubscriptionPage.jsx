import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

const plans = [
  {
    id: 'basic',
    name: 'Basic Access',
    price: '0',
    period: 'Forever free',
    description: 'Free scheme discovery and matching for all users',
    features: [
      'AI Scheme Matching',
      'Eligibility Check',
      'Basic Discovery',
      'Multi-language Support',
      'Scheme Alerts',
    ],
    cta: 'Get Started Free',
    popular: false,
    gradient: 'linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%)',
    accentColor: '#6B7280',
    iconPath: 'M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18',
  },
  {
    id: 'assisted',
    name: 'Assisted',
    price: '99',
    period: '/month',
    description: 'Application assistance and priority support',
    features: [
      'Everything in Basic',
      'Guided Application',
      'Priority Support',
      'Document Help',
      'Application Tracking',
      'Deadline Reminders',
    ],
    cta: 'Subscribe Now',
    popular: true,
    gradient: 'linear-gradient(135deg, #0B6E4F 0%, #10B981 100%)',
    accentColor: '#0B6E4F',
    iconPath: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
  },
  {
    id: 'premium',
    name: 'Premium / B2B',
    price: '499',
    period: '/month',
    description: 'Custom solutions for government and NGOs',
    features: [
      'Everything in Assisted',
      'Full Application Service',
      'Agent / NGO Dashboard',
      'Custom Solutions',
      'API Access',
      'Dedicated Account Manager',
      'Bulk Processing',
    ],
    cta: 'Contact Sales',
    popular: false,
    gradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
    accentColor: '#D97706',
    iconPath: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
  },
];

const faqs = [
  {
    q: 'Can I switch plans anytime?',
    a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
  },
  {
    q: 'Is the Basic plan really free?',
    a: 'Absolutely. Basic Access is free forever with no hidden charges. You get AI-powered scheme matching and eligibility checking at zero cost.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept UPI, Debit/Credit Cards, Net Banking, and all major wallets.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Yes, we offer a 7-day full refund policy if you are not satisfied with our services.',
  },
];

export default function SubscriptionPage() {
  const { t } = useLanguage();
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <div style={{ paddingTop: '64px' }}>
      {/* Hero */}
      <section style={{
        padding: '72px 0 48px',
        background: 'var(--color-surface)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative bg shapes */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-60px',
          width: '360px', height: '360px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(11,110,79,0.06) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-40px',
          width: '280px', height: '280px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,119,6,0.05) 0%, transparent 70%)',
          animation: 'float 10s ease-in-out infinite reverse',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', background: 'rgba(11,110,79,0.06)',
            border: '1px solid rgba(11,110,79,0.15)', borderRadius: '100px',
            fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '2px',
            textTransform: 'uppercase', color: 'var(--color-green-900)',
            marginBottom: '20px',
          }}>
            ✦ PRICING
          </div>

          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontWeight: 400, color: 'var(--color-text-primary)',
            lineHeight: 1.15, letterSpacing: '-0.5px',
            marginBottom: '16px',
          }}>
            Choose Your{' '}
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, letterSpacing: '-1px' }}>
              Plan
            </span>
          </h1>
          <p style={{
            fontSize: '1rem', color: 'var(--color-text-secondary)',
            maxWidth: '520px', margin: '0 auto 28px', lineHeight: 1.7,
          }}>
            From free discovery to full application support — pick the plan that helps you get the most out of government schemes.
          </p>

          {/* Billing toggle */}
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            background: 'var(--color-card)', borderRadius: '12px',
            padding: '4px', border: '1px solid var(--color-border-light)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            {['monthly', 'yearly'].map(cycle => (
              <button key={cycle} onClick={() => setBillingCycle(cycle)} style={{
                padding: '8px 20px', borderRadius: '9px', border: 'none',
                fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.25s ease',
                background: billingCycle === cycle ? 'var(--color-green-900)' : 'transparent',
                color: billingCycle === cycle ? '#fff' : 'var(--color-text-muted)',
              }}>
                {cycle === 'monthly' ? 'Monthly' : 'Yearly'}
                {cycle === 'yearly' && (
                  <span style={{
                    marginLeft: '6px', padding: '2px 6px', borderRadius: '4px',
                    fontSize: '0.625rem', fontWeight: 700,
                    background: billingCycle === 'yearly' ? 'rgba(255,255,255,0.2)' : 'rgba(11,110,79,0.1)',
                    color: billingCycle === 'yearly' ? '#fff' : 'var(--color-green-900)',
                  }}>Save 20%</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={{ padding: '0 0 80px', background: 'var(--color-surface)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px', maxWidth: '1000px', margin: '0 auto',
          }}>
            {plans.map((plan, i) => {
              const isHovered = hoveredPlan === plan.id;
              const yearlyPrice = plan.price === '0' ? '0' : Math.round(plan.price * 12 * 0.8);
              const displayPrice = billingCycle === 'yearly' && plan.price !== '0' ? yearlyPrice : plan.price;
              const displayPeriod = plan.price === '0' ? plan.period : billingCycle === 'yearly' ? '/year' : plan.period;

              return (
                <div key={plan.id}
                  onMouseEnter={() => setHoveredPlan(plan.id)}
                  onMouseLeave={() => setHoveredPlan(null)}
                  style={{
                    background: 'var(--color-card)',
                    borderRadius: '20px',
                    border: plan.popular
                      ? '2px solid var(--color-green-900)'
                      : '1px solid var(--color-border-light)',
                    boxShadow: isHovered
                      ? '0 20px 60px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.04)'
                      : '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.02)',
                    transform: isHovered ? 'translateY(-8px)' : plan.popular ? 'translateY(-4px)' : 'translateY(0)',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div style={{
                      position: 'absolute', top: '0', left: '0', right: '0',
                      background: plan.gradient,
                      padding: '6px', textAlign: 'center',
                      fontSize: '0.625rem', fontWeight: 800,
                      color: '#fff', letterSpacing: '2px',
                      textTransform: 'uppercase',
                    }}>
                      Most Popular
                    </div>
                  )}

                  <div style={{ padding: plan.popular ? '44px 32px 32px' : '32px' }}>
                    {/* Icon */}
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px',
                      background: plan.gradient,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '20px',
                      boxShadow: `0 4px 14px ${plan.accentColor}33`,
                    }}>
                      <svg width="22" height="22" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth="1.75">
                        <path strokeLinecap="round" strokeLinejoin="round" d={plan.iconPath} />
                      </svg>
                    </div>

                    {/* Plan name */}
                    <h3 style={{
                      fontSize: '1.125rem', fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      marginBottom: '4px',
                    }}>{plan.name}</h3>
                    <p style={{
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-muted)',
                      marginBottom: '20px', lineHeight: 1.5,
                    }}>{plan.description}</p>

                    {/* Price */}
                    <div style={{
                      display: 'flex', alignItems: 'baseline', gap: '4px',
                      marginBottom: '24px',
                    }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>₹</span>
                      <span style={{
                        fontSize: '2.5rem', fontWeight: 800,
                        color: 'var(--color-text-primary)',
                        letterSpacing: '-2px', lineHeight: 1,
                      }}>{displayPrice}</span>
                      <span style={{
                        fontSize: '0.8125rem', fontWeight: 500,
                        color: 'var(--color-text-muted)',
                      }}>{displayPeriod}</span>
                    </div>

                    {/* CTA Button */}
                    <button style={{
                      width: '100%', padding: '14px',
                      borderRadius: '14px', border: 'none',
                      fontSize: '0.9375rem', fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      background: plan.popular ? plan.gradient : 'var(--color-surface)',
                      color: plan.popular ? '#fff' : 'var(--color-text-primary)',
                      boxShadow: plan.popular ? `0 4px 14px ${plan.accentColor}40` : 'none',
                      marginBottom: '28px',
                    }}
                      onMouseOver={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        if (plan.popular) e.currentTarget.style.boxShadow = `0 8px 28px ${plan.accentColor}50`;
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        if (plan.popular) e.currentTarget.style.boxShadow = `0 4px 14px ${plan.accentColor}40`;
                      }}
                    >
                      {plan.cta}
                    </button>

                    {/* Divider */}
                    <div style={{
                      height: '1px',
                      background: 'var(--color-border-light)',
                      marginBottom: '20px',
                    }} />

                    {/* Features */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {plan.features.map((f, j) => (
                        <div key={j} style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                        }}>
                          <svg width="16" height="16" fill="none" stroke={plan.accentColor} viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span style={{
                            fontSize: '0.8125rem',
                            color: 'var(--color-text-secondary)',
                            fontWeight: 500,
                          }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '80px 0', background: 'var(--color-card)' }}>
        <div className="container-narrow">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              fontWeight: 800, color: 'var(--color-text-primary)',
              letterSpacing: '-0.5px', marginBottom: '10px',
            }}>Frequently Asked Questions</h2>
            <p style={{
              fontSize: '0.9375rem', color: 'var(--color-text-muted)',
            }}>Everything you need to know about our plans</p>
          </div>

          <div style={{
            display: 'flex', flexDirection: 'column', gap: '12px',
            maxWidth: '640px', margin: '0 auto',
          }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{
                background: 'var(--color-surface)',
                borderRadius: '14px',
                border: '1px solid var(--color-border-light)',
                overflow: 'hidden',
                transition: 'all 0.25s ease',
              }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: '100%', padding: '18px 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left',
                }}>
                  <span style={{
                    fontSize: '0.9375rem', fontWeight: 600,
                    color: 'var(--color-text-primary)',
                  }}>{faq.q}</span>
                  <svg width="16" height="16" fill="none" stroke="var(--color-text-muted)" viewBox="0 0 24 24" strokeWidth="2.5"
                    style={{
                      transition: 'transform 0.25s ease', flexShrink: 0, marginLeft: '12px',
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                    }}>
                    <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div style={{
                    padding: '0 20px 18px',
                    animation: 'fade-in 0.2s ease both',
                  }}>
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.7,
                    }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '0 0 80px', background: 'var(--color-card)' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #0B6E4F, #0D7A58)',
            borderRadius: '24px', padding: '48px 40px',
            textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-60px', right: '-40px',
              width: '200px', height: '200px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
            }} />
            <div style={{
              position: 'absolute', bottom: '-40px', left: '-20px',
              width: '140px', height: '140px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.04)',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                fontWeight: 800, color: '#fff',
                marginBottom: '12px',
              }}>Not sure which plan is right for you?</h3>
              <p style={{
                fontSize: '0.9375rem', color: 'rgba(255,255,255,0.6)',
                maxWidth: '400px', margin: '0 auto 24px', lineHeight: 1.6,
              }}>
                Start with Basic for free and upgrade anytime. No commitment required.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/explore" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '13px 28px', borderRadius: '14px',
                  background: 'var(--color-card)', color: '#0B6E4F',
                  fontWeight: 700, fontSize: '0.9375rem',
                  textDecoration: 'none', transition: 'all 0.25s ease',
                }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Try Free Now
                </Link>
                <Link to="/how-it-works" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '13px 28px', borderRadius: '14px',
                  background: 'rgba(255,255,255,0.1)', color: '#fff',
                  fontWeight: 600, fontSize: '0.9375rem',
                  textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.25s ease',
                }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
