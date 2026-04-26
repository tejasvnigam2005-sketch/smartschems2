import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const DIGILOCKER_DOCS = [
  { id: 'aadhaar', name: 'Aadhaar Card', issuer: 'UIDAI', icon: 'M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z' },
  { id: 'pan', name: 'PAN Card', issuer: 'Income Tax Dept.', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z' },
  { id: 'driving_license', name: 'Driving License', issuer: 'Transport Dept.', icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12' },
  { id: 'voter_id', name: 'Voter ID', issuer: 'Election Commission', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
  { id: 'class10', name: 'Class 10 Marksheet', issuer: 'CBSE / State Board', icon: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5' },
  { id: 'class12', name: 'Class 12 Marksheet', issuer: 'CBSE / State Board', icon: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5' },
  { id: 'income_cert', name: 'Income Certificate', issuer: 'Revenue Dept.', icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'caste_cert', name: 'Caste Certificate', issuer: 'Revenue Dept.', icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z' },
];

export default function ProfilePage() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [savedDocs, setSavedDocs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ss_digilocker_docs') || '[]'); } catch { return []; }
  });
  const [connectingId, setConnectingId] = useState(null);
  const [digiLockerConnected, setDigiLockerConnected] = useState(() => {
    return localStorage.getItem('ss_digilocker_connected') === 'true';
  });

  const handleSignOut = async () => {
    await logoutUser();
    navigate('/');
  };

  const handleConnectDigiLocker = () => {
    setDigiLockerConnected(true);
    localStorage.setItem('ss_digilocker_connected', 'true');
  };

  const handleFetchDocument = (docId) => {
    if (!digiLockerConnected) return;
    setConnectingId(docId);
    setTimeout(() => {
      const newDocs = [...savedDocs, docId];
      setSavedDocs(newDocs);
      localStorage.setItem('ss_digilocker_docs', JSON.stringify(newDocs));
      setConnectingId(null);
    }, 1500);
  };

  const handleRemoveDocument = (docId) => {
    const newDocs = savedDocs.filter(d => d !== docId);
    setSavedDocs(newDocs);
    localStorage.setItem('ss_digilocker_docs', JSON.stringify(newDocs));
  };

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh', paddingTop: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-card)',
      }}>
        <div className="animate-fade-up" style={{ textAlign: 'center' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'rgba(11,110,79,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', margin: '0 auto 16px',
          }}>
            <svg width="24" height="24" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '6px' }}>Login Required</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}>Please login to view your profile</p>
          <Link to="/login" className="btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  const pref = user.preferences || {};
  const hasPrefs = pref.category || pref.state || pref.age || pref.income;
  const history = user.searchHistory || [];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-card)', paddingTop: '64px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 24px 56px' }}>
        {/* Profile Header */}
        <div className="card-static animate-fade-up" style={{ overflow: 'hidden', marginBottom: '24px', borderRadius: '20px' }}>
          <div style={{
            height: '100px',
            background: 'linear-gradient(135deg, #0B6E4F, #10B981, #34D399)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: '10%', right: '10%',
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
            }} />
          </div>
          <div style={{ padding: '0 24px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', marginTop: '-32px', marginBottom: '20px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '18px',
                background: 'linear-gradient(135deg, #0B6E4F, #10B981)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '1.5rem', fontWeight: 800,
                border: '3px solid #fff',
                boxShadow: '0 4px 12px rgba(11,110,79,0.2)',
              }}>
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div style={{ paddingBottom: '2px', flex: 1 }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{user.name}</h1>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{user.email}</p>
              </div>
              <button onClick={handleSignOut} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '12px',
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                color: '#DC2626', fontSize: '0.8125rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Sign Out
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(11,110,79,0.04)', borderRadius: '14px', padding: '14px 16px' }}>
                <p style={{ fontSize: '0.625rem', fontWeight: 600, color: '#0B6E4F', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Account</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0B6E4F' }}>Free Plan</p>
              </div>
              <div style={{ background: 'rgba(139,92,246,0.04)', borderRadius: '14px', padding: '14px 16px' }}>
                <p style={{ fontSize: '0.625rem', fontWeight: 600, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Joined</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#7C3AED' }}>
                  {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="card-static animate-fade-up delay-1" style={{ padding: '24px', marginBottom: '24px', borderRadius: '20px' }}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Saved Preferences
          </h2>
          {hasPrefs ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {pref.category && (
                <div style={{ background: 'var(--color-surface)', borderRadius: '12px', padding: '14px 16px' }}>
                  <p style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginTop: '2px', textTransform: 'capitalize' }}>{pref.category}</p>
                </div>
              )}
              {pref.state && (
                <div style={{ background: 'var(--color-surface)', borderRadius: '12px', padding: '14px 16px' }}>
                  <p style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>State</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginTop: '2px', textTransform: 'capitalize' }}>{pref.state}</p>
                </div>
              )}
              {pref.age && (
                <div style={{ background: 'var(--color-surface)', borderRadius: '12px', padding: '14px 16px' }}>
                  <p style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Age</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginTop: '2px' }}>{pref.age}</p>
                </div>
              )}
              {pref.income && (
                <div style={{ background: 'var(--color-surface)', borderRadius: '12px', padding: '14px 16px' }}>
                  <p style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Income</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginTop: '2px' }}>₹{pref.income?.toLocaleString()}</p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--color-text-muted)' }}>
              <p style={{ fontSize: '1.5rem', marginBottom: '4px' }}><svg width="24" height="24" fill="none" stroke="#D1D5DB" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg></p>
              <p style={{ fontSize: '0.8125rem' }}>No preferences saved yet</p>
            </div>
          )}
        </div>

        {/* DigiLocker Section */}
        <div className="card-static animate-fade-up delay-2" style={{ overflow: 'hidden', marginBottom: '24px', borderRadius: '20px' }}>
          <div style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, rgba(26,86,219,0.06), rgba(59,130,246,0.04))',
            borderBottom: '1px solid var(--color-border-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #1a56db, #3b82f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div>
                <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>DigiLocker</h2>
                <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', margin: 0 }}>Fetch & save official documents to your profile</p>
              </div>
            </div>
            {!digiLockerConnected ? (
              <button onClick={handleConnectDigiLocker} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '9px 18px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #1a56db, #3b82f6)',
                border: 'none', color: '#fff',
                fontSize: '0.75rem', fontWeight: 650,
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(26,86,219,0.3)',
                transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.193-9.193a4.5 4.5 0 010 6.364l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757" />
                </svg>
                Connect DigiLocker
              </button>
            ) : (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '8px',
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
              }}>
                <svg width="14" height="14" fill="none" stroke="#10B981" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10B981' }}>Connected</span>
              </div>
            )}
          </div>

          <div style={{ padding: '20px 24px' }}>
            {!digiLockerConnected ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-text-muted)' }}>
                <svg width="40" height="40" fill="none" stroke="var(--color-text-muted)" viewBox="0 0 24 24" strokeWidth="1" style={{ margin: '0 auto 12px', opacity: 0.4 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '2px' }}>Connect DigiLocker to get started</p>
                <p style={{ fontSize: '0.6875rem' }}>Your documents will appear here once connected.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Available Documents</span>
                  <span style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>{savedDocs.length} / {DIGILOCKER_DOCS.length} saved</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {DIGILOCKER_DOCS.map(doc => {
                    const isSaved = savedDocs.includes(doc.id);
                    const isLoading = connectingId === doc.id;
                    return (
                      <div key={doc.id} style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px 14px', borderRadius: '12px',
                        background: isSaved ? 'rgba(16,185,129,0.05)' : 'var(--color-surface)',
                        border: `1px solid ${isSaved ? 'rgba(16,185,129,0.15)' : 'var(--color-border-light)'}`,
                        transition: 'all 0.2s',
                      }}>
                        <div style={{
                          width: '34px', height: '34px', borderRadius: '9px',
                          background: isSaved ? 'rgba(16,185,129,0.1)' : 'rgba(11,110,79,0.06)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <svg width="16" height="16" fill="none" stroke={isSaved ? '#10B981' : 'var(--color-text-muted)'} viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d={doc.icon} />
                          </svg>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 1px' }}>{doc.name}</p>
                          <p style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', margin: 0 }}>{doc.issuer}</p>
                        </div>
                        {isSaved ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.625rem', fontWeight: 600, color: '#10B981' }}>
                              <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                              Saved
                            </span>
                            <button onClick={() => handleRemoveDocument(doc.id)} style={{
                              width: '26px', height: '26px', borderRadius: '7px',
                              background: 'rgba(239,68,68,0.08)', border: 'none',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <svg width="11" height="11" fill="none" stroke="#DC2626" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => handleFetchDocument(doc.id)} disabled={isLoading} style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            padding: '6px 12px', borderRadius: '8px',
                            background: isLoading ? 'var(--color-surface)' : 'rgba(11,110,79,0.08)',
                            border: `1px solid ${isLoading ? 'var(--color-border)' : 'rgba(11,110,79,0.15)'}`,
                            color: '#0B6E4F', fontSize: '0.6875rem', fontWeight: 600,
                            cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                          }}>
                            {isLoading ? (
                              <><div style={{ width: '11px', height: '11px', border: '2px solid rgba(11,110,79,0.2)', borderTopColor: '#0B6E4F', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />Fetching…</>
                            ) : (
                              <><svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>Fetch</>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Search History */}
        <div className="card-static animate-fade-up delay-3" style={{ padding: '24px', marginBottom: '32px', borderRadius: '20px' }}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Past Searches
          </h2>
          {history.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {history.slice(-10).reverse().map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'var(--color-surface)', borderRadius: '12px', padding: '14px 16px',
                  transition: 'all 0.2s ease',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ display: 'flex' }}>
                      {s.category === 'business'
                        ? <svg width="16" height="16" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        : <svg width="16" height="16" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347" /></svg>
                      }
                    </span>
                    <div>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>{s.category} Search</p>
                      <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                        {new Date(s.searchedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 10px', borderRadius: '8px',
                    fontSize: '0.75rem', fontWeight: 600,
                    background: 'rgba(11,110,79,0.06)', color: '#0B6E4F',
                  }}>
                    {s.results?.length || 0} results
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--color-text-muted)' }}>
              <p style={{ fontSize: '1.5rem', marginBottom: '4px' }}><svg width="24" height="24" fill="none" stroke="#D1D5DB" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg></p>
              <p style={{ fontSize: '0.8125rem' }}>No searches yet</p>
            </div>
          )}
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        {/* Quick Actions */}
        <div className="animate-fade-up delay-3" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/business" className="btn-primary">Explore Business Schemes</Link>
          <Link to="/education" className="btn-secondary">Explore Education Schemes</Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
