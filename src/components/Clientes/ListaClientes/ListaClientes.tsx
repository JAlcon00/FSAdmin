import React from 'react';
import type { Cliente } from '../../../services/clientesService';

interface ListaClientesProps {
  clientes: Cliente[];
  loading: boolean;
  error: string | null;
  onSelect: (cliente: Cliente) => void;
  seleccionado?: string;
}

const ListaClientes: React.FC<ListaClientesProps> = ({ clientes, loading, error, onSelect, seleccionado }) => {
  if (loading) return <div className="text-center my-5"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (clientes.length === 0) return <div className="text-muted text-center">No hay clientes para mostrar.</div>;

  return (
    <div className="list-group shadow-sm">
      {clientes.map(cliente => (
        <button
          key={cliente._id}
          className={`list-group-item list-group-item-action${seleccionado === cliente._id ? ' active' : ''}`}
          onClick={() => onSelect(cliente)}
        >
          <div className="fw-bold">{cliente.nombre}</div>
          <div className="small text-muted">{cliente.email}</div>
        </button>
      ))}
    </div>
  );
};

export default ListaClientes;
