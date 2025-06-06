import React from 'react';
import { useVentas } from '../../../hooks/useVentas';

interface VentasClienteProps {
  clienteId: string;
}

const VentasCliente: React.FC<VentasClienteProps> = ({ clienteId }) => {
  const { ventas, loading, error } = useVentas();
  // Suponiendo que cada venta tiene un campo clienteId o usuario
  const ventasCliente = ventas.filter((v: any) => v.usuario === clienteId || v.clienteId === clienteId);

  if (loading) return <div className="text-center my-3"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (ventasCliente.length === 0) return <div className="text-muted">Este cliente no tiene ventas registradas.</div>;

  return (
    <div className="table-responsive">
      <table className="table table-sm table-hover align-middle">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {ventasCliente.map((venta: any, idx: number) => (
            <tr key={venta._id || idx}>
              <td>{new Date(venta.fecha).toLocaleDateString()}</td>
              <td>${venta.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VentasCliente;
