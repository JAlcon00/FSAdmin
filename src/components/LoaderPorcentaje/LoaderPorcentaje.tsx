import React from 'react';

interface LoaderPorcentajeProps {
  porcentaje: number; // 0 a 100
  texto?: string;
}

const LoaderPorcentaje: React.FC<LoaderPorcentajeProps> = ({ porcentaje, texto }) => {
  return (
    <div className="text-center my-3">
      {texto && <div className="mb-2">{texto}</div>}
      <div className="progress" style={{ height: 24 }}>
        <div
          className="progress-bar progress-bar-striped progress-bar-animated bg-info"
          role="progressbar"
          style={{ width: `${porcentaje}%` }}
          aria-valuenow={porcentaje}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {porcentaje}%
        </div>
      </div>
    </div>
  );
};

export default LoaderPorcentaje;
