import React, { useState } from 'react';
import { TablaCategorias } from '../components/Categorias/TablaCategorias/TablaCategorias';
import { FormCategoria } from '../components/Categorias/FormCategoria/FormCategoria';
import { ModalEliminarCategoria } from '../components/Categorias/ModalEliminarCategoria/ModalEliminarCategoria';
import type { Categoria } from '../services/categoriasService';
import { crearCategoria, actualizarCategoria, eliminarCategoria } from '../services/categoriasService';
import { useCategorias } from '../hooks/useCategorias';

const GestionCategorias: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editCategoria, setEditCategoria] = useState<Categoria | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCategoria, setDeleteCategoria] = useState<Categoria | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletePorcentaje, setDeletePorcentaje] = useState(0);
  const [formLoading, setFormLoading] = useState(false);
  const [formPorcentaje, setFormPorcentaje] = useState(0);
  const { refetch } = useCategorias();

  const handleRefresh = () => refetch();

  const handleSubmit = async (data: Partial<Categoria>) => {
    setFormLoading(true);
    setFormPorcentaje(0);
    let porcentaje = 0;
    const interval = setInterval(() => {
      porcentaje += Math.floor(Math.random() * 15) + 10;
      if (porcentaje >= 90) porcentaje = 90;
      setFormPorcentaje(porcentaje);
    }, 120);
    try {
      if (editCategoria) {
        await actualizarCategoria(editCategoria._id, data);
      } else {
        await crearCategoria(data);
      }
      setFormPorcentaje(100);
      setTimeout(() => {
        setShowForm(false);
        setEditCategoria(null);
        setFormLoading(false);
        setFormPorcentaje(0);
        handleRefresh();
      }, 400);
    } catch (e) {
      setFormLoading(false);
      setFormPorcentaje(0);
    } finally {
      clearInterval(interval);
    }
  };

  const handleDelete = async () => {
    if (deleteCategoria) {
      setDeleteLoading(true);
      setDeletePorcentaje(0);
      let porcentaje = 0;
      const interval = setInterval(() => {
        porcentaje += Math.floor(Math.random() * 15) + 10;
        if (porcentaje >= 90) porcentaje = 90;
        setDeletePorcentaje(porcentaje);
      }, 120);
      try {
        await eliminarCategoria(deleteCategoria._id);
        setDeletePorcentaje(100);
        setTimeout(() => {
          setShowDeleteModal(false);
          setDeleteCategoria(null);
          setDeleteLoading(false);
          setDeletePorcentaje(0);
          handleRefresh();
        }, 400);
      } catch (e) {
        setDeleteLoading(false);
        setDeletePorcentaje(0);
      } finally {
        clearInterval(interval);
      }
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 className="mb-0">Gestión de Categorías</h2>
        <button className="btn btn-primary ms-2" title="Agregar Categoría" onClick={() => { setShowForm(true); setEditCategoria(null); }}>
          <i className="bi bi-plus-lg"></i>
        </button>
      </div>
      <TablaCategorias
        onEdit={categoria => { setEditCategoria(categoria); setShowForm(true); }}
        onDelete={categoria => { setDeleteCategoria(categoria); setShowDeleteModal(true); }}
      />
      {showForm && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">{editCategoria ? 'Editar Categoría' : 'Agregar Categoría'}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => { setShowForm(false); setEditCategoria(null); }}></button>
              </div>
              <div className="modal-body">
                <FormCategoria initialData={editCategoria || {}} onSubmit={handleSubmit} onCancel={() => { setShowForm(false); setEditCategoria(null); }} loading={formLoading} porcentaje={formPorcentaje} />
              </div>
            </div>
          </div>
        </div>
      )}
      <ModalEliminarCategoria
        show={showDeleteModal}
        nombre={deleteCategoria?.nombre || ''}
        onConfirm={handleDelete}
        onCancel={() => { setShowDeleteModal(false); setDeleteCategoria(null); setDeleteLoading(false); setDeletePorcentaje(0); }}
        loading={deleteLoading}
        porcentaje={deletePorcentaje}
      />
    </div>
  );
};

export default GestionCategorias;
