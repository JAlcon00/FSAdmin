import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsuarios } from '../services/usuariosService';
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
}
