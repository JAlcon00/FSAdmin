import React from 'react';
import { usePedidos } from '../../hooks/usePedidos';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#ffc107', '#0d6efd', '#0dcaf0', '#198754', '#dc3545'];
const ESTADOS = [
  { estado: 'pendiente', label: 'Pendiente' },
  { estado: 'confirmado', label: 'Confirmado' },
  { estado: 'completado', label: 'Completado' },
  { estado: 'enviado', label: 'Enviado' },
  { estado: 'cancelado', label: 'Cancelado' },
];

const GraficaPedidosPorEstado: React.FC = () => {
  const { pedidos, loading, error } = usePedidos();

  if (loading) return <div>Cargando gráfica de pedidos...</div>;
  if (error) return <div>Error al cargar la gráfica de pedidos.</div>;

  const data = ESTADOS.map(e => ({
    name: e.label,
    value: pedidos.filter(p => p.estado === e.estado).length
  })).filter(d => d.value > 0);

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <h6 className="card-title mb-3">Pedidos por estado</h6>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficaPedidosPorEstado;
