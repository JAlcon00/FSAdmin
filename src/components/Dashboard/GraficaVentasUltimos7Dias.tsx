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

  // Generar los últimos 7 días (incluyendo hoy)
  const generateLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split('T')[0], // YYYY-MM-DD
        displayDate: date.toLocaleDateString('es-ES', { 
          day: '2-digit', 
          month: '2-digit' 
        }) // DD/MM
      });
    }
    return days;
  };

  const last7Days = generateLast7Days();

  // Crear un mapa de ventas por fecha
  const ventasPorFecha = ventas.reduce((acc: any, venta: any) => {
    const fecha = venta.fecha || venta.date;
    if (fecha) {
      // Normalizar la fecha (solo la parte de fecha, sin hora)
      const fechaNormalizada = fecha.split('T')[0];
      acc[fechaNormalizada] = (acc[fechaNormalizada] || 0) + (venta.total || venta.amount || 0);
    }
    return acc;
  }, {});

  // Preparar los datos para la gráfica con todos los días
  const labels = last7Days.map(day => day.displayDate);
  const dataValues = last7Days.map(day => ventasPorFecha[day.date] || 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Ventas ($)',
        data: dataValues,
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#28a745',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
            weight: 'bold' as const
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#28a745',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `Ventas: $${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value: any) {
            return `$${value}`;
          },
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: '#28a745'
      }
    }
  };

  return (
    <div className="card shadow-sm p-3 h-100">
      <h5 className="mb-3 text-primary">
        <i className="bi bi-graph-up me-2"></i>
        Ventas últimos 7 días
      </h5>
      {isLoading ? (
        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-2" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <div className="text-muted">Cargando datos de ventas...</div>
          </div>
        </div>
      ) : error ? (
        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="text-center">
            <i className="bi bi-exclamation-triangle text-danger fs-1 mb-2"></i>
            <div className="text-danger">Error al cargar la gráfica</div>
          </div>
        </div>
      ) : (
        <div style={{ height: 300 }}>
          <Line data={data} options={options} />
          <div className="mt-3 text-center">
            <small className="text-muted">
              Total últimos 7 días: <strong>${dataValues.reduce((a, b) => a + b, 0).toFixed(2)}</strong>
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraficaVentasUltimos7Dias;
