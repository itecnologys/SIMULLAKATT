"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSimulation } from "@/contexts/SimulationContext"
import OperationsNav from "@/components/OperationsNav"

interface DailyCalculation {
  date: string
  dayOfWeek: string
  operationsCount: number
  initialValue: number
  totalEntryFees: number
  totalProfit: number
  totalExitFees: number
  finalValue: number
  dailyRate: number
  depositRate: number
  netProfit: number
}

export default function DailyCalculationsPage() {
  const { simulationData, simulationResult } = useSimulation()
  const [dailyCalculations, setDailyCalculations] = useState<DailyCalculation[]>([])

  useEffect(() => {
    if (simulationResult) {
      generateDailyCalculations()
    }
  }, [simulationResult, simulationData])

  const generateDailyCalculations = () => {
    const calculations: DailyCalculation[] = []
    let currentValue = Number.parseFloat(simulationData.initialInvestment)
    const totalMonths = Number.parseInt(simulationData.projectionPeriod)
    
    for (let month = 1; month <= totalMonths; month++) {
      const date = new Date(Number.parseInt(simulationData.startYear), Number.parseInt(simulationData.startMonth) - 1 + month, Number.parseInt(simulationData.startDay))
      
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
      const operationsPerDay = Number.parseInt(simulationData.operationsPerDay)
      
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(date.getFullYear(), date.getMonth(), day)
        const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6
        
        if (isWeekend && !simulationData.includeWeekends) continue
        
        const dayInitialValue = currentValue
        let dayTotalEntryFees = 0
        let dayTotalProfit = 0
        let dayTotalExitFees = 0
        
        // Calcular operações do dia
        for (let op = 1; op <= operationsPerDay; op++) {
          const entryFeeAmount = currentValue * (Number.parseFloat(simulationData.entryRate) / 100)
          const amountAfterEntryFee = currentValue - entryFeeAmount
          const profit = amountAfterEntryFee * (Number.parseFloat(simulationData.profitRate) / 100)
          const amountAfterProfit = amountAfterEntryFee + profit
          const exitFeeAmount = amountAfterProfit * (Number.parseFloat(simulationData.exitRate) / 100)
          const finalValue = amountAfterProfit - exitFeeAmount
          
          dayTotalEntryFees += entryFeeAmount
          dayTotalProfit += profit
          dayTotalExitFees += exitFeeAmount
          currentValue = finalValue
        }
        
        // Taxa diária
        const dailyRateAmount = currentValue * (Number.parseFloat(simulationData.dailyRate) / 100)
        currentValue = currentValue - dailyRateAmount
        
        // Taxa de depósito
        const depositRateAmount = dailyRateAmount * (Number.parseFloat(simulationData.depositRate) / 100)
        
        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
        
        calculations.push({
          date: `${day.toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`,
          dayOfWeek: dayNames[currentDate.getDay()],
          operationsCount: operationsPerDay,
          initialValue: dayInitialValue,
          totalEntryFees: dayTotalEntryFees,
          totalProfit: dayTotalProfit,
          totalExitFees: dayTotalExitFees,
          finalValue: currentValue,
          dailyRate: dailyRateAmount,
          depositRate: depositRateAmount,
          netProfit: dayTotalProfit - dayTotalEntryFees - dayTotalExitFees - dailyRateAmount
        })
      }
    }
    
    setDailyCalculations(calculations)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: simulationData.currency === 'EUR' ? 'EUR' : 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OperationsNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Cálculos Diários</h1>
          <p className="text-gray-600 mt-2">
            Resumo de operações por dia - {dailyCalculations.length} dias calculados
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dia
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
                      Taxa Diária
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taxa Depósito
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lucro Líquido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Final
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dailyCalculations.map((calculation, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {calculation.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {calculation.dayOfWeek}
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
                        -{formatCurrency(calculation.dailyRate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        {formatCurrency(calculation.depositRate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        +{formatCurrency(calculation.netProfit)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(calculation.finalValue)}
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