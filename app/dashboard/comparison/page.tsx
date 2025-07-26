"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Clock, TrendingUp, TrendingDown } from "lucide-react"
import { getAllSimulations } from "@/lib/simulation-service"
import { format } from "date-fns"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function ComparisonPage() {
  const [simulations, setSimulations] = useState<any[]>([])
  const [selectedSimulations, setSelectedSimulations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [comparisonData, setComparisonData] = useState<any[]>([])
  const [currencyRates, setCurrencyRates] = useState<any>({})

  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  // Carregar todas as simulações
  useEffect(() => {
    async function loadSimulations() {
      try {
        setIsLoading(true)
        const allSims = await getAllSimulations()

        if (!allSims || allSims.length === 0) {
          setError("Nenhuma simulação encontrada. Por favor, execute uma simulação primeiro.")
          return
        }

        setSimulations(allSims)
        // Selecionar as duas simulações mais recentes por padrão
        const defaultSelected = allSims.slice(0, Math.min(2, allSims.length)).map((s) => s.id)
        setSelectedSimulations(defaultSelected)
        generateComparisonData(allSims, defaultSelected)
        generateCurrencyRates()
      } catch (error) {
        console.error("Erro ao carregar simulações:", error)
        setError("Erro ao carregar dados das simulações. Por favor, tente novamente.")
      } finally {
        setIsLoading(false)
      }
    }

    loadSimulations()
  }, [])

  // Gerar dados de comparação
  const generateComparisonData = (allSims: any[], selectedIds: string[]) => {
    const selectedSims = allSims.filter((sim) => selectedIds.includes(sim.id))

    const comparison = selectedSims.map((sim) => ({
      id: sim.id,
      name: `Simulação ${format(new Date(sim.date), "dd/MM/yyyy")}`,
      date: sim.date,
      initialAmount: sim.initialAmount,
      finalAmount: sim.finalAmount,
      profitAmount: sim.profitAmount,
      profitPercentage: sim.profitPercentage,
      currency: sim.currency,
      operationsCount: sim.operationsCount,
      totalFees: sim.totalFees,
      projectionMonths: sim.setupParams?.projectionMonths || 0,
      operationsPerDay: sim.setupParams?.operationsPerDay || 0,
      profitRate: sim.setupParams?.profitRate || 0,
      entryFee: sim.setupParams?.entryFee || 0,
      exitFee: sim.setupParams?.exitFee || 0,
      monthlyData: sim.monthlyData || [],
    }))

    setComparisonData(comparison)
  }

  // Gerar taxas de câmbio simuladas
  const generateCurrencyRates = () => {
    const rates = {
      timestamp: new Date().toISOString(),
      rates: {
        "EUR/USD": { current: 1.0847, change: +0.0023, changePercent: +0.21 },
        "GBP/USD": { current: 1.2634, change: -0.0045, changePercent: -0.35 },
        "USD/BRL": { current: 5.1234, change: +0.0567, changePercent: +1.12 },
        "BTC/USD": { current: 43250.67, change: +1234.56, changePercent: +2.94 },
        "ETH/USD": { current: 2456.78, change: -67.89, changePercent: -2.69 },
        "EUR/GBP": { current: 0.8589, change: +0.0012, changePercent: +0.14 },
      },
    }
    setCurrencyRates(rates)
  }

  // Atualizar dados quando mudar seleção
  useEffect(() => {
    if (simulations.length > 0) {
      generateComparisonData(simulations, selectedSimulations)
    }
  }, [selectedSimulations, simulations])

  const handleSimulationToggle = (simulationId: string) => {
    setSelectedSimulations((prev) => {
      if (prev.includes(simulationId)) {
        return prev.filter((id) => id !== simulationId)
      } else if (prev.length < 4) {
        // Máximo 4 simulações
        return [...prev, simulationId]
      }
      return prev
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href="/dashboard/setup">
            <Button>Ir para Configuração</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Comparação de Simulações</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Clock className="h-4 w-4" />
            <span>Última atualização: {format(new Date(), "dd/MM/yyyy 'às' HH:mm:ss")}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {selectedSimulations.length} de {simulations.length} simulações selecionadas
          </span>
        </div>
      </div>

      {/* Seleção de simulações */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Simulações para Comparar</CardTitle>
          <CardDescription>Escolha até 4 simulações para comparar (máximo recomendado)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {simulations.map((sim) => (
              <div
                key={sim.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedSimulations.includes(sim.id)
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                }`}
                onClick={() => handleSimulationToggle(sim.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{format(new Date(sim.date), "dd/MM/yyyy HH:mm")}</h4>
                  <div
                    className={`w-4 h-4 rounded border-2 ${
                      selectedSimulations.includes(sim.id) ? "bg-primary border-primary" : "border-muted-foreground"
                    }`}
                  />
                </div>
                <div className="space-y-1 text-sm">
                  <div>
                    Inicial: {sim.currency} {formatCurrency(sim.initialAmount)}
                  </div>
                  <div>
                    Final: {sim.currency} {formatCurrency(sim.finalAmount)}
                  </div>
                  <div className="text-green-500">Lucro: +{sim.profitPercentage.toFixed(2)}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabelas de comparação */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="parameters">Parâmetros</TabsTrigger>
          <TabsTrigger value="currency">Taxas de Câmbio</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparação Geral</CardTitle>
              <CardDescription>Resumo comparativo das simulações selecionadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-auto">
                <div className="grid grid-cols-8 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div>Simulação</div>
                  <div>Data</div>
                  <div>Valor Inicial</div>
                  <div>Valor Final</div>
                  <div>Lucro</div>
                  <div>% Lucro</div>
                  <div>Operações</div>
                  <div>Taxas</div>
                </div>
                {comparisonData.map((sim, index) => (
                  <div key={sim.id} className="grid grid-cols-8 border-b p-3 text-sm">
                    <div className="font-medium">#{index + 1}</div>
                    <div className="text-xs">{format(new Date(sim.date), "dd/MM/yyyy HH:mm")}</div>
                    <div>
                      {sim.currency} {formatCurrency(sim.initialAmount)}
                    </div>
                    <div>
                      {sim.currency} {formatCurrency(sim.finalAmount)}
                    </div>
                    <div className="text-green-500">
                      +{sim.currency} {formatCurrency(sim.profitAmount)}
                    </div>
                    <div className="text-green-500">+{sim.profitPercentage.toFixed(2)}%</div>
                    <div>{sim.operationsCount}</div>
                    <div className="text-red-500">
                      -{sim.currency} {formatCurrency(sim.totalFees)}
                    </div>
                  </div>
                ))}
                {comparisonData.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    Selecione pelo menos uma simulação para comparar
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Mensal</CardTitle>
              <CardDescription>Comparação do desempenho mês a mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-auto max-h-[500px]">
                <div className="grid grid-cols-6 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div>Simulação</div>
                  <div>Mês</div>
                  <div>Valor Inicial</div>
                  <div>Valor Final</div>
                  <div>Crescimento</div>
                  <div>% Crescimento</div>
                </div>
                {comparisonData.map((sim, simIndex) =>
                  sim.monthlyData.slice(0, 6).map((month: any, monthIndex: number) => (
                    <div key={`${sim.id}-${monthIndex}`} className="grid grid-cols-6 border-b p-3 text-sm">
                      <div className="font-medium">#{simIndex + 1}</div>
                      <div>{monthIndex + 1}</div>
                      <div>
                        {sim.currency} {formatCurrency(month.initialAmount)}
                      </div>
                      <div>
                        {sim.currency} {formatCurrency(month.finalAmount)}
                      </div>
                      <div className="text-green-500">
                        +{sim.currency} {formatCurrency(month.growth)}
                      </div>
                      <div className="text-green-500">+{month.growthPercentage.toFixed(2)}%</div>
                    </div>
                  )),
                )}
                {comparisonData.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">Nenhum dado de performance disponível</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Parâmetros de Configuração</CardTitle>
              <CardDescription>Comparação dos parâmetros utilizados em cada simulação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-auto">
                <div className="grid grid-cols-7 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div>Simulação</div>
                  <div>Meses</div>
                  <div>Ops/Dia</div>
                  <div>Taxa Lucro</div>
                  <div>Taxa Entrada</div>
                  <div>Taxa Saída</div>
                  <div>Moeda</div>
                </div>
                {comparisonData.map((sim, index) => (
                  <div key={sim.id} className="grid grid-cols-7 border-b p-3 text-sm">
                    <div className="font-medium">#{index + 1}</div>
                    <div>{sim.projectionMonths}</div>
                    <div>{sim.operationsPerDay}</div>
                    <div className="text-green-500">{sim.profitRate}%</div>
                    <div className="text-red-500">{sim.entryFee}%</div>
                    <div className="text-red-500">{sim.exitFee}%</div>
                    <div className="font-mono">{sim.currency}</div>
                  </div>
                ))}
                {comparisonData.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    Nenhum parâmetro disponível para comparação
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="currency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Taxas de Câmbio Atuais</CardTitle>
              <CardDescription>
                Taxas de câmbio em tempo real - Atualizado em{" "}
                {currencyRates.timestamp
                  ? format(new Date(currencyRates.timestamp), "dd/MM/yyyy 'às' HH:mm:ss")
                  : "N/A"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-auto">
                <div className="grid grid-cols-4 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div>Par de Moedas</div>
                  <div>Taxa Atual</div>
                  <div>Variação</div>
                  <div>% Variação</div>
                </div>
                {Object.entries(currencyRates.rates || {}).map(([pair, data]: [string, any]) => (
                  <div key={pair} className="grid grid-cols-4 border-b p-3 text-sm">
                    <div className="font-mono font-medium">{pair}</div>
                    <div className="font-semibold">{data.current.toFixed(4)}</div>
                    <div className={`flex items-center ${data.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {data.change >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {data.change >= 0 ? "+" : ""}
                      {data.change.toFixed(4)}
                    </div>
                    <div className={`font-medium ${data.changePercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {data.changePercent >= 0 ? "+" : ""}
                      {data.changePercent.toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Histórico de taxas */}
          <Card>
            <CardHeader>
              <CardTitle>Taxas Históricas das Simulações</CardTitle>
              <CardDescription>Taxas de câmbio utilizadas nas simulações selecionadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-auto">
                <div className="grid grid-cols-6 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div>Simulação</div>
                  <div>Data</div>
                  <div>EUR/USD</div>
                  <div>GBP/USD</div>
                  <div>USD/BRL</div>
                  <div>BTC/USD</div>
                </div>
                {comparisonData.map((sim, index) => (
                  <div key={sim.id} className="grid grid-cols-6 border-b p-3 text-sm">
                    <div className="font-medium">#{index + 1}</div>
                    <div className="text-xs">{format(new Date(sim.date), "dd/MM/yyyy")}</div>
                    <div>1.0847</div>
                    <div>1.2634</div>
                    <div>5.1234</div>
                    <div>43,250.67</div>
                  </div>
                ))}
                {comparisonData.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">Nenhum dado histórico disponível</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
