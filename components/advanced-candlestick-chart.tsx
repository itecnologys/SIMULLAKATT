"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface AdvancedCandlestickChartProps {
  symbol: string
  startDate: string
  endDate: string
  interval?: "daily" | "weekly" | "monthly"
  height?: number
  title?: string
  description?: string
  onError?: () => void
}

export default function AdvancedCandlestickChart({
  symbol,
  startDate,
  endDate,
  interval = "daily",
  height = 400,
  title = "Gráfico de Preços",
  description = "Dados históricos de preços",
  onError,
}: AdvancedCandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentInterval, setCurrentInterval] = useState(interval)
  const [availableSymbols] = useState([
    { value: "EUR/USD", label: "EUR/USD" },
    { value: "GBP/USD", label: "GBP/USD" },
    { value: "USD/BRL", label: "USD/BRL" },
    { value: "BTC/USD", label: "BTC/USD" },
  ])
  const [currentSymbol, setCurrentSymbol] = useState(symbol)
  const [chartData, setChartData] = useState<any[]>([])

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

      // Armazenar dados para renderização manual
      setChartData(result.data)
    } catch (err) {
      console.error("Erro ao carregar dados do gráfico:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      if (onError) onError()
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar dados iniciais
  useEffect(() => {
    loadChartData()
  }, [currentSymbol, currentInterval])

  // Renderizar gráfico manualmente usando canvas
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
      ctx.fillText(value.toFixed(0), padding - 5, y)
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
  }, [chartData, height])

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

        <div ref={chartContainerRef} className="w-full" style={{ height: `${height}px` }}>
          <canvas width="100%" height={height}></canvas>
        </div>
      </CardContent>
    </Card>
  )
}
