"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { initializeMarketDataService } from "@/lib/real-time-market-service"

interface ApiConfig {
  provider: string
  apiKey: string
  isEnabled: boolean
  lastTested: string | null
  isValid: boolean
}

export function MarketDataConfig() {
  const [configs, setConfigs] = useState<ApiConfig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState<Record<string, boolean>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Carregar configurações
  useEffect(() => {
    async function loadConfigs() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/market-data-config")

        if (!response.ok) {
          throw new Error(`Erro ao carregar configurações: ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
          setConfigs(data.configs)
        } else {
          throw new Error(data.error || "Erro desconhecido ao carregar configurações")
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error)
        setError(error instanceof Error ? error.message : "Erro desconhecido")
      } finally {
        setIsLoading(false)
      }
    }

    loadConfigs()
  }, [])

  // Atualizar configuração
  const updateConfig = (index: number, field: keyof ApiConfig, value: any) => {
    const newConfigs = [...configs]
    newConfigs[index] = { ...newConfigs[index], [field]: value }
    setConfigs(newConfigs)
  }

  // Testar conexão com API
  const testConnection = async (provider: string, apiKey: string, index: number) => {
    setIsTesting((prev) => ({ ...prev, [provider]: true }))
    setError(null)

    try {
      const response = await fetch("/api/test-market-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ provider, apiKey }),
      })

      if (!response.ok) {
        throw new Error(`Erro ao testar conexão: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        updateConfig(index, "isValid", data.isValid)
        updateConfig(index, "lastTested", data.timestamp)

        setSuccessMessage(
          `Teste de conexão com ${getProviderName(provider)} ${data.isValid ? "bem-sucedido" : "falhou"}`,
        )
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        throw new Error(data.error || "Erro desconhecido ao testar conexão")
      }
    } catch (error) {
      console.error("Erro ao testar conexão:", error)
      setError(error instanceof Error ? error.message : "Erro desconhecido")
    } finally {
      setIsTesting((prev) => ({ ...prev, [provider]: false }))
    }
  }

  // Salvar configurações
  const saveConfigs = async () => {
    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch("/api/market-data-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ configs }),
      })

      if (!response.ok) {
        throw new Error(`Erro ao salvar configurações: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setSuccessMessage("Configurações salvas com sucesso")
        setTimeout(() => setSuccessMessage(null), 3000)

        // Inicializar serviço de dados de mercado com as novas configurações
        const apiKeys: Record<string, string> = {}
        configs.forEach((config) => {
          if (config.isEnabled && config.isValid && config.apiKey) {
            apiKeys[config.provider] = config.apiKey
          }
        })

        await initializeMarketDataService(apiKeys)
      } else {
        throw new Error(data.error || "Erro desconhecido ao salvar configurações")
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
      setError(error instanceof Error ? error.message : "Erro desconhecido")
    } finally {
      setIsSaving(false)
    }
  }

  // Obter nome amigável do provedor
  const getProviderName = (provider: string): string => {
    const names: Record<string, string> = {
      alphavantage: "Alpha Vantage",
      binance: "Binance",
      finnhub: "Finnhub",
      polygon: "Polygon.io",
    }

    return names[provider] || provider
  }

  // Obter descrição do provedor
  const getProviderDescription = (provider: string): string => {
    const descriptions: Record<string, string> = {
      alphavantage:
        "API para dados de ações, forex e criptomoedas. Ideal para dados históricos e indicadores técnicos.",
      binance: "API para dados de criptomoedas em tempo real. Oferece dados de preços, orderbooks e trades.",
      finnhub: "API para dados financeiros de ações, forex e criptomoedas. Inclui notícias e dados fundamentais.",
      polygon: "API para dados de mercado em tempo real e históricos. Cobertura ampla de ações, opções e forex.",
    }

    return descriptions[provider] || "Provedor de dados financeiros"
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <RefreshCw className="h-5 w-5 animate-spin mr-2" />
          <span>Carregando configurações...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuração de APIs de Dados Financeiros</CardTitle>
          <CardDescription>
            Configure as APIs para obter dados financeiros em tempo real. Você pode usar APIs gratuitas ou pagas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {configs.map((config, index) => (
              <Card key={config.provider} className="border border-muted">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">{getProviderName(config.provider)}</CardTitle>
                      <CardDescription>{getProviderDescription(config.provider)}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`enable-${config.provider}`}
                        checked={config.isEnabled}
                        onCheckedChange={(checked) => updateConfig(index, "isEnabled", checked)}
                      />
                      <Label htmlFor={`enable-${config.provider}`}>{config.isEnabled ? "Ativado" : "Desativado"}</Label>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`apikey-${config.provider}`}>Chave de API</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`apikey-${config.provider}`}
                          type="password"
                          placeholder="Digite sua chave de API"
                          value={config.apiKey}
                          onChange={(e) => updateConfig(index, "apiKey", e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          onClick={() => testConnection(config.provider, config.apiKey, index)}
                          disabled={!config.apiKey || isTesting[config.provider]}
                        >
                          {isTesting[config.provider] ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : "Testar"}
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div>
                        {config.lastTested && (
                          <span className="text-muted-foreground">
                            Último teste: {new Date(config.lastTested).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div>
                        {config.lastTested && (
                          <Badge variant={config.isValid ? "default" : "destructive"}>
                            {config.isValid ? "Válido" : "Inválido"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveConfigs} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              "Salvar Configurações"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sobre os Provedores de Dados</CardTitle>
          <CardDescription>Informações sobre os provedores de dados suportados e suas limitações.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Alpha Vantage</h3>
              <p className="text-sm text-muted-foreground">
                Oferece dados gratuitos com limite de 5 requisições por minuto e 500 por dia. Registre-se em{" "}
                <a
                  href="https://www.alphavantage.co/support/#api-key"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  alphavantage.co
                </a>{" "}
                para obter uma chave gratuita.
              </p>
            </div>

            <div>
              <h3 className="font-medium">Binance</h3>
              <p className="text-sm text-muted-foreground">
                Oferece dados de criptomoedas em tempo real sem necessidade de chave para dados públicos. Para
                funcionalidades avançadas, registre-se em{" "}
                <a
                  href="https://www.binance.com/en/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  binance.com
                </a>
                .
              </p>
            </div>

            <div>
              <h3 className="font-medium">Finnhub</h3>
              <p className="text-sm text-muted-foreground">
                Oferece dados gratuitos com limite de 60 requisições por minuto. Registre-se em{" "}
                <a
                  href="https://finnhub.io/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  finnhub.io
                </a>{" "}
                para obter uma chave gratuita.
              </p>
            </div>

            <div>
              <h3 className="font-medium">Polygon.io</h3>
              <p className="text-sm text-muted-foreground">
                Oferece dados gratuitos com acesso a dados históricos com atraso de 15 minutos. Registre-se em{" "}
                <a
                  href="https://polygon.io/dashboard/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  polygon.io
                </a>{" "}
                para obter uma chave gratuita.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
