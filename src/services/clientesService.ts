// Servicio para consumir la API de clientes
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface Cliente {
  _id: string;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
}

export async function getClientes(): Promise<Cliente[]> {
  const res = await axios.get(`${API_URL}/clientes`);
  return res.data;
}

export async function getClienteById(id: string): Promise<Cliente> {
  const res = await axios.get(`${API_URL}/clientes/${id}`);
  return res.data;
}

export async function crearCliente(data: Partial<Cliente>): Promise<Cliente> {
  const res = await axios.post(`${API_URL}/clientes`, data);
  return res.data;
}

export async function actualizarCliente(id: string, data: Partial<Cliente>): Promise<Cliente> {
  const res = await axios.put(`${API_URL}/clientes/${id}`, data);
  return res.data;
}

export async function eliminarCliente(id: string): Promise<void> {
  await axios.delete(`${API_URL}/clientes/${id}`);
}
