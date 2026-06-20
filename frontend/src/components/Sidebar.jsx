import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Camera, 
  Ruler, 
  Layers, 
  Sparkles, 
  History, 
  User, 
  Sliders, 
  X 
} from 'lucide-react';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/upload-photo', label: 'Upload Photo', icon: <Camera size={18} /> },
    { to: '/enter-measurements', label: 'Enter Sizes', icon: <Ruler size={18} /> },
    { to: '/recommend-fabric', label: 'Fabric Recommendations', icon: <Layers size={18} /> },
    { to: '/generate-pattern', label: 'Generate Pattern', icon: <Sparkles size={18} /> },
    { to: '/history', label: 'My History', icon: <History size={18} /> },
    { to: '/profile', label: 'Tailor Profile', icon: <User size={18} /> },
  ];

  const adminLinks = [
    { to: '/admin/fabrics', label: 'Fabric Management', icon: <Sliders size={18} /> }
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 101,
          }}
          className="sidebar-backdrop"
        />
      )}

      <aside className={`glass-panel sidebar ${isOpen ? 'open' : ''}`} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '260px',
        height: '100vh',
        borderRadius: '0',
        borderTop: 'none',
        borderBottom: 'none',
        borderLeft: 'none',
        zIndex: 102,
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        background: '#0f172a',
        transition: 'transform var(--transition-normal)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ 
            fontFamily: 'var(--font-display)', 
            fontWeight: 700, 
            fontSize: '1.1rem',
            color: 'var(--text-main)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            opacity: 0.8
          }}>
            Navigation
          </span>
          <button 
            onClick={closeSidebar}
            className="btn btn-secondary" 
            style={{ 
              padding: '0.25rem', 
              borderRadius: '8px',
              display: 'none',
              border: 'none',
              background: 'transparent'
            }}
            id="sidebar-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeSidebar}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}

          <div style={{ 
            margin: '1.5rem 0 0.5rem 0', 
            borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
            paddingTop: '1rem' 
          }}>
            <span style={{ 
              fontSize: '0.75rem', 
              color: 'var(--text-dark)', 
              fontWeight: 600, 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em',
              paddingLeft: '0.75rem'
            }}>
              Admin panel
            </span>
          </div>

          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeSidebar}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} admin-link`}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ 
          fontSize: '0.75rem', 
          color: 'var(--text-dark)', 
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '1rem'
        }}>
          Tailor AI v1.0.0
        </div>
      </aside>

      <style>{`
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1rem;
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.95rem;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }
        .sidebar-link:hover {
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-main);
        }
        .sidebar-link.active {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.08));
          color: var(--primary);
          border: 1px solid rgba(99, 102, 241, 0.15);
        }
        .sidebar-link.active.admin-link {
          background: rgba(245, 158, 11, 0.08);
          color: var(--warning);
          border: 1px solid rgba(245, 158, 11, 0.15);
        }
        @media (max-width: 992px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
          #sidebar-close-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
