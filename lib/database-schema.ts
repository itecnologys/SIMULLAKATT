/**
 * This file defines the database schema for the application.
 * In a real app, this would be implemented with Prisma, Drizzle, or similar ORM.
 */

/**
 * User model
 */
export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Simulation model
 */
export interface Simulation {
  id: string
  userId: string
  name: string
  initialAmount: number
  currency: string
  entryFee: number
  exitFee: number
  profitRate: number
  dailyFee: number
  operationsPerDay: number
  projectionMonths: number
  includeWeekends: boolean
  startDate?: Date
  createdAt: Date
  updatedAt: Date
}

/**
 * Simulation Result model
 */
export interface SimulationResult {
  id: string
  simulationId: string
  month: number
  day: number
  initialAmount: number
  finalAmount: number
  totalFees: number
  profit: number
  withdrawals: number
  createdAt: Date
}

/**
 * Operation model
 */
export interface Operation {
  id: string
  simulationResultId: string
  operationNumber: number
  initialAmount: number
  entryFee: number
  profit: number
  exitFee: number
  finalAmount: number
  createdAt: Date
}

/**
 * Currency Rate model
 */
export interface CurrencyRate {
  id: string
  date: Date
  baseCurrency: string
  targetCurrency: string
  rate: number
  createdAt: Date
}

/**
 * Reference Index model
 */
export interface ReferenceIndex {
  id: string
  code: string
  name: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Index Value model
 */
export interface IndexValue {
  id: string
  indexId: string
  date: Date
  value: number
  createdAt: Date
}
