import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getVentasUltimos7Dias, getResumenVentasMensual, getAllVentas } from '../services/ventasService';
import type { Venta } from '../services/ventasService';

export function useVentas() {
  const queryClient = useQueryClient();
  const { data, isLoading: loading, error } = useQuery<{ventas: Venta[]; resumen: any; todasVentas: Venta[]}, Error>({
    queryKey: ['ventas'],
    queryFn: async () => {
      const [ventasData, resumenData, todasVentasData] = await Promise.all([
        getVentasUltimos7Dias(),
        getResumenVentasMensual(),
        getAllVentas()
      ]);
      console.log('[useVentas] Datos de ventasData:', ventasData);
      console.log('[useVentas] Datos de todasVentasData:', todasVentasData);
      return { ventas: ventasData, resumen: resumenData, todasVentas: todasVentasData };
    },
    staleTime: 1000 * 60,
  });

  return {
    ventas: data?.ventas ?? [],
    resumen: data?.resumen ?? null,
    todasVentas: data?.todasVentas ?? [], // NUEVO: todas las ventas individuales
    loading,
    error: error ? error.message : null,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['ventas'] })
  };
}

// NOTA: Si 'todasVentas' aparece vacío en la UI, revisa que la API /sales esté devolviendo ventas correctamente y que los pedidos tengan ventas asociadas.
