export default function PluginsManagement() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="/admin" className="mr-4 text-gray-600 hover:text-gray-900">←</a>
              <h1 className="text-2xl font-bold text-gray-900">Gerenciar Plugins</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                ➕ Novo Plugin
              </button>
              <a href="/admin" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Voltar ao Admin
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Plugins</label>
              <input
                type="text"
                placeholder="Buscar por nome, descrição ou categoria..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                5 de 5 plugins
              </div>
            </div>
          </div>
        </div>

        {/* Plugins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Plugin 1 - Indices Module */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm">📊</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Módulo de Índices</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Exibe um grid de cards com índices de diversos mercados financeiros
                  </p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Ativo</span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Versão:</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Categoria:</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Financeiro</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Autor:</span>
                  <span className="font-medium">SIMULAK Team</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Última Atualização:</span>
                  <span className="font-medium text-xs">2024-08-21</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" checked className="rounded" />
                  <span className="text-sm">Ativo</span>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    Configurar
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    Detalhes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Plugin 2 - Market Ticker */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm">📈</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Market Ticker</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Componente de ticker para dados de mercado em tempo real
                  </p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Ativo</span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Versão:</span>
                  <span className="font-medium">2.1.0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Categoria:</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Financeiro</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Autor:</span>
                  <span className="font-medium">SIMULAK Team</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Última Atualização:</span>
                  <span className="font-medium text-xs">2024-08-20</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" checked className="rounded" />
                  <span className="text-sm">Ativo</span>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    Configurar
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    Detalhes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Plugin 3 - Crypto Ticker */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm">₿</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Crypto Ticker</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Componente para exibição de dados de criptomoedas
                  </p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Ativo</span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Versão:</span>
                  <span className="font-medium">1.5.0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Categoria:</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Criptomoedas</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Autor:</span>
                  <span className="font-medium">SIMULAK Team</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Última Atualização:</span>
                  <span className="font-medium text-xs">2024-08-19</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" checked className="rounded" />
                  <span className="text-sm">Ativo</span>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    Configurar
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    Detalhes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Plugin 4 - Analytics Dashboard */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm">📊</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Painel de análises avançadas e relatórios
                  </p>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">Inativo</span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Versão:</span>
                  <span className="font-medium">3.0.0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Categoria:</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Analytics</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Autor:</span>
                  <span className="font-medium">SIMULAK Team</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Última Atualização:</span>
                  <span className="font-medium text-xs">2024-08-15</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Inativo</span>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    Configurar
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    Detalhes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Plugin 5 - Backup Manager */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm">💾</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Backup Manager</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Sistema de backup automático e restauração
                  </p>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">Erro</span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Versão:</span>
                  <span className="font-medium">1.2.0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Categoria:</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Sistema</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Autor:</span>
                  <span className="font-medium">SIMULAK Team</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Última Atualização:</span>
                  <span className="font-medium text-xs">2024-08-10</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Inativo</span>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    Configurar
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    Detalhes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
