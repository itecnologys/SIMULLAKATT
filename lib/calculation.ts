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
  initialAmount: number,
  entryFeePercent: number,
  profitPercent: number,
  exitFeePercent: number,
  dailyFeePercent: number,
  operationsCount: number,
  withdrawalPercent = 0.05,
) {
  let currentAmount = initialAmount
  const operations = []
  let totalTransacted = 0
  let totalWithdrawals = 0

  // Perform each operation
  for (let i = 0; i < operationsCount; i++) {
    // Cada operação usa o valor final da anterior (após retirada) como inicial
    const operation = calculateOperation(
      currentAmount,
      entryFeePercent,
      profitPercent,
      exitFeePercent,
      withdrawalPercent,
    )

    operations.push(operation)
    totalTransacted += operation.initialAmount
    totalWithdrawals += operation.withdrawal

    // Usar o valor após a retirada para a próxima operação
    currentAmount = operation.finalAmountAfterWithdrawal
  }

  // Calculate daily fee
  const dailyFeeRate = dailyFeePercent / 100
  const dailyFee = totalTransacted * dailyFeeRate

  // Final amount after daily fee
  const finalDailyAmount = currentAmount - dailyFee

  return {
    initialAmount,
    operations,
    totalTransacted,
    totalWithdrawals,
    dailyFee,
    finalDailyAmount,
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
      currentAmount,
      entryFeePercent,
      profitPercent,
      exitFeePercent,
      dailyFeePercent,
      operationsCount,
      withdrawalPercent,
    )

    totalWithdrawals += dailyResult.totalWithdrawals

    days.push({
      day: i + 1,
      date,
      isWeekend: false,
      initialAmount: currentAmount,
      finalAmount: dailyResult.finalDailyAmount,
      operations: dailyResult.operations,
      totalTransacted: dailyResult.totalTransacted,
      dailyFee: dailyResult.dailyFee,
      totalWithdrawals: dailyResult.totalWithdrawals,
    })

    currentAmount = dailyResult.finalDailyAmount
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
