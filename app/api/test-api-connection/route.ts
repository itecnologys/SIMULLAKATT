import { NextResponse } from "next/server"

// Função para testar conexão com diferentes provedores de API
async function testApiConnection(provider: string, key: string) {
  // Em um ambiente real, isso faria chamadas reais para as APIs
  // Para fins de demonstração, vamos simular respostas

  switch (provider) {
    case "yahoo_finance":
      // Yahoo Finance não requer chave de API para endpoints básicos
      return { success: true }

    case "alpha_vantage":
      // Simular validação da chave Alpha Vantage
      if (key.length < 10) {
        return { success: false, error: "Chave de API inválida para Alpha Vantage" }
      }
      return { success: true }

    case "coingecko":
      // CoinGecko oferece endpoints gratuitos sem chave
      return { success: true }

    case "coinmarketcap":
      // Simular validação da chave CoinMarketCap
      if (!key.startsWith("cmk-")) {
        return { success: false, error: "Formato de chave inválido para CoinMarketCap" }
      }
      return { success: true }

    // Adicionar mais provedores conforme necessário

    default:
      // Para outros provedores, apenas verificar se a chave tem um comprimento mínimo
      if (key.length < 8) {
        return { success: false, error: "Chave de API muito curta" }
      }
      return { success: true }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const provider = searchParams.get("provider")
  const key = searchParams.get("key")

  if (!provider) {
    return NextResponse.json({ success: false, error: "Provedor não especificado" }, { status: 400 })
  }

  // Simular um pequeno atraso para mostrar o estado de carregamento na UI
  await new Promise((resolve) => setTimeout(resolve, 1500))

  try {
    const result = await testApiConnection(provider, key || "")

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Conexão bem-sucedida",
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || "Falha na conexão",
      })
    }
  } catch (error) {
    console.error("Erro ao testar conexão:", error)
    return NextResponse.json({ success: false, error: "Erro ao testar conexão com a API" }, { status: 500 })
  }
}
