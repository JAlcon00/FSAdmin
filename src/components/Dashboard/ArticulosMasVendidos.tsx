import React from 'react';
import { useEstadisticas } from '../../hooks/useEstadisticas';

const ArticulosMasVendidos: React.FC = () => {
  const { masVendidos, loading, error } = useEstadisticas();

  return (
    <div className="card shadow-sm p-3">
      <h5 className="mb-3">Top 5 Artículos Más Vendidos</h5> {/* Título actualizado */}
      {loading ? (
        <div style={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="text-muted">Cargando...</span>
        </div>
      ) : error ? (
        <div style={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="text-danger">{error}</span>
        </div>
      ) : masVendidos.length === 0 ? (
        <div style={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="text-muted">No hay datos de artículos más vendidos.</span>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table table-sm table-hover mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Artículo</th>
                <th>Cantidad vendida</th>
              </tr>
            </thead>
            <tbody>
              {masVendidos.map((articulo, idx) => (
                // Usar articulo._id que ahora debería estar presente gracias al hook
                <tr key={articulo._id || idx}> 
                  <td>{idx + 1}</td>
                  {/* Acceder a articulo.nombre y articulo.cantidad que define el hook */}
                  <td>{articulo.nombre}</td>
                  <td>{articulo.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ArticulosMasVendidos;
