import React from 'react';
import { useVentasUltimos7Dias } from '../../hooks/useVentasUltimos7Dias';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const GraficaVentasUltimos7Dias: React.FC = () => {
  const { ventasUltimos7Dias, loading, error } = useVentasUltimos7Dias();

  if (loading) return <div>Cargando gráfica de ventas...</div>;
  if (error) return <div>Error al cargar la gráfica de ventas.</div>;

  // ventasUltimos7Dias: [{ fecha: '2025-06-01', total: 1234 }, ...]
  const data = ventasUltimos7Dias.map(v => ({
    fecha: v.fecha ? new Date(v.fecha).toLocaleDateString('es-MX', { weekday: 'short', day: '2-digit', month: 'short' }) : '',
    total: v.total
  }));

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <h6 className="card-title mb-3">Ventas últimos 7 días</h6>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip formatter={v => `$${v}`} />
            <Bar dataKey="total" fill="#0d6efd" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficaVentasUltimos7Dias;
