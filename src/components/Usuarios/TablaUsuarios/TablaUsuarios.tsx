import React from 'react';
import type { Usuario } from '../../../services/usuariosService'; // Ajusta la ruta según tu estructura

interface TablaUsuariosProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: string) => void;
  loading: boolean;
  error: string | null;
}

const TablaUsuarios: React.FC<TablaUsuariosProps> = ({ usuarios, onEdit, onDelete, loading, error }) => {
  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p className="alert alert-danger">Error: {error}</p>;
  if (!usuarios.length) return <p className="alert alert-info">No hay usuarios para mostrar.</p>;

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario._id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.rol}</td>
              <td>
                <button className="btn btn-sm btn-primary me-2" onClick={() => onEdit(usuario)}>
                  <i className="bi bi-pencil-square"></i> Editar
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(usuario._id)}>
                  <i className="bi bi-trash"></i> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaUsuarios;