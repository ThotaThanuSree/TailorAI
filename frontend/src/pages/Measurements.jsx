import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, measurementService } from '../services/api';
import { Ruler, AlertCircle, CheckCircle, Save } from 'lucide-react';

const Measurements = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [formData, setFormData] = useState({
    height: '',
    chest: '',
    waist: '',
    hip: '',
    shoulder: '',
    sleeveLength: '',
    inseam: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Field Validation
    const keys = Object.keys(formData);
    for (let key of keys) {
      if (!formData[key]) {
        setError(`Please fill in your ${key} parameter.`);
        return;
      }
      const val = parseFloat(formData[key]);
      if (isNaN(val) || val <= 0) {
        setError(`Please enter a valid positive number for ${key}.`);
        return;
      }
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        userId: currentUser.id,
        height: parseFloat(formData.height),
        chest: parseFloat(formData.chest),
        waist: parseFloat(formData.waist),
        hip: parseFloat(formData.hip),
        shoulder: parseFloat(formData.shoulder),
        sleeveLength: parseFloat(formData.sleeveLength),
        inseam: parseFloat(formData.inseam),
        estimatedFromPhoto: false
      };

      const response = await measurementService.saveMeasurements(payload);
      if (response.success) {
        setSuccess('Measurements saved successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(response.message || 'Error saving measurements.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not communicate with backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Manual Measurements Vault</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Enter your body metrics manually. These metrics are used to calculate fabric volume and generate tailoring layout patterns.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2.5rem 2rem' }}>
        {/* Core details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Height (in cm) *</label>
            <input
              type="number"
              name="height"
              step="0.1"
              className="form-control"
              placeholder="e.g. 175"
              value={formData.height}
              onChange={handleChange}
              required
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>Vertical measurement from head to heel.</span>
          </div>
        </div>

        <div style={{ 
          borderTop: '1px solid var(--border-color)', 
          margin: '1.5rem 0',
          paddingTop: '1.5rem'
        }} />

        <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '1.25rem' }}>Upper Body Parameters (Inches)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Chest (in) *</label>
            <input
              type="number"
              name="chest"
              step="0.1"
              className="form-control"
              placeholder="e.g. 38"
              value={formData.chest}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Shoulder (in) *</label>
            <input
              type="number"
              name="shoulder"
              step="0.1"
              className="form-control"
              placeholder="e.g. 17"
              value={formData.shoulder}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Sleeve Length (in) *</label>
            <input
              type="number"
              name="sleeveLength"
              step="0.1"
              className="form-control"
              placeholder="e.g. 24"
              value={formData.sleeveLength}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div style={{ 
          borderTop: '1px solid var(--border-color)', 
          margin: '1.5rem 0',
          paddingTop: '1.5rem'
        }} />

        <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '1.25rem' }}>Lower Body Parameters (Inches)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="form-group">
            <label className="form-label">Waist (in) *</label>
            <input
              type="number"
              name="waist"
              step="0.1"
              className="form-control"
              placeholder="e.g. 32"
              value={formData.waist}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Hip (in) *</label>
            <input
              type="number"
              name="hip"
              step="0.1"
              className="form-control"
              placeholder="e.g. 39"
              value={formData.hip}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Inseam (in) *</label>
            <input
              type="number"
              name="inseam"
              step="0.1"
              className="form-control"
              placeholder="e.g. 30"
              value={formData.inseam}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          disabled={loading}
        >
          <Save size={18} />
          <span>{loading ? 'Saving Parameters...' : 'Save Measurements'}</span>
        </button>
      </form>
    </div>
  );
};

export default Measurements;
