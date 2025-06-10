// Servicio para consumir la API de usuarios
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface Usuario {
  _id: string;
  nombre: string;
  password?: string;
  rol: 'cliente' | 'admin' | 'superadmin';
}

export async function getUsuarios(): Promise<Usuario[]> {
  const res = await axios.get(`${API_URL}/usuarios`);
  return res.data;
}

export async function getUsuarioById(id: string): Promise<Usuario> {
  const res = await axios.get(`${API_URL}/usuarios/${id}`);
  return res.data;
}

export async function crearUsuario(data: Partial<Usuario>): Promise<Usuario> {
  const res = await axios.post(`${API_URL}/usuarios`, data);
  return res.data.user ?? res.data;
}

export async function actualizarUsuario(id: string, data: Partial<Usuario>): Promise<Usuario> {
  const res = await axios.put(`${API_URL}/usuarios/${id}`, data);
  return res.data;
}

export async function eliminarUsuario(id: string): Promise<void> {
  await axios.delete(`${API_URL}/usuarios/${id}`);
}
