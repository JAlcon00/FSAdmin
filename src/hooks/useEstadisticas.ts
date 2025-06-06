import { useEffect, useState } from 'react';
import { getEstadisticasVentas, getArticulosMasVendidos} from '../services/estadisticasService';
import type { EstadisticaVenta } from '../services/estadisticasService';

export function useEstadisticas() {
  const [estadisticas, setEstadisticas] = useState<EstadisticaVenta | null>(null);
  const [masVendidos, setMasVendidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getEstadisticasVentas(),
      getArticulosMasVendidos()
    ])
      .then(([stats, masVendidosData]) => {
        setEstadisticas(stats);
        setMasVendidos(masVendidosData);
      })
      .catch(() => setError('Error al cargar estadísticas'))
      .finally(() => setLoading(false));
  }, []);

  return { estadisticas, masVendidos, loading, error };
}
