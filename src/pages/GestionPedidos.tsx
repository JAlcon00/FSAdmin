import React from 'react';
import FormPedido from '../components/Pedidos/FormPedido';
import FormPedidoPrueba from '../components/Pedidos/FormPedidoPrueba';
import TablaPedidos from '../components/Pedidos/TablaPedidos';
import { usePedidos } from '../hooks/usePedidos';
import { useVentas } from '../hooks/useVentas';

const GestionPedidos: React.FC = () => {
  const { pedidos, loading, error, refetch: refetchPedidos } = usePedidos();
  const { ventas, todasVentas, loading: loadingVentas, error: errorVentas, refetch: refetchVentas } = useVentas();

  // Solo ventas de pedidos confirmados
  const pedidosConfirmados = pedidos.filter(p => p.estado === 'confirmado' || p.estado === 'completado');
  
  // Calcular ingresos usando la propiedad 'amount' en lugar de 'total'
  const ingresosTotales = ventas.reduce((acc, v) => {
    const ventaAmount = typeof v.amount === 'number' ? v.amount : 0;
    return acc + ventaAmount;
  }, 0);
  
  // Para el número de ventas individuales, sumar los 'count' de cada registro
  const numeroTransacciones = ventas.reduce((acc, v) => {
    const ventaCount = typeof v.count === 'number' ? v.count : 0;
    return acc + ventaCount;
  }, 0);
  
  // Usar el número real de ventas
  const ventasRealizadas = numeroTransacciones; // Usar la suma de transacciones individuales

  // Manejar el estado de carga
  const mostrandoCarga = loading || loadingVentas;

  return (
    <div className="container-fluid">
      <h2 className="mb-4">Gestión de Pedidos</h2>
      
      {/* Papel contador de pedidos y ventas */}
      <div className="row mb-4 g-3">
        <div className="col-12 col-md-4 col-lg-3">
          <div className="card shadow-sm border-primary">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <span className="fw-bold text-primary" style={{ fontSize: '2.2rem' }}>
                {loading ? '...' : pedidos.length}
              </span>
              <span className="text-secondary">Pedidos registrados</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 col-lg-3">
          <div className="card shadow-sm border-success">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <span className="fw-bold text-success" style={{ fontSize: '2.2rem' }}>
                {mostrandoCarga ? '...' : ventasRealizadas}
              </span>
              <span className="text-secondary">Ventas realizadas</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 col-lg-3">
          <div className="card shadow-sm border-info">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <span className="fw-bold text-info" style={{ fontSize: '2.2rem' }}>
                {mostrandoCarga ? '...' : `$${(ingresosTotales / 100).toFixed(2)}`}
              </span>
              <span className="text-secondary">Ingresos totales</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Estado de resultados */}
      <div className="row mb-4">
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-3 text-primary">Estado de Resultados</h5>
              {errorVentas && <div className="alert alert-danger">Error cargando resumen de ventas: {errorVentas}</div>}
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Pedidos confirmados
                  <span className="fw-bold">{pedidosConfirmados.length}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Ventas realizadas
                  <span className="fw-bold">{mostrandoCarga ? '...' : ventasRealizadas}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Ingresos totales
                  <span className="fw-bold text-success">{mostrandoCarga ? '...' : `$${(ingresosTotales / 100).toFixed(2)}`}</span>
                </li>
                
              </ul>
            </div>
          </div>
        </div>
      </div>
      <FormPedidoPrueba refetchPedidos={refetchPedidos} />
      <FormPedido />
      <TablaPedidos 
        pedidos={pedidos} 
        ventas={ventas} 
        todasVentas={todasVentas} 
        loading={loading} 
        error={error} 
        refetchPedidos={refetchPedidos} 
        refetchVentas={refetchVentas} 
        onVentaRegistrada={refetchVentas} // NUEVO: fuerza el refetch global
      />
    </div>
  );
};

export default GestionPedidos;
