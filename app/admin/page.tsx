export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">SIMULAK Admin</h1>
              <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">v2.010</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Voltar ao SIMULAK
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Painel Administrativo Técnico
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gerencie plugins, índices e configurações técnicas da plataforma SIMULAK
          </p>
        </div>

        {/* Technical Admin Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Development & Plugins */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Desenvolvimento</h3>
                <p className="text-sm text-gray-600">Plugins & Módulos</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Gerencie plugins, módulos e componentes da plataforma</p>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Plugins Ativos:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">3</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total de Plugins:</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">5</span>
              </div>
            </div>
            <a href="/admin/plugins" className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition-colors">
              Gerenciar Plugins
            </a>
          </div>

          {/* Data & Analytics */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Dados & Analytics</h3>
                <p className="text-sm text-gray-600">Índices & Métricas</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Configure e personalize os índices financeiros e métricas</p>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Índices Ativos:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">12</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Categorias:</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">6</span>
              </div>
            </div>
            <a href="/admin/indices" className="block w-full bg-green-600 text-white px-4 py-2 rounded-lg text-center hover:bg-green-700 transition-colors">
              Gerenciar Índices
            </a>
          </div>

          {/* System Configuration */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Sistema</h3>
                <p className="text-sm text-gray-600">Configurações & Infraestrutura</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Configurações gerais do sistema e infraestrutura</p>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">Online</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Versão:</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">v2.010</span>
              </div>
            </div>
            <a href="/admin/settings" className="block w-full bg-purple-600 text-white px-4 py-2 rounded-lg text-center hover:bg-purple-700 transition-colors">
              Configurações
            </a>
          </div>
        </div>

        {/* Technical Tools Grid */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Ferramentas Técnicas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {/* Development Tools */}
            <a href="/admin/plugins/new" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-lg">🔧</span>
              </div>
              <span className="text-xs text-center text-gray-700">Novo Plugin</span>
            </a>

            <a href="/admin/indices/new" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-lg">📈</span>
              </div>
              <span className="text-xs text-center text-gray-700">Novo Índice</span>
            </a>

            <a href="/admin/deployment" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-lg">🚀</span>
              </div>
              <span className="text-xs text-center text-gray-700">Deploy</span>
            </a>

            <a href="/admin/monitoring" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-lg">📊</span>
              </div>
              <span className="text-xs text-center text-gray-700">Monitoramento</span>
            </a>

            <a href="/admin/backup" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-lg">💾</span>
              </div>
              <span className="text-xs text-center text-gray-700">Backup</span>
            </a>

            <a href="/admin/logs" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-lg">📋</span>
              </div>
              <span className="text-xs text-center text-gray-700">Logs</span>
            </a>

            <a href="/admin/team" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-lg">👥</span>
              </div>
              <span className="text-xs text-center text-gray-700">Equipe</span>
            </a>

            <a href="/admin/analytics" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-lg">📊</span>
              </div>
              <span className="text-xs text-center text-gray-700">Analytics</span>
            </a>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm">🟢</span>
              </div>
              <h4 className="font-semibold text-gray-900">Status do Sistema</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">API Principal:</span>
                <span className="text-green-600 font-medium">Online</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Banco de Dados:</span>
                <span className="text-green-600 font-medium">Conectado</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cache:</span>
                <span className="text-green-600 font-medium">Ativo</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm">📊</span>
              </div>
              <h4 className="font-semibold text-gray-900">Métricas</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Usuários Ativos:</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Requisições/h:</span>
                <span className="font-medium">8,432</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Uptime:</span>
                <span className="font-medium">99.9%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm">⚡</span>
              </div>
              <h4 className="font-semibold text-gray-900">Performance</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">CPU:</span>
                <span className="font-medium">23%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Memória:</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Disco:</span>
                <span className="font-medium">67%</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
