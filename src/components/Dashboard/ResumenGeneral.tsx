import React from 'react';
import { useVentas } from '../../hooks/useVentas';
import { usePedidos } from '../../hooks/usePedidos';
import { useClientes } from '../../hooks/useClientes';
import { useArticulos } from '../../hooks/useArticulos';

const ResumenGeneral: React.FC = () => {
  const { ventas, loading: loadingVentas, error: errorVentas } = useVentas();
  const { pedidos, loading: loadingPedidos, error: errorPedidos } = usePedidos();
  const { clientes, loading: loadingClientes, error: errorClientes } = useClientes();
  const { articulos, loading: loadingArticulos, error: errorArticulos } = useArticulos();

  const loading = loadingVentas || loadingPedidos || loadingClientes || loadingArticulos;
  const error = errorVentas || errorPedidos || errorClientes || errorArticulos;

  // Calcular el total de ventas sumando el campo total de cada venta
  const totalVentas = ventas.reduce((acc, v) => acc + (typeof v.total === 'number' ? v.total : 0), 0);

  return (
    <div className="row mb-4">
      {loading ? (
        <div className="col-12 text-center py-5"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div></div>
      ) : error ? (
        <div className="col-12 alert alert-danger">{error}</div>
      ) : (
        <>
          <div className="col-md-3 mb-3">
            <div className="card shadow-sm text-center p-3">
              <h5 className="mb-1">Ventas</h5>
              <span className="fw-bold display-6">{totalVentas.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card shadow-sm text-center p-3">
              <h5 className="mb-1">Pedidos</h5>
              <span className="fw-bold display-6">{pedidos.length}</span>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card shadow-sm text-center p-3">
              <h5 className="mb-1">Clientes</h5>
              <span className="fw-bold display-6">{clientes.length}</span>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card shadow-sm text-center p-3">
              <h5 className="mb-1">Artículos</h5>
              <span className="fw-bold display-6">{articulos.length}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ResumenGeneral;
