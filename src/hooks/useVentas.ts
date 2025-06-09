import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getVentasUltimos7Dias, getResumenVentasMensual} from '../services/ventasService';
import type { Venta } from '../services/ventasService';

export function useVentas() {
  const queryClient = useQueryClient();
  const { data, isLoading: loading, error } = useQuery<{ventas: Venta[]; resumen: any}, Error>({
    queryKey: ['ventas'],
    queryFn: async () => {
      const [ventasData, resumenData] = await Promise.all([
        getVentasUltimos7Dias(),
        getResumenVentasMensual()
      ]);
      return { ventas: ventasData, resumen: resumenData };
    },
    staleTime: 1000 * 60,
  });

  return {
    ventas: data?.ventas ?? [],
    resumen: data?.resumen ?? null,
    loading,
    error: error ? error.message : null,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['ventas'] })
  };
}
