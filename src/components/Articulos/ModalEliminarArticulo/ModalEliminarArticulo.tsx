import React from 'react';
import LoaderPorcentaje from '../../LoaderPorcentaje/LoaderPorcentaje';

interface ModalEliminarArticuloProps {
  nombre: string;
  onConfirm: () => void;
  onCancel: () => void;
  show: boolean;
  loading?: boolean;
  porcentaje?: number;
}

const ModalEliminarArticulo: React.FC<ModalEliminarArticuloProps> = ({ nombre, onConfirm, onCancel, show, loading = false, porcentaje = 0 }) => {
  if (!show) return null;
  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">Eliminar artículo</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onCancel} disabled={loading}></button>
          </div>
          <div className="modal-body">
            <p>¿Estás seguro de que deseas eliminar el artículo <strong>{nombre}</strong>?</p>
            {loading && <LoaderPorcentaje porcentaje={porcentaje} texto="Eliminando artículo..." />}
          </div>
          <div className="modal-footer">
            {!loading ? (
              <>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
                <button type="button" className="btn btn-danger" onClick={onConfirm}>Eliminar</button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarArticulo;
