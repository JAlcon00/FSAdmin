import { useEffect, useState } from 'react';
import { getClientes } from '../services/clientesService';
import type { Cliente } from '../services/clientesService';

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getClientes()
      .then(setClientes)
      .catch(() => setError('Error al cargar clientes'))
      .finally(() => setLoading(false));
  }, []);

  return { clientes, loading, error };
}
