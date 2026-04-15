import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommendations } from '../utils/api';
import Footer from '../components/Footer';

const STATES = ['all','andhra pradesh','arunachal pradesh','assam','bihar','chhattisgarh','goa','gujarat','haryana','himachal pradesh','jharkhand','karnataka','kerala','madhya pradesh','maharashtra','manipur','meghalaya','mizoram','nagaland','odisha','punjab','rajasthan','sikkim','tamil nadu','telangana','tripura','uttar pradesh','uttarakhand','west bengal','jammu & kashmir','ladakh','delhi','chandigarh'];
const cap = s => s === 'all' ? 'All India' : s.replace(/\b\w/g, c => c.toUpperCase());

export default function ExploreSchemesPage() {
  const navigate = useNavigate();
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
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#fff', position: 'relative', overflow: 'hidden' }}>

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
          <div className="section-tag" style={{ margin: '0 auto 16px' }}>Explore</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            Explore Government Schemes
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#6B7280', maxWidth: '440px', margin: '0 auto 20px' }}>
            Choose your category and get AI-powered recommendations
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
          background: '#F3F4F6',
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
            <span style={{ fontSize: '1.125rem' }}>💼</span>
            Business Schemes
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
            <span style={{ fontSize: '1.125rem' }}>🎓</span>
            Education Schemes
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(11,110,79,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem',
              }}>💼</div>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>Business Details</h2>
                <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>For MSME, startup, and enterprise schemes</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="form-label">Age<span className="required">*</span></label>
                <input type="number" name="age" value={biz.age} onChange={setBizField} required min="18" max="100" placeholder="e.g. 30" className="form-input" />
              </div>
              <div>
                <label className="form-label">Annual Income (₹)<span className="required">*</span></label>
                <input type="number" name="income" value={biz.income} onChange={setBizField} required min="0" placeholder="e.g. 500000" className="form-input" />
              </div>
              <div>
                <label className="form-label">Business Type<span className="required">*</span></label>
                <select name="businessType" value={biz.businessType} onChange={setBizField} required className="form-input">
                  <option value="">Select type</option>
                  {['startup','msme','agriculture','manufacturing','services','export','retail','technology'].map(t => (
                    <option key={t} value={t}>{cap(t)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Investment Required (₹)<span className="required">*</span></label>
                <input type="number" name="investment" value={biz.investment} onChange={setBizField} required min="0" placeholder="e.g. 1000000" className="form-input" />
              </div>
              <div>
                <label className="form-label">State<span className="required">*</span></label>
                <select name="state" value={biz.state} onChange={setBizField} required className="form-input">
                  <option value="">Select state</option>
                  {STATES.map(s => <option key={s} value={s}>{cap(s)}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '28px', height: '50px' }}>
              {loading ? <><div className="spinner" /> Finding Schemes…</> : (
                <>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <path strokeLinecap="round" d="m21 21-4.35-4.35" />
                  </svg>
                  Get Business Recommendations
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── Education Form ── */}
        <div style={{ display: activeTab === 'education' ? 'block' : 'none' }}>
          <form onSubmit={submitEducation} className="card-static animate-fade-up" style={{ padding: '32px 28px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(11,110,79,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem',
              }}>🎓</div>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>Education Details</h2>
                <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>For scholarships and education loan schemes</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="form-label">Age<span className="required">*</span></label>
                <input type="number" name="age" value={edu.age} onChange={setEduField} required min="5" max="60" placeholder="e.g. 20" className="form-input" />
              </div>
              <div>
                <label className="form-label">Education Level<span className="required">*</span></label>
                <select name="educationLevel" value={edu.educationLevel} onChange={setEduField} required className="form-input">
                  <option value="">Select level</option>
                  {[['school','School'],['undergraduate','Undergraduate'],['postgraduate','Postgraduate'],['phd','PhD'],['diploma','Diploma']].map(([v,l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Social Category<span className="required">*</span></label>
                <select name="category" value={edu.category} onChange={setEduField} required className="form-input">
                  <option value="">Select category</option>
                  {[['general','General'],['sc','SC'],['st','ST'],['obc','OBC'],['ews','EWS'],['minority','Minority']].map(([v,l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Family Income (₹)<span className="required">*</span></label>
                <input type="number" name="income" value={edu.income} onChange={setEduField} required min="0" placeholder="e.g. 400000" className="form-input" />
              </div>
              <div>
                <label className="form-label">Field of Study<span className="required">*</span></label>
                <select name="fieldOfStudy" value={edu.fieldOfStudy} onChange={setEduField} required className="form-input">
                  <option value="">Select field</option>
                  {['engineering','medical','arts','science','commerce','law','management','other'].map(f => (
                    <option key={f} value={f}>{cap(f)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">State<span className="required">*</span></label>
                <select name="state" value={edu.state} onChange={setEduField} required className="form-input">
                  <option value="">Select state</option>
                  {STATES.map(s => <option key={s} value={s}>{cap(s)}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '28px', height: '50px' }}>
              {loading ? <><div className="spinner" /> Finding Schemes…</> : (
                <>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <path strokeLinecap="round" d="m21 21-4.35-4.35" />
                  </svg>
                  Get Education Recommendations
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
