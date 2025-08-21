"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SimulationData {
  initialInvestment: string
  operationsPerDay: string
  profitRate: string
  dailyRate: string
  depositRate: string
  projectionPeriod: string
  entryRate: string
  exitRate: string
  currency: string
  includeWeekends: boolean
  startDay: string
  startMonth: string
  startYear: string
}

interface SimulationResult {
  initialAmount: number
  finalAmount: number
  profitAmount: number
  profitPercentage: number
  dailyAccumulated: number
  depositAccumulated: number
  currency: string
  setupParams: SimulationData
  createdAt: string
}

interface SimulationContextType {
  simulationData: SimulationData
  simulationResult: SimulationResult | null
  accumulatedValues: {
    dailyAccumulated: number
    depositAccumulated: number
  }
  updateSimulationData: (data: Partial<SimulationData>) => void
  runSimulation: () => Promise<void>
  saveSetup: () => void
  loadSavedData: () => void
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined)

export const useSimulation = () => {
  const context = useContext(SimulationContext)
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider')
  }
  return context
}

interface SimulationProviderProps {
  children: ReactNode
}

export const SimulationProvider: React.FC<SimulationProviderProps> = ({ children }) => {
  const [simulationData, setSimulationData] = useState<SimulationData>({
    initialInvestment: "1500",
    operationsPerDay: "4",
    profitRate: "0.7",
    dailyRate: "0.3",
    depositRate: "0.2",
    projectionPeriod: "24",
    entryRate: "0.1",
    exitRate: "0.1",
    currency: "EUR",
    includeWeekends: false,
    startDay: "5",
    startMonth: "4",
    startYear: "2020"
  })

  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)
  const [accumulatedValues, setAccumulatedValues] = useState({
    dailyAccumulated: 0,
    depositAccumulated: 0
  })

  // Carregar dados salvos do localStorage
  const loadSavedData = () => {
    try {
      const savedSetup = localStorage.getItem("currentSetup")
      const lastSimulation = localStorage.getItem("lastSimulation")
      
      if (savedSetup) {
        const setup = JSON.parse(savedSetup)
        setSimulationData({
          initialInvestment: setup.initialInvestment?.toString() || "1500",
          operationsPerDay: setup.operationsPerDay?.toString() || "4",
          profitRate: setup.profitRate?.toString() || "0.7",
          dailyRate: setup.dailyRate?.toString() || "0.3",
          depositRate: setup.depositRate?.toString() || "0.2",
          projectionPeriod: setup.projectionMonths?.toString() || "24",
          entryRate: setup.entryFee?.toString() || "0.1",
          exitRate: setup.exitFee?.toString() || "0.1",
          currency: setup.currency || "EUR",
          includeWeekends: setup.includeWeekends || false,
          startDay: setup.startDay || "5",
          startMonth: setup.startMonth || "4",
          startYear: setup.startYear || "2020"
        })
      }

      if (lastSimulation) {
        const simulation = JSON.parse(lastSimulation)
        setSimulationResult(simulation)
        setAccumulatedValues({
          dailyAccumulated: simulation.dailyAccumulated || 0,
          depositAccumulated: simulation.depositAccumulated || 0
        })
      }
    } catch (error) {
      console.error("Erro ao carregar dados salvos:", error)
    }
  }

  // Salvar configurações
  const saveSetup = () => {
    try {
      const setupData = {
        initialInvestment: Number.parseFloat(simulationData.initialInvestment),
        operationsPerDay: Number.parseInt(simulationData.operationsPerDay),
        profitRate: Number.parseFloat(simulationData.profitRate),
        dailyRate: Number.parseFloat(simulationData.dailyRate),
        depositRate: Number.parseFloat(simulationData.depositRate),
        projectionMonths: Number.parseInt(simulationData.projectionPeriod),
        entryFee: Number.parseFloat(simulationData.entryRate),
        exitFee: Number.parseFloat(simulationData.exitRate),
        currency: simulationData.currency,
        includeWeekends: simulationData.includeWeekends,
        startDay: simulationData.startDay,
        startMonth: simulationData.startMonth,
        startYear: simulationData.startYear,
        startDate: `${simulationData.startYear}-${simulationData.startMonth.padStart(2, "0")}-${simulationData.startDay.padStart(2, "0")}`,
        createdAt: new Date().toISOString()
      }

      localStorage.setItem("currentSetup", JSON.stringify(setupData))
      
      // Disparar evento customizado para notificar outras páginas
      window.dispatchEvent(new CustomEvent('simulationDataUpdated', { 
        detail: { type: 'setup', data: setupData } 
      }))
    } catch (error) {
      console.error("Erro ao salvar:", error)
    }
  }

  // Executar simulação
  const runSimulation = async () => {
    try {
      let currentAmount = Number.parseFloat(simulationData.initialInvestment)
      const totalDays = Number.parseInt(simulationData.projectionPeriod) * 30
      let dailyAccumulated = 0
      let depositAccumulated = 0

      for (let day = 0; day < totalDays; day++) {
        const date = new Date(Number.parseInt(simulationData.startYear), Number.parseInt(simulationData.startMonth) - 1, Number.parseInt(simulationData.startDay) + day)
        const isWeekend = date.getDay() === 0 || date.getDay() === 6
        
        if (isWeekend && !simulationData.includeWeekends) continue
        
        // Operações do dia
        for (let op = 0; op < Number.parseInt(simulationData.operationsPerDay); op++) {
          const entryFeeAmount = currentAmount * (Number.parseFloat(simulationData.entryRate) / 100)
          const amountAfterEntryFee = currentAmount - entryFeeAmount
          const profit = amountAfterEntryFee * (Number.parseFloat(simulationData.profitRate) / 100)
          const amountAfterProfit = amountAfterEntryFee + profit
          const exitFeeAmount = amountAfterProfit * (Number.parseFloat(simulationData.exitRate) / 100)
          currentAmount = amountAfterProfit - exitFeeAmount
        }
        
        // Taxa diária aplicada sobre o montante total
        const dailyFeeAmount = currentAmount * (Number.parseFloat(simulationData.dailyRate) / 100)
        dailyAccumulated += dailyFeeAmount
        currentAmount = currentAmount - dailyFeeAmount
        
        // Taxa de depósito aplicada sobre o valor da taxa diária
        const depositFeeAmount = dailyFeeAmount * (Number.parseFloat(simulationData.depositRate) / 100)
        depositAccumulated += depositFeeAmount
        dailyAccumulated -= depositFeeAmount
      }

      const result: SimulationResult = {
        initialAmount: Number.parseFloat(simulationData.initialInvestment),
        finalAmount: currentAmount,
        profitAmount: currentAmount - Number.parseFloat(simulationData.initialInvestment),
        profitPercentage: ((currentAmount - Number.parseFloat(simulationData.initialInvestment)) / Number.parseFloat(simulationData.initialInvestment)) * 100,
        dailyAccumulated: dailyAccumulated,
        depositAccumulated: depositAccumulated,
        currency: simulationData.currency,
        setupParams: simulationData,
        createdAt: new Date().toISOString()
      }

      setSimulationResult(result)
      setAccumulatedValues({
        dailyAccumulated: dailyAccumulated,
        depositAccumulated: depositAccumulated
      })

      localStorage.setItem("lastSimulation", JSON.stringify(result))
      
      // Disparar evento customizado para notificar outras páginas
      window.dispatchEvent(new CustomEvent('simulationDataUpdated', { 
        detail: { type: 'simulation', data: result } 
      }))

    } catch (error) {
      console.error("Erro na simulação:", error)
    }
  }

  // Atualizar dados da simulação
  const updateSimulationData = (data: Partial<SimulationData>) => {
    setSimulationData(prev => ({ ...prev, ...data }))
  }

  // Carregar dados iniciais
  useEffect(() => {
    loadSavedData()
  }, [])

  // Listener para eventos de atualização
  useEffect(() => {
    const handleSimulationUpdate = (event: CustomEvent) => {
      if (event.detail.type === 'simulation') {
        setSimulationResult(event.detail.data)
        setAccumulatedValues({
          dailyAccumulated: event.detail.data.dailyAccumulated || 0,
          depositAccumulated: event.detail.data.depositAccumulated || 0
        })
      }
    }

    window.addEventListener('simulationDataUpdated', handleSimulationUpdate as EventListener)
    
    return () => {
      window.removeEventListener('simulationDataUpdated', handleSimulationUpdate as EventListener)
    }
  }, [])

  const value: SimulationContextType = {
    simulationData,
    simulationResult,
    accumulatedValues,
    updateSimulationData,
    runSimulation,
    saveSetup,
    loadSavedData
  }

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  )
} 