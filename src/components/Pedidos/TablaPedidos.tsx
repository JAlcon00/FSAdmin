import React from 'react';
import type { Pedido } from '../../services/pedidosService';
import { useClientes } from '../../hooks/useClientes';
import ModalConfirmarVenta from './ModalConfirmarVenta';
import { crearVentaDesdePedido } from '../../services/ventasService';
import { toast } from 'react-toastify';

interface TablaPedidosProps {
  pedidos: Pedido[];
  ventas: any[]; // o el tipo correcto de Venta
  loading: boolean;
  error: string | null;
  refetchPedidos?: () => void;
  refetchVentas?: () => void;
  onVentaRegistrada?: () => void; // NUEVO: callback para notificar al padre
}

const TablaPedidos: React.FC<TablaPedidosProps> = ({ pedidos, ventas, loading, error, refetchPedidos, refetchVentas, onVentaRegistrada }) => {
  const { clientes } = useClientes();
  const [modalVenta, setModalVenta] = React.useState<{ show: boolean; pedido: Pedido | null; loading: boolean }>({ show: false, pedido: null, loading: false });
  const [ventasRealizadas, setVentasRealizadas] = React.useState<string[]>([]); // IDs de pedidos ya vendidos en esta sesión

  function getNombreCliente(usuario: any): string {
    if (!usuario) return '';
    if (typeof usuario === 'object' && usuario.nombre) return usuario.nombre;
    if (typeof usuario === 'string') {
      const cliente = clientes.find(c => c._id === usuario);
      return cliente ? cliente.nombre : usuario;
    }
    return '';
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
      await import('../../services/pedidosService').then(({ actualizarEstadoPedido }) =>
        actualizarEstadoPedido(modalVenta.pedido!._id, 'completado')
      );
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
      await import('../../services/pedidosService').then(({ eliminarPedido }) => eliminarPedido(pedidoId));
      toast.success('Pedido eliminado');
      if (refetchPedidos) refetchPedidos();
      if (refetchVentas) refetchVentas();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al eliminar el pedido');
    }
  };

  const handleBorrarVenta = async (pedidoId: string) => {
    try {
      await import('../../services/ventasService').then(({ borrarVentaPorPedido }) => borrarVentaPorPedido(pedidoId));
      toast.success('Venta eliminada');
      if (refetchVentas) refetchVentas();
    } catch (err: any) {
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
    return ventas.some(v => v.pedidoId === pedidoId);
  }

  // Utilidad para calcular el total si no viene del backend
  function calcularTotal(detalles: Pedido['detalles']): number {
    if (!detalles || detalles.length === 0) return 0;
    return detalles.reduce((acc, det) => {
      // Validación extra: si subtotal no es numérico, intenta calcularlo
      if (typeof det.subtotal === 'number') return acc + det.subtotal;
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
        <div className="table-responsive rounded shadow-sm">
          <table className="table table-bordered table-hover align-middle bg-white">
            <thead className="table-light">
              <tr>
                <th>Cliente</th>
                <th>Artículos</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(pedido => (
                <tr key={pedido._id}>
                  <td className="fw-semibold text-dark">{getNombreCliente(pedido.usuario)}</td>
                  <td>{pedido.detalles?.length ?? 0}</td>
                  <td className="text-success fw-bold">
                    {pedido.detalles?.length === 0 ? (
                      <span className="text-muted">Sin artículos</span>
                    ) : (
                      <>
                        ${
                          (typeof pedido.total === 'number' ? pedido.total : calcularTotal(pedido.detalles)).toFixed(2)
                        }
                      </>
                    )}
                  </td>
                  <td>{pedido.fechaCreacion ? new Date(pedido.fechaCreacion).toLocaleDateString() : <span className="text-muted">Sin fecha</span>}</td>
                  <td>
                    {/* Estado: solo badge, sin acciones */}
                    {pedido.estado === 'completado' && <span className="badge rounded-pill bg-success">completado</span>}
                    {pedido.estado === 'enviado' && <span className="badge rounded-pill bg-warning text-dark">enviado</span>}
                    {pedido.estado === 'pendiente' && <span className="badge rounded-pill bg-secondary">pendiente</span>}
                    {pedido.estado === 'confirmado' && <span className="badge rounded-pill bg-primary">confirmado</span>}
                    {pedido.estado === 'cancelado' && <span className="badge rounded-pill bg-danger">cancelado</span>}
                  </td>
                  <td>
                    {/* ACCIONES SIMPLIFICADAS Y ORDENADAS */}
                    {/* Cambiar entre pendiente <-> confirmado */}
                    {(pedido.estado === 'pendiente' || pedido.estado === 'confirmado') && (
                      <select
                        className="form-select form-select-sm d-inline-block w-auto me-2"
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
                              await import('../../services/pedidosService').then(({ actualizarEstadoPedido }) =>
                                actualizarEstadoPedido(pedido._id, nuevoEstado)
                              );
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
                        style={{ minWidth: 120 }}
                        disabled={ventasRealizadas.includes(pedido._id)}
                      >
                        <option value="pendiente">pendiente</option>
                        <option value="confirmado">confirmado</option>
                      </select>
                    )}
                    {/* Registrar venta */}
                    {pedido.estado === 'confirmado' && !ventasRealizadas.includes(pedido._id) && (
                      <button className="btn btn-success btn-sm me-2" title="Registrar venta" onClick={() => handleVentaClick(pedido)}>
                        <i className="bi bi-currency-dollar"></i> Venta
                      </button>
                    )}
                    {/* Eliminar pedido */}
                    {pedido.estado !== 'completado' && pedido.estado !== 'enviado' && pedido.estado !== 'cancelado' && (
                      <button className="btn btn-danger btn-sm me-2" title="Eliminar pedido" onClick={() => handleEliminarPedido(pedido._id)}>
                        <i className="bi bi-trash"></i> Eliminar
                      </button>
                    )}
                    {/* Completado: regresar a pendiente/confirmado */}
                    {pedido.estado === 'completado' && (
                      <>
                        <select
                          className="form-select form-select-sm d-inline-block w-auto me-2 mt-1"
                          value={pedido.estado}
                          onChange={async (e) => {
                            const nuevoEstado = e.target.value;
                            if (nuevoEstado === 'pendiente' || nuevoEstado === 'confirmado') {
                              try {
                                // 1. Borrar la venta asociada
                                await handleBorrarVenta(pedido._id);
                                // 2. Cambiar el estado
                                await import('../../services/pedidosService').then(({ actualizarEstadoPedido }) =>
                                  actualizarEstadoPedido(pedido._id, nuevoEstado)
                                );
                                toast.success('Estado actualizado y venta eliminada');
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
                        {/* Botón para pasar a enviado solo si está completado */}
                        <button
                          className="btn btn-warning btn-sm mt-1"
                          onClick={async () => {
                            try {
                              await import('../../services/pedidosService').then(({ actualizarEstadoPedido }) =>
                                actualizarEstadoPedido(pedido._id, 'enviado')
                              );
                              toast.success('Pedido enviado');
                              if (refetchPedidos) refetchPedidos();
                              if (refetchVentas) refetchVentas();
                            } catch (err: any) {
                              toast.error(err?.response?.data?.message || 'Error al cambiar a enviado');
                            }
                          }}
                        >
                          <i className="bi bi-truck"></i> Enviar
                        </button>
                      </>
                    )}
                    {/* Enviado: regresar a completado, pendiente o confirmado (sin badge) */}
                    {pedido.estado === 'enviado' && (
                      <>
                        <select
                          className="form-select form-select-sm d-inline-block w-auto me-2 mt-1"
                          value={pedido.estado}
                          onChange={async (e) => {
                            const nuevoEstado = e.target.value;
                            if (["completado", "pendiente", "confirmado"].includes(nuevoEstado)) {
                              try {
                                // Si se regresa a pendiente o confirmado, borrar la venta asociada
                                if (nuevoEstado === 'pendiente' || nuevoEstado === 'confirmado') {
                                  await handleBorrarVenta(pedido._id);
                                }
                                await import('../../services/pedidosService').then(({ actualizarEstadoPedido }) =>
                                  actualizarEstadoPedido(pedido._id, nuevoEstado)
                                );
                                toast.success('Estado actualizado');
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
                    {/* Mostrar badge si la venta ya fue registrada y el estado es completado o enviado */}
                    {tieneVentaRegistrada(pedido._id) && (pedido.estado === 'completado' || pedido.estado === 'enviado') && (
                      <span className="badge bg-success ms-2">Venta registrada</span>
                    )}
                  </td>
                </tr>
              ))}
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
