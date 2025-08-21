"use client";
import React, { useEffect, useState } from "react";

type IndicesData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  lastUpdate: string;
};

const IndicesTicker: React.FC = () => {
  const [data, setData] = useState<IndicesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchIndicesData = async () => {
      try {
        const response = await fetch("/indices/api");
        if (!response.ok) {
          throw new Error("Falha ao buscar dados de índices");
        }
        
        const result = await response.json();
        
        // Verificar se a resposta tem a estrutura esperada
        const indicesData = result.data || result;
        
        // Garantir que indicesData seja um array
        if (!Array.isArray(indicesData)) {
          console.error("Dados de índices não são um array:", indicesData);
          throw new Error("Formato de dados inválido");
        }
        
        if (isMounted) {
          setData(indicesData);
          setError(null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Erro ao buscar dados de índices:", err);
        if (isMounted) {
          setError("Erro ao carregar dados de índices");
          setIsLoading(false);
        }
      }
    };

    fetchIndicesData();

    // Atualizar dados a cada 30 segundos
    const interval = setInterval(() => {
      if (isMounted) {
        fetchIndicesData();
      }
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 px-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-sm">Carregando índices...</span>
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
    <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 px-4 ticker-container">
      <div className="flex items-center space-x-4 animate-scroll-left">
        {/* Primeira repetição */}
        {data.map((item, index) => (
          <div key={`first-${index}`} className="flex items-center space-x-2 whitespace-nowrap ticker-item">
            <span className="font-semibold text-sm">{item.symbol}</span>
            <span className="text-sm">{item.price.toLocaleString()}</span>
            <span className={`text-xs ${item.change >= 0 ? "text-green-300" : "text-red-300"}`}>
              {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
            </span>
          </div>
        ))}
        {/* Segunda repetição para garantir continuidade */}
        {data.map((item, index) => (
          <div key={`second-${index}`} className="flex items-center space-x-2 whitespace-nowrap ticker-item">
            <span className="font-semibold text-sm">{item.symbol}</span>
            <span className="text-sm">{item.price.toLocaleString()}</span>
            <span className={`text-xs ${item.change >= 0 ? "text-green-300" : "text-red-300"}`}>
              {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndicesTicker;
