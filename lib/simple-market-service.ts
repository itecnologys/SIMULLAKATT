// Serviço de dados simplificado para melhor performance
export interface SimpleMarketData {
  symbol: string
  name: string
  price: number
  changePercent: number
  lastUpdated: string
}

// Dados estáticos para evitar cálculos pesados
const STATIC_DATA: Record<string, SimpleMarketData> = {
  BTC: {
    symbol: "BTC",
    name: "Bitcoin",
    price: 97245.32,
    changePercent: 1.3,
    lastUpdated: new Date().toISOString(),
  },
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    price: 3892.45,
    changePercent: -2.19,
    lastUpdated: new Date().toISOString(),
  },
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 195.89,
    changePercent: 1.21,
    lastUpdated: new Date().toISOString(),
  },
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 384.52,
    changePercent: -0.83,
    lastUpdated: new Date().toISOString(),
  },
  "S&P500": {
    symbol: "S&P500",
    name: "S&P 500",
    price: 5825.0,
    changePercent: 0.4,
    lastUpdated: new Date().toISOString(),
  },
  GOLD: {
    symbol: "GOLD",
    name: "Gold",
    price: 2645.8,
    changePercent: -0.47,
    lastUpdated: new Date().toISOString(),
  },
  "EUR/USD": {
    symbol: "EUR/USD",
    name: "Euro/US Dollar",
    price: 1.0523,
    changePercent: -0.32,
    lastUpdated: new Date().toISOString(),
  },
}

// Função simples para obter dados
export function getMarketData(symbol: string): SimpleMarketData | null {
  return STATIC_DATA[symbol] || null
}

// Função para obter múltiplos dados
export function getMultipleMarketData(symbols: string[]): Record<string, SimpleMarketData> {
  const result: Record<string, SimpleMarketData> = {}

  symbols.forEach((symbol) => {
    const data = STATIC_DATA[symbol]
    if (data) {
      result[symbol] = data
    }
  })

  return result
}

// Função para calcular taxa sugerida simples
export function calculateSuggestedRate(symbol: string): number {
  const data = STATIC_DATA[symbol]
  if (!data) return 2.5

  const volatility = Math.abs(data.changePercent)
  return Math.max(0.5, Math.min(5.0, volatility * 0.8))
}
