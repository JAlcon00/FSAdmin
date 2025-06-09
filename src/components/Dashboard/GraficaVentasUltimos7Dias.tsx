import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVentasUltimos7Dias } from '../../services/ventasService';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraficaVentasUltimos7Dias: React.FC = () => {
  const { data: ventas = [], isLoading, error } = useQuery({
    queryKey: ['ventasUltimos7Dias'],
    queryFn: getVentasUltimos7Dias
  });

  const labels = ventas.map((v: any) => v.fecha || v.date);
  const data = {
    labels,
    datasets: [
      {
        label: 'Ventas ($)',
        data: ventas.map((v: any) => v.total || v.amount),
        borderColor: '#007bff',
        backgroundColor: 'rgba(0,123,255,0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="card shadow-sm p-3 h-100">
      <h5 className="mb-3">Ventas últimos 7 días</h5>
      {isLoading ? (
        <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="text-muted">Cargando...</span>
        </div>
      ) : error ? (
        <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="text-danger">Error al cargar la gráfica</span>
        </div>
      ) : (
        <Line data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} height={250} />
      )}
    </div>
  );
};

export default GraficaVentasUltimos7Dias;
