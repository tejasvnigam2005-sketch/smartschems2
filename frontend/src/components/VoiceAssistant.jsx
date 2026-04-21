import { useState, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const LANG_MAP = {
  en: { label: 'English', speech: 'en-IN' },
  hi: { label: 'हिन्दी', speech: 'hi-IN' },
  ta: { label: 'தமிழ்', speech: 'ta-IN' },
  te: { label: 'తెలుగు', speech: 'te-IN' },
  bn: { label: 'বাংলা', speech: 'bn-IN' },
  mr: { label: 'मराठी', speech: 'mr-IN' },
  gu: { label: 'ગુજરાતી', speech: 'gu-IN' },
  kn: { label: 'ಕನ್ನಡ', speech: 'kn-IN' },
  ml: { label: 'മലയാളം', speech: 'ml-IN' },
  pa: { label: 'ਪੰਜਾਬੀ', speech: 'pa-IN' },
};

export default function VoiceAssistant() {
  const { user } = useAuth();
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [lang, setLang] = useState('en');
  const [showLang, setShowLang] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const [textInput, setTextInput] = useState('');
  const recRef = useRef(null);
  const doneRef = useRef(false);

  const doListen = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setTextMode(true); setPhase('listening'); return; }

    setPhase('listening');
    setTranscript('');
    setTextMode(false);
    doneRef.current = false;

    try {
      const r = new SR();
      r.lang = LANG_MAP[lang]?.speech || 'en-IN';
      r.interimResults = true;
      r.continuous = false;

      r.onresult = (e) => {
        const text = Array.from(e.results).map(x => x[0].transcript).join('');
        setTranscript(text);
        if (e.results[e.results.length - 1].isFinal && !doneRef.current) {
          doneRef.current = true;
          processQuery(text);
        }
      };
      r.onerror = (e) => {
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          setTextMode(true); setPhase('listening');
        } else { setPhase('done'); }
      };
      r.onend = () => { if (!doneRef.current && !textMode) setPhase('done'); };
      recRef.current = r;
      r.start();
    } catch { setTextMode(true); setPhase('listening'); }
  }, [lang, textMode]);

  const startListening = () => {
    window.speechSynthesis.cancel();
    setActive(true);
    setResponse('');
    setTranscript('');
    doListen();
  };

  const processQuery = async (text) => {
    setPhase('thinking');
    try {
      const res = await API.post('/chat', { message: text, language: lang, userProfile: user?.preferences || null });
      const raw = res.data.text || 'Sorry, I could not understand.';
      const clean = raw.replace(/\*\*/g, '').replace(/[🏛️💰📋✅🎁🎯📄🔍😔🤖👋🙏😊❌🎂📍💼]/g, '').replace(/\n/g, '. ');
      setResponse(raw);
      setPhase('speaking');

      const u = new SpeechSynthesisUtterance(clean);
      u.lang = LANG_MAP[lang]?.speech || 'en-IN';
      u.rate = 0.9;
      // Auto-restart listening after speaking ends
      u.onend = () => {
        setPhase('listening');
        setTranscript('');
        doneRef.current = false;
        setTimeout(() => doListen(), 400);
      };
      u.onerror = () => { setPhase('done'); };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {
      setResponse('Sorry, something went wrong.');
      setPhase('done');
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    setTranscript(textInput.trim());
    doneRef.current = true;
    processQuery(textInput.trim());
    setTextInput('');
  };

  const stop = () => {
    recRef.current?.stop();
    window.speechSynthesis.cancel();
    setPhase('idle');
    setActive(false);
    doneRef.current = false;
  };

  const col = phase === 'listening' ? '#EF4444' : phase === 'thinking' ? '#F59E0B' : phase === 'speaking' ? '#10B981' : '#6366F1';

  return (<>
    {/* Floating button — left of chatbot, same size (60px), bottom 24px */}
    <button onClick={active ? stop : startListening}
      style={{ position: 'fixed', bottom: '24px', right: '96px', width: '60px', height: '60px', borderRadius: '50%', background: active ? `linear-gradient(135deg, ${col}, ${col}cc)` : 'linear-gradient(135deg, #6366F1, #8B5CF6)', border: 'none', cursor: 'pointer', boxShadow: `0 6px 20px ${active ? col : '#6366F1'}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998, transition: 'all 0.3s', animation: active && phase === 'listening' ? 'vaBtn 1.5s infinite' : 'none' }}
      onMouseOver={e => { if (!active) e.currentTarget.style.transform = 'scale(1.1)'; }}
      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
      {phase === 'thinking' ? (
        <div style={{ width: '20px', height: '20px', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'vaSpin 0.6s linear infinite' }} />
      ) : phase === 'speaking' ? (
        <svg width="28" height="28" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>
      ) : (
        <svg width="28" height="28" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
      )}
    </button>

    {/* Language button — same 60px circle, left of voice button */}
    {!active && (
      <div style={{ position: 'fixed', bottom: '24px', right: '168px', zIndex: 9998 }}>
        <button onClick={() => setShowLang(!showLang)} style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(59,130,246,0.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', transition: 'all 0.3s' }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
          <svg width="22" height="22" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A8.966 8.966 0 013 12c0-1.777.515-3.433 1.4-4.83" /></svg>
          <span style={{ color: '#fff', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.5px' }}>{lang.toUpperCase()}</span>
        </button>
        {showLang && (
          <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px', background: '#fff', borderRadius: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', overflow: 'auto', maxHeight: '260px', minWidth: '130px', zIndex: 10 }}>
            {Object.entries(LANG_MAP).map(([code, { label }]) => (
              <button key={code} onClick={() => { setLang(code); setShowLang(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 16px', border: 'none', background: lang === code ? '#EEF2FF' : '#fff', color: lang === code ? '#4F46E5' : '#374151', fontSize: '0.8125rem', fontWeight: lang === code ? 600 : 400, cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                onMouseOver={e => e.currentTarget.style.background = '#F5F3FF'}
                onMouseOut={e => e.currentTarget.style.background = lang === code ? '#EEF2FF' : '#fff'}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    )}

    {/* Fullscreen overlay */}
    {active && (
      <div style={{ position: 'fixed', inset: 0, zIndex: 9996, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', animation: 'vaFade 0.3s ease' }}>

        {/* Animated orb */}
        <div style={{ position: 'relative', width: '130px', height: '130px', marginBottom: '28px' }}>
          {(phase === 'listening' || phase === 'speaking') && <>
            <div style={{ position: 'absolute', inset: '-24px', borderRadius: '50%', border: `2px solid ${col}30`, animation: 'vaRing 1.5s infinite' }} />
            <div style={{ position: 'absolute', inset: '-12px', borderRadius: '50%', border: `2px solid ${col}50`, animation: 'vaRing 1.5s infinite 0.3s' }} />
          </>}
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: `linear-gradient(135deg, ${col}, ${col}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 40px ${col}40`, transition: 'background 0.4s' }}>
            {phase === 'thinking' ? (
              <div style={{ width: '36px', height: '36px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'vaSpin 0.6s linear infinite' }} />
            ) : phase === 'speaking' ? (
              <svg width="44" height="44" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>
            ) : (
              <svg width="44" height="44" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
            )}
          </div>
        </div>

        {/* Status */}
        <p style={{ color: '#fff', fontSize: '1.125rem', fontWeight: 600, marginBottom: '12px' }}>
          {phase === 'listening' ? '🎤 Listening...' : phase === 'thinking' ? '🤔 Thinking...' : phase === 'speaking' ? '🔊 Speaking...' : '✅ Tap mic to ask again'}
        </p>

        {/* Waveform */}
        {phase === 'listening' && !textMode && (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '30px', marginBottom: '16px' }}>
            {[...Array(9)].map((_, i) => (
              <div key={i} style={{ width: '4px', background: '#EF4444', borderRadius: '2px', animation: `vaWave 0.7s ease-in-out infinite ${i * 0.08}s` }} />
            ))}
          </div>
        )}

        {/* Text fallback */}
        {textMode && phase === 'listening' && (
          <div style={{ marginBottom: '16px', maxWidth: '360px', width: '100%' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: '8px', textAlign: 'center' }}>⚠️ Voice unavailable in this browser. Type instead:</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input value={textInput} onChange={e => setTextInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleTextSubmit()} placeholder="Ask about schemes..." autoFocus style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: 'none', fontSize: '0.9rem', outline: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff' }} />
              <button onClick={handleTextSubmit} style={{ padding: '12px 20px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Ask</button>
            </div>
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '14px', padding: '14px 22px', maxWidth: '360px', marginBottom: '12px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.6875rem', marginBottom: '4px' }}>You said:</p>
            <p style={{ color: '#fff', fontSize: '1rem', fontWeight: 500 }}>"{transcript}"</p>
          </div>
        )}

        {/* Response */}
        {response && (
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '14px', padding: '14px 22px', maxWidth: '400px', maxHeight: '180px', overflowY: 'auto', marginBottom: '16px' }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.6875rem', marginBottom: '4px' }}>Assistant:</p>
            <p style={{ color: '#fff', fontSize: '0.8125rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{response.replace(/\*\*/g, '')}</p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {phase === 'done' && (
            <button onClick={() => { setResponse(''); doListen(); }} style={{ padding: '12px 28px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', border: 'none', color: '#fff', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
              🎤 Ask Again
            </button>
          )}
          <button onClick={stop} style={{ padding: '12px 28px', borderRadius: '14px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>
            ✕ Close
          </button>
        </div>
      </div>
    )}

    <style>{`
      @keyframes vaFade{from{opacity:0}to{opacity:1}}
      @keyframes vaRing{0%{transform:scale(0.8);opacity:1}100%{transform:scale(1.6);opacity:0}}
      @keyframes vaSpin{to{transform:rotate(360deg)}}
      @keyframes vaWave{0%,100%{height:6px}50%{height:24px}}
      @keyframes vaBtn{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)}50%{box-shadow:0 0 0 12px rgba(239,68,68,0)}}
    `}</style>
  </>);
}

const LANGS_FLAG = { en: '🇬🇧', hi: '🇮🇳', ta: '🇮🇳', te: '🇮🇳', bn: '🇮🇳', mr: '🇮🇳', gu: '🇮🇳', kn: '🇮🇳', ml: '🇮🇳', pa: '🇮🇳' };
