import React from 'react';

interface FiltroClientesProps {
  value: string;
  onChange: (valor: string) => void;
}

const FiltroClientes: React.FC<FiltroClientesProps> = ({ value, onChange }) => (
  <div className="mb-3">
    <input
      type="text"
      className="form-control"
      placeholder="Buscar cliente por nombre o email..."
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default FiltroClientes;
