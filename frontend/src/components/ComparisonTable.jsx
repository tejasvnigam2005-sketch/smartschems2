import { useLanguage } from '../context/LanguageContext';

export default function ComparisonTable({ schemes, schemeType }) {
  const { t } = useLanguage();
  if (!schemes || schemes.length === 0) return null;

  const scoreClass = (s) =>
    s >= 80 ? 'score-excellent' : s >= 60 ? 'score-good' : s >= 40 ? 'score-fair' : 'score-low';

  const medals = ['#1', '#2', '#3'];

  return (
    <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
      <table className="comparison-table">
        <thead>
          <tr>
            <th style={{ minWidth: '200px' }}>SCHEME</th>
            <th style={{ minWidth: '120px' }}>FUNDING</th>
            <th style={{ minWidth: '200px' }}>{t('scheme.benefits').toUpperCase()}</th>
            <th style={{ minWidth: '180px' }}>{t('scheme.eligibility').toUpperCase()}</th>
            <th>{t('scheme.ongoing').toUpperCase()}</th>
            <th style={{ textAlign: 'center' }}>SCORE</th>
          </tr>
        </thead>
        <tbody>
          {schemes.map((scheme, idx) => (
            <tr key={scheme._id || idx}>
              <td style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                <span style={{ marginRight: '6px' }}>{medals[idx] || ''}</span>
                {scheme.name}
              </td>
              <td>
                <span style={{
                  padding: '4px 10px', borderRadius: '8px',
                  fontSize: '0.75rem', fontWeight: 600,
                  background: 'rgba(11,110,79,0.06)', color: '#0B6E4F',
                }}>
                  {scheme.fundingAmount || scheme.scholarshipAmount || 'N/A'}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {scheme.benefits?.slice(0, 2).map((b, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: 'var(--color-text-secondary)' }}>
                      <svg style={{ width: '12px', height: '12px', marginTop: '2px', flexShrink: 0, color: '#0B6E4F' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span style={{ fontSize: '0.75rem' }}>{b}</span>
                    </div>
                  ))}
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {scheme.eligibility?.slice(0, 2).map((e, i) => (
                    <div key={i} style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>• {e}</div>
                  ))}
                </div>
              </td>
              <td>
                <span style={{
                  padding: '4px 10px', borderRadius: '8px',
                  fontSize: '0.75rem', fontWeight: 600,
                  background: 'rgba(59,130,246,0.06)', color: '#3B82F6',
                }}>
                  {scheme.deadline || t('scheme.ongoing')}
                </span>
              </td>
              <td style={{ textAlign: 'center' }}>
                {scheme.relevanceScore !== undefined && (
                  <div className={`score-badge ${scoreClass(scheme.relevanceScore)}`} style={{ margin: '0 auto' }}>
                    {scheme.relevanceScore}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
