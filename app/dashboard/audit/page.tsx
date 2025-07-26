"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertCircle, Clock, Calculator } from "lucide-react"
import { getAllSimulations } from "@/lib/simulation-service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

export default function AuditPage() {
  const [simulations, setSimulations] = useState<any[]>([])
  const [selectedSimulation, setSelectedSimulation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [detailedOperations, setDetailedOperations] = useState<any[]>([])
  const [calculationReports, setCalculationReports] = useState<any>({
    daily: [],
    weekly: [],
    monthly: [],
  })

  // Função para formatar valores monetários com ponto para milhares e vírgula para centavos
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  // Função para formatar percentuais
  const formatPercent = (value: number) => {
    return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%"
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
        setSelectedSimulation(allSims[0])
        generateDetailedOperations(allSims[0])
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
    if (!sim || !sim.monthlyData) {
      setCalculationReports({
        daily: [],
        weekly: [],
        monthly: []
      });
      return;
    }

    const reports = {
      daily: [] as any[],
      weekly: [] as any[],
      monthly: [] as any[]
    };

    // Relatórios diários
    let allDays: any[] = [];
    sim.monthlyData.forEach((month: any, monthIndex: number) => {
      if (month.days) {
        month.days.forEach((day: any, dayIndex: number) => {
          if (!day.operations) return;
          
          const dailyReport = {
            id: `M${monthIndex + 1}D${dayIndex + 1}`,
            month: monthIndex + 1,
            day: dayIndex + 1,
            date: format(new Date(day.timestamp || Date.now()), "dd/MM/yyyy"),
            timestamp: day.timestamp || new Date().toISOString(),
            initialAmount: day.initialAmount || 0,
            finalAmount: day.finalAmount || 0,
            operations: day.operations || [],
            totalTransacted: day.totalTransacted || 0,
            dailyFee: day.dailyFee || 0,
            totalProfit: (day.finalAmount || 0) - (day.initialAmount || 0),
            profitPercentage: day.initialAmount ? ((day.finalAmount - day.initialAmount) / day.initialAmount) * 100 : 0,
            operationsCount: (day.operations || []).length
          };
          reports.daily.push(dailyReport);
          allDays.push(dailyReport);
        });
      }
    });

    // Relatórios semanais (agrupando por semana)
    let currentWeek: any[] = [];
    let weekNumber = 1;
    
    allDays.forEach((day, index) => {
      currentWeek.push(day);
      
      // Se acumulou 7 dias ou é o último dia, fecha a semana
      if (currentWeek.length === 7 || index === allDays.length - 1) {
        if (currentWeek.length > 0) {
          const weekReport = {
            id: `W${weekNumber}`,
            week: weekNumber,
            startDate: currentWeek[0].date,
            endDate: currentWeek[currentWeek.length - 1].date,
            timestamp: new Date().toISOString(),
            initialAmount: currentWeek[0].initialAmount,
            finalAmount: currentWeek[currentWeek.length - 1].finalAmount,
            totalProfit: currentWeek.reduce((sum, day) => sum + day.totalProfit, 0),
            totalTransacted: currentWeek.reduce((sum, day) => sum + day.totalTransacted, 0),
            totalFees: currentWeek.reduce((sum, day) => sum + day.dailyFee, 0),
            operationsCount: currentWeek.reduce((sum, day) => sum + day.operationsCount, 0),
            profitPercentage: currentWeek[0].initialAmount ? 
              ((currentWeek[currentWeek.length - 1].finalAmount - currentWeek[0].initialAmount) / currentWeek[0].initialAmount) * 100 : 0,
            days: currentWeek
          };
          reports.weekly.push(weekReport);
          weekNumber++;
          currentWeek = [];
        }
      }
    });

    // Relatórios mensais
    sim.monthlyData.forEach((month: any, monthIndex: number) => {
      if (!month.days) return;
      
      const monthReport = {
        id: `M${monthIndex + 1}`,
        month: monthIndex + 1,
        date: format(new Date(month.timestamp || Date.now()), "MM/yyyy"),
        timestamp: month.timestamp || new Date().toISOString(),
        initialAmount: month.initialAmount || 0,
        finalAmount: month.finalAmount || 0,
        growth: month.growth || 0,
        growthPercentage: month.growthPercentage || 0,
        totalOperations: month.days.reduce((sum: number, day: any) => sum + (day.operations?.length || 0), 0),
        totalTransacted: month.days.reduce((sum: number, day: any) => sum + (day.totalTransacted || 0), 0),
        totalFees: month.days.reduce((sum: number, day: any) => sum + (day.dailyFee || 0), 0),
        days: month.days || []
      };
      reports.monthly.push(monthReport);
    });

    setCalculationReports(reports);
  };

  // Gerar dados detalhados das operações para auditoria
  const generateDetailedOperations = (sim: any) => {
    if (!sim || !sim.setupParams) return

    const operations: any[] = []
    const initialInvestment = sim.setupParams.initialInvestment || 600
    const entryFeePercent = sim.setupParams.entryFee || 0.1
    const exitFeePercent = sim.setupParams.exitFee || 0.1
    const profitRatePercent = sim.setupParams.profitRate || 0.7
    const operationsPerDay = sim.setupParams.operationsPerDay || 4

    // Converter percentuais para decimais
    const entryFeeRate = entryFeePercent / 100
    const exitFeeRate = exitFeePercent / 100
    const profitRate = profitRatePercent / 100

    let currentAmount = initialInvestment
    let operationId = 1

    // Gerar os primeiros 10 dias de operações (ou menos se configurado para menos)
    for (let day = 1; day <= 3; day++) {
      for (let op = 1; op <= operationsPerDay; op++) {
        // Cálculo da taxa de entrada
        const entryFee = currentAmount * entryFeeRate

        // Valor após taxa de entrada
        const amountAfterEntryFee = currentAmount - entryFee

        // Cálculo do lucro
        const profit = amountAfterEntryFee * profitRate

        // Valor após lucro
        const amountAfterProfit = amountAfterEntryFee + profit

        // Cálculo da taxa de saída
        const exitFee = amountAfterProfit * exitFeeRate

        // Valor final após taxa de saída
        const finalAmount = amountAfterProfit - exitFee

        // Cálculo da retirada (0.2% do valor final)
        const withdrawal = finalAmount * 0.002

        // Valor final após retirada
        const finalAmountAfterWithdrawal = finalAmount - withdrawal

        // Adicionar à lista de operações
        operations.push({
          id: String(operationId).padStart(3, "0"),
          day,
          operation: op,
          timestamp: new Date(Date.now() - (30 - day) * 24 * 60 * 60 * 1000 - (4 - op) * 60 * 60 * 1000).toISOString(),
          initialAmount: currentAmount,
          entryFee,
          amountAfterEntryFee,
          profit,
          amountAfterProfit,
          exitFee,
          finalAmount,
          withdrawal,
          finalAmountAfterWithdrawal,
        })

        // Atualizar para a próxima operação
        currentAmount = finalAmountAfterWithdrawal
        operationId++

        // Limitar a 10 operações para a visualização detalhada
        if (operations.length >= 10) break
      }

      // Limitar a 10 operações para a visualização detalhada
      if (operations.length >= 10) break
    }

    setDetailedOperations(operations)
  }

  // Atualizar quando a simulação selecionada mudar
  useEffect(() => {
    if (selectedSimulation) {
      generateDetailedOperations(selectedSimulation)
      generateCalculationReports(selectedSimulation)
    }
  }, [selectedSimulation])

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
    <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/20">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard/reports">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Relatórios
              </Button>
            </Link>
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Auditoria de Cálculos</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Clock className="h-4 w-4" />
              <span>Última atualização: {format(new Date(), "dd/MM/yyyy 'às' HH:mm:ss")}</span>
            </div>
          </div>
        </div>

        {/* Seleção de simulação */}
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Simulação para Auditoria</CardTitle>
            <CardDescription>Escolha a simulação que deseja auditar</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedSimulation?.id || ""}
              onValueChange={(value) => {
                const sim = simulations.find((s) => s.id === value)
                setSelectedSimulation(sim)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecionar simulação" />
              </SelectTrigger>
              <SelectContent>
                {simulations.map((sim) => (
                  <SelectItem key={sim.id} value={sim.id}>
                    {format(new Date(sim.date), "dd/MM/yyyy HH:mm")} - {sim.setupParams?.name || "Sem nome"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Tabs defaultValue="parameters">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="parameters">Parâmetros</TabsTrigger>
            <TabsTrigger value="detailed">Cálculos Detalhados</TabsTrigger>
            <TabsTrigger value="daily">Relatórios Diários</TabsTrigger>
            <TabsTrigger value="weekly">Relatórios Semanais</TabsTrigger>
            <TabsTrigger value="monthly">Relatórios Mensais</TabsTrigger>
          </TabsList>

          <TabsContent value="parameters" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Parâmetros da Simulação</CardTitle>
                <CardDescription>
                  Configurações utilizadas para os cálculos - Criada em{" "}
                  {selectedSimulation ? format(new Date(selectedSimulation.date), "dd/MM/yyyy 'às' HH:mm:ss") : "N/A"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Parâmetros Básicos</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Nome da Configuração:</div>
                        <div className="font-medium">{selectedSimulation?.setupParams?.name || "Sem nome"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Investimento Inicial:</div>
                        <div className="font-medium">
                          {selectedSimulation?.currency}{" "}
                          {formatCurrency(selectedSimulation?.setupParams?.initialInvestment || 0)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Operações por Dia:</div>
                        <div className="font-medium">{selectedSimulation?.setupParams?.operationsPerDay || 0}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Período de Projeção:</div>
                        <div className="font-medium">
                          {selectedSimulation?.setupParams?.projectionMonths || 0} meses
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Taxas e Percentuais</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Taxa de Entrada:</div>
                        <div className="font-medium">
                          {formatPercent(selectedSimulation?.setupParams?.entryFee || 0)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Taxa de Saída:</div>
                        <div className="font-medium">
                          {formatPercent(selectedSimulation?.setupParams?.exitFee || 0)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Taxa de Lucro:</div>
                        <div className="font-medium">
                          {formatPercent(selectedSimulation?.setupParams?.profitRate || 0)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Taxa de Retirada:</div>
                        <div className="font-medium">0,20%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo dos Resultados</CardTitle>
                <CardDescription>Valores finais da simulação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-muted/40 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Investimento Inicial</div>
                    <div className="text-2xl font-bold">
                      {selectedSimulation?.currency} {formatCurrency(selectedSimulation?.initialAmount || 0)}
                    </div>
                  </div>
                  <div className="bg-muted/40 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Valor Final</div>
                    <div className="text-2xl font-bold">
                      {selectedSimulation?.currency} {formatCurrency(selectedSimulation?.finalAmount || 0)}
                    </div>
                  </div>
                  <div className="bg-muted/40 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Lucro Total</div>
                    <div className="text-2xl font-bold text-green-500">
                      +{selectedSimulation?.currency} {formatCurrency(selectedSimulation?.profitAmount || 0)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cálculos Detalhados</CardTitle>
                <CardDescription>Primeiras 10 operações com todos os passos de cálculo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {detailedOperations.map((op, index) => (
                    <Accordion key={index} type="single" collapsible className="border rounded-md">
                      <AccordionItem value={`operation-${op.id}`}>
                        <AccordionTrigger className="px-4">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <Calculator className="mr-2 h-4 w-4" />
                              <span className="font-medium">Operação {op.id}</span>
                              <span className="ml-4 text-sm text-muted-foreground">
                                Dia {op.day}, Operação {op.operation}
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="mr-4">
                                Inicial: {selectedSimulation?.currency} {formatCurrency(op.initialAmount)}
                              </span>
                              <span className="text-green-500">
                                Final: {selectedSimulation?.currency} {formatCurrency(op.finalAmount)}
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                            <div className="text-xs text-muted-foreground mb-4">
                              <Clock className="h-3 w-3 inline mr-1" />
                              Processado em: {format(new Date(op.timestamp), "dd/MM/yyyy 'às' HH:mm:ss")}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium">Passo 1: Valor Inicial</h4>
                                <div className="bg-muted/30 p-3 rounded-md">
                                  <div className="flex justify-between">
                                    <span>Valor inicial da operação:</span>
                                    <span className="font-medium">
                                      {selectedSimulation?.currency} {formatCurrency(op.initialAmount)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-medium">Passo 2: Taxa de Entrada</h4>
                                <div className="bg-muted/30 p-3 rounded-md">
                                  <div className="flex justify-between">
                                    <span>
                                      Taxa de entrada ({formatPercent(selectedSimulation?.setupParams?.entryFee || 0)}):
                                    </span>
                                    <span className="font-medium text-red-500">
                                      -{selectedSimulation?.currency} {formatCurrency(op.entryFee)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between mt-2">
                                    <span>Valor após taxa de entrada:</span>
                                    <span className="font-medium">
                                      {selectedSimulation?.currency} {formatCurrency(op.amountAfterEntryFee)}
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-2">
                                    Cálculo: {formatCurrency(op.initialAmount)} ×{" "}
                                    {formatPercent(selectedSimulation?.setupParams?.entryFee || 0)} ÷ 100 ={" "}
                                    {formatCurrency(op.entryFee)}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-medium">Passo 3: Lucro</h4>
                                <div className="bg-muted/30 p-3 rounded-md">
                                  <div className="flex justify-between">
                                    <span>
                                      Lucro ({formatPercent(selectedSimulation?.setupParams?.profitRate || 0)}):
                                    </span>
                                    <span className="font-medium text-green-500">
                                      +{selectedSimulation?.currency} {formatCurrency(op.profit)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between mt-2">
                                    <span>Valor após lucro:</span>
                                    <span className="font-medium">
                                      {selectedSimulation?.currency} {formatCurrency(op.amountAfterProfit)}
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-2">
                                    Cálculo: {formatCurrency(op.amountAfterEntryFee)} ×{" "}
                                    {formatPercent(selectedSimulation?.setupParams?.profitRate || 0)} ÷ 100 ={" "}
                                    {formatCurrency(op.profit)}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-medium">Passo 4: Taxa de Saída</h4>
                                <div className="bg-muted/30 p-3 rounded-md">
                                  <div className="flex justify-between">
                                    <span>
                                      Taxa de saída ({formatPercent(selectedSimulation?.setupParams?.exitFee || 0)}):
                                    </span>
                                    <span className="font-medium text-red-500">
                                      -{selectedSimulation?.currency} {formatCurrency(op.exitFee)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between mt-2">
                                    <span>Valor após taxa de saída:</span>
                                    <span className="font-medium">
                                      {selectedSimulation?.currency} {formatCurrency(op.finalAmount)}
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-2">
                                    Cálculo: {formatCurrency(op.amountAfterProfit)} ×{" "}
                                    {formatPercent(selectedSimulation?.setupParams?.exitFee || 0)} ÷ 100 ={" "}
                                    {formatCurrency(op.exitFee)}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-medium">Passo 5: Retirada</h4>
                                <div className="bg-muted/30 p-3 rounded-md">
                                  <div className="flex justify-between">
                                    <span>Retirada (0,2%):</span>
                                    <span className="font-medium text-amber-600">
                                      -{selectedSimulation?.currency} {formatCurrency(op.withdrawal)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between mt-2">
                                    <span>Valor final após retirada:</span>
                                    <span className="font-medium">
                                      {selectedSimulation?.currency} {formatCurrency(op.finalAmountAfterWithdrawal)}
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-2">
                                    Cálculo: {formatCurrency(op.finalAmount)} × 0,2% ÷ 100 ={" "}
                                    {formatCurrency(op.withdrawal)}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-medium">Resumo da Operação</h4>
                                <div className="bg-muted/30 p-3 rounded-md">
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span>Valor inicial:</span>
                                      <span className="font-medium">
                                        {selectedSimulation?.currency} {formatCurrency(op.initialAmount)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Taxa de entrada:</span>
                                      <span className="font-medium text-red-500">
                                        -{selectedSimulation?.currency} {formatCurrency(op.entryFee)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Lucro:</span>
                                      <span className="font-medium text-green-500">
                                        +{selectedSimulation?.currency} {formatCurrency(op.profit)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Taxa de saída:</span>
                                      <span className="font-medium text-red-500">
                                        -{selectedSimulation?.currency} {formatCurrency(op.exitFee)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Retirada:</span>
                                      <span className="font-medium text-amber-600">
                                        -{selectedSimulation?.currency} {formatCurrency(op.withdrawal)}
                                      </span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between">
                                      <span>Valor final para próxima operação:</span>
                                      <span className="font-medium">
                                        {selectedSimulation?.currency} {formatCurrency(op.finalAmountAfterWithdrawal)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="daily" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios de Cálculos Diários</CardTitle>
                <CardDescription>
                  Análise detalhada dos cálculos por dia - {calculationReports.daily.length} dias processados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-auto max-h-[500px]">
                  <div className="grid grid-cols-9 border-b bg-muted/50 p-3 text-sm font-medium">
                    <div>Dia</div>
                    <div>Data</div>
                    <div>Valor Inicial</div>
                    <div>Valor Final</div>
                    <div>Lucro</div>
                    <div>% Lucro</div>
                    <div>Operações</div>
                    <div>Taxa Diária</div>
                    <div>Timestamp</div>
                  </div>
                  {calculationReports.daily.map((day: any, index: number) => (
                    <div key={index} className="grid grid-cols-9 border-b p-3 text-sm">
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
                        -{selectedSimulation?.currency} {formatCurrency(day.dailyFee)}
                      </div>
                      <div className="text-xs text-muted-foreground">{format(new Date(day.timestamp), "HH:mm:ss")}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios de Cálculos Semanais</CardTitle>
                <CardDescription>
                  Análise consolidada dos cálculos por semana - {calculationReports.weekly.length} semanas processadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-auto max-h-[500px]">
                  <div className="grid grid-cols-9 border-b bg-muted/50 p-3 text-sm font-medium">
                    <div>Semana</div>
                    <div>Período</div>
                    <div>Valor Inicial</div>
                    <div>Valor Final</div>
                    <div>Lucro</div>
                    <div>% Lucro</div>
                    <div>Operações</div>
                    <div>Taxas Totais</div>
                    <div>Timestamp</div>
                  </div>
                  {calculationReports.weekly.map((week: any, index: number) => (
                    <div key={index} className="grid grid-cols-9 border-b p-3 text-sm">
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
                        -{selectedSimulation?.currency} {formatCurrency(week.totalFees)}
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

          <TabsContent value="monthly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios de Cálculos Mensais</CardTitle>
                <CardDescription>
                  Análise consolidada dos cálculos por mês - {calculationReports.monthly.length} meses processados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-auto max-h-[500px]">
                  <div className="grid grid-cols-8 border-b bg-muted/50 p-3 text-sm font-medium">
                    <div>Mês</div>
                    <div>Data</div>
                    <div>Valor Inicial</div>
                    <div>Valor Final</div>
                    <div>Crescimento</div>
                    <div>% Crescimento</div>
                    <div>Operações</div>
                    <div>Timestamp</div>
                  </div>
                  {calculationReports.monthly.map((month: any, index: number) => (
                    <div key={index} className="grid grid-cols-8 border-b p-3 text-sm">
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
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(month.timestamp), "dd/MM HH:mm")}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
