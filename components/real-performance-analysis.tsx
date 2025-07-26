"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowUpIcon, ArrowDownIcon, RefreshCw, Clock } from "lucide-react"
import { PerformanceMetrics } from "./performance-metrics"
import { TradingViewChart } from "./trading-view-chart"

// Tipos para os dados de desempenho
interface PerformanceData {
  symbol: string
  name: string
  currentPrice: number
  change: number
  changePercent: number
  volume: number
  realProfitRate: number
  timeframes: {
    [key: string]: {
      trend: "up" | "down" | "neutral"
      performance: number
      volatility: number
      consistency: number
      successRate: number
    }
  }
}

// Dados simulados para demonstração
const mockPerformanceData: PerformanceData[] = [
  {
    symbol: "BTCUSD",
    name: "Bitcoin",
    currentPrice: 63245.78,
    change: 1250.45,
    changePercent: 2.01,
    volume: 24500000000,
    realProfitRate: 2.35,
    timeframes: {
      "15m": { trend: "up", performance: 0.45, volatility: 0.8, consistency: 0.75, successRate: 0.68 },
      "1h": { trend: "up", performance: 1.2, volatility: 0.6, consistency: 0.82, successRate: 0.72 },
      "4h": { trend: "up", performance: 2.35, volatility: 0.5, consistency: 0.88, successRate: 0.78 },
      "6h": { trend: "up", performance: 2.8, volatility: 0.45, consistency: 0.85, successRate: 0.76 },
      "24h": { trend: "up", performance: 3.5, volatility: 0.4, consistency: 0.9, successRate: 0.82 },
      "1w": { trend: "up", performance: 8.2, volatility: 0.65, consistency: 0.7, successRate: 0.65 },
    },
  },
  {
    symbol: "ETHUSD",
    name: "Ethereum",
    currentPrice: 3456.89,
    change: -45.67,
    changePercent: -1.3,
    volume: 12300000000,
    realProfitRate: 1.85,
    timeframes: {
      "15m": { trend: "down", performance: -0.3, volatility: 0.9, consistency: 0.65, successRate: 0.58 },
      "1h": { trend: "down", performance: -0.8, volatility: 0.75, consistency: 0.7, successRate: 0.62 },
      "4h": { trend: "neutral", performance: 0.1, volatility: 0.6, consistency: 0.75, successRate: 0.68 },
      "6h": { trend: "up", performance: 0.5, volatility: 0.55, consistency: 0.8, successRate: 0.72 },
      "24h": { trend: "up", performance: 1.85, volatility: 0.5, consistency: 0.85, successRate: 0.76 },
      "1w": { trend: "up", performance: 5.4, volatility: 0.7, consistency: 0.75, successRate: 0.7 },
    },
  },
  {
    symbol: "EURUSD",
    name: "Euro/USD",
    currentPrice: 1.0845,
    change: 0.0023,
    changePercent: 0.21,
    volume: 98500000000,
    realProfitRate: 0.35,
    timeframes: {
      "15m": { trend: "neutral", performance: 0.05, volatility: 0.3, consistency: 0.9, successRate: 0.82 },
      "1h": { trend: "up", performance: 0.15, volatility: 0.25, consistency: 0.92, successRate: 0.85 },
      "4h": { trend: "up", performance: 0.35, volatility: 0.2, consistency: 0.95, successRate: 0.88 },
      "6h": { trend: "up", performance: 0.4, volatility: 0.2, consistency: 0.94, successRate: 0.87 },
      "24h": { trend: "up", performance: 0.65, volatility: 0.25, consistency: 0.9, successRate: 0.84 },
      "1w": { trend: "neutral", performance: 0.8, volatility: 0.4, consistency: 0.85, successRate: 0.78 },
    },
  },
  {
    symbol: "XAUUSD",
    name: "Gold",
    currentPrice: 2345.67,
    change: 15.45,
    changePercent: 0.66,
    volume: 45600000000,
    realProfitRate: 0.85,
    timeframes: {
      "15m": { trend: "neutral", performance: 0.1, volatility: 0.4, consistency: 0.85, successRate: 0.78 },
      "1h": { trend: "up", performance: 0.3, volatility: 0.35, consistency: 0.88, successRate: 0.8 },
      "4h": { trend: "up", performance: 0.85, volatility: 0.3, consistency: 0.9, successRate: 0.84 },
      "6h": { trend: "up", performance: 1.0, volatility: 0.3, consistency: 0.9, successRate: 0.84 },
      "24h": { trend: "up", performance: 1.5, volatility: 0.35, consistency: 0.88, successRate: 0.82 },
      "1w": { trend: "up", performance: 3.2, volatility: 0.5, consistency: 0.8, successRate: 0.75 },
    },
  },
  {
    symbol: "USDJPY",
    name: "USD/JPY",
    currentPrice: 154.32,
    change: -0.45,
    changePercent: -0.29,
    volume: 78900000000,
    realProfitRate: 0.45,
    timeframes: {
      "15m": { trend: "down", performance: -0.1, volatility: 0.35, consistency: 0.88, successRate: 0.8 },
      "1h": { trend: "down", performance: -0.25, volatility: 0.3, consistency: 0.9, successRate: 0.84 },
      "4h": { trend: "neutral", performance: 0.05, volatility: 0.25, consistency: 0.92, successRate: 0.86 },
      "6h": { trend: "up", performance: 0.2, volatility: 0.25, consistency: 0.92, successRate: 0.86 },
      "24h": { trend: "up", performance: 0.45, volatility: 0.3, consistency: 0.9, successRate: 0.84 },
      "1w": { trend: "down", performance: -0.8, volatility: 0.45, consistency: 0.82, successRate: 0.76 },
    },
  },
]

// Função para calcular a taxa de lucro real baseada em dados históricos
const calculateRealProfitRate = (data: any, timeframe: string) => {
  // Em uma implementação real, isso seria calculado com base em dados históricos reais
  // e algoritmos de análise técnica mais sofisticados
  if (!data || !data.timeframes || !data.timeframes[timeframe]) {
    return 0
  }

  const { performance, volatility, consistency, successRate } = data.timeframes[timeframe]

  // Fórmula que considera performance, volatilidade, consistência e taxa de sucesso
  // para calcular uma taxa de lucro real baseada em dados históricos
  const realProfitRate = (performance * (1 + successRate)) / (1 + volatility * (1 - consistency))

  return Number.parseFloat(realProfitRate.toFixed(2))
}

// Função para determinar a melhor oportunidade baseada nos critérios do usuário
const determineBestOpportunity = (data: PerformanceData[], timeframe: string, profitTarget: number) => {
  return data
    .map((item) => ({
      ...item,
      calculatedProfit: calculateRealProfitRate(item, timeframe),
      timeToTarget: (profitTarget / calculateRealProfitRate(item, timeframe)) * getTimeframeInHours(timeframe),
    }))
    .sort((a, b) => a.timeToTarget - b.timeToTarget)
}

// Função para converter timeframe em horas
const getTimeframeInHours = (timeframe: string) => {
  switch (timeframe) {
    case "15m":
      return 0.25
    case "1h":
      return 1
    case "4h":
      return 4
    case "6h":
      return 6
    case "24h":
      return 24
    case "1w":
      return 168 // 7 * 24
    default:
      return 1
  }
}

export function RealPerformanceAnalysis() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("4h")
  const [profitTarget, setProfitTarget] = useState(2) // 2% como alvo padrão
  const [sortedData, setSortedData] = useState<PerformanceData[]>([])
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Simula carregamento de dados
  const loadData = () => {
    setIsLoading(true)
    setTimeout(() => {
      const bestOpportunities = determineBestOpportunity(mockPerformanceData, selectedTimeframe, profitTarget)
      setSortedData(bestOpportunities)
      if (!selectedAsset && bestOpportunities.length > 0) {
        setSelectedAsset(bestOpportunities[0].symbol)
      }
      setIsLoading(false)
    }, 1000)
  }

  // Carrega dados iniciais e quando os filtros mudam
  useEffect(() => {
    loadData()
  }, [selectedTimeframe, profitTarget])

  // Formata o tempo estimado para atingir o alvo
  const formatTimeToTarget = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutos`
    } else if (hours < 24) {
      return `${hours.toFixed(1)} horas`
    } else {
      return `${(hours / 24).toFixed(1)} dias`
    }
  }

  // Obtém dados do ativo selecionado
  const getSelectedAssetData = () => {
    return sortedData.find((item) => item.symbol === selectedAsset) || null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Análise de Desempenho Real</CardTitle>
          <CardDescription>
            Identifique os índices com melhor potencial de lucro baseado em dados históricos reais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Timeframe</label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15m">15 minutos</SelectItem>
                  <SelectItem value="1h">1 hora</SelectItem>
                  <SelectItem value="4h">4 horas</SelectItem>
                  <SelectItem value="6h">6 horas</SelectItem>
                  <SelectItem value="24h">24 horas</SelectItem>
                  <SelectItem value="1w">1 semana</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Taxa de Lucro Alvo (%)</label>
              <Select
                value={profitTarget.toString()}
                onValueChange={(value) => setProfitTarget(Number.parseFloat(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o alvo de lucro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5%</SelectItem>
                  <SelectItem value="1">1%</SelectItem>
                  <SelectItem value="2">2%</SelectItem>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="10">10%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={loadData} disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Atualizar
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 text-left">Índice</th>
                  <th className="p-2 text-right">Preço Atual</th>
                  <th className="p-2 text-right">Variação</th>
                  <th className="p-2 text-right">Taxa de Lucro Real</th>
                  <th className="p-2 text-right">Tempo Estimado</th>
                  <th className="p-2 text-center">Tendência</th>
                  <th className="p-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center">
                      <div className="flex justify-center items-center">
                        <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                        Carregando dados...
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedData.map((item) => {
                    const realProfit = calculateRealProfitRate(item, selectedTimeframe)
                    const timeToTarget = (profitTarget / realProfit) * getTimeframeInHours(selectedTimeframe)
                    const trend = item.timeframes[selectedTimeframe].trend

                    return (
                      <tr
                        key={item.symbol}
                        className={`border-b hover:bg-muted/50 ${selectedAsset === item.symbol ? "bg-muted/30" : ""}`}
                        onClick={() => setSelectedAsset(item.symbol)}
                      >
                        <td className="p-2">
                          <div className="font-medium">{item.symbol}</div>
                          <div className="text-sm text-muted-foreground">{item.name}</div>
                        </td>
                        <td className="p-2 text-right">
                          {item.currentPrice.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className={`p-2 text-right ${item.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {item.change >= 0 ? "+" : ""}
                          {item.changePercent.toFixed(2)}%
                        </td>
                        <td className="p-2 text-right font-medium">
                          {realProfit.toFixed(2)}% / {selectedTimeframe}
                        </td>
                        <td className="p-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{formatTimeToTarget(timeToTarget)}</span>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          {trend === "up" && <ArrowUpIcon className="h-5 w-5 text-green-600 inline-block" />}
                          {trend === "down" && <ArrowDownIcon className="h-5 w-5 text-red-600 inline-block" />}
                          {trend === "neutral" && <span className="inline-block w-5 h-0.5 bg-yellow-500"></span>}
                        </td>
                        <td className="p-2 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedAsset(item.symbol)
                            }}
                          >
                            Analisar
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedAsset && (
        <Card>
          <CardHeader>
            <CardTitle>
              Análise Detalhada: {getSelectedAssetData()?.symbol} - {getSelectedAssetData()?.name}
            </CardTitle>
            <CardDescription>Desempenho real e métricas detalhadas para diferentes timeframes</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={selectedTimeframe}>
              <TabsList className="mb-4">
                <TabsTrigger value="15m">15 min</TabsTrigger>
                <TabsTrigger value="1h">1 hora</TabsTrigger>
                <TabsTrigger value="4h">4 horas</TabsTrigger>
                <TabsTrigger value="6h">6 horas</TabsTrigger>
                <TabsTrigger value="24h">24 horas</TabsTrigger>
                <TabsTrigger value="1w">1 semana</TabsTrigger>
              </TabsList>

              {["15m", "1h", "4h", "6h", "24h", "1w"].map((timeframe) => (
                <TabsContent key={timeframe} value={timeframe} className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Gráfico de Preço</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[400px]">
                            <TradingViewChart symbol={selectedAsset || "BTCUSD"} timeframe={timeframe} />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <PerformanceMetrics
                        data={getSelectedAssetData()}
                        timeframe={timeframe}
                        profitTarget={profitTarget}
                      />
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
