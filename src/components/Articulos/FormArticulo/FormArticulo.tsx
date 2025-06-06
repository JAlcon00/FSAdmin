import React, { useState } from 'react';
import type { Articulo } from '../../../services/articulosService';
import { useCategorias } from '../../../hooks/useCategorias';
import LoaderPorcentaje from '../../LoaderPorcentaje/LoaderPorcentaje';

interface FormArticuloProps {
  initialData?: Partial<Articulo>;
  onSubmit: (data: Partial<Articulo>) => void;
  onCancel?: () => void;
  loading?: boolean;
  porcentaje?: number;
}

const FormArticulo: React.FC<FormArticuloProps> = ({ initialData = {}, onSubmit, onCancel, loading = false, porcentaje = 0 }) => {
  const { categorias, loading: loadingCategorias, error: errorCategorias } = useCategorias();

  const [form, setForm] = useState<Partial<Articulo>>({
    nombre: initialData.nombre || '',
    descripcion: initialData.descripcion || '',
    precio: initialData.precio || 0,
    stock: initialData.stock || 0,
    categoria: initialData.categoria || '',
    imagenUrl: initialData.imagenUrl || '',
    activo: initialData.activo ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    }
    setForm(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Transformar y limpiar datos antes de enviar
    const data: Partial<Articulo> = {
      ...form,
      precio: Number(form.precio),
      stock: Number(form.stock),
      categoria: form.categoria ? String(form.categoria) : undefined,
      activo: !!form.activo,
      imagenUrl: form.imagenUrl && form.imagenUrl.trim() !== '' ? form.imagenUrl.trim() : undefined,
    };
    // Eliminar campos vacíos
    Object.keys(data).forEach(key => {
      if (data[key as keyof Articulo] === '' || data[key as keyof Articulo] === undefined) {
        delete data[key as keyof Articulo];
      }
    });
    // Validar URL de imagen si existe
    if (data.imagenUrl && !/^https?:\/\/.+\..+/.test(data.imagenUrl)) {
      alert('La URL de la imagen no es válida.');
      return;
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input type="text" className="form-control" name="nombre" value={form.nombre as string} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea className="form-control" name="descripcion" value={form.descripcion as string} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Precio</label>
        <input type="number" className="form-control" name="precio" value={form.precio as number} onChange={handleChange} min={0} step={0.01} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Stock</label>
        <input type="number" className="form-control" name="stock" value={form.stock as number} onChange={handleChange} min={0} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Categoría</label>
        <select
          className="form-select"
          name="categoria"
          value={form.categoria as string}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona una categoría</option>
          {loadingCategorias ? (
            <option disabled>Cargando...</option>
          ) : errorCategorias ? (
            <option disabled>Error al cargar categorías</option>
          ) : (
            categorias.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.nombre}</option>
            ))
          )}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Imagen (URL)</label>
        <input type="url" className="form-control" name="imagenUrl" value={form.imagenUrl as string} onChange={handleChange} placeholder="https://..." />
      </div>
      <div className="form-check mb-3">
        <input className="form-check-input" type="checkbox" name="activo" checked={!!form.activo} onChange={handleChange} id="activoCheck" />
        <label className="form-check-label" htmlFor="activoCheck">Activo</label>
      </div>
      <div className="d-flex gap-2">
        {!loading ? (
          <>
            <button type="submit" className="btn btn-success">Guardar</button>
            {onCancel && <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>}
          </>
        ) : (
          <LoaderPorcentaje porcentaje={porcentaje} texto={initialData && initialData._id ? 'Actualizando artículo...' : 'Creando artículo...'} />
        )}
      </div>
    </form>
  );
};

export default FormArticulo;
