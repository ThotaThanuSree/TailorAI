import React, { useEffect, useState } from 'react';
import { authService, measurementService, recommendationService, patternService } from '../services/api';
import DashboardCard from '../components/DashboardCard';
import { Camera, Ruler, Layers, Sparkles, AlertCircle, FileSpreadsheet } from 'lucide-react';

const Dashboard = () => {
  const currentUser = authService.getCurrentUser();
  const [latestMeasurements, setLatestMeasurements] = useState(null);
  const [recCount, setRecCount] = useState(0);
  const [patternCount, setPatternCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch latest measurements
        const measResponse = await measurementService.getLatestMeasurements(currentUser.id);
        if (measResponse.success) {
          setLatestMeasurements(measResponse.data);
        }
      } catch (err) {
        // Ignore 404 errors as they mean the user hasn't created measurements yet
        console.log("No measurements found yet");
      }

      try {
        // Fetch recommendation history count
        const recResponse = await recommendationService.getRecommendationHistory(currentUser.id);
        if (recResponse.success && recResponse.data) {
          setRecCount(recResponse.data.length);
        }
      } catch (err) {
        console.log("Error loading recommendation count");
      }

      try {
        // Fetch pattern history count
        const patResponse = await patternService.getPatternHistory(currentUser.id);
        if (patResponse.success && patResponse.data) {
          setPatternCount(patResponse.data.length);
        }
      } catch (err) {
        console.log("Error loading pattern count");
      }

      setLoading(false);
    };

    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  return (
    <div>
      {/* Welcome Hero header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Hello, <span className="text-gradient-primary">{currentUser?.fullName}</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Welcome to your Tailor Workspace. Analyze measurements, select fabrics, and generate production patterns.
        </p>
      </div>

      {/* Statistics counters bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Height Status</span>
          <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>
            {latestMeasurements ? `${latestMeasurements.height} cm` : 'None'}
          </span>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Chest Size</span>
          <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--secondary)' }}>
            {latestMeasurements ? `${latestMeasurements.chest} in` : 'None'}
          </span>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Recommendations</span>
          <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)' }}>
            {recCount}
          </span>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Patterns Drafted</span>
          <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success)' }}>
            {patternCount}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem', marginBottom: '2.5rem' }} className="responsive-split">
        {/* Sizing shortcuts */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.25rem' }}>Quick Actions</h2>
          <div className="dashboard-grid">
            <DashboardCard
              to="/upload-photo"
              icon={<Camera size={20} />}
              title="Estimate via Photo"
              description="Upload a photo of yourself to mock-estimate your chest, waist, hips, and height measurements automatically."
              badgeText="Mock AI"
            />
            <DashboardCard
              to="/enter-measurements"
              icon={<Ruler size={20} />}
              title="Enter Sizing Specs"
              description="Manually input your tailor dimensions such as sleeves, inseam, shoulder width, and waist specs."
              badgeText="Manual"
            />
            <DashboardCard
              to="/recommend-fabric"
              icon={<Layers size={20} />}
              title="Recommend Fabric"
              description="Analyze environmental weather and occasions to search matching fabrics, sizing, and quantity yardages."
            />
            <DashboardCard
              to="/generate-pattern"
              icon={<Sparkles size={20} />}
              title="Generate Pattern"
              description="Structure a downloadable clothing layout draft in JSON using your saved physical tailoring measurements."
            />
          </div>
        </div>

        {/* Latest Measurements Summary */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.25rem' }}>Active Sizing Blueprint</h2>
          
          <div className="glass-panel" style={{ padding: '1.75rem', height: 'calc(100% - 2.75rem)' }}>
            {loading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading active blueprint...</p>
            ) : latestMeasurements ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Height</span>
                  <span style={{ fontWeight: 600 }}>{latestMeasurements.height} cm</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Chest</span>
                  <span style={{ fontWeight: 600 }}>{latestMeasurements.chest} in</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Waist</span>
                  <span style={{ fontWeight: 600 }}>{latestMeasurements.waist} in</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Hip</span>
                  <span style={{ fontWeight: 600 }}>{latestMeasurements.hip} in</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Shoulder</span>
                  <span style={{ fontWeight: 600 }}>{latestMeasurements.shoulder} in</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Sleeve Length</span>
                  <span style={{ fontWeight: 600 }}>{latestMeasurements.sleeveLength} in</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Inseam</span>
                  <span style={{ fontWeight: 600 }}>{latestMeasurements.inseam} in</span>
                </div>
                
                <div style={{ 
                  marginTop: '1rem', 
                  fontSize: '0.8rem', 
                  color: 'var(--text-dark)', 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  padding: '8px 12px',
                  borderRadius: '6px'
                }}>
                  <FileSpreadsheet size={14} />
                  <span>
                    Estimated from Photo: {latestMeasurements.estimatedFromPhoto ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                gap: '1rem',
                padding: '2rem 0'
              }}>
                <AlertCircle size={36} color="var(--warning)" />
                <div>
                  <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>No Active Blueprint</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    You have not recorded body measurements yet. Upload a photo or input measurements manually to get started!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .responsive-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
