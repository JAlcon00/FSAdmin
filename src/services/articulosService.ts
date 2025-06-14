// Servicio para consumir la API de productos/artículos
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface Articulo {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number | string;
  stock: number | string;
  categoria: string;
  imagenes?: string[];
  imagenUrl?: string;
  activo: boolean;
}

export async function getArticulos(): Promise<Articulo[]> {
  const res = await axios.get(`${API_URL}/articulos`);
  return res.data;
}

export async function getArticuloById(id: string): Promise<Articulo> {
  console.log(`[articulosService] Solicitando artículo con ID: ${id}`);
  try {
    const res = await axios.get(`${API_URL}/articulos/${id}`);
    console.log(`[articulosService] ✓ Artículo obtenido: ${id}`, res.data);
    return res.data;
  } catch (error: any) {
    console.error(`[articulosService] ✗ Error al obtener artículo ${id}:`, error.response?.status, error.response?.data);
    if (error.response?.status === 404) {
      // Si el artículo no se encuentra, lanzar un error específico
      throw new Error(`Artículo con ID ${id} no encontrado`);
    }
    // Para otros errores, relanzar el error original
    throw error;
  }
}

export async function crearArticulo(data: Partial<Articulo>): Promise<Articulo> {
  const res = await axios.post(`${API_URL}/articulos`, data);
  return res.data;
}

export async function actualizarArticulo(id: string, data: Partial<Articulo>): Promise<Articulo> {
  const res = await axios.put(`${API_URL}/articulos/${id}`, data);
  return res.data;
}

export async function eliminarArticulo(id: string): Promise<void> {
  await axios.delete(`${API_URL}/articulos/${id}`);
}
