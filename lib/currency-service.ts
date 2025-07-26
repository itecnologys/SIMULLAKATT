// This service would interact with a real currency API in production

interface ExchangeRate {
  code: string
  rate: number
}

interface HistoricalRates {
  date: string
  base: string
  rates: Record<string, number>
}

// Sample historical data - would come from API in production
const sampleHistoricalData: HistoricalRates[] = [
  {
    date: "2023-01-01",
    base: "USD",
    rates: {
      EUR: 0.92,
      GBP: 0.79,
      JPY: 149.82,
      CHF: 0.89,
      AUD: 1.52,
      CAD: 1.36,
      CNY: 7.21,
    },
  },
  {
    date: "2023-02-01",
    base: "USD",
    rates: {
      EUR: 0.93,
      GBP: 0.78,
      JPY: 150.45,
      CHF: 0.88,
      AUD: 1.53,
      CAD: 1.37,
      CNY: 7.19,
    },
  },
  // Add more historical data points as needed
]

/**
 * Get current exchange rates
 * @param base Base currency code
 * @returns Object with exchange rates
 */
export async function getCurrentRates(base = "USD"): Promise<Record<string, number>> {
  // In a real app, this would fetch from an API like:
  // const response = await fetch(`https://api.exchangerate.host/latest?base=${base}`);
  // const data = await response.json();
  // return data.rates;

  // For now, return sample data
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
  return sampleHistoricalData[sampleHistoricalData.length - 1].rates
}

/**
 * Get historical exchange rates for a specific date
 * @param date Date in YYYY-MM-DD format
 * @param base Base currency code
 * @returns Object with exchange rates
 */
export async function getHistoricalRates(date: string, base = "USD"): Promise<Record<string, number>> {
  // In a real app, this would fetch from an API like:
  // const response = await fetch(`https://api.exchangerate.host/${date}?base=${base}`);
  // const data = await response.json();
  // return data.rates;

  // For now, find the closest date in our sample data
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

  // Find the closest date (in a real app, you'd have more precise data)
  const closestData = sampleHistoricalData[0]
  return closestData.rates
}

/**
 * Get historical exchange rates for a date range
 * @param startDate Start date in YYYY-MM-DD format
 * @param endDate End date in YYYY-MM-DD format
 * @param base Base currency code
 * @returns Array of objects with dates and exchange rates
 */
export async function getHistoricalRatesRange(
  startDate: string,
  endDate: string,
  base = "USD",
): Promise<HistoricalRates[]> {
  // In a real app, this would fetch from an API like:
  // const response = await fetch(`https://api.exchangerate.host/timeseries?start_date=${startDate}&end_date=${endDate}&base=${base}`);
  // const data = await response.json();
  // return Object.entries(data.rates).map(([date, rates]) => ({ date, base, rates }));

  // For now, return sample data
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
  return sampleHistoricalData
}

/**
 * Convert amount between currencies using historical rates
 * @param amount Amount to convert
 * @param fromCurrency Source currency code
 * @param toCurrency Target currency code
 * @param date Date for historical rates (optional, defaults to current)
 * @returns Converted amount
 */
export async function convertCurrencyHistorical(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  date?: string,
): Promise<number> {
  // Get rates (current or historical)
  const rates = date ? await getHistoricalRates(date) : await getCurrentRates()

  if (fromCurrency === toCurrency) {
    return amount
  }

  // Convert to USD first (assuming USD is the base currency)
  const amountInUSD = fromCurrency === "USD" ? amount : amount / rates[fromCurrency]

  // Convert from USD to target currency
  return toCurrency === "USD" ? amountInUSD : amountInUSD * rates[toCurrency]
}
