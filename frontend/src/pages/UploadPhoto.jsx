import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, photoService, measurementService } from '../services/api';
import { Upload, Camera, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const UploadPhoto = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [estimations, setEstimations] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
      setEstimations(null);
      setSuccess('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image file first.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await photoService.uploadPhoto(selectedFile, currentUser.id);
      if (response.success) {
        setEstimations(response.data);
        setSuccess('AI Scan Complete! Please review the estimated body sizing below.');
      } else {
        setError(response.message || 'Error processing photo.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Could not upload image. Ensure backend is running and directory writable.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptMeasurements = async () => {
    if (!estimations) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await measurementService.saveMeasurements(estimations);
      if (response.success) {
        setSuccess('Measurements accepted and active sizing updated!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(response.message || 'Error saving measurements.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving measurements.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>AI Size Estimator</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Upload a full-length, front-facing portrait photo in fitted clothes to generate custom size estimations.
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="upload-layout">
        {/* Left pane: File upload form */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <form onSubmit={handleUpload}>
            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: '12px',
              padding: '3rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.01)',
              transition: 'all var(--transition-fast)',
              marginBottom: '1.5rem'
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) {
                setSelectedFile(file);
                setPreviewUrl(URL.createObjectURL(file));
              }
            }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
              
              {previewUrl ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '220px', 
                      borderRadius: '8px',
                      boxShadow: 'var(--shadow-sm)'
                    }} 
                  />
                  <div style={{ 
                    marginTop: '1rem', 
                    fontSize: '0.85rem', 
                    color: 'var(--text-muted)' 
                  }}>
                    Click or drag new file to change image
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'var(--primary-glow)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Upload size={28} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>Select portrait image</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Drag & drop or browse from folder</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>Supports JPEG, PNG up to 10MB</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={loading || !selectedFile}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spin" />
                  <span>Processing Image...</span>
                </>
              ) : (
                <>
                  <Camera size={18} />
                  <span>Scan & Estimate Sizes</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right pane: AI Estimation display */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem' }}>Estimation Blueprint</h3>
          
          {estimations ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '1rem',
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '1.25rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Height</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>{estimations.height} cm</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Chest</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>{estimations.chest} in</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Waist</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>{estimations.waist} in</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Hip</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>{estimations.hip} in</span>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.01)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                color: 'var(--text-muted)'
              }}>
                <strong>Tailor Note:</strong> Standard AI measurement estimation computes values depending on standard anthropometric lookup indexes for the selected profile gender. Please accept to save as your active sizing.
              </div>

              <button
                onClick={handleAcceptMeasurements}
                className="btn btn-primary"
                style={{ width: '100%', background: 'linear-gradient(135deg, var(--success), #059669)' }}
                disabled={loading}
              >
                Accept &amp; Save Active Sizes
              </button>
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
              <Camera size={44} style={{ opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>
                Upload and scan an image. The mock computer-vision results will display here.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .spin {
          animation: spin 1.5s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 992px) {
          .upload-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default UploadPhoto;
