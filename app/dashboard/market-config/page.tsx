import { MarketDataConfig } from "@/components/market-data-config"

export default function MarketConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuração de Dados de Mercado</h1>
        <p className="text-muted-foreground">
          Configure as APIs para obter dados financeiros em tempo real para a plataforma SIMULLAKT.
        </p>
      </div>

      <MarketDataConfig />
    </div>
  )
}
