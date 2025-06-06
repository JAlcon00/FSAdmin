import React from 'react';
import type { Categoria } from '../../../services/categoriasService';
import { useCategorias } from '../../../hooks/useCategorias';

interface TablaCategoriasProps {
  onEdit: (categoria: Categoria) => void;
  onDelete: (categoria: Categoria) => void;
}

export const TablaCategorias: React.FC<TablaCategoriasProps> = ({ onEdit, onDelete }) => {
  const { categorias, loading, error } = useCategorias();

  if (loading) return <div className="text-center my-5"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="row g-4 justify-content-center">
      {categorias.map((categoria: Categoria) => (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex" key={categoria._id}>
          <div className="card h-100 shadow-sm w-100" style={{ minWidth: 0, borderRadius: 16 }}>
            <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-4">
              <div className="rounded-circle bg-primary bg-opacity-10 mb-3 d-flex align-items-center justify-content-center" style={{ width: 56, height: 56 }}>
                <i className="bi bi-tag fs-3 text-primary"></i>
              </div>
              <h6 className="card-title fw-bold mb-1 text-truncate w-100" title={categoria.nombre} style={{ fontSize: '1.1rem' }}>{categoria.nombre}</h6>
              {categoria.descripcion && (
                <p className="card-text text-muted small mb-0 mt-1 text-truncate w-100" title={categoria.descripcion} style={{ maxWidth: '100%' }}>
                  {categoria.descripcion.length > 60 ? categoria.descripcion.slice(0, 57) + '...' : categoria.descripcion}
                </p>
              )}
            </div>
            <div className="card-footer d-flex justify-content-between gap-2 bg-white border-0 p-2">
              <button className="btn btn-sm btn-warning flex-fill" title="Editar" onClick={() => onEdit(categoria)}>
                <i className="bi bi-pencil-square"></i>
              </button>
              <button className="btn btn-sm btn-danger flex-fill" title="Eliminar" onClick={() => onDelete(categoria)}>
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
