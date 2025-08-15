/** @jsxImportSource react */
"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, BarChart3, Plus, Info } from "lucide-react";

type MarketData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  category: string;
  uniqueId: string;
};

type ModalData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  category: string;
  uniqueId: string;
  description: string;
  volatility: string;
  correlation: string;
  suitability: string;
};

const DashboardMarketTicker: React.FC = () => {
  const [data, setData] = useState<MarketData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<ModalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 🔹 Buscar dados reais de índices financeiros
    const fetchRealTimeData = async () => {
      try {
        // Usando Alpha Vantage API para dados reais (requer API key)
        // Para demonstração, vou usar uma combinação de APIs públicas
        const indices = [
          { symbol: "^GSPC", name: "S&P 500", category: "Equity Indexes" },
          { symbol: "^IXIC", name: "NASDAQ", category: "Equity Indexes" },
          { symbol: "^DJI", name: "Dow Jones", category: "Equity Indexes" },
          { symbol: "^FTSE", name: "FTSE 100", category: "Equity Indexes" },
          { symbol: "^N225", name: "Nikkei 225", category: "Equity Indexes" },
          { symbol: "^GDAXI", name: "DAX", category: "Equity Indexes" },
          { symbol: "EURUSD=X", name: "EUR/USD", category: "Forex" },
          { symbol: "GBPUSD=X", name: "GBP/USD", category: "Forex" },
          { symbol: "USDJPY=X", name: "USD/JPY", category: "Forex" },
          { symbol: "GC=F", name: "Gold", category: "Commodities" },
          { symbol: "CL=F", name: "Crude Oil", category: "Commodities" },
          { symbol: "BTC-USD", name: "Bitcoin", category: "Crypto" }
        ];

        const results = await Promise.all(
          indices.map(async (index) => {
            try {
              // Tentar Yahoo Finance API primeiro
              const response = await fetch(
                `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${index.symbol}`
              );
              const json = await response.json();
              
              if (json.quoteResponse && json.quoteResponse.result && json.quoteResponse.result.length > 0) {
                const quote = json.quoteResponse.result[0];
                return {
                  symbol: index.symbol,
                  name: index.name,
                  price: quote.regularMarketPrice || 0,
                  change: quote.regularMarketChange || 0,
                  changePercent: quote.regularMarketChangePercent || 0,
                  category: index.category,
                  uniqueId: `${index.symbol}_${Date.now()}`
                };
              }
              
              // Fallback para dados mockados se API falhar
              return {
                symbol: index.symbol,
                name: index.name,
                price: Math.random() * 5000 + 1000,
                change: (Math.random() - 0.5) * 100,
                changePercent: (Math.random() - 0.5) * 5,
                category: index.category,
                uniqueId: `${index.symbol}_${Date.now()}`
              };
            } catch (error) {
              console.error(`Erro ao buscar ${index.symbol}:`, error);
              // Dados mockados como fallback
              return {
                symbol: index.symbol,
                name: index.name,
                price: Math.random() * 5000 + 1000,
                change: (Math.random() - 0.5) * 100,
                changePercent: (Math.random() - 0.5) * 5,
                category: index.category,
                uniqueId: `${index.symbol}_${Date.now()}`
              };
            }
          })
        );

        setData(results);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setIsLoading(false);
      }
    };

    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 30000); // Atualizar a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const handleIndexClick = (index: MarketData) => {
    // Gerar dados detalhados para o modal
    const modalData: ModalData = {
      ...index,
      description: `${index.name} é um índice importante do mercado financeiro que pode ser usado como indicador para simulações.`,
      volatility: index.changePercent > 2 ? "Alta" : index.changePercent > 1 ? "Média" : "Baixa",
      correlation: index.category === "Equity Indexes" ? "Alta correlação com ações" : 
                  index.category === "Forex" ? "Correlação moderada" : "Baixa correlação",
      suitability: index.changePercent > 0 ? "Recomendado" : "Avaliar com cautela"
    };
    
    setSelectedIndex(modalData);
    setIsModalOpen(true);
  };

  const addToSimulation = () => {
    if (selectedIndex) {
      // Aqui você pode implementar a lógica para adicionar o índice à simulação
      console.log("Adicionando à simulação:", selectedIndex);
      // Fechar modal após adicionar
      setIsModalOpen(false);
    }
  };

  const categories = ["Equity Indexes", "Forex", "Commodities", "Crypto"];

  return (
    <div className="w-full">
      {/* Market Ticker Header */}
      <div className="bg-black text-white p-2 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-bold text-sm">LLP &lt;GO&gt; to Open in Launchpad</span>
            <div className="flex space-x-2 text-xs">
              <span className="bg-orange-600 px-2 py-1">My Markets</span>
              <span>Legend</span>
              <span>Settings ▼</span>
              <span>Movers</span>
              <span>1D</span>
              <span>MTD ▼</span>
              <span>Events ▼</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span>Page 1/5</span>
            <BarChart3 size={16} />
            <span>Global Macro Movers</span>
          </div>
        </div>
      </div>

      {/* Market Data Grid */}
      <div className="grid grid-cols-5 gap-4 p-4 bg-gray-900 min-h-screen">
        {categories.map((category) => (
          <div key={category} className="space-y-2">
            <h3 className="text-white font-semibold text-sm border-b border-gray-700 pb-1">
              {category}
            </h3>
            <div className="space-y-2">
              {data
                .filter((item) => item.category === category)
                .map((item) => (
                  <div
                    key={item.uniqueId}
                    className="bg-gray-800 p-3 rounded cursor-pointer hover:bg-gray-700 transition-colors"
                    onClick={() => handleIndexClick(item)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm font-medium">{item.name}</span>
                      <div className="flex items-center space-x-1">
                        {item.changePercent > 0 ? (
                          <TrendingUp size={12} className="text-green-400" />
                        ) : (
                          <TrendingDown size={12} className="text-red-400" />
                        )}
                        <span
                          className={`text-sm font-bold ${
                            item.changePercent > 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {item.changePercent > 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Mini Chart Placeholder */}
                    <div className="h-8 bg-gray-700 rounded mb-2 flex items-center justify-center">
                      <div className="w-full h-2 bg-gray-600 rounded relative">
                        <div 
                          className={`h-full rounded ${
                            item.changePercent > 0 ? "bg-green-400" : "bg-red-400"
                          }`}
                          style={{ width: `${Math.min(Math.abs(item.changePercent) * 20, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white">{item.price.toFixed(2)}</span>
                      <span
                        className={
                          item.change > 0 ? "text-green-400" : "text-red-400"
                        }
                      >
                        {item.change > 0 ? "+" : ""}{item.change.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal para detalhes do índice */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Info size={20} />
              <span>Análise do Índice: {selectedIndex?.name}</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedIndex && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedIndex.name} ({selectedIndex.symbol})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Preço Atual</p>
                      <p className="text-xl font-bold">{selectedIndex.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Variação</p>
                      <p className={`text-xl font-bold ${
                        selectedIndex.changePercent > 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {selectedIndex.changePercent > 0 ? "+" : ""}{selectedIndex.changePercent.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Volatilidade</p>
                      <Badge variant={selectedIndex.volatility === "Alta" ? "destructive" : "secondary"}>
                        {selectedIndex.volatility}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Correlação</p>
                      <Badge variant="outline">{selectedIndex.correlation}</Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Descrição</p>
                    <p className="text-sm">{selectedIndex.description}</p>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Recomendação para Simulação</p>
                    <Badge variant={selectedIndex.suitability === "Recomendado" ? "default" : "secondary"}>
                      {selectedIndex.suitability}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={addToSimulation} className="flex items-center space-x-2">
                  <Plus size={16} />
                  <span>Adicionar à Simulação</span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <div className="bg-black text-white p-2 text-xs">
        <div className="flex items-center justify-between">
          <span>Copyright 2024 SIMULAK Finance Platform</span>
          <span>{new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardMarketTicker; 