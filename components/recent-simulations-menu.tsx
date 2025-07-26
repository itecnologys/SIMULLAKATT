"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, TrendingUp, Download, BarChart, Calendar, Plus, Minus, RefreshCw } from "lucide-react"
import { getAllSimulations } from "@/lib/simulation-service"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SimulationItem {
  id: string
  date: string
  initialAmount: number
  finalAmount: number
  profitAmount: number
  profitPercentage: number
  operationsCount: number
  totalFees: number
  currency: string
  transactions?: Transaction[]
  monthlyData?: any[]
}

interface Transaction {
  id: string
  date: string
  type: "deposit" | "withdrawal"
  amount: number
  balanceBefore: number
  balanceAfter: number
  operationId?: string
}

export default function RecentSimulationsMenu() {
  const router = useRouter()
  const { toast } = useToast()
  const [simulations, setSimulations] = useState<SimulationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSimulation, setSelectedSimulation] = useState<SimulationItem | null>(null)
  const [transactionAmount, setTransactionAmount] = useState<number>(0)
  const [transactionType, setTransactionType] = useState<"deposit" | "withdrawal">("deposit")
  const [isProcessing, setIsProcessing] = useState(false)
  const [operationId, setOperationId] = useState<string>("001")
  const [availableOperationIds, setAvailableOperationIds] = useState<string[]>([])

  // Função para formatar valores monetários com ponto para milhares e vírgula para centavos
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const fetchSimulations = async () => {
    try {
      setIsLoading(true)
      const data = await getAllSimulations()
      setSimulations(data)
    } catch (error) {
      console.error("Falha ao buscar simulações:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as simulações.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSimulations()
  }, [])

  // Gerar IDs de operações disponíveis quando uma simulação é selecionada
  useEffect(() => {
    if (selectedSimulation && selectedSimulation.monthlyData) {
      const ids: string[] = []
      let idCounter = 1

      // Gerar IDs para cada dia em cada mês
      selectedSimulation.monthlyData.forEach((month, monthIndex) => {
        if (month.days) {
          month.days.forEach((day: any, dayIndex: number) => {
            const formattedId = String(idCounter).padStart(3, "0")
            ids.push(formattedId)
            idCounter++
          })
        }
      })

      setAvailableOperationIds(ids)
      if (ids.length > 0) {
        setOperationId(ids[0])
      }
    }
  }, [selectedSimulation])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleViewSimulation = (id: string) => {
    router.push(`/dashboard/reports?simulation=${id}`)
  }

  const handleTransaction = async () => {
    if (!selectedSimulation || transactionAmount <= 0 || !operationId) return

    setIsProcessing(true)

    try {
      const response = await fetch("/api/simulations/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          simulationId: selectedSimulation.id,
          type: transactionType,
          amount: transactionAmount,
          operationId: operationId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: transactionType === "deposit" ? "Aporte realizado" : "Retirada realizada",
          description: `${transactionType === "deposit" ? "Aporte" : "Retirada"} de ${selectedSimulation.currency} ${formatCurrency(transactionAmount)} processado com sucesso na operação ${operationId}.`,
        })

        // Atualizar a lista de simulações
        await fetchSimulations()

        // Fechar o diálogo
        setSelectedSimulation(null)
        setTransactionAmount(0)
      } else {
        toast({
          title: "Erro",
          description: data.error || "Falha ao processar a transação.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao processar transação:", error)
      toast({
        title: "Erro",
        description: "Falha ao processar a transação. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Simulações Recentes</CardTitle>
            <CardDescription>Histórico das últimas simulações realizadas</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={fetchSimulations} title="Atualizar">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <History className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : simulations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma simulação encontrada</p>
          </div>
        ) : (
          <ScrollArea className="h-[350px] pr-4">
            <div className="space-y-4">
              {simulations.map((simulation) => (
                <div key={simulation.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{formatDate(simulation.date)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <BarChart className="h-4 w-4" />
                      <span>{simulation.operationsCount} operações</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Investimento Inicial</p>
                      <p className="font-medium">
                        {simulation.currency} {formatCurrency(simulation.initialAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Valor Final</p>
                      <p className="font-medium">
                        {simulation.currency} {formatCurrency(simulation.finalAmount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp
                      className={`h-4 w-4 ${simulation.profitPercentage >= 0 ? "text-green-500" : "text-red-500"}`}
                    />
                    <span
                      className={`text-sm font-medium ${simulation.profitPercentage >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {simulation.profitPercentage >= 0 ? "+" : ""}
                      {simulation.profitPercentage.toFixed(2)}%
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({simulation.currency} {formatCurrency(Math.abs(simulation.profitAmount))})
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleViewSimulation(simulation.id)}
                    >
                      Ver detalhes
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setSelectedSimulation(simulation)}
                        >
                          Transações
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Gerenciar Simulação</DialogTitle>
                          <DialogDescription>Adicione aportes ou faça retiradas nesta simulação.</DialogDescription>
                        </DialogHeader>

                        <Tabs defaultValue="transaction">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="transaction">Nova Transação</TabsTrigger>
                            <TabsTrigger value="history">Histórico</TabsTrigger>
                          </TabsList>

                          <TabsContent value="transaction" className="space-y-4 py-4">
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="transaction-type">Tipo de Transação</Label>
                                  <div className="flex mt-2">
                                    <Button
                                      type="button"
                                      variant={transactionType === "deposit" ? "default" : "outline"}
                                      className="rounded-r-none flex-1"
                                      onClick={() => setTransactionType("deposit")}
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Aporte
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={transactionType === "withdrawal" ? "default" : "outline"}
                                      className="rounded-l-none flex-1"
                                      onClick={() => setTransactionType("withdrawal")}
                                    >
                                      <Minus className="h-4 w-4 mr-2" />
                                      Retirada
                                    </Button>
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="transaction-amount">Valor</Label>
                                  <div className="flex items-center mt-2">
                                    <span className="bg-muted px-3 py-2 rounded-l-md border border-r-0">
                                      {selectedSimulation?.currency}
                                    </span>
                                    <Input
                                      id="transaction-amount"
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={transactionAmount}
                                      onChange={(e) => setTransactionAmount(Number(e.target.value))}
                                      className="rounded-l-none"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div>
                                <Label htmlFor="operation-id">ID da Operação</Label>
                                <Select value={operationId} onValueChange={setOperationId}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o ID da operação" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableOperationIds.map((id) => (
                                      <SelectItem key={id} value={id}>
                                        Operação {id}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Selecione o ID da operação onde a transação será aplicada. Os cálculos serão
                                  recalculados a partir deste ponto.
                                </p>
                              </div>

                              <div className="bg-muted p-4 rounded-md">
                                <h4 className="font-medium mb-2">Resumo da Transação</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>Saldo Atual:</div>
                                  <div className="text-right font-medium">
                                    {selectedSimulation?.currency}{" "}
                                    {selectedSimulation ? formatCurrency(selectedSimulation.finalAmount) : "0,00"}
                                  </div>

                                  <div>{transactionType === "deposit" ? "Aporte:" : "Retirada:"}</div>
                                  <div className="text-right font-medium">
                                    {transactionType === "deposit" ? "+" : "-"}
                                    {selectedSimulation?.currency} {formatCurrency(transactionAmount)}
                                  </div>

                                  <div>ID da Operação:</div>
                                  <div className="text-right font-medium">{operationId}</div>

                                  <div className="border-t pt-1 font-medium">Novo Saldo:</div>
                                  <div className="border-t pt-1 text-right font-medium">
                                    {selectedSimulation?.currency}{" "}
                                    {formatCurrency(
                                      (selectedSimulation?.finalAmount || 0) +
                                        (transactionType === "deposit"
                                          ? transactionAmount
                                          : -Math.min(transactionAmount, selectedSimulation?.finalAmount || 0)),
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="history">
                            <div className="py-4">
                              <h4 className="font-medium mb-2">Histórico de Transações</h4>
                              {selectedSimulation?.transactions && selectedSimulation.transactions.length > 0 ? (
                                <ScrollArea className="h-[200px]">
                                  <div className="space-y-2">
                                    {selectedSimulation.transactions.map((transaction) => (
                                      <div key={transaction.id} className="border rounded-md p-3">
                                        <div className="flex justify-between items-center">
                                          <div className="flex items-center gap-2">
                                            {transaction.type === "deposit" ? (
                                              <Plus className="h-4 w-4 text-green-500" />
                                            ) : (
                                              <Minus className="h-4 w-4 text-red-500" />
                                            )}
                                            <span className="font-medium">
                                              {transaction.type === "deposit" ? "Aporte" : "Retirada"}
                                            </span>
                                          </div>
                                          <span className="text-sm text-muted-foreground">
                                            {formatDate(transaction.date)}
                                          </span>
                                        </div>
                                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                          <div>Valor:</div>
                                          <div
                                            className={`text-right ${transaction.type === "deposit" ? "text-green-500" : "text-red-500"}`}
                                          >
                                            {transaction.type === "deposit" ? "+" : "-"}
                                            {selectedSimulation.currency} {formatCurrency(transaction.amount)}
                                          </div>

                                          <div>ID da Operação:</div>
                                          <div className="text-right">{transaction.operationId || "N/A"}</div>

                                          <div>Saldo Anterior:</div>
                                          <div className="text-right">
                                            {selectedSimulation.currency} {formatCurrency(transaction.balanceBefore)}
                                          </div>

                                          <div>Novo Saldo:</div>
                                          <div className="text-right">
                                            {selectedSimulation.currency} {formatCurrency(transaction.balanceAfter)}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                              ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                  <p>Nenhuma transação encontrada</p>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>

                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedSimulation(null)
                              setTransactionAmount(0)
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button onClick={handleTransaction} disabled={isProcessing || transactionAmount <= 0}>
                            {isProcessing ? (
                              <>
                                <span className="animate-spin mr-2">⏳</span>
                                Processando...
                              </>
                            ) : (
                              <>{transactionType === "deposit" ? "Realizar Aporte" : "Realizar Retirada"}</>
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        toast({
                          title: "Exportação",
                          description: `Simulação ${simulation.id} exportada!`,
                        })
                      }}
                    >
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Exportar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
