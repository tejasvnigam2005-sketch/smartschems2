import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const LANGS = [
  { code: 'en', label: 'English', flag: '🇬🇧', speech: 'en-IN' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳', speech: 'hi-IN' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳', speech: 'ta-IN' },
  { code: 'te', label: 'తెలుగు', flag: '🇮🇳', speech: 'te-IN' },
  { code: 'bn', label: 'বাংলা', flag: '🇮🇳', speech: 'bn-IN' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳', speech: 'mr-IN' },
  { code: 'gu', label: 'ગુજરાતી', flag: '🇮🇳', speech: 'gu-IN' },
  { code: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳', speech: 'kn-IN' },
  { code: 'ml', label: 'മലയാളം', flag: '🇮🇳', speech: 'ml-IN' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', flag: '🇮🇳', speech: 'pa-IN' },
  { code: 'or', label: 'ଓଡ଼ିଆ', flag: '🇮🇳', speech: 'or-IN' },
  { code: 'ur', label: 'اردو', flag: '🇮🇳', speech: 'ur-IN' },
];

const STATES_LIST = ['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand','West Bengal'];

const GUIDE_STEPS = [
  { key: 'age', q: 'What is your age?', qHi: 'आपकी उम्र क्या है?', type: 'number' },
  { key: 'income', q: 'What is your annual family income (in ₹)?', qHi: 'आपकी वार्षिक पारिवारिक आय कितनी है (₹)?', type: 'number' },
  { key: 'state', q: 'Which state do you live in?', qHi: 'आप किस राज्य में रहते हैं?', type: 'text' },
  { key: 'category', q: 'What is your category? (General / OBC / SC/ST / Minority)', qHi: 'आपकी श्रेणी क्या है? (सामान्य / OBC / SC/ST / अल्पसंख्यक)', type: 'choice', options: ['General','OBC','SC/ST','Minority'] },
  { key: 'occupation', q: 'What is your occupation? (Student / Farmer / Job Seeker / Business / Salaried)', qHi: 'आपका व्यवसाय क्या है? (छात्र / किसान / नौकरी खोजने वाला / व्यापार / नौकरीपेशा)', type: 'choice', options: ['Student','Farmer','Job Seeker','Business','Salaried'] },
];

export default function ChatBot() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState('en');
  const [showLangs, setShowLangs] = useState(false);
  const [guideMode, setGuideMode] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const [guideData, setGuideData] = useState({});
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);
  const isHi = lang === 'hi';

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, loading]);

  useEffect(() => {
    if (open && msgs.length === 0) {
      addBot(isHi
        ? '🙏 नमस्ते! मैं SmartSchemes AI सहायक हूँ।\n\nमैं आपकी मदद कर सकता हूँ:\n• योजनाएं खोजें\n• पात्रता जांचें\n• आवेदन प्रक्रिया बताएं'
        : '👋 Hi! I\'m your SmartSchemes Assistant.\n\nI can help you:\n• Find eligible schemes\n• Check eligibility\n• Guide you through applications',
        ['🎯 Guide me to schemes', 'Find schemes', 'How to apply', 'Documents needed']);
    }
  }, [open]);

  const addBot = (text, suggestions, schemes) => {
    setMsgs(p => [...p, { role: 'bot', text, suggestions, schemes, time: new Date() }]);
    speak(text);
  };

  const speak = (text) => {
    try {
      const clean = text.replace(/[*#_🏛️💰📋✅🎁🎯📄🔍😔🤖👋🙏😊❌🎂📍💼\n]/g, ' ').replace(/\s+/g, ' ');
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = LANGS.find(l => l.code === lang)?.speech || 'en-IN';
      u.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {}
  };

  // ── Guide Mode: ask questions one by one ──
  const startGuide = () => {
    setGuideMode(true);
    setGuideStep(0);
    setGuideData({});
    const step = GUIDE_STEPS[0];
    addBot(isHi ? `🎯 चलिए शुरू करते हैं!\n\n${step.qHi}` : `🎯 Let's find the best schemes for you!\n\n${step.q}`,
      step.options || []);
  };

  const handleGuideAnswer = async (answer) => {
    const step = GUIDE_STEPS[guideStep];
    const newData = { ...guideData, [step.key]: answer };
    setGuideData(newData);
    setMsgs(p => [...p, { role: 'user', text: answer, time: new Date() }]);

    if (guideStep < GUIDE_STEPS.length - 1) {
      const next = GUIDE_STEPS[guideStep + 1];
      setGuideStep(guideStep + 1);
      setTimeout(() => addBot(isHi ? next.qHi : next.q, next.options || []), 500);
    } else {
      // All questions answered — fetch results
      setGuideMode(false);
      setLoading(true);
      localStorage.setItem('ss_eligibility', JSON.stringify(newData));
      try {
        const res = await API.post('/recommend/eligibility', newData);
        const schemes = res.data.results || [];
        const top3 = schemes.slice(0, 3);
        const list = top3.map((s, i) => `${i + 1}. **${s.name}**\n   💰 ${s.funding_amount || 'Varies'}`).join('\n\n');
        addBot(
          isHi
            ? `🎯 आपकी प्रोफ़ाइल के आधार पर ${schemes.length} योजनाएं मिलीं!\n\n${list}\n\nविस्तार से देखने के लिए "सभी योजनाएं देखें" पर क्लिक करें।`
            : `🎯 Found ${schemes.length} schemes for you!\n\n${list}\n\nClick "View all schemes" to see details.`,
          ['View all schemes', 'Ask about a scheme', 'Start over'],
          top3.map(s => ({ id: s.id, name: s.name, funding: s.funding_amount, website: s.website }))
        );
      } catch {
        addBot(isHi ? '❌ कुछ गड़बड़ हो गई।' : '❌ Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // ── Regular chat send ──
  const send = useCallback(async (text) => {
    if (!text?.trim()) return;
    const t = text.trim();

    // Guide mode trigger
    if (t.toLowerCase().includes('guide me') || t.toLowerCase().includes('find schemes for me') || t === '🎯 Guide me to schemes') {
      setMsgs(p => [...p, { role: 'user', text: t, time: new Date() }]);
      setInput('');
      startGuide();
      return;
    }

    // View all schemes
    if (t.toLowerCase().includes('view all scheme')) {
      setMsgs(p => [...p, { role: 'user', text: t, time: new Date() }]);
      setInput('');
      navigate('/eligible-schemes');
      return;
    }

    // If in guide mode, treat as answer
    if (guideMode) {
      handleGuideAnswer(t);
      setInput('');
      return;
    }

    setMsgs(p => [...p, { role: 'user', text: t, time: new Date() }]);
    setInput('');
    setLoading(true);
    try {
      const res = await API.post('/chat', { message: t, language: lang, userProfile: user?.preferences || null });
      addBot(res.data.text, res.data.suggestions, res.data.schemes);
    } catch {
      addBot('❌ Sorry, something went wrong.');
    } finally {
      setLoading(false);
    }
  }, [lang, user, guideMode, guideStep, guideData]);

  // ── Voice ──
  const toggleVoice = () => {
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition not supported.'); return; }
    const r = new SR();
    r.lang = LANGS.find(l => l.code === lang)?.speech || 'en-IN';
    r.interimResults = true;
    r.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
      setInput(transcript);
      if (e.results[0].isFinal) { setListening(false); send(transcript); }
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    recognitionRef.current = r;
    r.start();
    setListening(true);
  };

  const fmt = (t) => t.split('\n').map((line, i) => {
    let h = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    return <p key={i} style={{ margin: '2px 0', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: h }} />;
  });

  // ── Floating Button ──
  if (!open) return (
    <button onClick={() => setOpen(true)} style={{ position: 'fixed', bottom: '24px', right: '24px', width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #0B6E4F, #10B981)', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(11,110,79,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998, animation: 'cbP 2s infinite' }}
      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
      <svg width="28" height="28" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.671 1.09-.085 2.17-.207 3.238-.364 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
      <style>{`@keyframes cbP{0%,100%{box-shadow:0 6px 20px rgba(11,110,79,0.35)}50%{box-shadow:0 6px 30px rgba(11,110,79,0.55)}}`}</style>
    </button>
  );

  // ── Chat Window ──
  return (<>
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', width: '380px', maxWidth: 'calc(100vw - 32px)', height: '560px', maxHeight: 'calc(100vh - 100px)', borderRadius: '20px', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(16px)', boxShadow: '0 16px 48px rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 9999, animation: 'cbIn 0.3s ease' }}>

      {/* Header */}
      <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg, #0B6E4F, #10B981)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>SmartSchemes AI</div>
          <div style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.7)' }}>{guideMode ? `Step ${guideStep + 1}/${GUIDE_STEPS.length}` : 'Your scheme assistant'}</div>
        </div>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowLangs(!showLangs)} style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', fontSize: '0.6875rem', fontWeight: 600, cursor: 'pointer' }}>
            {LANGS.find(l => l.code === lang)?.flag} {lang.toUpperCase()}
          </button>
          {showLangs && (
            <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '4px', background: 'var(--color-card)', borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', overflow: 'auto', zIndex: 10, minWidth: '130px', maxHeight: '240px' }}>
              {LANGS.map(l => (
                <button key={l.code} onClick={() => { setLang(l.code); setShowLangs(false); }} style={{ display: 'block', width: '100%', padding: '7px 12px', border: 'none', background: lang === l.code ? '#F0FDF4' : '#fff', color: 'var(--color-text-secondary)', fontSize: '0.75rem', cursor: 'pointer', textAlign: 'left' }}>
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => { setOpen(false); window.speechSynthesis.cancel(); }} style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="12" height="12" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Guide progress bar */}
      {guideMode && (
        <div style={{ height: '3px', background: '#E5E7EB' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #0B6E4F, #10B981)', width: `${((guideStep + 1) / GUIDE_STEPS.length) * 100}%`, transition: 'width 0.4s' }} />
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', animation: 'cbM 0.25s ease' }}>
            <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: m.role === 'user' ? 'linear-gradient(135deg, #0B6E4F, #10B981)' : '#F3F4F6', color: m.role === 'user' ? '#fff' : '#374151', fontSize: '0.8125rem' }}>
              {fmt(m.text)}
              {m.schemes?.length > 0 && (
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {m.schemes.map((s, j) => (
                    <div key={j} style={{ padding: '7px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--color-border)', fontSize: '0.7rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{s.name}</div>
                      {s.funding && <div style={{ color: '#0B6E4F', fontWeight: 500 }}>💰 {s.funding}</div>}
                    </div>
                  ))}
                </div>
              )}
              {m.suggestions?.length > 0 && (
                <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {m.suggestions.map((s, j) => (
                    <button key={j} onClick={() => send(s)} style={{ padding: '4px 10px', borderRadius: '16px', border: '1px solid #D1FAE5', background: '#F0FDF4', color: '#0B6E4F', fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>{s}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '4px', padding: '10px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#9CA3AF', animation: 'cbD 1s infinite 0s' }} />
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#9CA3AF', animation: 'cbD 1s infinite 0.2s' }} />
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#9CA3AF', animation: 'cbD 1s infinite 0.4s' }} />
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid var(--color-border-light)', display: 'flex', gap: '6px', alignItems: 'center', background: 'var(--color-card)' }}>
        <button onClick={toggleVoice} style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: listening ? '#EF4444' : '#F3F4F6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, animation: listening ? 'cbMic 1.2s infinite' : 'none' }}>
          <svg width="15" height="15" fill="none" stroke={listening ? '#fff' : '#6B7280'} viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
        </button>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)} placeholder={listening ? 'Listening...' : isHi ? 'अपना सवाल पूछें...' : 'Ask about schemes...'} style={{ flex: 1, padding: '9px 12px', borderRadius: '10px', border: '1.5px solid var(--color-border)', fontSize: '0.8125rem', outline: 'none', background: listening ? '#FEF2F2' : '#FAFAFA' }} onFocus={e => e.target.style.borderColor = '#10B981'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
        <button onClick={() => send(input)} disabled={!input.trim() || loading} style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: input.trim() && !loading ? 'linear-gradient(135deg, #0B6E4F, #10B981)' : '#E5E7EB', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="15" height="15" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
        </button>
      </div>
    </div>
    <style>{`
      @keyframes cbIn{from{opacity:0;transform:translateY(20px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
      @keyframes cbM{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
      @keyframes cbD{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.1)}}
      @keyframes cbMic{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)}50%{box-shadow:0 0 0 10px rgba(239,68,68,0)}}
    `}</style>
  </>);
}
