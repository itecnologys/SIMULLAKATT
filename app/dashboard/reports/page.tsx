"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Calendar, ChevronLeft, ChevronRight, AlertCircle, Clock, Calculator } from "lucide-react"
import { getAllSimulations } from "@/lib/simulation-service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format } from "date-fns"

export default function ReportsPage() {
  const [reportPeriod, setReportPeriod] = useState("monthly")
  const [currentMonth, setCurrentMonth] = useState(1)
  const [simulations, setSimulations] = useState<any[]>([])
  const [selectedSimulation, setSelectedSimulation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [operationsData, setOperationsData] = useState<any[]>([])
  const [visibleOperations, setVisibleOperations] = useState<any[]>([])
  const [showAllOperations, setShowAllOperations] = useState(false)
  const [operationsPerPage] = useState(20)
  const [calculationReports, setCalculationReports] = useState<any>({
    daily: [],
    weekly: [],
    monthly: [],
  })

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
        setSelectedSimulation(allSims[0]) // Selecionar a mais recente
        generateOperationsData(allSims[0], reportPeriod)
        generateCalculationReports(allSims[0])
      } catch (error) {
        console.error("Erro ao carregar simulações:", error)
        setError("Erro ao carregar dados das simulações. Por favor, tente novamente.")
      } finally {
        setIsLoading(false)
      }
    }

    loadSimulations()
  }, [])

  // Gerar relatórios de cálculos por período
  const generateCalculationReports = (sim: any) => {
    if (!sim || !sim.setupParams || !sim.monthlyData) return

    const reports = {
      daily: [],
      weekly: [],
      monthly: [],
    }

    // Relatórios diários
    sim.monthlyData.forEach((month: any, monthIndex: number) => {
      if (month.days) {
        month.days.forEach((day: any, dayIndex: number) => {
          const dailyReport = {
            id: `M${monthIndex + 1}D${dayIndex + 1}`,
            month: monthIndex + 1,
            day: dayIndex + 1,
            date: format(new Date(day.timestamp || Date.now()), "dd/MM/yyyy"),
            timestamp: day.timestamp || new Date().toISOString(),
            initialAmount: day.initialAmount,
            finalAmount: day.finalAmount,
            operations: day.operations || [],
            totalTransacted: day.totalTransacted || 0,
            dailyFee: day.dailyFee || 0,
            totalProfit: (day.finalAmount || 0) - (day.initialAmount || 0),
            profitPercentage: ((day.finalAmount - day.initialAmount) / day.initialAmount) * 100,
            operationsCount: (day.operations || []).length,
            calculationDetails: {
              entryFees: (day.operations || []).reduce((sum: number, op: any) => sum + (op.entryFee || 0), 0),
              exitFees: (day.operations || []).reduce((sum: number, op: any) => sum + (op.exitFee || 0), 0),
              totalProfits: (day.operations || []).reduce((sum: number, op: any) => sum + (op.profit || 0), 0),
            },
          }
          reports.daily.push(dailyReport)
        })
      }
    })

    // Relatórios semanais (agrupando 7 dias)
    for (let i = 0; i < reports.daily.length; i += 7) {
      const weekDays = reports.daily.slice(i, i + 7)
      if (weekDays.length > 0) {
        const weekReport = {
          id: `W${Math.floor(i / 7) + 1}`,
          week: Math.floor(i / 7) + 1,
          startDate: weekDays[0].date,
          endDate: weekDays[weekDays.length - 1].date,
          timestamp: new Date().toISOString(),
          initialAmount: weekDays[0].initialAmount,
          finalAmount: weekDays[weekDays.length - 1].finalAmount,
          totalProfit: weekDays.reduce((sum, day) => sum + day.totalProfit, 0),
          totalTransacted: weekDays.reduce((sum, day) => sum + day.totalTransacted, 0),
          totalFees: weekDays.reduce((sum, day) => sum + day.dailyFee, 0),
          operationsCount: weekDays.reduce((sum, day) => sum + day.operationsCount, 0),
          days: weekDays,
          calculationDetails: {
            entryFees: weekDays.reduce((sum, day) => sum + day.calculationDetails.entryFees, 0),
            exitFees: weekDays.reduce((sum, day) => sum + day.calculationDetails.exitFees, 0),
            totalProfits: weekDays.reduce((sum, day) => sum + day.calculationDetails.totalProfits, 0),
          },
        }
        weekReport.profitPercentage =
          ((weekReport.finalAmount - weekReport.initialAmount) / weekReport.initialAmount) * 100
        reports.weekly.push(weekReport)
      }
    }

    // Relatórios mensais
    sim.monthlyData.forEach((month: any, monthIndex: number) => {
      const monthReport = {
        id: `M${monthIndex + 1}`,
        month: monthIndex + 1,
        date: format(new Date(month.timestamp || Date.now()), "MM/yyyy"),
        timestamp: month.timestamp || new Date().toISOString(),
        initialAmount: month.initialAmount,
        finalAmount: month.finalAmount,
        growth: month.growth,
        growthPercentage: month.growthPercentage,
        totalOperations: (month.days || []).reduce((sum: number, day: any) => sum + (day.operations || []).length, 0),
        totalTransacted: (month.days || []).reduce((sum: number, day: any) => sum + (day.totalTransacted || 0), 0),
        totalFees: (month.days || []).reduce((sum: number, day: any) => sum + (day.dailyFee || 0), 0),
        days: month.days || [],
        calculationDetails: {
          entryFees: (month.days || []).reduce(
            (sum: number, day: any) =>
              sum + (day.operations || []).reduce((opSum: number, op: any) => opSum + (op.entryFee || 0), 0),
            0,
          ),
          exitFees: (month.days || []).reduce(
            (sum: number, day: any) =>
              sum + (day.operations || []).reduce((opSum: number, op: any) => opSum + (op.exitFee || 0), 0),
            0,
          ),
          totalProfits: (month.days || []).reduce(
            (sum: number, day: any) =>
              sum + (day.operations || []).reduce((opSum: number, op: any) => opSum + (op.profit || 0), 0),
            0,
          ),
        },
      }
      reports.monthly.push(monthReport)
    })

    setCalculationReports(reports)
  }

  // Gerar dados de operações com base na simulação selecionada
  const generateOperationsData = (sim: any, period: string) => {
    if (!sim || !sim.monthlyData || !sim.monthlyData.length) return

    const operations: any[] = []
    const operationsPerDay = sim.setupParams?.operationsPerDay || 3

    if (period === "monthly") {
      // Operações mensais
      sim.monthlyData.forEach((month: any, monthIndex: number) => {
        operations.push({
          id: `M${monthIndex + 1}`,
          month: monthIndex + 1,
          initialAmount: month.initialAmount,
          finalAmount: month.finalAmount,
          profit: month.growth,
          profitPercentage: month.growthPercentage,
          operations: 30 * operationsPerDay,
          timestamp: new Date(
            Date.now() - (sim.monthlyData.length - monthIndex) * 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        })
      })
    } else if (period === "daily") {
      // Operações diárias do mês atual
      const monthData = sim.monthlyData[currentMonth - 1]
      if (monthData && monthData.days) {
        monthData.days.forEach((day: any, dayIndex: number) => {
          if (day.operations) {
            day.operations.forEach((operation: any, opIndex: number) => {
              operations.push({
                id: `M${currentMonth}D${dayIndex + 1}O${opIndex + 1}`,
                day: dayIndex + 1,
                operation: opIndex + 1,
                initialAmount: operation.initialAmount,
                entryFee: operation.entryFee,
                profit: operation.profit,
                exitFee: operation.exitFee,
                finalAmount: operation.finalAmount,
                timestamp: new Date(
                  Date.now() - (monthData.days.length - dayIndex) * 24 * 60 * 60 * 1000,
                ).toISOString(),
              })
            })
          }
        })
      }
    } else if (period === "all") {
      // Todas as operações
      sim.monthlyData.forEach((month: any, monthIndex: number) => {
        if (month.days) {
          month.days.forEach((day: any, dayIndex: number) => {
            if (day.operations) {
              day.operations.forEach((operation: any, opIndex: number) => {
                operations.push({
                  id: `M${monthIndex + 1}D${dayIndex + 1}O${opIndex + 1}`,
                  month: monthIndex + 1,
                  day: dayIndex + 1,
                  operation: opIndex + 1,
                  initialAmount: operation.initialAmount,
                  entryFee: operation.entryFee,
                  profit: operation.profit,
                  exitFee: operation.exitFee,
                  finalAmount: operation.finalAmount,
                  timestamp: new Date(
                    Date.now() -
                      (sim.monthlyData.length - monthIndex) * 30 * 24 * 60 * 60 * 1000 -
                      (day.length - dayIndex) * 24 * 60 * 60 * 1000,
                  ).toISOString(),
                })
              })
            }
          })
        }
      })
    }

    setOperationsData(operations)
    setVisibleOperations(operations.slice(0, operationsPerPage))
    setShowAllOperations(false)
  }

  // Atualizar dados quando mudar período ou simulação
  useEffect(() => {
    if (selectedSimulation) {
      generateOperationsData(selectedSimulation, reportPeriod)
      generateCalculationReports(selectedSimulation)
    }
  }, [reportPeriod, currentMonth, selectedSimulation])

  // Mostrar mais operações
  const handleShowMoreOperations = () => {
    if (showAllOperations) {
      setVisibleOperations(operationsData.slice(0, operationsPerPage))
      setShowAllOperations(false)
    } else {
      setVisibleOperations(operationsData)
      setShowAllOperations(true)
    }
  }

  // Calcular valores para o período atual
  const periodValues = useMemo(() => {
    if (!selectedSimulation) return null

    let startingValue = selectedSimulation.initialAmount
    let endingValue = selectedSimulation.finalAmount
    let profit = selectedSimulation.profitAmount
    const fees = selectedSimulation.totalFees || 0

    if (reportPeriod === "monthly" && selectedSimulation.monthlyData) {
      const monthData = selectedSimulation.monthlyData[currentMonth - 1]
      if (monthData) {
        startingValue = monthData.initialAmount
        endingValue = monthData.finalAmount
        profit = monthData.growth
      }
    }

    return {
      startingValue,
      endingValue,
      profit,
      profitPercentage: (profit / startingValue) * 100,
      fees,
      totalWithdrawals: endingValue * 0.015, // 1.5% estimado
    }
  }, [selectedSimulation, reportPeriod, currentMonth])

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => Math.max(1, prev - 1))
  }

  const handleNextMonth = () => {
    const maxMonths = selectedSimulation?.setupParams?.projectionMonths || 24
    setCurrentMonth((prev) => Math.min(maxMonths, prev + 1))
  }

  const handleExport = (format: string) => {
    const timestamp = format(new Date(), "dd/MM/yyyy HH:mm:ss")
    alert(`Exportando relatório como ${format} - ${timestamp}`)
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
          <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Clock className="h-4 w-4" />
            <span>Última atualização: {format(new Date(), "dd/MM/yyyy 'às' HH:mm:ss")}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Select
            value={selectedSimulation?.id || ""}
            onValueChange={(value) => {
              const sim = simulations.find((s) => s.id === value)
              setSelectedSimulation(sim)
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecionar simulação" />
            </SelectTrigger>
            <SelectContent>
              {simulations.map((sim) => (
                <SelectItem key={sim.id} value={sim.id}>
                  {format(new Date(sim.date), "dd/MM/yyyy HH:mm")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diário</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="all">Todas as Operações</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => handleExport("pdf")}>
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>

          <Button variant="outline" onClick={() => handleExport("csv")}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Navegação de mês */}
      {reportPeriod !== "all" && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePreviousMonth} disabled={currentMonth === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">
                Mês {currentMonth} de {selectedSimulation?.setupParams?.projectionMonths || 24}
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              disabled={currentMonth === (selectedSimulation?.setupParams?.projectionMonths || 24)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Inicial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedSimulation?.currency || "EUR"} {formatCurrency(periodValues?.startingValue || 0)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <Clock className="h-3 w-3 inline mr-1" />
              {selectedSimulation ? format(new Date(selectedSimulation.date), "dd/MM/yyyy HH:mm") : "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Final</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedSimulation?.currency || "EUR"} {formatCurrency(periodValues?.endingValue || 0)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <Clock className="h-3 w-3 inline mr-1" />
              Atualizado agora
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lucro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              +{selectedSimulation?.currency || "EUR"} {formatCurrency(periodValues?.profit || 0)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              +{(periodValues?.profitPercentage || 0).toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxas Pagas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              -{selectedSimulation?.currency || "EUR"} {formatCurrency(periodValues?.fees || 0)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total acumulado</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabelas e gráficos */}
      <Tabs defaultValue="operations">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="operations">Operações</TabsTrigger>
          <TabsTrigger value="monthly">Resumo Mensal</TabsTrigger>
          <TabsTrigger value="daily-calc">Cálculos Diários</TabsTrigger>
          <TabsTrigger value="weekly-calc">Cálculos Semanais</TabsTrigger>
          <TabsTrigger value="monthly-calc">Cálculos Mensais</TabsTrigger>
          <TabsTrigger value="summary">Resumo Geral</TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operações Detalhadas</CardTitle>
              <CardDescription>
                Detalhamento de cada operação - {operationsData.length} operações encontradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-auto max-h-[500px]">
                <div className="grid grid-cols-8 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div>ID</div>
                  <div>Data/Hora</div>
                  <div>Valor Inicial</div>
                  <div>Taxa Entrada</div>
                  <div>Lucro</div>
                  <div>Taxa Saída</div>
                  <div>Valor Final</div>
                  <div>Status</div>
                </div>
                {visibleOperations.length > 0 ? (
                  <>
                    {visibleOperations.map((op, index) => (
                      <div key={index} className="grid grid-cols-8 border-b p-3 text-sm">
                        <div className="font-mono">{op.id}</div>
                        <div className="text-xs">
                          {op.timestamp ? format(new Date(op.timestamp), "dd/MM HH:mm") : "N/A"}
                        </div>
                        <div>
                          {selectedSimulation?.currency || "EUR"} {formatCurrency(op.initialAmount || 0)}
                        </div>
                        <div className="text-red-500">
                          -{selectedSimulation?.currency || "EUR"} {formatCurrency(op.entryFee || 0)}
                        </div>
                        <div className="text-green-500">
                          +{selectedSimulation?.currency || "EUR"} {formatCurrency(op.profit || 0)}
                        </div>
                        <div className="text-red-500">
                          -{selectedSimulation?.currency || "EUR"} {formatCurrency(op.exitFee || 0)}
                        </div>
                        <div className="font-medium">
                          {selectedSimulation?.currency || "EUR"} {formatCurrency(op.finalAmount || 0)}
                        </div>
                        <div className="text-green-600 text-xs">Concluída</div>
                      </div>
                    ))}
                    {operationsData.length > operationsPerPage && (
                      <div className="p-3 text-center">
                        <Button variant="outline" onClick={handleShowMoreOperations}>
                          {showAllOperations
                            ? "Mostrar Menos"
                            : `Carregar Mais (${operationsData.length - operationsPerPage} restantes)`}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    Nenhuma operação encontrada para o período selecionado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumo Mensal</CardTitle>
              <CardDescription>Performance mensal da simulação selecionada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-auto max-h-[500px]">
                <div className="grid grid-cols-7 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div>Mês</div>
                  <div>Data</div>
                  <div>Valor Inicial</div>
                  <div>Valor Final</div>
                  <div>Lucro</div>
                  <div>% Lucro</div>
                  <div>Operações</div>
                </div>
                {selectedSimulation?.monthlyData?.map((month: any, index: number) => (
                  <div key={index} className="grid grid-cols-7 border-b p-3 text-sm">
                    <div className="font-medium">{index + 1}</div>
                    <div className="text-xs">
                      {format(
                        new Date(
                          Date.now() - (selectedSimulation.monthlyData.length - index) * 30 * 24 * 60 * 60 * 1000,
                        ),
                        "MM/yyyy",
                      )}
                    </div>
                    <div>
                      {selectedSimulation.currency} {formatCurrency(month.initialAmount)}
                    </div>
                    <div>
                      {selectedSimulation.currency} {formatCurrency(month.finalAmount)}
                    </div>
                    <div className="text-green-500">
                      +{selectedSimulation.currency} {formatCurrency(month.growth)}
                    </div>
                    <div className="text-green-500">+{(month.growthPercentage || 0).toFixed(2)}%</div>
                    <div>{(selectedSimulation.setupParams?.operationsPerDay || 3) * 30}</div>
                  </div>
                )) || <div className="p-4 text-center text-muted-foreground">Nenhum dado mensal encontrado</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily-calc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Relatórios de Cálculos Diários
              </CardTitle>
              <CardDescription>
                Análise detalhada dos cálculos por dia - {calculationReports.daily.length} dias processados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-auto max-h-[500px]">
                <div className="grid grid-cols-10 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div>Dia</div>
                  <div>Data</div>
                  <div>Valor Inicial</div>
                  <div>Valor Final</div>
                  <div>Lucro</div>
                  <div>% Lucro</div>
                  <div>Operações</div>
                  <div>Taxa Entrada</div>
                  <div>Taxa Saída</div>
                  <div>Timestamp</div>
                </div>
                {calculationReports.daily.map((day: any, index: number) => (
                  <div key={index} className="grid grid-cols-10 border-b p-3 text-sm">
                    <div className="font-medium">{day.id}</div>
                    <div>{day.date}</div>
                    <div>
                      {selectedSimulation?.currency} {formatCurrency(day.initialAmount)}
                    </div>
                    <div>
                      {selectedSimulation?.currency} {formatCurrency(day.finalAmount)}
                    </div>
                    <div className="text-green-500">
                      +{selectedSimulation?.currency} {formatCurrency(day.totalProfit)}
                    </div>
                    <div className="text-green-500">+{day.profitPercentage.toFixed(2)}%</div>
                    <div>{day.operationsCount}</div>
                    <div className="text-red-500">
                      -{selectedSimulation?.currency} {formatCurrency(day.calculationDetails.entryFees)}
                    </div>
                    <div className="text-red-500">
                      -{selectedSimulation?.currency} {formatCurrency(day.calculationDetails.exitFees)}
                    </div>
                    <div className="text-xs text-muted-foreground">{format(new Date(day.timestamp), "HH:mm:ss")}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly-calc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Relatórios de Cálculos Semanais
              </CardTitle>
              <CardDescription>
                Análise consolidada dos cálculos por semana - {calculationReports.weekly.length} semanas processadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-auto max-h-[500px]">
                <div className="grid grid-cols-10 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div>Semana</div>
                  <div>Período</div>
                  <div>Valor Inicial</div>
                  <div>Valor Final</div>
                  <div>Lucro</div>
                  <div>% Lucro</div>
                  <div>Operações</div>
                  <div>Taxa Entrada</div>
                  <div>Taxa Saída</div>
                  <div>Timestamp</div>
                </div>
                {calculationReports.weekly.map((week: any, index: number) => (
                  <div key={index} className="grid grid-cols-10 border-b p-3 text-sm">
                    <div className="font-medium">{week.id}</div>
                    <div className="text-xs">
                      {week.startDate} - {week.endDate}
                    </div>
                    <div>
                      {selectedSimulation?.currency} {formatCurrency(week.initialAmount)}
                    </div>
                    <div>
                      {selectedSimulation?.currency} {formatCurrency(week.finalAmount)}
                    </div>
                    <div className="text-green-500">
                      +{selectedSimulation?.currency} {formatCurrency(week.totalProfit)}
                    </div>
                    <div className="text-green-500">+{week.profitPercentage.toFixed(2)}%</div>
                    <div>{week.operationsCount}</div>
                    <div className="text-red-500">
                      -{selectedSimulation?.currency} {formatCurrency(week.calculationDetails.entryFees)}
                    </div>
                    <div className="text-red-500">
                      -{selectedSimulation?.currency} {formatCurrency(week.calculationDetails.exitFees)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(week.timestamp), "dd/MM HH:mm")}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly-calc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Relatórios de Cálculos Mensais
              </CardTitle>
              <CardDescription>
                Análise consolidada dos cálculos por mês - {calculationReports.monthly.length} meses processados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-auto max-h-[500px]">
                <div className="grid grid-cols-9 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div>Mês</div>
                  <div>Data</div>
                  <div>Valor Inicial</div>
                  <div>Valor Final</div>
                  <div>Crescimento</div>
                  <div>% Crescimento</div>
                  <div>Operações</div>
                  <div>Taxas Totais</div>
                  <div>Timestamp</div>
                </div>
                {calculationReports.monthly.map((month: any, index: number) => (
                  <div key={index} className="grid grid-cols-9 border-b p-3 text-sm">
                    <div className="font-medium">{month.id}</div>
                    <div>{month.date}</div>
                    <div>
                      {selectedSimulation?.currency} {formatCurrency(month.initialAmount)}
                    </div>
                    <div>
                      {selectedSimulation?.currency} {formatCurrency(month.finalAmount)}
                    </div>
                    <div className="text-green-500">
                      +{selectedSimulation?.currency} {formatCurrency(month.growth)}
                    </div>
                    <div className="text-green-500">+{month.growthPercentage.toFixed(2)}%</div>
                    <div>{month.totalOperations}</div>
                    <div className="text-red-500">
                      -{selectedSimulation?.currency}{" "}
                      {formatCurrency(month.calculationDetails.entryFees + month.calculationDetails.exitFees)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(month.timestamp), "dd/MM HH:mm")}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumo Geral</CardTitle>
              <CardDescription>
                Métricas consolidadas da simulação - Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm:ss")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Total de Operações</h4>
                    <p className="text-2xl font-semibold">{operationsData.length}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Período da Simulação</h4>
                    <p className="text-lg font-semibold">
                      {selectedSimulation?.setupParams?.projectionMonths || 0} meses
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Operações por Dia</h4>
                    <p className="text-lg font-semibold">{selectedSimulation?.setupParams?.operationsPerDay || 0}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">ROI Total</h4>
                    <p className="text-2xl font-semibold text-green-500">
                      +{(selectedSimulation?.profitPercentage || 0).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Data da Simulação</h4>
                    <p className="text-lg font-semibold">
                      {selectedSimulation ? format(new Date(selectedSimulation.date), "dd/MM/yyyy HH:mm") : "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Moeda</h4>
                    <p className="text-lg font-semibold">{selectedSimulation?.currency || "EUR"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
