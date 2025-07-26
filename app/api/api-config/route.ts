import { NextResponse } from "next/server"

// Dados de exemplo para configurações de API
// Em um ambiente real, isso seria armazenado em um banco de dados
let apiConfigs = [
  { id: "yahoo_finance", name: "Yahoo Finance", key: "", isValid: false, lastValidated: null },
  { id: "alpha_vantage", name: "Alpha Vantage", key: "", isValid: false, lastValidated: null },
  { id: "finnhub", name: "Finnhub", key: "", isValid: false, lastValidated: null },
  { id: "coingecko", name: "CoinGecko", key: "", isValid: false, lastValidated: null },
  { id: "coinmarketcap", name: "CoinMarketCap", key: "", isValid: false, lastValidated: null },
  { id: "binance", name: "Binance", key: "", isValid: false, lastValidated: null },
  { id: "fixer", name: "Fixer.io", key: "", isValid: false, lastValidated: null },
  { id: "exchangerate", name: "ExchangeRate-API", key: "", isValid: false, lastValidated: null },
  { id: "oanda", name: "OANDA", key: "", isValid: false, lastValidated: null },
]

export async function GET() {
  return NextResponse.json({
    success: true,
    configs: apiConfigs,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.configs || !Array.isArray(body.configs)) {
      return NextResponse.json({ success: false, error: "Formato de dados inválido" }, { status: 400 })
    }

    // Atualizar configurações
    apiConfigs = body.configs

    return NextResponse.json({
      success: true,
      message: "Configurações salvas com sucesso",
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ success: false, error: "Erro ao processar requisição" }, { status: 500 })
  }
}
