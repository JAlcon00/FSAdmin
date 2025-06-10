import React from 'react';
import type { Articulo } from '../../../services/articulosService';
import type { Categoria } from '../../../services/categoriasService'; // Importar Categoria
import { useCategorias } from '../../../hooks/useCategorias';
import { Card, Button } from 'react-bootstrap'; // Asegúrate de importar Button si lo usas
import './cardArticuloResponsive.css';

interface CardArticuloProps {
  articulo: Articulo;
  onEdit: (articulo: Articulo) => void;
  onDelete: (id: string) => void;
}

const CardArticulo: React.FC<CardArticuloProps> = ({ articulo, onEdit, onDelete }) => {
  const { categorias } = useCategorias(); // Aunque no se usa directamente, puede ser para un futuro selector o lógica
  const stockNum = Number(articulo.stock);
  const badgeClass = stockNum === 0 ? "bg-warning text-dark" : "bg-success"; // Simplificado: amarillo si 0, verde si > 0

  const categoriaNombre = React.useMemo(() => {
    if (articulo.categoria && typeof articulo.categoria === 'object' && 'nombre' in articulo.categoria) {
        return (articulo.categoria as Categoria).nombre;
    } else if (typeof articulo.categoria === 'string') {
        // Si categoria es un string (ID), buscar en la lista de categorías
        // Esta parte asume que `categorias` es un array de objetos Categoria
        // y que `useCategorias` las provee. Si no, ajustar.
        const cat = categorias.find(c => c._id === articulo.categoria);
        return cat ? cat.nombre : "ID: " + articulo.categoria.substring(0,6) + "..."; // Mostrar ID corto si no se encuentra nombre
    }
    return "Sin categoría";
}, [articulo.categoria, categorias]);


  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2 card-articulo-responsive">
      <Card className="h-100 shadow-sm card-articulo">
        <div className="card-image-container">
          {(Array.isArray(articulo.imagenes) && articulo.imagenes[0]) || articulo.imagenUrl ? (
            <img
              src={Array.isArray(articulo.imagenes) && articulo.imagenes[0] ? articulo.imagenes[0] : articulo.imagenUrl}
              className="card-img-top"
              alt={`Imagen de ${articulo.nombre}`}
            />
          ) : (
            <div className="no-image-placeholder">
              <i className="bi bi-image-alt text-muted"></i>
            </div>
          )}
        </div>
        <Card.Body className="d-flex flex-column p-3">
          <div className="card-header-section mb-2">
            <h6 className="card-title fw-bold mb-1" title={articulo.nombre}>
              {articulo.nombre.length > 30 ? articulo.nombre.slice(0, 27) + '...' : articulo.nombre}
              {stockNum === 0 && <span className="badge bg-danger ms-2 badge-sm">Sin stock</span>}
            </h6>
            <p className="card-text text-muted small mb-0" title={articulo.descripcion}>
              {articulo.descripcion && articulo.descripcion.length > 50
                ? articulo.descripcion.slice(0, 47) + '...'
                : articulo.descripcion}
            </p>
          </div>

          <div className="card-info-grid mb-3">
            <div className="info-item">
              <i className="bi bi-currency-dollar text-success"></i>
              <span className="fw-bold text-success">${Number(articulo.precio).toFixed(2)}</span>
            </div>
            <div className="info-item">
              <i className="bi bi-tag text-info"></i>
              <span className="badge bg-info text-dark small">{categoriaNombre}</span>
            </div>
            <div className="info-item">
              <i className="bi bi-archive text-secondary"></i>
              <span className={`badge ${badgeClass} small`}>{stockNum}</span>
            </div>
            <div className="info-item">
              <i className="bi bi-check2-circle text-secondary"></i>
              {articulo.activo ? (
                <span className="badge bg-success small">Activo</span>
              ) : (
                <span className="badge bg-danger small">Inactivo</span>
              )}
            </div>
          </div>

          <div className="mt-auto">
            <div className="d-grid gap-2">
              <div className="btn-group btn-group-sm">
                <Button variant="outline-primary" size="sm" onClick={() => onEdit(articulo)}>
                  <i className="bi bi-pencil-square"></i> Editar
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => onDelete(articulo._id)}>
                  <i className="bi bi-trash"></i> Eliminar
                </Button>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CardArticulo;
