"use client"
import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { getLatestSimulation } from "@/lib/simulation-service"

export default function DashboardChart() {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currency, setCurrency] = useState("EUR")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadChartData() {
      try {
        setIsLoading(true)
        const simulation = await getLatestSimulation()

        if (simulation && simulation.monthlyData && simulation.monthlyData.length > 0) {
          // Use first month data for chart
          const firstMonth = simulation.monthlyData[0]

          // Format data for chart
          const chartData = firstMonth.days.map((day, index) => ({
            day: `Dia ${index + 1}`,
            value: day.finalAmount,
            operations: simulation.setupParams?.operationsPerDay || 3,
          }))

          setData(chartData)
          setCurrency(simulation.currency || "EUR")
        } else {
          setError("Nenhum dado de simulação encontrado")

          // Sample data if no simulation found
          const sampleData = Array.from({ length: 30 }, (_, i) => ({
            day: `Dia ${i + 1}`,
            value: 2000 + i * 16,
            operations: 3,
          }))
          setData(sampleData)
        }
      } catch (error) {
        setError("Erro ao carregar dados do gráfico")

        // Sample data on error
        const sampleData = Array.from({ length: 30 }, (_, i) => ({
          day: `Dia ${i + 1}`,
          value: 2000 + i * 16,
          operations: 3,
        }))
        setData(sampleData)
      } finally {
        setIsLoading(false)
      }
    }

    loadChartData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip formatter={(value) => [`${currency} ${value}`, "Valor"]} labelFormatter={(label) => `${label}`} />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          name="Valor do Investimento"
          stroke="hsl(var(--primary))"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
