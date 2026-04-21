import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh'];

const STEPS = [
  { key: 'age', icon: '🎂', title: 'How old are you?', sub: 'Age helps us filter age-specific schemes' },
  { key: 'income', icon: '💰', title: 'Annual family income?', sub: 'Many schemes have income-based eligibility' },
  { key: 'state', icon: '📍', title: 'Which state do you live in?', sub: 'Some schemes are state-specific' },
  { key: 'category', icon: '📋', title: 'Select your category', sub: 'Certain schemes are reserved for specific categories' },
  { key: 'occupation', icon: '💼', title: "What's your occupation?", sub: 'This helps match you with the right scheme type' },
  { key: 'extra', icon: '✨', title: 'A few more details', sub: 'Optional — helps us refine results further' },
];

const CATEGORIES = [
  { value: 'all', label: 'General', icon: '👤' },
  { value: 'obc', label: 'OBC', icon: '📄' },
  { value: 'sc', label: 'SC/ST', icon: '📜' },
  { value: 'minority', label: 'Minority', icon: '🕌' },
];

const OCCUPATIONS = [
  { value: 'student', label: 'Student', icon: '🎓' },
  { value: 'farmer', label: 'Farmer', icon: '🌾' },
  { value: 'job_seeker', label: 'Job Seeker', icon: '🔍' },
  { value: 'business', label: 'Business Owner', icon: '🏢' },
  { value: 'salaried', label: 'Salaried', icon: '💻' },
];

export default function EligibilityPopup({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState({ age: '', income: '', state: '', category: '', occupation: '', gender: '', disability: false, area: '' });
  const [showSave, setShowSave] = useState(false);

  useEffect(() => {
    if (isOpen) { setStep(0); setShowSave(false); setDir(1); }
  }, [isOpen]);

  const set = useCallback((k, v) => setData(d => ({ ...d, [k]: v })), []);
  const pct = Math.round((step / STEPS.length) * 100);

  const next = () => {
    if (step < STEPS.length - 1) { setDir(1); setStep(s => s + 1); }
    else if (user) { goResults(); }
    else { setShowSave(true); }
  };
  const back = () => { if (step > 0) { setDir(-1); setStep(s => s - 1); } };

  const goResults = () => {
    localStorage.setItem('ss_eligibility', JSON.stringify(data));
    navigate('/eligible-schemes');
    onClose();
  };

  if (!isOpen) return null;

  const canNext = () => {
    const k = STEPS[step]?.key;
    if (k === 'age') return data.age && Number(data.age) > 0;
    if (k === 'income') return data.income && Number(data.income) >= 0;
    if (k === 'state') return !!data.state;
    if (k === 'category') return !!data.category;
    if (k === 'occupation') return !!data.occupation;
    return true;
  };

  const inputStyle = { width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1.5px solid #E5E7EB', fontSize: '1rem', color: '#111827', outline: 'none', background: '#FAFAFA', transition: 'border 0.2s' };
  const chipStyle = (sel) => ({ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', borderRadius: '12px', border: `2px solid ${sel ? '#0B6E4F' : '#E5E7EB'}`, background: sel ? 'rgba(11,110,79,0.04)' : '#fff', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9375rem', fontWeight: sel ? 600 : 500, color: sel ? '#0B6E4F' : '#374151', width: '100%' });

  const renderStep = () => {
    const k = STEPS[step]?.key;
    if (k === 'age') return (
      <div>
        <input type="number" placeholder="Enter your age (e.g. 25)" value={data.age} onChange={e => set('age', e.target.value)} min={1} max={100} style={inputStyle} onFocus={e => e.target.style.borderColor = '#10B981'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} autoFocus />
        {data.age && <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '10px', background: '#F0FDF4', fontSize: '0.8125rem', color: '#0B6E4F' }}>
          {Number(data.age) < 18 ? '📚 Great! We\'ll focus on scholarships and student schemes' : Number(data.age) < 35 ? '🚀 Perfect age for startup & skill development schemes' : '🏢 We\'ll find enterprise & veteran benefit schemes for you'}
        </div>}
      </div>
    );
    if (k === 'income') return (
      <div>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontWeight: 600 }}>₹</span>
          <input type="number" placeholder="e.g. 500000" value={data.income} onChange={e => set('income', e.target.value)} min={0} style={{ ...inputStyle, paddingLeft: '36px' }} onFocus={e => e.target.style.borderColor = '#10B981'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} autoFocus />
        </div>
        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '8px' }}>Enter annual family income in rupees</p>
      </div>
    );
    if (k === 'state') return (
      <select value={data.state} onChange={e => set('state', e.target.value)} style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%239CA3AF' viewBox='0 0 24 24' stroke-width='2'%3E%3Cpath d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }} autoFocus>
        <option value="">Select your state</option>
        {STATES.map(s => <option key={s} value={s.toLowerCase()}>{s}</option>)}
      </select>
    );
    if (k === 'category') return (
      <div style={{ display: 'grid', gap: '10px' }}>
        {CATEGORIES.map(c => (
          <button key={c.value} type="button" onClick={() => set('category', c.value)} style={chipStyle(data.category === c.value)}>
            <span style={{ fontSize: '1.25rem' }}>{c.icon}</span> {c.label}
          </button>
        ))}
      </div>
    );
    if (k === 'occupation') return (
      <div style={{ display: 'grid', gap: '10px' }}>
        {OCCUPATIONS.map(o => (
          <button key={o.value} type="button" onClick={() => set('occupation', o.value)} style={chipStyle(data.occupation === o.value)}>
            <span style={{ fontSize: '1.25rem' }}>{o.icon}</span> {o.label}
          </button>
        ))}
      </div>
    );
    if (k === 'extra') return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>Gender</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Male', 'Female', 'Other'].map(g => (
              <button key={g} type="button" onClick={() => set('gender', g.toLowerCase())} style={{ ...chipStyle(data.gender === g.toLowerCase()), justifyContent: 'center' }}>{g}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>Area</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Rural', 'Urban'].map(a => (
              <button key={a} type="button" onClick={() => set('area', a.toLowerCase())} style={{ ...chipStyle(data.area === a.toLowerCase()), justifyContent: 'center' }}>{a}</button>
            ))}
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '12px', background: '#F9FAFB', cursor: 'pointer', border: '1px solid #E5E7EB' }}>
          <input type="checkbox" checked={data.disability} onChange={e => set('disability', e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#0B6E4F' }} />
          <span style={{ fontSize: '0.875rem', color: '#374151' }}>Person with disability (PwD)</span>
        </label>
      </div>
    );
    return null;
  };

  // Save prompt screen
  if (showSave) return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'eqFade 0.25s ease' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '420px', padding: '36px 32px', textAlign: 'center', boxShadow: '0 24px 48px rgba(0,0,0,0.12)', animation: 'eqSlide 0.3s ease' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 6px 20px rgba(16,185,129,0.3)' }}>
          <svg width="28" height="28" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Profile Complete!</h3>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, marginBottom: '28px' }}>Save your profile to get <strong style={{ color: '#0B6E4F' }}>personalized scheme updates</strong> and track your applications.</p>
        <button onClick={() => { onClose(); navigate('/login'); }} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0B6E4F, #10B981)', color: '#fff', fontWeight: 600, fontSize: '0.9375rem', cursor: 'pointer', marginBottom: '12px', boxShadow: '0 4px 12px rgba(11,110,79,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>
          Login / Sign Up
        </button>
        <button onClick={goResults} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer' }}>
          Continue as Guest →
        </button>
      </div>
      <style>{`@keyframes eqFade{from{opacity:0}to{opacity:1}}@keyframes eqSlide{from{opacity:0;transform:translateY(20px)scale(0.97)}to{opacity:1;transform:translateY(0)scale(1)}}`}</style>
    </div>
  );

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'eqFade 0.25s ease' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '480px', overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.12)', animation: 'eqSlide 0.3s ease' }}>

        {/* Progress Bar */}
        <div style={{ padding: '20px 28px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0B6E4F' }}>Step {step + 1} of {STEPS.length}</span>
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{pct}% complete</span>
          </div>
          <div style={{ height: '4px', borderRadius: '2px', background: '#E5E7EB' }}>
            <div style={{ height: '100%', borderRadius: '2px', background: 'linear-gradient(90deg, #0B6E4F, #10B981)', width: `${pct}%`, transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* Header */}
        <div style={{ padding: '24px 28px 0', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{STEPS[step]?.icon}</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>{STEPS[step]?.title}</h3>
          <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginBottom: '0' }}>{STEPS[step]?.sub}</p>
        </div>

        {/* Content */}
        <div key={step} style={{ padding: '20px 28px 0', animation: dir > 0 ? 'eqSlideR 0.3s ease' : 'eqSlideL 0.3s ease' }}>
          {renderStep()}
        </div>

        {/* Actions */}
        <div style={{ padding: '20px 28px 24px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          {step > 0 && (
            <button onClick={back} style={{ padding: '12px 20px', borderRadius: '12px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}>
              ← Back
            </button>
          )}
          <button onClick={next} disabled={!canNext()} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: canNext() ? 'linear-gradient(135deg, #0B6E4F, #10B981)' : '#D1D5DB', color: '#fff', fontWeight: 600, fontSize: '0.9375rem', cursor: canNext() ? 'pointer' : 'not-allowed', opacity: canNext() ? 1 : 0.6, transition: 'all 0.3s', boxShadow: canNext() ? '0 4px 12px rgba(11,110,79,0.2)' : 'none' }}>
            {step === STEPS.length - 1 ? '🔍 Find My Schemes' : 'Next →'}
          </button>
        </div>

        {/* Skip */}
        <div style={{ padding: '0 28px 20px', textAlign: 'center' }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: '0.8125rem', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            Continue without saving
          </button>
        </div>
      </div>

      <style>{`
        @keyframes eqFade{from{opacity:0}to{opacity:1}}
        @keyframes eqSlide{from{opacity:0;transform:translateY(20px)scale(0.97)}to{opacity:1;transform:translateY(0)scale(1)}}
        @keyframes eqSlideR{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
        @keyframes eqSlideL{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
      `}</style>
    </div>
  );
}
