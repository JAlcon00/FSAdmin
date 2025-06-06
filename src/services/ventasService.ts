// Servicio para consumir la API de ventas
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface Venta {
  fecha: string;
  total: number;
}

export async function getVentasUltimos7Dias(): Promise<Venta[]> {
  const res = await axios.get(`${API_URL}/sales/ultimos-7-dias`);
  return res.data;
}

export async function getResumenVentasMensual(): Promise<any> {
  const res = await axios.get(`${API_URL}/sales/resumen-mensual`);
  return res.data;
}
