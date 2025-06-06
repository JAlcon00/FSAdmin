import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menu = [
  { path: '/', label: 'Dashboard', icon: 'bi-house' },
  { path: '/productos', label: 'Artículos', icon: 'bi-box-seam' },
  { path: '/categorias', label: 'Categorías', icon: 'bi-tags' }, // Asegura que esta ruta esté bien
  { path: '/clientes', label: 'Clientes', icon: 'bi-people' },
  { path: '/pedidos', label: 'Pedidos', icon: 'bi-bag-check' },
  { path: '/ventas', label: 'Ventas', icon: 'bi-bar-chart' },
  { path: '/usuarios', label: 'Usuarios', icon: 'bi-person-badge' },
  { path: '/estadisticas', label: 'Estadísticas', icon: 'bi-graph-up' },
  { label: 'Cerrar sesión', icon: 'bi-box-arrow-right', logout: true },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const handleLogout = () => {
    // Aquí iría la lógica de logout
  };
  return (
    <aside className="d-flex flex-column flex-shrink-0 p-3 bg-light border-end min-vh-100" style={{ width: 220 }}>
      <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none">
        <span className="fs-4 fw-bold text-primary">Admin Tienda</span>
      </Link>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        {menu.map(item => (
          <li className="nav-item" key={item.label}>
            {item.logout ? (
              <button
                className="nav-link d-flex align-items-center gap-2 text-danger bg-transparent border-0 w-100"
                style={{ cursor: 'pointer' }}
                onClick={handleLogout}
              >
                <i className={`bi ${item.icon}`}></i>
                {item.label}
              </button>
            ) : (
              <Link
                to={item.path!}
                className={`nav-link d-flex align-items-center gap-2 ${location.pathname === item.path ? 'active' : 'text-dark'}`}
              >
                <i className={`bi ${item.icon}`}></i>
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
