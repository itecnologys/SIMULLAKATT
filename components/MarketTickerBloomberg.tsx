"use client";
import React, { useEffect, useState } from "react";

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

  useEffect(() => {
    let ws: WebSocket | null = null;

    // Função para buscar dados via API REST
    const fetchMarketData = async () => {
      try {
        const response = await fetch('/api/market-data');
        if (!response.ok) {
          throw new Error('Falha ao buscar dados de mercado');
        }
        const marketData = await response.json();
        setData(marketData);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Falha ao atualizar dados de mercado');
      } finally {
        setIsLoading(false);
      }
    };

    // Conectar ao WebSocket da Binance para criptomoedas
    const connectWebSocket = () => {
      const symbols = ["btcusdt", "ethusdt", "bnbusdt", "solusdt", "adausdt"];
      const streams = symbols.map((s) => `${s}@ticker`).join("/");
      ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        const streamSymbol = msg.data.s; // Ex: BTCUSDT
        const price = parseFloat(msg.data.c);
        const change = parseFloat(msg.data.p);
        const changePercent = parseFloat(msg.data.P);

        setData((prevData) => {
          const updatedData = [...prevData];
          const index = updatedData.findIndex(
            (item) => item.symbol === streamSymbol
          );
          
          if (index !== -1) {
            updatedData[index] = {
              ...updatedData[index],
              price,
              change,
              changePercent,
              lastUpdate: new Date().toISOString()
            };
          }
          
          return updatedData;
        });
      };

      ws.onerror = () => {
        console.error('WebSocket error');
        ws?.close();
      };

      ws.onclose = () => {
        console.log('WebSocket closed, attempting to reconnect...');
        setTimeout(connectWebSocket, 5000);
      };
    };

    // Iniciar conexões e atualizações
    fetchMarketData();
    connectWebSocket();

    // Polling para dados não-crypto
    const pollInterval = setInterval(fetchMarketData, 30000);

    return () => {
      clearInterval(pollInterval);
      if (ws) {
        ws.close();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="w-full bg-black text-white p-2 text-center">
        Carregando dados de mercado...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-black text-white p-2 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-black font-mono text-white border-b border-gray-700">
      <div className="flex animate-marquee whitespace-nowrap">
        {data.map((item) => (
          <div
            key={`${item.symbol}-${item.lastUpdate}`}
            className="flex items-center px-3 py-1 mr-1 border-r border-gray-700"
          >
            <span className="font-bold mr-2 text-sm">{item.name}</span>
            <span className="text-sm mr-1">
              {item.price.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
            <span
              className={`text-sm ${
                item.changePercent >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {item.changePercent >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(item.changePercent).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};

export default MarketTickerBloomberg; 