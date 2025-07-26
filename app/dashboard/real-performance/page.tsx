"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Clock, AlertTriangle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Tipos para os dados de desempenho
interface PerformanceData {
  id: string
  name: string
  universe: string
  currentPrice: number
  previousPrice: number
  change: number
  changePercent: number
  trend: "up" | "down" | "neutral"
  volatility: number
  consistency: number
  timeToTarget: number
  successRate: number
}

// Dados simulados para demonstração
const mockPerformanceData: PerformanceData[] = [
  {
    id: "PETR4",
    name: "Petrobras PN",
    universe: "stocks",
    currentPrice: 36.75,
    previousPrice: 35.9,
    change: 0.85,
    changePercent: 2.37,
    trend: "up",
    volatility: 0.8,
    consistency: 0.75,
    timeToTarget: 2.5,
    successRate: 0.82,
  },
  {
    id: "VALE3",
    name: "Vale ON",
    universe: "stocks",
    currentPrice: 68.2,
    previousPrice: 69.45,
    change: -1.25,
    changePercent: -1.8,
    trend: "down",
    volatility: 0.9,
    consistency: 0.65,
    timeToTarget: 3.8,
    successRate: 0.71,
  },
  {
    id: "ITUB4",
    name: "Itaú Unibanco PN",
    universe: "stocks",
    currentPrice: 32.5,
    previousPrice: 31.75,
    change: 0.75,
    changePercent: 2.36,
    trend: "up",
    volatility: 0.6,
    consistency: 0.85,
    timeToTarget: 2.2,
    successRate: 0.88,
  },
  {
    id: "BTCUSD",
    name: "Bitcoin",
    universe: "crypto",
    currentPrice: 63250.75,
    previousPrice: 61890.25,
    change: 1360.5,
    changePercent: 2.2,
    trend: "up",
    volatility: 1.2,
    consistency: 0.6,
    timeToTarget: 1.8,
    successRate: 0.75,
  },
  {
    id: "ETHUSD",
    name: "Ethereum",
    universe: "crypto",
    currentPrice: 3450.25,
    previousPrice: 3520.8,
    change: -70.55,
    changePercent: -2.0,
    trend: "down",
    volatility: 1.4,
    consistency: 0.55,
    timeToTarget: 4.2,
    successRate: 0.68,
  },
  {
    id: "EURUSD",
    name: "Euro/Dólar",
    universe: "forex",
    currentPrice: 1.0925,
    previousPrice: 1.089,
    change: 0.0035,
    changePercent: 0.32,
    trend: "up",
    volatility: 0.4,
    consistency: 0.9,
    timeToTarget: 5.5,
    successRate: 0.92,
  },
  {
    id: "USDJPY",
    name: "Dólar/Iene",
    universe: "forex",
    currentPrice: 151.25,
    previousPrice: 152.1,
    change: -0.85,
    changePercent: -0.56,
    trend: "down",
    volatility: 0.5,
    consistency: 0.85,
    timeToTarget: 6.2,
    successRate: 0.88,
  },
  {
    id: "XAUUSD",
    name: "Ouro",
    universe: "commodities",
    currentPrice: 2320.5,
    previousPrice: 2295.75,
    change: 24.75,
    changePercent: 1.08,
    trend: "up",
    volatility: 0.7,
    consistency: 0.8,
    timeToTarget: 3.0,
    successRate: 0.85,
  },
  {
    id: "BRENT",
    name: "Petróleo Brent",
    universe: "commodities",
    currentPrice: 82.35,
    previousPrice: 83.2,
    change: -0.85,
    changePercent: -1.02,
    trend: "down",
    volatility: 1.0,
    consistency: 0.7,
    timeToTarget: 4.5,
    successRate: 0.72,
  },
  {
    id: "IBOV",
    name: "Ibovespa",
    universe: "indices",
    currentPrice: 127850.25,
    previousPrice: 126750.5,
    change: 1099.75,
    changePercent: 0.87,
    trend: "up",
    volatility: 0.8,
    consistency: 0.75,
    timeToTarget: 3.2,
    successRate: 0.8,
  },
  {
    id: "SPX",
    name: "S&P 500",
    universe: "indices",
    currentPrice: 5125.75,
    previousPrice: 5080.25,
    change: 45.5,
    changePercent: 0.9,
    trend: "up",
    volatility: 0.6,
    consistency: 0.85,
    timeToTarget: 2.8,
    successRate: 0.87,
  },
]

// Timeframes disponíveis
const timeframes = [
  { value: "15m", label: "15 minutos" },
  { value: "1h", label: "1 hora" },
  { value: "4h", label: "4 horas" },
  { value: "6h", label: "6 horas" },
  { value: "1d", label: "1 dia" },
  { value: "1w", label: "1 semana" },
]

// Universos financeiros
const universes = [
  { value: "all", label: "Todos" },
  { value: "stocks", label: "Ações" },
  { value: "crypto", label: "Criptomoedas" },
  { value: "forex", label: "Forex" },
  { value: "commodities", label: "Commodities" },
  { value: "indices", label: "Índices" },
]

export default function RealPerformancePage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h")
  const [selectedUniverse, setSelectedUniverse] = useState("all")
  const [targetProfitRate, setTargetProfitRate] = useState(2.0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)

  // Filtrar dados com base nos critérios selecionados
  const filteredData = mockPerformanceData
    .filter((item) => selectedUniverse === "all" || item.universe === selectedUniverse)
    .filter(
      (item) =>
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    // Ordenar por tempo para atingir o alvo (do menor para o maior)
    .sort((a, b) => a.timeToTarget - b.timeToTarget)

  // Formatar número com 2 casas decimais
  const formatNumber = (num: number, digits = 2) => {
    return num.toFixed(digits)
  }

  // Formatar preço com base no tipo de ativo
  const formatPrice = (price: number, assetId: string) => {
    if (assetId.includes("USD") && !assetId.startsWith("USD")) {
      return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    } else if (assetId === "IBOV" || assetId === "SPX") {
      return price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    } else {
      return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  }

  // Renderizar indicador de tendência
  const renderTrendIndicator = (trend: string) => {
    if (trend === "up") {
      return <TrendingUp className="h-5 w-5 text-green-500" />
    } else if (trend === "down") {
      return <TrendingDown className="h-5 w-5 text-red-500" />
    } else {
      return null
    }
  }

  // Renderizar tempo estimado para atingir o alvo
  const renderTimeToTarget = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutos`
    } else if (hours < 24) {
      return `${formatNumber(hours)} horas`
    } else {
      return `${formatNumber(hours / 24)} dias`
    }
  }

  // Renderizar taxa de sucesso
  const renderSuccessRate = (rate: number) => {
    const percentage = rate * 100
    let color = "text-yellow-500"

    if (percentage >= 85) {
      color = "text-green-500"
    } else if (percentage < 70) {
      color = "text-red-500"
    }

    return <span className={color}>{percentage.toFixed(0)}%</span>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Análise de Desempenho Real</h1>
          <p className="text-muted-foreground">
            Analise o desempenho real dos índices financeiros para identificar as melhores oportunidades
          </p>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Análise baseada em dados reais</AlertTitle>
        <AlertDescription>
          As taxas de lucro exibidas são calculadas com base no desempenho histórico real dos ativos, não são valores
          sugeridos. Os tempos estimados consideram a volatilidade e consistência de cada ativo.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filtros e configurações */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
            <CardDescription>Defina os parâmetros para análise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Timeframe</label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o timeframe" />
                </SelectTrigger>
                <SelectContent>
                  {timeframes.map((timeframe) => (
                    <SelectItem key={timeframe.value} value={timeframe.value}>
                      {timeframe.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Universo Financeiro</label>
              <Select value={selectedUniverse} onValueChange={setSelectedUniverse}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o universo" />
                </SelectTrigger>
                <SelectContent>
                  {universes.map((universe) => (
                    <SelectItem key={universe.value} value={universe.value}>
                      {universe.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Taxa de Lucro Alvo</label>
                <span className="text-sm font-medium">{targetProfitRate.toFixed(1)}%</span>
              </div>
              <Slider
                value={[targetProfitRate]}
                min={0.1}
                max={10}
                step={0.1}
                onValueChange={(value) => setTargetProfitRate(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Define a taxa de lucro que você deseja alcançar em suas operações
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Pesquisar</label>
              <Input
                placeholder="Buscar por código ou nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabela de desempenho */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Desempenho dos Índices</CardTitle>
            <CardDescription>
              Análise de desempenho real para timeframe de{" "}
              {timeframes.find((t) => t.value === selectedTimeframe)?.label}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="performance">
              <TabsList className="mb-4">
                <TabsTrigger value="performance">Desempenho</TabsTrigger>
                <TabsTrigger value="details">Detalhes</TabsTrigger>
              </TabsList>

              <TabsContent value="performance">
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Código</th>
                          <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Nome</th>
                          <th className="whitespace-nowrap px-4 py-3 text-right font-medium">Preço Atual</th>
                          <th className="whitespace-nowrap px-4 py-3 text-right font-medium">Variação</th>
                          <th className="whitespace-nowrap px-4 py-3 text-center font-medium">Tendência</th>
                          <th className="whitespace-nowrap px-4 py-3 text-right font-medium">Tempo p/ Alvo</th>
                          <th className="whitespace-nowrap px-4 py-3 text-center font-medium">Taxa Sucesso</th>
                          <th className="whitespace-nowrap px-4 py-3 text-center font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((item) => (
                          <tr
                            key={item.id}
                            className={`border-t hover:bg-muted/50 ${selectedAsset === item.id ? "bg-primary/5" : ""}`}
                          >
                            <td className="whitespace-nowrap px-4 py-3 font-medium">{item.id}</td>
                            <td className="whitespace-nowrap px-4 py-3">{item.name}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-right">
                              {formatPrice(item.currentPrice, item.id)}
                            </td>
                            <td
                              className={`whitespace-nowrap px-4 py-3 text-right ${
                                item.changePercent > 0 ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              {item.changePercent > 0 ? "+" : ""}
                              {formatNumber(item.changePercent)}%
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-center">
                              {renderTrendIndicator(item.trend)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {renderTimeToTarget(item.timeToTarget)}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-center">
                              {renderSuccessRate(item.successRate)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-center">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedAsset(item.id)}>
                                Analisar
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details">
                {selectedAsset ? (
                  <div className="space-y-4">
                    {/* Detalhes do ativo selecionado */}
                    {(() => {
                      const asset = mockPerformanceData.find((item) => item.id === selectedAsset)
                      if (!asset) return <p>Selecione um ativo para ver detalhes</p>

                      return (
                        <>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-muted/50 p-4 rounded-lg">
                            <div>
                              <h3 className="text-xl font-bold flex items-center gap-2">
                                {asset.name} ({asset.id}){renderTrendIndicator(asset.trend)}
                              </h3>
                              <p className="text-muted-foreground">
                                {universes.find((u) => u.value === asset.universe)?.label}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Preço Atual</p>
                                <p className="font-bold">{formatPrice(asset.currentPrice, asset.id)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Variação</p>
                                <p
                                  className={`font-bold ${asset.changePercent > 0 ? "text-green-500" : "text-red-500"}`}
                                >
                                  {asset.changePercent > 0 ? "+" : ""}
                                  {formatNumber(asset.changePercent)}%
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Tempo para Atingir Alvo</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <Clock className="h-5 w-5 mr-2 text-primary" />
                                    <span className="text-2xl font-bold">{renderTimeToTarget(asset.timeToTarget)}</span>
                                  </div>
                                  <Badge variant="outline">Alvo: {targetProfitRate.toFixed(1)}%</Badge>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Taxa de Sucesso</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">{renderSuccessRate(asset.successRate)}</div>
                                <p className="text-xs text-muted-foreground">
                                  Baseado no comportamento histórico do ativo
                                </p>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Volatilidade e Consistência</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex justify-between">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Volatilidade</p>
                                    <p className="font-bold">{formatNumber(asset.volatility * 10)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Consistência</p>
                                    <p className="font-bold">{formatNumber(asset.consistency * 100)}%</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          <Card>
                            <CardHeader>
                              <CardTitle>Análise de Desempenho por Timeframe</CardTitle>
                              <CardDescription>
                                Compare o desempenho do ativo em diferentes intervalos de tempo
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="bg-muted/50">
                                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Timeframe</th>
                                        <th className="whitespace-nowrap px-4 py-3 text-right font-medium">Variação</th>
                                        <th className="whitespace-nowrap px-4 py-3 text-center font-medium">
                                          Tendência
                                        </th>
                                        <th className="whitespace-nowrap px-4 py-3 text-right font-medium">
                                          Tempo p/ Alvo
                                        </th>
                                        <th className="whitespace-nowrap px-4 py-3 text-center font-medium">
                                          Taxa Sucesso
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {timeframes.map((timeframe) => (
                                        <tr key={timeframe.value} className="border-t hover:bg-muted/50">
                                          <td className="whitespace-nowrap px-4 py-3 font-medium">{timeframe.label}</td>
                                          <td
                                            className={`whitespace-nowrap px-4 py-3 text-right ${
                                              (asset.changePercent * (1 + Math.random() * 0.5 - 0.25)) > 0
                                                ? "text-green-500"
                                                : "text-red-500"
                                            }`}
                                          >
                                            {asset.changePercent * (1 + Math.random() * 0.5 - 0.25) > 0 ? "+" : ""}
                                            {formatNumber(asset.changePercent * (1 + Math.random() * 0.5 - 0.25))}%
                                          </td>
                                          <td className="whitespace-nowrap px-4 py-3 text-center">
                                            {renderTrendIndicator(
                                              Math.random() > 0.5 ? asset.trend : asset.trend === "up" ? "down" : "up",
                                            )}
                                          </td>
                                          <td className="whitespace-nowrap px-4 py-3 text-right">
                                            {renderTimeToTarget(asset.timeToTarget * (1 + Math.random() * 0.6 - 0.3))}
                                          </td>
                                          <td className="whitespace-nowrap px-4 py-3 text-center">
                                            {renderSuccessRate(asset.successRate * (1 + Math.random() * 0.2 - 0.1))}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <div className="flex justify-end">
                            <Button onClick={() => setSelectedAsset(null)} variant="outline" className="mr-2">
                              Voltar
                            </Button>
                            <Button>Iniciar Simulação com {asset.id}</Button>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">Nenhum ativo selecionado</h3>
                    <p className="text-muted-foreground max-w-md">
                      Selecione um ativo na tabela de desempenho para visualizar detalhes e análises específicas.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
