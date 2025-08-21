"use client";
import React, { useEffect, useState, useCallback } from "react";

type CryptoData = {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdate: string;
};

const CryptoMarketTicker: React.FC = () => {
  const [data, setData] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cache local para evitar múltiplas chamadas
  const [lastFetch, setLastFetch] = useState<number>(0);
  const CACHE_DURATION = 10000; // 10 segundos

  const fetchCryptoData = useCallback(async () => {
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

      const response = await fetch("/api/coinmarketcap", {
        signal: controller.signal,
        headers: {
          "Cache-Control": "max-age=10",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Falha ao buscar dados de criptomoedas");
      }

      const result = await response.json();
      const cryptoData = result.data || result;

      if (!Array.isArray(cryptoData)) {
        throw new Error("Formato de dados inválido");
      }

      setData(cryptoData);
      setError(null);
      setLastFetch(now);
    } catch (err) {
      console.error("Erro ao buscar dados de criptomoedas:", err);
      setError("Erro ao carregar dados de criptomoedas");
    } finally {
      setIsLoading(false);
    }
  }, [data.length, lastFetch]);

  useEffect(() => {
    fetchCryptoData();
    
    // Intervalo mais longo para reduzir carga
    const interval = setInterval(fetchCryptoData, 30000);
    return () => clearInterval(interval);
  }, [fetchCryptoData]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-white font-medium">Carregando dados de criptomoedas...</span>
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
            <div className={`text-sm ${item.change24h >= 0 ? "text-green-600" : "text-red-600"}`}>
              {item.change24h >= 0 ? "+" : ""}{item.change24h.toFixed(2)} ({item.changePercent24h.toFixed(2)}%)
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CryptoMarketTicker;
