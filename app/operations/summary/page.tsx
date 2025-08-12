"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSimulation } from "@/contexts/SimulationContext"
import OperationsNav from "@/components/OperationsNav"

interface GeneralSummary {
  totalPeriod: string
  totalDays: number
  totalOperations: number
  initialInvestment: number
  finalValue: number
  totalProfit: number
  totalFees: number
  netProfit: number
  totalProfitPercentage: number
  averageDailyProfit: number
  averageMonthlyProfit: number
  bestMonth: string
  worstMonth: string
  totalDailyRates: number
  totalDepositRates: number
  averageGrowthPerDay: number
  averageGrowthPerMonth: number
}

export default function GeneralSummaryPage() {
  const { simulationData, simulationResult } = useSimulation()
  const [generalSummary, setGeneralSummary] = useState<GeneralSummary | null>(null)

  useEffect(() => {
    if (simulationResult) {
      generateGeneralSummary()
    }
  }, [simulationResult, simulationData])

  const generateGeneralSummary = () => {
    let currentValue = Number.parseFloat(simulationData.initialInvestment)
    const totalMonths = Number.parseInt(simulationData.projectionPeriod)
    const initialInvestment = Number.parseFloat(simulationData.initialInvestment)
    
    let totalDays = 0
    let totalOperations = 0
    let totalProfit = 0
    let totalFees = 0
    let totalDailyRates = 0
    let totalDepositRates = 0
    let monthlyProfits: { month: string; profit: number }[] = []
    
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    
    for (let month = 1; month <= totalMonths; month++) {
      const date = new Date(Number.parseInt(simulationData.startYear), Number.parseInt(simulationData.startMonth) - 1 + month, Number.parseInt(simulationData.startDay))
      
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
      const operationsPerDay = Number.parseInt(simulationData.operationsPerDay)
      
      let monthProfit = 0
      let monthFees = 0
      let monthDaysCount = 0
      
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(date.getFullYear(), date.getMonth(), day)
        const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6
        
        if (isWeekend && !simulationData.includeWeekends) continue
        
        totalDays++
        monthDaysCount++
        
        // Calcular operações do dia
        for (let op = 1; op <= operationsPerDay; op++) {
          const entryFeeAmount = currentValue * (Number.parseFloat(simulationData.entryRate) / 100)
          const amountAfterEntryFee = currentValue - entryFeeAmount
          const profit = amountAfterEntryFee * (Number.parseFloat(simulationData.profitRate) / 100)
          const amountAfterProfit = amountAfterEntryFee + profit
          const exitFeeAmount = amountAfterProfit * (Number.parseFloat(simulationData.exitRate) / 100)
          const finalValue = amountAfterProfit - exitFeeAmount
          
          totalProfit += profit
          totalFees += entryFeeAmount + exitFeeAmount
          monthProfit += profit
          monthFees += entryFeeAmount + exitFeeAmount
          currentValue = finalValue
        }
        
        // Taxa diária
        const dailyRateAmount = currentValue * (Number.parseFloat(simulationData.dailyRate) / 100)
        currentValue = currentValue - dailyRateAmount
        totalDailyRates += dailyRateAmount
        monthFees += dailyRateAmount
        
        // Taxa de depósito
        const depositRateAmount = dailyRateAmount * (Number.parseFloat(simulationData.depositRate) / 100)
        totalDepositRates += depositRateAmount
      }
      
      totalOperations += monthDaysCount * operationsPerDay
      monthlyProfits.push({
        month: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
        profit: monthProfit - monthFees
      })
    }
    
    const netProfit = totalProfit - totalFees
    const totalProfitPercentage = ((currentValue - initialInvestment) / initialInvestment) * 100
    const averageDailyProfit = totalDays > 0 ? netProfit / totalDays : 0
    const averageMonthlyProfit = totalMonths > 0 ? netProfit / totalMonths : 0
    const averageGrowthPerDay = totalDays > 0 ? totalProfitPercentage / totalDays : 0
    const averageGrowthPerMonth = totalMonths > 0 ? totalProfitPercentage / totalMonths : 0
    
    // Encontrar melhor e pior mês
    const sortedMonths = [...monthlyProfits].sort((a, b) => b.profit - a.profit)
    const bestMonth = sortedMonths[0]?.month || 'N/A'
    const worstMonth = sortedMonths[sortedMonths.length - 1]?.month || 'N/A'
    
    const startDate = new Date(Number.parseInt(simulationData.startYear), Number.parseInt(simulationData.startMonth) - 1, Number.parseInt(simulationData.startDay))
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + totalMonths, startDate.getDate())
    
    setGeneralSummary({
      totalPeriod: `${startDate.toLocaleDateString('pt-BR')} a ${endDate.toLocaleDateString('pt-BR')}`,
      totalDays,
      totalOperations,
      initialInvestment,
      finalValue: currentValue,
      totalProfit,
      totalFees,
      netProfit,
      totalProfitPercentage,
      averageDailyProfit,
      averageMonthlyProfit,
      bestMonth,
      worstMonth,
      totalDailyRates,
      totalDepositRates,
      averageGrowthPerDay,
      averageGrowthPerMonth
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: simulationData.currency === 'EUR' ? 'EUR' : 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  if (!generalSummary) {
    return (
      <div className="min-h-screen bg-gray-50">
        <OperationsNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">Carregando resumo geral...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OperationsNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Resumo Geral</h1>
          <p className="text-gray-600 mt-2">
            Visão consolidada de todo o período de simulação
          </p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Período Total</p>
                  <p className="text-2xl font-bold text-gray-900">{generalSummary.totalPeriod}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">📅</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Investimento Inicial</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(generalSummary.initialInvestment)}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Final</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(generalSummary.finalValue)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">📈</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Crescimento Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPercentage(generalSummary.totalProfitPercentage)}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold">🚀</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela Detalhada */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Detalhamento Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas Operacionais</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de Dias:</span>
                    <span className="font-medium">{generalSummary.totalDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de Operações:</span>
                    <span className="font-medium">{generalSummary.totalOperations.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lucro Bruto:</span>
                    <span className="font-medium text-green-600">+{formatCurrency(generalSummary.totalProfit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de Taxas:</span>
                    <span className="font-medium text-red-600">-{formatCurrency(generalSummary.totalFees)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxas Diárias:</span>
                    <span className="font-medium text-red-600">-{formatCurrency(generalSummary.totalDailyRates)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxas de Depósito:</span>
                    <span className="font-medium text-blue-600">{formatCurrency(generalSummary.totalDepositRates)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lucro Líquido:</span>
                    <span className="font-medium text-green-600">+{formatCurrency(generalSummary.netProfit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lucro Médio/Dia:</span>
                    <span className="font-medium text-green-600">+{formatCurrency(generalSummary.averageDailyProfit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lucro Médio/Mês:</span>
                    <span className="font-medium text-green-600">+{formatCurrency(generalSummary.averageMonthlyProfit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Crescimento Médio/Dia:</span>
                    <span className="font-medium text-green-600">{formatPercentage(generalSummary.averageGrowthPerDay)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Crescimento Médio/Mês:</span>
                    <span className="font-medium text-green-600">{formatPercentage(generalSummary.averageGrowthPerMonth)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Melhor Mês:</span>
                    <span className="font-medium text-green-600">{generalSummary.bestMonth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pior Mês:</span>
                    <span className="font-medium text-red-600">{generalSummary.worstMonth}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 