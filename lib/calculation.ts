/**
 * Investment calculation utility functions
 */

/**
 * Calculate a single operation with fees
 * @param initialAmount - Starting amount
 * @param entryFeePercent - Entry fee percentage (e.g., 0.1 for 0.1%)
 * @param profitPercent - Profit percentage (e.g., 0.8 for 0.8%)
 * @param exitFeePercent - Exit fee percentage (e.g., 0.1 for 0.1%)
 * @param withdrawalPercent - Withdrawal percentage (e.g., 0.05 for 0.05%)
 * @returns Object containing all calculation details
 */
export function calculateOperation(
  initialAmount: number,
  entryFeePercent: number,
  profitPercent: number,
  exitFeePercent: number,
  withdrawalPercent = 0.05,
) {
  // Usar os valores exatos fornecidos
  const entryFeeRate = entryFeePercent / 100
  const profitRate = profitPercent / 100
  const exitFeeRate = exitFeePercent / 100
  const withdrawalRate = withdrawalPercent / 100

  // Calculate entry fee
  const entryFee = initialAmount * entryFeeRate

  // Amount after entry fee
  const amountAfterEntryFee = initialAmount - entryFee

  // Calculate profit
  const profit = amountAfterEntryFee * profitRate

  // Amount after profit
  const amountAfterProfit = amountAfterEntryFee + profit

  // Calculate exit fee
  const exitFee = amountAfterProfit * exitFeeRate

  // Final amount after exit fee
  const finalAmount = amountAfterProfit - exitFee

  // Calculate withdrawal
  const withdrawal = finalAmount * withdrawalRate

  // Final amount after withdrawal
  const finalAmountAfterWithdrawal = finalAmount - withdrawal

  return {
    initialAmount,
    entryFee,
    amountAfterEntryFee,
    profit,
    amountAfterProfit,
    exitFee,
    finalAmount,
    withdrawal,
    finalAmountAfterWithdrawal,
  }
}

export function generateOperationId(date: Date, operationNumber: number): string {
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `M${day}D${operationNumber}`
}

/**
 * Calculate daily operations with daily fee
 * @param initialAmount - Starting amount for the day
 * @param entryFeePercent - Entry fee percentage
 * @param profitPercent - Profit percentage
 * @param exitFeePercent - Exit fee percentage
 * @param dailyFeePercent - Daily fee percentage
 * @param operationsCount - Number of operations per day
 * @param withdrawalPercent - Withdrawal percentage per operation
 * @returns Object containing all calculation details
 */
export function calculateDailyOperations(
  startDate: Date,
  initialAmount: number,
  entryFeePercent: number,
  profitPercent: number,
  exitFeePercent: number,
  dailyFeePercent: number,
  operationsCount: number,
  includeWeekends: boolean = true
) {
  let currentAmount = initialAmount
  const operations = []
  
  // Gerar operações para o dia
  for (let i = 1; i <= operationsCount; i++) {
    const entryFeeAmount = currentAmount * (entryFeePercent / 100)
    const amountAfterEntryFee = currentAmount - entryFeeAmount
    const profit = amountAfterEntryFee * (profitPercent / 100)
    const amountAfterProfit = amountAfterEntryFee + profit
    const exitFeeAmount = amountAfterProfit * (exitFeePercent / 100)
    const finalAmount = amountAfterProfit - exitFeeAmount
    
    operations.push({
      id: generateOperationId(startDate, i),
      date: startDate.toISOString(),
      initialAmount: currentAmount,
      entryFee: entryFeeAmount,
      profit: profit,
      exitFee: exitFeeAmount,
      finalAmount: finalAmount,
      status: 'Concluída'
    })
    
    currentAmount = finalAmount
  }
  
  // Aplicar taxa diária
  const dailyFeeAmount = currentAmount * (dailyFeePercent / 100)
  currentAmount = currentAmount - dailyFeeAmount
  
  return {
    operations,
    dailyFee: dailyFeeAmount,
    finalAmount: currentAmount
  }
}

/**
 * Calculate monthly projection
 * @param initialAmount - Starting amount for the month
 * @param entryFeePercent - Entry fee percentage
 * @param profitPercent - Profit percentage
 * @param exitFeePercent - Exit fee percentage
 * @param dailyFeePercent - Daily fee percentage
 * @param operationsCount - Number of operations per day
 * @param daysCount - Number of days in the month
 * @param includeWeekends - Whether to include weekends in calculations
 * @param withdrawalPercent - Withdrawal percentage per operation
 * @returns Object containing all calculation details
 */
export function calculateMonthlyProjection(
  initialAmount: number,
  entryFeePercent: number,
  profitPercent: number,
  exitFeePercent: number,
  dailyFeePercent: number,
  operationsCount: number,
  daysCount = 30,
  includeWeekends = true,
  withdrawalPercent = 0.05,
) {
  let currentAmount = initialAmount
  const days = []
  let totalWithdrawals = 0

  for (let i = 0; i < daysCount; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)

    // Skip weekends if not included
    if (!includeWeekends && (date.getDay() === 0 || date.getDay() === 6)) {
      days.push({
        day: i + 1,
        date,
        isWeekend: true,
        initialAmount: currentAmount,
        finalAmount: currentAmount,
        operations: [],
      })
      continue
    }

    const dailyResult = calculateDailyOperations(
      date, // Pass the date object directly
      currentAmount,
      entryFeePercent,
      profitPercent,
      exitFeePercent,
      dailyFeePercent,
      operationsCount,
      includeWeekends,
    )

    totalWithdrawals += dailyResult.dailyFee // Assuming dailyFee is the total withdrawal for the day

    days.push({
      day: i + 1,
      date,
      isWeekend: false,
      initialAmount: currentAmount,
      finalAmount: dailyResult.finalAmount,
      operations: dailyResult.operations,
      totalTransacted: 0, // No totalTransacted in this simplified version
      dailyFee: dailyResult.dailyFee,
      totalWithdrawals: dailyResult.dailyFee, // Assuming dailyFee is the total withdrawal for the day
    })

    currentAmount = dailyResult.finalAmount
  }

  const withdrawals = {
    daily: totalWithdrawals / daysCount,
    weekly: totalWithdrawals / (daysCount / 7),
    biweekly: totalWithdrawals / (daysCount / 14),
    monthly: totalWithdrawals,
  }

  return {
    initialAmount,
    finalAmount: currentAmount,
    days,
    growth: currentAmount - initialAmount,
    growthPercentage: ((currentAmount - initialAmount) / initialAmount) * 100,
    withdrawals,
    totalWithdrawals,
  }
}

/**
 * Calculate full projection for multiple months
 * @param initialAmount - Starting amount
 * @param entryFeePercent - Entry fee percentage
 * @param profitPercent - Profit percentage
 * @param exitFeePercent - Exit fee percentage
 * @param dailyFeePercent - Daily fee percentage
 * @param operationsCount - Number of operations per day
 * @param monthsCount - Number of months to project
 * @param includeWeekends - Whether to include weekends in calculations
 * @param withdrawalPercent - Withdrawal percentage per operation
 * @returns Object containing all calculation details
 */
export function calculateFullProjection(
  initialAmount: number,
  entryFeePercent: number,
  profitPercent: number,
  exitFeePercent: number,
  dailyFeePercent: number,
  operationsCount: number,
  monthsCount = 24,
  includeWeekends = true,
  withdrawalPercent = 0.05,
) {
  console.log("Calculando projeção com valores:", {
    initialAmount,
    entryFeePercent,
    profitPercent,
    exitFeePercent,
    dailyFeePercent,
    operationsCount,
    monthsCount,
    includeWeekends,
    withdrawalPercent,
  })

  let currentAmount = initialAmount
  const months = []
  const totalWithdrawals = {
    daily: 0,
    weekly: 0,
    biweekly: 0,
    monthly: 0,
  }
  let grandTotalWithdrawals = 0

  for (let i = 0; i < monthsCount; i++) {
    const monthResult = calculateMonthlyProjection(
      currentAmount,
      entryFeePercent,
      profitPercent,
      exitFeePercent,
      dailyFeePercent,
      operationsCount,
      30, // Assuming 30 days per month for simplicity
      includeWeekends,
      withdrawalPercent,
    )

    // Acumular retiradas
    totalWithdrawals.daily += monthResult.withdrawals.daily
    totalWithdrawals.weekly += monthResult.withdrawals.weekly
    totalWithdrawals.biweekly += monthResult.withdrawals.biweekly
    totalWithdrawals.monthly += monthResult.withdrawals.monthly
    grandTotalWithdrawals += monthResult.totalWithdrawals

    months.push({
      month: i + 1,
      initialAmount: currentAmount,
      finalAmount: monthResult.finalAmount,
      days: monthResult.days,
      growth: monthResult.growth,
      growthPercentage: monthResult.growthPercentage,
      withdrawals: monthResult.withdrawals,
      totalWithdrawals: monthResult.totalWithdrawals,
    })

    currentAmount = monthResult.finalAmount
  }

  const result = {
    initialAmount,
    finalAmount: currentAmount,
    months,
    totalGrowth: currentAmount - initialAmount,
    totalGrowthPercentage: ((currentAmount - initialAmount) / initialAmount) * 100,
    totalWithdrawals,
    grandTotalWithdrawals,
  }

  console.log("Resultado da projeção:", {
    initialAmount: result.initialAmount,
    finalAmount: result.finalAmount,
    totalGrowth: result.totalGrowth,
    totalGrowthPercentage: result.totalGrowthPercentage,
    grandTotalWithdrawals: result.grandTotalWithdrawals,
  })

  return result
}

/**
 * Convert amount between currencies
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @param exchangeRates - Object with exchange rates
 * @returns Converted amount
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRates: Record<string, number>,
) {
  if (fromCurrency === toCurrency) {
    return amount
  }

  // Convert to USD first (assuming USD is the base currency)
  const amountInUSD = fromCurrency === "USD" ? amount : amount / exchangeRates[fromCurrency]

  // Convert from USD to target currency
  return toCurrency === "USD" ? amountInUSD : amountInUSD * exchangeRates[toCurrency]
}
