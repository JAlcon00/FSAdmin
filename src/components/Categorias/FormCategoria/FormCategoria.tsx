import React from 'react';
import type { Categoria } from '../../../services/categoriasService';
import LoaderPorcentaje from '../../LoaderPorcentaje/LoaderPorcentaje';

interface FormCategoriaProps {
  initialData: Partial<Categoria>;
  onSubmit: (data: Partial<Categoria>) => void;
  onCancel: () => void;
  loading?: boolean;
  porcentaje?: number;
}

export const FormCategoria: React.FC<FormCategoriaProps> = ({ initialData, onSubmit, onCancel, loading = false, porcentaje = 0 }) => {
  const [nombre, setNombre] = React.useState(initialData.nombre || '');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    onSubmit({ nombre });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input
          type="text"
          className="form-control"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
      </div>
      {error && <div className="alert alert-danger py-1">{error}</div>}
      <div className="d-flex justify-content-end gap-2">
        {!loading ? (
          <>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar</button>
          </>
        ) : (
          <LoaderPorcentaje porcentaje={porcentaje} texto={initialData && initialData._id ? 'Actualizando categoría...' : 'Creando categoría...'} />
        )}
      </div>
    </form>
  );
};
