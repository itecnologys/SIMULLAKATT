// Configuração de módulos ativos/inativos
export interface ModuleConfig {
  id: string;
  name: string;
  enabled: boolean;
  path: string;
  description: string;
}

export const ACTIVE_MODULES: ModuleConfig[] = [
  {
    id: "indices",
    name: "Índices de Mercado",
    enabled: true, // Pode ser alterado para false para desativar
    path: "/indices",
    description: "Módulo de índices de mercado independente"
  }
];

export const isModuleEnabled = (moduleId: string): boolean => {
  const module = ACTIVE_MODULES.find(m => m.id === moduleId);
  return module?.enabled ?? false;
};

export const getModuleConfig = (moduleId: string): ModuleConfig | undefined => {
  return ACTIVE_MODULES.find(m => m.id === moduleId);
};
