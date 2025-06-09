import React from 'react';
import ResumenGeneral from '../components/Dashboard/ResumenGeneral';
import GraficaVentasUltimos7Dias from '../components/Dashboard/GraficaVentasUltimos7Dias';
import GraficaPedidosPorEstado from '../components/Dashboard/GraficaPedidosPorEstado';
import ArticulosMasVendidos from '../components/Dashboard/ArticulosMasVendidos';


const Dashboard: React.FC = () => {
  return (
    <div className="container-fluid py-4">
      <h1 className="mb-4 fw-bold">Dashboard</h1>
      <ResumenGeneral />
      <div className="row mt-4">
        <div className="col-lg-7 mb-4">
          <GraficaVentasUltimos7Dias />
        </div>
        <div className="col-lg-5 mb-4">
          <GraficaPedidosPorEstado />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <ArticulosMasVendidos />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
