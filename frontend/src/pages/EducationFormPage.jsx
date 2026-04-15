import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommendations } from '../utils/api';
import Footer from '../components/Footer';

const STATES = ['all','andhra pradesh','arunachal pradesh','assam','bihar','chhattisgarh','goa','gujarat','haryana','himachal pradesh','jharkhand','karnataka','kerala','madhya pradesh','maharashtra','manipur','meghalaya','mizoram','nagaland','odisha','punjab','rajasthan','sikkim','tamil nadu','telangana','tripura','uttar pradesh','uttarakhand','west bengal','jammu & kashmir','ladakh','delhi','chandigarh'];
const cap = s => s === 'all' ? 'All India' : s.replace(/\b\w/g, c => c.toUpperCase());

export default function EducationFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [f, setF] = useState({ age: '', educationLevel: '', category: '', income: '', fieldOfStudy: '', state: '' });
  const set = e => setF({ ...f, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await getRecommendations({ category: 'education', filters: { age: +f.age, educationLevel: f.educationLevel, category: f.category, income: +f.income, fieldOfStudy: f.fieldOfStudy, state: f.state } });
      navigate('/results', { state: { data: res.data, category: 'education' } });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to get recommendations. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#fff' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #F9FAFB 100%)',
        padding: '48px 0 40px',
        borderBottom: '1px solid rgba(11,110,79,0.06)',
      }}>
        <div className="container animate-fade-up" style={{ textAlign: 'center' }}>
          <div className="section-tag" style={{ margin: '0 auto 16px' }}>Education</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', marginBottom: '8px' }}>Education Schemes</h1>
          <p style={{ fontSize: '0.9375rem', color: '#6B7280', maxWidth: '400px', margin: '0 auto' }}>Tell us about your studies for AI-powered recommendations</p>
        </div>
      </div>

      {/* Form area */}
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 24px 64px' }}>
        <form onSubmit={submit} className="card-static animate-fade-up delay-1" style={{ padding: '32px 28px', borderRadius: '20px' }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)',
              borderRadius: '12px', padding: '12px 16px', marginBottom: '20px',
              color: '#EF4444', fontSize: '0.8125rem', fontWeight: 500, textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="form-label">Age<span className="required">*</span></label>
              <input type="number" name="age" value={f.age} onChange={set} required min="5" max="60" placeholder="e.g. 20" className="form-input" />
            </div>
            <div>
              <label className="form-label">Education Level<span className="required">*</span></label>
              <select name="educationLevel" value={f.educationLevel} onChange={set} required className="form-input">
                <option value="">Select level</option>
                {[['school','School'],['undergraduate','Undergraduate'],['postgraduate','Postgraduate'],['phd','PhD'],['diploma','Diploma']].map(([v,l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Social Category<span className="required">*</span></label>
              <select name="category" value={f.category} onChange={set} required className="form-input">
                <option value="">Select category</option>
                {[['general','General'],['sc','SC'],['st','ST'],['obc','OBC'],['ews','EWS'],['minority','Minority']].map(([v,l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Family Income (₹)<span className="required">*</span></label>
              <input type="number" name="income" value={f.income} onChange={set} required min="0" placeholder="e.g. 400000" className="form-input" />
            </div>
            <div>
              <label className="form-label">Field of Study<span className="required">*</span></label>
              <select name="fieldOfStudy" value={f.fieldOfStudy} onChange={set} required className="form-input">
                <option value="">Select field</option>
                {['engineering','medical','arts','science','commerce','law','management','other'].map(f => (
                  <option key={f} value={f}>{cap(f)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">State<span className="required">*</span></label>
              <select name="state" value={f.state} onChange={set} required className="form-input">
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
                Get AI Recommendations
              </>
            )}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
