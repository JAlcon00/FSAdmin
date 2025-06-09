import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPedidos } from '../services/pedidosService';
import type { Pedido } from '../services/pedidosService';

export function usePedidos() {
  const queryClient = useQueryClient();
  const { data: pedidos = [], isLoading: loading, error } = useQuery<Pedido[], Error>({
    queryKey: ['pedidos'],
    queryFn: getPedidos,
    staleTime: 1000 * 60,
  });

  return {
    pedidos,
    loading,
    error: error ? error.message : null,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['pedidos'] })
  };
}
