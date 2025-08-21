"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity, 
  Target, 
  Calendar,
  DollarSign,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Clock,
  Zap
} from 'lucide-react';

type MarketData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  category: string;
};

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

type HistoricalAnalysis = {
  symbol: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  volume: number;
  marketCap?: number;
  // Análise histórica
  historicalHigh: number;
  historicalLow: number;
  yearHigh: number;
  yearLow: number;
  avgVolume: number;
  volatility: number;
  // Métricas de performance detalhadas
  performance: PerformanceMetrics;
  // Análise técnica
  rsi: number;
  macd: string;
  support: number;
  resistance: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  // Dados históricos simulados
  priceHistory: Array<{
    date: string;
    price: number;
    volume: number;
  }>;
  // Dados em tempo real
  realTimeData: Array<{
    timestamp: number;
    price: number;
    volume: number;
  }>;
};

const IndexBIAnalysis: React.FC<{ data: MarketData }> = ({ data }) => {
  const [analysis, setAnalysis] = useState<HistoricalAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1d');

  useEffect(() => {
    // Simular carregamento de dados históricos
    const generateAnalysis = () => {
      const basePrice = data.price;
      const change = data.change;
      
      // Gerar dados históricos simulados (últimos 30 dias)
      const priceHistory = [];
      const now = new Date();
      for (let i = 30; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const randomVariation = (Math.random() - 0.5) * 0.02; // ±1% variação
        const historicalPrice = basePrice * (1 + randomVariation);
        priceHistory.push({
          date: date.toISOString().split('T')[0],
          price: historicalPrice,
          volume: Math.floor(Math.random() * 1000000) + 500000
        });
      }

      // Gerar dados em tempo real (últimas 24 horas com intervalos de 1 segundo)
      const realTimeData = [];
      const nowMs = Date.now();
      for (let i = 24 * 60 * 60; i >= 0; i -= 60) { // A cada minuto
        const timestamp = nowMs - i * 1000;
        const randomVariation = (Math.random() - 0.5) * 0.005; // ±0.25% variação
        const realTimePrice = basePrice * (1 + randomVariation);
        realTimeData.push({
          timestamp,
          price: realTimePrice,
          volume: Math.floor(Math.random() * 100000) + 10000
        });
      }

      const historicalHigh = Math.max(...priceHistory.map(p => p.price));
      const historicalLow = Math.min(...priceHistory.map(p => p.price));
      const avgVolume = priceHistory.reduce((sum, p) => sum + p.volume, 0) / priceHistory.length;
      
      // Calcular volatilidade (desvio padrão dos retornos)
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
        '1d': data.changePercent,
        '7d': (Math.random() - 0.5) * 10,
        '15d': (Math.random() - 0.5) * 15,
        '1M': (Math.random() - 0.5) * 20,
        '3M': (Math.random() - 0.5) * 30,
        '6M': (Math.random() - 0.5) * 40,
        '1Y': (Math.random() - 0.5) * 60
      };

      const analysisData: HistoricalAnalysis = {
        symbol: data.symbol,
        currentPrice: basePrice,
        priceChange: change,
        priceChangePercent: data.changePercent,
        volume: Math.floor(Math.random() * 5000000) + 1000000,
        marketCap: data.category === 'Crypto' ? Math.floor(Math.random() * 100000000000) + 1000000000 : undefined,
        historicalHigh,
        historicalLow,
        yearHigh: historicalHigh * 1.1,
        yearLow: historicalLow * 0.9,
        avgVolume,
        volatility,
        performance,
        rsi: Math.floor(Math.random() * 40) + 30, // 30-70
        macd: Math.random() > 0.5 ? 'Bullish' : 'Bearish',
        support: historicalLow * 0.98,
        resistance: historicalHigh * 1.02,
        trend,
        priceHistory,
        realTimeData
      };

      setAnalysis(analysisData);
      setIsLoading(false);
    };

    const timer = setTimeout(generateAnalysis, 500);
    return () => clearTimeout(timer);
  }, [data]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish': return 'text-green-600 bg-green-50';
      case 'bearish': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return <TrendingUp className="h-4 w-4" />;
      case 'bearish': return <TrendingDown className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const getPerformanceColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getPerformanceIcon = (value: number) => {
    return value >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />;
  };

  const timeframes = [
    { key: '1s', label: '1s', icon: <Zap className="h-3 w-3" /> },
    { key: '15s', label: '15s', icon: <Zap className="h-3 w-3" /> },
    { key: '30s', label: '30s', icon: <Zap className="h-3 w-3" /> },
    { key: '1m', label: '1m', icon: <Clock className="h-3 w-3" /> },
    { key: '5m', label: '5m', icon: <Clock className="h-3 w-3" /> },
    { key: '15m', label: '15m', icon: <Clock className="h-3 w-3" /> },
    { key: '30m', label: '30m', icon: <Clock className="h-3 w-3" /> },
    { key: '1h', label: '1h', icon: <Clock className="h-3 w-3" /> },
    { key: '2h', label: '2h', icon: <Clock className="h-3 w-3" /> },
    { key: '4h', label: '4h', icon: <Clock className="h-3 w-3" /> },
    { key: '6h', label: '6h', icon: <Clock className="h-3 w-3" /> },
    { key: '12h', label: '12h', icon: <Clock className="h-3 w-3" /> },
    { key: '1d', label: '1D', icon: <Calendar className="h-3 w-3" /> },
    { key: '7d', label: '7D', icon: <Calendar className="h-3 w-3" /> },
    { key: '15d', label: '15D', icon: <Calendar className="h-3 w-3" /> },
    { key: '1M', label: '1M', icon: <Calendar className="h-3 w-3" /> },
    { key: '3M', label: '3M', icon: <Calendar className="h-3 w-3" /> },
    { key: '6M', label: '6M', icon: <Calendar className="h-3 w-3" /> },
    { key: '1Y', label: '1A', icon: <Calendar className="h-3 w-3" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Header com informações principais */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{analysis.symbol}</h2>
          <p className="text-gray-600">{data.name}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">
            ${analysis.currentPrice.toFixed(2)}
          </div>
          <div className={`text-lg font-medium ${analysis.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {analysis.priceChange >= 0 ? '+' : ''}{analysis.priceChange.toFixed(2)} ({analysis.priceChangePercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Indicadores de tendência */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Tendência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getTrendColor(analysis.trend)}`}>
              {getTrendIcon(analysis.trend)}
              {analysis.trend === 'bullish' ? 'Alta' : analysis.trend === 'bearish' ? 'Baixa' : 'Lateral'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Volatilidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.volatility.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Anual</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              RSI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.rsi}</div>
            <div className="text-sm text-gray-600">
              {analysis.rsi > 70 ? 'Sobrecomprado' : analysis.rsi < 30 ? 'Sobrevendido' : 'Neutro'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance histórica detalhada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Histórica Detalhada
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Seletor de timeframe */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Selecione o período:</div>
            <div className="flex flex-wrap gap-2">
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe.key}
                  onClick={() => setSelectedTimeframe(timeframe.key)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedTimeframe === timeframe.key
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {timeframe.icon}
                  {timeframe.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de performance */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-3">
            {timeframes.map((timeframe) => {
              const value = analysis.performance[timeframe.key as keyof PerformanceMetrics];
              return (
                <div key={timeframe.key} className={`text-center p-3 rounded-lg border ${
                  selectedTimeframe === timeframe.key ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                }`}>
                  <div className="text-xs text-gray-600 mb-1">{timeframe.label}</div>
                  <div className={`text-sm font-bold flex items-center justify-center gap-1 ${getPerformanceColor(value)}`}>
                    {getPerformanceIcon(value)}
                    {value >= 0 ? '+' : ''}{value.toFixed(2)}%
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resumo do período selecionado */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Resumo - {timeframes.find(t => t.key === selectedTimeframe)?.label}
            </div>
            <div className={`text-lg font-bold ${getPerformanceColor(analysis.performance[selectedTimeframe as keyof PerformanceMetrics])}`}>
              {getPerformanceIcon(analysis.performance[selectedTimeframe as keyof PerformanceMetrics])}
              {analysis.performance[selectedTimeframe as keyof PerformanceMetrics] >= 0 ? '+' : ''}
              {analysis.performance[selectedTimeframe as keyof PerformanceMetrics].toFixed(2)}%
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Níveis de suporte e resistência */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Níveis Técnicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Resistência</span>
              <span className="font-medium text-red-600">${analysis.resistance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Suporte</span>
              <span className="font-medium text-green-600">${analysis.support.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Máximo 52s</span>
              <span className="font-medium">${analysis.yearHigh.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Mínimo 52s</span>
              <span className="font-medium">${analysis.yearLow.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Volume e Liquidez</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Volume Atual</span>
              <span className="font-medium">{analysis.volume.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Volume Médio</span>
              <span className="font-medium">{Math.floor(analysis.avgVolume).toLocaleString()}</span>
            </div>
            {analysis.marketCap && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Market Cap</span>
                <span className="font-medium">${(analysis.marketCap / 1000000000).toFixed(2)}B</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">MACD</span>
              <span className={`font-medium ${analysis.macd === 'Bullish' ? 'text-green-600' : 'text-red-600'}`}>
                {analysis.macd}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dados em tempo real (últimas 24 horas) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Dados em Tempo Real (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {analysis.realTimeData.slice(-20).map((data, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-sm text-gray-600">
                  {new Date(data.timestamp).toLocaleTimeString()}
                </span>
                <div className="flex items-center gap-4">
                  <span className="font-medium">${data.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">Vol: {data.volume.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndexBIAnalysis;
