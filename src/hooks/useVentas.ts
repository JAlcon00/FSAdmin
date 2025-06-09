import { useQuery, useQueryClient } from '@tanstack/react-query';
<<<<<<< HEAD
import { getVentasTotales, getResumenVentasMensual } from '../services/ventasService';
=======
import { getVentasUltimos7Dias, getResumenVentasMensual} from '../services/ventasService';
>>>>>>> 3a1d551894d2cdc883f3b63b919fd3bfa122d5b3
import type { Venta } from '../services/ventasService';

export function useVentas() {
  const queryClient = useQueryClient();
<<<<<<< HEAD
  const { data: ventas = [], isLoading: loading, error } = useQuery<Venta[], Error>({
    queryKey: ['ventas'],
    queryFn: getVentasTotales,
    staleTime: 1000 * 60,
  });
  const { data: resumen, isLoading: loadingResumen, error: errorResumen } = useQuery<any, Error>({
    queryKey: ['resumenVentas'],
    queryFn: getResumenVentasMensual,
=======
  const { data, isLoading: loading, error } = useQuery<{ventas: Venta[]; resumen: any}, Error>({
    queryKey: ['ventas'],
    queryFn: async () => {
      const [ventasData, resumenData] = await Promise.all([
        getVentasUltimos7Dias(),
        getResumenVentasMensual()
      ]);
      return { ventas: ventasData, resumen: resumenData };
    },
>>>>>>> 3a1d551894d2cdc883f3b63b919fd3bfa122d5b3
    staleTime: 1000 * 60,
  });

  return {
<<<<<<< HEAD
    ventas,
    resumen,
    loading: loading || loadingResumen,
    error: error ? error.message : errorResumen ? errorResumen.message : null,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      queryClient.invalidateQueries({ queryKey: ['resumenVentas'] });
    }
=======
    ventas: data?.ventas ?? [],
    resumen: data?.resumen ?? null,
    loading,
    error: error ? error.message : null,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['ventas'] })
>>>>>>> 3a1d551894d2cdc883f3b63b919fd3bfa122d5b3
  };
}
