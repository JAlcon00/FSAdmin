import React from 'react';
import LoaderPorcentaje from '../../LoaderPorcentaje/LoaderPorcentaje';

interface ModalEliminarCategoriaProps {
  show: boolean;
  nombre: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  porcentaje?: number;
}

export const ModalEliminarCategoria: React.FC<ModalEliminarCategoriaProps> = ({ show, nombre, onConfirm, onCancel, loading = false, porcentaje = 0 }) => {
  if (!show) return null;
  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">Eliminar Categoría</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onCancel} disabled={loading}></button>
          </div>
          <div className="modal-body">
            <p>¿Estás seguro de que deseas eliminar la categoría <strong>{nombre}</strong>?</p>
            {loading && <LoaderPorcentaje porcentaje={porcentaje} texto="Eliminando categoría..." />}
          </div>
          <div className="modal-footer">
            {!loading ? (
              <>
                <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
                <button className="btn btn-danger" onClick={onConfirm}>Eliminar</button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
