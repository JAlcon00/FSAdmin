import React, { useState, useEffect } from 'react';
import type { Usuario } from '../../../services/usuariosService'; // Ajusta la ruta

interface FormUsuarioProps {
  usuarioActual: Usuario | null;
  onSave: (usuario: Partial<Usuario>) => void;
  onCancel: () => void;
  loading: boolean;
  error: string | null;
}

const FormUsuario: React.FC<FormUsuarioProps> = ({ usuarioActual, onSave, onCancel, loading, error }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [rol, setRol] = useState('usuario'); // Rol por defecto
  const [activo, setActivo] = useState(true);
  const [password, setPassword] = useState(''); // Campo para la contraseña

  useEffect(() => {
    if (usuarioActual) {
      setNombre(usuarioActual.nombre);
      setCorreo(usuarioActual.correo);
      setRol(usuarioActual.rol);
      setActivo(usuarioActual.activo);
      setPassword(''); // No precargar la contraseña por seguridad
    } else {
      // Limpiar formulario para nuevo usuario
      setNombre('');
      setCorreo('');
      setRol('usuario');
      setActivo(true);
      setPassword('');
    }
  }, [usuarioActual]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const datosUsuario: Partial<Usuario> = {
      nombre,
      correo,
      rol,
      activo,
    };
    if (password) { // Solo incluir la contraseña si se ha ingresado algo
      (datosUsuario as any).password = password;
    }
    onSave(datosUsuario);
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
        <label htmlFor="correo" className="form-label">Correo Electrónico</label>
        <input
          type="email"
          className="form-control"
          id="correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
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
          // No es 'required' para permitir la edición sin cambiar contraseña
        />
      </div>
      <div className="mb-3">
        <label htmlFor="rol" className="form-label">Rol</label>
        <select
          className="form-select"
          id="rol"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        >
          <option value="admin">Administrador</option>
          <option value="editor">Editor</option>
          <option value="usuario">Usuario</option>
        </select>
      </div>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="activo"
          checked={activo}
          onChange={(e) => setActivo(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="activo">
          Activo
        </label>
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