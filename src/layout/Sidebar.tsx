import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const menu = [
  { path: '/', label: 'Dashboard', icon: 'bi-house' },
  { path: '/productos', label: 'Artículos', icon: 'bi-box-seam' },
  { path: '/categorias', label: 'Categorías', icon: 'bi-tags' },
  { path: '/clientes', label: 'Clientes', icon: 'bi-people' },
  { path: '/pedidos', label: 'Pedidos', icon: 'bi-bag-check' },
  { path: '/usuarios', label: 'Usuarios', icon: 'bi-person-badge' },
  { label: 'Cerrar sesión', icon: 'bi-box-arrow-right', logout: true },
];

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleLogout = () => {
    onLogout();
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };
  return (
    <>
      {/* Botón hamburguesa para móviles */}
      <button
        className="d-lg-none hamburger-btn"
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 1060,
          background: 'linear-gradient(120deg, #6a11cb 0%, #2575fc 100%)',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          padding: '8px 12px',
          fontSize: '1.2rem'
        }}
      >
        <i className={`bi ${isOpen ? 'bi-x' : 'bi-list'}`}></i>
      </button>

      {/* Overlay para cerrar el menú en móviles */}
      {isOpen && (
        <div
          className="d-lg-none sidebar-overlay"
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1049
          }}
        />
      )}

      <aside
        className={`sidebar-gradient d-flex flex-column flex-shrink-0 p-3 border-end min-vh-100 shadow-lg ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        style={{ width: 230, borderRadius: '0 24px 24px 0' }}
      >
        <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none" onClick={closeSidebar}>
          <span className="fs-4 fw-bold sidebar-title">FrontStore Admin</span>
        </Link>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          {menu.map(item => (
            <li className="nav-item" key={item.label}>
              {item.logout ? (
                <button
                  className="nav-link d-flex align-items-center gap-2 sidebar-logout-btn bg-transparent border-0 w-100"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    handleLogout();
                    closeSidebar();
                  }}
                >
                  <i className={`bi ${item.icon} sidebar-icon sidebar-icon-logout`}></i>
                  {item.label}
                </button>
              ) : (
                <Link
                  to={item.path!}
                  className={`nav-link d-flex align-items-center gap-2 sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={closeSidebar}
                >
                  <i className={`bi ${item.icon} sidebar-icon`}></i>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </aside>
      <style>{`
        .sidebar-gradient {
          background: linear-gradient(120deg, #6a11cb 0%, #2575fc 100%);
          color: #fff;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
          transition: transform 0.3s ease;
        }
        .sidebar-title {
          color: #fff;
          letter-spacing: 1px;
          text-shadow: 0 2px 8px rgba(106,17,203,0.08);
        }
        .sidebar-link {
          color: #e3e3e3;
          font-weight: 500;
          border-radius: 18px;
          margin-bottom: 2px;
          transition: background 0.2s, color 0.2s, transform 0.15s;
          position: relative;
          z-index: 1;
        }
        .sidebar-link.active, .sidebar-link:hover {
          background: rgba(255,255,255,0.18);
          color: #fff;
          transform: translateX(4px) scale(1.04);
          box-shadow: 0 4px 24px 0 rgba(106,17,203,0.10);
        }
        .sidebar-link.active::before, .sidebar-link:hover::before {
          content: '';
          position: absolute;
          left: 0; right: 0; top: 0; bottom: 0;
          border-radius: 18px;
          background: rgba(255,255,255,0.22);
          box-shadow: 0 2px 16px 0 rgba(106,17,203,0.10);
          backdrop-filter: blur(6px);
          z-index: -1;
          transition: background 0.2s, box-shadow 0.2s;
        }
        .sidebar-icon {
          font-size: 1.3rem;
          color: #fff;
          filter: drop-shadow(0 1px 2px rgba(31,38,135,0.10));
        }
        .sidebar-icon-logout {
          color: #ff4d4f;
        }
        .sidebar-logout-btn {
          color: #ff4d4f;
          font-weight: 500;
          border-radius: 12px;
          transition: background 0.2s, color 0.2s, transform 0.15s;
        }
        .sidebar-logout-btn:hover {
          background: rgba(255,77,79,0.12);
          color: #fff;
          transform: translateX(4px) scale(1.04);
        }
        
        @media (max-width: 991.98px) {
          .sidebar-gradient {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 1050;
            transform: translateX(-100%);
          }
          .sidebar-gradient.sidebar-open {
            transform: translateX(0);
          }
          .sidebar-gradient.sidebar-closed {
            transform: translateX(-100%);
          }
        }
      `}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
    </>
  );
};

export default Sidebar;
