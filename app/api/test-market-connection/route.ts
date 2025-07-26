import { NextResponse } from "next/server"

// Função para testar conexão com Alpha Vantage
async function testAlphaVantage(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=${apiKey}`,
    )

    if (!response.ok) {
      return false
    }

    const data = await response.json()

    // Verificar se a resposta contém dados válidos
    return !data["Error Message"] && !data["Information"] && data["Meta Data"]
  } catch (error) {
    console.error("Erro ao testar Alpha Vantage:", error)
    return false
  }
}

// Função para testar conexão com Binance
async function testBinance(apiKey: string): Promise<boolean> {
  try {
    // Para API pública da Binance, podemos simplesmente verificar se conseguimos obter o ticker
    const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT")

    if (!response.ok) {
      return false
    }

    const data = await response.json()

    // Verificar se a resposta contém dados válidos
    return !!data.symbol && !!data.price
  } catch (error) {
    console.error("Erro ao testar Binance:", error)
    return false
  }
}

// Função para testar conexão com Finnhub
async function testFinnhub(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=AAPL&token=${apiKey}`)

    if (!response.ok) {
      return false
    }

    const data = await response.json()

    // Verificar se a resposta contém dados válidos
    return typeof data.c === "number" && !data.error
  } catch (error) {
    console.error("Erro ao testar Finnhub:", error)
    return false
  }
}

// Função para testar conexão com Polygon
async function testPolygon(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/AAPL/prev?apiKey=${apiKey}`)

    if (!response.ok) {
      return false
    }

    const data = await response.json()

    // Verificar se a resposta contém dados válidos
    return data.status === "OK" && Array.isArray(data.results)
  } catch (error) {
    console.error("Erro ao testar Polygon:", error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.provider || !body.apiKey) {
      return NextResponse.json({ success: false, error: "Provedor ou chave de API não especificados" }, { status: 400 })
    }

    const { provider, apiKey } = body
    let isValid = false

    // Testar conexão com o provedor especificado
    switch (provider) {
      case "alphavantage":
        isValid = await testAlphaVantage(apiKey)
        break
      case "binance":
        isValid = await testBinance(apiKey)
        break
      case "finnhub":
        isValid = await testFinnhub(apiKey)
        break
      case "polygon":
        isValid = await testPolygon(apiKey)
        break
      default:
        return NextResponse.json({ success: false, error: "Provedor não suportado" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      isValid,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ success: false, error: "Erro ao processar requisição" }, { status: 500 })
  }
}
