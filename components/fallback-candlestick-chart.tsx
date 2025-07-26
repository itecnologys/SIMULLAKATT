"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface CandlestickData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

interface FallbackCandlestickChartProps {
  symbol: string
  startDate: string
  endDate: string
  interval?: "daily" | "weekly" | "monthly"
  height?: number
  title?: string
  description?: string
}

export default function FallbackCandlestickChart({
  symbol,
  startDate,
  endDate,
  interval = "daily",
  height = 400,
  title = "Gráfico de Preços",
  description = "Dados históricos de preços",
}: FallbackCandlestickChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentInterval, setCurrentInterval] = useState(interval)
  const [currentSymbol, setCurrentSymbol] = useState(symbol)
  const [candlestickData, setCandlestickData] = useState<CandlestickData[]>([])
  const [availableSymbols] = useState([
    { value: "EUR/USD", label: "EUR/USD" },
    { value: "GBP/USD", label: "GBP/USD" },
    { value: "USD/BRL", label: "USD/BRL" },
    { value: "BTC/USD", label: "BTC/USD" },
  ])

  // Função para carregar dados
  const loadChartData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/historical-rates?symbol=${currentSymbol}&startDate=${startDate}&endDate=${endDate}&interval=${currentInterval}`,
      )

      if (!response.ok) {
        throw new Error("Falha ao carregar dados")
      }

      const result = await response.json()

      if (!result.success || !result.data || !result.data.length) {
        throw new Error("Dados inválidos recebidos")
      }

      setCandlestickData(result.data)
    } catch (err) {
      console.error("Erro ao carregar dados do gráfico:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido")

      // Dados de exemplo para fallback
      const sampleData: CandlestickData[] = [
        { time: "2023-01-01", open: 2000, high: 2020, low: 1990, close: 2010 },
        { time: "2023-01-02", open: 2010, high: 2030, low: 2000, close: 2020 },
        { time: "2023-01-03", open: 2020, high: 2050, low: 2010, close: 2040 },
        { time: "2023-01-04", open: 2040, high: 2060, low: 2030, close: 2050 },
        { time: "2023-01-05", open: 2050, high: 2080, low: 2040, close: 2070 },
        { time: "2023-01-06", open: 2070, high: 2090, low: 2060, close: 2080 },
        { time: "2023-01-07", open: 2080, high: 2100, low: 2070, close: 2090 },
        { time: "2023-01-08", open: 2090, high: 2110, low: 2080, close: 2100 },
        { time: "2023-01-09", open: 2100, high: 2120, low: 2090, close: 2110 },
        { time: "2023-01-10", open: 2110, high: 2130, low: 2100, close: 2120 },
      ]
      setCandlestickData(sampleData)
    } finally {
      setIsLoading(false)
    }
  }

  // Desenhar o gráfico de candlestick
  useEffect(() => {
    if (!canvasRef.current || candlestickData.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Definir dimensões do canvas
    const setDimensions = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = height
      }
    }

    setDimensions()

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calcular dimensões
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2

    // Encontrar valores mínimos e máximos
    const highValues = candlestickData.map((d) => d.high)
    const lowValues = candlestickData.map((d) => d.low)
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
      ctx.fillText(value.toFixed(0), padding - 5, y)
    }

    // Linhas de grade verticais
    for (let i = 0; i <= candlestickData.length; i++) {
      const x = padding + (i / candlestickData.length) * chartWidth
      ctx.moveTo(x, padding)
      ctx.lineTo(x, canvas.height - padding)
    }

    ctx.stroke()

    // Desenhar candlesticks
    const barWidth = (chartWidth / candlestickData.length) * 0.6

    candlestickData.forEach((item, index) => {
      const x = padding + ((index + 0.5) / candlestickData.length) * chartWidth

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
      if (index === 0 || index === candlestickData.length - 1) {
        ctx.fillStyle = "#666"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "top"
        const dateLabel = new Date(item.time).toLocaleDateString()
        ctx.fillText(dateLabel, x, canvas.height - padding + 5)
      }
    })

    // Configurar redimensionamento
    window.addEventListener("resize", setDimensions)

    return () => {
      window.removeEventListener("resize", setDimensions)
    }
  }, [candlestickData, height])

  // Carregar dados iniciais
  useEffect(() => {
    loadChartData()
  }, [currentSymbol, currentInterval])

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={currentSymbol} onValueChange={setCurrentSymbol}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Selecionar par" />
              </SelectTrigger>
              <SelectContent>
                {availableSymbols.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={currentInterval} onValueChange={setCurrentInterval}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Intervalo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diário</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={loadChartData}>
              Atualizar
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

        <canvas ref={canvasRef} className="w-full" style={{ height: `${height}px` }} />
      </CardContent>
    </Card>
  )
}
