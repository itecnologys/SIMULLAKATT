"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Save, ArrowRight, AlertCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { saveSimulation, saveSetup } from "@/lib/simulation-service"

export default function SetupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Form state - valores simples
  const [setupName, setSetupName] = useState("")
  const [initialInvestment, setInitialInvestment] = useState("1500")
  const [currency, setCurrency] = useState("EUR")
  const [entryFee, setEntryFee] = useState("0.1")
  const [exitFee, setExitFee] = useState("0.1")
  const [profitRate, setProfitRate] = useState("2.5")
  const [dailyFee, setDailyFee] = useState("0.2")
  const [operationsPerDay, setOperationsPerDay] = useState("4")
  const [projectionMonths, setProjectionMonths] = useState("24")
  const [includeWeekends, setIncludeWeekends] = useState(false)
  const [startDay, setStartDay] = useState("5")
  const [startMonth, setStartMonth] = useState("4")
  const [startYear, setStartYear] = useState("2020")

  // Carregar parâmetros da URL
  useEffect(() => {
    const profitRateParam = searchParams.get("profitRate")
    const universeParam = searchParams.get("universe")
    const assetParam = searchParams.get("asset")

    if (profitRateParam) {
      setProfitRate(profitRateParam)
    }

    if (universeParam && assetParam) {
      setSetupName(`Simulação ${assetParam} (${universeParam})`)
    }
  }, [searchParams])

  const handleSave = async () => {
    setError("")

    try {
      const setupData = {
        name: setupName || `Simulação ${new Date().toLocaleString()}`,
        initialInvestment: Number.parseFloat(initialInvestment),
        currency,
        entryFee: Number.parseFloat(entryFee),
        exitFee: Number.parseFloat(exitFee),
        profitRate: Number.parseFloat(profitRate),
        dailyFee: Number.parseFloat(dailyFee),
        operationsPerDay: Number.parseInt(operationsPerDay),
        projectionMonths: Number.parseInt(projectionMonths),
        includeWeekends,
        startDate: `${startYear}-${startMonth.padStart(2, "0")}-${startDay.padStart(2, "0")}`,
      }

      // Salvar no localStorage para simplicidade
      localStorage.setItem("currentSetup", JSON.stringify(setupData))

      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram salvas com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao salvar:", error)
      setError("Erro ao salvar configurações")
    }
  }

  const handleSimulate = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Preparar dados da simulação
      const setupData = {
        name: setupName || `Simulação ${new Date().toLocaleString()}`,
        initialInvestment: Number.parseFloat(initialInvestment),
        currency,
        entryFee: Number.parseFloat(entryFee),
        exitFee: Number.parseFloat(exitFee),
        profitRate: Number.parseFloat(profitRate),
        dailyFee: Number.parseFloat(dailyFee),
        operationsPerDay: Number.parseInt(operationsPerDay),
        projectionMonths: Number.parseInt(projectionMonths),
        includeWeekends,
        startDate: `${startYear}-${startMonth.padStart(2, "0")}-${startDay.padStart(2, "0")}`,
      }

      // Salvar setup
      await saveSetup(setupData)

      // Gerar dados da simulação
      const monthlyData = []
      let currentAmount = setupData.initialInvestment

      for (let month = 0; month < setupData.projectionMonths; month++) {
        const daysInMonth = 30 // Simplificado para 30 dias por mês
        const days = []

        for (let day = 0; day < daysInMonth; day++) {
          const date = new Date(setupData.startDate)
          date.setMonth(date.getMonth() + month)
          date.setDate(date.getDate() + day)

          const isWeekend = date.getDay() === 0 || date.getDay() === 6
          if (isWeekend && !setupData.includeWeekends) continue

          const operations = []
          let dayInitialAmount = currentAmount
          let dayCurrentAmount = currentAmount

          // Operações do dia
          for (let op = 0; op < setupData.operationsPerDay; op++) {
            const opDate = new Date(date)
            opDate.setHours(9 + op * 2)

            const entryFeeAmount = dayCurrentAmount * (setupData.entryFee / 100)
            const amountAfterEntryFee = dayCurrentAmount - entryFeeAmount
            const profit = amountAfterEntryFee * (setupData.profitRate / 100)
            const amountAfterProfit = amountAfterEntryFee + profit
            const exitFeeAmount = amountAfterProfit * (setupData.exitFee / 100)
            const finalAmount = amountAfterProfit - exitFeeAmount

            operations.push({
              id: `op-${month + 1}-${day + 1}-${op + 1}`,
              timestamp: opDate.toISOString(),
              initialAmount: dayCurrentAmount,
              entryFee: entryFeeAmount,
              amountAfterEntryFee,
              profit,
              amountAfterProfit,
              exitFee: exitFeeAmount,
              finalAmount,
            })

            dayCurrentAmount = finalAmount
          }

          // Calcular taxa diária
          const totalTransacted = operations.reduce((sum, op) => sum + op.initialAmount, 0)
          const dailyFeeAmount = totalTransacted * (setupData.dailyFee / 100)
          const finalDailyAmount = dayCurrentAmount - dailyFeeAmount

          days.push({
            day: day + 1,
            date,
            timestamp: date.toISOString(),
            isWeekend,
            initialAmount: dayInitialAmount,
            finalAmount: finalDailyAmount,
            operations,
            totalTransacted,
            dailyFee: dailyFeeAmount,
          })

          currentAmount = finalDailyAmount
        }

        const monthInitialAmount = days[0]?.initialAmount || currentAmount
        const monthFinalAmount = days[days.length - 1]?.finalAmount || currentAmount
        const monthGrowth = monthFinalAmount - monthInitialAmount
        const monthGrowthPercentage = (monthGrowth / monthInitialAmount) * 100

        monthlyData.push({
          month: month + 1,
          timestamp: new Date(setupData.startDate).setMonth(month).toString(),
          initialAmount: monthInitialAmount,
          finalAmount: monthFinalAmount,
          growth: monthGrowth,
          growthPercentage: monthGrowthPercentage,
          days,
        })
      }

      // Criar objeto da simulação
      const now = new Date().toISOString()
      const setupWithTimestamp = {
        ...setupData,
        createdAt: now,
        updatedAt: now,
      }

      const simulation = {
        initialAmount: setupData.initialInvestment,
        finalAmount: currentAmount,
        profitAmount: currentAmount - setupData.initialInvestment,
        profitPercentage: ((currentAmount - setupData.initialInvestment) / setupData.initialInvestment) * 100,
        operationsCount: monthlyData.reduce((sum, month) => 
          sum + month.days.reduce((daySum, day) => daySum + day.operations.length, 0), 0),
        totalFees: monthlyData.reduce((sum, month) => 
          sum + month.days.reduce((daySum, day) => 
            daySum + day.dailyFee + day.operations.reduce((opSum, op) => 
              opSum + op.entryFee + op.exitFee, 0), 0), 0),
        currency: setupData.currency,
        setupParams: setupWithTimestamp,
        monthlyData,
      }

      // Salvar simulação
      await saveSimulation(simulation)

      toast({
        title: "Simulação concluída",
        description: "Sua simulação foi processada e salva com sucesso.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Erro na simulação:", error)
      setError("Erro ao processar simulação. Por favor, verifique os dados e tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Configuração da Simulação</h2>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Parâmetros de Investimento</CardTitle>
          <CardDescription>Configure os parâmetros da sua simulação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nome da Configuração */}
          <div className="space-y-2">
            <Label htmlFor="setup-name">Nome da Configuração</Label>
            <Input
              id="setup-name"
              placeholder="Ex: Investimento Conservador 2020"
              value={setupName}
              onChange={(e) => setSetupName(e.target.value)}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Investimento Inicial */}
            <div className="space-y-2">
              <Label htmlFor="initial-investment">Investimento Inicial</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="initial-investment"
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(e.target.value)}
                />
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Operações por Dia */}
            <div className="space-y-2">
              <Label htmlFor="operations">Operações por Dia</Label>
              <Select value={operationsPerDay} onValueChange={setOperationsPerDay}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 operação por dia</SelectItem>
                  <SelectItem value="2">2 operações por dia</SelectItem>
                  <SelectItem value="3">3 operações por dia</SelectItem>
                  <SelectItem value="4">4 operações por dia</SelectItem>
                  <SelectItem value="5">5 operações por dia</SelectItem>
                  <SelectItem value="6">6 operações por dia</SelectItem>
                  <SelectItem value="7">7 operações por dia</SelectItem>
                  <SelectItem value="8">8 operações por dia</SelectItem>
                  <SelectItem value="9">9 operações por dia</SelectItem>
                  <SelectItem value="10">10 operações por dia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Taxa de Entrada */}
            <div className="space-y-2">
              <Label htmlFor="entry-fee">Taxa de Entrada (%)</Label>
              <Input
                id="entry-fee"
                type="number"
                step="0.01"
                value={entryFee}
                onChange={(e) => setEntryFee(e.target.value)}
              />
            </div>

            {/* Taxa de Saída */}
            <div className="space-y-2">
              <Label htmlFor="exit-fee">Taxa de Saída (%)</Label>
              <Input
                id="exit-fee"
                type="number"
                step="0.01"
                value={exitFee}
                onChange={(e) => setExitFee(e.target.value)}
              />
            </div>

            {/* Taxa de Lucro */}
            <div className="space-y-2">
              <Label htmlFor="profit-rate">Taxa de Lucro (%)</Label>
              <Input
                id="profit-rate"
                type="number"
                step="0.1"
                value={profitRate}
                onChange={(e) => setProfitRate(e.target.value)}
              />
            </div>

            {/* Taxa Diária */}
            <div className="space-y-2">
              <Label htmlFor="daily-fee">Taxa Diária (%)</Label>
              <Input
                id="daily-fee"
                type="number"
                step="0.01"
                value={dailyFee}
                onChange={(e) => setDailyFee(e.target.value)}
              />
            </div>
          </div>

          {/* Período de Projeção */}
          <div className="space-y-2">
            <Label htmlFor="projection-months">Período de Projeção (Meses)</Label>
            <Select value={projectionMonths} onValueChange={setProjectionMonths}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 36 }, (_, i) => i + 1).map((month) => (
                  <SelectItem key={month} value={month.toString()}>
                    {month} {month === 1 ? "mês" : "meses"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data de Início */}
          <div className="space-y-2">
            <Label>Data de Início</Label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="day" className="text-xs">
                  Dia
                </Label>
                <Select value={startDay} onValueChange={setStartDay}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="month" className="text-xs">
                  Mês
                </Label>
                <Select value={startMonth} onValueChange={setStartMonth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Janeiro</SelectItem>
                    <SelectItem value="2">Fevereiro</SelectItem>
                    <SelectItem value="3">Março</SelectItem>
                    <SelectItem value="4">Abril</SelectItem>
                    <SelectItem value="5">Maio</SelectItem>
                    <SelectItem value="6">Junho</SelectItem>
                    <SelectItem value="7">Julho</SelectItem>
                    <SelectItem value="8">Agosto</SelectItem>
                    <SelectItem value="9">Setembro</SelectItem>
                    <SelectItem value="10">Outubro</SelectItem>
                    <SelectItem value="11">Novembro</SelectItem>
                    <SelectItem value="12">Dezembro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="year" className="text-xs">
                  Ano
                </Label>
                <Select value={startYear} onValueChange={setStartYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => 2015 + i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Incluir Fins de Semana */}
          <div className="flex items-center space-x-2">
            <Switch id="include-weekends" checked={includeWeekends} onCheckedChange={setIncludeWeekends} />
            <Label htmlFor="include-weekends">Incluir fins de semana nos cálculos</Label>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Configurações
          </Button>
          <Button onClick={handleSimulate} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Processando...
              </>
            ) : (
              <>
                Executar Simulação
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
