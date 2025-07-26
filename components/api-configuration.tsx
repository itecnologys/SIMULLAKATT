"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface ApiConfig {
  id: string
  name: string
  key: string
  isValid: boolean
  lastValidated: string | null
}

export default function ApiConfiguration() {
  const [apiConfigs, setApiConfigs] = useState<ApiConfig[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [testResults, setTestResults] = useState<{ [key: string]: { success: boolean; message: string } }>({})
  const [isTesting, setIsTesting] = useState<{ [key: string]: boolean }>({})

  // Carregar configurações de API existentes
  useEffect(() => {
    const fetchApiConfigs = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/api-config")
        const data = await response.json()

        if (data.success) {
          setApiConfigs(data.configs)
        } else {
          console.error("Erro ao buscar configurações de API:", data.error)
        }
      } catch (error) {
        console.error("Erro ao buscar configurações de API:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchApiConfigs()
  }, [])

  // Atualizar chave de API
  const handleUpdateApiKey = async (id: string, key: string) => {
    const updatedConfigs = apiConfigs.map((config) => (config.id === id ? { ...config, key } : config))
    setApiConfigs(updatedConfigs)
  }

  // Testar conexão com API
  const handleTestConnection = async (id: string) => {
    setIsTesting((prev) => ({ ...prev, [id]: true }))
    try {
      const config = apiConfigs.find((config) => config.id === id)
      if (!config || !config.key) {
        setTestResults((prev) => ({
          ...prev,
          [id]: { success: false, message: "Chave de API não fornecida" },
        }))
        return
      }

      const response = await fetch(`/api/test-api-connection?provider=${id}&key=${config.key}`)
      const data = await response.json()

      setTestResults((prev) => ({
        ...prev,
        [id]: {
          success: data.success,
          message: data.success ? "Conexão bem-sucedida!" : data.error,
        },
      }))

      // Atualizar status de validação
      if (data.success) {
        const updatedConfigs = apiConfigs.map((config) =>
          config.id === id
            ? {
                ...config,
                isValid: true,
                lastValidated: new Date().toISOString(),
              }
            : config,
        )
        setApiConfigs(updatedConfigs)
      }
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        [id]: { success: false, message: "Erro ao testar conexão" },
      }))
    } finally {
      setIsTesting((prev) => ({ ...prev, [id]: false }))
    }
  }

  // Salvar todas as configurações
  const handleSaveAllConfigs = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/api-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ configs: apiConfigs }),
      })

      const data = await response.json()

      if (data.success) {
        // Mostrar mensagem de sucesso
        alert("Configurações salvas com sucesso!")
      } else {
        console.error("Erro ao salvar configurações:", data.error)
        alert("Erro ao salvar configurações: " + data.error)
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
      alert("Erro ao salvar configurações")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && apiConfigs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configuração de APIs</CardTitle>
          <CardDescription>Gerenciar chaves de API para provedores de dados financeiros</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  // Agrupar APIs por categoria
  const stockApis = apiConfigs.filter((config) => ["yahoo_finance", "alpha_vantage", "finnhub"].includes(config.id))
  const cryptoApis = apiConfigs.filter((config) => ["coingecko", "coinmarketcap", "binance"].includes(config.id))
  const forexApis = apiConfigs.filter((config) => ["fixer", "exchangerate", "oanda"].includes(config.id))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração de APIs</CardTitle>
        <CardDescription>Gerenciar chaves de API para provedores de dados financeiros</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stocks">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stocks">Ações e Índices</TabsTrigger>
            <TabsTrigger value="crypto">Criptomoedas</TabsTrigger>
            <TabsTrigger value="forex">Forex e Commodities</TabsTrigger>
          </TabsList>

          <TabsContent value="stocks" className="space-y-4 mt-4">
            {stockApis.map((config) => (
              <div key={config.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`api-key-${config.id}`}>{config.name}</Label>
                  {config.isValid && (
                    <div className="flex items-center text-xs text-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Validado em {config.lastValidated ? new Date(config.lastValidated).toLocaleString() : "N/A"}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Input
                    id={`api-key-${config.id}`}
                    type="password"
                    placeholder="Insira sua chave de API"
                    value={config.key || ""}
                    onChange={(e) => handleUpdateApiKey(config.id, e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection(config.id)}
                    disabled={isTesting[config.id] || !config.key}
                  >
                    {isTesting[config.id] ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Testar
                  </Button>
                </div>
                {testResults[config.id] && (
                  <Alert variant={testResults[config.id].success ? "default" : "destructive"}>
                    {testResults[config.id].success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>{testResults[config.id].message}</AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="crypto" className="space-y-4 mt-4">
            {cryptoApis.map((config) => (
              <div key={config.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`api-key-${config.id}`}>{config.name}</Label>
                  {config.isValid && (
                    <div className="flex items-center text-xs text-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Validado em {config.lastValidated ? new Date(config.lastValidated).toLocaleString() : "N/A"}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Input
                    id={`api-key-${config.id}`}
                    type="password"
                    placeholder="Insira sua chave de API"
                    value={config.key || ""}
                    onChange={(e) => handleUpdateApiKey(config.id, e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection(config.id)}
                    disabled={isTesting[config.id] || !config.key}
                  >
                    {isTesting[config.id] ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Testar
                  </Button>
                </div>
                {testResults[config.id] && (
                  <Alert variant={testResults[config.id].success ? "default" : "destructive"}>
                    {testResults[config.id].success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>{testResults[config.id].message}</AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="forex" className="space-y-4 mt-4">
            {forexApis.map((config) => (
              <div key={config.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`api-key-${config.id}`}>{config.name}</Label>
                  {config.isValid && (
                    <div className="flex items-center text-xs text-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Validado em {config.lastValidated ? new Date(config.lastValidated).toLocaleString() : "N/A"}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Input
                    id={`api-key-${config.id}`}
                    type="password"
                    placeholder="Insira sua chave de API"
                    value={config.key || ""}
                    onChange={(e) => handleUpdateApiKey(config.id, e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection(config.id)}
                    disabled={isTesting[config.id] || !config.key}
                  >
                    {isTesting[config.id] ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Testar
                  </Button>
                </div>
                {testResults[config.id] && (
                  <Alert variant={testResults[config.id].success ? "default" : "destructive"}>
                    {testResults[config.id].success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>{testResults[config.id].message}</AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSaveAllConfigs} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Todas as Configurações"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
