"use client";
import React, { useEffect, useState } from "react";

type CryptoData = {
  symbol: string;
  name: string;
  price: number;
  change_24h: number;
  change_7d: number;
  market_cap: number;
  volume_24h: number;
  category: string;
  last_updated: string;
};

type ApiResponse = {
  success: boolean;
  data: CryptoData[];
  cached?: boolean;
  cacheAge?: number;
  warning?: string;
};

const CryptoMarketTicker: React.FC = () => {
  const [data, setData] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheInfo, setCacheInfo] = useState<{cached: boolean, age: number} | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Função para buscar dados da CoinMarketCap com cache de 6 minutos
    const fetchCryptoData = async () => {
      try {
        const response = await fetch('/api/coinmarketcap?action=latest&limit=15');
        if (!response.ok) {
          throw new Error('Falha ao buscar dados de criptomoedas');
        }
        const result: ApiResponse = await response.json();
        
        if (result.success && result.data && isMounted) {
          setData(result.data);
          setError(null);
          setIsLoading(false);
          
          // Armazenar informações do cache
          if (result.cached !== undefined) {
            setCacheInfo({
              cached: result.cached,
              age: result.cacheAge || 0
            });
          }
          
          // Mostrar warning se houver
          if (result.warning) {
            console.warn('⚠️ CoinMarketCap:', result.warning);
          }
        }
      } catch (err: any) {
        console.error('Erro ao buscar dados de criptomoedas:', err);
        if (isMounted) {
          setError('Erro ao carregar dados de criptomoedas');
          setIsLoading(false);
        }
      }
    };

    // Buscar dados imediatamente
    fetchCryptoData();

    // Atualizar dados a cada 2 minutos (cache de 6 minutos garante eficiência)
    const interval = setInterval(() => {
      if (isMounted) {
        fetchCryptoData();
      }
    }, 120000); // 2 minutos

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 px-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-sm">Carregando dados de criptomoedas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-4">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-sm">⚠️ {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 px-4 ticker-container">
      {/* Indicador de cache */}
      {cacheInfo && (
        <div className="absolute top-0 right-2 text-xs opacity-70">
          {cacheInfo.cached ? (
            <span title={`Cache: ${cacheInfo.age}s`}>📦</span>
          ) : (
            <span title="Dados frescos da API">🔄</span>
          )}
        </div>
      )}
      
      <div className="flex items-center space-x-4 animate-scroll-right">
        {/* Primeira repetição */}
        {data.map((item, index) => (
          <div key={`first-${index}`} className="flex items-center space-x-2 whitespace-nowrap ticker-item">
            <span className="font-semibold text-sm">{item.symbol}</span>
            <span className="text-sm">${item.price.toFixed(2)}</span>
            <span className={`text-xs ${item.change_24h >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {item.change_24h >= 0 ? '+' : ''}{item.change_24h.toFixed(2)}%
            </span>
          </div>
        ))}
        {/* Segunda repetição para garantir continuidade */}
        {data.map((item, index) => (
          <div key={`second-${index}`} className="flex items-center space-x-2 whitespace-nowrap ticker-item">
            <span className="font-semibold text-sm">{item.symbol}</span>
            <span className="text-sm">${item.price.toFixed(2)}</span>
            <span className={`text-xs ${item.change_24h >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {item.change_24h >= 0 ? '+' : ''}{item.change_24h.toFixed(2)}%
            </span>
          </div>
        ))}
        {/* Terceira repetição para garantir que não haja espaços */}
        {data.map((item, index) => (
          <div key={`third-${index}`} className="flex items-center space-x-2 whitespace-nowrap ticker-item">
            <span className="font-semibold text-sm">{item.symbol}</span>
            <span className="text-sm">${item.price.toFixed(2)}</span>
            <span className={`text-xs ${item.change_24h >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {item.change_24h >= 0 ? '+' : ''}{item.change_24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoMarketTicker;
