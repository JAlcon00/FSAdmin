import { useEffect, useState } from 'react';
import { getPedidos} from '../services/pedidosService';
import type { Pedido } from '../services/pedidosService';

export function usePedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getPedidos()
      .then(setPedidos)
      .catch(() => setError('Error al cargar pedidos'))
      .finally(() => setLoading(false));
  }, []);

  return { pedidos, loading, error };
}
