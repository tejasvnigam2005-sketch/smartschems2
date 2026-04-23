import { useState } from 'react';

const PRIVACY_CONTENT = [
  { title: '1. Information We Collect', body: 'We collect information you provide directly: name, email address, and account preferences (age, income, state, category). We also collect usage data such as search history, saved schemes, and interaction patterns to improve our recommendations.' },
  { title: '2. How We Use Your Information', body: 'Your information is used to: (a) provide personalized scheme recommendations, (b) maintain your account and preferences, (c) improve our recommendation algorithm, (d) send important service updates, and (e) comply with legal obligations.' },
  { title: '3. Data Storage & Security', body: 'Your data is stored securely on Supabase (powered by PostgreSQL) with encryption at rest and in transit. Passwords are hashed using industry-standard algorithms. We implement Row Level Security (RLS) to ensure users can only access their own data.' },
  { title: '4. Third-Party Sharing', body: 'We do not sell, rent, or share your personal information with third parties for marketing purposes. We may share data with: (a) Supabase (infrastructure provider), (b) law enforcement when legally required, (c) service providers who assist in operating our platform under strict confidentiality agreements.' },
  { title: '5. Cookies & Analytics', body: 'We use essential cookies to maintain your session and preferences. We may use privacy-respecting analytics to understand usage patterns. No third-party advertising cookies are used.' },
  { title: '6. Data Retention', body: 'We retain your account data for as long as your account is active. Search history is retained for 12 months to improve recommendations. You may request deletion of your data at any time through your account settings or by contacting us.' },
  { title: '7. Your Rights (DPDP Act, 2023)', body: 'Under India\'s Digital Personal Data Protection Act, 2023, you have the right to: (a) access your personal data, (b) correct inaccurate data, (c) erase your data, (d) withdraw consent, (e) nominate a person to exercise rights on your behalf, (f) seek grievance redressal. To exercise these rights, contact our Data Protection Officer.' },
  { title: '8. Children\'s Privacy', body: 'SmartSchemes may be used by students under 18 for education scheme discovery. For users under 18, we require verifiable parental consent before collecting personal data, in compliance with the DPDP Act.' },
  { title: '9. International Data Transfers', body: 'Your data may be processed on servers located outside India (Supabase infrastructure). We ensure adequate data protection safeguards are in place as required under applicable Indian law.' },
  { title: '10. Contact Us', body: 'For privacy-related inquiries or to exercise your data rights:\n\nData Protection Officer\nEmail: privacy@smartschemes.in\nAddress: SmartSchemes, New Delhi, India\n\nYou may also file a complaint with the Data Protection Board of India if you believe your rights have been violated.' },
];

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--color-card)', borderRadius: '16px',
          width: '100%', maxWidth: '600px', maxHeight: '80vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
          animation: 'slideUp 0.3s ease',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 28px 16px',
          borderBottom: '1px solid var(--color-border-light)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
              Privacy Policy
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Last updated: April 2026 • Compliant with DPDP Act, 2023
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: '36px', height: '36px', borderRadius: '10px',
              border: '1px solid var(--color-border)', background: 'var(--color-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '1.1rem', color: 'var(--color-text-secondary)',
              transition: 'all 0.15s',
            }}
            onMouseOver={e => { e.target.style.background = '#F3F4F6'; e.target.style.color = '#111827'; }}
            onMouseOut={e => { e.target.style.background = '#F9FAFB'; e.target.style.color = '#6B7280'; }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
          {PRIVACY_CONTENT.map((section, i) => (
            <div key={i} style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                {section.title}
              </h3>
              <p style={{ fontSize: '0.8125rem', lineHeight: 1.7, color: 'var(--color-text-secondary)', margin: 0, whiteSpace: 'pre-line' }}>
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 28px',
          borderTop: '1px solid var(--color-border-light)',
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ height: '40px', padding: '0 24px', fontSize: '0.8125rem' }}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
