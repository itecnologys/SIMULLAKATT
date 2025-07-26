// Serviço para obter dados históricos de cotações

interface ExchangeRate {
  date: string
  usd: number
  eur: number
  gbp: number
  brl: number
  btc: number
}

interface CandlestickData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

// Função para obter taxas de câmbio históricas para uma data específica
export async function getHistoricalRates(date: string): Promise<ExchangeRate> {
  // Em um app real, isso buscaria de uma API como Alpha Vantage, CoinGecko, etc.
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simular atraso de API

  // Dados simulados para demonstração
  // Normalmente, você usaria uma API como:
  // - https://www.alphavantage.co/ para moedas tradicionais
  // - https://www.coingecko.com/en/api para criptomoedas

  // Simulando variação baseada na data
  const dateObj = new Date(date)
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth()
  const day = dateObj.getDate()

  // Criar variação baseada na data
  const seed = year * 10000 + month * 100 + day
  const random = (seed % 100) / 1000 // Variação de até 10%

  // Valores base aproximados para 2020
  const baseRates = {
    usd: 1.0,
    eur: 0.89 + random,
    gbp: 0.76 + random,
    brl: 5.2 + random * 5,
    btc: 0.0001 - random * 0.00005, // BTC em relação ao USD (inverso)
  }

  return {
    date,
    ...baseRates,
  }
}

// Função para obter dados históricos de candlestick para um período
export async function getHistoricalCandlestickData(
  symbol: string,
  startDate: string,
  endDate: string,
  interval: "daily" | "weekly" | "monthly" = "daily",
): Promise<CandlestickData[]> {
  // Em um app real, isso buscaria de uma API como Alpha Vantage, Yahoo Finance, etc.
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simular atraso de API

  const start = new Date(startDate)
  const end = new Date(endDate)
  const data: CandlestickData[] = []

  // Determinar o incremento baseado no intervalo
  let increment = 1
  if (interval === "weekly") increment = 7
  if (interval === "monthly") increment = 30

  // Gerar dados simulados de candlestick
  const currentDate = new Date(start)
  let previousClose = getBasePrice(symbol)

  while (currentDate <= end) {
    // Gerar variação aleatória baseada na data
    const seed = currentDate.getFullYear() * 10000 + currentDate.getMonth() * 100 + currentDate.getDate()
    const randomFactor = ((seed % 100) / 100) * 0.1 // Variação de até 10%

    // Calcular valores do candle
    const open = previousClose
    const change = open * randomFactor * (Math.random() > 0.5 ? 1 : -1)
    const close = open + change
    const high = Math.max(open, close) + Math.abs(change) * 0.5 * Math.random()
    const low = Math.min(open, close) - Math.abs(change) * 0.5 * Math.random()
    const volume = Math.floor(1000000 + Math.random() * 9000000)

    data.push({
      time: currentDate.toISOString().split("T")[0],
      open,
      high,
      low,
      close,
      volume,
    })

    // Preparar para o próximo candle
    previousClose = close

    // Avançar para a próxima data
    currentDate.setDate(currentDate.getDate() + increment)
  }

  return data
}

// Função auxiliar para obter preço base para diferentes símbolos
function getBasePrice(symbol: string): number {
  switch (symbol.toUpperCase()) {
    case "EUR/USD":
      return 1.12
    case "GBP/USD":
      return 1.31
    case "USD/BRL":
      return 5.2
    case "BTC/USD":
      return 9000
    default:
      return 100
  }
}

// Função para obter dados comparativos entre moedas e investimento
export async function getComparisonData(
  initialInvestment: number,
  startDate: string,
  endDate: string,
  baseCurrency = "USD",
): Promise<any[]> {
  // Em um app real, isso buscaria de uma API
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simular atraso de API

  const start = new Date(startDate)
  const end = new Date(endDate)
  const data: any[] = []

  // Gerar dados simulados de comparação
  const currentDate = new Date(start)

  // Valores iniciais
  const initialRates = {
    USD: 1.0,
    EUR: 0.89,
    GBP: 0.76,
    BRL: 5.2,
    BTC: 0.0001,
  }

  // Converter investimento inicial para USD
  const investmentInUSD = baseCurrency === "USD" ? initialInvestment : initialInvestment / initialRates[baseCurrency]

  // Gerar dados para cada data
  while (currentDate <= end) {
    // Gerar variação aleatória baseada na data
    const daysPassed = Math.floor((currentDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const growthFactor = 1 + daysPassed * 0.001 // Crescimento de 0.1% por dia

    // Simular variações nas taxas
    const usdRate = 1.0
    const eurRate = initialRates.EUR * (1 + Math.sin(daysPassed * 0.1) * 0.05)
    const gbpRate = initialRates.GBP * (1 + Math.cos(daysPassed * 0.1) * 0.05)
    const brlRate = initialRates.BRL * (1 + Math.sin(daysPassed * 0.05) * 0.1)
    const btcRate = initialRates.BTC * (1 + Math.cos(daysPassed * 0.05) * 0.2)

    // Calcular valores
    const investmentValue = investmentInUSD * growthFactor

    data.push({
      date: currentDate.toISOString().split("T")[0],
      investment: investmentValue,
      usd: investmentValue,
      eur: investmentValue / eurRate,
      gbp: investmentValue / gbpRate,
      brl: investmentValue / brlRate,
      btc: investmentValue / btcRate,
      rates: {
        usd: usdRate,
        eur: eurRate,
        gbp: gbpRate,
        brl: brlRate,
        btc: btcRate,
      },
    })

    // Avançar para a próxima data
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return data
}
