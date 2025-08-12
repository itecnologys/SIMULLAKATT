"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSimulation } from "@/contexts/SimulationContext"
import OperationsNav from "@/components/OperationsNav"

interface WeeklyCalculation {
  weekNumber: number
  startDate: string
  endDate: string
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
  weeklyGrowth: number
}

export default function WeeklyCalculationsPage() {
  const { simulationData, simulationResult } = useSimulation()
  const [weeklyCalculations, setWeeklyCalculations] = useState<WeeklyCalculation[]>([])

  useEffect(() => {
    if (simulationResult) {
      generateWeeklyCalculations()
    }
  }, [simulationResult, simulationData])

  const generateWeeklyCalculations = () => {
    const calculations: WeeklyCalculation[] = []
    let currentValue = Number.parseFloat(simulationData.initialInvestment)
    const totalMonths = Number.parseInt(simulationData.projectionPeriod)
    
    let weekNumber = 1
    let weekStartDate: Date | null = null
    let weekInitialValue = currentValue
    let weekTotalEntryFees = 0
    let weekTotalProfit = 0
    let weekTotalExitFees = 0
    let weekTotalDailyRates = 0
    let weekTotalDepositRates = 0
    let weekDaysCount = 0
    
    for (let month = 1; month <= totalMonths; month++) {
      const date = new Date(Number.parseInt(simulationData.startYear), Number.parseInt(simulationData.startMonth) - 1 + month, Number.parseInt(simulationData.startDay))
      
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
      const operationsPerDay = Number.parseInt(simulationData.operationsPerDay)
      
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(date.getFullYear(), date.getMonth(), day)
        const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6
        
        if (isWeekend && !simulationData.includeWeekends) continue
        
        // Iniciar nova semana se necessário
        if (weekStartDate === null) {
          weekStartDate = new Date(currentDate)
        }
        
        weekDaysCount++
        
        // Calcular operações do dia
        for (let op = 1; op <= operationsPerDay; op++) {
          const entryFeeAmount = currentValue * (Number.parseFloat(simulationData.entryRate) / 100)
          const amountAfterEntryFee = currentValue - entryFeeAmount
          const profit = amountAfterEntryFee * (Number.parseFloat(simulationData.profitRate) / 100)
          const amountAfterProfit = amountAfterEntryFee + profit
          const exitFeeAmount = amountAfterProfit * (Number.parseFloat(simulationData.exitRate) / 100)
          const finalValue = amountAfterProfit - exitFeeAmount
          
          weekTotalEntryFees += entryFeeAmount
          weekTotalProfit += profit
          weekTotalExitFees += exitFeeAmount
          currentValue = finalValue
        }
        
        // Taxa diária
        const dailyRateAmount = currentValue * (Number.parseFloat(simulationData.dailyRate) / 100)
        currentValue = currentValue - dailyRateAmount
        weekTotalDailyRates += dailyRateAmount
        
        // Taxa de depósito
        const depositRateAmount = dailyRateAmount * (Number.parseFloat(simulationData.depositRate) / 100)
        weekTotalDepositRates += depositRateAmount
        
        // Finalizar semana se completou 7 dias ou é o último dia
        if (weekDaysCount >= 7 || (month === totalMonths && day === daysInMonth)) {
          const weekEndDate = new Date(currentDate)
          const weeklyGrowth = ((currentValue - weekInitialValue) / weekInitialValue) * 100
          
          calculations.push({
            weekNumber,
            startDate: `${weekStartDate!.getDate().toString().padStart(2, '0')}/${(weekStartDate!.getMonth() + 1).toString().padStart(2, '0')}`,
            endDate: `${weekEndDate.getDate().toString().padStart(2, '0')}/${(weekEndDate.getMonth() + 1).toString().padStart(2, '0')}`,
            daysCount: weekDaysCount,
            operationsCount: weekDaysCount * Number.parseInt(simulationData.operationsPerDay),
            initialValue: weekInitialValue,
            totalEntryFees: weekTotalEntryFees,
            totalProfit: weekTotalProfit,
            totalExitFees: weekTotalExitFees,
            totalDailyRates: weekTotalDailyRates,
            totalDepositRates: weekTotalDepositRates,
            netProfit: weekTotalProfit - weekTotalEntryFees - weekTotalExitFees - weekTotalDailyRates,
            finalValue: currentValue,
            weeklyGrowth
          })
          
          // Resetar para próxima semana
          weekNumber++
          weekStartDate = null
          weekInitialValue = currentValue
          weekTotalEntryFees = 0
          weekTotalProfit = 0
          weekTotalExitFees = 0
          weekTotalDailyRates = 0
          weekTotalDepositRates = 0
          weekDaysCount = 0
        }
      }
    }
    
    setWeeklyCalculations(calculations)
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
          <h1 className="text-3xl font-bold text-gray-900">Cálculos Semanais</h1>
          <p className="text-gray-600 mt-2">
            Resumo de operações por semana - {weeklyCalculations.length} semanas calculadas
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Semana
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Período
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
                      Valor Final
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Crescimento
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {weeklyCalculations.map((calculation) => (
                    <tr key={calculation.weekNumber} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Semana {calculation.weekNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {calculation.startDate} - {calculation.endDate}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(calculation.finalValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {formatPercentage(calculation.weeklyGrowth)}
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