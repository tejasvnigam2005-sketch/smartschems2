import { useState, useEffect } from 'react';
import { getApplicationGuide } from '../utils/api';
import { useDashboard } from '../context/DashboardContext';

export default function ApplicationGuide({ schemeType, schemeId }) {
  const [steps, setSteps] = useState([]);
  const [schemeName, setSchemeName] = useState('Scheme Application');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const { updateProgress } = useDashboard();

  const storageKey = `guide_step_${schemeId}`;

  useEffect(() => {
    const fetchSteps = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getApplicationGuide(schemeType, schemeId);
        setSteps(res.data.steps || []);
        if (res.data.schemeName) {
          setSchemeName(res.data.schemeName);
        }
        
        // Load saved progress
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          setCurrentStep(parseInt(saved, 10));
        }
      } catch (err) {
        setError('Failed to load application guide.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (schemeId && schemeType) {
      fetchSteps();
    }
  }, [schemeId, schemeType, storageKey]);

  useEffect(() => {
    // Initial sync of progress on load if steps exist
    if (steps.length > 0) {
      updateProgress(schemeId, schemeName, currentStep, steps.length);
    }
  }, [steps.length, currentStep, schemeId, schemeName]);

  const goToStep = (index) => {
    if (index >= 0 && index <= steps.length) {
      setCurrentStep(index);
      localStorage.setItem(storageKey, index.toString());
      if (steps.length > 0) {
        updateProgress(schemeId, schemeName, index, steps.length);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div className="spinner" style={{ borderTopColor: '#0B6E4F', margin: '0 auto 10px' }} />
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Loading guide...</p>
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

  if (steps.length === 0) {
    return null;
  }

  const isCompleted = currentStep === steps.length;

  return (
    <div className="guide-container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" fill="none" stroke="#0B6E4F" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Step-by-Step Guide
        </h4>
        {isCompleted ? (
           <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10B981', background: '#D1FAE5', padding: '4px 10px', borderRadius: '12px' }}>
             Completed
           </span>
        ) : (
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0B6E4F', background: 'rgba(11,110,79,0.08)', padding: '4px 10px', borderRadius: '12px' }}>
            Step {currentStep + 1} of {steps.length}
          </span>
        )}
      </div>

      <div className="stepper">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isDone = index < currentStep;
          
          return (
            <div key={index} className={`stepper-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`} onClick={() => goToStep(index)}>
              <div className="stepper-line"></div>
              <div className="stepper-circle">
                {isDone ? (
                  <svg width="12" height="12" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="stepper-content">
                <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: isActive ? '#0B6E4F' : isDone ? '#6B7280' : '#4B5563', marginBottom: '4px', transition: 'color 0.2s' }}>
                  {step.title}
                </h5>
                {(isActive || isDone) && (
                  <div className="animate-fade-in" style={{ marginTop: '8px', paddingBottom: '16px' }}>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                      {step.description}
                    </p>
                    {step.actionLink && isActive && (
                      <a href={step.actionLink} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ background: 'var(--color-surface)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.12)', padding: '6px 12px', fontSize: '0.75rem', display: 'inline-flex', alignSelf: 'flex-start' }} onClick={(e) => e.stopPropagation()}>
                        Take Action
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    )}
                    
                    {isActive && (
                      <div style={{ marginTop: '16px' }}>
                        <button onClick={(e) => { e.stopPropagation(); goToStep(index + 1); }} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.8125rem', borderRadius: '8px', background: index === steps.length - 1 ? '#10B981' : '' }}>
                          {index === steps.length - 1 ? 'Finish Guide' : 'Mark as Done & Next'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {isCompleted && (
          <div className="animate-fade-up" style={{ padding: '24px', background: '#ECFDF5', borderRadius: '16px', border: '1px solid #D1FAE5', textAlign: 'center', marginTop: '16px' }}>
             <div style={{ width: '48px', height: '48px', background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
               <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
             </div>
             <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#065F46', marginBottom: '8px' }}>Application Complete!</h4>
             <p style={{ fontSize: '0.8125rem', color: '#047857', marginBottom: '16px' }}>You have completed all steps in the guide. Good luck with your application!</p>
             <button onClick={() => goToStep(0)} className="btn-ghost" style={{ background: 'var(--color-card)', color: '#065F46', border: '1px solid #A7F3D0' }}>
               Restart Guide
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
