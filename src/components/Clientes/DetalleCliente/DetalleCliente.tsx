import React, { useState } from 'react';
import type { Cliente } from '../../../services/clientesService';
import PedidosCliente from '../DetalleCliente/PedidosCliente';
import VentasCliente from '../DetalleCliente/VentasCliente';

interface DetalleClienteProps {
  cliente: Cliente;
  onClose: () => void;
}

const DetalleCliente: React.FC<DetalleClienteProps> = ({ cliente, onClose }) => {
  const [tab, setTab] = useState<'info' | 'pedidos' | 'ventas'>('info');

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
        <span>Cliente: {cliente.nombre}</span>
        <button className="btn-close btn-close-white" onClick={onClose}></button>
      </div>
      <div className="card-body">
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button className={`nav-link${tab === 'info' ? ' active' : ''}`} onClick={() => setTab('info')}>Info</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link${tab === 'pedidos' ? ' active' : ''}`} onClick={() => setTab('pedidos')}>Pedidos</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link${tab === 'ventas' ? ' active' : ''}`} onClick={() => setTab('ventas')}>Ventas</button>
          </li>
        </ul>
        {tab === 'info' && (
          <div>
            <div><strong>Email:</strong> {cliente.email}</div>
            {cliente.telefono && <div><strong>Teléfono:</strong> {cliente.telefono}</div>}
            {cliente.direccion && <div><strong>Dirección:</strong> {cliente.direccion}</div>}
          </div>
        )}
        {tab === 'pedidos' && <PedidosCliente clienteId={cliente._id} />}
        {tab === 'ventas' && <VentasCliente clienteId={cliente._id} />}
      </div>
    </div>
  );
};

export default DetalleCliente;
