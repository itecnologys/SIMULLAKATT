import IndicesGrid from "./components/IndicesGrid";
import IndicesErrorBoundary from "@/components/IndicesModule";

export default function IndicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-100">
      <IndicesErrorBoundary>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              📊 Mercados Financeiros
            </h1>
            <p className="text-lg text-gray-600">
              Acompanhe índices, ações, criptomoedas e mais em tempo real
            </p>
          </div>
          
          {/* Grid de Índices */}
          <IndicesGrid />
          
          {/* Informações Adicionais */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                📈 Análise Técnica
              </h3>
              <p className="text-gray-600">
                Análises técnicas dos principais ativos de cada mercado.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                📊 Estatísticas
              </h3>
              <p className="text-gray-600">
                Estatísticas detalhadas e métricas de performance por mercado.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                🔔 Alertas
              </h3>
              <p className="text-gray-600">
                Configure alertas para movimentos significativos em qualquer ativo.
              </p>
            </div>
          </div>
        </div>
      </IndicesErrorBoundary>
    </div>
  );
}
