import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Tipos para os dados de mercado
type MarketData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  category: string;
  lastUpdate: string;
};

// Cache para armazenar os últimos dados
let dataCache: { [key: string]: MarketData } = {};
let lastUpdate: { [key: string]: number } = {};

// Configuração dos índices e seus detalhes
const MARKET_INDICES = {
  // Índices de Ações
  '^GSPC': { name: 'S&P 500', category: 'Equity Indexes' },
  '^IXIC': { name: 'NASDAQ', category: 'Equity Indexes' },
  '^DJI': { name: 'Dow Jones', category: 'Equity Indexes' },
  '^FTSE': { name: 'FTSE 100', category: 'Equity Indexes' },
  '^N225': { name: 'Nikkei 225', category: 'Equity Indexes' },
  '^GDAXI': { name: 'DAX', category: 'Equity Indexes' },
  '^BVSP': { name: 'IBOVESPA', category: 'Equity Indexes' },
  
  // Forex
  'EUR=X': { name: 'EUR/USD', category: 'Forex' },
  'GBP=X': { name: 'GBP/USD', category: 'Forex' },
  'JPY=X': { name: 'USD/JPY', category: 'Forex' },
  
  // Commodities
  'GC=F': { name: 'Gold', category: 'Commodities' },
  'SI=F': { name: 'Silver', category: 'Commodities' },
  'CL=F': { name: 'Crude Oil', category: 'Commodities' },
  
  // Crypto (via Binance)
  'BTCUSDT': { name: 'Bitcoin', category: 'Crypto' },
  'ETHUSDT': { name: 'Ethereum', category: 'Crypto' },
  'BNBUSDT': { name: 'Binance Coin', category: 'Crypto' },
  'SOLUSDT': { name: 'Solana', category: 'Crypto' },
  'ADAUSDT': { name: 'Cardano', category: 'Crypto' }
};

// Função para buscar dados do Yahoo Finance
async function fetchYahooFinanceData(symbol: string): Promise<MarketData | null> {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const quote = data.chart.result[0];
    const price = quote.meta.regularMarketPrice;
    const previousClose = quote.meta.previousClose;
    const change = price - previousClose;
    const changePercent = (change / previousClose) * 100;
    
    return {
      symbol,
      name: MARKET_INDICES[symbol].name,
      price,
      change,
      changePercent,
      volume: quote.meta.regularMarketVolume || 0,
      category: MARKET_INDICES[symbol].category,
      lastUpdate: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Erro ao buscar dados para ${symbol}:`, error);
    return null;
  }
}

// Função para buscar dados da Binance
async function fetchBinanceData(symbol: string): Promise<MarketData | null> {
  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      symbol,
      name: MARKET_INDICES[symbol].name,
      price: parseFloat(data.lastPrice),
      change: parseFloat(data.priceChange),
      changePercent: parseFloat(data.priceChangePercent),
      volume: parseFloat(data.volume),
      category: MARKET_INDICES[symbol].category,
      lastUpdate: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Erro ao buscar dados para ${symbol}:`, error);
    return null;
  }
}

// Função para gerar dados mockados quando as APIs falham
function generateMockData(symbol: string): MarketData {
  const lastData = dataCache[symbol];
  const basePrice = lastData?.price || 100;
  const randomChange = (Math.random() - 0.5) * 2; // -1 to 1
  const newPrice = basePrice * (1 + randomChange / 100);
  
  return {
    symbol,
    name: MARKET_INDICES[symbol].name,
    price: newPrice,
    change: newPrice - basePrice,
    changePercent: randomChange,
    volume: Math.floor(Math.random() * 1000000),
    category: MARKET_INDICES[symbol].category,
    lastUpdate: new Date().toISOString()
  };
}

// Função principal para atualizar os dados
async function updateMarketData(symbols: string[]): Promise<MarketData[]> {
  const now = Date.now();
  const results: MarketData[] = [];
  
  for (const symbol of symbols) {
    // Verificar se precisamos atualizar (cache por 30 segundos)
    if (lastUpdate[symbol] && now - lastUpdate[symbol] < 30000) {
      results.push(dataCache[symbol]);
      continue;
    }
    
    let data: MarketData | null = null;
    
    // Tentar buscar dados reais
    if (symbol.endsWith('USDT')) {
      data = await fetchBinanceData(symbol);
    } else {
      data = await fetchYahooFinanceData(symbol);
    }
    
    // Fallback para dados mockados se a API falhar
    if (!data) {
      data = generateMockData(symbol);
    }
    
    // Atualizar cache
    dataCache[symbol] = data;
    lastUpdate[symbol] = now;
    results.push(data);
  }
  
  return results;
}

// Rota da API
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbols = searchParams.get('symbols')?.split(',') || Object.keys(MARKET_INDICES);
    
    // Validar símbolos
    const validSymbols = symbols.filter(symbol => MARKET_INDICES[symbol]);
    
    if (validSymbols.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum símbolo válido fornecido' },
        { status: 400 }
      );
    }
    
    const data = await updateMarketData(validSymbols);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro na API:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
} 