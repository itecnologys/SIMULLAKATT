"use client";

import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ColorType } from 'lightweight-charts';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  TrendingUp,
  TrendingDown,
  Volume2,
  DollarSign
} from 'lucide-react';

type ChartData = {
  time: string;
  value: number;
  volume?: number;
};

type TradingViewChartProps = {
  symbol: string;
  name: string;
  data: ChartData[];
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  dayRange: {
    low: number;
    high: number;
  };
  previousClose: number;
  marketStatus: string;
};

const formatNumber = (num: number) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toString();
};

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol,
  name,
  data,
  currentPrice,
  change,
  changePercent,
  volume,
  dayRange,
  previousClose,
  marketStatus
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const isPositive = change >= 0;

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Limpar gráfico anterior se existir
    if (chartRef.current) {
      chartRef.current.remove();
    }

    // Criar novo gráfico
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'white' },
        textColor: '#333',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      grid: {
        vertLines: { color: '#f0f3fa' },
        horzLines: { color: '#f0f3fa' },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: '#758696',
          style: 3,
        },
        horzLine: {
          visible: true,
          labelVisible: true,
        },
      },
    });

    chartRef.current = chart;

    // Série principal (área)
    const mainSeries = chart.addAreaSeries({
      lineColor: isPositive ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)',
      topColor: isPositive ? 'rgba(34, 197, 94, 0.28)' : 'rgba(239, 68, 68, 0.28)',
      bottomColor: isPositive ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)',
      lineWidth: 2,
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    });

    // Série de volume
    const volumeSeries = chart.addHistogramSeries({
      color: isPositive ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    // Preparar dados
    const chartData = data.map(item => ({
      time: item.time,
      value: item.value,
    }));

    const volumeData = data.map(item => ({
      time: item.time,
      value: item.volume || 0,
      color: item.value >= (data[data.indexOf(item) - 1]?.value || 0) 
        ? 'rgba(34, 197, 94, 0.5)' 
        : 'rgba(239, 68, 68, 0.5)',
    }));

    // Definir dados
    mainSeries.setData(chartData);
    volumeSeries.setData(volumeData);

    // Ajustar visualização
    chart.timeScale().fitContent();

    // Manipulador de redimensionamento
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [data, isPositive, previousClose]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold">{name}</h2>
            <Badge variant="outline">{symbol}</Badge>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            <Clock className="inline-block h-4 w-4 mr-1" />
            {marketStatus}
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">
            {currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className={`flex items-center justify-end space-x-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <span className="text-lg">
              {isPositive ? '+' : ''}{change.toFixed(2)}
            </span>
            <span className="text-lg">
              ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
            </span>
            {isPositive ? (
              <ArrowUpRight className="h-5 w-5" />
            ) : (
              <ArrowDownRight className="h-5 w-5" />
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div ref={chartContainerRef} className="w-full h-[400px] bg-white" />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2 text-gray-500 mb-1">
            <Volume2 className="h-4 w-4" />
            <span>Volume</span>
          </div>
          <div className="text-lg font-semibold">{formatNumber(volume)}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2 text-gray-500 mb-1">
            <TrendingUp className="h-4 w-4" />
            <span>Day's Range</span>
          </div>
          <div className="text-lg font-semibold">
            {dayRange.low.toFixed(2)} - {dayRange.high.toFixed(2)}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2 text-gray-500 mb-1">
            <DollarSign className="h-4 w-4" />
            <span>Previous Close</span>
          </div>
          <div className="text-lg font-semibold">{previousClose.toFixed(2)}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2 text-gray-500 mb-1">
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>Performance</span>
          </div>
          <div className={`text-lg font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TradingViewChart; 