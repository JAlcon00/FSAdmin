import React from 'react';
import { useArticulos } from '../../../hooks/useArticulos';
import { useCategorias } from '../../../hooks/useCategorias';
import type { Articulo } from '../../../services/articulosService';

interface TablaArticulosProps {
  onEdit: (articulo: Articulo) => void;
  onDelete: (articulo: Articulo) => void;
  iconMode?: boolean; // Nuevo: para mostrar solo iconos en los botones de acción
}

const truncate = (text: string, max: number) => text.length > max ? text.slice(0, max) + '...' : text;

const TablaArticulos: React.FC<TablaArticulosProps> = ({ onEdit, onDelete, iconMode = false }) => {
  const { articulos, loading, error } = useArticulos();
  const { categorias } = useCategorias();

  if (loading) return <div className="text-center my-5"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle shadow rounded overflow-hidden">
        <thead className="table-primary">
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map(articulo => (
            <tr key={articulo._id} className="align-middle">
              <td>
                {Array.isArray(articulo.imagenes) && articulo.imagenes[0] ? (
                  <img src={articulo.imagenes[0]} alt={articulo.nombre} style={{ maxWidth: 60, maxHeight: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee', boxShadow: '0 2px 8px #0001' }} />
                ) : (
                  <span className="text-muted">Sin imagen</span>
                )}
              </td>
              <td className="fw-bold">{articulo.nombre}</td>
              <td>{truncate(articulo.descripcion || '', 40)}</td>
              <td><span className="badge bg-success">${Number(articulo.precio).toFixed(2)}</span></td>
              <td><span className={`badge ${Number(articulo.stock) > 0 ? 'bg-primary' : 'bg-danger'}`}>{articulo.stock}</span></td>
              <td>{categorias.find(c => c._id === articulo.categoria)?.nombre || articulo.categoria}</td>
              <td>
                <span className={`badge rounded-pill ${articulo.activo ? 'bg-success' : 'bg-secondary'}`}>{articulo.activo ? 'Sí' : 'No'}</span>
              </td>
              <td>
                {iconMode ? (
                  <>
                    <button className="btn btn-sm btn-warning me-2" title="Editar" onClick={() => onEdit(articulo)}>
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button className="btn btn-sm btn-danger" title="Eliminar" onClick={() => onDelete(articulo)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </>
                ) : (
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-warning" onClick={() => onEdit(articulo)}><i className="bi bi-pencil-square me-1"></i>Editar</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(articulo)}><i className="bi bi-trash me-1"></i>Eliminar</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaArticulos;
