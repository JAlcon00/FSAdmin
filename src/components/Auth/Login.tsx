import React, { useState } from 'react';
import axios from 'axios';

interface LoginProps {
  onLogin: (user: { nombre: string; rol: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${API_URL}/usuarios/login`, { nombre, password });
      if (res.data && res.data.user) {
        onLogin(res.data.user);
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg d-flex justify-content-center align-items-center min-vh-100">
      <form
        className="login-card card p-4 shadow-lg animate__animated animate__fadeIn"
        style={{ minWidth: 320, maxWidth: 380, width: '100%', borderRadius: 18, background: 'rgba(255,255,255,0.95)' }}
        onSubmit={handleSubmit}
      >
        <div className="text-center mb-4">
          <div className="login-icon mb-2 animate__animated animate__bounceIn">
            <i className="bi bi-person-circle text-primary" style={{ fontSize: 56 }}></i>
          </div>
          <h3 className="mb-0 fw-bold text-primary">Iniciar sesión</h3>
          <span className="text-secondary small">Panel administrativo</span>
        </div>
        {error && <div className="alert alert-danger animate__animated animate__shakeX">{error}</div>}
        <div className="mb-3">
          <label className="form-label fw-semibold">Nombre de usuario</label>
          <div className="input-group">
            <span className="input-group-text bg-light"><i className="bi bi-person" /></span>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              autoFocus
              autoComplete="username"
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Contraseña</label>
          <div className="input-group">
            <span className="input-group-text bg-light"><i className="bi bi-lock" /></span>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
        </div>
        <button
          className="btn btn-gradient-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
          type="submit"
          disabled={loading}
          style={{ fontSize: 18, borderRadius: 12 }}
        >
          {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
          <i className="bi bi-box-arrow-in-right"></i>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
      <style>{`
        .login-bg {
          background: linear-gradient(120deg, #6a11cb 0%, #2575fc 100%);
          min-height: 100vh;
        }
        .login-card {
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
        }
        .btn-gradient-primary {
          background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
          color: #fff;
          border: none;
          transition: background 0.3s;
        }
        .btn-gradient-primary:hover, .btn-gradient-primary:focus {
          background: linear-gradient(90deg, #2575fc 0%, #6a11cb 100%);
          color: #fff;
        }
        @media (max-width: 600px) {
          .login-card {
            min-width: 90vw;
            max-width: 98vw;
            padding: 2rem 1rem;
          }
        }
      `}</style>
      {/* Animaciones animate.css CDN */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
    </div>
  );
};

export default Login;
