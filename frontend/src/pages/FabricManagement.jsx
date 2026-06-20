import React, { useEffect, useState } from 'react';
import { fabricService } from '../services/api';
import { AlertCircle, CheckCircle, Edit, Trash2, Plus, Sliders, X } from 'lucide-react';

const FabricManagement = () => {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFabricId, setCurrentFabricId] = useState(null);
  const [formData, setFormData] = useState({
    fabricName: '',
    weatherType: 'Summer',
    occasionType: 'Casual',
    comfortLevel: 'High',
    description: ''
  });

  const loadFabrics = async () => {
    setLoading(true);
    try {
      const response = await fabricService.getFabrics();
      if (response.success) {
        setFabrics(response.data);
      }
    } catch (err) {
      setError('Could not load fabrics catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFabrics();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleReset = () => {
    setFormData({
      fabricName: '',
      weatherType: 'Summer',
      occasionType: 'Casual',
      comfortLevel: 'High',
      description: ''
    });
    setIsEditMode(false);
    setCurrentFabricId(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fabricName || !formData.description) {
      setError('Please fill in name and description fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isEditMode) {
        const response = await fabricService.updateFabric(currentFabricId, formData);
        if (response.success) {
          setSuccess('Fabric material updated successfully!');
          handleReset();
          await loadFabrics();
        } else {
          setError(response.message || 'Error updating fabric.');
        }
      } else {
        const response = await fabricService.createFabric(formData);
        if (response.success) {
          setSuccess('Fabric material created successfully!');
          handleReset();
          await loadFabrics();
        } else {
          setError(response.message || 'Error creating fabric.');
        }
      }
    } catch (err) {
      setError('Failed to save fabric. Ensure backend is active.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (fabric) => {
    setFormData({
      fabricName: fabric.fabricName,
      weatherType: fabric.weatherType,
      occasionType: fabric.occasionType,
      comfortLevel: fabric.comfortLevel,
      description: fabric.description
    });
    setIsEditMode(true);
    setCurrentFabricId(fabric.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fabric material?')) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fabricService.deleteFabric(id);
      if (response.success) {
        setSuccess('Fabric material deleted successfully!');
        await loadFabrics();
      } else {
        setError(response.message || 'Error deleting fabric.');
      }
    } catch (err) {
      setError('Failed to delete fabric.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Admin Fabric Management</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Configure and maintain materials properties, occasion filters, comfort indicators, and description records.
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

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '2rem' }} className="admin-layout">
        {/* Left: Input Form */}
        <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} color="var(--primary)" />
            <span>{isEditMode ? 'Modify Fabric Record' : 'Create Fabric Record'}</span>
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Fabric Name *</label>
              <input
                type="text"
                name="fabricName"
                className="form-control"
                placeholder="e.g. Linen Cotton Blend"
                value={formData.fabricName}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Weather Type</label>
                <select
                  name="weatherType"
                  className="form-control"
                  value={formData.weatherType}
                  onChange={handleChange}
                >
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Occasion Type</label>
                <select
                  name="occasionType"
                  className="form-control"
                  value={formData.occasionType}
                  onChange={handleChange}
                >
                  <option value="Casual">Casual</option>
                  <option value="Office">Office</option>
                  <option value="Party">Party</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Comfort Level</label>
              <select
                name="comfortLevel"
                className="form-control"
                value={formData.comfortLevel}
                onChange={handleChange}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description &amp; Notes *</label>
              <textarea
                name="description"
                className="form-control"
                rows="4"
                placeholder="Describe fabric properties, feel, weight, suitability details..."
                value={formData.description}
                onChange={handleChange}
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                <span>{isEditMode ? 'Update Record' : 'Save Fabric'}</span>
              </button>
              {isEditMode && (
                <button type="button" onClick={handleReset} className="btn btn-secondary">
                  <X size={18} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right: Fabric table */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={18} color="var(--primary)" />
            <span>Fabric Inventory</span>
          </h3>

          {loading && fabrics.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading records catalog...</p>
          ) : fabrics.length > 0 ? (
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Fabric Name</th>
                    <th>Conditions</th>
                    <th>Comfort</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fabrics.map((fabric) => (
                    <tr key={fabric.id}>
                      <td style={{ fontWeight: 600 }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>{fabric.fabricName}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                            {fabric.description}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>
                          {fabric.weatherType} • {fabric.occasionType}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.8rem'
                        }}>
                          {fabric.comfortLevel}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleEditClick(fabric)}
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem', borderRadius: '6px' }}
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(fabric.id)}
                            className="btn btn-danger"
                            style={{ padding: '0.4rem', borderRadius: '6px' }}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dark)' }}>
              <AlertCircle size={36} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>No fabrics registered. Add one using the form.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .admin-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FabricManagement;
