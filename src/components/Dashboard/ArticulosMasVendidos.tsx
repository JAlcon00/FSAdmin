import React from 'react';
import { useEstadisticas } from '../../hooks/useEstadisticas';
import { useVentas } from '../../hooks/useVentas';
import { usePedidos } from '../../hooks/usePedidos';
import { useArticulos } from '../../hooks/useArticulos';

const ArticulosMasVendidos: React.FC = () => {
  const { masVendidos: masVendidosBackend, loading: loadingEstadisticas, error: errorEstadisticas } = useEstadisticas();
  const { todasVentas, loading: loadingVentas, error: errorVentas } = useVentas();
  const { pedidos, loading: loadingPedidos, error: errorPedidos } = usePedidos();
  const { articulos, loading: loadingArticulos, error: errorArticulos } = useArticulos();

  const loading = loadingEstadisticas || loadingVentas || loadingPedidos || loadingArticulos;
  const error = errorEstadisticas || errorVentas || errorPedidos || errorArticulos;

  // Calcular artículos más vendidos basándose en ventas y pedidos
  const calcularArticulosMasVendidos = () => {
    if (!todasVentas.length || !pedidos.length || !articulos.length) {
      return masVendidosBackend; // Fallback al backend si no hay datos
    }

    // Crear un mapa de conteo de artículos
    const conteoArticulos: { [articuloId: string]: number } = {};

    // Iterar sobre todas las ventas
    todasVentas.forEach(venta => {
      if (venta.pedidoId) {
        // Encontrar el pedido correspondiente
        const pedido = pedidos.find(p => p._id === venta.pedidoId);
        if (pedido && pedido.detalles) {
          // Sumar las cantidades de cada artículo en el pedido
          pedido.detalles.forEach(detalle => {
            const articuloId = detalle.articulo;
            conteoArticulos[articuloId] = (conteoArticulos[articuloId] || 0) + detalle.cantidad;
          });
        }
      }
    });

    // Convertir a array y ordenar por cantidad vendida
    const articulosOrdenados = Object.entries(conteoArticulos)
      .map(([articuloId, cantidad]) => {
        const articulo = articulos.find(a => a._id === articuloId);
        return {
          _id: articuloId,
          nombre: articulo ? articulo.nombre : `Artículo ${articuloId}`,
          cantidad
        };
      })
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5); // Top 5

    return articulosOrdenados.length > 0 ? articulosOrdenados : masVendidosBackend;
  };

  const masVendidos = calcularArticulosMasVendidos();

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
