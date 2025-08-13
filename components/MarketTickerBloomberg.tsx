"use client";
import React, { useEffect, useState } from "react";

type MarketData = {
  symbol: string;
  price: number;
  change: number;
};

const MarketTickerBloomberg: React.FC = () => {
  const [data, setData] = useState<MarketData[]>([]);

  useEffect(() => {
    // 🔹 WebSocket Binance - Cripto em tempo real
    const symbols = ["btcusdt", "ethusdt", "bnbusdt"];
    const streams = symbols.map((s) => `${s}@ticker`).join("/");
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${streams}`
    );

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const symbol = msg.data.s; // Ex: BTCUSDT
      const price = parseFloat(msg.data.c);
      const change = parseFloat(msg.data.P); // % change
      setData((prev) => {
        const updated = [...prev.filter((i) => i.symbol !== symbol)];
        updated.push({ symbol, price, change });
        return updated;
      });
    };

    // 🔹 Buscar ações e índices via Yahoo Finance
    const fetchStocks = async () => {
      const stockSymbols = [
        // Ações principais
        "AAPL", "TSLA", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "NFLX",
        // Índices globais
        "^GSPC", "^IXIC", "^DJI", "^FTSE", "^N225", "^GDAXI", "^FCHI", "^BSESN", "^HSI", "^SSEC", "^BVSP", "^MXX", "^AXJO"
      ];
      try {
        const res = await fetch(`/api/stocks?symbols=${stockSymbols.join(",")}`);
        const stockData: MarketData[] = await res.json();
        setData((prev) => {
          const cryptoData = prev.filter(
            (i) => !stockSymbols.includes(i.symbol)
          );
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
    <div className="w-full overflow-hidden bg-black font-mono text-white border-b border-gray-700">
      <div className="flex animate-marquee whitespace-nowrap">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center px-3 py-1 mr-1 border-r border-gray-700"
          >
            <span className="font-bold mr-2 text-sm">{item.symbol}</span>
            <span className="text-sm mr-1">{item.price.toFixed(2)}</span>
            <span
              className={`text-sm ${
                item.change >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {item.change >= 0 ? "▲" : "▼"} {item.change.toFixed(2)}%
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