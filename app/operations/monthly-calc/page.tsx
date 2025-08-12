"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSimulation } from "@/contexts/SimulationContext"
import OperationsNav from "@/components/OperationsNav"

interface MonthlyCalculation {
  monthNumber: number
  monthName: string
  year: number
  daysCount: number
  operationsCount: number
  initialValue: number
  totalEntryFees: number
  totalProfit: number
  totalExitFees: number
  totalDailyRates: number
  totalDepositRates: number
  netProfit: number
  finalValue: number
  monthlyGrowth: number
  averageDailyProfit: number
}

export default function MonthlyCalculationsPage() {
  const { simulationData, simulationResult } = useSimulation()
  const [monthlyCalculations, setMonthlyCalculations] = useState<MonthlyCalculation[]>([])

  useEffect(() => {
    if (simulationResult) {
      generateMonthlyCalculations()
    }
  }, [simulationResult, simulationData])

  const generateMonthlyCalculations = () => {
    const calculations: MonthlyCalculation[] = []
    let currentValue = Number.parseFloat(simulationData.initialInvestment)
    const totalMonths = Number.parseInt(simulationData.projectionPeriod)
    
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    
    for (let month = 1; month <= totalMonths; month++) {
      const date = new Date(Number.parseInt(simulationData.startYear), Number.parseInt(simulationData.startMonth) - 1 + month, Number.parseInt(simulationData.startDay))
      
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
      const operationsPerDay = Number.parseInt(simulationData.operationsPerDay)
      
      const monthInitialValue = currentValue
      let monthTotalEntryFees = 0
      let monthTotalProfit = 0
      let monthTotalExitFees = 0
      let monthTotalDailyRates = 0
      let monthTotalDepositRates = 0
      let monthDaysCount = 0
      
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(date.getFullYear(), date.getMonth(), day)
        const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6
        
        if (isWeekend && !simulationData.includeWeekends) continue
        
        monthDaysCount++
        
        // Calcular operações do dia
        for (let op = 1; op <= operationsPerDay; op++) {
          const entryFeeAmount = currentValue * (Number.parseFloat(simulationData.entryRate) / 100)
          const amountAfterEntryFee = currentValue - entryFeeAmount
          const profit = amountAfterEntryFee * (Number.parseFloat(simulationData.profitRate) / 100)
          const amountAfterProfit = amountAfterEntryFee + profit
          const exitFeeAmount = amountAfterProfit * (Number.parseFloat(simulationData.exitRate) / 100)
          const finalValue = amountAfterProfit - exitFeeAmount
          
          monthTotalEntryFees += entryFeeAmount
          monthTotalProfit += profit
          monthTotalExitFees += exitFeeAmount
          currentValue = finalValue
        }
        
        // Taxa diária
        const dailyRateAmount = currentValue * (Number.parseFloat(simulationData.dailyRate) / 100)
        currentValue = currentValue - dailyRateAmount
        monthTotalDailyRates += dailyRateAmount
        
        // Taxa de depósito
        const depositRateAmount = dailyRateAmount * (Number.parseFloat(simulationData.depositRate) / 100)
        monthTotalDepositRates += depositRateAmount
      }
      
      const monthlyGrowth = ((currentValue - monthInitialValue) / monthInitialValue) * 100
      const averageDailyProfit = monthDaysCount > 0 ? (monthTotalProfit - monthTotalEntryFees - monthTotalExitFees - monthTotalDailyRates) / monthDaysCount : 0
      
      calculations.push({
        monthNumber: month,
        monthName: monthNames[date.getMonth()],
        year: date.getFullYear(),
        daysCount: monthDaysCount,
        operationsCount: monthDaysCount * operationsPerDay,
        initialValue: monthInitialValue,
        totalEntryFees: monthTotalEntryFees,
        totalProfit: monthTotalProfit,
        totalExitFees: monthTotalExitFees,
        totalDailyRates: monthTotalDailyRates,
        totalDepositRates: monthTotalDepositRates,
        netProfit: monthTotalProfit - monthTotalEntryFees - monthTotalExitFees - monthTotalDailyRates,
        finalValue: currentValue,
        monthlyGrowth,
        averageDailyProfit
      })
    }
    
    setMonthlyCalculations(calculations)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <OperationsNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Cálculos Mensais</h1>
          <p className="text-gray-600 mt-2">
            Resumo de operações por mês - {monthlyCalculations.length} meses calculados
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mês
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ano
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dias
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Operações
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Inicial
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taxas Entrada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lucro Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taxas Saída
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taxas Diárias
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taxas Depósito
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lucro Líquido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lucro Médio/Dia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Final
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Crescimento
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monthlyCalculations.map((calculation) => (
                    <tr key={calculation.monthNumber} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {calculation.monthName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {calculation.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {calculation.daysCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {calculation.operationsCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(calculation.initialValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        -{formatCurrency(calculation.totalEntryFees)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        +{formatCurrency(calculation.totalProfit)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        -{formatCurrency(calculation.totalExitFees)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        -{formatCurrency(calculation.totalDailyRates)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        {formatCurrency(calculation.totalDepositRates)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        +{formatCurrency(calculation.netProfit)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        +{formatCurrency(calculation.averageDailyProfit)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(calculation.finalValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {formatPercentage(calculation.monthlyGrowth)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 