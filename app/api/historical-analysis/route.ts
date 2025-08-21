import { NextRequest, NextResponse } from 'next/server';

// Cache para dados históricos
let historicalCache: { [key: string]: any } = {};
let cacheTimestamp: { [key: string]: number } = {};
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

type PerformanceMetrics = {
  '1s': number;
  '15s': number;
  '30s': number;
  '1m': number;
  '5m': number;
  '15m': number;
  '30m': number;
  '1h': number;
  '2h': number;
  '4h': number;
  '6h': number;
  '12h': number;
  '1d': number;
  '7d': number;
  '15d': number;
  '1M': number;
  '3M': number;
  '6M': number;
  '1Y': number;
};

type HistoricalData = {
  symbol: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  historicalHigh: number;
  historicalLow: number;
  yearHigh: number;
  yearLow: number;
  avgVolume: number;
  volatility: number;
  performance: PerformanceMetrics;
  rsi: number;
  macd: string;
  support: number;
  resistance: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  priceHistory: Array<{
    date: string;
    price: number;
    volume: number;
  }>;
  realTimeData: Array<{
    timestamp: number;
    price: number;
    volume: number;
  }>;
};

function generateHistoricalAnalysis(symbol: string, currentPrice: number, change: number): HistoricalData {
  const now = new Date();
  const priceHistory = [];
  
  // Gerar 30 dias de dados históricos
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const randomVariation = (Math.random() - 0.5) * 0.02;
    const historicalPrice = currentPrice * (1 + randomVariation);
    priceHistory.push({
      date: date.toISOString().split('T')[0],
      price: historicalPrice,
      volume: Math.floor(Math.random() * 1000000) + 500000
    });
  }

  // Gerar dados em tempo real (últimas 24 horas)
  const realTimeData = [];
  const nowMs = Date.now();
  for (let i = 24 * 60 * 60; i >= 0; i -= 60) { // A cada minuto
    const timestamp = nowMs - i * 1000;
    const randomVariation = (Math.random() - 0.5) * 0.005;
    const realTimePrice = currentPrice * (1 + randomVariation);
    realTimeData.push({
      timestamp,
      price: realTimePrice,
      volume: Math.floor(Math.random() * 100000) + 10000
    });
  }

  const historicalHigh = Math.max(...priceHistory.map(p => p.price));
  const historicalLow = Math.min(...priceHistory.map(p => p.price));
  const avgVolume = priceHistory.reduce((sum, p) => sum + p.volume, 0) / priceHistory.length;
  
  // Calcular volatilidade
  const returns = priceHistory.slice(1).map((p, i) => 
    (p.price - priceHistory[i].price) / priceHistory[i].price
  );
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const volatility = Math.sqrt(
    returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
  ) * 100;

  // Determinar tendência
  const recentPrices = priceHistory.slice(-7);
  const trend = recentPrices[recentPrices.length - 1].price > recentPrices[0].price ? 'bullish' : 
               recentPrices[recentPrices.length - 1].price < recentPrices[0].price ? 'bearish' : 'neutral';

  // Gerar métricas de performance detalhadas
  const performance: PerformanceMetrics = {
    '1s': (Math.random() - 0.5) * 0.1,
    '15s': (Math.random() - 0.5) * 0.2,
    '30s': (Math.random() - 0.5) * 0.3,
    '1m': (Math.random() - 0.5) * 0.5,
    '5m': (Math.random() - 0.5) * 1.0,
    '15m': (Math.random() - 0.5) * 1.5,
    '30m': (Math.random() - 0.5) * 2.0,
    '1h': (Math.random() - 0.5) * 3.0,
    '2h': (Math.random() - 0.5) * 4.0,
    '4h': (Math.random() - 0.5) * 5.0,
    '6h': (Math.random() - 0.5) * 6.0,
    '12h': (Math.random() - 0.5) * 7.0,
    '1d': (change / currentPrice) * 100,
    '7d': (Math.random() - 0.5) * 10,
    '15d': (Math.random() - 0.5) * 15,
    '1M': (Math.random() - 0.5) * 20,
    '3M': (Math.random() - 0.5) * 30,
    '6M': (Math.random() - 0.5) * 40,
    '1Y': (Math.random() - 0.5) * 60
  };

  return {
    symbol,
    currentPrice,
    priceChange: change,
    priceChangePercent: (change / currentPrice) * 100,
    historicalHigh,
    historicalLow,
    yearHigh: historicalHigh * 1.1,
    yearLow: historicalLow * 0.9,
    avgVolume,
    volatility,
    performance,
    rsi: Math.floor(Math.random() * 40) + 30,
    macd: Math.random() > 0.5 ? 'Bullish' : 'Bearish',
    support: historicalLow * 0.98,
    resistance: historicalHigh * 1.02,
    trend,
    priceHistory,
    realTimeData
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const currentPrice = parseFloat(searchParams.get('price') || '0');
  const change = parseFloat(searchParams.get('change') || '0');

  if (!symbol || !currentPrice) {
    return NextResponse.json({
      success: false,
      error: 'Symbol and price are required'
    }, { status: 400 });
  }

  const now = Date.now();
  const cacheKey = `${symbol}_${currentPrice}`;

  // Verificar cache
  if (historicalCache[cacheKey] && (now - cacheTimestamp[cacheKey]) < CACHE_DURATION) {
    return NextResponse.json({
      success: true,
      data: historicalCache[cacheKey],
      cached: true
    });
  }

  try {
    // Gerar análise histórica
    const analysis = generateHistoricalAnalysis(symbol, currentPrice, change);
    
    // Armazenar no cache
    historicalCache[cacheKey] = analysis;
    cacheTimestamp[cacheKey] = now;

    return NextResponse.json({
      success: true,
      data: analysis,
      cached: false
    });
  } catch (error: any) {
    console.error('Erro ao gerar análise histórica:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
