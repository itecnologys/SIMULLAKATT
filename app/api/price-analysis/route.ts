import { NextResponse } from "next/server"

// Função para gerar dados de preço aleatórios para os últimos 7 dias
function generatePriceData(basePrice: number, volatility: number, universe: string, asset: string) {
  try {
    const now = new Date()
    const priceData = []

    // Ajustar volatilidade com base no ativo específico
    let adjustedVolatility = volatility
    if (universe === "commodities" && asset === "OIL") {
      // Petróleo tem volatilidade específica baseada no exemplo
      adjustedVolatility = 0.015 // 1.5% de volatilidade
    }

    // Gerar dados para os últimos 7 dias com intervalos de 1 hora
    for (let i = 0; i < 7 * 24; i++) {
      const timestamp = new Date(now.getTime() - (7 * 24 - i) * 60 * 60 * 1000)

      // Gerar um preço aleatório com base no preço anterior
      // Para petróleo, usar padrão mais realista baseado no exemplo
      let randomChange
      if (universe === "commodities" && asset === "OIL") {
        // Simular o padrão de queda e recuperação mencionado no exemplo
        const dayOfWeek = Math.floor(i / 24)
        if (dayOfWeek < 3) {
          // Primeiros dias: tendência de queda
          randomChange = (Math.random() - 0.6) * 2 * adjustedVolatility
        } else {
          // Últimos dias: tendência de recuperação
          randomChange = (Math.random() - 0.4) * 2 * adjustedVolatility
        }
      } else {
        // Padrão normal para outros ativos
        randomChange = (Math.random() - 0.5) * 2 * adjustedVolatility
      }

      const price = i === 0 ? basePrice : priceData[i - 1].price * (1 + randomChange)

      priceData.push({
        timestamp: timestamp.toISOString(),
        price: Number.parseFloat(price.toFixed(2)),
      })
    }

    return priceData
  } catch (error) {
    console.error("Erro ao gerar dados de preço:", error)
    return []
  }
}

// Função para calcular variações de preço em diferentes períodos
function calculateVariations(priceData: any[], universe: string, asset: string) {
  try {
    if (!priceData || priceData.length === 0) {
      return []
    }

    const periods = [
      { id: "15m", label: "15 minutos", intervals: 0.25 },
      { id: "1h", label: "1 hora", intervals: 1 },
      { id: "4h", label: "4 horas", intervals: 4 },
      { id: "6h", label: "6 horas", intervals: 6 },
      { id: "24h", label: "24 horas", intervals: 24 },
      { id: "1w", label: "1 semana", intervals: 24 * 7 },
    ]

    const variationData = periods.map((period) => {
      const intervalHours = period.intervals
      // Garantir que temos pelo menos 1 ponto de dados
      const dataPoints = Math.max(1, Math.floor((intervalHours * 60) / 60))

      // Calcular variações para cada dia
      const variations = []

      // Ajustar cálculos para petróleo se aplicável
      let adjustedCalculation = false
      if (universe === "commodities" && asset === "OIL") {
        adjustedCalculation = true
      }

      // Para cada dia dos últimos 7 dias
      for (let day = 0; day < 7; day++) {
        const dayStart = day * 24
        const dayEnd = Math.min((day + 1) * 24 - 1, priceData.length - 1)

        if (dayStart >= priceData.length || dayEnd >= priceData.length) {
          continue
        }

        // Calcular variações para cada período dentro do dia
        const dayVariations = []

        for (let i = dayStart; i <= dayEnd - dataPoints; i += dataPoints) {
          if (i + dataPoints - 1 >= priceData.length) {
            break
          }

          const startPrice = priceData[i].price
          const endPrice = priceData[i + dataPoints - 1].price
          let variation = ((endPrice - startPrice) / startPrice) * 100

          // Para petróleo, ajustar com base no exemplo fornecido
          if (adjustedCalculation) {
            // Adicionar um fator de realismo baseado no exemplo do petróleo
            if (period.id === "15m") {
              // Variação de 0.1% a 0.5%
              variation = variation * 0.8 + (Math.random() * 0.4 - 0.2)
            } else if (period.id === "1h") {
              // Variação de 0.5% a 1.5%
              variation = variation * 0.9 + (Math.random() * 0.6 - 0.3)
            } else if (period.id === "4h") {
              // Variação de 1% a 3%
              variation = variation * 1.1 + (Math.random() * 0.8 - 0.4)
            }
          }

          dayVariations.push(variation)
        }

        // Calcular a média das variações do dia
        if (dayVariations.length > 0) {
          const avgVariation = dayVariations.reduce((sum, val) => sum + val, 0) / dayVariations.length

          variations.push({
            day: `Dia ${day + 1}`,
            value: avgVariation,
            formattedValue: `${avgVariation.toFixed(2)}%`,
            isPositive: avgVariation >= 0,
          })
        }
      }

      return {
        period: period.id,
        label: period.label,
        variations,
      }
    })

    return variationData
  } catch (error) {
    console.error("Erro ao calcular variações:", error)
    return []
  }
}

// Informações detalhadas sobre ativos específicos
const assetDetails: Record<string, Record<string, any>> = {
  commodities: {
    OIL: {
      name: "Petróleo Bruto (WTI)",
      description:
        "West Texas Intermediate (WTI), o benchmark para o petróleo bruto nos EUA, usado como referência para preços do petróleo e derivados.",
      volatility: 0.015, // 1.5% de volatilidade
      context: "O petróleo é influenciado por fatores geopolíticos, estoques, demanda global e decisões da OPEP+.",
      detailedAnalysis: {
        "15m": {
          percentRange: "0.1% - 0.5%",
          valueRange: "$0.06 - $0.32",
          context:
            "Durante um dia de trading, o WTI pode variar de 0.1% a 0.5% em intervalos de 15 minutos, dependendo da volatilidade.",
        },
        "1h": {
          percentRange: "0.5% - 1.5%",
          valueRange: "$0.30 - $0.95",
          context: "Variações horárias tendem a ser de 0.5% a 1.5% em dias voláteis.",
        },
        "4h": {
          percentRange: "1% - 3%",
          valueRange: "$0.63 - $1.90",
          context: "Em 4 horas, a variação pode ser de 1% a 3%, considerando o preço médio de $63.50.",
        },
        "6h": {
          percentRange: "1.5% - 4%",
          valueRange: "$0.95 - $2.54",
          context: "Variações de 1.5% a 4% em 6 horas, com fatores macroeconômicos influenciando mais.",
        },
        "24h": {
          percentRange: "~0.33% (média)",
          valueRange: "~$0.21 (média)",
          context: "A variação diária média é de ~$0.21/barril (0.33% por dia).",
        },
        "1w": {
          percentRange: "+2.42%",
          valueRange: "+$1.50",
          context: "Variação total de +$1.50/barril, ou +2.42% em 7 dias.",
        },
      },
    },
    GOLD: {
      name: "Ouro",
      description:
        "Metal precioso usado como reserva de valor e em joalheria, considerado um ativo de refúgio em tempos de incerteza econômica.",
      volatility: 0.01, // 1% de volatilidade
      context: "O ouro é influenciado por taxas de juros, inflação, valor do dólar e incertezas geopolíticas.",
    },
  },
  crypto: {
    BTC: {
      name: "Bitcoin",
      description:
        "A primeira e mais valiosa criptomoeda, criada em 2009 como um sistema de pagamento descentralizado.",
      volatility: 0.03, // 3% de volatilidade
      context:
        "O Bitcoin é conhecido por sua alta volatilidade, influenciado por adoção institucional, regulamentação e sentimento de mercado.",
    },
    ETH: {
      name: "Ethereum",
      description:
        "Uma plataforma blockchain que permite a criação de contratos inteligentes e aplicações descentralizadas (dApps).",
      volatility: 0.035, // 3.5% de volatilidade
      context:
        "O Ethereum é influenciado por atualizações de rede, adoção de DeFi e NFTs, e competição com outras blockchains.",
    },
  },
}

// Preços base para diferentes universos
const basePrices: Record<string, Record<string, number>> = {
  stocks: {
    AAPL: 180.95,
    MSFT: 340.67,
    AMZN: 130.36,
    GOOGL: 140.23,
    META: 325.78,
    PETR4: 36.75,
    ITUB4: 32.5,
    // Outros ativos...
  },
  crypto: {
    BTC: 95533.53, // Valor atualizado do Bitcoin
    ETH: 4875.32, // Valor atualizado do Ethereum
    BNB: 605.87,
    SOL: 148.45,
    ADA: 0.65,
    // Outros ativos...
  },
  forex: {
    "EUR/USD": 1.0845,
    "USD/JPY": 149.67,
    "GBP/USD": 1.2654,
    "USD/CHF": 0.8765,
    "AUD/USD": 0.6543,
    // Outros ativos...
  },
  commodities: {
    GOLD: 2320.5, // Valor atualizado do Ouro
    OIL: 78.5, // Valor atualizado do Petróleo
    SILVER: 28.78,
    NATURAL_GAS: 2.14,
    COPPER: 3.89,
    // Outros ativos...
  },
  indices: {
    "S&P500": 5126.0, // Valor atualizado do S&P 500
    NASDAQ: 16982.34,
    DOW: 38654.23,
    FTSE100: 7612.45,
    DAX: 16952.87,
    IBOV: 127850.0, // Valor atualizado do Ibovespa
    // Outros ativos...
  },
}

// Volatilidade para diferentes universos
const volatility: Record<string, number> = {
  stocks: 0.01, // 1% de volatilidade
  crypto: 0.03, // 3% de volatilidade
  forex: 0.005, // 0.5% de volatilidade
  commodities: 0.015, // 1.5% de volatilidade
  indices: 0.008, // 0.8% de volatilidade
}

// Função para obter informações detalhadas do ativo
function getAssetInfo(universe: string, asset: string, currentPrice: number) {
  // Verificar se temos informações detalhadas para este ativo
  const assetInfo = assetDetails[universe]?.[asset]

  if (assetInfo) {
    return {
      name: assetInfo.name,
      description: assetInfo.description,
      currentPrice: currentPrice,
      currency: universe === "forex" ? "" : "$",
      context: assetInfo.context,
      detailedAnalysis: assetInfo.detailedAnalysis,
    }
  }

  // Informações padrão se não tivermos detalhes específicos
  return {
    name: asset,
    description: `Ativo do universo ${universe}`,
    currentPrice: currentPrice,
    currency: universe === "forex" ? "" : "$",
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const universe = searchParams.get("universe")
    const asset = searchParams.get("asset")

    if (!universe || !asset) {
      return NextResponse.json({ success: false, error: "Universo ou ativo não especificado" }, { status: 400 })
    }

    // Verificar se o universo é válido
    if (!volatility[universe]) {
      return NextResponse.json({ success: false, error: "Universo inválido" }, { status: 400 })
    }

    // Obter preço base para o ativo (ou usar um valor padrão)
    const universeAssets = basePrices[universe] || {}
    const basePrice = universeAssets[asset] || 100

    // Gerar dados de preço
    const priceData = generatePriceData(basePrice, volatility[universe], universe, asset)

    // Calcular variações
    const variationData = calculateVariations(priceData, universe, asset)

    // Obter informações detalhadas do ativo
    const currentPrice = priceData.length > 0 ? priceData[priceData.length - 1].price : basePrice
    const assetInfo = getAssetInfo(universe, asset, currentPrice)

    // Simular um pequeno atraso para mostrar o estado de carregamento na UI
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Adicionar timestamp aos dados retornados
    return NextResponse.json({
      success: true,
      priceData,
      variationData,
      assetInfo,
      timestamp: new Date().toISOString(),
      source: "API de Mercado",
    })
  } catch (error) {
    console.error("Erro na API de análise de preços:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao processar a solicitação",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
