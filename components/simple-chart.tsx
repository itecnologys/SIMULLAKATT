"use client"

import { useEffect, useRef } from "react"

interface ChartData {
  date: string
  value: number
}

export default function SimpleChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Sample data
  const data: ChartData[] = [
    { date: "Jan 1", value: 2000 },
    { date: "Jan 2", value: 2020 },
    { date: "Jan 3", value: 2040 },
    { date: "Jan 4", value: 2030 },
    { date: "Jan 5", value: 2050 },
    { date: "Jan 6", value: 2070 },
    { date: "Jan 7", value: 2060 },
    { date: "Jan 8", value: 2080 },
    { date: "Jan 9", value: 2100 },
    { date: "Jan 10", value: 2120 },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setDimensions = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = 300
      }
    }

    setDimensions()
    window.addEventListener("resize", setDimensions)

    // Draw candlestick chart
    const drawChart = () => {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Calculate dimensions
      const padding = 40
      const chartWidth = canvas.width - padding * 2
      const chartHeight = canvas.height - padding * 2

      // Find min and max values
      const values = data.map((d) => d.value)
      const minValue = Math.min(...values) * 0.95
      const maxValue = Math.max(...values) * 1.05
      const valueRange = maxValue - minValue

      // Draw axes
      ctx.beginPath()
      ctx.strokeStyle = "#ccc"
      ctx.lineWidth = 1
      ctx.moveTo(padding, padding)
      ctx.lineTo(padding, canvas.height - padding)
      ctx.lineTo(canvas.width - padding, canvas.height - padding)
      ctx.stroke()

      // Draw candlesticks
      const barWidth = (chartWidth / data.length) * 0.6

      data.forEach((item, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth
        const y = canvas.height - padding - ((item.value - minValue) / valueRange) * chartHeight

        // Draw candlestick
        const prevValue = index > 0 ? data[index - 1].value : item.value
        const isUp = item.value >= prevValue

        // Body
        ctx.fillStyle = isUp ? "#26a69a" : "#ef5350"
        const bodyHeight = Math.max(2, Math.abs(((item.value - prevValue) / valueRange) * chartHeight))
        const bodyY = isUp ? y : y - bodyHeight

        ctx.fillRect(x - barWidth / 2, bodyY, barWidth, bodyHeight)

        // Wick
        ctx.beginPath()
        ctx.strokeStyle = isUp ? "#26a69a" : "#ef5350"
        ctx.lineWidth = 1

        // Top wick
        const wickTop = y - (isUp ? bodyHeight * 0.5 : bodyHeight * 1.5)
        ctx.moveTo(x, wickTop)
        ctx.lineTo(x, bodyY)

        // Bottom wick
        const wickBottom = y + (isUp ? bodyHeight * 1.5 : bodyHeight * 0.5)
        ctx.moveTo(x, bodyY + bodyHeight)
        ctx.lineTo(x, wickBottom)

        ctx.stroke()
      })

      // Draw labels
      ctx.fillStyle = "#666"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "right"
      ctx.textBaseline = "middle"

      // Y-axis labels
      ctx.fillText(maxValue.toFixed(0), padding - 10, padding)
      ctx.fillText(minValue.toFixed(0), padding - 10, canvas.height - padding)

      // X-axis labels
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      ctx.fillText(data[0].date, padding, canvas.height - padding + 10)
      ctx.fillText(data[data.length - 1].date, canvas.width - padding, canvas.height - padding + 10)
    }

    drawChart()
    window.addEventListener("resize", drawChart)

    // Animation
    let animationFrame: number
    let currentIndex = 0

    const animate = () => {
      if (currentIndex < data.length) {
        // Draw partial data
        const partialData = data.slice(0, currentIndex + 1)

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Calculate dimensions
        const padding = 40
        const chartWidth = canvas.width - padding * 2
        const chartHeight = canvas.height - padding * 2

        // Find min and max values
        const values = data.map((d) => d.value)
        const minValue = Math.min(...values) * 0.95
        const maxValue = Math.max(...values) * 1.05
        const valueRange = maxValue - minValue

        // Draw axes
        ctx.beginPath()
        ctx.strokeStyle = "#ccc"
        ctx.lineWidth = 1
        ctx.moveTo(padding, padding)
        ctx.lineTo(padding, canvas.height - padding)
        ctx.lineTo(canvas.width - padding, canvas.height - padding)
        ctx.stroke()

        // Draw candlesticks
        const barWidth = (chartWidth / data.length) * 0.6

        partialData.forEach((item, index) => {
          const x = padding + (index / (data.length - 1)) * chartWidth
          const y = canvas.height - padding - ((item.value - minValue) / valueRange) * chartHeight

          // Draw candlestick
          const prevValue = index > 0 ? partialData[index - 1].value : item.value
          const isUp = item.value >= prevValue

          // Body
          ctx.fillStyle = isUp ? "#26a69a" : "#ef5350"
          const bodyHeight = Math.max(2, Math.abs(((item.value - prevValue) / valueRange) * chartHeight))
          const bodyY = isUp ? y : y - bodyHeight

          ctx.fillRect(x - barWidth / 2, bodyY, barWidth, bodyHeight)

          // Wick
          ctx.beginPath()
          ctx.strokeStyle = isUp ? "#26a69a" : "#ef5350"
          ctx.lineWidth = 1

          // Top wick
          const wickTop = y - (isUp ? bodyHeight * 0.5 : bodyHeight * 1.5)
          ctx.moveTo(x, wickTop)
          ctx.lineTo(x, bodyY)

          // Bottom wick
          const wickBottom = y + (isUp ? bodyHeight * 1.5 : bodyHeight * 0.5)
          ctx.moveTo(x, bodyY + bodyHeight)
          ctx.lineTo(x, wickBottom)

          ctx.stroke()
        })

        // Draw labels
        ctx.fillStyle = "#666"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "right"
        ctx.textBaseline = "middle"

        // Y-axis labels
        ctx.fillText(maxValue.toFixed(0), padding - 10, padding)
        ctx.fillText(minValue.toFixed(0), padding - 10, canvas.height - padding)

        // X-axis labels
        ctx.textAlign = "center"
        ctx.textBaseline = "top"
        ctx.fillText(data[0].date, padding, canvas.height - padding + 10)
        ctx.fillText(data[data.length - 1].date, canvas.width - padding, canvas.height - padding + 10)

        currentIndex++
        animationFrame = requestAnimationFrame(animate)
      } else {
        currentIndex = 0
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      window.removeEventListener("resize", setDimensions)
      window.removeEventListener("resize", drawChart)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-[300px]" />
}
