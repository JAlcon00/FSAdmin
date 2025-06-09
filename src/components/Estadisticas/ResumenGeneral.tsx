import React from 'react';
import { useVentas } from '../../hooks/useVentas';
import { usePedidos } from '../../hooks/usePedidos';

const ResumenGeneral: React.FC = () => {
  const { resumen, loading: loadingVentas, error: errorVentas } = useVentas();
  const { pedidos, loading: loadingPedidos, error: errorPedidos } = usePedidos();

  if (loadingVentas || loadingPedidos) return <div>Cargando resumen...</div>;
  if (errorVentas || errorPedidos) return <div>Error al cargar el resumen.</div>;

  const totalPedidos = pedidos.length;
  const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente').length;
  const pedidosCompletados = pedidos.filter(p => p.estado === 'completado').length;
  const pedidosEnviados = pedidos.filter(p => p.estado === 'enviado').length;
  const totalIngresos = resumen?.totalVentas ?? 0;

  return (
    <div className="row g-3">
      <div className="col-md-3">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h6 className="card-title text-muted">Ingresos totales</h6>
            <h3 className="fw-bold text-success">{totalIngresos.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</h3>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h6 className="card-title text-muted">Pedidos totales</h6>
            <h3 className="fw-bold">{totalPedidos}</h3>
          </div>
        </div>
      </div>
      <div className="col-md-2">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h6 className="card-title text-muted">Pendientes</h6>
            <h3 className="fw-bold text-warning">{pedidosPendientes}</h3>
          </div>
        </div>
      </div>
      <div className="col-md-2">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h6 className="card-title text-muted">Completados</h6>
            <h3 className="fw-bold text-primary">{pedidosCompletados}</h3>
          </div>
        </div>
      </div>
      <div className="col-md-2">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h6 className="card-title text-muted">Enviados</h6>
            <h3 className="fw-bold text-info">{pedidosEnviados}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumenGeneral;
