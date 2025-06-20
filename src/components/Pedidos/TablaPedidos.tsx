import React from 'react';
import type { Pedido } from '../../services/pedidosService'; // Importar Pedido
import { useClientes } from '../../hooks/useClientes';
import { useArticulos } from '../../hooks/useArticulos';
import ModalConfirmarVenta from './ModalConfirmarVenta';
import { crearVentaDesdePedido, borrarVentaPorPedido } from '../../services/ventasService';
import { actualizarEstadoPedido, eliminarPedido } from '../../services/pedidosService'; // Importar desde pedidosService
import { toast } from 'react-toastify';

interface TablaPedidosProps {
  pedidos: Pedido[];
  todasVentas?: any[]; // NUEVO: todas las ventas individuales (para verificar si existe venta por pedido)
  loading: boolean;
  error: string | null;
  refetchPedidos?: () => void;
  refetchVentas?: () => void;
  onVentaRegistrada?: () => void; // NUEVO: callback para notificar al padre
}

const TablaPedidos: React.FC<TablaPedidosProps> = ({ pedidos, todasVentas = [], loading, error, refetchPedidos, refetchVentas, onVentaRegistrada }) => {
  const { clientes } = useClientes();
  const { articulos } = useArticulos();
  const [modalVenta, setModalVenta] = React.useState<{ show: boolean; pedido: Pedido | null; loading: boolean }>({ show: false, pedido: null, loading: false });
  const [ventasRealizadas, setVentasRealizadas] = React.useState<string[]>([]); // IDs de pedidos ya vendidos en esta sesión

  function getNombreCliente(clienteId: string): string { // Cambiado usuario a clienteId y tipo a string
    if (!clienteId) return '';
    const cliente = clientes.find(c => c._id === clienteId);
    return cliente ? cliente.nombre : clienteId; // Usar clienteId si no se encuentra el cliente
  }

  function getNombreArticulo(articuloId: string): string {
    if (!articuloId) return '';
    const articulo = articulos.find(a => a._id === articuloId);
    return articulo ? articulo.nombre : articuloId; // Usar articuloId si no se encuentra el artículo
  }

  function getProductosDelPedido(detalles: Pedido['detalles']): { productos: string[]; cantidadTotal: number } {
    if (!detalles || detalles.length === 0) return { productos: [], cantidadTotal: 0 };
    
    const productos = detalles.map(detalle => {
      const nombre = getNombreArticulo(detalle.articulo);
      return `${nombre} (${detalle.cantidad})`;
    });
    
    const cantidadTotal = detalles.reduce((acc, detalle) => acc + detalle.cantidad, 0);
    
    return { productos, cantidadTotal };
  }

  const handleVentaClick = (pedido: Pedido) => {
    setModalVenta({ show: true, pedido, loading: false });
  };

  const handleConfirmVenta = async () => {
    if (!modalVenta.pedido) return;
    setModalVenta(m => ({ ...m, loading: true }));
    try {
      // 1. Registrar la venta
      await crearVentaDesdePedido(modalVenta.pedido);
      // 2. Cambiar estado del pedido a 'completado'
      await actualizarEstadoPedido(modalVenta.pedido!._id, 'completado');
      setVentasRealizadas(prev => [...prev, modalVenta.pedido!._id]);
      toast.success('Venta registrada correctamente');
      if (refetchPedidos) refetchPedidos();
      if (refetchVentas) refetchVentas();
      if (onVentaRegistrada) onVentaRegistrada(); // Notifica al padre
    } catch (e) {
      toast.error('Error al registrar la venta');
    } finally {
      setModalVenta({ show: false, pedido: null, loading: false });
    }
  };

  const handleEliminarPedido = async (pedidoId: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este pedido?')) return;
    try {
      await eliminarPedido(pedidoId);
      toast.success('Pedido eliminado');
      if (refetchPedidos) refetchPedidos();
      if (refetchVentas) refetchVentas();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al eliminar el pedido');
    }
  };

  const handleBorrarVenta = async (pedidoId: string) => {
    try {
      console.log('DEBUG - Intentando borrar venta para pedido:', pedidoId);
      // await import('../../services/ventasService').then(({ borrarVentaPorPedido }) => borrarVentaPorPedido(pedidoId));
      await borrarVentaPorPedido(pedidoId); // Usar la función importada directamente
      console.log('DEBUG - Venta borrada exitosamente para pedido:', pedidoId);
      toast.success('Venta eliminada');
      if (refetchVentas) refetchVentas();
    } catch (err: any) {
      console.error('DEBUG - Error al borrar venta:', err);
      // Manejo de errores detallado
      if (err?.response) {
        toast.error(`Error al eliminar la venta: ${err.response.status} - ${err.response.data?.message || err.response.statusText}`);
        console.error('Error response:', err.response);
      } else if (err?.request) {
        toast.error('No se recibió respuesta del servidor al intentar borrar la venta.');
        console.error('Error request:', err.request);
      } else {
        toast.error('Error desconocido al eliminar la venta.');
        console.error('Error:', err);
      }
    }
  };

  // Función para saber si el pedido tiene venta registrada
  function tieneVentaRegistrada(pedidoId: string) {
    const tieneVenta = todasVentas.some(v => v.pedidoId === pedidoId);
    console.log(`DEBUG - ¿Pedido ${pedidoId} tiene venta registrada?`, tieneVenta);
    console.log('DEBUG - Todas las ventas individuales:', todasVentas);
    return tieneVenta;
  }

  // Utilidad para calcular el total si no viene del backend
  function calcularTotal(detalles: Pedido['detalles']): number { // Cambiado articulos a detalles
    if (!detalles || detalles.length === 0) return 0;
    return detalles.reduce((acc: number, det: { cantidad: number; precioUnitario: number }) => {
      if (typeof det.cantidad === 'number' && typeof det.precioUnitario === 'number') {
        return acc + det.cantidad * det.precioUnitario;
      }
      return acc;
    }, 0);
  }

  // Feedback visual mejorado para la tabla
  if (loading) return (
    <div className="d-flex align-items-center gap-2 alert alert-info">
      <span className="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true"></span>
      Cargando pedidos...
    </div>
  );
  if (error) return (
    <div className="alert alert-danger">
      <i className="bi bi-exclamation-triangle me-2"></i>
      {typeof error === 'string' && error.includes('Network') ? 'No se pudo conectar con el servidor. Intenta más tarde.' : error}
    </div>
  );

  return (
    <div aria-label="Tabla de pedidos">
      <h4 className="mb-3 fw-bold text-primary">Lista de Pedidos</h4>
      {(!pedidos || pedidos.length === 0) ? (
        <div className="alert alert-info">No hay pedidos para mostrar.</div>
      ) : (
        <div className="table-responsive rounded shadow-sm" style={{ minHeight: '400px' }}>
          <table className="table table-bordered table-hover align-middle bg-white mb-0" style={{ 
            fontSize: '0.9rem',
            tableLayout: 'fixed' 
          }}>
            <thead className="table-light">
              <tr>
                <th style={{ width: '12%' }}>Cliente</th>
                <th style={{ width: '30%' }}>Productos</th>
                <th style={{ width: '8%' }} className="text-center">Cantidad</th>
                <th style={{ width: '12%' }} className="text-end">Total</th>
                <th style={{ width: '10%' }}>Fecha</th>
                <th style={{ width: '10%' }} className="text-center">Estado</th>
                <th style={{ width: '18%' }} className="text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(pedido => {
                const { productos, cantidadTotal } = getProductosDelPedido(pedido.detalles);
                return (
                <tr key={pedido._id}>
                  <td className="fw-semibold text-dark" style={{ width: '12%' }}>
                    <div className="text-truncate" title={getNombreCliente(pedido.clienteId || '')}>
                      {getNombreCliente(pedido.clienteId || '')}
                    </div>
                  </td>
                  <td style={{ width: '30%' }}>
                    {productos.length === 0 ? (
                      <span className="text-muted">Sin productos</span>
                    ) : (
                      <div>
                        {productos.map((producto, index) => (
                          <div key={index} className="mb-1">
                            <small className="text-dark d-block" style={{ 
                              wordWrap: 'break-word', 
                              whiteSpace: 'normal',
                              lineHeight: '1.3'
                            }}>
                              {producto}
                            </small>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="text-center" style={{ width: '8%' }}>
                    <span className="badge bg-secondary fs-6">{cantidadTotal}</span>
                  </td>                  <td className="text-success fw-bold text-end" style={{ width: '12%' }}>
                    {pedido.detalles?.length === 0 ? (
                      <span className="text-muted">Sin artículos</span>
                    ) : (
                      <span title={`$${(typeof pedido.total === 'number' ? pedido.total : calcularTotal(pedido.detalles)).toFixed(2)}`}>
                        ${(typeof pedido.total === 'number' ? pedido.total : calcularTotal(pedido.detalles)).toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td style={{ width: '10%' }}>
                    <small className="text-muted">
                      {pedido.fechaCreacion ? new Date(pedido.fechaCreacion).toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric' 
                      }) : <span className="text-muted">Sin fecha</span>}
                    </small>
                  </td>
                  <td className="text-center" style={{ width: '10%' }}>
                    {pedido.estado === 'completado' && <span className="badge rounded-pill bg-success">completado</span>}
                    {pedido.estado === 'enviado' && <span className="badge rounded-pill bg-warning text-dark">enviado</span>}
                    {pedido.estado === 'pendiente' && <span className="badge rounded-pill bg-secondary">pendiente</span>}
                    {pedido.estado === 'confirmado' && <span className="badge rounded-pill bg-primary">confirmado</span>}
                    {pedido.estado === 'cancelado' && <span className="badge rounded-pill bg-danger">cancelado</span>}
                  </td>
                  <td className="text-center" style={{ width: '18%' }}>
                    {/* ACCIONES SIMPLIFICADAS Y ORDENADAS */}
                    <div className="d-flex flex-column gap-1">
                    {/* Cambiar entre pendiente <-> confirmado */}
                    {(pedido.estado === 'pendiente' || pedido.estado === 'confirmado') && (
                      <select
                        className="form-select form-select-sm"
                        value={pedido.estado}
                        onChange={async (e) => {
                          const nuevoEstado = e.target.value;
                          if (
                            (pedido.estado === 'pendiente' && nuevoEstado === 'confirmado') ||
                            (pedido.estado === 'confirmado' && nuevoEstado === 'pendiente')
                          ) {
                            try {
                              // Si pasa de confirmado a pendiente, borrar la venta asociada
                              if (pedido.estado === 'confirmado' && nuevoEstado === 'pendiente') {
                                await handleBorrarVenta(pedido._id);
                              }
                              await actualizarEstadoPedido(pedido._id, nuevoEstado);
                              toast.success('Estado actualizado');
                              if (refetchPedidos) refetchPedidos();
                              if (refetchVentas) refetchVentas();
                            } catch (err: any) {
                              toast.error(err?.response?.data?.message || 'Error al actualizar el estado');
                            }
                          } else {
                            toast.error('Transición de estado no permitida.');
                          }
                        }}
                        disabled={ventasRealizadas.includes(pedido._id)}
                      >
                        <option value="pendiente">pendiente</option>
                        <option value="confirmado">confirmado</option>
                      </select>
                    )}
                    
                    <div className="d-flex gap-1">
                    {pedido.estado === 'confirmado' && !ventasRealizadas.includes(pedido._id) && (
                      <button className="btn btn-success btn-sm flex-fill" title="Registrar venta" onClick={() => handleVentaClick(pedido)}>
                        <i className="bi bi-currency-dollar"></i>
                      </button>
                    )}
                    {pedido.estado !== 'completado' && pedido.estado !== 'enviado' && pedido.estado !== 'cancelado' && (
                      <button className="btn btn-danger btn-sm flex-fill" title="Eliminar pedido" onClick={() => handleEliminarPedido(pedido._id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                    </div>
                    {pedido.estado === 'completado' && (
                      <>
                        <select
                          className="form-select form-select-sm d-inline-block w-auto me-2 mt-1"
                          value={pedido.estado}
                          onChange={async (e) => {
                            const nuevoEstado = e.target.value;
                            if (nuevoEstado === 'pendiente' || nuevoEstado === 'confirmado') {
                              try {
                                // 1. Borrar la venta asociada si existe
                                if (tieneVentaRegistrada(pedido._id)) {
                                  await handleBorrarVenta(pedido._id);
                                }
                                // 2. Cambiar el estado
                                await actualizarEstadoPedido(pedido._id, nuevoEstado);
                                toast.success('Estado actualizado y venta (si existía) eliminada');
                                if (refetchPedidos) refetchPedidos();
                                if (refetchVentas) refetchVentas();
                              } catch (err: any) {
                                toast.error(err?.response?.data?.message || 'Error al actualizar el estado');
                              }
                            } else {
                              toast.error('Solo puedes regresar a pendiente o confirmado');
                            }
                          }}
                          style={{ minWidth: 120 }}
                        >
                          <option value="completado">completado</option>
                          <option value="pendiente">pendiente</option>
                          <option value="confirmado">confirmado</option>
                        </select>
                        {/* Botón para pasar a enviado manteniendo la venta registrada */}
                        <button
                          className="btn btn-warning btn-sm mt-1"
                          onClick={async () => {
                            try {
                              await actualizarEstadoPedido(pedido._id, 'enviado');
                              toast.success('Pedido marcado como enviado');
                              if (refetchPedidos) refetchPedidos();
                            } catch (err: any) {
                              toast.error(err?.response?.data?.message || 'Error al cambiar a enviado');
                            }
                          }}
                        >
                          <i className="bi bi-truck"></i> Enviar
                        </button>
                      </>
                    )}
                    {pedido.estado === 'enviado' && (
                      <>
                        <select
                          className="form-select form-select-sm d-inline-block w-auto me-2 mt-1"
                          value={pedido.estado}
                          onChange={async (e) => {
                            const nuevoEstado = e.target.value;
                            if (["completado", "pendiente", "confirmado"].includes(nuevoEstado)) {
                              try {
                                // Si se regresa a pendiente o confirmado desde enviado, borrar la venta.
                                // Si va a completado, mantener la venta.
                                if ((nuevoEstado === 'pendiente' || nuevoEstado === 'confirmado') && tieneVentaRegistrada(pedido._id)) {
                                  await handleBorrarVenta(pedido._id);
                                }
                                await actualizarEstadoPedido(pedido._id, nuevoEstado);
                                const mensaje = (nuevoEstado === 'pendiente' || nuevoEstado === 'confirmado') 
                                  ? 'Estado actualizado y venta eliminada' 
                                  : 'Estado actualizado';
                                toast.success(mensaje);
                                if (refetchPedidos) refetchPedidos();
                                if (refetchVentas) refetchVentas();
                              } catch (err: any) {
                                toast.error(err?.response?.data?.message || 'Error al actualizar el estado');
                              }
                            } else {
                              toast.error('Solo puedes regresar a completado, pendiente o confirmado');
                            }
                          }}
                          style={{ minWidth: 120 }}
                        >
                          <option value="enviado">enviado</option>
                          <option value="completado">completado</option>
                          <option value="pendiente">pendiente</option>
                          <option value="confirmado">confirmado</option>
                        </select>
                      </>
                    )}
                    {tieneVentaRegistrada(pedido._id) && (pedido.estado === 'completado' || pedido.estado === 'enviado') && (
                      <span className="badge bg-success ms-2">Venta registrada</span>
                    )}
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <ModalConfirmarVenta
        show={modalVenta.show}
        onConfirm={handleConfirmVenta}
        onCancel={() => setModalVenta({ show: false, pedido: null, loading: false })}
        loading={modalVenta.loading}
      />
    </div>
  );
};

export default TablaPedidos;
