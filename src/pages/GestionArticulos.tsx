import React, { useState } from 'react';
import TablaArticulos from '../components/Articulos/TablaArticulos/TablaArticulos';
import FormArticulo from '../components/Articulos/FormArticulo/FormArticulo';
import ModalEliminarArticulo from '../components/Articulos/ModalEliminarArticulo/ModalEliminarArticulo';
import CardArticulo from '../components/Articulos/CardArticulo/CardArticulo';
import { useArticulos } from '../hooks/useArticulos';
import type { Articulo } from '../services/articulosService';
import { crearArticulo, actualizarArticulo, eliminarArticulo } from '../services/articulosService';

const GestionArticulos: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editArticulo, setEditArticulo] = useState<Articulo | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteArticulo, setDeleteArticulo] = useState<Articulo | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletePorcentaje, setDeletePorcentaje] = useState(0);
  const [formLoading, setFormLoading] = useState(false);
  const [formPorcentaje, setFormPorcentaje] = useState(0);
  const [fade, setFade] = useState<'in' | 'out'>('in');
  const { articulos = [], loading, error, refetch } = useArticulos();

  // Para refrescar la tabla tras crear/editar/eliminar
  const handleRefresh = () => refetch();

  // Crear o editar artículo
  const handleSubmit = async (data: Partial<Articulo>) => {
    setFormLoading(true);
    setFormPorcentaje(0);
    // Simulación de avance de porcentaje
    let porcentaje = 0;
    const interval = setInterval(() => {
      porcentaje += Math.floor(Math.random() * 15) + 10; // avance aleatorio
      if (porcentaje >= 90) porcentaje = 90;
      setFormPorcentaje(porcentaje);
    }, 120);
    try {
      const payload: any = { ...data };
      if (data.imagenUrl) {
        payload.imagenes = [data.imagenUrl];
        delete payload.imagenUrl;
      }
      if (editArticulo) {
        await actualizarArticulo(editArticulo._id, payload);
      } else {
        await crearArticulo(payload);
      }
      setFormPorcentaje(100);
      setTimeout(() => {
        setShowForm(false);
        setEditArticulo(null);
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

  // Eliminar artículo
  const handleDelete = async () => {
    if (deleteArticulo) {
      setDeleteLoading(true);
      setDeletePorcentaje(0);
      // Simulación de avance de porcentaje
      let porcentaje = 0;
      const interval = setInterval(() => {
        porcentaje += Math.floor(Math.random() * 15) + 10; // avance aleatorio
        if (porcentaje >= 90) porcentaje = 90;
        setDeletePorcentaje(porcentaje);
      }, 120);
      try {
        await eliminarArticulo(deleteArticulo._id);
        setDeletePorcentaje(100);
        setTimeout(() => {
          setShowDeleteModal(false);
          setDeleteArticulo(null);
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

  // Animación al cambiar de vista
  const handleViewChange = (mode: 'list' | 'cards') => {
    if (viewMode === mode) return;
    setFade('out');
    setTimeout(() => {
      setViewMode(mode);
      setFade('in');
    }, 250); // Duración del fade-out
  };

  // Render
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 className="mb-0">Gestión de Artículos</h2>
        <div className="d-flex align-items-center gap-2">
          <button className={`btn btn-outline-secondary${viewMode === 'list' ? ' active' : ''}`} title="Vista de lista" onClick={() => handleViewChange('list')}>
            <i className="bi bi-list"></i>
          </button>
          <button className={`btn btn-outline-secondary${viewMode === 'cards' ? ' active' : ''}`} title="Vista de tarjetas" onClick={() => handleViewChange('cards')}>
            <i className="bi bi-grid-3x3-gap"></i>
          </button>
          <button className="btn btn-primary ms-2" title="Agregar Artículo" onClick={() => { setShowForm(true); setEditArticulo(null); }}>
            <i className="bi bi-plus-lg"></i>
          </button>
        </div>
      </div>
      {/* Vista dinámica con animación */}
      <div className={`fade-view fade-${fade}`}>
        {viewMode === 'list' ? (
          <TablaArticulos
            onEdit={articulo => { setEditArticulo(articulo); setShowForm(true); }}
            onDelete={articulo => { setDeleteArticulo(articulo); setShowDeleteModal(true); }}
            iconMode
          />
        ) : (
          <div className="row g-3">
            {loading ? (
              <div className="col-12 text-center my-5"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div></div>
            ) : error ? (
              <div className="col-12 alert alert-danger">{error}</div>
            ) : (articulos as any[]).length === 0 ? (
              <div className="col-12 text-center text-muted">No hay artículos para mostrar.</div>
            ) : (
              (articulos as Articulo[]).map((articulo: Articulo) => (
                <CardArticulo
                  key={articulo._id}
                  articulo={articulo}
                  onEdit={currentArticulo => { setEditArticulo(currentArticulo); setShowForm(true); }}
                  onDelete={(idToDelete: string) => {
                    const articuloFound = (articulos as Articulo[]).find(art => art._id === idToDelete);
                    if (articuloFound) {
                      setDeleteArticulo(articuloFound);
                      setShowDeleteModal(true);
                    } else {
                      console.warn(`Artículo con ID ${idToDelete} no encontrado para eliminar.`);
                    }
                  }}
                />
              ))
            )}
          </div>
        )}
      </div>
      {/* Formulario de alta/edición */}
      {showForm && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">{editArticulo ? 'Editar Artículo' : 'Agregar Artículo'}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => { setShowForm(false); setEditArticulo(null); }}></button>
              </div>
              <div className="modal-body">
                <FormArticulo initialData={editArticulo || {}} onSubmit={handleSubmit} onCancel={() => { setShowForm(false); setEditArticulo(null); }} loading={formLoading} porcentaje={formPorcentaje} />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal de eliminar */}
      <ModalEliminarArticulo
        show={showDeleteModal}
        nombre={deleteArticulo?.nombre || ''}
        onConfirm={handleDelete}
        onCancel={() => { setShowDeleteModal(false); setDeleteArticulo(null); setDeleteLoading(false); setDeletePorcentaje(0); }}
        loading={deleteLoading}
        porcentaje={deletePorcentaje}
      />
    </div>
  );
};

export default GestionArticulos;
