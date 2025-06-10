import React, { useState } from 'react';
import TablaUsuarios from '../components/Usuarios/TablaUsuarios/TablaUsuarios';
import FormUsuario from '../components/Usuarios/FormUsuario/FormUsuario';
import { useUsuarios } from '../hooks/useUsuarios';
import { crearUsuario, actualizarUsuario, eliminarUsuario } from '../services/usuariosService';
import type { Usuario } from '../services/usuariosService'; // Importación de tipo corregida
import { toast } from 'react-toastify';

const GestionUsuarios: React.FC = () => {
  const { usuarios, loading, error, refetch } = useUsuarios();
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleEdit = (usuario: Usuario) => {
    setUsuarioActual(usuario);
    setMostrarFormulario(true);
    setFormError(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await eliminarUsuario(id);
        toast.success('Usuario eliminado correctamente');
        refetch();
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error al eliminar el usuario');
      }
    }
  };

  const handleSave = async (datosUsuario: Partial<Usuario>) => {
    setFormLoading(true);
    setFormError(null);
    try {
      if (usuarioActual) {
        await actualizarUsuario(usuarioActual._id, datosUsuario);
        toast.success('Usuario actualizado correctamente');
      } else {
        const nuevoUsuario = await crearUsuario(datosUsuario);
        console.debug('Usuario creado (respuesta backend):', nuevoUsuario);
      }
      setMostrarFormulario(false);
      setUsuarioActual(null);
      await refetch();
      // Debug: mostrar usuarios tras refetch
      setTimeout(() => {
        console.debug('Usuarios tras refetch:', usuarios);
      }, 500);
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'Error al guardar el usuario');
      toast.error(err?.response?.data?.message || 'Error al guardar el usuario');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    setMostrarFormulario(false);
    setUsuarioActual(null);
    setFormError(null);
  };

  const handleNuevoUsuario = () => {
    setUsuarioActual(null);
    setMostrarFormulario(true);
    setFormError(null);
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Usuarios</h2>
        <button className="btn btn-primary" onClick={handleNuevoUsuario} disabled={mostrarFormulario}>
          <i className="bi bi-plus-circle me-2"></i>Nuevo Usuario
        </button>
      </div>

      {mostrarFormulario ? (
        <FormUsuario
          usuarioActual={usuarioActual}
          onSave={handleSave}
          onCancel={handleCancel}
          loading={formLoading}
          error={formError}
        />
      ) : (
        <TablaUsuarios
          usuarios={usuarios}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};

export default GestionUsuarios;
