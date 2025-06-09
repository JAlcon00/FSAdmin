import React from 'react';
import { useEstadisticas } from '../../hooks/useEstadisticas';

const ArticulosMasVendidos: React.FC = () => {
  const { masVendidos, loading, error } = useEstadisticas();

  if (loading) return <div>Cargando artículos más vendidos...</div>;
  if (error) return <div>Error al cargar los artículos más vendidos.</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h6 className="card-title mb-3">Artículos más vendidos</h6>
        <div className="table-responsive">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>Artículo</th>
                <th>Cantidad vendida</th>
              </tr>
            </thead>
            <tbody>
              {masVendidos.length === 0 ? (
                <tr><td colSpan={2} className="text-center text-muted">Sin datos</td></tr>
              ) : (
                masVendidos.map((art, i) => (
                  <tr key={art.id || i}>
                    <td>{art.nombre}</td>
                    <td>{art.cantidad}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ArticulosMasVendidos;
