"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Download, Maximize2, ArrowUpRight, ArrowDownRight } from "lucide-react"

interface CandlestickData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

interface EnhancedCandlestickChartProps {
  symbol: string
  startDate?: string
  endDate?: string
  interval?: "1m" | "5m" | "15m" | "30m" | "1h" | "4h" | "1d" | "1w" | "1M"
  height?: number
  title?: string
  description?: string
  onSuggestedProfitRate?: (rate: number) => void
}

export default function EnhancedCandlestickChart({
  symbol,
  startDate,
  endDate,
  interval = "1d",
  height = 400,
  title = "Gráfico de Preços",
  description = "Dados históricos de preços",
  onSuggestedProfitRate,
}: EnhancedCandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentInterval, setCurrentInterval] = useState(interval)
  const [chartType, setChartType] = useState<"candlestick" | "line" | "area" | "bar">("candlestick")
  const [chartData, setChartData] = useState<CandlestickData[]>([])
  const [indicators, setIndicators] = useState<string[]>(["volume"])
  const [technicalAnalysis, setTechnicalAnalysis] = useState<any>({
    trend: { direction: "up", strength: "medium", confidence: 0.75 },
    support: [0, 0],
    resistance: [0, 0],
    rsi: 0,
    macd: { line: 0, signal: 0, histogram: 0 },
    averageVariation: 0,
    suggestedProfitRate: 0,
  })

  // Gerar dados de exemplo para o gráfico de candlestick
  useEffect(() => {
    const generateSampleData = () => {
      setIsLoading(true)

      // Simular um atraso de API
      setTimeout(() => {
        try {
          const now = new Date()
          const data: CandlestickData[] = []

          // Preço base para o ativo
          let basePrice = 100

          // Ajustar preço base com base no símbolo
          if (symbol.includes("BTC")) basePrice = 65000
          else if (symbol.includes("ETH")) basePrice = 3100
          else if (symbol.includes("SOL")) basePrice = 140
          else if (symbol.includes("AAPL")) basePrice = 197
          else if (symbol.includes("MSFT")) basePrice = 403

          // Gerar dados para os últimos 30 dias
          for (let i = 30; i >= 0; i--) {
            const date = new Date(now)
            date.setDate(date.getDate() - i)

            // Gerar variação aleatória para o dia
            const volatility = symbol.includes("BTC") ? 0.03 : 0.015
            const randomChange = (Math.random() - 0.5) * 2 * volatility

            // Calcular preços para o candle
            const open = i === 30 ? basePrice : data[data.length - 1].close
            const close = open * (1 + randomChange)
            const high = Math.max(open, close) * (1 + Math.random() * 0.01)
            const low = Math.min(open, close) * (1 - Math.random() * 0.01)
            const volume = Math.floor(Math.random() * 1000000) + 500000

            data.push({
              time: date.toISOString().split("T")[0],
              open,
              high,
              low,
              close,
              volume,
            })
          }

          setChartData(data)

          // Calcular análise técnica
          calculateTechnicalAnalysis(data)

          setIsLoading(false)
        } catch (error) {
          console.error("Erro ao gerar dados:", error)
          setError("Erro ao gerar dados do gráfico")
          setIsLoading(false)
        }
      }, 1000)
    }

    generateSampleData()
  }, [symbol, currentInterval])

  // Calcular análise técnica com base nos dados
  const calculateTechnicalAnalysis = (data: CandlestickData[]) => {
    if (!data || data.length === 0) return

    // Calcular variação média diária
    let totalVariation = 0
    for (let i = 1; i < data.length; i++) {
      const dailyChange = Math.abs((data[i].close - data[i].open) / data[i].open)
      totalVariation += dailyChange
    }
    const averageVariation = (totalVariation / (data.length - 1)) * 100

    // Calcular RSI (simplificado)
    let gains = 0
    let losses = 0
    for (let i = 1; i < data.length; i++) {
      const change = data[i].close - data[i].open
      if (change >= 0) gains += change
      else losses -= change
    }
    const rs = gains / (losses || 1)
    const rsi = 100 - 100 / (1 + rs)

    // Determinar tendência
    let upDays = 0
    let downDays = 0
    for (let i = 0; i < data.length; i++) {
      if (data[i].close > data[i].open) upDays++
      else if (data[i].close < data[i].open) downDays++
    }

    const trendDirection = upDays > downDays ? "up" : "down"
    const trendStrength = Math.abs(upDays - downDays) / data.length
    const trendStrengthLabel = trendStrength > 0.7 ? "forte" : trendStrength > 0.4 ? "médio" : "fraco"

    // Calcular níveis de suporte e resistência (simplificado)
    const prices = data.map((d) => d.close)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const range = maxPrice - minPrice

    const support = [minPrice, minPrice + range * 0.2]
    const resistance = [maxPrice - range * 0.2, maxPrice]

    // Calcular MACD (simplificado)
    const ema12 = prices.slice(-12).reduce((sum, price) => sum + price, 0) / 12
    const ema26 = prices.slice(-26).reduce((sum, price) => sum + price, 0) / 26
    const macdLine = ema12 - ema26
    const signalLine = macdLine * 0.9 // Simplificado
    const histogram = macdLine - signalLine

    // Calcular taxa de lucro sugerida (80% da variação média)
    const suggestedProfitRate = averageVariation * 0.8

    // Atualizar estado com os cálculos
    setTechnicalAnalysis({
      trend: {
        direction: trendDirection,
        strength: trendStrengthLabel,
        confidence: trendStrength,
      },
      support,
      resistance,
      rsi,
      macd: { line: macdLine, signal: signalLine, histogram },
      averageVariation,
      suggestedProfitRate,
    })

    // Notificar componente pai sobre a taxa sugerida
    if (onSuggestedProfitRate) {
      onSuggestedProfitRate(suggestedProfitRate)
    }
  }

  // Renderizar gráfico de candlestick
  useEffect(() => {
    if (!chartContainerRef.current || chartData.length === 0) return

    const canvas = chartContainerRef.current.querySelector("canvas")
    if (!canvas) {
      const newCanvas = document.createElement("canvas")
      newCanvas.width = chartContainerRef.current.clientWidth
      newCanvas.height = height
      chartContainerRef.current.appendChild(newCanvas)
    }

    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calcular dimensões
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2

    // Encontrar valores mínimos e máximos
    const highValues = chartData.map((d) => d.high)
    const lowValues = chartData.map((d) => d.low)
    const minValue = Math.min(...lowValues) * 0.99
    const maxValue = Math.max(...highValues) * 1.01
    const valueRange = maxValue - minValue

    // Desenhar eixos
    ctx.beginPath()
    ctx.strokeStyle = "#ccc"
    ctx.lineWidth = 1
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()

    // Desenhar linhas de grade
    ctx.beginPath()
    ctx.strokeStyle = "rgba(204, 204, 204, 0.3)"
    ctx.lineWidth = 1

    // Linhas de grade horizontais
    const gridCount = 5
    for (let i = 0; i <= gridCount; i++) {
      const y = padding + (i / gridCount) * chartHeight
      ctx.moveTo(padding, y)
      ctx.lineTo(canvas.width - padding, y)

      // Adicionar rótulos de preço
      const value = maxValue - (i / gridCount) * valueRange
      ctx.fillStyle = "#666"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "right"
      ctx.textBaseline = "middle"
      ctx.fillText(value.toFixed(2), padding - 5, y)
    }

    // Linhas de grade verticais
    for (let i = 0; i <= chartData.length; i += Math.max(1, Math.floor(chartData.length / 10))) {
      const x = padding + (i / chartData.length) * chartWidth
      ctx.moveTo(x, padding)
      ctx.lineTo(x, canvas.height - padding)
    }

    ctx.stroke()

    // Desenhar candlesticks
    const barWidth = (chartWidth / chartData.length) * 0.6

    chartData.forEach((item, index) => {
      const x = padding + ((index + 0.5) / chartData.length) * chartWidth

      // Calcular posições y
      const openY = canvas.height - padding - ((item.open - minValue) / valueRange) * chartHeight
      const closeY = canvas.height - padding - ((item.close - minValue) / valueRange) * chartHeight
      const highY = canvas.height - padding - ((item.high - minValue) / valueRange) * chartHeight
      const lowY = canvas.height - padding - ((item.low - minValue) / valueRange) * chartHeight

      // Determinar se é um candle de alta ou baixa
      const isUp = item.close >= item.open

      // Desenhar o pavio (high to low)
      ctx.beginPath()
      ctx.strokeStyle = isUp ? "#26a69a" : "#ef5350"
      ctx.lineWidth = 1
      ctx.moveTo(x, highY)
      ctx.lineTo(x, lowY)
      ctx.stroke()

      // Desenhar o corpo (open to close)
      ctx.fillStyle = isUp ? "#26a69a" : "#ef5350"
      const bodyHeight = Math.abs(closeY - openY)
      const bodyY = isUp ? openY : closeY

      ctx.fillRect(x - barWidth / 2, bodyY, barWidth, bodyHeight)

      // Adicionar rótulos de data para o primeiro e último candle
      if (index === 0 || index === chartData.length - 1) {
        ctx.fillStyle = "#666"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "top"
        const dateLabel = new Date(item.time).toLocaleDateString()
        ctx.fillText(dateLabel, x, canvas.height - padding + 5)
      }
    })

    // Desenhar linha de tendência
    ctx.beginPath()
    ctx.strokeStyle = "rgba(255, 0, 0, 0.5)"
    ctx.lineWidth = 2

    chartData.forEach((item, index) => {
      const x = padding + ((index + 0.5) / chartData.length) * chartWidth
      const y = canvas.height - padding - ((item.close - minValue) / valueRange) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Configurar redimensionamento
    const handleResize = () => {
      if (canvas) {
        canvas.width = chartContainerRef.current?.clientWidth || 600
        canvas.height = height
        // Redesenhar o gráfico após redimensionar
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        // Chamar a função de desenho novamente
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [chartData, height, chartType])

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={currentInterval} onValueChange={setCurrentInterval}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Intervalo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 minuto</SelectItem>
                <SelectItem value="5m">5 minutos</SelectItem>
                <SelectItem value="15m">15 minutos</SelectItem>
                <SelectItem value="30m">30 minutos</SelectItem>
                <SelectItem value="1h">1 hora</SelectItem>
                <SelectItem value="4h">4 horas</SelectItem>
                <SelectItem value="1d">Diário</SelectItem>
                <SelectItem value="1w">Semanal</SelectItem>
                <SelectItem value="1M">Mensal</SelectItem>
              </SelectContent>
            </Select>

            <Tabs value={chartType} onValueChange={(value) => setChartType(value as any)}>
              <TabsList>
                <TabsTrigger value="candlestick">Candles</TabsTrigger>
                <TabsTrigger value="line">Linha</TabsTrigger>
                <TabsTrigger value="area">Área</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button variant="outline" size="sm">
              <Maximize2 className="h-4 w-4 mr-2" />
              Expandir
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && <div className="p-4 text-center text-red-500">Erro ao carregar dados: {error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Card className="overflow-hidden border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Variação Média</div>
              <div className="text-2xl font-bold">{technicalAnalysis.averageVariation.toFixed(2)}%</div>
              <div className="text-xs text-muted-foreground mt-1">Baseada nos últimos {chartData.length} períodos</div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Taxa de Lucro Sugerida</div>
              <div className="text-2xl font-bold text-primary">{technicalAnalysis.suggestedProfitRate.toFixed(2)}%</div>
              <div className="text-xs text-muted-foreground mt-1">Baseada em 80% da variação média</div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Tendência</div>
              <div className="text-2xl font-bold flex items-center">
                {technicalAnalysis.trend.direction === "up" ? (
                  <span className="text-green-500 flex items-center">
                    <ArrowUpRight className="mr-1 h-5 w-5" />
                    Alta
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center">
                    <ArrowDownRight className="mr-1 h-5 w-5" />
                    Baixa
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Força: {technicalAnalysis.trend.strength} ({(technicalAnalysis.trend.confidence * 100).toFixed(0)}%)
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">RSI</div>
              <div className="text-2xl font-bold">{technicalAnalysis.rsi.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {technicalAnalysis.rsi > 70 ? "Sobrecomprado" : technicalAnalysis.rsi < 30 ? "Sobrevendido" : "Neutro"}
              </div>
            </CardContent>
          </Card>
        </div>

        <div ref={chartContainerRef} className="w-full" style={{ height: `${height}px` }}>
          <canvas width="100%" height={height}></canvas>
        </div>
      </CardContent>
    </Card>
  )
}
