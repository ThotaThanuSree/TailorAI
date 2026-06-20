import React, { useEffect, useState } from 'react';
import { authService, measurementService } from '../services/api';
import { User, Mail, Phone, Calendar, AlertCircle, Shield } from 'lucide-react';

const Profile = () => {
  const currentUser = authService.getCurrentUser();
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileAndMeasurements = async () => {
      try {
        const profResponse = await authService.getProfile(currentUser.id);
        if (profResponse.success) {
          setProfile(profResponse.data);
        }

        const historyResponse = await measurementService.getMeasurementHistory(currentUser.id);
        if (historyResponse.success) {
          setHistory(historyResponse.data);
        }
      } catch (err) {
        setError('Error loading profile or size parameters history.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProfileAndMeasurements();
    }
  }, [currentUser]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Tailor Profile</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Manage your account configurations and view your historical sizing blueprints.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading profile data...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }} className="profile-layout">
          
          {/* Left: User details */}
          <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2.25rem',
                fontWeight: 700,
                marginBottom: '1rem',
                boxShadow: 'var(--shadow-md)'
              }}>
                {profile?.fullName?.charAt(0).toUpperCase()}
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 600 }}>{profile?.fullName}</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                <Shield size={12} color="var(--primary)" />
                Registered Tailor Profile
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={18} color="var(--text-muted)" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)', fontWeight: 600 }}>EMAIL ADDRESS</span>
                  <span style={{ fontSize: '0.95rem' }}>{profile?.email}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={18} color="var(--text-muted)" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)', fontWeight: 600 }}>PHONE NUMBER</span>
                  <span style={{ fontSize: '0.95rem' }}>{profile?.phone || 'Not provided'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <User size={18} color="var(--text-muted)" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)', fontWeight: 600 }}>GENDER</span>
                  <span style={{ fontSize: '0.95rem' }}>{profile?.gender || 'Not specified'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sizing history */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: '#fff' }}>
              Sizing Blueprint Records Archive
            </h3>

            {history.length > 0 ? (
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Height</th>
                      <th>Chest</th>
                      <th>Waist</th>
                      <th>Hip</th>
                      <th>Shoulder</th>
                      <th>Sleeves</th>
                      <th>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id}>
                        <td style={{ minWidth: '120px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                            <Calendar size={12} color="var(--text-dark)" />
                            {formatDate(item.createdAt)}
                          </span>
                        </td>
                        <td>{item.height} cm</td>
                        <td style={{ fontWeight: 600 }}>{item.chest}"</td>
                        <td>{item.waist}"</td>
                        <td>{item.hip}"</td>
                        <td>{item.shoulder}"</td>
                        <td>{item.sleeveLength}"</td>
                        <td>
                          <span style={{
                            background: item.estimatedFromPhoto ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            color: item.estimatedFromPhoto ? 'var(--primary)' : 'var(--success)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>
                            {item.estimatedFromPhoto ? 'Photo Scan' : 'Manual'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dark)' }}>
                <AlertCircle size={36} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>No measurement entries have been recorded yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 992px) {
          .profile-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
