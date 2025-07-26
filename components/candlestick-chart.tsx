"use client"

import { useEffect, useRef, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CandlestickData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

export default function CandlestickChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [interval, setInterval] = useState<string>("1d")
  const [chartType, setChartType] = useState<string>("candlestick")

  // Dados de exemplo para o gráfico de candlestick
  const generateSampleData = (): CandlestickData[] => {
    const data: CandlestickData[] = []
    const today = new Date()
    let basePrice = 100

    for (let i = 30; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)

      // Gerar variação aleatória
      const variation = (Math.random() - 0.5) * 5
      const open = basePrice
      const close = basePrice + variation
      const high = Math.max(open, close) + Math.random() * 2
      const low = Math.min(open, close) - Math.random() * 2
      const volume = Math.floor(Math.random() * 1000000) + 500000

      data.push({
        time: date.toISOString().split("T")[0],
        open,
        high,
        low,
        close,
        volume,
      })

      // Atualizar o preço base para o próximo dia
      basePrice = close
    }

    return data
  }

  useEffect(() => {
    if (!chartContainerRef.current) return

    const container = chartContainerRef.current
    const canvas = document.createElement("canvas")
    canvas.width = container.clientWidth
    canvas.height = container.clientHeight

    // Limpar o container antes de adicionar o novo canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }

    container.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Dados de exemplo
    const data = generateSampleData()

    // Desenhar o gráfico de candlestick
    const drawCandlestickChart = () => {
      if (!ctx) return

      // Limpar o canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Definir margens
      const margin = { top: 20, right: 30, bottom: 30, left: 50 }
      const width = canvas.width - margin.left - margin.right
      const height = canvas.height - margin.top - margin.bottom

      // Encontrar valores mínimos e máximos
      const highValues = data.map((d) => d.high)
      const lowValues = data.map((d) => d.low)
      const minValue = Math.min(...lowValues) * 0.99
      const maxValue = Math.max(...highValues) * 1.01
      const valueRange = maxValue - minValue

      // Desenhar eixos
      ctx.beginPath()
      ctx.strokeStyle = "#ccc"
      ctx.lineWidth = 1
      ctx.moveTo(margin.left, margin.top)
      ctx.lineTo(margin.left, canvas.height - margin.bottom)
      ctx.lineTo(canvas.width - margin.right, canvas.height - margin.bottom)
      ctx.stroke()

      // Desenhar linhas de grade
      ctx.beginPath()
      ctx.strokeStyle = "rgba(204, 204, 204, 0.3)"
      ctx.lineWidth = 1

      // Linhas de grade horizontais
      const gridCount = 5
      for (let i = 0; i <= gridCount; i++) {
        const y = margin.top + (i / gridCount) * height
        ctx.moveTo(margin.left, y)
        ctx.lineTo(canvas.width - margin.right, y)

        // Adicionar rótulos de preço
        const value = maxValue - (i / gridCount) * valueRange
        ctx.fillStyle = "#666"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "right"
        ctx.textBaseline = "middle"
        ctx.fillText(value.toFixed(2), margin.left - 5, y)
      }

      // Linhas de grade verticais
      const dateStep = Math.max(1, Math.floor(data.length / 10))
      for (let i = 0; i < data.length; i += dateStep) {
        const x = margin.left + (i / (data.length - 1)) * width
        ctx.moveTo(x, margin.top)
        ctx.lineTo(x, canvas.height - margin.bottom)

        // Adicionar rótulos de data
        const date = new Date(data[i].time)
        const dateLabel = `${date.getDate()}/${date.getMonth() + 1}`
        ctx.fillStyle = "#666"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "top"
        ctx.fillText(dateLabel, x, canvas.height - margin.bottom + 5)
      }

      ctx.stroke()

      // Desenhar candlesticks
      const candleWidth = Math.min((width / data.length) * 0.8, 15)

      if (chartType === "candlestick") {
        data.forEach((item, index) => {
          const x = margin.left + (index / (data.length - 1)) * width

          // Calcular posições y
          const openY = canvas.height - margin.bottom - ((item.open - minValue) / valueRange) * height
          const closeY = canvas.height - margin.bottom - ((item.close - minValue) / valueRange) * height
          const highY = canvas.height - margin.bottom - ((item.high - minValue) / valueRange) * height
          const lowY = canvas.height - margin.bottom - ((item.low - minValue) / valueRange) * height

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

          ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight)
        })
      } else if (chartType === "line") {
        // Desenhar gráfico de linha
        ctx.beginPath()
        ctx.strokeStyle = "#2196F3"
        ctx.lineWidth = 2

        data.forEach((item, index) => {
          const x = margin.left + (index / (data.length - 1)) * width
          const y = canvas.height - margin.bottom - ((item.close - minValue) / valueRange) * height

          if (index === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        })

        ctx.stroke()
      }
    }

    drawCandlestickChart()

    // Redimensionar o gráfico quando a janela for redimensionada
    const handleResize = () => {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
      drawCandlestickChart()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [chartType, interval])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs defaultValue={chartType} onValueChange={setChartType}>
          <TabsList>
            <TabsTrigger value="candlestick">Candlestick</TabsTrigger>
            <TabsTrigger value="line">Linha</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={interval} onValueChange={setInterval}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Intervalo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">1 hora</SelectItem>
            <SelectItem value="4h">4 horas</SelectItem>
            <SelectItem value="1d">1 dia</SelectItem>
            <SelectItem value="1w">1 semana</SelectItem>
            <SelectItem value="1m">1 mês</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div ref={chartContainerRef} className="w-full h-[350px] border rounded-md"></div>
    </div>
  )
}
