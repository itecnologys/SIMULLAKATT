export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">SIMULAK Admin</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Painel Administrativo
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gerencie plugins, índices e configurações da plataforma SIMULAK
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">🔌 Gerenciar Plugins</h3>
            <p className="text-gray-600 mb-4">Cadastre, configure e gerencie plugins da plataforma</p>
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg">
              Gerenciar Plugins
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">📊 Gerenciar Índices</h3>
            <p className="text-gray-600 mb-4">Configure e personalize os índices financeiros</p>
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg">
              Gerenciar Índices
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">⚙️ Configurações</h3>
            <p className="text-gray-600 mb-4">Configurações gerais do sistema e plataforma</p>
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg">
              Configurações
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
