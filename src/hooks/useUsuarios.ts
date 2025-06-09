<<<<<<< HEAD
import { useEffect, useState } from 'react';
import {
  getUsuarios,
  getUsuariosActivos,
  getUsuariosInactivos,
  buscarUsuariosPorNombre,
  buscarUsuariosPorRol
} from '../services/usuariosService';
import type { Usuario } from '../services/usuariosService';

export function useUsuarios({ tipo = 'todos', nombre = '', rol = '' }: { tipo?: 'todos' | 'activos' | 'inactivos', nombre?: string, rol?: string } = {}) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    let fetchFn: Promise<Usuario[]>;
    if (tipo === 'activos') {
      fetchFn = getUsuariosActivos();
    } else if (tipo === 'inactivos') {
      fetchFn = getUsuariosInactivos();
    } else if (nombre) {
      fetchFn = buscarUsuariosPorNombre(nombre);
    } else if (rol) {
      fetchFn = buscarUsuariosPorRol(rol);
    } else {
      fetchFn = getUsuarios();
    }
    fetchFn
      .then(setUsuarios)
      .catch(() => setError('Error al cargar usuarios'))
      .finally(() => setLoading(false));
  }, [tipo, nombre, rol]);

  return { usuarios, loading, error };
=======
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsuarios} from '../services/usuariosService';
import type { Usuario } from '../services/usuariosService';

export function useUsuarios() {
  const queryClient = useQueryClient();
  const { data: usuarios, isLoading: loading, error } = useQuery<Usuario[], Error>({
    queryKey: ['usuarios'],
    queryFn: getUsuarios,
    staleTime: 1000 * 60,
  });

  return {
    usuarios: usuarios ?? [],
    loading,
    error: error ? error.message : null,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] })
  };
>>>>>>> 3a1d551894d2cdc883f3b63b919fd3bfa122d5b3
}
