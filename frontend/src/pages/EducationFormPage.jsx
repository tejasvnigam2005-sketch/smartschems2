import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommendations } from '../utils/api';

const STATES = [
  'all', 'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh',
  'goa', 'gujarat', 'haryana', 'himachal pradesh', 'jharkhand', 'karnataka',
  'kerala', 'madhya pradesh', 'maharashtra', 'manipur', 'meghalaya', 'mizoram',
  'nagaland', 'odisha', 'punjab', 'rajasthan', 'sikkim', 'tamil nadu',
  'telangana', 'tripura', 'uttar pradesh', 'uttarakhand', 'west bengal',
  'jammu & kashmir', 'ladakh', 'delhi', 'chandigarh'
];

const cap = (s) => s === 'all' ? 'All India' : s.replace(/\b\w/g, c => c.toUpperCase());

export default function EducationFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ age: '', educationLevel: '', category: '', income: '', fieldOfStudy: '', state: '' });

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await getRecommendations({
        category: 'education',
        filters: { age: Number(form.age), educationLevel: form.educationLevel, category: form.category, income: Number(form.income), fieldOfStudy: form.fieldOfStudy, state: form.state }
      });
      navigate('/results', { state: { data: res.data, category: 'education' } });
    } catch { alert('Error getting recommendations. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: 'var(--color-surface)' }}>
      <div className="max-w-md mx-auto px-6 py-12 sm:py-16">
        <div className="text-center mb-8 animate-fade-up">
          <div className="section-tag mx-auto mb-4">Education</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.5px', marginBottom: '8px' }}>Education Schemes</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Enter your details for personalized recommendations</p>
        </div>

        <form onSubmit={submit} className="card p-6 sm:p-8 animate-fade-up delay-1">
          <div className="space-y-5">
            <div>
              <label className="form-label">Age <span className="required">*</span></label>
              <input type="number" name="age" value={form.age} onChange={set} required min="5" max="60" placeholder="e.g. 20" className="form-input" />
            </div>
            <div>
              <label className="form-label">Education Level <span className="required">*</span></label>
              <select name="educationLevel" value={form.educationLevel} onChange={set} required className="form-input">
                <option value="">Select level</option>
                {['school', 'undergraduate', 'postgraduate', 'phd', 'diploma'].map(l => (
                  <option key={l} value={l}>{cap(l)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Category <span className="required">*</span></label>
              <select name="category" value={form.category} onChange={set} required className="form-input">
                <option value="">Select category</option>
                {['general', 'sc', 'st', 'obc', 'ews', 'minority'].map(c => (
                  <option key={c} value={c}>{c.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Family Income (₹) <span className="required">*</span></label>
              <input type="number" name="income" value={form.income} onChange={set} required min="0" placeholder="e.g. 400000" className="form-input" />
            </div>
            <div>
              <label className="form-label">Field of Study <span className="required">*</span></label>
              <select name="fieldOfStudy" value={form.fieldOfStudy} onChange={set} required className="form-input">
                <option value="">Select field</option>
                {['engineering', 'medical', 'arts', 'science', 'commerce', 'law', 'management', 'other'].map(f => (
                  <option key={f} value={f}>{cap(f)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">State <span className="required">*</span></label>
              <select name="state" value={form.state} onChange={set} required className="form-input">
                <option value="">Select state</option>
                {STATES.map(s => <option key={s} value={s}>{cap(s)}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-8">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Finding Schemes…
              </span>
            ) : 'Get AI Recommendations'}
          </button>
        </form>
      </div>
    </div>
  );
}
