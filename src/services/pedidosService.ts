// Servicio para consumir la API de pedidos
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface Pedido {
  _id: string;
  usuario: string;
  articulos: Array<{
    articulo: string;
    cantidad: number;
    precioUnitario: number;
  }>;
  total: number;
  fechaCreacion: string;
  estado: string;
}

export async function getPedidos(): Promise<Pedido[]> {
  const res = await axios.get(`${API_URL}/pedidos`);
  return res.data;
}

export async function getPedidoById(id: string): Promise<Pedido> {
  const res = await axios.get(`${API_URL}/pedidos/${id}`);
  return res.data;
}

export async function crearPedido(data: Partial<Pedido>): Promise<Pedido> {
  const res = await axios.post(`${API_URL}/pedidos`, data);
  return res.data;
}

export async function actualizarPedido(id: string, data: Partial<Pedido>): Promise<Pedido> {
  const res = await axios.put(`${API_URL}/pedidos/${id}`, data);
  return res.data;
}

export async function eliminarPedido(id: string): Promise<void> {
  await axios.delete(`${API_URL}/pedidos/${id}`);
}
