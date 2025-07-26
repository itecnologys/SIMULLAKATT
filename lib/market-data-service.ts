interface MarketData {
  symbol: string
  name: string
  currentPrice: number
  change: number
  changePercent: number
  lastUpdated: string
  source: string
}

// Cache de dados de mercado com timestamp
const marketDataCache: Record<string, MarketData> = {}
const lastFetchTime: Record<string, number> = {}
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos em milissegundos

// Dados atualizados para 2025 (simulados)
const currentMarketData: Record<string, MarketData> = {
  BTC: {
    symbol: "BTC",
    name: "Bitcoin",
    currentPrice: 95533.53,
    change: -442.15,
    changePercent: -0.46,
    lastUpdated: new Date().toISOString(),
    source: "CoinMarketCap",
  },
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    currentPrice: 4875.32,
    change: 125.67,
    changePercent: 2.65,
    lastUpdated: new Date().toISOString(),
    source: "CoinMarketCap",
  },
  GOLD: {
    symbol: "GOLD",
    name: "Gold",
    currentPrice: 2320.5,
    change: 15.45,
    changePercent: 0.67,
    lastUpdated: new Date().toISOString(),
    source: "TradingView",
  },
  OIL: {
    symbol: "OIL",
    name: "Crude Oil (WTI)",
    currentPrice: 78.5,
    change: 1.25,
    changePercent: 1.62,
    lastUpdated: new Date().toISOString(),
    source: "TradingView",
  },
  SPX: {
    symbol: "SPX",
    name: "S&P 500",
    currentPrice: 5126.0,
    change: 45.78,
    changePercent: 0.9,
    lastUpdated: new Date().toISOString(),
    source: "Yahoo Finance",
  },
  EURUSD: {
    symbol: "EURUSD",
    name: "Euro/USD",
    currentPrice: 1.0845,
    change: 0.0023,
    changePercent: 0.21,
    lastUpdated: new Date().toISOString(),
    source: "Forex API",
  },
  IBOV: {
    symbol: "IBOV",
    name: "Ibovespa",
    currentPrice: 127850.0,
    change: 1105.23,
    changePercent: 0.87,
    lastUpdated: new Date().toISOString(),
    source: "B3",
  },
  PETR4: {
    symbol: "PETR4",
    name: "Petrobras PN",
    currentPrice: 36.75,
    change: 0.85,
    changePercent: 2.37,
    lastUpdated: new Date().toISOString(),
    source: "B3",
  },
  ITUB4: {
    symbol: "ITUB4",
    name: "Itau Unibanco PN",
    currentPrice: 32.5,
    change: 0.75,
    changePercent: 2.36,
    lastUpdated: new Date().toISOString(),
    source: "B3",
  },
}

// Função para buscar dados de mercado atualizados
export async function getMarketData(symbol: string): Promise<MarketData | null> {
  const now = Date.now()

  // Verificar se temos dados em cache e se ainda são válidos
  if (marketDataCache[symbol] && now - lastFetchTime[symbol] < CACHE_DURATION) {
    return marketDataCache[symbol]
  }

  try {
    // Em um ambiente real, faríamos uma chamada de API aqui
    // const response = await fetch(`https://api.market-data.com/v1/quotes/${symbol}`);
    // const data = await response.json();

    // Simulando uma chamada de API com dados atualizados
    await new Promise((resolve) => setTimeout(resolve, 300)) // Simular latência

    // Usar dados atualizados ou gerar dados aleatórios para símbolos não conhecidos
    const data = currentMarketData[symbol] || {
      symbol,
      name: symbol,
      currentPrice: Math.random() * 1000,
      change: Math.random() * 20 - 10,
      changePercent: Math.random() * 4 - 2,
      lastUpdated: new Date().toISOString(),
      source: "Simulação",
    }

    // Atualizar cache
    marketDataCache[symbol] = data
    lastFetchTime[symbol] = now

    return data
  } catch (error) {
    console.error(`Erro ao buscar dados para ${symbol}:`, error)
    return null
  }
}

// Função para buscar dados de vários símbolos de uma vez
export async function getMultipleMarketData(symbols: string[]): Promise<Record<string, MarketData>> {
  const results: Record<string, MarketData> = {}

  // Em um ambiente real, faríamos uma única chamada de API para todos os símbolos
  // Aqui, vamos buscar um por um para simplicidade
  await Promise.all(
    symbols.map(async (symbol) => {
      const data = await getMarketData(symbol)
      if (data) {
        results[symbol] = data
      }
    }),
  )

  return results
}

// Função para calcular a taxa de lucro sugerida com base em dados históricos reais
export function calculateSuggestedProfitRate(
  symbol: string,
  universe: string,
  timeframe: string,
  volatility: number,
  averageVariation: number,
): number {
  // Base: média de variação absoluta
  let baseRate = Math.max(0.5, averageVariation * 0.8)

  // Ajustes específicos por universo
  if (universe === "crypto") {
    // Criptomoedas têm maior volatilidade
    baseRate = Math.max(1.0, averageVariation * 0.9)

    // Ajustes específicos por ativo
    if (symbol === "BTC") {
      baseRate = Math.max(1.2, averageVariation * 0.95)
    } else if (symbol === "ETH") {
      baseRate = Math.max(1.1, averageVariation * 0.92)
    }
  } else if (universe === "forex") {
    // Forex tem menor volatilidade
    baseRate = Math.max(0.2, averageVariation * 0.7)

    // Pares específicos
    if (symbol === "EURUSD") {
      baseRate = Math.max(0.15, averageVariation * 0.65)
    }
  } else if (universe === "commodities") {
    // Commodities têm volatilidade média
    baseRate = Math.max(0.6, averageVariation * 0.85)

    // Commodities específicas
    if (symbol === "GOLD") {
      baseRate = Math.max(0.5, averageVariation * 0.8)
    } else if (symbol === "OIL") {
      baseRate = Math.max(0.8, averageVariation * 0.88)
    }
  } else if (universe === "stocks") {
    // Ações têm volatilidade variável
    baseRate = Math.max(0.4, averageVariation * 0.75)

    // Ações brasileiras
    if (symbol === "PETR4" || symbol === "ITUB4") {
      baseRate = Math.max(0.6, averageVariation * 0.85)
    }
  } else if (universe === "indices") {
    // Índices têm volatilidade menor
    baseRate = Math.max(0.3, averageVariation * 0.7)

    // Índices específicos
    if (symbol === "IBOV") {
      baseRate = Math.max(0.5, averageVariation * 0.8)
    }
  }

  // Ajustes por timeframe
  if (timeframe === "15m") {
    baseRate *= 0.7 // Timeframes menores têm menor previsibilidade
  } else if (timeframe === "1h") {
    baseRate *= 0.85
  } else if (timeframe === "4h") {
    baseRate *= 1.0 // Referência
  } else if (timeframe === "6h") {
    baseRate *= 1.1
  } else if (timeframe === "24h") {
    baseRate *= 1.2
  } else if (timeframe === "1w") {
    baseRate *= 1.5 // Timeframes maiores permitem maior acumulação
  }

  // Ajuste final com base na volatilidade
  baseRate = baseRate * (1 + volatility * 0.1)

  return Number.parseFloat(baseRate.toFixed(2))
}
