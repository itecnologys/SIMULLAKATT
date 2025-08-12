"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSimulation } from "@/contexts/SimulationContext"
import OperationsNav from "@/components/OperationsNav"

interface Operation {
  id: string
  date: string
  initialValue: number
  entryFee: number
  profit: number
  exitFee: number
  finalValue: number
  status: 'Concluída' | 'Em andamento' | 'Pendente'
}

export default function OperationsPage() {
  const { simulationData, simulationResult } = useSimulation()
  const [operations, setOperations] = useState<Operation[]>([])

  useEffect(() => {
    if (simulationResult) {
      generateOperations()
    }
  }, [simulationResult, simulationData])

  const generateOperations = () => {
    const ops: Operation[] = []
    let currentValue = Number.parseFloat(simulationData.initialInvestment)
    const totalMonths = Number.parseInt(simulationData.projectionPeriod)
    
    for (let month = 1; month <= totalMonths; month++) {
      const date = new Date(Number.parseInt(simulationData.startYear), Number.parseInt(simulationData.startMonth) - 1 + month, Number.parseInt(simulationData.startDay))
      
      // Calcular operações do mês
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
      const operationsPerDay = Number.parseInt(simulationData.operationsPerDay)
      
      for (let day = 1; day <= daysInMonth; day++) {
        const isWeekend = new Date(date.getFullYear(), date.getMonth(), day).getDay() === 0 || 
                         new Date(date.getFullYear(), date.getMonth(), day).getDay() === 6
        
        if (isWeekend && !simulationData.includeWeekends) continue
        
        for (let op = 1; op <= operationsPerDay; op++) {
          const entryFeeAmount = currentValue * (Number.parseFloat(simulationData.entryRate) / 100)
          const amountAfterEntryFee = currentValue - entryFeeAmount
          const profit = amountAfterEntryFee * (Number.parseFloat(simulationData.profitRate) / 100)
          const amountAfterProfit = amountAfterEntryFee + profit
          const exitFeeAmount = amountAfterProfit * (Number.parseFloat(simulationData.exitRate) / 100)
          const finalValue = amountAfterProfit - exitFeeAmount
          
          ops.push({
            id: `M${month}D${day}O${op}`,
            date: `${day.toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
            initialValue: currentValue,
            entryFee: entryFeeAmount,
            profit: profit,
            exitFee: exitFeeAmount,
            finalValue: finalValue,
            status: 'Concluída'
          })
          
          currentValue = finalValue
        }
      }
    }
    
    setOperations(ops)
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
          <h1 className="text-3xl font-bold text-gray-900">Operações Detalhadas</h1>
          <p className="text-gray-600 mt-2">
            Detalhamento de cada operação - {operations.length} operações encontradas
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Inicial
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taxa Entrada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lucro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taxa Saída
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Final
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {operations.slice(0, 24).map((operation) => (
                    <tr key={operation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {operation.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {operation.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(operation.initialValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        -{formatCurrency(operation.entryFee)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        +{formatCurrency(operation.profit)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        -{formatCurrency(operation.exitFee)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(operation.finalValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant={operation.status === 'Concluída' ? 'default' : 'secondary'}
                          className={operation.status === 'Concluída' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {operation.status}
                        </Badge>
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