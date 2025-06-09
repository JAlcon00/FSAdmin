import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getClientes } from '../services/clientesService';
import type { Cliente } from '../services/clientesService';

export function useClientes() {
  const queryClient = useQueryClient();
  const { data: clientes, isLoading: loading, error } = useQuery<Cliente[], Error>({
    queryKey: ['clientes'],
    queryFn: getClientes,
    staleTime: 1000 * 60,
  });

  return {
    clientes: clientes ?? [],
    loading,
    error: error ? error.message : null,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['clientes'] })
  };
}
