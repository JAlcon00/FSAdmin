import React from 'react';
import type { ErrorInfo } from 'react';
import { toast } from 'react-toastify';

interface Props { children: React.ReactNode; }
interface State { hasError: boolean; }

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error:', error, info);
    toast.error('Ha ocurrido un error inesperado.');
  }

  render() {
    if (this.state.hasError) {
      return <h2>Algo salió mal en la aplicación.</h2>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
