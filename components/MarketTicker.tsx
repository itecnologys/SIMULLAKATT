"use client";

import React, { useEffect, useState } from "react";

type MarketData = {
  symbol: string;
  price: number;
  change: number;
};

const MarketTicker: React.FC = () => {
  const [data, setData] = useState<MarketData[]>([]);

  useEffect(() => {
    // 🔹 1. WebSocket para Cripto (mais pares)
    const symbols = ["btcusdt", "ethusdt", "bnbusdt", "adausdt", "solusdt"];
    const streams = symbols.map((s) => `${s}@ticker`).join("/");
    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const streamSymbol = msg.data.s; // Ex: BTCUSDT
      const price = parseFloat(msg.data.c);
      const change = parseFloat(msg.data.P); // % change
      setData((prev) => {
        const updated = [...prev.filter((i) => i.symbol !== streamSymbol)];
        updated.push({ symbol: streamSymbol, price, change });
        return updated;
      });
    };

    // 🔹 2. HTTP Polling para ações, índices, forex e commodities
    const fetchStocks = async () => {
      const symbols = ["AAPL", "TSLA", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "NFLX", "SPX", "NDX", "DJI", "EURUSD", "GBPUSD", "USDJPY", "GOLD", "SILVER", "OIL"];
      try {
        const res = await fetch(`/api/stocks?symbols=${symbols.join(",")}`);
        const stockData: MarketData[] = await res.json();
        setData((prev) => {
          const cryptoData = prev.filter((i) => !symbols.includes(i.symbol));
          return [...cryptoData, ...stockData];
        });
      } catch (err) {
        console.error("Erro ao buscar ações:", err);
      }
    };
    fetchStocks();
    const interval = setInterval(fetchStocks, 60000);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full overflow-hidden bg-black text-white py-0.5 border-b border-gray-800">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center px-1.5 border-r border-gray-700 min-w-max"
          >
            <span className="font-mono font-bold text-xs mr-0.5">{item.symbol}</span>
            <span className="font-mono text-xs mr-0.5">${item.price.toFixed(2)}</span>
            <span
              className={`font-mono text-xs ${
                item.change >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
      <style jsx>{`
        .animate-marquee {
          display: inline-block;
          animation: marquee 25s linear infinite;
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

export default MarketTicker; 