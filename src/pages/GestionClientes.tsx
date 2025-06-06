import React, { useState } from 'react';
import ListaClientes from '../components/Clientes/ListaClientes/ListaClientes';
import DetalleCliente from '../components/Clientes/DetalleCliente/DetalleCliente';
import FiltroClientes from '../components/Clientes/FiltroClientes/FiltroClientes';
import { useClientes } from '../hooks/useClientes';
import type { Cliente } from '../services/clientesService';

const GestionClientes: React.FC = () => {
  const { clientes, loading, error } = useClientes();
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [filtro, setFiltro] = useState('');

  const clientesFiltrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    c.email.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 className="mb-0">Gestión de Clientes</h2>
      </div>
      <FiltroClientes value={filtro} onChange={setFiltro} />
      <div className="row g-3">
        <div className="col-12 col-lg-5">
          <ListaClientes
            clientes={clientesFiltrados}
            loading={loading}
            error={error}
            onSelect={setClienteSeleccionado}
            seleccionado={clienteSeleccionado?._id}
          />
        </div>
        <div className="col-12 col-lg-7">
          {clienteSeleccionado && (
            <DetalleCliente cliente={clienteSeleccionado} onClose={() => setClienteSeleccionado(null)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionClientes;
