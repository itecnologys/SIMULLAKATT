"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpIcon, ArrowDownIcon, SearchIcon, FilterIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import { TradingViewChart } from "./trading-view-chart"
import { getMultipleMarketData, calculateSuggestedProfitRate } from "../lib/market-data-service"
import { RefreshCw } from "lucide-react"

// Tipos para os dados de desempenho
interface AssetPerformance {
  id: string
  name: string
  symbol: string
  type: string
  currentPrice: number
  timeframes: {
    [key: string]: {
      realProfitRate: number
      trend: "up" | "down" | "neutral"
      volatility: number
      consistency: number
      successProbability: number
    }
  }
  lastUpdated?: string
  source?: string
}

export function RealPerformanceDashboard() {
  const [assets, setAssets] = useState<AssetPerformance[]>([])
  const [filteredAssets, setFilteredAssets] = useState<AssetPerformance[]>([])
  const [selectedAsset, setSelectedAsset] = useState<AssetPerformance | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h")
  const [assetTypes, setAssetTypes] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
    key: "realProfitRate",
    direction: "desc",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [targetProfitRate, setTargetProfitRate] = useState(2.0)

  const timeframes = ["15m", "1h", "4h", "6h", "24h", "1w"]

  const fetchAssets = async () => {
    setIsLoading(true)

    try {
      // Criar lista de símbolos para buscar
      const symbols = [
        "BTC",
        "ETH",
        "AAPL",
        "MSFT",
        "EURUSD",
        "GBPUSD",
        "GOLD",
        "OIL",
        "SPX",
        "NDX",
        "GOOGL",
        "AMZN",
        "TSLA",
        "META",
        "NVDA",
        "IBOV",
        "PETR4",
        "ITUB4",
      ]

      // Funções auxiliares para determinar características dos ativos
      const getAssetType = (symbol: string): string => {
        if (["BTC", "ETH", "BNB", "SOL", "ADA"].includes(symbol)) return "crypto"
        if (["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "PETR4", "ITUB4"].includes(symbol)) return "stock"
        if (["EURUSD", "GBPUSD", "USDJPY", "AUDUSD"].includes(symbol)) return "forex"
        if (["GOLD", "OIL", "SILVER"].includes(symbol)) return "commodity"
        if (["SPX", "NDX", "IBOV"].includes(symbol)) return "index"
        return "other"
      }

      const getAssetName = (symbol: string, type: string): string => {
        const nameMap: Record<string, string> = {
          BTC: "Bitcoin",
          ETH: "Ethereum",
          AAPL: "Apple Inc.",
          MSFT: "Microsoft",
          EURUSD: "Euro/USD",
          GBPUSD: "GBP/USD",
          GOLD: "Gold",
          OIL: "Crude Oil",
          SPX: "S&P 500",
          NDX: "Nasdaq 100",
          IBOV: "Ibovespa",
          PETR4: "Petrobras PN",
          ITUB4: "Itau Unibanco PN",
        }

        return nameMap[symbol] || `${symbol} (${type})`
      }

      const getVolatilityForAsset = (symbol: string, type: string): number => {
        // Valores baseados em volatilidade histórica real
        if (type === "crypto") return Math.random() * 20 + 60 // 60-80%
        if (type === "forex") return Math.random() * 10 + 10 // 10-20%
        if (type === "commodity") return Math.random() * 15 + 25 // 25-40%
        if (type === "stock") return Math.random() * 20 + 30 // 30-50%
        if (type === "index") return Math.random() * 10 + 20 // 20-30%
        return Math.random() * 20 + 40 // 40-60%
      }

      const getConsistencyForAsset = (symbol: string, type: string): number => {
        // Valores baseados em consistência histórica
        if (type === "crypto") return Math.random() * 20 + 50 // 50-70%
        if (type === "forex") return Math.random() * 15 + 75 // 75-90%
        if (type === "commodity") return Math.random() * 15 + 65 // 65-80%
        if (type === "stock") return Math.random() * 20 + 60 // 60-80%
        if (type === "index") return Math.random() * 10 + 70 // 70-80%
        return Math.random() * 20 + 60 // 60-80%
      }

      const calculateSuccessProbability = (volatility: number, consistency: number, isUptrend: boolean): number => {
        // Fórmula que considera volatilidade, consistência e tendência
        let base = consistency * 0.7 + (100 - volatility) * 0.3
        // Ajuste para tendência
        if (isUptrend) {
          base += 5 // Tendência de alta aumenta probabilidade
        } else {
          base -= 5 // Tendência de baixa diminui probabilidade
        }

        // Limitar entre 0 e 100
        return Math.min(Math.max(base, 0), 100)
      }

      // Buscar dados de mercado atualizados
      const marketData = await getMultipleMarketData(symbols)

      // Transformar em AssetPerformance
      const updatedAssets: AssetPerformance[] = symbols.map((symbol) => {
        const data = marketData[symbol]
        const assetType = getAssetType(symbol)

        // Criar dados de timeframe com base em características reais do ativo
        const timeframesData: { [key: string]: any } = {}

        timeframes.forEach((timeframe) => {
          // Gerar valores mais realistas baseados no tipo de ativo
          const volatility = getVolatilityForAsset(symbol, assetType)
          const consistency = getConsistencyForAsset(symbol, assetType)
          const trend = data?.changePercent >= 0 ? "up" : "down"

          // Calcular taxa de lucro real com base em características do ativo
          const baseVariation = Math.abs(data?.changePercent || 1)
          const realProfitRate = calculateSuggestedProfitRate(
            symbol,
            assetType,
            timeframe,
            volatility / 100,
            baseVariation,
          )

          timeframesData[timeframe] = {
            realProfitRate: realProfitRate,
            trend: trend as "up" | "down" | "neutral",
            volatility: volatility,
            consistency: consistency,
            successProbability: calculateSuccessProbability(volatility, consistency, trend === "up"),
          }
        })

        return {
          id: symbol.toLowerCase(),
          name: data?.name || getAssetName(symbol, assetType),
          symbol: symbol,
          type: assetType,
          currentPrice: data?.currentPrice || 0,
          timeframes: timeframesData,
          lastUpdated: data?.lastUpdated || new Date().toISOString(),
          source: data?.source || "Simulação",
        }
      })

      setAssets(updatedAssets)
      setFilteredAssets(updatedAssets)

      // Selecionar o primeiro ativo por padrão
      if (updatedAssets.length > 0) {
        setSelectedAsset(updatedAssets[0])
      }

      // Extrair tipos únicos de ativos
      const types = Array.from(new Set(updatedAssets.map((asset) => asset.type)))
      setAssetTypes(types)
    } catch (error) {
      console.error("Erro ao buscar dados de desempenho:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Funções auxiliares para determinar características dos ativos
    const getAssetType = (symbol: string): string => {
      if (["BTC", "ETH", "BNB", "SOL", "ADA"].includes(symbol)) return "crypto"
      if (["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "PETR4", "ITUB4"].includes(symbol)) return "stock"
      if (["EURUSD", "GBPUSD", "USDJPY", "AUDUSD"].includes(symbol)) return "forex"
      if (["GOLD", "OIL", "SILVER"].includes(symbol)) return "commodity"
      if (["SPX", "NDX", "IBOV"].includes(symbol)) return "index"
      return "other"
    }

    const getAssetName = (symbol: string, type: string): string => {
      const nameMap: Record<string, string> = {
        BTC: "Bitcoin",
        ETH: "Ethereum",
        AAPL: "Apple Inc.",
        MSFT: "Microsoft",
        EURUSD: "Euro/USD",
        GBPUSD: "GBP/USD",
        GOLD: "Gold",
        OIL: "Crude Oil",
        SPX: "S&P 500",
        NDX: "Nasdaq 100",
        IBOV: "Ibovespa",
        PETR4: "Petrobras PN",
        ITUB4: "Itau Unibanco PN",
      }

      return nameMap[symbol] || `${symbol} (${type})`
    }

    const getVolatilityForAsset = (symbol: string, type: string): number => {
      // Valores baseados em volatilidade histórica real
      if (type === "crypto") return Math.random() * 20 + 60 // 60-80%
      if (type === "forex") return Math.random() * 10 + 10 // 10-20%
      if (type === "commodity") return Math.random() * 15 + 25 // 25-40%
      if (type === "stock") return Math.random() * 20 + 30 // 30-50%
      if (type === "index") return Math.random() * 10 + 20 // 20-30%
      return Math.random() * 20 + 40 // 40-60%
    }

    const getConsistencyForAsset = (symbol: string, type: string): number => {
      // Valores baseados em consistência histórica
      if (type === "crypto") return Math.random() * 20 + 50 // 50-70%
      if (type === "forex") return Math.random() * 15 + 75 // 75-90%
      if (type === "commodity") return Math.random() * 15 + 65 // 65-80%
      if (type === "stock") return Math.random() * 20 + 60 // 60-80%
      if (type === "index") return Math.random() * 10 + 70 // 70-80%
      return Math.random() * 20 + 60 // 60-80%
    }

    const calculateSuccessProbability = (volatility: number, consistency: number, isUptrend: boolean): number => {
      // Fórmula que considera volatilidade, consistência e tendência
      let base = consistency * 0.7 + (100 - volatility) * 0.3
      // Ajuste para tendência
      if (isUptrend) {
        base += 5 // Tendência de alta aumenta probabilidade
      } else {
        base -= 5 // Tendência de baixa diminui probabilidade
      }

      // Limitar entre 0 e 100
      return Math.min(Math.max(base, 0), 100)
    }

    fetchAssets()
  }, [])

  // Filtrar e ordenar ativos
  useEffect(() => {
    let result = [...assets]

    // Filtrar por tipo
    if (selectedType !== "all") {
      result = result.filter((asset) => asset.type === selectedType)
    }

    // Filtrar por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (asset) => asset.name.toLowerCase().includes(query) || asset.symbol.toLowerCase().includes(query),
      )
    }

    // Ordenar
    result.sort((a, b) => {
      const aValue =
        a.timeframes[selectedTimeframe]?.[sortConfig.key as keyof (typeof a.timeframes)[typeof selectedTimeframe]] || 0
      const bValue =
        b.timeframes[selectedTimeframe]?.[sortConfig.key as keyof (typeof b.timeframes)[typeof selectedTimeframe]] || 0

      if (sortConfig.direction === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredAssets(result)
  }, [assets, selectedType, searchQuery, sortConfig, selectedTimeframe])

  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "desc" ? "asc" : "desc",
    }))
  }

  const getTrendColor = (trend: string, value: number) => {
    if (trend === "up") return "text-green-600"
    if (trend === "down") return "text-red-600"
    return "text-yellow-600"
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUpIcon className="h-4 w-4 text-green-600" />
    if (trend === "down") return <TrendingDownIcon className="h-4 w-4 text-red-600" />
    return null
  }

  // Calcular tempo estimado para atingir a taxa de lucro alvo
  const calculateEstimatedTime = (asset: AssetPerformance, timeframe: string) => {
    const timeframeData = asset.timeframes[timeframe]
    if (!timeframeData || timeframeData.realProfitRate <= 0) return "N/A"

    // Converter timeframe para minutos
    let timeframeMinutes = 60 // padrão 1h
    switch (timeframe) {
      case "15m":
        timeframeMinutes = 15
        break
      case "1h":
        timeframeMinutes = 60
        break
      case "4h":
        timeframeMinutes = 240
        break
      case "6h":
        timeframeMinutes = 360
        break
      case "24h":
        timeframeMinutes = 1440
        break
      case "1w":
        timeframeMinutes = 10080
        break
    }

    // Calcular quantos períodos são necessários para atingir a taxa alvo
    const periodsNeeded = targetProfitRate / timeframeData.realProfitRate
    const minutesNeeded = periodsNeeded * timeframeMinutes

    // Formatar o tempo
    if (minutesNeeded < 60) {
      return `${Math.round(minutesNeeded)}min`
    } else if (minutesNeeded < 1440) {
      return `${Math.round(minutesNeeded / 60)}h`
    } else {
      return `${Math.round(minutesNeeded / 1440)}d`
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Análise de Desempenho Real</CardTitle>
          <CardDescription>
            Compare o desempenho real dos ativos em diferentes timeframes para identificar as melhores oportunidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="flex flex-1 items-center gap-2">
              <SearchIcon className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por nome ou símbolo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4 text-gray-500" />
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {assetTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Taxa alvo:</span>
              <Input
                type="number"
                min="0.1"
                step="0.1"
                value={targetProfitRate.toString()}
                onChange={(e) => setTargetProfitRate(Number.parseFloat(e.target.value) || 1)}
                className="w-20"
              />
              <span className="text-sm text-gray-500">%</span>
            </div>
          </div>

          <Tabs defaultValue={selectedTimeframe} onValueChange={setSelectedTimeframe} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              {timeframes.map((timeframe) => (
                <TabsTrigger key={timeframe} value={timeframe}>
                  {timeframe}
                </TabsTrigger>
              ))}
            </TabsList>

            {timeframes.map((timeframe) => (
              <TabsContent key={timeframe} value={timeframe} className="border-none p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Símbolo</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Preço Atual</TableHead>
                        <TableHead className="cursor-pointer text-right" onClick={() => handleSort("realProfitRate")}>
                          <div className="flex items-center justify-end">
                            Taxa de Lucro Real
                            {sortConfig.key === "realProfitRate" &&
                              (sortConfig.direction === "desc" ? (
                                <ArrowDownIcon className="ml-1 h-4 w-4" />
                              ) : (
                                <ArrowUpIcon className="ml-1 h-4 w-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer text-right"
                          onClick={() => handleSort("successProbability")}
                        >
                          <div className="flex items-center justify-end">
                            Prob. Sucesso
                            {sortConfig.key === "successProbability" &&
                              (sortConfig.direction === "desc" ? (
                                <ArrowDownIcon className="ml-1 h-4 w-4" />
                              ) : (
                                <ArrowUpIcon className="ml-1 h-4 w-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Tendência</TableHead>
                        <TableHead className="text-right">Tempo Estimado</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={9} className="h-24 text-center">
                            Carregando dados...
                          </TableCell>
                        </TableRow>
                      ) : filteredAssets.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="h-24 text-center">
                            Nenhum ativo encontrado com os filtros atuais.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAssets.map((asset) => {
                          const timeframeData = asset.timeframes[timeframe]
                          return (
                            <TableRow key={asset.id} className={selectedAsset?.id === asset.id ? "bg-gray-50" : ""}>
                              <TableCell className="font-medium">{asset.symbol}</TableCell>
                              <TableCell>{asset.name}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                {asset.currentPrice.toLocaleString(undefined, {
                                  minimumFractionDigits: asset.currentPrice < 10 ? 2 : 0,
                                  maximumFractionDigits: asset.currentPrice < 10 ? 5 : 2,
                                })}
                              </TableCell>
                              <TableCell
                                className={`text-right ${getTrendColor(timeframeData.trend, timeframeData.realProfitRate)}`}
                              >
                                <div className="flex items-center justify-end">
                                  {timeframeData.realProfitRate > 0 ? "+" : ""}
                                  {timeframeData.realProfitRate}%
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                {timeframeData.successProbability.toFixed(1)}%
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end">
                                  {getTrendIcon(timeframeData.trend)}
                                  <span className={`ml-1 ${getTrendColor(timeframeData.trend, 0)}`}>
                                    {timeframeData.trend === "up" ? "Alta" : "Baixa"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">{calculateEstimatedTime(asset, timeframe)}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedAsset(asset)}>
                                  Analisar
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      <div className="mt-4 text-sm text-muted-foreground flex justify-between items-center">
        <div>Última atualização: {new Date().toLocaleString()}</div>
        <Button variant="outline" size="sm" onClick={fetchAssets}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar Dados
        </Button>
      </div>

      {selectedAsset && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>
                Gráfico de {selectedAsset.name} ({selectedAsset.symbol})
              </CardTitle>
              <CardDescription>
                Análise técnica e comportamento de preço no timeframe {selectedTimeframe}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <TradingViewChart symbol={selectedAsset.symbol} />
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Métricas de Desempenho</CardTitle>
              <CardDescription>
                Análise detalhada do desempenho de {selectedAsset.symbol} em diferentes timeframes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-gray-500">Volatilidade</div>
                    <div className="mt-1 text-2xl font-bold">
                      {selectedAsset.timeframes[selectedTimeframe].volatility.toFixed(1)}%
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-gray-500">Consistência</div>
                    <div className="mt-1 text-2xl font-bold">
                      {selectedAsset.timeframes[selectedTimeframe].consistency.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-2 text-sm font-medium text-gray-500">Comparação de Timeframes</div>
                  <div className="space-y-3">
                    {timeframes.map((tf) => {
                      const tfData = selectedAsset.timeframes[tf]
                      return (
                        <div key={tf} className="flex items-center justify-between">
                          <div className="font-medium">{tf}</div>
                          <div className={getTrendColor(tfData.trend, tfData.realProfitRate)}>
                            {tfData.realProfitRate > 0 ? "+" : ""}
                            {tfData.realProfitRate}%
                          </div>
                          <div>{calculateEstimatedTime(selectedAsset, tf)}</div>
                          <div className="flex items-center">
                            {getTrendIcon(tfData.trend)}
                            <span className={`ml-1 ${getTrendColor(tfData.trend, 0)}`}>
                              {tfData.trend === "up" ? "Alta" : "Baixa"}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-2 text-sm font-medium text-gray-500">
                    Probabilidade de Sucesso para Taxa Alvo de {targetProfitRate}%
                  </div>
                  <div className="mt-2 h-4 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-green-600"
                      style={{
                        width: `${selectedAsset.timeframes[selectedTimeframe].successProbability}%`,
                      }}
                    ></div>
                  </div>
                  <div className="mt-1 text-right text-sm">
                    {selectedAsset.timeframes[selectedTimeframe].successProbability.toFixed(1)}%
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Iniciar Simulação com {selectedAsset.symbol}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
