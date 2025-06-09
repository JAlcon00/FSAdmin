import React from 'react';
import { usePedidos } from '../../hooks/usePedidos';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const GraficaPedidosPorEstado: React.FC = () => {
  const { pedidos, loading, error } = usePedidos();
  const estados = Array.from(new Set(pedidos.map(p => p.estado)));
  const data = {
    labels: estados,
    datasets: [
      {
        label: 'Pedidos',
        data: estados.map(e => pedidos.filter(p => p.estado === e).length),
        backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6c757d'],
      },
    ],
  };

  return (
    <div className="card shadow-sm p-3 h-100">
      <h5 className="mb-3">Pedidos por estado</h5>
      {loading ? (
        <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="text-muted">Cargando...</span>
        </div>
      ) : error ? (
        <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="text-danger">Error al cargar la gráfica</span>
        </div>
      ) : (
        <Pie data={data} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} height={250} />
      )}
    </div>
  );
};

export default GraficaPedidosPorEstado;
