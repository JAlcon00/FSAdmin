import React, { useState, useEffect } from 'react';
import type { Usuario } from '../../../services/usuariosService';

interface FormUsuarioProps {
  usuarioActual: Usuario | null;
  onSave: (usuario: Partial<Usuario>) => void;
  onCancel: () => void;
  loading: boolean;
  error: string | null;
}

const FormUsuario: React.FC<FormUsuarioProps> = ({ usuarioActual, onSave, onCancel, loading, error }) => {
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<'cliente' | 'admin' | 'superadmin'>('cliente');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (usuarioActual) {
      setNombre(usuarioActual.nombre);
      setRol(usuarioActual.rol);
      setPassword('');
    } else {
      setNombre('');
      setRol('cliente');
      setPassword('');
    }
  }, [usuarioActual]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password.length > 0 && password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    // Solo enviar los campos permitidos
    const datosUsuario: any = {
      nombre,
      rol
    };
    if (password && password.length >= 6) {
      datosUsuario.password = password;
    }
    try {
      onSave(datosUsuario);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error al guardar usuario:', err);
      alert('Error al guardar usuario: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
      <h4 className="mb-3">{usuarioActual ? 'Editar Usuario' : 'Crear Usuario'}</h4>
      {error && <p className="alert alert-danger">Error: {error}</p>}
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">Nombre</label>
        <input
          type="text"
          className="form-control"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Contraseña {usuarioActual ? '(Dejar en blanco para no cambiar)' : ''}
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="rol" className="form-label">Rol</label>
        <select
          className="form-select"
          id="rol"
          value={rol}
          onChange={(e) => setRol(e.target.value as 'cliente' | 'admin' | 'superadmin')}
        >
          <option value="cliente">Cliente</option>
          <option value="admin">Administrador</option>
          <option value="superadmin">Super Administrador</option>
        </select>
      </div>
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : (usuarioActual ? 'Actualizar' : 'Crear')}
        </button>
      </div>
    </form>
  );
};

export default FormUsuario;