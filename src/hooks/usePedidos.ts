import { useQuery, useQueryClient } from '@tanstack/react-query';
<<<<<<< HEAD
import { getPedidos } from '../services/pedidosService';
=======
import { getPedidos} from '../services/pedidosService';
>>>>>>> 3a1d551894d2cdc883f3b63b919fd3bfa122d5b3
import type { Pedido } from '../services/pedidosService';

export function usePedidos() {
  const queryClient = useQueryClient();
<<<<<<< HEAD
  const { data: pedidos = [], isLoading: loading, error } = useQuery<Pedido[], Error>({
=======
  const { data: pedidos, isLoading: loading, error } = useQuery<Pedido[], Error>({
>>>>>>> 3a1d551894d2cdc883f3b63b919fd3bfa122d5b3
    queryKey: ['pedidos'],
    queryFn: getPedidos,
    staleTime: 1000 * 60,
  });

  return {
<<<<<<< HEAD
    pedidos,
=======
    pedidos: pedidos ?? [],
>>>>>>> 3a1d551894d2cdc883f3b63b919fd3bfa122d5b3
    loading,
    error: error ? error.message : null,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['pedidos'] })
  };
}
