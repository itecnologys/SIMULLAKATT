"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useSimulation } from "@/contexts/SimulationContext"
import { 
  Clock, 
  Bitcoin, 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  ChevronRight, 
  Eye, 
  Plus, 
  Minus, 
  ArrowUpRight, 
  Coins, 
  Leaf, 
  Settings, 
  Calendar, 
  Save, 
  Play, 
  CheckSquare
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [showSmallValues, setShowSmallValues] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Usar o contexto de simulação
  const { 
    simulationData, 
    updateSimulationData, 
    runSimulation, 
    saveSetup, 
    accumulatedValues 
  } = useSimulation()

  const handleSave = () => {
    saveSetup()
    alert("Configurações salvas com sucesso!")
  }

  const handleSimulate = async () => {
    setIsLoading(true)
    try {
      await runSimulation()
      alert("Simulação concluída com sucesso!")
    } catch (error) {
      console.error("Erro na simulação:", error)
      alert("Erro ao executar simulação")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Left/Center */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview Section - Layout Exato do Picnic */}
            <Card className="bg-white shadow-sm border border-gray-100 rounded-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <CardTitle className="text-lg font-semibold text-gray-900">Overview</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-sm text-gray-600">
                  Total invested + Multicurrency Account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Total Balance - EDITÁVEL */}
                <div className="text-center">
                  <div className="mb-4">
                    <Label htmlFor="initial-investment" className="text-sm font-medium text-gray-600 mb-2 block text-center">
                      Total Investimento Inicial
                    </Label>
                    <div className="flex items-center justify-center space-x-2">
                      <Input
                        id="initial-investment"
                        type="number"
                        value={simulationData.initialInvestment}
                        onChange={(e) => updateSimulationData({initialInvestment: e.target.value})}
                        className="text-center text-2xl font-bold text-green-600 border-green-300 focus:border-green-500 focus:ring-green-500 w-48"
                        placeholder="1500"
                      />
                      <Select 
                        value={simulationData.currency} 
                        onValueChange={(value) => updateSimulationData({currency: value})}
                      >
                        <SelectTrigger className="w-20 border-green-300 focus:border-green-500 focus:ring-green-500">
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
                </div>

                {/* Campos Horizontais - Editáveis Diretamente */}
                <div className="grid grid-cols-4 gap-0">
                  <div className="text-center p-4 border-r border-gray-100">
                    <div className="text-sm font-medium text-gray-600 mb-2 text-center">Operacoes Diarias</div>
                    <Select
                      value={simulationData.operationsPerDay}
                      onValueChange={(value) => updateSimulationData({operationsPerDay: value})}
                    >
                      <SelectTrigger className="border-none bg-transparent text-xl font-bold text-gray-900 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 text-center justify-center">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-center p-4 border-r border-gray-100">
                    <div className="text-sm font-medium text-gray-600 mb-2 text-center">Taxa de Lucro %</div>
                    <Input
                      type="number"
                      step="0.1"
                      value={simulationData.profitRate}
                      onChange={(e) => updateSimulationData({profitRate: e.target.value})}
                      className="text-center border-none bg-transparent text-xl font-bold text-gray-900 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="text-center p-4 border-r border-gray-100">
                    <div className="text-sm font-medium text-gray-600 mb-2 text-center">Taxa Diaria</div>
                    <Input
                      type="number"
                      step="0.01"
                      value={simulationData.dailyRate}
                      onChange={(e) => updateSimulationData({dailyRate: e.target.value})}
                      className="text-center border-none bg-transparent text-xl font-bold text-gray-900 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="text-center p-4">
                    <div className="text-sm font-medium text-gray-600 mb-2 text-center">Periodo [Meses]</div>
                    <Select
                      value={simulationData.projectionPeriod}
                      onValueChange={(value) => updateSimulationData({projectionPeriod: value})}
                    >
                      <SelectTrigger className="border-none bg-transparent text-xl font-bold text-gray-900 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 text-center justify-center">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 36 }, (_, i) => i + 1).map((month) => (
                          <SelectItem key={month} value={month.toString()}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Campos de Taxas - 3 Cards Separados */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center p-4 border-r border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Taxa de Deposito</div>
                    <Input
                      type="number"
                      step="0.01"
                      value={simulationData.depositRate}
                      onChange={(e) => updateSimulationData({depositRate: e.target.value})}
                      className="text-center border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="text-center p-4 border-r border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Taxa de Entrada</div>
                    <Input
                      type="number"
                      step="0.01"
                      value={simulationData.entryRate}
                      onChange={(e) => updateSimulationData({entryRate: e.target.value})}
                      className="text-center border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="text-center p-4">
                    <div className="text-sm text-gray-600 mb-1">Taxa de Saida</div>
                    <Input
                      type="number"
                      step="0.01"
                      value={simulationData.exitRate}
                      onChange={(e) => updateSimulationData({exitRate: e.target.value})}
                      className="text-center border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Action Buttons - Layout Exato do Picnic */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    onClick={handleSave}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => {
                      // Toggle para mostrar/ocultar campos de data
                      const dateSection = document.getElementById('date-section')
                      if (dateSection) {
                        dateSection.style.display = dateSection.style.display === 'none' ? 'block' : 'none'
                      }
                    }}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Data de Início
                  </Button>
                  <div className="flex items-center justify-center space-x-2 border border-gray-300 rounded-lg px-4 py-2 bg-white">
                    <Switch
                      checked={simulationData.includeWeekends}
                      onCheckedChange={(checked) => updateSimulationData({includeWeekends: checked})}
                      className="data-[state=checked]:bg-green-600"
                    />
                    <span className="text-sm text-gray-700">Incluir fins de semana</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={handleSimulate}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Processando...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Executar Simulação
                      </>
                    )}
                  </Button>
                </div>

                {/* Data de Início - Oculto por padrão */}
                <div id="date-section" className="pt-4 border-t border-gray-100" style={{display: 'none'}}>
                  <div className="text-sm text-gray-600 mb-2 text-center">Data de Início da Operação</div>
                  <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                    <div>
                      <Label className="text-xs text-gray-500">Dia</Label>
                      <Select 
                        value={simulationData.startDay} 
                        onValueChange={(value) => updateSimulationData({startDay: value})}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
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
                      <Label className="text-xs text-gray-500">Mês</Label>
                      <Select 
                        value={simulationData.startMonth} 
                        onValueChange={(value) => updateSimulationData({startMonth: value})}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Jan</SelectItem>
                          <SelectItem value="2">Fev</SelectItem>
                          <SelectItem value="3">Mar</SelectItem>
                          <SelectItem value="4">Abr</SelectItem>
                          <SelectItem value="5">Mai</SelectItem>
                          <SelectItem value="6">Jun</SelectItem>
                          <SelectItem value="7">Jul</SelectItem>
                          <SelectItem value="8">Ago</SelectItem>
                          <SelectItem value="9">Set</SelectItem>
                          <SelectItem value="10">Out</SelectItem>
                          <SelectItem value="11">Nov</SelectItem>
                          <SelectItem value="12">Dez</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-500">Ano</Label>
                      <Select 
                        value={simulationData.startYear} 
                        onValueChange={(value) => updateSimulationData({startYear: value})}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
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
              </CardContent>
            </Card>

            {/* Picnic Card Section - Mantido Exatamente como no Picnic */}
            <Card className="bg-green-50 border-green-200 rounded-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-6 w-6 text-green-600" />
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">Picnic Card</CardTitle>
                      <div className="text-sm text-gray-600">Card balance</div>
                      <div className="text-xl font-bold text-green-600">€ 4.68</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button variant="link" className="text-green-600 hover:text-green-700 p-0">
                      Add funds
                    </Button>
                    <div className="bg-black text-white text-xs px-2 py-1 rounded">
                      VISA
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cryptocurrencies Section - Mantido Exatamente como no Picnic */}
            <Card className="bg-white shadow-sm border border-gray-100 rounded-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bitcoin className="h-5 w-5 text-gray-600" />
                    <CardTitle className="text-lg font-semibold text-gray-900">Cryptocurrencies</CardTitle>
                  </div>
                  <Link href="/dashboard" className="text-green-600 hover:text-green-700 text-sm font-medium">
                    View more <ChevronRight className="h-4 w-4 inline" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Column Headers */}
                <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-600 border-b border-gray-100 pb-2">
                  <div className="flex items-center space-x-1">
                    <span>Balance</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                  <div>Current Price</div>
                  <div>Change 24h</div>
                </div>

                {/* No data message */}
                <div className="text-center py-8 text-gray-500">
                  <Bitcoin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No cryptocurrencies found</p>
                </div>

                {/* Display Options */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showSmallValues}
                          onChange={(e) => setShowSmallValues(e.target.checked)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">Show small values</span>
                      </label>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Display 1 cryptocurrencies with a balance less than 1 dollar
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right - Mantido Exatamente como no Picnic */}
          <div className="space-y-6">
            
            {/* Card de Contas de Remuneração - NOVO LOCAL */}
            <Card className="bg-white shadow-sm border border-gray-100 rounded-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-gray-600" />
                  <CardTitle className="text-lg font-semibold text-gray-900">$ Contas de REMUNERAÇÃO</CardTitle>
                </div>
                <CardDescription className="text-sm text-gray-600">
                  Available to buy cryptocurrencies and fiat operations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-green-600">€</span>
                    </div>
                    <span className="text-sm text-gray-700">Total da Conta Diária</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {simulationData.currency === "EUR" ? "€" : "$"} {accumulatedValues.dailyAccumulated.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">€</span>
                    </div>
                    <span className="text-sm text-gray-700">Total da Conta de Depósito</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {simulationData.currency === "EUR" ? "€" : "$"} {accumulatedValues.depositAccumulated.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Let your money work for you - Mantido Exatamente como no Picnic */}
            <Card className="bg-white shadow-sm border border-gray-100 rounded-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        Let your money work for you
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Earn 4.64% annual yields investing on Simple Earn
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bitcoin Withdrawal - Mantido Exatamente como no Picnic */}
            <Card className="bg-white shadow-sm border border-gray-100 rounded-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                      Bitcoin Withdrawal
                    </CardTitle>
                    <p className="text-sm text-gray-600 mb-3">
                      Send Bitcoin to your native wallet at the lowest rate in the market.
                    </p>
                    <Button variant="link" className="text-green-600 hover:text-green-700 p-0 h-auto">
                      earn more
                    </Button>
                  </div>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Bitcoin className="h-8 w-8 text-gray-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Chat Support */}
      <div className="fixed bottom-6 right-6">
        <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full w-12 h-12 p-0 shadow-lg">
          <Eye className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
} 