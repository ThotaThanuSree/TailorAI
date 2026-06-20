import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const DashboardCard = ({ title, description, icon, to, badgeText, badgeColor }) => {
  return (
    <Link to={to} className="glass-panel glass-panel-interactive" style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '1.75rem',
      borderRadius: 'var(--radius-md)',
      position: 'relative',
      overflow: 'hidden',
      height: '100%',
      minHeight: '180px'
    }}>
      {/* Background glow decoration */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'var(--primary)',
        filter: 'blur(45px)',
        opacity: 0.1,
        pointerEvents: 'none'
      }} />

      {badgeText && (
        <span style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          fontSize: '0.7rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          padding: '2px 8px',
          borderRadius: '4px',
          background: badgeColor || 'var(--primary-glow)',
          color: badgeColor ? '#fff' : 'var(--primary)'
        }}>
          {badgeText}
        </span>
      )}

      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-color)',
        width: '44px',
        height: '44px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--primary)',
        marginBottom: '1.25rem'
      }}>
        {icon}
      </div>

      <h3 style={{
        fontSize: '1.15rem',
        fontWeight: 600,
        marginBottom: '0.5rem',
        color: 'var(--text-main)'
      }}>
        {title}
      </h3>

      <p style={{
        fontSize: '0.875rem',
        color: 'var(--text-muted)',
        lineHeight: 1.5,
        marginBottom: '1.5rem',
        flex: 1
      }}>
        {description}
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: 'var(--primary)',
        marginTop: 'auto'
      }}>
        <span>Open Tool</span>
        <ArrowRight size={14} className="arrow-icon" style={{ transition: 'transform var(--transition-fast)' }} />
      </div>

      <style>{`
        .glass-panel-interactive:hover .arrow-icon {
          transform: translateX(4px);
        }
      `}</style>
    </Link>
  );
};

export default DashboardCard;
