import React from 'react';

interface ModalConfirmarVentaProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ModalConfirmarVenta: React.FC<ModalConfirmarVentaProps> = ({ show, onConfirm, onCancel, loading = false }) => {
  if (!show) return null;
  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">Confirmar venta</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onCancel} disabled={loading}></button>
          </div>
          <div className="modal-body">
            <p>¿Estás seguro de que deseas registrar esta venta?</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancelar</button>
            <button className="btn btn-success" onClick={onConfirm} disabled={loading}>
              {loading ? 'Procesando...' : 'Sí, registrar venta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmarVenta;
