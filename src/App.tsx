import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import GestionArticulos from './pages/GestionArticulos';
import GestionCategorias from './pages/GestionCategorias';
import GestionClientes from './pages/GestionClientes';
import Dashboard from './pages/Dashboard';
import GestionPedidos from './pages/GestionPedidos';
import GestionUsuarios from './pages/GestionUsuarios';
import Sidebar from './layout/Sidebar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1">
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 d-lg-none">
            <div className="container-fluid">
              <a className="navbar-brand" href="/">Admin Tienda</a>
            </div>
          </nav>
          <div className="container-fluid bg-light min-vh-100 p-0">
            <Routes>
              {/* Dashboard principal */}
              <Route path="/" element={<Dashboard />} />
              {/* Rutas ejemplo para futuras páginas */}
              <Route path="/productos" element={<GestionArticulos />} />
              <Route path="/categorias" element={<GestionCategorias />} />
              <Route path="/clientes" element={<GestionClientes />} />
              <Route path="/ventas" element={<h3>Gestión de Ventas</h3>} />
              <Route path="/usuarios" element={<GestionUsuarios />} />
              <Route path="/pedidos" element={<GestionPedidos />} />
              {/* Redirección para rutas no encontradas */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App
