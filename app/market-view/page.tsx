"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpIcon, ArrowDownIcon, Search, BarChart2, Bitcoin, DollarSign, Droplet, TrendingUp } from "lucide-react"
import Link from "next/link"
import CandlestickChart from "@/components/candlestick-chart"

// Universos financeiros
const universes = [
  { id: "stocks", name: "Bolsa de Valores", icon: BarChart2, color: "bg-blue-500/10 text-blue-500 border-blue-200" },
  { id: "crypto", name: "Criptomoedas", icon: Bitcoin, color: "bg-orange-500/10 text-orange-500 border-orange-200" },
  { id: "forex", name: "Forex", icon: DollarSign, color: "bg-green-500/10 text-green-500 border-green-200" },
  { id: "commodities", name: "Commodities", icon: Droplet, color: "bg-amber-500/10 text-amber-500 border-amber-200" },
  { id: "indices", name: "Índices", icon: TrendingUp, color: "bg-purple-500/10 text-purple-500 border-purple-200" },
]

// Dados de exemplo para ações
const stocksData = [
  {
    ticker: "AAPL",
    name: "Apple Inc",
    price: 196.99,
    change: 1.39,
    changePercent: 0.71,
    volume: 51273821,
    marketCap: 2959.05,
    sector: "Technology",
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corp",
    price: 402.75,
    change: 1.25,
    changePercent: 0.31,
    volume: 23456789,
    marketCap: 3012.45,
    sector: "Technology",
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc",
    price: 156.28,
    change: -0.72,
    changePercent: -0.46,
    volume: 18765432,
    marketCap: 1987.65,
    sector: "Technology",
  },
  {
    ticker: "AMZN",
    name: "Amazon.com Inc",
    price: 178.75,
    change: 2.15,
    changePercent: 1.22,
    volume: 32145678,
    marketCap: 1876.32,
    sector: "Consumer Cyclical",
  },
  {
    ticker: "META",
    name: "Meta Platforms Inc",
    price: 485.58,
    change: 3.21,
    changePercent: 0.67,
    volume: 15678932,
    marketCap: 1243.87,
    sector: "Technology",
  },
  // Adicionar mais 95 ações para completar 100
]

// Dados de exemplo para criptomoedas
const cryptoData = [
  {
    ticker: "BTC/USDT",
    name: "Bitcoin",
    price: 65195.0,
    change: 311.57,
    changePercent: 0.37,
    volume: 40000000,
    marketCap: 1278.45,
    category: "Layer 1",
  },
  {
    ticker: "ETH/USDT",
    name: "Ethereum",
    price: 3095.0,
    change: -1.85,
    changePercent: -0.12,
    volume: 25000000,
    marketCap: 372.56,
    category: "Layer 1",
  },
  {
    ticker: "SOL/USDT",
    name: "Solana",
    price: 138.99,
    change: 0.17,
    changePercent: 0.12,
    volume: 20000000,
    marketCap: 59.87,
    category: "Layer 1",
  },
  {
    ticker: "BNB/USDT",
    name: "Binance Coin",
    price: 590.45,
    change: -2.9,
    changePercent: -0.49,
    volume: 15000000,
    marketCap: 91.23,
    category: "Exchange Token",
  },
  {
    ticker: "XRP/USDT",
    name: "Ripple",
    price: 0.5084,
    change: -0.001,
    changePercent: -0.05,
    volume: 18000000,
    marketCap: 27.65,
    category: "Payment",
  },
  // Adicionar mais 95 criptomoedas para completar 100
]

// Dados de exemplo para forex
const forexData = [
  {
    ticker: "EUR/USD",
    name: "Euro / US Dollar",
    price: 1.0668,
    change: -0.0022,
    changePercent: -0.2,
    volume: 125000000,
    openInterest: 567890,
    category: "Major",
  },
  {
    ticker: "USD/JPY",
    name: "US Dollar / Japanese Yen",
    price: 154.65,
    change: 0.35,
    changePercent: 0.23,
    volume: 98000000,
    openInterest: 456789,
    category: "Major",
  },
  {
    ticker: "GBP/USD",
    name: "British Pound / US Dollar",
    price: 1.2468,
    change: 0.0035,
    changePercent: 0.26,
    volume: 87000000,
    openInterest: 345678,
    category: "Major",
  },
  {
    ticker: "USD/CHF",
    name: "US Dollar / Swiss Franc",
    price: 0.9083,
    change: -0.0086,
    changePercent: -0.7,
    volume: 65000000,
    openInterest: 234567,
    category: "Major",
  },
  {
    ticker: "AUD/USD",
    name: "Australian Dollar / US Dollar",
    price: 0.6496,
    change: 0.0024,
    changePercent: 0.38,
    volume: 76000000,
    openInterest: 123456,
    category: "Major",
  },
  // Adicionar mais 95 pares forex para completar 100
]

// Dados de exemplo para commodities
const commoditiesData = [
  {
    ticker: "CL=F",
    name: "Crude Oil WTI",
    price: 64.45,
    change: 2.65,
    changePercent: 4.29,
    volume: 450000,
    openInterest: 345678,
    category: "Energy",
  },
  {
    ticker: "GC=F",
    name: "Gold",
    price: 2341.3,
    change: -5.1,
    changePercent: -0.15,
    volume: 320000,
    openInterest: 234567,
    category: "Metals",
  },
  {
    ticker: "SI=F",
    name: "Silver",
    price: 32.55,
    change: -0.43,
    changePercent: -1.15,
    volume: 280000,
    openInterest: 123456,
    category: "Metals",
  },
  {
    ticker: "HG=F",
    name: "Copper",
    price: 4.705,
    change: 0.0195,
    changePercent: 0.42,
    volume: 210000,
    openInterest: 98765,
    category: "Metals",
  },
  {
    ticker: "NG=F",
    name: "Natural Gas",
    price: 3.248,
    change: 0.001,
    changePercent: 0.03,
    volume: 180000,
    openInterest: 87654,
    category: "Energy",
  },
  // Adicionar mais 95 commodities para completar 100
]

// Dados de exemplo para índices
const indicesData = [
  {
    ticker: "^DJI",
    name: "Dow Jones Industrial Average",
    price: 39398.0,
    change: -455.0,
    changePercent: -1.14,
    volume: 350000000,
    components: 30,
    category: "US",
  },
  {
    ticker: "^GSPC",
    name: "S&P 500",
    price: 5326.5,
    change: 20.75,
    changePercent: 0.39,
    volume: 420000000,
    components: 500,
    category: "US",
  },
  {
    ticker: "^IXIC",
    name: "NASDAQ Composite",
    price: 18427.75,
    change: 42.5,
    changePercent: 0.23,
    volume: 480000000,
    components: 3300,
    category: "US",
  },
  {
    ticker: "^RUT",
    name: "Russell 2000",
    price: 1893.7,
    change: 19.3,
    changePercent: 1.03,
    volume: 280000000,
    components: 2000,
    category: "US",
  },
  {
    ticker: "^N225",
    name: "Nikkei 225",
    price: 34620.0,
    change: 670.0,
    changePercent: 1.97,
    volume: 320000000,
    components: 225,
    category: "Asia",
  },
  // Adicionar mais 95 índices para completar 100
]

// Função para obter dados com base no universo selecionado
const getUniverseData = (universe: string) => {
  switch (universe) {
    case "stocks":
      return stocksData
    case "crypto":
      return cryptoData
    case "forex":
      return forexData
    case "commodities":
      return commoditiesData
    case "indices":
      return indicesData
    default:
      return []
  }
}

// Função auxiliar para formatar números com segurança
const formatNumber = (value: any): string => {
  if (value === undefined || value === null) {
    return "N/A"
  }

  if (typeof value === "number") {
    return value.toLocaleString()
  }

  return String(value)
}

export default function MarketViewPage() {
  const [selectedUniverse, setSelectedUniverse] = useState<string>("stocks")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [showChart, setShowChart] = useState<boolean>(false)

  // Filtrar dados com base no termo de pesquisa
  const filteredData = getUniverseData(selectedUniverse).filter((item: any) => {
    return (
      item.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Obter ícone do universo
  const getUniverseIcon = (universeId: string) => {
    const universe = universes.find((u) => u.id === universeId)
    const Icon = universe?.icon || TrendingUp
    return <Icon className="h-5 w-5" />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Visão de Mercado</h2>
          <p className="text-muted-foreground">Visualize e analise ativos de diferentes universos financeiros</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard">Voltar ao Dashboard</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue={selectedUniverse} onValueChange={setSelectedUniverse}>
        <TabsList className="grid grid-cols-5 mb-4">
          {universes.map((universe) => (
            <TabsTrigger key={universe.id} value={universe.id} className="flex items-center gap-2">
              <universe.icon className="h-4 w-4" />
              <span>{universe.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {universes.map((universe) => (
          <TabsContent key={universe.id} value={universe.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <universe.icon className="h-5 w-5" />
                <h3 className="text-xl font-semibold">{universe.name}</h3>
                <Badge variant="outline">{getUniverseData(universe.id).length} ativos</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={`Pesquisar ${universe.name.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            {showChart && selectedAsset && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Gráfico de Candlestick - {selectedAsset}</span>
                    <Button variant="outline" size="sm" onClick={() => setShowChart(false)}>
                      Fechar Gráfico
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <CandlestickChart />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticker</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="text-right">Preço</TableHead>
                      <TableHead className="text-right">Variação</TableHead>
                      <TableHead className="text-right">Volume</TableHead>
                      {universe.id === "stocks" && <TableHead className="text-right">Market Cap (B)</TableHead>}
                      {universe.id === "crypto" && <TableHead className="text-right">Market Cap (B)</TableHead>}
                      {universe.id === "forex" && <TableHead className="text-right">Open Interest</TableHead>}
                      {universe.id === "commodities" && <TableHead className="text-right">Open Interest</TableHead>}
                      {universe.id === "indices" && <TableHead className="text-right">Componentes</TableHead>}
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.ticker}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.price.toFixed(item.price < 1 ? 4 : 2)}</TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`flex items-center justify-end ${
                              item.change >= 0 ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {item.change >= 0 ? (
                              <ArrowUpIcon className="mr-1 h-4 w-4" />
                            ) : (
                              <ArrowDownIcon className="mr-1 h-4 w-4" />
                            )}
                            {Math.abs(item.changePercent).toFixed(2)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{formatNumber(item.volume)}</TableCell>
                        {universe.id === "stocks" && (
                          <TableCell className="text-right">
                            {item.marketCap !== undefined ? item.marketCap.toFixed(2) : "N/A"}
                          </TableCell>
                        )}
                        {universe.id === "crypto" && (
                          <TableCell className="text-right">
                            {item.marketCap !== undefined ? item.marketCap.toFixed(2) : "N/A"}
                          </TableCell>
                        )}
                        {universe.id === "forex" && (
                          <TableCell className="text-right">{formatNumber(item.openInterest)}</TableCell>
                        )}
                        {universe.id === "commodities" && (
                          <TableCell className="text-right">{formatNumber(item.openInterest)}</TableCell>
                        )}
                        {universe.id === "indices" && (
                          <TableCell className="text-right">{item.components || "N/A"}</TableCell>
                        )}
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAsset(item.ticker)
                              setShowChart(true)
                            }}
                          >
                            Ver Gráfico
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard?universe=${universe.id}&asset=${item.ticker}`}>Analisar</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
