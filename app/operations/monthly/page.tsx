"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSimulation } from "@/contexts/SimulationContext"
import OperationsNav from "@/components/OperationsNav"

interface MonthlySummary {
  monthNumber: number
  monthName: string
  year: number
  totalOperations: number
  totalDays: number
  initialValue: number
  finalValue: number
  totalProfit: number
  totalFees: number
  netProfit: number
  profitPercentage: number
  averageDailyProfit: number
  bestDay: string
  worstDay: string
}

export default function MonthlySummaryPage() {
  const { simulationData, simulationResult } = useSimulation()
  const [monthlySummaries, setMonthlySummaries] = useState<MonthlySummary[]>([])

  useEffect(() => {
    if (simulationResult) {
      generateMonthlySummaries()
    }
  }, [simulationResult, simulationData])

  const generateMonthlySummaries = () => {
    const summaries: MonthlySummary[] = []
    let currentValue = Number.parseFloat(simulationData.initialInvestment)
    const totalMonths = Number.parseInt(simulationData.projectionPeriod)
    
    // Criar data inicial
    const startDate = new Date(
      Number.parseInt(simulationData.startYear),
      Number.parseInt(simulationData.startMonth) - 1,
      Number.parseInt(simulationData.startDay)
    )
    
    // Ajustar para começar do mês inicial
    for (let monthOffset = 0; monthOffset <= totalMonths; monthOffset++) {
      const currentDate = new Date(startDate)
      currentDate.setMonth(startDate.getMonth() + monthOffset)
      
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
      const operationsPerDay = Number.parseInt(simulationData.operationsPerDay)
      
      const monthInitialValue = currentValue
      let monthTotalProfit = 0
      let monthTotalFees = 0
      let monthDaysCount = 0
      let bestDayProfit = -Infinity
      let worstDayProfit = Infinity
      let bestDay = ''
      let worstDay = ''
      
      // Determinar o dia inicial para este mês
      let startDay = 1
      if (monthOffset === 0) {  // Se for o primeiro mês
        startDay = Number.parseInt(simulationData.startDay)  // Começar no dia selecionado
      }
      
      for (let day = startDay; day <= daysInMonth; day++) {
        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6
        
        if (isWeekend && !simulationData.includeWeekends) continue
        
        monthDaysCount++
        let dayProfit = 0
        let dayFees = 0
        
        // Calcular operações do dia
        for (let op = 1; op <= operationsPerDay; op++) {
          const entryFeeAmount = currentValue * (Number.parseFloat(simulationData.entryRate) / 100)
          const amountAfterEntryFee = currentValue - entryFeeAmount
          const profit = amountAfterEntryFee * (Number.parseFloat(simulationData.profitRate) / 100)
          const amountAfterProfit = amountAfterEntryFee + profit
          const exitFeeAmount = amountAfterProfit * (Number.parseFloat(simulationData.exitRate) / 100)
          const finalValue = amountAfterProfit - exitFeeAmount
          
          dayProfit += profit
          dayFees += entryFeeAmount + exitFeeAmount
          currentValue = finalValue
        }
        
        // Taxa diária
        const dailyRateAmount = currentValue * (Number.parseFloat(simulationData.dailyRate) / 100)
        currentValue = currentValue - dailyRateAmount
        dayFees += dailyRateAmount
        
        monthTotalProfit += dayProfit
        monthTotalFees += dayFees
        
        // Rastrear melhor e pior dia
        const netDayProfit = dayProfit - dayFees
        if (netDayProfit > bestDayProfit) {
          bestDayProfit = netDayProfit
          bestDay = `${day.toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`
        }
        if (netDayProfit < worstDayProfit) {
          worstDayProfit = netDayProfit
          worstDay = `${day.toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`
        }
      }
      
      // Só adicionar o mês se tiver dias calculados
      if (monthDaysCount > 0) {
        const netProfit = monthTotalProfit - monthTotalFees
        const profitPercentage = ((currentValue - monthInitialValue) / monthInitialValue) * 100
        const averageDailyProfit = netProfit / monthDaysCount
        
        summaries.push({
          monthNumber: monthOffset + 1, // Assign a unique number for each month
          monthName: currentDate.toLocaleString('pt-BR', { month: 'long' }),
          year: currentDate.getFullYear(),
          totalOperations: monthDaysCount * operationsPerDay,
          totalDays: monthDaysCount,
          initialValue: monthInitialValue,
          finalValue: currentValue,
          totalProfit: monthTotalProfit,
          totalFees: monthTotalFees,
          netProfit: netProfit,
          profitPercentage: profitPercentage,
          averageDailyProfit: averageDailyProfit,
          bestDay: bestDay,
          worstDay: worstDay
        })
      }
    }
    
    setMonthlySummaries(summaries)
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
          <h1 className="text-3xl font-bold text-gray-900">Resumo Mensal</h1>
          <p className="text-gray-600 mt-2">
            Visão consolidada por mês - {monthlySummaries.length} meses analisados
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mês/Ano
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
                      Valor Final
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lucro Bruto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taxas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lucro Líquido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lucro Médio/Dia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Crescimento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Melhor Dia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pior Dia
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monthlySummaries.map((summary) => (
                    <tr key={summary.monthNumber} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {summary.monthName} {summary.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {summary.totalDays}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {summary.totalOperations}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(summary.initialValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(summary.finalValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        +{formatCurrency(summary.totalProfit)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        -{formatCurrency(summary.totalFees)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        +{formatCurrency(summary.netProfit)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        +{formatCurrency(summary.averageDailyProfit)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {formatPercentage(summary.profitPercentage)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        {summary.bestDay}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        {summary.worstDay}
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