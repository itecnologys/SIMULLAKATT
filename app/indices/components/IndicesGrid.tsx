"use client";
import React, { useEffect, useState } from "react";

type MarketData = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent: number;
  volume24h: number;
  volumeUnit: string;
  category: "stocks" | "crypto" | "forex" | "commodities" | "indices";
  icon: string;
};

const IndicesGrid: React.FC = () => {
  const [data, setData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<string>("all");

  useEffect(() => {
    let isMounted = true;

    const fetchIndicesData = async () => {
      try {
        const response = await fetch("/indices/api");
        if (!response.ok) {
          throw new Error("Falha ao buscar dados de índices");
        }
        
        const result = await response.json();
        const indicesData = result.data || result;
        
        if (!Array.isArray(indicesData)) {
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
    const interval = setInterval(fetchIndicesData, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const filteredData = selectedMarket === "all" 
    ? data 
    : data.filter(item => item.category === selectedMarket);

  const markets = [
    { id: "all", name: "Todos os Mercados", color: "bg-gray-500" },
    { id: "stocks", name: "Ações", color: "bg-blue-500" },
    { id: "crypto", name: "Criptomoedas", color: "bg-orange-500" },
    { id: "forex", name: "Forex", color: "bg-green-500" },
    { id: "commodities", name: "Commodities", color: "bg-yellow-500" },
    { id: "indices", name: "Índices", color: "bg-purple-500" }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-red-800">⚠️ {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros de Mercado */}
      <div className="flex flex-wrap gap-2 justify-center">
        {markets.map((market) => (
          <button
            key={market.id}
            onClick={() => setSelectedMarket(market.id)}
            className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
              selectedMarket === market.id 
                ? market.color 
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            {market.name}
          </button>
        ))}
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            {/* Header do Card */}
            <div className="flex justify-between items-start mb-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold">
                {item.icon}
              </div>
              <div className={`text-sm font-medium ${
                item.changePercent >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                <div className="flex items-center">
                  {item.changePercent >= 0 ? "↗" : "↘"}
                  {Math.abs(item.changePercent).toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Nome do Ativo */}
            <h3 className="font-semibold text-gray-800 text-sm mb-2">
              {item.name}
            </h3>

            {/* Preço */}
            <div className="text-lg font-bold text-gray-900 mb-2">
              R$ {item.price.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>

            {/* Volume 24h */}
            <div className="text-xs text-gray-500">
              Volume (24h): {item.volume24h.toLocaleString("pt-BR")} {item.volumeUnit}
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum dado disponível para este mercado.
        </div>
      )}
    </div>
  );
};

export default IndicesGrid;
