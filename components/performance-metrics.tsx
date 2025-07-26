"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowUpIcon, ArrowDownIcon, Clock, TrendingUp, BarChart4, Percent, AlertTriangle } from "lucide-react"

interface PerformanceMetricsProps {
  data: any
  timeframe: string
  profitTarget: number
}

// Função para calcular a taxa de lucro real baseada em dados históricos
const calculateRealProfitRate = (data: any, timeframe: string) => {
  if (!data || !data.timeframes || !data.timeframes[timeframe]) {
    return 0
  }

  const { performance, volatility, consistency, successRate } = data.timeframes[timeframe]

  // Fórmula que considera performance, volatilidade, consistência e taxa de sucesso
  const realProfitRate = (performance * (1 + successRate)) / (1 + volatility * (1 - consistency))

  return Number.parseFloat(realProfitRate.toFixed(2))
}

// Função para converter timeframe em horas
const getTimeframeInHours = (timeframe: string) => {
  switch (timeframe) {
    case "15m":
      return 0.25
    case "1h":
      return 1
    case "4h":
      return 4
    case "6h":
      return 6
    case "24h":
      return 24
    case "1w":
      return 168 // 7 * 24
    default:
      return 1
  }
}

// Formata o tempo estimado para atingir o alvo
const formatTimeToTarget = (hours: number) => {
  if (hours < 1) {
    return `${Math.round(hours * 60)} minutos`
  } else if (hours < 24) {
    return `${hours.toFixed(1)} horas`
  } else {
    return `${(hours / 24).toFixed(1)} dias`
  }
}

export function PerformanceMetrics({ data, timeframe, profitTarget }: PerformanceMetricsProps) {
  if (!data || !data.timeframes || !data.timeframes[timeframe]) {
    return <div>Dados não disponíveis</div>
  }

  const metrics = data.timeframes[timeframe]
  const realProfitRate = calculateRealProfitRate(data, timeframe)
  const timeToTarget = (profitTarget / realProfitRate) * getTimeframeInHours(timeframe)

  // Calcula o risco com base na volatilidade e consistência
  const risk = metrics.volatility * (1 - metrics.consistency) * 100

  // Determina a força da tendência
  const trendStrength =
    metrics.trend === "neutral"
      ? 0
      : metrics.trend === "up"
        ? metrics.performance * metrics.consistency * 100
        : -metrics.performance * metrics.consistency * 100

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Taxa de Lucro Real</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">
            {realProfitRate.toFixed(2)}%
            <span className="text-sm font-normal text-muted-foreground ml-1">/ {timeframe}</span>
          </div>

          <div className="space-y-4 mt-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Tempo para atingir {profitTarget}%</span>
                <span className="text-sm font-medium">{formatTimeToTarget(timeToTarget)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Progress value={(profitTarget / timeToTarget) * 100} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Métricas de Desempenho</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Tendência</span>
              </div>
              <div className="flex items-center">
                {metrics.trend === "up" && <ArrowUpIcon className="h-4 w-4 text-green-600 mr-1" />}
                {metrics.trend === "down" && <ArrowDownIcon className="h-4 w-4 text-red-600 mr-1" />}
                {metrics.trend === "neutral" && <span className="inline-block w-4 h-0.5 bg-yellow-500 mr-1"></span>}
                <span
                  className={`text-sm font-medium ${
                    metrics.trend === "up"
                      ? "text-green-600"
                      : metrics.trend === "down"
                        ? "text-red-600"
                        : "text-yellow-600"
                  }`}
                >
                  {metrics.trend === "up" ? "Alta" : metrics.trend === "down" ? "Baixa" : "Neutro"}
                </span>
              </div>
            </div>
            <Progress
              value={Math.abs(trendStrength)}
              className={`h-2 ${
                metrics.trend === "up" ? "bg-green-200" : metrics.trend === "down" ? "bg-red-200" : "bg-yellow-200"
              }`}
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <div className="flex items-center gap-1">
                <BarChart4 className="h-4 w-4" />
                <span className="text-sm font-medium">Performance</span>
              </div>
              <span className="text-sm font-medium">
                {metrics.performance > 0 ? "+" : ""}
                {metrics.performance.toFixed(2)}%
              </span>
            </div>
            <Progress
              value={Math.min(Math.abs(metrics.performance) * 10, 100)}
              className={`h-2 ${metrics.performance >= 0 ? "bg-green-200" : "bg-red-200"}`}
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Risco</span>
              </div>
              <span className="text-sm font-medium">{risk.toFixed(0)}%</span>
            </div>
            <Progress value={risk} className="h-2 bg-red-200" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <div className="flex items-center gap-1">
                <Percent className="h-4 w-4" />
                <span className="text-sm font-medium">Taxa de Sucesso</span>
              </div>
              <span className="text-sm font-medium">{(metrics.successRate * 100).toFixed(0)}%</span>
            </div>
            <Progress value={metrics.successRate * 100} className="h-2 bg-blue-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
