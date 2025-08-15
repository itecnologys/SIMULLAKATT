"use client";

import React, { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

type DetailedChartProps = {
  symbol: string;
  name: string;
  data: {
    timestamp: number;
    price: number;
  }[];
  currentPrice: number;
  change: number;
  changePercent: number;
};

const DetailedChart: React.FC<DetailedChartProps> = ({
  symbol,
  name,
  data,
  currentPrice,
  change,
  changePercent
}) => {
  const isPositive = change >= 0;
  const chartRef = useRef<ChartJS>(null);

  const chartData = {
    datasets: [
      {
        label: symbol,
        data: data.map(point => ({
          x: point.timestamp,
          y: point.price
        })),
        borderColor: isPositive ? '#059669' : '#dc2626',
        backgroundColor: isPositive ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: true,
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'hour' as const,
          displayFormats: {
            hour: 'HH:mm'
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        position: 'right' as const,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        bodyFont: {
          family: "'Helvetica Neue', Helvetica, Arial, sans-serif"
        },
        padding: 12,
        displayColors: false,
        callbacks: {
          title: () => '',
          label: (context: any) => {
            return `${symbol} ${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{name}</h2>
          <div className="text-sm text-gray-500">{symbol}</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">
            {currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <Line data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <Card className="p-4">
          <div className="text-gray-500">Volume</div>
          <div className="text-lg font-semibold">
            {(Math.random() * 10000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-gray-500">Day Range</div>
          <div className="text-lg font-semibold">
            {(currentPrice - Math.random() * 10).toFixed(2)} - {(currentPrice + Math.random() * 10).toFixed(2)}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DetailedChart; 