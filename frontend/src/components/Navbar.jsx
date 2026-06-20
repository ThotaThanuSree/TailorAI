import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { Scissors, LogOut, User as UserIcon, Menu } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <header className="glass-panel" style={{
      borderRadius: '0',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '70px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user && (
          <button 
            onClick={toggleSidebar}
            className="btn btn-secondary" 
            style={{ 
              padding: '0.5rem', 
              borderRadius: '8px',
              display: 'none', /* Show via media queries or inline style in mobile */
            }}
            id="sidebar-toggle-btn"
          >
            <Menu size={20} />
          </button>
        )}
        
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Scissors size={20} color="white" />
          </div>
          <span style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '1.25rem', 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #fff, var(--text-muted))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Virtual Tailor <span style={{ color: 'var(--primary)', WebkitTextFillColor: 'initial', fontSize: '0.75rem', verticalAlign: 'super', background: 'rgba(99, 102, 241, 0.15)', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>AI</span>
          </span>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }} className="btn btn-secondary">
              <UserIcon size={16} />
              <span>{user.fullName}</span>
            </Link>
            <button onClick={handleLogout} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
              <LogOut size={16} />
              <span className="hide-mobile">Logout</span>
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
              Log In
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
              Sign Up
            </Link>
          </div>
        )}
      </div>

      <style>{`
        #sidebar-toggle-btn {
          display: none !important;
        }
        @media (max-width: 992px) {
          #sidebar-toggle-btn {
            display: flex !important;
          }
          .hide-mobile {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
