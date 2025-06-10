import { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import Sidebar from './layout/Sidebar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './components/Auth/Login';

// Páginas cargadas de forma perezosa para code splitting
const GestionArticulos = lazy(() => import('./pages/GestionArticulos'));
const GestionCategorias = lazy(() => import('./pages/GestionCategorias'));
const GestionClientes = lazy(() => import('./pages/GestionClientes'));
const GestionPedidos = lazy(() => import('./pages/GestionPedidos'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const GestionUsuarios = lazy(() => import('./pages/GestionUsuarios'));

function App() {
  const queryClient = new QueryClient();
  const [usuario, setUsuario] = useState<{ nombre: string; rol: string } | null>(() => {
    const stored = localStorage.getItem('usuario');
    return stored ? JSON.parse(stored) : null;
  });

  // Persistir usuario en localStorage
  useEffect(() => {
    if (usuario) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('usuario');
    }
  }, [usuario]);

  if (!usuario) {
    return <Login onLogin={setUsuario} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className="d-flex">
          <Sidebar onLogout={() => setUsuario(null)} />
          <div className="flex-grow-1">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 d-lg-none">
              <div className="container-fluid">
                <a className="navbar-brand" href="/">Admin Tienda</a>
              </div>
            </nav>
            <div className="container-fluid bg-light min-vh-100 p-0" style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 18 }}>
              <Suspense fallback={<div>Cargando...</div>}>
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
              </Suspense>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App
