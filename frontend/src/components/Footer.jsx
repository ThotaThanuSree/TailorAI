import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '2rem 1.5rem',
      textAlign: 'center',
      fontSize: '0.85rem',
      color: 'var(--text-dark)',
      marginTop: 'auto',
      background: 'rgba(11, 15, 25, 0.4)',
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p>&copy; {new Date().getFullYear()} AI Virtual Tailor & Fabric Recommendation Engine.</p>
        <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>
          Powered by Spring Boot 3 & React + Vite. Designed for premium custom fitments.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
