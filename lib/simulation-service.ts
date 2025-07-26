// This service would interact with your API/database in a real application

interface SimulationResult {
  id: string
  date: string
  timestamp: string
  initialAmount: number
  finalAmount: number
  profitAmount: number
  profitPercentage: number
  operationsCount: number
  totalFees: number
  currency: string
  setupParams?: SimulationSetup
  transactions?: Transaction[]
  historicalRates?: HistoricalRates
  monthlyData?: MonthlyData[]
  createdAt: string
  updatedAt: string
}

interface SimulationSetup {
  id?: string
  initialInvestment: number
  currency: string
  entryFee: number
  exitFee: number
  profitRate: number
  dailyFee: number
  operationsPerDay: number
  projectionMonths: number
  includeWeekends: boolean
  startDate?: string
  name?: string
  createdAt: string
  updatedAt: string
}

interface Transaction {
  id: string
  date: string
  timestamp: string
  type: "deposit" | "withdrawal"
  amount: number
  balanceBefore: number
  balanceAfter: number
  operationId?: string
  createdAt: string
}

interface HistoricalRates {
  date: string
  timestamp: string
  usd: number
  eur: number
  gbp: number
  brl: number
  btc: number
}

interface MonthlyData {
  month: number
  timestamp: string
  initialAmount: number
  finalAmount: number
  growth: number
  growthPercentage: number
  days: DailyData[]
  totalOperations?: number;
  totalTransacted?: number;
  totalFees?: number;
}

interface DailyData {
  day: number
  date: Date
  timestamp: string
  isWeekend: boolean
  initialAmount: number
  finalAmount: number
  operations: OperationData[]
  totalTransacted?: number
  dailyFee?: number
}

interface OperationData {
  id: string
  timestamp: string
  initialAmount: number
  entryFee: number
  amountAfterEntryFee: number
  profit: number
  amountAfterProfit: number
  exitFee: number
  finalAmount: number
}

// Simplified storage handling
function getStoredSimulations(): SimulationResult[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("simullakt_simulations")
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    return []
  }
}

function getStoredSetups(): SimulationSetup[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("simullakt_setups")
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    return []
  }
}

// Save a new simulation
export async function saveSimulation(
  simulation: Omit<SimulationResult, "id" | "date" | "timestamp" | "createdAt" | "updatedAt">,
): Promise<SimulationResult> {
  const now = new Date().toISOString()
  const newSimulation: SimulationResult = {
    ...simulation,
    id: `sim-${Date.now()}`,
    date: now,
    timestamp: now,
    createdAt: now,
    updatedAt: now,
    transactions: simulation.transactions || [],
  }

  // Add timestamps to monthly data
  if (newSimulation.monthlyData) {
    newSimulation.monthlyData = newSimulation.monthlyData.map((month, index) => ({
      ...month,
      timestamp: new Date(
        Date.now() - (newSimulation.monthlyData!.length - index) * 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      days: month.days.map((day, dayIndex) => ({
        ...day,
        timestamp: new Date(
          Date.now() -
            (newSimulation.monthlyData!.length - index) * 30 * 24 * 60 * 60 * 1000 -
            (month.days.length - dayIndex) * 24 * 60 * 60 * 1000,
        ).toISOString(),
        operations: day.operations.map((op, opIndex) => ({
          ...op,
          id: `op-${Date.now()}-${index}-${dayIndex}-${opIndex}`,
          timestamp: new Date(
            Date.now() -
              (newSimulation.monthlyData!.length - index) * 30 * 24 * 60 * 60 * 1000 -
              (month.days.length - dayIndex) * 24 * 60 * 60 * 1000 -
              opIndex * 60 * 60 * 1000,
          ).toISOString(),
        })),
      })),
    }))
  }

  // Add timestamp to historical rates
  if (newSimulation.historicalRates) {
    newSimulation.historicalRates.timestamp = now
  }

  // Get current simulations and add the new one at the beginning
  const simulations = getStoredSimulations()
  simulations.unshift(newSimulation)

  // Save to localStorage
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("simullakt_simulations", JSON.stringify(simulations))
    }
  } catch (error) {
    // Handle error silently
  }

  return newSimulation
}

// Get the latest simulation
export async function getLatestSimulation(): Promise<SimulationResult | null> {
  const simulations = getStoredSimulations()
  return simulations.length > 0 ? simulations[0] : null
}

// Get all simulations
export async function getAllSimulations(): Promise<SimulationResult[]> {
  return getStoredSimulations()
}

// Get filtered simulations
export async function getFilteredSimulations(filter = "all"): Promise<SimulationResult[]> {
  const simulations = getStoredSimulations()

  if (filter === "all") return simulations

  const now = new Date()
  const filterDate = new Date()

  if (filter === "day") {
    filterDate.setDate(now.getDate() - 1)
  } else if (filter === "week") {
    filterDate.setDate(now.getDate() - 7)
  } else if (filter === "month") {
    filterDate.setMonth(now.getMonth() - 1)
  } else if (filter === "year") {
    filterDate.setFullYear(now.getFullYear() - 1)
  }

  return simulations.filter((sim) => new Date(sim.timestamp) >= filterDate)
}

// Get simulation by ID
export async function getSimulationById(id: string): Promise<SimulationResult | null> {
  const simulations = getStoredSimulations()
  return simulations.find((sim) => sim.id === id) || null
}

// Save setup parameters
export async function saveSetup(
  setupParams: Omit<SimulationSetup, "id" | "createdAt" | "updatedAt">,
): Promise<boolean> {
  try {
    const now = new Date().toISOString()
    const setups = getStoredSetups()
    const setupWithTimestamp: SimulationSetup = {
      ...setupParams,
      id: `setup-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }

    // Remove existing setup with same name if exists
    const existingIndex = setups.findIndex((s) => s.name === setupParams.name)
    if (existingIndex >= 0) {
      setups.splice(existingIndex, 1)
    }

    setups.unshift(setupWithTimestamp)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("simullakt_setups", JSON.stringify(setups))
      localStorage.setItem("simullakt_current_setup", JSON.stringify(setupWithTimestamp))
    }

    return true
  } catch (error) {
    return false
  }
}

// Load current setup
export async function loadCurrentSetup(): Promise<SimulationSetup | null> {
  if (typeof window === "undefined") return null

  try {
    const setup = localStorage.getItem("simullakt_current_setup")
    return setup ? JSON.parse(setup) : null
  } catch (error) {
    return null
  }
}

// Load all saved setups
export async function loadAllSetups(): Promise<SimulationSetup[]> {
  return getStoredSetups()
}

// Add transaction to a simulation
export async function addTransaction(
  simulationId: string,
  type: "deposit" | "withdrawal",
  amount: number,
  operationId = "001",
): Promise<SimulationResult | null> {
  const simulations = getStoredSimulations()
  const simulationIndex = simulations.findIndex((sim) => sim.id === simulationId)

  if (simulationIndex === -1) return null

  const simulation = simulations[simulationIndex]
  const now = new Date().toISOString()

  const balanceBefore = simulation.finalAmount
  let balanceAfter = type === "deposit" ? balanceBefore + amount : balanceBefore - amount

  // Prevent negative balance
  if (balanceAfter < 0) {
    balanceAfter = 0
    amount = balanceBefore
  }

  const transaction: Transaction = {
    id: `trans-${Date.now()}`,
    date: now,
    timestamp: now,
    type,
    amount,
    balanceBefore,
    balanceAfter,
    operationId,
    createdAt: now,
  }

  // Add transaction
  if (!simulation.transactions) {
    simulation.transactions = []
  }
  simulation.transactions.push(transaction)

  // Update simulation timestamp
  simulation.updatedAt = now

  // Recalculate simulation from the operation point
  recalculateSimulationFromOperation(simulation, operationId, type === "deposit" ? amount : -amount)

  // Update simulation totals
  updateSimulationTotals(simulation)

  // Save to localStorage
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("simullakt_simulations", JSON.stringify(simulations))
    }
  } catch (error) {
    // Handle error silently
  }

  return simulation
}

// Function to recalculate simulation from a specific operation
function recalculateSimulationFromOperation(simulation: SimulationResult, operationId: string, amountChange: number) {
  if (!simulation.monthlyData) return

  let operationFound = false
  let currentAmount = 0
  let dayCounter = 0

  // Loop through all months and days to find the operation and recalculate
  for (let monthIndex = 0; monthIndex < simulation.monthlyData.length; monthIndex++) {
    const month = simulation.monthlyData[monthIndex]

    if (!month.days) continue

    for (let dayIndex = 0; dayIndex < month.days.length; dayIndex++) {
      dayCounter++
      const day = month.days[dayIndex]

      // Check if we found the operation ID
      if (String(dayCounter).padStart(3, "0") === operationId) {
        operationFound = true

        // Apply the change to the day's initial amount
        day.initialAmount += amountChange
        currentAmount = day.initialAmount

        // Recalculate the day's operations
        recalculateDayOperations(day, simulation.setupParams)
      } else if (operationFound) {
        // For subsequent days, use the final amount of the previous day as initial
        day.initialAmount = currentAmount
        recalculateDayOperations(day, simulation.setupParams)
      }

      // Update current amount for the next day
      if (day.finalAmount) {
        currentAmount = day.finalAmount
      }
    }

    // Update month totals
    if (operationFound) {
      updateMonthTotals(month)
    }
  }
}

// Function to recalculate a day's operations
function recalculateDayOperations(day: DailyData, setupParams: SimulationSetup | undefined) {
  if (!day || !setupParams) return;

  const { entryFee, exitFee, profitRate, dailyFee, operationsPerDay } = setupParams;
  let currentAmount = day.initialAmount;
  const operations: OperationData[] = [];
  let totalTransacted = 0;

  // Perform each operation
  for (let i = 0; i < operationsPerDay; i++) {
    const operationTimestamp = new Date(day.timestamp);
    operationTimestamp.setHours(9 + i * 2); // Distribuir operações entre 9h e 17h
    
    // Calculate fees and profit
    const entryFeeAmount = currentAmount * (entryFee / 100);
    const amountAfterEntryFee = currentAmount - entryFeeAmount;
    const profit = amountAfterEntryFee * (profitRate / 100);
    const amountAfterProfit = amountAfterEntryFee + profit;
    const exitFeeAmount = amountAfterProfit * (exitFee / 100);
    const finalAmount = amountAfterProfit - exitFeeAmount;

    // Add operation
    operations.push({
      id: `op-${day.day}-${i + 1}`,
      timestamp: operationTimestamp.toISOString(),
      initialAmount: currentAmount,
      entryFee: entryFeeAmount,
      amountAfterEntryFee,
      profit,
      amountAfterProfit,
      exitFee: exitFeeAmount,
      finalAmount,
    });

    totalTransacted += currentAmount;
    currentAmount = finalAmount;
  }

  // Calculate daily fee
  const dailyFeeAmount = totalTransacted * (dailyFee / 100);
  const finalDailyAmount = currentAmount - dailyFeeAmount;

  // Update the day with all calculated values
  day.operations = operations;
  day.totalTransacted = totalTransacted;
  day.dailyFee = dailyFeeAmount;
  day.finalAmount = finalDailyAmount;
  day.initialAmount = operations[0]?.initialAmount || day.initialAmount; // Ensure initial amount is set
}

// Function to update month totals
function updateMonthTotals(month: MonthlyData) {
  if (!month.days || month.days.length === 0) return;

  // Ensure all days have proper timestamps
  month.days.forEach((day, index) => {
    if (!day.timestamp) {
      const date = new Date();
      date.setDate(date.getDate() - (month.days.length - index));
      day.timestamp = date.toISOString();
    }
  });

  // Sort days by timestamp
  month.days.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Calculate month totals
  const initialAmount = month.days[0].initialAmount;
  const finalAmount = month.days[month.days.length - 1].finalAmount;
  const growth = finalAmount - initialAmount;
  const growthPercentage = initialAmount > 0 ? (growth / initialAmount) * 100 : 0;

  // Update month data
  month.initialAmount = initialAmount;
  month.finalAmount = finalAmount;
  month.growth = growth;
  month.growthPercentage = growthPercentage;
  month.timestamp = month.days[0].timestamp;

  // Calculate additional metrics
  let totalOperations = 0;
  let totalTransacted = 0;
  let totalFees = 0;

  month.days.forEach(day => {
    if (day.operations) {
      totalOperations += day.operations.length;
      day.operations.forEach(op => {
        totalTransacted += op.initialAmount;
        totalFees += (op.entryFee || 0) + (op.exitFee || 0);
      });
    }
    totalFees += day.dailyFee || 0;
  });

  // Add these metrics to the month data
  month.totalOperations = totalOperations;
  month.totalTransacted = totalTransacted;
  month.totalFees = totalFees;
}

// Function to update simulation totals
function updateSimulationTotals(simulation: SimulationResult) {
  if (!simulation.monthlyData || simulation.monthlyData.length === 0) return

  const initialAmount = simulation.monthlyData[0].initialAmount
  const finalAmount = simulation.monthlyData[simulation.monthlyData.length - 1].finalAmount

  simulation.initialAmount = initialAmount
  simulation.finalAmount = finalAmount
  simulation.profitAmount = finalAmount - initialAmount
  simulation.profitPercentage = ((finalAmount - initialAmount) / initialAmount) * 100
  simulation.updatedAt = new Date().toISOString()

  // Recalculate total fees
  let totalFees = 0
  simulation.monthlyData.forEach((month) => {
    if (month.days) {
      month.days.forEach((day: DailyData) => {
        if (day.operations) {
          day.operations.forEach((op: OperationData) => {
            totalFees += (op.entryFee || 0) + (op.exitFee || 0)
          })
        }
        totalFees += day.dailyFee || 0
      })
    }
  })

  simulation.totalFees = totalFees
}

// Clear all simulations (for testing)
export async function clearSimulations(): Promise<boolean> {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("simullakt_simulations")
    }
    return true
  } catch (error) {
    return false
  }
}

// Get historical exchange rates
export async function getHistoricalExchangeRates(date: string): Promise<HistoricalRates> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Generate random rates based on date
  const dateObj = new Date(date)
  const seed = dateObj.getFullYear() * 10000 + dateObj.getMonth() * 100 + dateObj.getDate()
  const random = (seed % 100) / 1000

  return {
    date,
    timestamp: new Date().toISOString(),
    usd: 1.0,
    eur: 0.89 + random,
    gbp: 0.76 + random,
    brl: 5.2 + random * 5,
    btc: 0.0001 - random * 0.00005,
  }
}

// Export loadCurrentSetup as loadSetup for compatibility
export { loadCurrentSetup as loadSetup }
