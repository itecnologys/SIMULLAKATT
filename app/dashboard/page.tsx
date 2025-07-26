"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  ArrowRight,
  Settings,
  LineChart,
  BarChart2,
  Bitcoin,
  DollarSign,
  Droplet,
  TrendingUp,
  Search,
  Calculator,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { getMarketData, calculateSuggestedRate } from "@/lib/simple-market-service"

// Universos simplificados
const universes = [
  { id: "stocks", name: "Ações", icon: BarChart2 },
  { id: "crypto", name: "Crypto", icon: Bitcoin },
  { id: "forex", name: "Forex", icon: DollarSign },
  { id: "commodities", name: "Commodities", icon: Droplet },
  { id: "indices", name: "Índices", icon: TrendingUp },
]

// Ativos simplificados
const assets = {
  stocks: [
    { id: "AAPL", name: "Apple Inc." },
    { id: "MSFT", name: "Microsoft Corporation" },
  ],
  crypto: [
    { id: "BTC", name: "Bitcoin" },
    { id: "ETH", name: "Ethereum" },
  ],
  forex: [{ id: "EUR/USD", name: "Euro / US Dollar" }],
  commodities: [{ id: "GOLD", name: "Gold" }],
  indices: [{ id: "S&P500", name: "S&P 500" }],
}

export default function DashboardPage() {
  const [selectedUniverse, setSelectedUniverse] = useState<string>("")
  const [selectedAsset, setSelectedAsset] = useState<string>("")
  const [customProfitRate, setCustomProfitRate] = useState<number>(2.5)
  const [activeTab, setActiveTab] = useState<string>("simulation")
  const router = useRouter()

  // Callbacks simples
  const handleUniverseChange = useCallback((universe: string) => {
    setSelectedUniverse(universe)
    setSelectedAsset("")
  }, [])

  const handleAssetChange = useCallback((asset: string) => {
    setSelectedAsset(asset)
    const suggestedRate = calculateSuggestedRate(asset)
    setCustomProfitRate(suggestedRate)
  }, [])

  const handleStartSimulation = useCallback(() => {
    router.push(`/dashboard/setup?profitRate=${customProfitRate}&universe=${selectedUniverse}&asset=${selectedAsset}`)
  }, [customProfitRate, selectedUniverse, selectedAsset, router])

  // Obter ativos do universo selecionado
  const currentAssets = selectedUniverse ? assets[selectedUniverse as keyof typeof assets] || [] : []

  // Obter dados do ativo selecionado
  const assetData = selectedAsset ? getMarketData(selectedAsset) : null

  // Nome completo do ativo
  const assetFullName =
    selectedAsset && selectedUniverse ? currentAssets.find((a) => a.id === selectedAsset)?.name || selectedAsset : ""

  return (
    <div className="space-y-4">
      {/* Cabeçalho Simples */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-card p-4 rounded-lg border">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{selectedAsset ? `${assetFullName} (${selectedAsset})` : "Dashboard"}</h2>
          {selectedAsset && <Badge variant="outline">{universes.find((u) => u.id === selectedUniverse)?.name}</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/analysis")}>
            <LineChart className="mr-2 h-4 w-4" />
            Análise
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard/setup")}>
            <Settings className="mr-2 h-4 w-4" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Layout Principal */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-4">
          {/* Tabs */}
          <Card>
            <CardContent className="p-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="analysis">
                    <Search className="h-4 w-4 mr-1" />
                    Análise
                  </TabsTrigger>
                  <TabsTrigger value="simulation">
                    <Calculator className="h-4 w-4 mr-1" />
                    Simulação
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Seleção de Universo */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Selecionar Ativo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Universos */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Universo</label>
                <div className="grid grid-cols-1 gap-2">
                  {universes.map((universe) => (
                    <Button
                      key={universe.id}
                      variant={selectedUniverse === universe.id ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => handleUniverseChange(universe.id)}
                    >
                      <universe.icon className="h-4 w-4 mr-2" />
                      {universe.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Ativos */}
              {selectedUniverse && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ativo</label>
                  <div className="space-y-1">
                    {currentAssets.map((asset) => {
                      const data = getMarketData(asset.id)
                      return (
                        <Button
                          key={asset.id}
                          variant={selectedAsset === asset.id ? "default" : "outline"}
                          className="w-full justify-start text-left h-auto p-3"
                          onClick={() => handleAssetChange(asset.id)}
                        >
                          <div className="flex flex-col items-start">
                            <div className="font-medium">{asset.id}</div>
                            <div className="text-xs text-muted-foreground">{asset.name}</div>
                            {data && (
                              <div className="text-xs font-medium mt-1">
                                {data.price.toLocaleString()}
                                <span className={data.changePercent >= 0 ? "text-green-500 ml-1" : "text-red-500 ml-1"}>
                                  {data.changePercent >= 0 ? "+" : ""}
                                  {data.changePercent.toFixed(2)}%
                                </span>
                              </div>
                            )}
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Taxa de Lucro */}
          {selectedAsset && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Taxa de Lucro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary/5 p-3 rounded-md border">
                  <div className="text-2xl font-bold text-primary">{customProfitRate.toFixed(2)}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Taxa sugerida</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Ajustar</label>
                    <span className="text-sm font-medium">{customProfitRate.toFixed(2)}%</span>
                  </div>
                  <Slider
                    value={[customProfitRate]}
                    min={0.1}
                    max={10}
                    step={0.1}
                    onValueChange={(value) => setCustomProfitRate(value[0])}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleStartSimulation}>
                  Iniciar Simulação
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Área Principal */}
        <div className="md:col-span-3">
          {activeTab === "analysis" ? (
            <Card>
              <CardHeader>
                <CardTitle>Análise de Preços</CardTitle>
                <CardDescription>
                  {selectedAsset ? `Análise do ativo ${selectedAsset}` : "Selecione um ativo para análise"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedAsset && assetData ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Preço Atual</div>
                        <div className="text-2xl font-bold">{assetData.price.toLocaleString()}</div>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Variação</div>
                        <div
                          className={`text-2xl font-bold ${assetData.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {assetData.changePercent >= 0 ? "+" : ""}
                          {assetData.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">Recomendação</div>
                      <div className="text-lg">
                        Taxa de lucro sugerida:{" "}
                        <span className="font-bold text-primary">
                          {calculateSuggestedRate(selectedAsset).toFixed(2)}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Baseada na volatilidade atual do ativo</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhum ativo selecionado</h3>
                    <p className="text-muted-foreground">Selecione um ativo para ver a análise</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Configurar Simulação</CardTitle>
                <CardDescription>
                  {selectedAsset ? `Simulação para ${selectedAsset}` : "Selecione um ativo para simular"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedAsset ? (
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Parâmetros da Simulação</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Ativo</p>
                          <p className="font-medium">
                            {assetFullName} ({selectedAsset})
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Taxa de Lucro</p>
                          <p className="font-medium">{customProfitRate.toFixed(2)}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button size="lg" onClick={handleStartSimulation}>
                        Configurar Parâmetros Detalhados
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhum ativo selecionado</h3>
                    <p className="text-muted-foreground">Selecione um ativo para configurar a simulação</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
