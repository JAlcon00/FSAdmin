import React from 'react';
import type { Articulo } from '../../../services/articulosService';
import type { Categoria } from '../../../services/categoriasService'; // Importar Categoria
import { useCategorias } from '../../../hooks/useCategorias';
import { Card, Button } from 'react-bootstrap'; // Asegúrate de importar Button si lo usas

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
    <div className="d-flex w-100">
      <Card style={{ minWidth: 320, maxWidth: 420, width: '100%', height: 480, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="mb-3 shadow-sm h-100">
        <div style={{ width: '100%', height: 180, overflow: 'hidden', borderTopLeftRadius: '0.375rem', borderTopRightRadius: '0.375rem', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {(Array.isArray(articulo.imagenes) && articulo.imagenes[0]) || articulo.imagenUrl ? (
            <img
              src={Array.isArray(articulo.imagenes) && articulo.imagenes[0] ? articulo.imagenes[0] : articulo.imagenUrl}
              className="card-img-top"
              alt={`Imagen de ${articulo.nombre}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', aspectRatio: '16/9' }}
            />
          ) : (
            <i className="bi bi-image-alt text-muted" style={{ fontSize: '3rem' }}></i>
          )}
        </div>
        <Card.Body className="d-flex flex-column" style={{ minHeight: 180, padding: '1rem' }}>
          <h5 className="card-title d-flex align-items-center gap-2 flex-wrap mb-1" style={{ fontSize: '1.1rem', maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={articulo.nombre}>
            <span className="text-break">{articulo.nombre.length > 38 ? articulo.nombre.slice(0, 35) + '...' : articulo.nombre}</span>
            {stockNum === 0 && <span className="badge bg-danger ms-2"><i className="bi bi-exclamation-triangle"></i> Sin stock</span>}
          </h5>
          <Card.Text className="mb-3" title={articulo.descripcion} style={{ minHeight: 20, maxHeight: 44, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontSize: '0.97rem', whiteSpace: 'normal' }}>
            {articulo.descripcion && articulo.descripcion.length > 70
              ? articulo.descripcion.slice(0, 67) + '...'
              : articulo.descripcion}
          </Card.Text>

          {/* Tabla de atributos y valores */}
          <div className="table-responsive mb-2">
            <table className="table table-sm mb-0 align-middle">
              <tbody>
                <tr>
                  <td className="fw-bold text-secondary"><i className="bi bi-currency-dollar me-1"></i>Precio:</td>
                  <td><span className="badge bg-light text-success border border-success">${Number(articulo.precio).toFixed(2)}</span></td>
                </tr>
                <tr>
                  <td className="fw-bold text-secondary"><i className="bi bi-tag me-1"></i>Categoría:</td>
                  <td><span className="badge bg-info text-dark">{categoriaNombre}</span></td>
                </tr>
                <tr>
                  <td className="fw-bold text-secondary"><i className="bi bi-archive me-1"></i>Stock:</td>
                  <td><span className={`badge ${badgeClass}`}>{stockNum}</span></td>
                </tr>
                <tr>
                  <td className="fw-bold text-secondary"><i className="bi bi-check2-circle me-1"></i>Activo:</td>
                  <td>{articulo.activo ? (
                    <span className="badge bg-success">Sí</span>
                  ) : (
                    <span className="badge bg-danger">No</span>
                  )}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-auto d-flex justify-content-end gap-2">
            <Button variant="outline-primary" size="sm" onClick={() => onEdit(articulo)}>
              <i className="bi bi-pencil-square"></i> Editar
            </Button>
            <Button variant="outline-danger" size="sm" onClick={() => onDelete(articulo._id)}>
              <i className="bi bi-trash"></i> Eliminar
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CardArticulo;
