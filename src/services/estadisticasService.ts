// Servicio para consumir la API de estadísticas
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface EstadisticaVenta {
  totalVentas: number;
}

export async function getEstadisticasVentas(): Promise<EstadisticaVenta> {
  const res = await axios.get(`${API_URL}/stats/ventas`);
  return res.data;
}

export async function getArticulosMasVendidos(): Promise<any[]> {
  const res = await axios.get(`${API_URL}/stats/articulos-mas-vendidos`);
  return res.data;
}
