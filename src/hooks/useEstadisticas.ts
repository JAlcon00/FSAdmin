import { useEffect, useState } from 'react';
import { getEstadisticasVentas, getArticulosMasVendidos } from '../services/estadisticasService';
import type { EstadisticaVenta } from '../services/estadisticasService';

export function useEstadisticas() {
  const [estadisticas, setEstadisticas] = useState<EstadisticaVenta | null>(null);
  const [masVendidos, setMasVendidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[useEstadisticas] Iniciando carga de estadísticas...');
    setLoading(true);
    Promise.all([
      getEstadisticasVentas(),
      getArticulosMasVendidos()
    ])
      .then(([stats, masVendidosData]) => {
        console.log('[useEstadisticas] Datos crudos de getEstadisticasVentas:', stats);
        console.log('[useEstadisticas] Datos crudos de getArticulosMasVendidos:', masVendidosData);
        setEstadisticas(stats);
        
        if (!masVendidosData || masVendidosData.length === 0) {
          console.log('[useEstadisticas] No hay datos de artículos más vendidos desde la API.');
          setMasVendidos([]);
          return;
        }

        // El backend ya devuelve nombre y totalVendidos
        setMasVendidos(
          masVendidosData.map((item: any) => ({
            _id: item._id,
            nombre: item.nombre,
            cantidad: item.totalVendidos
          }))
        );
      })
      .catch((err) => {
        console.error('[useEstadisticas] Error al cargar estadísticas o procesar datos:', err);
        setError('Error al cargar estadísticas de artículos más vendidos');
      })
      .finally(() => {
        setLoading(false);
        console.log('[useEstadisticas] Carga de estadísticas finalizada.');
      });
  }, []);

  return { estadisticas, masVendidos, loading, error };
}
