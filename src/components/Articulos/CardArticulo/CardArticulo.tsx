import React from 'react';
import type { Articulo } from '../../../services/articulosService';
import { useCategorias } from '../../../hooks/useCategorias';

interface CardArticuloProps {
  articulo: Articulo;
  onEdit: (articulo: Articulo) => void;
  onDelete: (articulo: Articulo) => void;
}

const CardArticulo: React.FC<CardArticuloProps> = ({ articulo, onEdit, onDelete }) => {
  const { categorias } = useCategorias();

  return (
    <div className="card h-100 shadow-sm">
      <div style={{ width: '100%', height: 180, overflow: 'hidden', borderTopLeftRadius: '0.375rem', borderTopRightRadius: '0.375rem', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {Array.isArray(articulo.imagenes) && articulo.imagenes[0] && (
          <img
            src={articulo.imagenes[0]}
            className="card-img-top"
            alt={articulo.nombre}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
        )}
      </div>
      <div className="card-body">
        <h5 className="card-title">{articulo.nombre}</h5>
        <p className="card-text" title={articulo.descripcion} style={{ minHeight: 48, maxHeight: 48, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {articulo.descripcion && articulo.descripcion.length > 80
            ? articulo.descripcion.slice(0, 77) + '...'
            : articulo.descripcion}
        </p>
        <div className="mb-2"><span className="fw-bold">Precio:</span> ${Number(articulo.precio).toFixed(2)}</div>
        <div className="mb-2"><span className="fw-bold">Stock:</span> {articulo.stock}</div>
        <div className="mb-2"><span className="fw-bold">Categoría:</span> {categorias.find(c => c._id === articulo.categoria)?.nombre || articulo.categoria}</div>
        <div className="mb-2"><span className="fw-bold">Activo:</span> {articulo.activo ? 'Sí' : 'No'}</div>
      </div>
      <div className="card-footer d-flex justify-content-between gap-2 bg-white border-0">
        <button className="btn btn-sm btn-warning flex-fill" title="Editar" onClick={() => onEdit(articulo)}>
          <i className="bi bi-pencil-square"></i>
        </button>
        <button className="btn btn-sm btn-danger flex-fill" title="Eliminar" onClick={() => onDelete(articulo)}>
          <i className="bi bi-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default CardArticulo;
