import { useState, useEffect } from 'react';
import { getDocumentChecklist } from '../utils/api';

export default function DocumentChecklist({ schemeType, schemeId }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  const storageKey = `checklist_${schemeId}`;

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getDocumentChecklist(schemeType, schemeId);
        setDocuments(res.data.documents || []);
        
        // Load saved progress
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          setCheckedItems(JSON.parse(saved));
        }
      } catch (err) {
        setError('Failed to load document checklist.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (schemeId && schemeType) {
      fetchDocuments();
    }
  }, [schemeId, schemeType, storageKey]);

  const toggleCheck = (index) => {
    const newChecked = { ...checkedItems, [index]: !checkedItems[index] };
    setCheckedItems(newChecked);
    localStorage.setItem(storageKey, JSON.stringify(newChecked));
  };

  const progress = documents.length > 0 
    ? Math.round((Object.values(checkedItems).filter(Boolean).length / documents.length) * 100) 
    : 0;

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div className="spinner" style={{ borderTopColor: '#0B6E4F', margin: '0 auto 10px' }} />
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Loading checklist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '16px', background: 'rgba(239,68,68,0.06)', borderRadius: '12px', color: '#EF4444', fontSize: '0.875rem', textAlign: 'center' }}>
        {error}
      </div>
    );
  }

  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="checklist-container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Required Documents
        </h4>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: progress === 100 ? '#10B981' : '#0B6E4F', background: progress === 100 ? '#D1FAE5' : 'rgba(11,110,79,0.08)', padding: '4px 10px', borderRadius: '12px' }}>
          {progress}% Ready
        </span>
      </div>

      <div style={{ background: 'var(--color-surface)', height: '6px', borderRadius: '3px', marginBottom: '20px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: progress === 100 ? '#10B981' : '#0B6E4F', transition: 'width 0.3s ease' }} />
      </div>

      <div className="checklist-items">
        {documents.map((doc, index) => {
          const isChecked = !!checkedItems[index];
          return (
            <div key={index} className={`checklist-item ${isChecked ? 'checked' : ''}`} onClick={() => toggleCheck(index)}>
              <div className="checkbox">
                {isChecked && <svg width="12" height="12" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: isChecked ? '#6B7280' : '#111827', transition: 'color 0.2s', textDecoration: isChecked ? 'line-through' : 'none', marginBottom: '4px' }}>
                  {doc.name}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '6px', lineHeight: 1.4 }}>{doc.description}</p>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {doc.estimatedTime}
                  </span>
                </div>
                {!isChecked && (
                  <div className="doc-hint" style={{ marginTop: '8px', padding: '8px 12px', background: 'rgba(59,130,246,0.06)', borderRadius: '6px', fontSize: '0.75rem', color: '#3B82F6', display: 'none' }}>
                    <strong>How to get:</strong> {doc.howToObtain}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
