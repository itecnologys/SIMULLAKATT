import { isModuleEnabled } from "@/config/modules";

export default function IndicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificar se o módulo está habilitado
  if (!isModuleEnabled("indices")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Módulo de Índices Desabilitado
          </h1>
          <p className="text-gray-600">
            Este módulo está temporariamente indisponível.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
