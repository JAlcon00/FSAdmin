import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getArticulos } from '../services/articulosService';
import type { Articulo } from '../services/articulosService';

export function useArticulos() {
  const queryClient = useQueryClient();
  const { data: articulos, isLoading: loading, error } = useQuery<Articulo[], Error>({
    queryKey: ['articulos'],
    queryFn: getArticulos,
    staleTime: 1000 * 60, // 1 minuto
  });

  return {
    articulos: articulos ?? [],
    loading,
    error: error ? error.message : null,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['articulos'] })
  };
}
