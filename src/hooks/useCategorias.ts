import { getCategorias} from '../services/categoriasService';
import type { Categoria } from '../services/categoriasService';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useCategorias() {
  const queryClient = useQueryClient();
  const { data: categorias, isLoading: loading, error } = useQuery<Categoria[], Error>({
    queryKey: ['categorias'],
    queryFn: getCategorias,
    staleTime: 1000 * 60,
  });

  return {
    categorias: categorias ?? [],
    loading,
    error: error ? error.message : null,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['categorias'] })
  };
}
