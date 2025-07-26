"use client"

import { useState, useEffect, useRef } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface TradingViewChartProps {
  symbol: string
  timeframe?: string
  height?: number
}

// Exportação nomeada para compatibilidade com importações existentes
export function TradingViewChart({ symbol = "BTCUSD", timeframe = "D", height = 400 }: TradingViewChartProps) {
  return <TradingViewChartImpl symbol={symbol} timeframe={timeframe} height={height} />
}

// Exportação padrão para manter compatibilidade com importações default
export default function TradingViewChartImpl({
  symbol = "BTCUSD",
  timeframe = "D",
  height = 400,
}: TradingViewChartProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const chartContainerRef = useRef<HTMLDivElement>(null)

  // Gerar dados simulados para o gráfico de candlestick
  const generateCandlestickData = () => {
    const data = []
    let price = symbol.includes("BTC")
      ? 43000
      : symbol.includes("ETH")
        ? 2300
        : symbol.includes("EUR")
          ? 1.09
          : symbol.includes("JPY")
            ? 149
            : symbol.includes("XAU")
              ? 2030
              : symbol.includes("WTI")
                ? 63
                : 100

    const volatility =
      symbol.includes("BTC") || symbol.includes("ETH")
        ? 0.03
        : symbol.includes("WTI")
          ? 0.015
          : symbol.includes("XAU")
            ? 0.01
            : symbol.includes("EUR") || symbol.includes("JPY")
              ? 0.005
              : 0.01

    const now = new Date()
    const days = 30

    for (let i = 0; i < days; i++) {
      const date = new Date(now)
      date.setDate(now.getDate() - (days - i))

      // Gerar variação aleatória
      const change = price * volatility * (Math.random() * 2 - 1)
      const open = price
      const close = price + change
      const high = Math.max(open, close) + Math.abs(change) * Math.random() * 0.5
      const low = Math.min(open, close) - Math.abs(change) * Math.random() * 0.5

      data.push({
        date: date.toISOString().split("T")[0],
        open,
        high,
        low,
        close,
      })

      // Atualizar preço para o próximo dia
      price = close
    }

    return data
  }

  useEffect(() => {
    // Resetar estados
    setIsLoading(true)
    setHasError(false)

    const container = chartContainerRef.current
    if (!container) return

    // Limpar o container
    container.innerHTML = ""

    // Simular carregamento
    const loadingTimeout = setTimeout(() => {
      try {
        // Criar canvas para desenhar o gráfico
        const canvas = document.createElement("canvas")
        canvas.width = container.clientWidth
        canvas.height = height
        container.appendChild(canvas)

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          throw new Error("Não foi possível obter o contexto 2D do canvas")
        }

        // Desenhar gráfico de candlestick
        const data = generateCandlestickData()
        drawCandlestickChart(ctx, canvas.width, canvas.height, data)

        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao renderizar gráfico:", error)
        setHasError(true)
        setIsLoading(false)
      }
    }, 1000)

    return () => {
      clearTimeout(loadingTimeout)
      if (container) {
        container.innerHTML = ""
      }
    }
  }, [symbol, timeframe, height])

  // Função para desenhar o gráfico de candlestick
  const drawCandlestickChart = (ctx: CanvasRenderingContext2D, width: number, height: number, data: any[]) => {
    // Definir margens e dimensões
    const margin = { top: 20, right: 50, bottom: 30, left: 60 }
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom

    // Limpar canvas
    ctx.clearRect(0, 0, width, height)

    // Definir fundo
    ctx.fillStyle = "#131722"
    ctx.fillRect(0, 0, width, height)

    // Encontrar valores mínimos e máximos
    const highValues = data.map((d) => d.high)
    const lowValues = data.map((d) => d.low)
    const maxPrice = Math.max(...highValues)
    const minPrice = Math.min(...lowValues)
    const priceRange = maxPrice - minPrice

    // Adicionar margem ao range
    const paddedMaxPrice = maxPrice + priceRange * 0.05
    const paddedMinPrice = minPrice - priceRange * 0.05
    const paddedPriceRange = paddedMaxPrice - paddedMinPrice

    // Função para converter preço para coordenada Y
    const priceToY = (price: number) => {
      return margin.top + chartHeight - ((price - paddedMinPrice) / paddedPriceRange) * chartHeight
    }

    // Função para converter índice para coordenada X
    const indexToX = (index: number) => {
      const barWidth = chartWidth / data.length
      return margin.left + index * barWidth + barWidth / 2
    }

    // Desenhar grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 0.5

    // Linhas horizontais
    const priceStep = paddedPriceRange / 5
    for (let i = 0; i <= 5; i++) {
      const price = paddedMinPrice + priceStep * i
      const y = priceToY(price)

      ctx.beginPath()
      ctx.moveTo(margin.left, y)
      ctx.lineTo(margin.left + chartWidth, y)
      ctx.stroke()

      // Preço no eixo Y
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
      ctx.textAlign = "right"
      ctx.textBaseline = "middle"
      ctx.fillText(price.toFixed(2), margin.left - 5, y)
    }

    // Linhas verticais (datas)
    const dateStep = Math.ceil(data.length / 10)
    for (let i = 0; i < data.length; i += dateStep) {
      const x = indexToX(i)

      ctx.beginPath()
      ctx.moveTo(x, margin.top)
      ctx.lineTo(x, margin.top + chartHeight)
      ctx.stroke()

      // Data no eixo X
      if (i < data.length) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
        ctx.textAlign = "center"
        ctx.textBaseline = "top"
        const date = new Date(data[i].date)
        const dateStr = `${date.getDate()}/${date.getMonth() + 1}`
        ctx.fillText(dateStr, x, margin.top + chartHeight + 5)
      }
    }

    // Desenhar candlesticks
    const candleWidth = Math.max(2, Math.min(15, (chartWidth / data.length) * 0.8))

    for (let i = 0; i < data.length; i++) {
      const d = data[i]
      const x = indexToX(i)
      const openY = priceToY(d.open)
      const closeY = priceToY(d.close)
      const highY = priceToY(d.high)
      const lowY = priceToY(d.low)

      // Desenhar linha de alta/baixa
      ctx.strokeStyle = d.close >= d.open ? "#26a69a" : "#ef5350"
      ctx.beginPath()
      ctx.moveTo(x, highY)
      ctx.lineTo(x, lowY)
      ctx.stroke()

      // Desenhar corpo do candle
      ctx.fillStyle = d.close >= d.open ? "#26a69a" : "#ef5350"
      const candleHeight = Math.abs(closeY - openY) || 1
      ctx.fillRect(x - candleWidth / 2, Math.min(openY, closeY), candleWidth, candleHeight)
    }

    // Adicionar título do gráfico
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.textAlign = "left"
    ctx.textBaseline = "top"
    ctx.font = "bold 14px Arial"
    ctx.fillText(`${symbol} - ${timeframe}`, margin.left, 5)

    // Adicionar último preço
    if (data.length > 0) {
      const lastPrice = data[data.length - 1].close
      ctx.textAlign = "right"
      ctx.fillText(`${lastPrice.toFixed(2)}`, width - margin.right, 5)
    }
  }

  return (
    <div style={{ height: `${height}px` }} className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card">
          <Skeleton className="h-[90%] w-[90%]" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-card">
          <div className="text-center p-4">
            <p className="text-destructive mb-2">Erro ao carregar o gráfico</p>
            <p className="text-sm text-muted-foreground">Não foi possível renderizar o gráfico para {symbol}</p>
          </div>
        </div>
      )}

      <div
        ref={chartContainerRef}
        className="w-full h-full"
        style={{ visibility: isLoading || hasError ? "hidden" : "visible" }}
      />
    </div>
  )
}
