import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService, patternService } from '../services/api';
import { Sparkles, AlertCircle, CheckCircle, Code, FileText, Ruler } from 'lucide-react';

const PatternGenerator = () => {
  const currentUser = authService.getCurrentUser();
  const [formData, setFormData] = useState({
    patternName: '',
    garmentType: 'Shirt'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pattern, setPattern] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.patternName) {
      setError('Please provide a name for this pattern draft.');
      return;
    }

    setLoading(true);
    setError('');
    setPattern(null);
    setSuccess('');

    try {
      const payload = {
        userId: currentUser.id,
        garmentType: formData.garmentType,
        patternName: formData.patternName
      };

      const response = await patternService.generatePattern(payload);
      if (response.success) {
        setPattern(response.data);
        setSuccess('Tailor blueprint generated successfully!');
      } else {
        setError(response.message || 'Could not generate pattern.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Pattern generation failed. Ensure you have registered measurements first.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Tailoring Pattern Generator</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Generate custom clothing blueprints using your saved body measurements. Download metrics for standard layout patterns.
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

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '2rem' }} className="pattern-split">
        {/* Left pane: Options */}
        <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label className="form-label">Pattern Blueprint Name *</label>
              <input
                type="text"
                name="patternName"
                className="form-control"
                placeholder="e.g. Slim Fit Summer Shirt"
                value={formData.patternName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Garment Type *</label>
              <select
                name="garmentType"
                className="form-control"
                value={formData.garmentType}
                onChange={handleChange}
              >
                <option value="Shirt">Shirt Draft</option>
                <option value="Kurti">Kurti Draft</option>
                <option value="Dress">Dress Draft</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={loading}
            >
              <Sparkles size={18} />
              <span>{loading ? 'Drafting Blueprint...' : 'Generate Canvas Pattern'}</span>
            </button>
          </form>
        </div>

        {/* Right pane: Wireframe Visual representation */}
        <div className="glass-panel" style={{ padding: '2rem', minHeight: '450px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} color="var(--primary)" />
            <span>Interactive Tailoring Canvas</span>
          </h3>

          {pattern ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }} className="blueprint-results">
                {/* SVG Mock Blueprint */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '260px'
                }}>
                  <svg width="100%" height="240" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Grid Lines */}
                    <path d="M 0,40 L 200,40 M 0,80 L 200,80 M 0,120 L 200,120 M 0,160 L 200,160 M 0,200 L 200,200" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <path d="M 40,0 L 40,240 M 80,0 L 80,240 M 120,0 L 120,240 M 160,0 L 160,240" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                    {/* Outer Outline */}
                    {/* Collars & Shoulders */}
                    <path d="M 75,30 Q 100,45 125,30 L 155,42 L 145,90 L 130,85 L 130,220 L 70,220 L 70,85 L 55,90 L 45,42 Z" 
                          stroke="var(--primary)" 
                          strokeWidth="2.5" 
                          strokeDasharray="4 2"
                          fill="rgba(99, 102, 241, 0.05)" />

                    {/* Sizing tags and indicators */}
                    {/* Chest line */}
                    <line x1="60" y1="95" x2="140" y2="95" stroke="var(--secondary)" strokeWidth="1.5" />
                    <circle cx="60" cy="95" r="3" fill="var(--secondary)" />
                    <circle cx="140" cy="95" r="3" fill="var(--secondary)" />

                    {/* Shoulder line */}
                    <line x1="45" y1="42" x2="155" y2="42" stroke="var(--accent)" strokeWidth="1.5" />
                    <circle cx="45" cy="42" r="3" fill="var(--accent)" />
                    <circle cx="155" cy="42" r="3" fill="var(--accent)" />

                    {/* Sleeves line */}
                    <line x1="155" y1="42" x2="145" y2="90" stroke="var(--success)" strokeWidth="1.5" />

                    <text x="100" y="90" fill="var(--secondary)" fontSize="8" textAnchor="middle" fontWeight="bold">CHEST: {pattern.generatedPattern.chest}"</text>
                    <text x="100" y="38" fill="var(--accent)" fontSize="8" textAnchor="middle" fontWeight="bold">SHOULDER: {pattern.generatedPattern.shoulder}"</text>
                    <text x="160" y="70" fill="var(--success)" fontSize="8" fontWeight="bold">SLEEVE: {pattern.generatedPattern.sleeve}"</text>
                    <text x="100" y="210" fill="var(--text-muted)" fontSize="8" textAnchor="middle">WAIST: {pattern.generatedPattern.waist}" | HIP: {pattern.generatedPattern.hip}"</text>
                  </svg>
                </div>

                {/* Sizing text specs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h4 style={{ fontSize: '1rem', color: '#fff', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    Parameters Summary
                  </h4>
                  <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Shoulder width:</span>
                      <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{pattern.generatedPattern.shoulder} in</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Chest circum.:</span>
                      <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>{pattern.generatedPattern.chest} in</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Waist circum.:</span>
                      <span style={{ fontWeight: 600 }}>{pattern.generatedPattern.waist} in</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Hip circum.:</span>
                      <span style={{ fontWeight: 600 }}>{pattern.generatedPattern.hip} in</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Sleeve size:</span>
                      <span style={{ fontWeight: 600, color: 'var(--success)' }}>{pattern.generatedPattern.sleeve} in</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* JSON code block */}
              <div>
                <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Code size={14} />
                  <span>JSON Specification Payload</span>
                </h4>
                <pre style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '1.25rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.825rem',
                  fontFamily: 'monospace',
                  color: '#38bdf8',
                  overflowX: 'auto',
                  margin: 0
                }}>
                  {JSON.stringify(pattern, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              color: 'var(--text-dark)',
              textAlign: 'center',
              gap: '1rem'
            }}>
              <Ruler size={44} style={{ opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>
                Fill out the form on the left and submit. Your generated canvas wireframe and JSON blueprint parameters will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .pattern-split {
            grid-template-columns: 1fr !important;
          }
          .blueprint-results {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PatternGenerator;
