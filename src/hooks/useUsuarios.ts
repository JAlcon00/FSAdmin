import { useEffect, useState } from 'react';
import { getUsuarios} from '../services/usuariosService';
import type { Usuario } from '../services/usuariosService';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getUsuarios()
      .then(setUsuarios)
      .catch(() => setError('Error al cargar usuarios'))
      .finally(() => setLoading(false));
  }, []);

  return { usuarios, loading, error };
}
