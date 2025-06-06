import { useEffect, useState } from 'react';
import { getVentasUltimos7Dias, getResumenVentasMensual} from '../services/ventasService'
import type { Venta } from '../services/ventasService';

export function useVentas() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [resumen, setResumen] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getVentasUltimos7Dias(),
      getResumenVentasMensual()
    ])
      .then(([ventasData, resumenData]) => {
        setVentas(ventasData);
        setResumen(resumenData);
      })
      .catch(() => setError('Error al cargar ventas'))
      .finally(() => setLoading(false));
  }, []);

  return { ventas, resumen, loading, error };
}
