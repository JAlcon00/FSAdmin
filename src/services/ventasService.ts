// Servicio para consumir la API de ventas
import apiClient from './apiClient'; // Importar apiClient sin extensión

export interface Venta {
  _id?: string; // Añadir _id opcional si las ventas pueden tenerlo
  fecha?: string;
  total?: number;
  pedidoId?: string;
  usuario?: string;
  // Propiedades reales que vienen del backend para el resumen de ventas
  amount?: number; // Monto total en centavos
  count?: number;  // Número de transacciones
  date?: string;   // Fecha del resumen
}

export async function getVentasUltimos7Dias(): Promise<Venta[]> {
  // Asumiendo que apiClient está configurado con la baseURL correcta
  const res = await apiClient.get('/sales/ultimos-7-dias'); 
  return res.data;
}

export async function getResumenVentasMensual(): Promise<any> {
  const res = await apiClient.get('/sales/resumen-mensual');
  return res.data;
}

// Función para obtener todas las ventas
export async function getAllVentas(): Promise<Venta[]> {
  try {
    const response = await apiClient.get<Venta[]>('/sales');
    return response.data;
  } catch (error) {
    console.error("Error al obtener todas las ventas:", error);
    throw error;
  }
}

// Función para crear una venta desde un pedido
export async function crearVentaDesdePedido(pedido: { _id: string }): Promise<Venta> {
  try {
    // Corregir la ruta para que coincida con la definición del backend ('/api/sales')
    const response = await apiClient.post<Venta>('/sales', { pedidoId: pedido._id });
    return response.data;
  } catch (error) {
    console.error("Error al crear la venta desde el pedido:", error);
    throw error;
  }
}

// Función para borrar una venta por ID de pedido
export async function borrarVentaPorPedido(pedidoId: string): Promise<void> {
  try {
    // Corregir la ruta para que coincida con la definición del backend ('/api/sales/:pedidoId')
    await apiClient.delete(`/sales/${pedidoId}`);
  } catch (error) {
    console.error(`Error al borrar la venta para el pedido ${pedidoId}:`, error);
    throw error;
  }
}
