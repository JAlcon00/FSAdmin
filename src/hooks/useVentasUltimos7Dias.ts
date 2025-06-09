import { useQuery } from '@tanstack/react-query';
import { getVentasUltimos7Dias } from '../services/ventasService';
import type { Venta } from '../services/ventasService';

export function useVentasUltimos7Dias() {
  const { data: ventasUltimos7Dias = [], isLoading: loading, error } = useQuery<Venta[], Error>({
    queryKey: ['ventasUltimos7Dias'],
    queryFn: getVentasUltimos7Dias,
    staleTime: 1000 * 60,
  });
  return { ventasUltimos7Dias, loading, error: error ? error.message : null };
}
