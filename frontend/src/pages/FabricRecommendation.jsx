import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService, recommendationService } from '../services/api';
import { Sparkles, AlertCircle, CheckCircle, HelpCircle, Layers } from 'lucide-react';

const FabricRecommendation = () => {
  const currentUser = authService.getCurrentUser();
  const [formData, setFormData] = useState({
    weather: 'Summer',
    occasion: 'Casual',
    comfortLevel: 'High',
    garmentType: 'Shirt'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recommendation, setRecommendation] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecommendation(null);
    setSuccess('');

    try {
      const payload = {
        userId: currentUser.id,
        weather: formData.weather,
        occasion: formData.occasion,
        comfortLevel: formData.comfortLevel,
        garmentType: formData.garmentType
      };

      const response = await recommendationService.generateRecommendation(payload);
      if (response.success) {
        setRecommendation(response.data);
        setSuccess('Fabric recommendation generated successfully!');
      } else {
        setError(response.message || 'Could not generate recommendations.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Recommendation failed. Ensure you have registered measurements first.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Fabric Suitability Engine</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Select your wearing conditions and garment style to calculate optimal size, materials, and yardage volume.
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          {error.includes('measurements') && (
            <Link to="/enter-measurements" className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              Add Measurements Now
            </Link>
          )}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="recommendation-split">
        {/* Left pane: Query form */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label className="form-label">Weather Type</label>
              <select
                name="weather"
                className="form-control"
                value={formData.weather}
                onChange={handleChange}
              >
                <option value="Summer">Summer</option>
                <option value="Winter">Winter</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Occasion Type</label>
              <select
                name="occasion"
                className="form-control"
                value={formData.occasion}
                onChange={handleChange}
              >
                <option value="Casual">Casual</option>
                <option value="Office">Office</option>
                <option value="Party">Party</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Comfort Expectation</label>
              <select
                name="comfortLevel"
                className="form-control"
                value={formData.comfortLevel}
                onChange={handleChange}
              >
                <option value="High">High Comfort</option>
                <option value="Medium">Medium Comfort</option>
                <option value="Low">Standard Comfort</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Garment Type</label>
              <select
                name="garmentType"
                className="form-control"
                value={formData.garmentType}
                onChange={handleChange}
              >
                <option value="Shirt">Shirt (Height × 1.5)</option>
                <option value="Kurti">Kurti (Height × 2.0)</option>
                <option value="Dress">Dress (Height × 2.5)</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={loading}
            >
              <Sparkles size={18} />
              <span>{loading ? 'Evaluating Model...' : 'Analyze & Recommend'}</span>
            </button>
          </form>
        </div>

        {/* Right pane: Recommendation Details */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--primary)" />
            <span>Output Recommendations</span>
          </h3>

          {recommendation ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                background: 'rgba(99, 102, 241, 0.05)',
                border: '1px solid rgba(99, 102, 241, 0.15)',
                borderRadius: '12px',
                padding: '1.5rem'
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                  Recommended Fabric Material
                </span>
                <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', display: 'block', marginBottom: '0.5rem' }}>
                  {recommendation.fabric.fabricName}
                </span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {recommendation.fabric.description}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Recommended Size</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--secondary)' }}>
                    {recommendation.recommendedSize}
                  </span>
                </div>
                <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Yardage Required</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>
                    {recommendation.fabricRequired} m
                  </span>
                </div>
              </div>

              <div style={{ 
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                color: 'var(--text-dark)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <HelpCircle size={14} />
                <span>Computed from active measurements: Weather={recommendation.weather}, Occasion={recommendation.occasion}</span>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80%',
              color: 'var(--text-dark)',
              textAlign: 'center',
              gap: '1rem'
            }}>
              <Layers size={44} style={{ opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>
                Configure parameters on the left and submit. Your recommended specs and fabric parameters will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .recommendation-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FabricRecommendation;
