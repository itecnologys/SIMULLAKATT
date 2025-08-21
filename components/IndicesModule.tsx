"use client";
import React, { Component, ReactNode } from "react";
import { isModuleEnabled } from "@/config/modules";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class IndicesErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Erro no módulo de Índices:", error, errorInfo);
    // Aqui você pode enviar para um serviço de monitoramento
    // mas não afeta o resto da aplicação
  }

  render() {
    // Se o módulo está desabilitado, não renderiza nada
    if (!isModuleEnabled("indices")) {
      return null;
    }

    // Se há erro, mostra fallback ou mensagem padrão
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Módulo de Índices Temporariamente Indisponível
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>O módulo de índices está enfrentando problemas técnicos.</p>
                <p className="mt-1">A aplicação principal continua funcionando normalmente.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default IndicesErrorBoundary;
