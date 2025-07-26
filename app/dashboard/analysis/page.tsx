"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import UniverseSelector from "@/components/universe-selector"
import PriceVariationAnalysis from "@/components/price-variation-analysis"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AnalysisPage() {
  const [selectedUniverse, setSelectedUniverse] = useState<string>("")
  const [selectedAsset, setSelectedAsset] = useState<string>("")
  const [suggestedProfitRate, setSuggestedProfitRate] = useState<number | null>(null)
  const router = useRouter()

  const handleUniverseChange = (universe: string) => {
    setSelectedUniverse(universe)
    setSelectedAsset("")
  }

  const handleAssetChange = (asset: string) => {
    setSelectedAsset(asset)
  }

  const handleProfitRateChange = (rate: number) => {
    setSuggestedProfitRate(rate)
  }

  const handleStartSimulation = () => {
    if (suggestedProfitRate !== null) {
      // Redirecionar para a página de simulação com a taxa de lucro sugerida
      router.push(
        `/dashboard/setup?profitRate=${suggestedProfitRate}&universe=${selectedUniverse}&asset=${selectedAsset}`,
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Análise de Mercado</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Seletor de Universo e Ativo - 4 colunas */}
        <div className="md:col-span-4">
          <UniverseSelector onUniverseChange={handleUniverseChange} onAssetChange={handleAssetChange} />
        </div>

        {/* Análise de Variação de Preços - 8 colunas */}
        <div className="md:col-span-8">
          <PriceVariationAnalysis universe={selectedUniverse} asset={selectedAsset} />
        </div>
      </div>

      {/* Botão para iniciar simulação */}
      <div className="flex justify-end">
        <Button onClick={handleStartSimulation} disabled={!selectedAsset || suggestedProfitRate === null}>
          Iniciar Simulação com Taxa Sugerida
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
