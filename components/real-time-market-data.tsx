"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpIcon, ArrowDownIcon, RefreshCw } from "lucide-react"
import { type MarketData, subscribeToMarketData } from "@/lib/real-time-market-service"

interface RealTimeMarketDataProps {
  symbol: string
  showDetails?: boolean
  onDataUpdate?: (data: MarketData) => void
}

export function RealTimeMarketData({ symbol, showDetails = false, onDataUpdate }: RealTimeMarketDataProps) {
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    // Assinar atualizações de dados para este símbolo
    const unsubscribe = subscribeToMarketData(symbol, (data) => {
      setMarketData(data)
      setIsLoading(false)

      // Notificar componente pai se necessário
      if (onDataUpdate) {
        onDataUpdate(data)
      }
    })

    // Limpar assinatura quando o componente for desmontado
    return () => {
      unsubscribe()
    }
  }, [symbol, onDataUpdate])

  // Formatar preço com base no valor
  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toFixed(6)
    if (price < 1) return price.toFixed(4)
    if (price < 10) return price.toFixed(3)
    if (price < 1000) return price.toFixed(2)
    return price.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  // Formatar timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4 flex items-center justify-center">
          <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="ml-2">Carregando dados...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4 text-red-500">Erro ao carregar dados: {error}</CardContent>
      </Card>
    )
  }

  if (!marketData) {
    return (
      <Card>
        <CardContent className="p-4 text-muted-foreground">Nenhum dado disponível para {symbol}</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{marketData.name || symbol}</CardTitle>
            <CardDescription>{symbol}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{formatPrice(marketData.price)}</div>
            <div
              className={`flex items-center justify-end ${marketData.changePercent >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {marketData.changePercent >= 0 ? (
                <ArrowUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-1" />
              )}
              <span>
                {marketData.changePercent >= 0 ? "+" : ""}
                {marketData.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      {showDetails && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Alta:</span> {formatPrice(marketData.high)}
            </div>
            <div>
              <span className="text-muted-foreground">Baixa:</span> {formatPrice(marketData.low)}
            </div>
            {marketData.volume > 0 && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Volume:</span> {marketData.volume.toLocaleString()}
              </div>
            )}
            <div className="col-span-2 flex justify-between items-center mt-2 text-xs text-muted-foreground">
              <span>Atualizado: {formatTimestamp(marketData.lastUpdated)}</span>
              <Badge variant="outline" size="sm">
                {marketData.source}
              </Badge>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// Componente para exibir múltiplos ativos em tempo real
export function RealTimeMarketTable({ symbols, title }: { symbols: string[]; title?: string }) {
  const [marketDataMap, setMarketDataMap] = useState<Record<string, MarketData>>({})
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString())

  useEffect(() => {
    const unsubscribes = symbols.map((symbol) =>
      subscribeToMarketData(symbol, (data) => {
        setMarketDataMap((prev) => ({
          ...prev,
          [symbol]: data,
        }))
        setLastUpdated(new Date().toISOString())
      }),
    )

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [symbols])

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title || "Dados de Mercado em Tempo Real"}</CardTitle>
          <div className="text-xs text-muted-foreground">Atualizado: {new Date(lastUpdated).toLocaleTimeString()}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {symbols.map((symbol) => (
            <RealTimeMarketData key={symbol} symbol={symbol} showDetails={true} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
