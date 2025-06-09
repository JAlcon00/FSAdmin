import React, { useState, useEffect } from 'react';
import { crearPedido } from '../../services/pedidosService';
import { getClientes } from '../../services/clientesService';
import { getArticulos } from '../../services/articulosService';
import type { Cliente } from '../../services/clientesService';
import type { Articulo } from '../../services/articulosService';

interface FormPedidoPruebaProps {
  refetchPedidos?: () => void;
}

const FormPedidoPrueba: React.FC<FormPedidoPruebaProps> = ({ refetchPedidos }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [clienteId, setClienteId] = useState('');
  const [articuloId, setArticuloId] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [stockDisponible, setStockDisponible] = useState<number>(0);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getClientes().then(setClientes);
    getArticulos().then(setArticulos);
  }, []);

  useEffect(() => {
    if (articuloId) {
      const art = articulos.find(a => a._id === articuloId);
      setPrecioUnitario(art ? Number(art.precio) : 0);
      setStockDisponible(art ? Number(art.stock) : 0);
    } else {
      setPrecioUnitario(0);
      setStockDisponible(0);
    }
  }, [articuloId, articulos]);

  const handleCrearPedido = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Prevenir submit por defecto
    setLoading(true);
    setError(null);
    setResult(null);
    // Validaciones básicas
    if (!clienteId || !articuloId) {
      setError('Selecciona cliente y artículo');
      setLoading(false);
      console.log('Error: Selecciona cliente y artículo');
      return;
    }
    if (cantidad < 1) {
      setError('La cantidad debe ser mayor a 0');
      setLoading(false);
      console.log('Error: La cantidad debe ser mayor a 0');
      return;
    }
    if (cantidad > stockDisponible) {
      setError('No hay suficiente stock disponible');
      setLoading(false);
      console.log('Error: No hay suficiente stock disponible');
      return;
    }
    try {
      // Construir el objeto con subtotal para el tipado del frontend
      const data: any = {
        cliente: clienteId,
        detalles: [
          {
            articulo: articuloId,
            cantidad: Number(cantidad),
            precioUnitario: Number(precioUnitario),
            subtotal: 0 // dummy para el tipado, el backend lo ignora
          }
        ],
        estado: 'pendiente',
        fechaCreacion: new Date().toISOString()
      };
      // Eliminar subtotal antes de enviar al backend
      const dataToSend = {
        ...data,
        detalles: data.detalles.map((d: any) => {
          const { subtotal, ...rest } = d;
          return rest;
        })
      };
      console.log('Datos enviados al backend:', dataToSend);
      const pedido = await crearPedido(dataToSend);
      setResult(pedido);
      // Limpiar formulario tras crear el pedido
      setClienteId('');
      setArticuloId('');
      setCantidad(1);
      setPrecioUnitario(0);
      setStockDisponible(0);
      if (refetchPedidos) refetchPedidos();
      console.log('Pedido creado correctamente:', pedido);
    } catch (err: any) {
      // Manejo de errores más robusto
      if (err?.response?.data?.details) {
        const msg = err.response.data.details.map((d: any) => d.message).join(' | ') || 'Error de validación en el backend';
        setError(msg);
        console.log('Error de validación backend:', msg, err.response.data.details);
      } else if (err?.response?.data?.message) {
        setError(err.response.data.message);
        console.log('Error backend:', err.response.data.message);
      } else if (err?.message) {
        setError(err.message);
        console.log('Error:', err.message);
      } else {
        setError('Error desconocido al crear el pedido');
        console.log('Error desconocido al crear el pedido', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4 shadow-sm border-primary">
      <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between">
        <h5 className="card-title mb-0">Crear pedido de prueba</h5>
        <span className="badge bg-light text-primary">Demo</span>
      </div>
      <div className="card-body">
        <form className="mb-3" onSubmit={handleCrearPedido}>
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Cliente</label>
              <select className="form-select" value={clienteId} onChange={e => setClienteId(e.target.value)} required>
                <option value="">Selecciona un cliente</option>
                {clientes.map(c => (
                  <option key={c._id} value={c._id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Artículo</label>
              <div className="input-group">
                <select className="form-select" value={articuloId} onChange={e => setArticuloId(e.target.value)} required>
                  <option value="">Selecciona un artículo</option>
                  {articulos.map(a => (
                    <option key={a._id} value={a._id}>{a.nombre}</option>
                  ))}
                </select>
                {articuloId && (
                  <span className="input-group-text bg-light border-start-0">
                    <i className="bi bi-box-seam me-1"></i>
                    <span className={stockDisponible > 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                      Stock: {stockDisponible}
                    </span>
                  </span>
                )}
              </div>
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold">Cantidad</label>
              <input type="number" className="form-control" value={cantidad} min={1} max={stockDisponible || 1} onChange={e => setCantidad(Number(e.target.value))} required disabled={!articuloId || stockDisponible === 0} />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold">Precio Unitario</label>
              <input type="number" className="form-control bg-light" value={precioUnitario} disabled />
            </div>
          </div>
          {/* Resumen visual del pedido antes de enviar */}
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="alert alert-secondary mb-0 py-2 d-flex align-items-center gap-3" style={{fontSize: '1rem'}}>
                <span><i className="bi bi-person-circle me-1"></i> <b>Cliente:</b> {clientes.find(c => c._id === clienteId)?.nombre || '-'}</span>
                <span><i className="bi bi-box-seam me-1"></i> <b>Artículo:</b> {articulos.find(a => a._id === articuloId)?.nombre || '-'}</span>
                <span><i className="bi bi-hash me-1"></i> <b>Cantidad:</b> {cantidad}</span>
                <span><i className="bi bi-cash-coin me-1"></i> <b>Total:</b> ${ (cantidad * precioUnitario).toFixed(2) }</span>
              </div>
            </div>
          </div>
          <div className="mt-4 d-flex gap-2">
            <button className="btn btn-primary px-4" type="submit" disabled={loading}>
              <i className="bi bi-plus-circle me-1"></i> Crear Pedido
            </button>
            <button className="btn btn-outline-secondary" type="button" disabled={loading} onClick={() => {
              setClienteId(''); setArticuloId(''); setCantidad(1); setPrecioUnitario(0); setStockDisponible(0); setError(null); setResult(null);
            }}>
              <i className="bi bi-x-circle me-1"></i> Limpiar
            </button>
          </div>
        </form>
        {loading && <div className="text-info"><span className="spinner-border spinner-border-sm me-2"></span>Cargando...</div>}
        {error && <div className="alert alert-danger mt-2"><i className="bi bi-exclamation-triangle me-2"></i>{error}</div>}
        {result && !error && (
          <div className="alert alert-success mt-2">
            <strong><i className="bi bi-check-circle me-1"></i>¡Pedido creado correctamente!</strong>
            <br />
            ID: <span className="fw-bold">{result._id}</span><br />
            Cliente: <span className="fw-bold">{clientes.find(c => c._id === result.cliente)?.nombre || result.cliente}</span><br />
            Artículos: <span className="fw-bold">{result.detalles?.length ?? 0}</span><br />
            Estado: <span className="fw-bold text-capitalize">{result.estado}</span>
            <br />
            Fecha: <span className="fw-bold">{result.fechaCreacion ? new Date(result.fechaCreacion).toLocaleDateString() : '-'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPedidoPrueba;
