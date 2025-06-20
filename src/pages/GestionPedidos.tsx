import React from 'react';
import FormPedido from '../components/Pedidos/FormPedido';
import FormPedidoPrueba from '../components/Pedidos/FormPedidoPrueba';
import TablaPedidos from '../components/Pedidos/TablaPedidos';
import { usePedidos } from '../hooks/usePedidos';
import { useVentas } from '../hooks/useVentas';

const GestionPedidos: React.FC = () => {
  const { pedidos, loading, error, refetch: refetchPedidos } = usePedidos();
  const { todasVentas, loading: loadingVentas, error: errorVentas, refetch: refetchVentas } = useVentas();

  // Solo ventas de pedidos confirmados (incluye enviado como equivalente a completado)
  const pedidosConfirmados = pedidos.filter(p => p.estado === 'confirmado' || p.estado === 'completado' || p.estado === 'enviado');
  
  // Calcular ingresos usando todas las ventas registradas (aplicar multiplicación por 100 para consistencia con dashboard)
  const ingresosTotales = todasVentas.reduce((acc, v) => {
    const ventaTotal = typeof v.total === 'number' ? v.total * 100 : 0; // Multiplicar por 100 para consistencia
    return acc + ventaTotal;
  }, 0) / 100; // Dividir entre 100 al final para mostrar en formato decimal
  
  // Para el número de ventas individuales, usar el conteo de todas las ventas
  const ventasRealizadas = todasVentas.length;

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
                {mostrandoCarga ? '...' : `$${ingresosTotales.toFixed(2)}`}
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
                  <span className="fw-bold text-success">{mostrandoCarga ? '...' : `$${ingresosTotales.toFixed(2)}`}</span>
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
