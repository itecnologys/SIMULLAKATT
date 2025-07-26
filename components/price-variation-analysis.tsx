"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { getMarketData, calculateSuggestedRate } from "@/lib/simple-market-service"

interface PriceVariationProps {
  universe: string
  asset: string
  onSuggestedProfitRate?: (rate: number) => void
}

interface PriceData {
  timestamp: string
  price: number
}

interface VariationData {
  period: string
  label: string
  variations: {
    day: string
    value: number
    formattedValue: string
    isPositive: boolean
  }[]
}

interface DetailedVariation {
  interval: string
  percentRange: string
  valueRange: string
  context: string
}

export default function PriceVariationAnalysis({
  universe,
  asset,
  onSuggestedProfitRate,
  marketData,
}: PriceVariationProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [variationData, setVariationData] = useState<VariationData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<string>("1h")
  const [detailedAnalysis, setDetailedAnalysis] = useState<DetailedVariation[]>([])
  const [assetInfo, setAssetInfo] = useState<{
    name: string
    currentPrice: number
    currency: string
    description: string
    lastUpdated?: string
    source?: string
  } | null>(null)
  const [chartType, setChartType] = useState<string>("area")
  const [fullscreenChart, setFullscreenChart] = useState<boolean>(false)
  const [showCandlestickChart, setShowCandlestickChart] = useState<boolean>(false)

  // Períodos de análise
  const periods = [
    { id: "15m", label: "15 minutos" },
    { id: "1h", label: "1 hora" },
    { id: "4h", label: "4 horas" },
    { id: "6h", label: "6 horas" },
    { id: "24h", label: "24 horas" },
    { id: "1w", label: "1 semana" },
  ]

  // Buscar dados de preço e variação quando o ativo for selecionado
  useEffect(() => {
    if (!universe || !asset) return

    const fetchPriceData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Buscar dados de mercado atualizados
        const marketData = await getMarketData(asset)

        // Continuar com a chamada à API para análise detalhada
        const response = await fetch(
          `/api/price-analysis?universe=${encodeURIComponent(universe)}&asset=${encodeURIComponent(asset)}`,
        )

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        if (data.success) {
          // Atualizar o preço atual nos dados com o valor real de mercado
          let updatedPriceData: PriceData[] = []
          if (marketData) {
            updatedPriceData = data.priceData.map((item: any, index: number, array: any[]) => {
              // Atualizar apenas o último ponto de dados com o preço real
              if (index === array.length - 1) {
                return {
                  ...item,
                  price: marketData.currentPrice,
                  timestamp: new Date().toISOString(),
                }
              }
              return item
            })

            setPriceData(updatedPriceData)
          } else {
            setPriceData(data.priceData || [])
          }

          setVariationData(data.variationData || [])

          // Definir informações do ativo com dados reais
          if (marketData) {
            setAssetInfo({
              name: marketData.name,
              currentPrice: marketData.currentPrice,
              currency: getCurrency(universe),
              description: getAssetDescription(universe, asset),
              lastUpdated: marketData.lastUpdated,
              source: marketData.source,
            })
          } else if (data.assetInfo) {
            setAssetInfo(data.assetInfo)
          } else {
            // Informações padrão se não fornecidas pela API
            setAssetInfo({
              name: getAssetName(universe, asset),
              currentPrice:
                data.priceData && data.priceData.length > 0 ? data.priceData[data.priceData.length - 1].price : 0,
              currency: getCurrency(universe),
              description: getAssetDescription(universe, asset),
              lastUpdated: new Date().toISOString(),
              source: "Simulação",
            })
          }

          // Gerar análise detalhada
          generateDetailedAnalysis(marketData ? updatedPriceData : data.priceData, data.variationData)
        } else {
          console.error("Erro retornado pela API:", data.error)
          setError(data.error || "Erro ao buscar dados de preço")
          setPriceData([])
          setVariationData([])
        }
      } catch (error) {
        console.error("Erro ao buscar dados de preço:", error)
        setError(error instanceof Error ? error.message : "Erro desconhecido ao buscar dados")
        setPriceData([])
        setVariationData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPriceData()
  }, [universe, asset])

  // Gerar análise detalhada com base nos dados
  const generateDetailedAnalysis = (priceData: PriceData[], variationData: VariationData[]) => {
    if (!priceData || priceData.length === 0) return

    const lastPrice = priceData[priceData.length - 1].price
    const currency = getCurrency(universe)

    // Criar análise detalhada para cada período
    const analysis: DetailedVariation[] = [
      {
        interval: "15 minutos",
        percentRange: "0.1% - 0.5%",
        valueRange: `${currency}${(lastPrice * 0.001).toFixed(2)} - ${currency}${(lastPrice * 0.005).toFixed(2)}`,
        context: "Variações de curto prazo, influenciadas por notícias imediatas e liquidez do mercado.",
      },
      {
        interval: "1 hora",
        percentRange: "0.5% - 1.5%",
        valueRange: `${currency}${(lastPrice * 0.005).toFixed(2)} - ${currency}${(lastPrice * 0.015).toFixed(2)}`,
        context: "Reflete movimentos intradiários e reações a eventos de mercado.",
      },
      {
        interval: "4 horas",
        percentRange: "1% - 3%",
        valueRange: `${currency}${(lastPrice * 0.01).toFixed(2)} - ${currency}${(lastPrice * 0.03).toFixed(2)}`,
        context: "Captura tendências de sessões de trading e mudanças de sentimento.",
      },
      {
        interval: "6 horas",
        percentRange: "1.5% - 4%",
        valueRange: `${currency}${(lastPrice * 0.015).toFixed(2)} - ${currency}${(lastPrice * 0.04).toFixed(2)}`,
        context: "Influenciado por fatores macroeconômicos e relatórios de mercado.",
      },
      {
        interval: "24 horas",
        percentRange: "2% - 5%",
        valueRange: `${currency}${(lastPrice * 0.02).toFixed(2)} - ${currency}${(lastPrice * 0.05).toFixed(2)}`,
        context: "Reflete mudanças diárias e eventos significativos de mercado.",
      },
      {
        interval: "1 semana",
        percentRange: "3% - 8%",
        valueRange: `${currency}${(lastPrice * 0.03).toFixed(2)} - ${currency}${(lastPrice * 0.08).toFixed(2)}`,
        context: "Captura tendências de médio prazo e mudanças fundamentais.",
      },
    ]

    setDetailedAnalysis(analysis)
  }

  // Encontrar dados de variação para o período selecionado
  const selectedVariationData = variationData.find((data) => data.period === selectedPeriod)

  // Calcular média de variação para o período selecionado
  const calculateAverageVariation = () => {
    if (!selectedVariationData || !selectedVariationData.variations || selectedVariationData.variations.length === 0) {
      return 0
    }

    // Filtrar valores zero ou NaN
    const validVariations = selectedVariationData.variations.filter((v) => !isNaN(v.value) && v.value !== 0)

    if (validVariations.length === 0) return 0

    // Calcular média dos valores absolutos
    const sum = validVariations.reduce((acc, curr) => acc + Math.abs(curr.value), 0)
    return sum / validVariations.length
  }

  const averageVariation = calculateAverageVariation()

  // Calcular volatilidade com base nos dados de variação
  const calculateVolatility = () => {
    if (!selectedVariationData || !selectedVariationData.variations || selectedVariationData.variations.length === 0) {
      return 0.5 // Valor padrão
    }

    const validVariations = selectedVariationData.variations.filter((v) => !isNaN(v.value))
    if (validVariations.length <= 1) return 0.5

    // Calcular desvio padrão das variações
    const mean = validVariations.reduce((acc, curr) => acc + curr.value, 0) / validVariations.length
    const squaredDiffs = validVariations.map((v) => Math.pow(v.value - mean, 2))
    const variance = squaredDiffs.reduce((acc, curr) => acc + curr, 0) / validVariations.length
    const stdDev = Math.sqrt(variance)

    // Normalizar para um valor entre 0 e 1
    return Math.min(stdDev / mean, 1)
  }

  const volatility = calculateVolatility()

  // Sugerir taxa de lucro com base na média de variação e características do ativo
  const suggestedProfitRate = calculateSuggestedRate(asset)

  // Notificar o componente pai sobre a taxa de lucro sugerida
  useEffect(() => {
    if (onSuggestedProfitRate && !isNaN(suggestedProfitRate)) {
      onSuggestedProfitRate(suggestedProfitRate)
    }
  }, [suggestedProfitRate, onSuggestedProfitRate])

  // Funções auxiliares para obter informações do ativo
  const getAssetName = (universe: string, asset: string): string => {
    const universeMap: Record<string, Record<string, string>> = {
      stocks: {
        AAPL: "Apple Inc.",
        MSFT: "Microsoft Corporation",
        GOOGL: "Alphabet Inc.",
        // Adicione mais conforme necessário
      },
      crypto: {
        BTC: "Bitcoin",
        ETH: "Ethereum",
        // Adicione mais conforme necessário
      },
      forex: {
        "EUR/USD": "Euro / US Dollar",
        "GBP/USD": "British Pound / US Dollar",
        // Adicione mais conforme necessário
      },
      commodities: {
        GOLD: "Gold",
        OIL: "Crude Oil (WTI)",
        // Adicione mais conforme necessário
      },
      indices: {
        "S&P500": "S&P 500",
        NASDAQ: "NASDAQ Composite",
        // Adicione mais conforme necessário
      },
    }

    return universeMap[universe]?.[asset] || asset
  }

  const getCurrency = (universe: string): string => {
    const currencyMap: Record<string, string> = {
      stocks: "$",
      crypto: "$",
      forex: "$",
      commodities: "$",
      indices: "$",
    }

    return currencyMap[universe] || "$"
  }

  const getAssetDescription = (universe: string, asset: string): string => {
    const descriptionMap: Record<string, Record<string, string>> = {
      stocks: {
        AAPL: "Empresa de tecnologia americana que projeta, desenvolve e vende eletrônicos de consumo, software e serviços online.",
        MSFT: "Empresa multinacional de tecnologia que desenvolve, fabrica, licencia e vende software de computador, produtos eletrônicos e computadores pessoais.",
        // Adicione mais conforme necessário
      },
      crypto: {
        BTC: "A primeira criptomoeda descentralizada do mundo, criada em 2009 por uma pessoa ou grupo conhecido pelo pseudônimo Satoshi Nakamoto.",
        ETH: "Uma plataforma de blockchain descentralizada que permite contratos inteligentes e aplicativos descentralizados (dApps).",
        // Adicione mais conforme necessário
      },
      commodities: {
        GOLD: "Metal precioso usado como reserva de valor e em joalheria.",
        OIL: "Petróleo bruto (WTI - West Texas Intermediate), uma commodity energética essencial para a economia global.",
        // Adicione mais conforme necessário
      },
      // Adicione mais conforme necessário
    }

    return descriptionMap[universe]?.[asset] || `Ativo do universo ${universe}`
  }

  // Renderizar gráfico com base no tipo selecionado
  const renderChart = () => {
    if (priceData.length === 0) return null

    const chartHeight = fullscreenChart ? 500 : 300

    switch (chartType) {
      case "area":
        return (
          <div className="h-[300px] bg-card rounded-lg p-4 border">
            {/* Placeholder for Area Chart */}
            Area Chart
          </div>
        )

      case "line":
        return (
          <div className="h-[300px] bg-card rounded-lg p-4 border">
            {/* Placeholder for Line Chart */}
            Line Chart
          </div>
        )

      case "bar":
        return (
          <div className="h-[300px] bg-card rounded-lg p-4 border">
            {/* Placeholder for Bar Chart */}
            Bar Chart
          </div>
        )

      default:
        return null
    }
  }

  const assetData = marketData || getMarketData(asset)

  const isPositive = assetData?.changePercent >= 0

  if (!universe || !asset) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise de Variação de Preços</CardTitle>
          <CardDescription>Selecione um universo e um ativo para visualizar a análise</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">Nenhum ativo selecionado</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Variação de Preços</CardTitle>
        <CardDescription>
          Análise detalhada do ativo {asset} no universo {universe}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Preço Atual</div>
            <div className="text-2xl font-bold">
              {assetData?.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 5,
              })}
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Variação</div>
            <div className={`text-2xl font-bold flex items-center ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {isPositive ? <TrendingUp className="h-6 w-6 mr-2" /> : <TrendingDown className="h-6 w-6 mr-2" />}
              {isPositive ? "+" : ""}
              {assetData?.changePercent.toFixed(2)}%
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Tendência</div>
            <div className="text-2xl font-bold">
              <Badge variant={isPositive ? "default" : "destructive"}>{isPositive ? "Alta" : "Baixa"}</Badge>
            </div>
          </div>
        </div>

        {/* Análise de Volatilidade */}
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
          <h3 className="font-semibold mb-2">Análise de Volatilidade</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Volatilidade Atual</div>
              <div className="text-lg font-bold">{Math.abs(assetData?.changePercent || 0).toFixed(2)}%</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Classificação</div>
              <div className="text-lg font-bold">
                {Math.abs(assetData?.changePercent || 0) > 3
                  ? "Alta"
                  : Math.abs(assetData?.changePercent || 0) > 1
                    ? "Média"
                    : "Baixa"}
              </div>
            </div>
          </div>
        </div>

        {/* Recomendação */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">Recomendação de Taxa de Lucro</h3>
          <div className="text-3xl font-bold text-green-600 mb-2">{suggestedProfitRate.toFixed(2)}%</div>
          <p className="text-sm text-green-700">
            Esta taxa é calculada com base na volatilidade atual do ativo. Uma volatilidade de{" "}
            {Math.abs(assetData?.changePercent || 0).toFixed(2)}% sugere uma taxa de lucro conservadora de{" "}
            {suggestedProfitRate.toFixed(2)}%.
          </p>
        </div>

        {/* Informações Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Características do Universo</h4>
            <p className="text-sm text-muted-foreground">
              {universe === "crypto" && "Criptomoedas tendem a ter alta volatilidade"}
              {universe === "stocks" && "Ações apresentam volatilidade moderada"}
              {universe === "forex" && "Forex tem baixa volatilidade típica"}
              {universe === "commodities" && "Commodities têm volatilidade variável"}
              {universe === "indices" && "Índices são mais estáveis"}
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Última Atualização</h4>
            <p className="text-sm text-muted-foreground">{new Date(assetData?.lastUpdated || "").toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
