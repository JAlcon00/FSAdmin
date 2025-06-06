// Servicio para consumir la API de categorías
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface Categoria {
  _id: string;
  nombre: string;
  descripcion?: string;
}

export async function getCategorias(): Promise<Categoria[]> {
  const res = await axios.get(`${API_URL}/categorias`);
  return res.data;
}

export async function getCategoriaById(id: string): Promise<Categoria> {
  const res = await axios.get(`${API_URL}/categorias/${id}`);
  return res.data;
}

export async function crearCategoria(data: Partial<Categoria>): Promise<Categoria> {
  const res = await axios.post(`${API_URL}/categorias`, data);
  return res.data;
}

export async function actualizarCategoria(id: string, data: Partial<Categoria>): Promise<Categoria> {
  const res = await axios.put(`${API_URL}/categorias/${id}`, data);
  return res.data;
}

export async function eliminarCategoria(id: string): Promise<void> {
  await axios.delete(`${API_URL}/categorias/${id}`);
}
