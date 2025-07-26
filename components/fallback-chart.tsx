"use client"

import { useEffect, useRef } from "react"

export default function FallbackChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

    // Sample data
    const data = [2000, 2010, 2040, 2050, 2070, 2080, 2090, 2100, 2110, 2120]

    // Draw chart
    const drawChart = () => {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Calculate dimensions
      const padding = 40
      const chartWidth = canvas.width - padding * 2
      const chartHeight = canvas.height - padding * 2

      // Find min and max values
      const minValue = Math.min(...data) * 0.95
      const maxValue = Math.max(...data) * 1.05
      const valueRange = maxValue - minValue

      // Draw axes
      ctx.beginPath()
      ctx.strokeStyle = "#ccc"
      ctx.lineWidth = 1
      ctx.moveTo(padding, padding)
      ctx.lineTo(padding, canvas.height - padding)
      ctx.lineTo(canvas.width - padding, canvas.height - padding)
      ctx.stroke()

      // Draw data points and lines
      ctx.beginPath()
      ctx.strokeStyle = "hsl(var(--primary))"
      ctx.lineWidth = 2

      data.forEach((value, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth
        const y = canvas.height - padding - ((value - minValue) / valueRange) * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        // Draw point
        ctx.fillStyle = "hsl(var(--primary))"
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.stroke()

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
      ctx.fillText("Jan 1", padding, canvas.height - padding + 10)
      ctx.fillText("Jan 10", canvas.width - padding, canvas.height - padding + 10)
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
        const minValue = Math.min(...data) * 0.95
        const maxValue = Math.max(...data) * 1.05
        const valueRange = maxValue - minValue

        // Draw axes
        ctx.beginPath()
        ctx.strokeStyle = "#ccc"
        ctx.lineWidth = 1
        ctx.moveTo(padding, padding)
        ctx.lineTo(padding, canvas.height - padding)
        ctx.lineTo(canvas.width - padding, canvas.height - padding)
        ctx.stroke()

        // Draw data points and lines
        ctx.beginPath()
        ctx.strokeStyle = "hsl(var(--primary))"
        ctx.lineWidth = 2

        partialData.forEach((value, index) => {
          const x = padding + (index / (data.length - 1)) * chartWidth
          const y = canvas.height - padding - ((value - minValue) / valueRange) * chartHeight

          if (index === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }

          // Draw point
          ctx.fillStyle = "hsl(var(--primary))"
          ctx.beginPath()
          ctx.arc(x, y, 4, 0, Math.PI * 2)
          ctx.fill()
        })

        ctx.stroke()

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
        ctx.fillText("Jan 1", padding, canvas.height - padding + 10)
        ctx.fillText("Jan 10", canvas.width - padding, canvas.height - padding + 10)

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
