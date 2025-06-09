import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getVentasTotales, getResumenVentasMensual } from '../services/ventasService';
import type { Venta } from '../services/ventasService';

export function useVentas() {
  const queryClient = useQueryClient();
  const { data: ventas = [], isLoading: loading, error } = useQuery<Venta[], Error>({
    queryKey: ['ventas'],
    queryFn: getVentasTotales,
    staleTime: 1000 * 60,
  });
  const { data: resumen, isLoading: loadingResumen, error: errorResumen } = useQuery<any, Error>({
    queryKey: ['resumenVentas'],
    queryFn: getResumenVentasMensual,
    staleTime: 1000 * 60,
  });

  return {
    ventas,
    resumen,
    loading: loading || loadingResumen,
    error: error ? error.message : errorResumen ? errorResumen.message : null,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      queryClient.invalidateQueries({ queryKey: ['resumenVentas'] });
    }
  };
}
