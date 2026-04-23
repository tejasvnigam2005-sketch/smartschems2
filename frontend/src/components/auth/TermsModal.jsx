import { useState } from 'react';

const TERMS_CONTENT = [
  { title: '1. Introduction', body: 'Welcome to SmartSchemes. These Terms & Conditions govern your use of our platform, which helps Indian citizens discover government schemes for business and education. By creating an account, you agree to be bound by these terms.' },
  { title: '2. User Accounts', body: 'You must provide accurate, complete, and current information when creating your account. You are responsible for safeguarding your password and for all activities that occur under your account. Notify us immediately of any unauthorized access.' },
  { title: '3. Acceptable Use', body: 'You agree to use SmartSchemes only for lawful purposes. You shall not: (a) impersonate any person or entity, (b) submit false or misleading information, (c) attempt to gain unauthorized access to our systems, (d) use the platform to distribute spam or malicious content.' },
  { title: '4. Content & Accuracy', body: 'SmartSchemes aggregates publicly available information about government schemes. While we strive for accuracy, we do not guarantee that all scheme details are current or complete. Always verify eligibility and requirements through official government sources before applying.' },
  { title: '5. Intellectual Property', body: 'All content, design, logos, and software on SmartSchemes are owned by us or our licensors. You may not reproduce, distribute, or create derivative works without our written consent.' },
  { title: '6. Limitation of Liability', body: 'SmartSchemes is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform, including but not limited to loss of data or profits.' },
  { title: '7. Termination', body: 'We reserve the right to suspend or terminate your account at any time for violation of these terms. Upon termination, your right to use the platform ceases immediately, though sections that by their nature should survive will remain in effect.' },
  { title: '8. Governing Law', body: 'These terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.' },
  { title: '9. Changes to Terms', body: 'We may update these terms from time to time. We will notify registered users of significant changes via email. Continued use of the platform after changes constitutes acceptance of the updated terms.' },
  { title: '10. Contact', body: 'For questions about these terms, contact us at legal@smartschemes.in.' },
];

export default function TermsModal({ isOpen, onClose }) {
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
              Terms & Conditions
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Last updated: April 2026
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
          {TERMS_CONTENT.map((section, i) => (
            <div key={i} style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                {section.title}
              </h3>
              <p style={{ fontSize: '0.8125rem', lineHeight: 1.7, color: 'var(--color-text-secondary)', margin: 0 }}>
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
