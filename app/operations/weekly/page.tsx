"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSimulation } from "@/contexts/SimulationContext"
import OperationsNav from "@/components/OperationsNav"
import { Label } from "@/components/ui/label"

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
      const calculations = generateWeeklyCalculations()
      setWeeklyCalculations(calculations)
    }
  }, [simulationResult, simulationData])

  const generateWeeklyCalculations = () => {
    const calculations: WeeklyCalculation[] = []
    let currentValue = Number.parseFloat(simulationData.initialInvestment)
    const totalMonths = Number.parseInt(simulationData.projectionPeriod)
    
    let weekStartDate: Date | null = null
    let weekStartValue = currentValue
    let weekTotalEntryFees = 0
    let weekTotalProfit = 0
    let weekTotalExitFees = 0
    let weekTotalDailyRates = 0
    let weekTotalDepositRates = 0
    let weekOperationsCount = 0
    let weekDaysCount = 0
    
    const finalizeWeek = () => {
      if (weekStartDate && weekDaysCount > 0) {
        const weekEndDate = new Date(weekStartDate)
        weekEndDate.setDate(weekEndDate.getDate() + weekDaysCount - 1)
        
        calculations.push({
          weekNumber: calculations.length + 1, // Assign a week number based on the order of push
          startDate: `${weekStartDate.getDate().toString().padStart(2, '0')}/${(weekStartDate.getMonth() + 1).toString().padStart(2, '0')}`,
          endDate: `${weekEndDate.getDate().toString().padStart(2, '0')}/${(weekEndDate.getMonth() + 1).toString().padStart(2, '0')}`,
          daysCount: weekDaysCount,
          operationsCount: weekOperationsCount,
          initialValue: weekStartValue,
          totalEntryFees: weekTotalEntryFees,
          totalProfit: weekTotalProfit,
          totalExitFees: weekTotalExitFees,
          totalDailyRates: weekTotalDailyRates,
          totalDepositRates: weekTotalDepositRates,
          netProfit: weekTotalProfit - weekTotalEntryFees - weekTotalExitFees - weekTotalDailyRates,
          finalValue: currentValue,
          weeklyGrowth: ((currentValue - weekStartValue) / weekStartValue) * 100
        })
      }
      
      // Reset week counters
      weekStartDate = null
      weekStartValue = currentValue
      weekTotalEntryFees = 0
      weekTotalProfit = 0
      weekTotalExitFees = 0
      weekTotalDailyRates = 0
      weekTotalDepositRates = 0
      weekOperationsCount = 0
      weekDaysCount = 0
    }
    
    for (let monthOffset = 0; monthOffset < totalMonths; monthOffset++) {
      const date = new Date(
        Number.parseInt(simulationData.startYear),
        Number.parseInt(simulationData.startMonth) - 1,
        Number.parseInt(simulationData.startDay)
      )
      date.setMonth(date.getMonth() + monthOffset)
      
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
      const operationsPerDay = Number.parseInt(simulationData.operationsPerDay)
      
      // Determinar o dia inicial para este mês
      let startDay = 1
      if (monthOffset === 0) {  // Se for o primeiro mês
        startDay = Number.parseInt(simulationData.startDay)  // Começar no dia selecionado
      }
      
      for (let day = startDay; day <= daysInMonth; day++) {
        const currentDate = new Date(date.getFullYear(), date.getMonth(), day)
        const dayOfWeek = currentDate.getDay() // 0 = Domingo, 1-5 = Seg-Sex, 6 = Sábado
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
        
        // Pular fins de semana se não incluídos
        if (isWeekend && !simulationData.includeWeekends) {
          // Se estávamos no meio de uma semana, finalizar a semana atual
          if (weekStartDate !== null) {
            finalizeWeek()
          }
          continue
        }
        
        // Iniciar nova semana se:
        // 1. Não temos uma semana em andamento, ou
        // 2. É segunda-feira (dayOfWeek === 1)
        if (weekStartDate === null || dayOfWeek === 1) {
          if (weekStartDate !== null) {
            finalizeWeek()
          }
          weekStartDate = new Date(currentDate)
          weekStartValue = currentValue
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
          weekOperationsCount++
        }
        
        // Taxa diária
        const dailyRateAmount = currentValue * (Number.parseFloat(simulationData.dailyRate) / 100)
        currentValue = currentValue - dailyRateAmount
        weekTotalDailyRates += dailyRateAmount
        
        // Taxa de depósito
        const depositRateAmount = dailyRateAmount * (Number.parseFloat(simulationData.depositRate) / 100)
        weekTotalDepositRates += depositRateAmount
        
        // Se é sexta-feira e não incluímos fins de semana, finalizar a semana
        if (dayOfWeek === 5 && !simulationData.includeWeekends) {
          finalizeWeek()
        }
      }
    }
    
    // Finalizar última semana se necessário
    if (weekStartDate !== null) {
      finalizeWeek()
    }
    
    return calculations
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
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Cálculos Semanais</h1>
        
        <div className="grid gap-6">
          {weeklyCalculations.map((week) => (
            <Card key={week.weekNumber} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Semana {week.weekNumber}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {week.startDate} até {week.endDate}
                  </p>
                </div>
                <Badge variant={week.daysCount === 5 ? "default" : "secondary"}>
                  {week.daysCount} {week.daysCount === 1 ? "dia" : "dias"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label>Operações</Label>
                  <p className="text-lg font-medium">{week.operationsCount}</p>
                </div>
                <div>
                  <Label>Valor Inicial</Label>
                  <p className="text-lg font-medium">
                    {simulationData.currency === "EUR" ? "€" : "$"} {week.initialValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <Label>Valor Final</Label>
                  <p className="text-lg font-medium">
                    {simulationData.currency === "EUR" ? "€" : "$"} {week.finalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <Label>Crescimento</Label>
                  <p className={`text-lg font-medium ${week.weeklyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {week.weeklyGrowth >= 0 ? '+' : ''}{week.weeklyGrowth.toFixed(2)}%
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <Label>Taxa de Entrada</Label>
                  <p className="text-sm font-medium text-red-600">
                    - {simulationData.currency === "EUR" ? "€" : "$"} {week.totalEntryFees.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <Label>Lucro Bruto</Label>
                  <p className="text-sm font-medium text-green-600">
                    + {simulationData.currency === "EUR" ? "€" : "$"} {week.totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <Label>Taxa de Saída</Label>
                  <p className="text-sm font-medium text-red-600">
                    - {simulationData.currency === "EUR" ? "€" : "$"} {week.totalExitFees.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <Label>Taxa Diária</Label>
                  <p className="text-sm font-medium text-red-600">
                    - {simulationData.currency === "EUR" ? "€" : "$"} {week.totalDailyRates.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <Label>Taxa de Depósito</Label>
                  <p className="text-sm font-medium text-blue-600">
                    {simulationData.currency === "EUR" ? "€" : "$"} {week.totalDepositRates.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 