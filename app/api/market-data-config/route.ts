import { NextResponse } from "next/server"

// Armazenamento temporário para configurações de API (em produção, usar banco de dados)
const apiConfigs: {
  provider: string
  apiKey: string
  isEnabled: boolean
  lastTested: string | null
  isValid: boolean
}[] = [
  { provider: "alphavantage", apiKey: "", isEnabled: false, lastTested: null, isValid: false },
  { provider: "binance", apiKey: "", isEnabled: false, lastTested: null, isValid: false },
  { provider: "finnhub", apiKey: "", isEnabled: false, lastTested: null, isValid: false },
  { provider: "polygon", apiKey: "", isEnabled: false, lastTested: null, isValid: false },
]

export async function GET() {
  // Retornar configurações sem as chaves de API por segurança
  const safeConfigs = apiConfigs.map((config) => ({
    ...config,
    apiKey: config.apiKey ? "••••••••" : "",
  }))

  return NextResponse.json({
    success: true,
    configs: safeConfigs,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.configs || !Array.isArray(body.configs)) {
      return NextResponse.json({ success: false, error: "Formato de dados inválido" }, { status: 400 })
    }

    // Atualizar apenas as configurações que foram enviadas
    body.configs.forEach((newConfig: any) => {
      const existingConfig = apiConfigs.find((c) => c.provider === newConfig.provider)

      if (existingConfig) {
        // Não sobrescrever a apiKey se for enviada como '••••••••'
        if (newConfig.apiKey && newConfig.apiKey !== "••••••••") {
          existingConfig.apiKey = newConfig.apiKey
        }

        if (typeof newConfig.isEnabled === "boolean") {
          existingConfig.isEnabled = newConfig.isEnabled
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: "Configurações salvas com sucesso",
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ success: false, error: "Erro ao processar requisição" }, { status: 500 })
  }
}
