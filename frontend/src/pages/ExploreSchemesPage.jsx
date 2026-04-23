import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommendations } from '../utils/api';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

const STATES = ['all','andhra pradesh','arunachal pradesh','assam','bihar','chhattisgarh','goa','gujarat','haryana','himachal pradesh','jharkhand','karnataka','kerala','madhya pradesh','maharashtra','manipur','meghalaya','mizoram','nagaland','odisha','punjab','rajasthan','sikkim','tamil nadu','telangana','tripura','uttar pradesh','uttarakhand','west bengal','jammu & kashmir','ladakh','delhi','chandigarh'];
const cap = s => s === 'all' ? 'All India' : s.replace(/\b\w/g, c => c.toUpperCase());

export default function ExploreSchemesPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('business');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Business form
  const [biz, setBiz] = useState({ age: '', income: '', businessType: '', investment: '', state: '' });
  const setBizField = e => setBiz({ ...biz, [e.target.name]: e.target.value });

  // Education form
  const [edu, setEdu] = useState({ age: '', educationLevel: '', category: '', income: '', fieldOfStudy: '', state: '' });
  const setEduField = e => setEdu({ ...edu, [e.target.name]: e.target.value });

  const submitBusiness = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await getRecommendations({ category: 'business', filters: { age: +biz.age, income: +biz.income, businessType: biz.businessType, investment: +biz.investment, state: biz.state } });
      navigate('/results', { state: { data: res.data, category: 'business' } });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to get recommendations.');
    } finally { setLoading(false); }
  };

  const submitEducation = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await getRecommendations({ category: 'education', filters: { age: +edu.age, educationLevel: edu.educationLevel, category: edu.category, income: +edu.income, fieldOfStudy: edu.fieldOfStudy, state: edu.state } });
      navigate('/results', { state: { data: res.data, category: 'education' } });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to get recommendations.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: 'var(--color-card)', position: 'relative', overflow: 'hidden' }}>

      {/* ── Indian Flag Animated Background ── */}
      <div className="flag-bg" aria-hidden="true">
        {/* Saffron wave - stronger */}
        <div className="flag-wave flag-saffron" style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(255,153,51,0.08) 25%, rgba(255,153,51,0.14) 50%, rgba(255,153,51,0.08) 75%, transparent 95%)' }} />
        {/* White wave */}
        <div className="flag-wave flag-white" style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(200,200,200,0.04) 25%, rgba(180,180,180,0.06) 50%, rgba(200,200,200,0.04) 75%, transparent 95%)' }} />
        {/* Green wave - stronger */}
        <div className="flag-wave flag-green" style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(18,136,7,0.08) 25%, rgba(18,136,7,0.14) 50%, rgba(18,136,7,0.08) 75%, transparent 95%)' }} />
        {/* Ashoka Chakra - bigger & more visible */}
        <div className="flag-chakra">
          <svg viewBox="0 0 100 100" width="220" height="220" style={{ opacity: 0.07 }}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="#000080" strokeWidth="2" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#000080" strokeWidth="0.5" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="6" fill="#000080" />
            {[...Array(24)].map((_, i) => (
              <line key={i} x1="50" y1="50" x2="50" y2="8" stroke="#000080" strokeWidth="1.5"
                transform={`rotate(${i * 15} 50 50)`} />
            ))}
          </svg>
        </div>
        {/* More floating tricolor particles */}
        {[...Array(20)].map((_, i) => (
          <div key={i} className="flag-particle" style={{
            left: `${5 + (i * 4.5)}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${5 + (i % 4) * 2}s`,
            background: i % 3 === 0 ? '#FF9933' : i % 3 === 1 ? '#128807' : '#000080',
            width: `${4 + (i % 3) * 3}px`,
            height: `${4 + (i % 3) * 3}px`,
          }} />
        ))}
        {/* Corner gradient accents */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '300px', height: '300px',
          background: 'radial-gradient(circle at top right, rgba(255,153,51,0.06), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          width: '300px', height: '300px',
          background: 'radial-gradient(circle at bottom left, rgba(18,136,7,0.06), transparent 70%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* ── Hero Header with illustration ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(240,253,244,0.9) 0%, rgba(236,253,245,0.9) 50%, rgba(249,250,251,0.9) 100%)',
        padding: '48px 0 40px',
        borderBottom: '1px solid rgba(11,110,79,0.06)',
        position: 'relative', zIndex: 2,
      }}>
        <div className="container animate-fade-up" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            {t('explore.title')}
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', maxWidth: '440px', margin: '0 auto 20px' }}>
            {t('explore.subtitle')}
          </p>
          <img src="/images/explore-hero.png" alt="Discover schemes for education, business, and more"
            style={{
              width: '180px', height: 'auto', margin: '0 auto',
              filter: 'drop-shadow(0 8px 20px rgba(11,110,79,0.12))',
              animation: 'float 6s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* ── Tab Switcher ── */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '560px', margin: '0 auto', padding: '32px 24px 0' }}>
        <div className="animate-fade-up" style={{
          display: 'flex', gap: '4px',
          background: 'var(--color-surface)',
          borderRadius: '14px',
          padding: '4px',
          marginBottom: '28px',
        }}>
          <button
            onClick={() => { setActiveTab('business'); setError(''); }}
            style={{
              flex: 1, padding: '12px 16px',
              borderRadius: '10px', border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 600,
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              background: activeTab === 'business' ? '#fff' : 'transparent',
              color: activeTab === 'business' ? '#0B6E4F' : '#6B7280',
              boxShadow: activeTab === 'business' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            {t('explore.businessSchemes')}
          </button>
          <button
            onClick={() => { setActiveTab('education'); setError(''); }}
            style={{
              flex: 1, padding: '12px 16px',
              borderRadius: '10px', border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 600,
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              background: activeTab === 'education' ? '#fff' : 'transparent',
              color: activeTab === 'education' ? '#0B6E4F' : '#6B7280',
              boxShadow: activeTab === 'education' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" /></svg>
            {t('explore.educationSchemes')}
          </button>
        </div>
      </div>

      {/* ── Forms ── */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '500px', margin: '0 auto', padding: '0 24px 64px' }}>
        {error && (
          <div className="animate-fade-up" style={{
            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)',
            borderRadius: '12px', padding: '12px 16px', marginBottom: '20px',
            color: '#EF4444', fontSize: '0.8125rem', fontWeight: 500, textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* ── Business Form ── */}
        <div style={{ display: activeTab === 'business' ? 'block' : 'none' }}>
          <form onSubmit={submitBusiness} className="card-static animate-fade-up" style={{ padding: '32px 28px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(11,110,79,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{t('explore.businessDetails')}</h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{t('explore.businessDetailsDesc')}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="form-label">{t('explore.age')}<span className="required">*</span></label>
                <input type="number" name="age" value={biz.age} onChange={setBizField} required min="18" max="100" placeholder="e.g. 30" className="form-input" />
              </div>
              <div>
                <label className="form-label">{t('explore.annualIncome')}<span className="required">*</span></label>
                <input type="number" name="income" value={biz.income} onChange={setBizField} required min="0" placeholder="e.g. 500000" className="form-input" />
              </div>
              <div>
                <label className="form-label">{t('explore.businessType')}<span className="required">*</span></label>
                <select name="businessType" value={biz.businessType} onChange={setBizField} required className="form-input">
                  <option value="">{t('explore.selectType')}</option>
                  {['startup','msme','agriculture','manufacturing','services','export','retail','technology'].map(btype => (
                    <option key={btype} value={btype}>{cap(btype)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">{t('explore.investmentRequired')}<span className="required">*</span></label>
                <input type="number" name="investment" value={biz.investment} onChange={setBizField} required min="0" placeholder="e.g. 1000000" className="form-input" />
              </div>
              <div>
                <label className="form-label">{t('explore.state')}<span className="required">*</span></label>
                <select name="state" value={biz.state} onChange={setBizField} required className="form-input">
                  <option value="">{t('explore.selectState')}</option>
                  {STATES.map(s => <option key={s} value={s}>{cap(s)}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '28px', height: '50px' }}>
              {loading ? <><div className="spinner" /> {t('explore.findingSchemes')}</> : (
                <>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <path strokeLinecap="round" d="m21 21-4.35-4.35" />
                  </svg>
                  {t('explore.getBusinessRec')}
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── Education Form ── */}
        <div style={{ display: activeTab === 'education' ? 'block' : 'none' }}>
          <form onSubmit={submitEducation} className="card-static animate-fade-up" style={{ padding: '32px 28px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(11,110,79,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" /></svg>
              </div>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{t('explore.educationDetails')}</h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{t('explore.educationDetailsDesc')}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="form-label">{t('explore.age')}<span className="required">*</span></label>
                <input type="number" name="age" value={edu.age} onChange={setEduField} required min="5" max="60" placeholder="e.g. 20" className="form-input" />
              </div>
              <div>
                <label className="form-label">{t('explore.educationLevel')}<span className="required">*</span></label>
                <select name="educationLevel" value={edu.educationLevel} onChange={setEduField} required className="form-input">
                  <option value="">{t('explore.selectLevel')}</option>
                  {[['school','School'],['undergraduate','Undergraduate'],['postgraduate','Postgraduate'],['phd','PhD'],['diploma','Diploma']].map(([v,l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">{t('explore.socialCategory')}<span className="required">*</span></label>
                <select name="category" value={edu.category} onChange={setEduField} required className="form-input">
                  <option value="">{t('explore.selectCat')}</option>
                  {[['general','General'],['sc','SC'],['st','ST'],['obc','OBC'],['ews','EWS'],['minority','Minority']].map(([v,l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">{t('explore.familyIncome')}<span className="required">*</span></label>
                <input type="number" name="income" value={edu.income} onChange={setEduField} required min="0" placeholder="e.g. 400000" className="form-input" />
              </div>
              <div>
                <label className="form-label">{t('explore.fieldOfStudy')}<span className="required">*</span></label>
                <select name="fieldOfStudy" value={edu.fieldOfStudy} onChange={setEduField} required className="form-input">
                  <option value="">{t('explore.selectField')}</option>
                  {['engineering','medical','arts','science','commerce','law','management','other'].map(f => (
                    <option key={f} value={f}>{cap(f)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">{t('explore.state')}<span className="required">*</span></label>
                <select name="state" value={edu.state} onChange={setEduField} required className="form-input">
                  <option value="">{t('explore.selectState')}</option>
                  {STATES.map(s => <option key={s} value={s}>{cap(s)}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '28px', height: '50px' }}>
              {loading ? <><div className="spinner" /> {t('explore.findingSchemes')}</> : (
                <>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <path strokeLinecap="round" d="m21 21-4.35-4.35" />
                  </svg>
                  {t('explore.getEducationRec')}
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
