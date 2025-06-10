import React from 'react';
import { useVentas } from '../../hooks/useVentas';
import { usePedidos } from '../../hooks/usePedidos';
import { useClientes } from '../../hooks/useClientes';
import { useArticulos } from '../../hooks/useArticulos';

const ResumenGeneral: React.FC = () => {
  const { ventas, todasVentas, loading: loadingVentas, error: errorVentas } = useVentas();
  const { pedidos, loading: loadingPedidos, error: errorPedidos } = usePedidos();
  const { clientes, loading: loadingClientes, error: errorClientes } = useClientes();
  const { articulos, loading: loadingArticulos, error: errorArticulos } = useArticulos();

  const loading = loadingVentas || loadingPedidos || loadingClientes || loadingArticulos;
  const error = errorVentas || errorPedidos || errorClientes || errorArticulos;

  // Calcular ingresos totales usando el resumen de ventas (amount en centavos)
  const ingresosTotales = ventas.reduce((acc, v) => {
    const ventaAmount = typeof v.amount === 'number' ? v.amount : 0;
    return acc + ventaAmount;
  }, 0);

  // Calcular sumatoria de ventas individuales (usando todasVentas, campo total en pesos)
  const sumaVentasIndividuales = todasVentas.reduce((acc, v) => {
    const ventaTotal = typeof v.total === 'number' ? v.total : 0;
    return acc + ventaTotal;
  }, 0);

  // NUEVO: Contar ventas individuales registradas
  const ventasIndividualesCount = todasVentas.length;

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
              <span className="fw-bold h5">{(ingresosTotales / 100).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-4 mb-3">
            <div className="card shadow-sm text-center p-3 border-primary">
              <h6 className="mb-1 text-primary">Ventas Registradas</h6>
              <span className="fw-bold h5">{ventasIndividualesCount}</span>
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
