import { useEffect, useState } from 'react';
import { getEstadisticasVentas, getArticulosMasVendidos } from '../services/estadisticasService';
import { getArticuloById } from '../services/articulosService'; // Importar para obtener nombre
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
      .then(async ([stats, masVendidosData]) => {
        setEstadisticas(stats);
        // Mapear para obtener nombre del artículo
        const articulosConNombre = await Promise.all(
          masVendidosData.map(async (item: any) => {
            try {
              const articulo = await getArticuloById(item._id);
              return {
                id: item._id,
                nombre: articulo.nombre,
                cantidad: item.totalVendidos
              };
            } catch {
              return {
                id: item._id,
                nombre: 'Desconocido',
                cantidad: item.totalVendidos
              };
            }
          })
        );
        setMasVendidos(articulosConNombre);
      })
      .catch(() => setError('Error al cargar estadísticas'))
      .finally(() => setLoading(false));
  }, []);

  return { estadisticas, masVendidos, loading, error };
}
