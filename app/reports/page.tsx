"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, TrendingUp, Users, FileText, BarChart3, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useSimulation } from "@/contexts/SimulationContext"

export default function ReportsPage() {
  const [currentDate] = useState(new Date())
  const [selectedPeriod, setSelectedPeriod] = useState("24")
  const { simulationData, simulationResult, accumulatedValues } = useSimulation()
  
  // Calcular valores reais baseados na simulação
  const reportData = {
    currentAssets: Number.parseFloat(simulationData.initialInvestment) || 0, // Valor total de entrada no período
    currentLiabilities: simulationResult?.profitAmount || 0, // Alavancagem no período em comparação ao período inicial
    totalLiabilities: accumulatedValues.dailyAccumulated || 0, // Valor retido e acumulado no período da taxa diária
    totalAssets: accumulatedValues.depositAccumulated || 0, // Valor acumulado no período da taxa de depósito
    subsidiaries: [
      {
        id: 1,
        name: "Subsidiary 1",
        currentAssets: 1832812,
        currentLiabilities: 1420875,
        workingCapital: 545876,
        workingCapitalRatio: 132.7,
        liquidityRatio: 90.5,
        totalAssets: 135204221,
        totalLiabilities: 9451464,
        totalEquity: 136204221,
        debtToEquityRatio: 7.5
      },
      {
        id: 2,
        name: "Subsidiary 2",
        currentAssets: 1654321,
        currentLiabilities: 1234567,
        workingCapital: 419754,
        workingCapitalRatio: 134.0,
        liquidityRatio: 92.1,
        totalAssets: 128456789,
        totalLiabilities: 8765432,
        totalEquity: 129456789,
        debtToEquityRatio: 6.8
      },
      {
        id: 3,
        name: "Subsidiary 3",
        currentAssets: 1987654,
        currentLiabilities: 1456789,
        workingCapital: 530865,
        workingCapitalRatio: 136.4,
        liquidityRatio: 88.7,
        totalAssets: 142345678,
        totalLiabilities: 9876543,
        totalEquity: 143345678,
        debtToEquityRatio: 6.9
      },
      {
        id: 4,
        name: "Subsidiary 4",
        currentAssets: 1723456,
        currentLiabilities: 1345678,
        workingCapital: 377778,
        workingCapitalRatio: 128.1,
        liquidityRatio: 94.2,
        totalAssets: 138901234,
        totalLiabilities: 9123456,
        totalEquity: 139901234,
        debtToEquityRatio: 6.5
      }
    ]
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const getBarWidth = (value: number, maxValue: number) => {
    return Math.min((value / maxValue) * 100, 100)
  }

  const getMaxValue = (data: any[], field: string) => {
    return Math.max(...data.map(item => item[field]))
  }

  const getStatusColor = (ratio: number, threshold: number = 100) => {
    return ratio >= threshold ? 'text-green-600' : 'text-red-600'
  }

  const getStatusDot = (ratio: number, threshold: number = 100) => {
    return ratio >= threshold ? 'bg-green-500' : 'bg-red-500'
  }



  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Relatório de Simulação Financeira - Indicadores de Performance
          </h1>
          {/* Date Selector */}
          <div className="flex items-center justify-center space-x-2">
            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">
                Dec {currentDate.getFullYear()}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Cards - IDENTICOS ao design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Current Assets */}
          <Card className="bg-blue-50 border-blue-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-7 w-7 text-blue-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {formatCurrency(reportData.currentAssets)}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Total de Entrada</div>
                </div>
              </div>
              {/* Wavy line graph */}
              <div className="relative h-8">
                <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path
                    d="M0,10 Q25,5 50,10 T100,10"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0,10 Q25,15 50,10 T100,10"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.3"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Current Liabilities */}
          <Card className="bg-red-50 border-red-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Users className="h-7 w-7 text-red-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {formatCurrency(reportData.currentLiabilities)}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Alavancagem</div>
                </div>
              </div>
              {/* Wavy line graph */}
              <div className="relative h-8">
                <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path
                    d="M0,10 Q25,5 50,10 T100,10"
                    stroke="#EF4444"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0,10 Q25,15 50,10 T100,10"
                    stroke="#EF4444"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.3"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Total Liabilities */}
          <Card className="bg-red-50 border-red-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-7 w-7 text-red-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {formatCurrency(reportData.totalLiabilities)}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Taxa Diária Acumulada</div>
                </div>
              </div>
              {/* Wavy line graph */}
              <div className="relative h-8">
                <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path
                    d="M0,10 Q25,5 50,10 T100,10"
                    stroke="#EF4444"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0,10 Q25,15 50,10 T100,10"
                    stroke="#EF4444"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.3"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Total Assets */}
          <Card className="bg-red-50 border-red-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-7 w-7 text-red-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {formatCurrency(reportData.totalAssets)}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Taxa de Depósito Acumulada</div>
                </div>
              </div>
              {/* Wavy line graph */}
              <div className="relative h-8">
                <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path
                    d="M0,10 Q25,5 50,10 T100,10"
                    stroke="#EF4444"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0,10 Q25,15 50,10 T100,10"
                    stroke="#EF4444"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.3"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Assets & Liabilities Table */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Relatórios
                </CardTitle>
                <div className="text-sm text-gray-600 mt-1">
                  Última atualização: {new Date().toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Período:</span>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32 border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 meses</SelectItem>
                    <SelectItem value="12">12 meses</SelectItem>
                    <SelectItem value="18">18 meses</SelectItem>
                    <SelectItem value="24">24 meses</SelectItem>
                    <SelectItem value="30">30 meses</SelectItem>
                    <SelectItem value="36">36 meses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">#</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Subsidiary</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Current Assets</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Current Liabilities</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Working Capital</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Working Capital Ratio</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Liquidity Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.subsidiaries.map((subsidiary, index) => {
                    const maxCurrentAssets = getMaxValue(reportData.subsidiaries, 'currentAssets')
                    const maxCurrentLiabilities = getMaxValue(reportData.subsidiaries, 'currentLiabilities')
                    const maxWorkingCapital = getMaxValue(reportData.subsidiaries, 'workingCapital')
                    
                    return (
                      <tr key={subsidiary.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">{subsidiary.name}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${getBarWidth(subsidiary.currentAssets, maxCurrentAssets)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {formatCurrency(subsidiary.currentAssets)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full" 
                                style={{ width: `${getBarWidth(subsidiary.currentLiabilities, maxCurrentLiabilities)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {formatCurrency(subsidiary.currentLiabilities)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${subsidiary.workingCapital >= 0 ? 'bg-blue-600' : 'bg-red-600'}`}
                                style={{ width: `${getBarWidth(Math.abs(subsidiary.workingCapital), maxWorkingCapital)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {formatCurrency(subsidiary.workingCapital)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusDot(subsidiary.workingCapitalRatio)}`}></div>
                            <span className={`text-sm font-medium ${getStatusColor(subsidiary.workingCapitalRatio)}`}>
                              {subsidiary.workingCapitalRatio}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusDot(subsidiary.liquidityRatio, 90)}`}></div>
                            <span className={`text-sm font-medium ${getStatusColor(subsidiary.liquidityRatio, 90)}`}>
                              {subsidiary.liquidityRatio}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Total Assets & Liabilities Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Relatórios Detalhados
                </CardTitle>
                <div className="text-sm text-gray-600 mt-1">
                  Período selecionado: {selectedPeriod} meses
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Filtro:</span>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32 border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 meses</SelectItem>
                    <SelectItem value="12">12 meses</SelectItem>
                    <SelectItem value="18">18 meses</SelectItem>
                    <SelectItem value="24">24 meses</SelectItem>
                    <SelectItem value="30">30 meses</SelectItem>
                    <SelectItem value="36">36 meses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">#</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Subsidiary</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Total Assets</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Total Liabilities</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Total Equity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Debt to Equity Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.subsidiaries.map((subsidiary, index) => {
                    const maxTotalAssets = getMaxValue(reportData.subsidiaries, 'totalAssets')
                    const maxTotalLiabilities = getMaxValue(reportData.subsidiaries, 'totalLiabilities')
                    const maxTotalEquity = getMaxValue(reportData.subsidiaries, 'totalEquity')
                    
                    return (
                      <tr key={subsidiary.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">{subsidiary.name}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-800 h-2 rounded-full" 
                                style={{ width: `${getBarWidth(subsidiary.totalAssets, maxTotalAssets)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {formatCurrency(subsidiary.totalAssets)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full" 
                                style={{ width: `${getBarWidth(subsidiary.totalLiabilities, maxTotalLiabilities)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {formatCurrency(subsidiary.totalLiabilities)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-400 h-2 rounded-full" 
                                style={{ width: `${getBarWidth(subsidiary.totalEquity, maxTotalEquity)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {formatCurrency(subsidiary.totalEquity)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusDot(subsidiary.debtToEquityRatio, 10)}`}></div>
                            <span className={`text-sm font-medium ${getStatusColor(subsidiary.debtToEquityRatio, 10)}`}>
                              {subsidiary.debtToEquityRatio}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            This graph/chart is linked to excel, and changes automatically based on data. Just left click on it and select "Edit Data".
          </p>
        </div>
      </div>
    </div>
  )
} 