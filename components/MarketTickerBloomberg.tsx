"use client";
import React, { useEffect, useState, useCallback } from "react";

type MarketData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  category: string;
  lastUpdate: string;
};

const MarketTickerBloomberg: React.FC = () => {
  const [data, setData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cache local para evitar múltiplas chamadas
  const [lastFetch, setLastFetch] = useState<number>(0);
  const CACHE_DURATION = 10000; // 10 segundos

  const fetchMarketData = useCallback(async () => {
    const now = Date.now();
    
    // Verificar cache local
    if (now - lastFetch < CACHE_DURATION && data.length > 0) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Timeout para evitar espera infinita
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch("/api/market-data", {
        signal: controller.signal,
        headers: {
          "Cache-Control": "max-age=10",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Falha ao buscar dados de mercado");
      }

      const result = await response.json();
      const marketData = result.data || result;

      if (!Array.isArray(marketData)) {
        throw new Error("Formato de dados inválido");
      }

      const traditionalData = marketData.filter((item: MarketData) => 
        !item.category?.toLowerCase().includes("crypto") && 
        !item.category?.toLowerCase().includes("cryptocurrency")
      );

      setData(traditionalData);
      setError(null);
      setLastFetch(now);
    } catch (err) {
      console.error("Erro ao buscar dados de mercado:", err);
      setError("Erro ao carregar dados de mercado");
    } finally {
      setIsLoading(false);
    }
  }, [data.length, lastFetch]);

  useEffect(() => {
    fetchMarketData();
    
    // Intervalo mais longo para reduzir carga
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-white font-medium">Carregando dados tradicionais...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Erro:</strong> {error}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.symbol} className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <div>
            <span className="font-semibold">{item.symbol}</span>
            <span className="text-gray-600 ml-2">{item.name}</span>
          </div>
          <div className="text-right">
            <div className="font-semibold">${item.price.toFixed(2)}</div>
            <div className={`text-sm ${item.change >= 0 ? "text-green-600" : "text-red-600"}`}>
              {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarketTickerBloomberg;
