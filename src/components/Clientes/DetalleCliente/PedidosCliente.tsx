import React from 'react';
import { usePedidos } from '../../../hooks/usePedidos';
import type { Pedido } from '../../../services/pedidosService';

interface PedidosClienteProps {
  clienteId: string;
}

const PedidosCliente: React.FC<PedidosClienteProps> = ({ clienteId }) => {
  const { pedidos, loading, error } = usePedidos();
  const pedidosCliente = pedidos.filter((p: Pedido) => p.usuario === clienteId);

  if (loading) return <div className="text-center my-3"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (pedidosCliente.length === 0) return <div className="text-muted">Este cliente no tiene pedidos registrados.</div>;

  return (
    <div className="table-responsive">
      <table className="table table-sm table-hover align-middle">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Artículos</th>
          </tr>
        </thead>
        <tbody>
          {pedidosCliente.map(pedido => (
            <tr key={pedido._id}>
              <td>{new Date(pedido.fechaCreacion).toLocaleDateString()}</td>
              <td>${pedido.total.toFixed(2)}</td>
              <td>{pedido.estado}</td>
              <td>{pedido.articulos.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PedidosCliente;
