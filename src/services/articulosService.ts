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
  const res = await axios.get(`${API_URL}/articulos/${id}`);
  return res.data;
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
