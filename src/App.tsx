import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import Sidebar from './layout/Sidebar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Páginas cargadas de forma perezosa para code splitting
const GestionArticulos = lazy(() => import('./pages/GestionArticulos'));
const GestionCategorias = lazy(() => import('./pages/GestionCategorias'));
const GestionClientes = lazy(() => import('./pages/GestionClientes'));
const GestionPedidos = lazy(() => import('./pages/GestionPedidos'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
//const GestionUsuarios = lazy(() => import('./pages/GestionUsuarios'));

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className="d-flex">
          <Sidebar />
          <div className="flex-grow-1">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 d-lg-none">
              <div className="container-fluid">
                <a className="navbar-brand" href="/">Admin Tienda</a>
              </div>
            </nav>
            <div className="container-fluid bg-light min-vh-100 p-0">
              <Suspense fallback={<div>Cargando...</div>}>
                <Routes>
                  {/* Dashboard principal */}
                  <Route path="/" element={<Dashboard />} />
                  {/* Rutas ejemplo para futuras páginas */}
                  <Route path="/productos" element={<GestionArticulos />} />
                  <Route path="/categorias" element={<GestionCategorias />} />
                  <Route path="/clientes" element={<GestionClientes />} />
                  <Route path="/ventas" element={<h3>Gestión de Ventas</h3>} />
                  {/* <Route path="/usuarios" element={<GestionUsuarios />} /> */}
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
