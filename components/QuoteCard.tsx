"use client";

import React, { useState, Suspense } from 'react';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Carregamento dinâmico do TradingViewChart
const TradingViewChart = dynamic(
  () => import('./TradingViewChart'),
  { 
    loading: () => (
      <div className="w-full h-[500px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    ),
    ssr: false
  }
);

type MarketData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  historicalData?: number[];
  category: string;
};

const generateMockHistoricalData = (price: number, change: number): number[] => {
  const points = 20;
  const data: number[] = [];
  const trend = change > 0 ? 1 : -1;
  let currentPrice = price - change;

  for (let i = 0; i < points; i++) {
    const randomVariation = (Math.random() - 0.5) * Math.abs(change) * 0.5;
    const point = currentPrice + (trend * Math.abs(change) * (i / points)) + randomVariation;
    data.push(point);
  }
  data.push(price);
  return data;
};

const generateDetailedHistoricalData = (price: number, change: number) => {
  const now = new Date();
  const data = [];
  const points = 100;
  const trend = change > 0 ? 1 : -1;
  let currentPrice = price - change;

  for (let i = 0; i < points; i++) {
    const time = new Date(now.getTime() - (points - i) * 5 * 60000); // 5 minutes intervals
    const randomVariation = (Math.random() - 0.5) * Math.abs(change) * 0.5;
    const value = currentPrice + (trend * Math.abs(change) * (i / points)) + randomVariation;
    const volume = Math.floor(Math.random() * 1000000) + 500000;
    
    data.push({
      time: time.toISOString().split('T')[1].split('.')[0],
      value,
      volume
    });
  }

  return data;
};

const QuoteCard: React.FC<{ data: MarketData }> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isPositive = data.change >= 0;
  const historicalData = data.historicalData || generateMockHistoricalData(data.price, data.change);
  
  const handleOpenModal = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const detailedData = generateDetailedHistoricalData(data.price, data.change);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Erro ao abrir modal:', err);
      setError('Erro ao carregar dados detalhados');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <div 
        className="quote-card flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
        onClick={handleOpenModal}
      >
        <div className="flex-1">
          <div className="symbol text-sm font-semibold text-gray-900">{data.name}</div>
          <div className="name text-xs text-gray-500">{data.symbol}</div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="price text-sm font-semibold">
              {data.price.toLocaleString('en-US', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </div>
            <div className={`change text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{data.change.toFixed(2)} ({isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%)
            </div>
          </div>
          <div className="w-20 h-8">
            <Sparklines data={historicalData} width={80} height={32} margin={0}>
              <SparklinesLine 
                style={{ 
                  stroke: isPositive ? '#059669' : '#dc2626',
                  strokeWidth: 1,
                  fill: "none"
                }} 
              />
              <SparklinesSpots 
                size={1}
                style={{ 
                  stroke: isPositive ? '#059669' : '#dc2626',
                  strokeWidth: 1,
                  fill: "white"
                }} 
              />
            </Sparklines>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-6">
          <Suspense fallback={
            <div className="w-full h-[500px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          }>
            {error ? (
              <div className="w-full h-[500px] flex items-center justify-center text-red-500">
                {error}
              </div>
            ) : (
              <TradingViewChart
                symbol={data.symbol}
                name={data.name}
                data={generateDetailedHistoricalData(data.price, data.change)}
                currentPrice={data.price}
                change={data.change}
                changePercent={data.changePercent}
                volume={Math.floor(Math.random() * 10000000) + 1000000}
                dayRange={{
                  low: data.price - Math.abs(data.change) * 1.5,
                  high: data.price + Math.abs(data.change) * 1.5
                }}
                previousClose={data.price - data.change}
                marketStatus="Market Open"
              />
            )}
          </Suspense>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuoteCard; 