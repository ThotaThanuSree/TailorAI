import React, { useEffect, useState } from 'react';
import { authService, recommendationService, patternService } from '../services/api';
import { History as HistoryIcon, Layers, Sparkles, AlertCircle, Calendar } from 'lucide-react';

const History = () => {
  const currentUser = authService.getCurrentUser();
  const [activeTab, setActiveTab] = useState('recommendations');
  const [recommendations, setRecommendations] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'recommendations') {
        const response = await recommendationService.getRecommendationHistory(currentUser.id);
        if (response.success) {
          setRecommendations(response.data);
        }
      } else {
        const response = await patternService.getPatternHistory(currentUser.id);
        if (response.success) {
          setPatterns(response.data);
        }
      }
    } catch (err) {
      setError('Could not retrieve historical records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchHistory();
    }
  }, [currentUser, activeTab]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Recommendation History</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          View your past fabric matches, sizing blueprints, and generated clothing drafts.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '2rem',
        gap: '1.5rem'
      }}>
        <button
          onClick={() => setActiveTab('recommendations')}
          style={{
            padding: '1rem 0.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'recommendations' ? '3.5px solid var(--primary)' : '3.5px solid transparent',
            color: activeTab === 'recommendations' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all var(--transition-fast)'
          }}
        >
          <Layers size={18} />
          <span>Fabric Recommendations</span>
        </button>

        <button
          onClick={() => setActiveTab('patterns')}
          style={{
            padding: '1rem 0.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'patterns' ? '3.5px solid var(--primary)' : '3.5px solid transparent',
            color: activeTab === 'patterns' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all var(--transition-fast)'
          }}
        >
          <Sparkles size={18} />
          <span>Tailoring Pattern Blueprints</span>
        </button>
      </div>

      {/* Lists workspace */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading history records...</p>
        ) : activeTab === 'recommendations' ? (
          recommendations.length > 0 ? (
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Fabric Material</th>
                    <th>Occasion</th>
                    <th>Weather Compatibility</th>
                    <th>Recommended Size</th>
                    <th>Required Yardage</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendations.map((rec) => (
                    <tr key={rec.id}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '180px' }}>
                        <Calendar size={14} color="var(--text-dark)" />
                        <span>{formatDate(rec.createdAt)}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{rec.fabric?.fabricName}</td>
                      <td>{rec.occasion}</td>
                      <td>{rec.weather}</td>
                      <td>
                        <span style={{
                          background: 'var(--primary-glow)',
                          color: 'var(--primary)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 600,
                          fontSize: '0.85rem'
                        }}>
                          {rec.recommendedSize}
                        </span>
                      </td>
                      <td style={{ color: 'var(--success)', fontWeight: 600 }}>{rec.fabricRequired} meters</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dark)' }}>
              <HistoryIcon size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>No fabric recommendations have been generated yet.</p>
            </div>
          )
        ) : (
          patterns.length > 0 ? (
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date Generated</th>
                    <th>Pattern Name</th>
                    <th>Garment Type</th>
                    <th>Shoulder Width</th>
                    <th>Chest Size</th>
                    <th>Sleeve Size</th>
                    <th>Waist Size</th>
                  </tr>
                </thead>
                <tbody>
                  {patterns.map((pat) => (
                    <tr key={pat.id}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '180px' }}>
                        <Calendar size={14} color="var(--text-dark)" />
                        <span>{formatDate(pat.createdAt)}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{pat.patternName}</td>
                      <td>{pat.garmentType}</td>
                      <td>{pat.generatedPattern?.shoulder}"</td>
                      <td style={{ color: 'var(--secondary)', fontWeight: 600 }}>{pat.generatedPattern?.chest}"</td>
                      <td>{pat.generatedPattern?.sleeve}"</td>
                      <td>{pat.generatedPattern?.waist}"</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dark)' }}>
              <HistoryIcon size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>No tailoring patterns have been drafted yet.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default History;
