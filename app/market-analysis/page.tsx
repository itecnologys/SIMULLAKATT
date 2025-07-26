"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { ArrowUpIcon, ArrowDownIcon, Star } from "lucide-react"
import Link from "next/link"
import { RefreshMarketDataButton } from "@/components/refresh-market-data-button"
import { subscribeToMarketData, type MarketData } from "@/lib/real-time-market-service"

export default function MarketAnalysisPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAsset, setSelectedAsset] = useState("AAPL")
  const [assetData, setAssetData] = useState<MarketData | null>(null)
  const [marketIndices, setMarketIndices] = useState<Record<string, MarketData>>({})
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString())
  const [activeTab, setActiveTab] = useState("analysis")

  // Carregar dados do ativo selecionado
  useEffect(() => {
    if (!selectedAsset) return

    const unsubscribe = subscribeToMarketData(selectedAsset, (data) => {
      setAssetData(data)
      setLastUpdated(new Date().toISOString())
    })

    return () => {
      unsubscribe()
    }
  }, [selectedAsset])

  // Carregar dados dos índices de mercado
  useEffect(() => {
    const indices = ["S&P500", "DOW", "NASDAQ", "FTSE100", "DAX"]
    const unsubscribes = indices.map((index) =>
      subscribeToMarketData(index, (data) => {
        setMarketIndices((prev) => ({
          ...prev,
          [index]: data,
        }))
        setLastUpdated(new Date().toISOString())
      }),
    )

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [])

  // Dados de estimativas de analistas (simulados)
  const analystData = {
    recommendations: {
      strongBuy: 18,
      buy: 12,
      hold: 7,
      underperform: 2,
      sell: 1,
    },
    priceTargets: {
      low: 170.62,
      average: 233.36,
      high: 300.0,
      current: assetData?.price || 205.35,
    },
    earnings: {
      currentQtr: {
        analysts: 28,
        avgEstimate: 1.41,
        lowEstimate: 1.32,
        highEstimate: 1.47,
      },
      nextQtr: {
        analysts: 27,
        avgEstimate: 1.65,
        lowEstimate: 1.47,
        highEstimate: 1.78,
      },
      currentYear: {
        analysts: 40,
        avgEstimate: 7.18,
        lowEstimate: 6.9,
        highEstimate: 7.63,
      },
      nextYear: {
        analysts: 41,
        avgEstimate: 7.89,
        lowEstimate: 6.85,
        highEstimate: 9.0,
      },
    },
    revenue: {
      currentQtr: 124.38,
      nextQtr: 128.45,
      currentYear: 385.12,
      nextYear: 412.67,
    },
  }

  // Formatar número com separador de milhares
  const formatNumber = (value: number): string => {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  // Formatar variação percentual
  const formatPercentChange = (value: number): string => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  // Formatar preço com base no valor
  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toFixed(6)
    if (price < 1) return price.toFixed(4)
    if (price < 10) return price.toFixed(3)
    if (price < 1000) return price.toFixed(2)
    return price.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  // Calcular total de recomendações
  const totalRecommendations =
    analystData.recommendations.strongBuy +
    analystData.recommendations.buy +
    analystData.recommendations.hold +
    analystData.recommendations.underperform +
    analystData.recommendations.sell

  // Calcular percentuais de recomendações
  const recommendationPercentages = {
    strongBuy: (analystData.recommendations.strongBuy / totalRecommendations) * 100,
    buy: (analystData.recommendations.buy / totalRecommendations) * 100,
    hold: (analystData.recommendations.hold / totalRecommendations) * 100,
    underperform: (analystData.recommendations.underperform / totalRecommendations) * 100,
    sell: (analystData.recommendations.sell / totalRecommendations) * 100,
  }

  // Função para atualizar dados
  const handleRefresh = () => {
    setLastUpdated(new Date().toISOString())
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="bg-card border-b pb-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Análise de Mercado</h1>
            </div>
            <div className="flex items-center gap-2">
              <RefreshMarketDataButton onRefresh={handleRefresh} />
              <Button variant="outline" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>

          {/* Barra de navegação secundária */}
          <div className="flex flex-wrap gap-4 mt-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/market-analysis">Resumo</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/market-analysis/chart">Gráficos</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/market-analysis/statistics">Estatísticas</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/market-analysis/historical">Dados Históricos</Link>
            </Button>
            <Button variant="ghost" size="sm" className="bg-muted" asChild>
              <Link href="/market-analysis">Análise</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Índices de Mercado */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {Object.entries(marketIndices).map(([index, data]) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col">
                  <div className="text-sm font-medium">{data.name || index}</div>
                  <div className="text-xl font-bold">{formatPrice(data.price)}</div>
                  <div
                    className={`flex items-center text-sm ${
                      data.changePercent >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {data.changePercent >= 0 ? (
                      <ArrowUpIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 mr-1" />
                    )}
                    <span>
                      {formatPercentChange(data.changePercent)} ({formatPrice(data.change)})
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cabeçalho do Ativo */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
            <div>
              <div className="text-sm text-muted-foreground">
                SIMULLAKT - Dados em tempo real {assetData?.source ? `(${assetData.source})` : ""}
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-bold">{selectedAsset}</h2>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Star className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-lg text-muted-foreground">{assetData?.name || "Apple Inc."}</div>
            </div>

            <div className="flex items-end gap-4">
              <div className="text-right">
                <div className="text-4xl font-bold">{assetData ? formatPrice(assetData.price) : "205.35"}</div>
                <div
                  className={`flex items-center justify-end text-lg ${
                    assetData && assetData.changePercent >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {assetData && assetData.changePercent >= 0 ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                  )}
                  <span>
                    {assetData ? formatPrice(assetData.change) : "-7.97"} (
                    {assetData ? formatPercentChange(assetData.changePercent) : "-3.74%"})
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Última atualização: {new Date(lastUpdated).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Análise de Pesquisa</h2>

        {/* Tabs de Análise */}
        <Tabs defaultValue="analysis" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="analysis">Análise de Analistas</TabsTrigger>
            <TabsTrigger value="earnings">Projeção de Lucros</TabsTrigger>
            <TabsTrigger value="revenue">Projeção de Receita</TabsTrigger>
            <TabsTrigger value="growth">Crescimento</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Recomendações de Analistas */}
              <Card>
                <CardHeader>
                  <CardTitle>Recomendações de Analistas</CardTitle>
                  <CardDescription>Baseado em {totalRecommendations} analistas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span>Compra Forte</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{analystData.recommendations.strongBuy}</span>
                        <Progress value={recommendationPercentages.strongBuy} className="w-20 bg-muted" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-300 mr-2"></div>
                        <span>Compra</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{analystData.recommendations.buy}</span>
                        <Progress value={recommendationPercentages.buy} className="w-20 bg-muted" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                        <span>Manter</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{analystData.recommendations.hold}</span>
                        <Progress value={recommendationPercentages.hold} className="w-20 bg-muted" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-300 mr-2"></div>
                        <span>Baixo Desempenho</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{analystData.recommendations.underperform}</span>
                        <Progress value={recommendationPercentages.underperform} className="w-20 bg-muted" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span>Vender</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{analystData.recommendations.sell}</span>
                        <Progress value={recommendationPercentages.sell} className="w-20 bg-muted" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preços-Alvo */}
              <Card>
                <CardHeader>
                  <CardTitle>Preços-Alvo dos Analistas</CardTitle>
                  <CardDescription>Próximos 12 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-20 mb-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-1 bg-muted"></div>
                    </div>
                    <div
                      className="absolute top-0 bottom-0 flex items-center"
                      style={{
                        left: `${
                          ((analystData.priceTargets.low - analystData.priceTargets.low) /
                            (analystData.priceTargets.high - analystData.priceTargets.low)) *
                          100
                        }%`,
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-muted-foreground">Baixo</div>
                        <div className="w-1 h-3 bg-muted-foreground"></div>
                        <div className="font-medium">{formatPrice(analystData.priceTargets.low)}</div>
                      </div>
                    </div>
                    <div
                      className="absolute top-0 bottom-0 flex items-center"
                      style={{
                        left: `${
                          ((analystData.priceTargets.current - analystData.priceTargets.low) /
                            (analystData.priceTargets.high - analystData.priceTargets.low)) *
                          100
                        }%`,
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-muted-foreground">Atual</div>
                        <div className="w-1 h-3 bg-primary"></div>
                        <div className="font-medium">{formatPrice(analystData.priceTargets.current)}</div>
                      </div>
                    </div>
                    <div
                      className="absolute top-0 bottom-0 flex items-center"
                      style={{
                        left: `${
                          ((analystData.priceTargets.average - analystData.priceTargets.low) /
                            (analystData.priceTargets.high - analystData.priceTargets.low)) *
                          100
                        }%`,
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-muted-foreground">Média</div>
                        <div className="w-1 h-3 bg-blue-500"></div>
                        <div className="font-medium">{formatPrice(analystData.priceTargets.average)}</div>
                      </div>
                    </div>
                    <div
                      className="absolute top-0 bottom-0 flex items-center"
                      style={{
                        left: `${
                          ((analystData.priceTargets.high - analystData.priceTargets.low) /
                            (analystData.priceTargets.high - analystData.priceTargets.low)) *
                          100
                        }%`,
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-muted-foreground">Alto</div>
                        <div className="w-1 h-3 bg-muted-foreground"></div>
                        <div className="font-medium">{formatPrice(analystData.priceTargets.high)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Preço Atual:</span>
                      <span className="font-medium">{formatPrice(analystData.priceTargets.current)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Preço-Alvo Médio:</span>
                      <span className="font-medium">{formatPrice(analystData.priceTargets.average)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Potencial de Alta:</span>
                      <span className="font-medium text-green-500">
                        {formatPercentChange(
                          ((analystData.priceTargets.average - analystData.priceTargets.current) /
                            analystData.priceTargets.current) *
                            100,
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Estimativas de Lucro por Ação */}
              <Card>
                <CardHeader>
                  <CardTitle>Lucro por Ação (EPS)</CardTitle>
                  <CardDescription>Estimativas trimestrais</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">Trimestre Atual</div>
                        <div className="text-2xl font-bold">
                          {analystData.earnings.currentQtr.avgEstimate.toFixed(2)}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">
                        Estimativa
                      </Badge>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Estimativa Baixa</span>
                        <span>{analystData.earnings.currentQtr.lowEstimate.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Estimativa Alta</span>
                        <span>{analystData.earnings.currentQtr.highEstimate.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Número de Analistas</span>
                        <span>{analystData.earnings.currentQtr.analysts}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Próximo Trimestre</span>
                      <span className="font-medium">{analystData.earnings.nextQtr.avgEstimate.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ano Atual</span>
                      <span className="font-medium">{analystData.earnings.currentYear.avgEstimate.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Próximo Ano</span>
                      <span className="font-medium">{analystData.earnings.nextYear.avgEstimate.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="earnings">
            <Card>
              <CardHeader>
                <CardTitle>Estimativas de Lucros</CardTitle>
                <CardDescription>Projeções trimestrais e anuais</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Período</TableHead>
                      <TableHead>Nº de Analistas</TableHead>
                      <TableHead>Estimativa Média</TableHead>
                      <TableHead>Estimativa Baixa</TableHead>
                      <TableHead>Estimativa Alta</TableHead>
                      <TableHead>Ano Anterior</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Trimestre Atual</TableCell>
                      <TableCell>{analystData.earnings.currentQtr.analysts}</TableCell>
                      <TableCell>{analystData.earnings.currentQtr.avgEstimate.toFixed(2)}</TableCell>
                      <TableCell>{analystData.earnings.currentQtr.lowEstimate.toFixed(2)}</TableCell>
                      <TableCell>{analystData.earnings.currentQtr.highEstimate.toFixed(2)}</TableCell>
                      <TableCell>1.40</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Próximo Trimestre</TableCell>
                      <TableCell>{analystData.earnings.nextQtr.analysts}</TableCell>
                      <TableCell>{analystData.earnings.nextQtr.avgEstimate.toFixed(2)}</TableCell>
                      <TableCell>{analystData.earnings.nextQtr.lowEstimate.toFixed(2)}</TableCell>
                      <TableCell>{analystData.earnings.nextQtr.highEstimate.toFixed(2)}</TableCell>
                      <TableCell>0.97</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Ano Atual</TableCell>
                      <TableCell>{analystData.earnings.currentYear.analysts}</TableCell>
                      <TableCell>{analystData.earnings.currentYear.avgEstimate.toFixed(2)}</TableCell>
                      <TableCell>{analystData.earnings.currentYear.lowEstimate.toFixed(2)}</TableCell>
                      <TableCell>{analystData.earnings.currentYear.highEstimate.toFixed(2)}</TableCell>
                      <TableCell>6.08</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Próximo Ano</TableCell>
                      <TableCell>{analystData.earnings.nextYear.analysts}</TableCell>
                      <TableCell>{analystData.earnings.nextYear.avgEstimate.toFixed(2)}</TableCell>
                      <TableCell>{analystData.earnings.nextYear.lowEstimate.toFixed(2)}</TableCell>
                      <TableCell>{analystData.earnings.nextYear.highEstimate.toFixed(2)}</TableCell>
                      <TableCell>7.18</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Estimativas de Receita</CardTitle>
                <CardDescription>Projeções trimestrais e anuais (em bilhões)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Receita Trimestral</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-muted-foreground">Trimestre Atual</div>
                          <div className="text-xl font-bold">${analystData.revenue.currentQtr}B</div>
                        </div>
                        <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50">
                          Estimativa
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-muted-foreground">Próximo Trimestre</div>
                          <div className="text-xl font-bold">${analystData.revenue.nextQtr}B</div>
                        </div>
                        <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50">
                          Estimativa
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Receita Anual</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-muted-foreground">Ano Atual</div>
                          <div className="text-xl font-bold">${analystData.revenue.currentYear}B</div>
                        </div>
                        <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50">
                          Estimativa
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-muted-foreground">Próximo Ano</div>
                          <div className="text-xl font-bold">${analystData.revenue.nextYear}B</div>
                        </div>
                        <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50">
                          Estimativa
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Crescimento de Receita</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Trimestre a Trimestre</div>
                        <div className="text-xl font-bold text-green-500">+3.27%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Ano a Ano (Trimestral)</div>
                        <div className="text-xl font-bold text-green-500">+8.15%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Ano Atual</div>
                        <div className="text-xl font-bold text-green-500">+7.42%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Próximo Ano</div>
                        <div className="text-xl font-bold text-green-500">+7.15%</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="growth">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Crescimento</CardTitle>
                <CardDescription>Projeções de crescimento e tendências</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Crescimento de Lucros</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Período</TableHead>
                          <TableHead>Crescimento</TableHead>
                          <TableHead>Indústria</TableHead>
                          <TableHead>Setor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Passado 5 anos</TableCell>
                          <TableCell className="text-green-500">+18.9%</TableCell>
                          <TableCell>+12.3%</TableCell>
                          <TableCell>+15.7%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Próximos 5 anos</TableCell>
                          <TableCell className="text-green-500">+14.2%</TableCell>
                          <TableCell>+10.8%</TableCell>
                          <TableCell>+12.5%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Próximo ano</TableCell>
                          <TableCell className="text-green-500">+9.8%</TableCell>
                          <TableCell>+8.5%</TableCell>
                          <TableCell>+9.1%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Crescimento de Receita</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Período</TableHead>
                          <TableHead>Crescimento</TableHead>
                          <TableHead>Indústria</TableHead>
                          <TableHead>Setor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Passado 5 anos</TableCell>
                          <TableCell className="text-green-500">+11.5%</TableCell>
                          <TableCell>+8.7%</TableCell>
                          <TableCell>+10.2%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Próximos 5 anos</TableCell>
                          <TableCell className="text-green-500">+8.9%</TableCell>
                          <TableCell>+7.2%</TableCell>
                          <TableCell>+8.1%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Próximo ano</TableCell>
                          <TableCell className="text-green-500">+7.2%</TableCell>
                          <TableCell>+6.5%</TableCell>
                          <TableCell>+6.8%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
