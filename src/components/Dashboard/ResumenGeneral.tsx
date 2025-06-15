import React from 'react';
import { useEstadisticas } from '../../hooks/useEstadisticas';
import { usePedidos } from '../../hooks/usePedidos';
import { useClientes } from '../../hooks/useClientes';
import { useArticulos } from '../../hooks/useArticulos';
import { useVentas } from '../../hooks/useVentas';

const ResumenGeneral: React.FC = () => {
  const { loading: loadingEstadisticas, error: errorEstadisticas } = useEstadisticas();
  const { pedidos, loading: loadingPedidos, error: errorPedidos } = usePedidos();
  const { clientes, loading: loadingClientes, error: errorClientes } = useClientes();
  const { articulos, loading: loadingArticulos, error: errorArticulos } = useArticulos();
  const { todasVentas, loading: loadingVentas, error: errorVentas } = useVentas();

  const loading = loadingEstadisticas || loadingPedidos || loadingClientes || loadingArticulos || loadingVentas;
  const error = errorEstadisticas || errorPedidos || errorClientes || errorArticulos || errorVentas;

  // Calcular ingresos totales usando todas las ventas individuales (incluye enviado y completado)
  const ingresosTotales = todasVentas.reduce((acc, v) => {
    const ventaTotal = typeof v.total === 'number' ? v.total : 0;
    return acc + ventaTotal;
  }, 0);

  return (
    <div className="row mb-4">
      {loading ? (
        <div className="col-12 text-center py-5"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div></div>
      ) : error ? (
        <div className="col-12 alert alert-danger">{error}</div>
      ) : (
        <>
          <div className="col-lg-2 col-md-4 mb-3">
            <div className="card shadow-sm text-center p-3 border-success">
              <h6 className="mb-1 text-success">Ingresos (Resumen)</h6>
              <span className="fw-bold h5">{ingresosTotales.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 mb-3">
            <div className="card shadow-sm text-center p-3 border-warning">
              <h6 className="mb-1 text-warning">Pedidos</h6>
              <span className="fw-bold h5">{pedidos.length}</span>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 mb-3">
            <div className="card shadow-sm text-center p-3 border-secondary">
              <h6 className="mb-1 text-secondary">Clientes</h6>
              <span className="fw-bold h5">{clientes.length}</span>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 mb-3">
            <div className="card shadow-sm text-center p-3 border-dark">
              <h6 className="mb-1 text-dark">Artículos</h6>
              <span className="fw-bold h5">{articulos.length}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ResumenGeneral;
