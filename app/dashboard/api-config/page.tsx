"use client"

import ApiConfigurationForm from "@/components/api-configuration-form"

export default function ApiConfigPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Configuração de APIs</h2>
        <p className="text-muted-foreground">
          Configure as APIs para obter dados financeiros precisos para suas análises
        </p>
      </div>

      <ApiConfigurationForm />
    </div>
  )
}
