// Tipos para os dados de mercado
export interface SimpleMarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  volume: number
  lastUpdated: string
  source: string
}

// Interface para os provedores de dados
export interface DataProvider {
  name: string
  connect: () => Promise<void>
  disconnect: () => void
  subscribe: (symbols: string[]) => Promise<void>
  unsubscribe: (symbols: string[]) => void
  isConnected: () => boolean
}

// Gerenciador de conexões e assinaturas otimizado
class MarketDataManager {
  private static instance: MarketDataManager
  private providers: Map<string, DataProvider> = new Map()
  private subscriptions: Map<string, Set<string>> = new Map()
  private callbacks: Map<string, Set<(data: any) => void>> = new Map()
  private dataCache: Map<string, any> = new Map()
  private apiKeys: Map<string, string> = new Map()
  private updateThrottle: Map<string, number> = new Map() // Para throttling de updates

  private constructor() {}

  public static getInstance(): MarketDataManager {
    if (!MarketDataManager.instance) {
      MarketDataManager.instance = new MarketDataManager()
    }
    return MarketDataManager.instance
  }

  public setApiKey(provider: string, apiKey: string): void {
    this.apiKeys.set(provider, apiKey)
  }

  public registerProvider(name: string, provider: DataProvider): void {
    this.providers.set(name, provider)
  }

  public getCachedData(symbol: string): any | undefined {
    return this.dataCache.get(symbol)
  }

  public getAllCachedData(): Map<string, any> {
    return new Map(this.dataCache)
  }

  // Throttled subscribe para evitar muitas chamadas
  public async subscribe(symbol: string, callback: (data: any) => void): Promise<void> {
    if (!this.callbacks.has(symbol)) {
      this.callbacks.set(symbol, new Set())
    }
    this.callbacks.get(symbol)!.add(callback)

    const cachedData = this.dataCache.get(symbol)
    if (cachedData) {
      callback(cachedData)
    }

    const provider = this.selectProviderForSymbol(symbol)
    if (!provider) return

    if (!this.subscriptions.has(symbol)) {
      this.subscriptions.set(symbol, new Set())
    }

    const providerName = this.getProviderName(provider)
    if (providerName && !this.subscriptions.get(symbol)!.has(providerName)) {
      this.subscriptions.get(symbol)!.add(providerName)

      if (!provider.isConnected()) {
        await provider.connect()
      }
      await provider.subscribe([symbol])
    }
  }

  public unsubscribe(symbol: string, callback: (data: any) => void): void {
    if (this.callbacks.has(symbol)) {
      this.callbacks.get(symbol)!.delete(callback)

      if (this.callbacks.get(symbol)!.size === 0) {
        this.callbacks.delete(symbol)

        if (this.subscriptions.has(symbol)) {
          const providers = this.subscriptions.get(symbol)!
          providers.forEach((providerName) => {
            const provider = this.providers.get(providerName)
            if (provider && provider.isConnected()) {
              provider.unsubscribe([symbol])
            }
          })
          this.subscriptions.delete(symbol)
        }
      }
    }
  }

  // Throttled update para evitar muitas atualizações
  public updateData(symbol: string, data: any): void {
    const now = Date.now()
    const lastUpdate = this.updateThrottle.get(symbol) || 0

    // Throttle: máximo 1 update por segundo por símbolo
    if (now - lastUpdate < 1000) {
      return
    }

    this.updateThrottle.set(symbol, now)
    this.dataCache.set(symbol, data)

    if (this.callbacks.has(symbol)) {
      this.callbacks.get(symbol)!.forEach((callback) => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in callback for symbol ${symbol}:`, error)
        }
      })
    }
  }

  private selectProviderForSymbol(symbol: string): DataProvider | undefined {
    if (symbol.includes("/")) return this.providers.get("forex")
    if (["BTC", "ETH", "BNB", "SOL", "ADA"].includes(symbol)) return this.providers.get("crypto")
    if (["GOLD", "OIL", "SILVER", "NATURAL_GAS"].includes(symbol)) return this.providers.get("commodities")
    if (["S&P500", "NASDAQ", "DOW", "FTSE100", "DAX", "IBOV"].includes(symbol)) return this.providers.get("indices")
    return this.providers.get("stocks")
  }

  private getProviderName(provider: DataProvider): string | undefined {
    for (const [name, p] of this.providers.entries()) {
      if (p === provider) return name
    }
    return undefined
  }

  public getApiKey(provider: string): string | undefined {
    return this.apiKeys.get(provider)
  }
}

export const marketDataManager = MarketDataManager.getInstance()

// Provedor simulado otimizado
export class SimulatedDataProvider implements DataProvider {
  private connected = false
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private baseData: Map<string, any> = new Map()

  constructor() {
    this.initializeBaseData()
  }

  private initializeBaseData(): void {
    const now = new Date()

    // Dados base otimizados - apenas os essenciais
    const baseAssets = [
      { symbol: "BTC", name: "Bitcoin", price: 97245.32, change: 1247.89, changePercent: 1.3 },
      { symbol: "ETH", name: "Ethereum", price: 3892.45, change: -87.23, changePercent: -2.19 },
      { symbol: "AAPL", name: "Apple Inc.", price: 195.89, change: 2.34, changePercent: 1.21 },
      { symbol: "MSFT", name: "Microsoft Corporation", price: 384.52, change: -3.21, changePercent: -0.83 },
      { symbol: "S&P500", name: "S&P 500", price: 5825.0, change: 23.45, changePercent: 0.4 },
      { symbol: "NASDAQ", name: "NASDAQ Composite", price: 19234.56, change: -45.23, changePercent: -0.23 },
      { symbol: "GOLD", name: "Gold", price: 2645.8, change: -12.45, changePercent: -0.47 },
      { symbol: "EUR/USD", name: "Euro/US Dollar", price: 1.0523, change: -0.0034, changePercent: -0.32 },
    ]

    baseAssets.forEach((asset) => {
      this.baseData.set(asset.symbol, {
        ...asset,
        high: asset.price * 1.02,
        low: asset.price * 0.98,
        volume: Math.floor(Math.random() * 50000000),
        lastUpdated: now.toISOString(),
        source: "Simulação",
      })
    })
  }

  async connect(): Promise<void> {
    this.connected = true
  }

  disconnect(): void {
    this.connected = false
    this.intervals.forEach((interval) => clearInterval(interval))
    this.intervals.clear()
  }

  async subscribe(symbols: string[]): Promise<void> {
    for (const symbol of symbols) {
      if (!this.baseData.has(symbol)) {
        this.baseData.set(symbol, {
          symbol,
          name: symbol,
          price: Math.random() * 1000 + 50,
          change: Math.random() * 20 - 10,
          changePercent: Math.random() * 4 - 2,
          high: 0,
          low: 0,
          volume: Math.random() * 10000000,
          lastUpdated: new Date().toISOString(),
          source: "Simulação",
        })
      }

      const initialData = this.baseData.get(symbol)!
      marketDataManager.updateData(symbol, initialData)

      // Intervalo mais longo para reduzir carga
      const interval = setInterval(() => {
        const baseData = this.baseData.get(symbol)!
        const maxVariation = this.getMaxVariation(symbol)
        const priceChange = baseData.price * (Math.random() * maxVariation * 2 - maxVariation)
        const newPrice = Math.max(0.01, baseData.price + priceChange)

        const newData: any = {
          ...baseData,
          price: newPrice,
          change: priceChange,
          changePercent: (priceChange / baseData.price) * 100,
          high: Math.max(baseData.high, newPrice),
          low: baseData.low === 0 ? newPrice : Math.min(baseData.low, newPrice),
          lastUpdated: new Date().toISOString(),
        }

        this.baseData.set(symbol, newData)
        marketDataManager.updateData(symbol, newData)
      }, 5000) // 5 segundos em vez de 3

      this.intervals.set(symbol, interval)
    }
  }

  private getMaxVariation(symbol: string): number {
    if (symbol.includes("/")) return 0.001
    if (["BTC", "ETH", "BNB", "SOL", "ADA"].includes(symbol)) return 0.02
    if (["GOLD", "OIL", "SILVER"].includes(symbol)) return 0.01
    return 0.002
  }

  unsubscribe(symbols: string[]): void {
    for (const symbol of symbols) {
      const interval = this.intervals.get(symbol)
      if (interval) {
        clearInterval(interval)
        this.intervals.delete(symbol)
      }
    }
  }

  isConnected(): boolean {
    return this.connected
  }
}

// Funções de inicialização otimizadas
export async function initializeMarketDataService(): Promise<void> {
  // Não faz nada - dados são estáticos
  return Promise.resolve()
}

export function subscribeToMarketData(symbol: string, callback: (data: any) => void): () => void {
  // Chama o callback imediatamente com dados estáticos
  const data = require("./simple-market-service").getMarketData(symbol)
  if (data) {
    callback(data)
  }

  // Retorna função vazia para unsubscribe
  return () => {}
}

export async function getMultipleMarketData(symbols: string[]): Promise<Record<string, any>> {
  const results: Record<string, any> = {}

  for (const symbol of symbols) {
    const cachedData = marketDataManager.getCachedData(symbol)
    if (cachedData) {
      results[symbol] = cachedData
    }
  }

  return results
}
