"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertCircle, Loader2, ExternalLink } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ApiConfig {
  id: string
  name: string
  key: string
  isValid: boolean
  lastValidated: string | null
  url: string
  description: string
  documentation: string
  freeTier: string
}

export default function ApiConfigurationForm() {
  const [apiConfigs, setApiConfigs] = useState<ApiConfig[]>([
    {
      id: "alpha_vantage",
      name: "Alpha Vantage",
      key: "",
      isValid: false,
      lastValidated: null,
      url: "https://www.alphavantage.co/",
      description: "Dados de mercado para ações, forex, criptomoedas e indicadores técnicos.",
      documentation: "https://www.alphavantage.co/documentation/",
      freeTier: "5 requisições/minuto, 500/dia",
    },
    {
      id: "twelve_data",
      name: "Twelve Data",
      key: "",
      isValid: false,
      lastValidated: null,
      url: "https://twelvedata.com/",
      description: "Dados em tempo real para ações, forex, criptomoedas e commodities.",
      documentation: "https://twelvedata.com/docs",
      freeTier: "800 requisições/dia, 8 chamadas simultâneas",
    },
    {
      id: "yahoo_finance",
      name: "Yahoo Finance",
      key: "",
      isValid: false,
      lastValidated: null,
      url: "https://www.yahoofinanceapi.com/",
      description: "Dados de mercado para ações, índices, forex e criptomoedas.",
      documentation: "https://www.yahoofinanceapi.com/tutorial",
      freeTier: "100 requisições/dia",
    },
    {
      id: "commodities_api",
      name: "Commodities-API",
      key: "",
      isValid: false,
      lastValidated: null,
      url: "https://commodities-api.com/",
      description: "Dados de preços para commodities como petróleo, ouro e prata.",
      documentation: "https://commodities-api.com/documentation",
      freeTier: "100 requisições/mês",
    },
    {
      id: "finnhub",
      name: "Finnhub",
      key: "",
      isValid: false,
      lastValidated: null,
      url: "https://finnhub.io/",
      description: "Dados em tempo real para ações, forex e criptomoedas.",
      documentation: "https://finnhub.io/docs/api",
      freeTier: "60 requisições/minuto",
    },
  ])

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [testResults, setTestResults] = useState<{ [key: string]: { success: boolean; message: string } }>({})
  const [isTesting, setIsTesting] = useState<{ [key: string]: boolean }>({})
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null)

  // Agrupar APIs por categoria
  const stockApis = apiConfigs.filter((config) => ["yahoo_finance", "alpha_vantage", "finnhub"].includes(config.id))
  const cryptoApis = apiConfigs.filter((config) => ["twelve_data", "finnhub"].includes(config.id))
  const commodityApis = apiConfigs.filter((config) => ["commodities_api", "twelve_data"].includes(config.id))
  const forexApis = apiConfigs.filter((config) => ["alpha_vantage", "twelve_data", "finnhub"].includes(config.id))

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

      // Simular uma chamada de API para teste
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simular sucesso para chaves com mais de 10 caracteres
      const success = config.key.length >= 10

      setTestResults((prev) => ({
        ...prev,
        [id]: {
          success,
          message: success ? "Conexão bem-sucedida!" : "Chave de API inválida ou muito curta",
        },
      }))

      // Atualizar status de validação
      if (success) {
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
    setSaveSuccess(null)
    try {
      // Simular uma chamada de API para salvar as configurações
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSaveSuccess(true)
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
      setSaveSuccess(false)
    } finally {
      setIsLoading(false)

      // Limpar mensagem de sucesso após 3 segundos
      if (saveSuccess) {
        setTimeout(() => {
          setSaveSuccess(null)
        }, 3000)
      }
    }
  }

  // Renderizar formulário de configuração de API
  const renderApiConfigForm = (config: ApiConfig) => (
    <div key={config.id} className="space-y-4 border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{config.name}</h3>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
        {config.isValid && (
          <div className="flex items-center text-xs text-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Validado em {config.lastValidated ? new Date(config.lastValidated).toLocaleString() : "N/A"}
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor={`api-key-${config.id}`}>Chave de API</Label>
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
      </div>

      {testResults[config.id] && (
        <Alert variant={testResults[config.id].success ? "default" : "destructive"}>
          {testResults[config.id].success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{testResults[config.id].message}</AlertDescription>
        </Alert>
      )}

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="info">
          <AccordionTrigger className="text-sm">Informações Adicionais</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Plano Gratuito:</span> {config.freeTier}
              </div>
              <div>
                <span className="font-medium">Site:</span>{" "}
                <a
                  href={config.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center"
                >
                  {config.url} <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
              <div>
                <span className="font-medium">Documentação:</span>{" "}
                <a
                  href={config.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center"
                >
                  Ver Documentação <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração de APIs</CardTitle>
        <CardDescription>
          Configure as chaves de API para acessar dados financeiros em tempo real. Estas APIs são usadas para obter
          dados precisos de preços e variações para diferentes ativos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stocks">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stocks">Ações e Índices</TabsTrigger>
            <TabsTrigger value="crypto">Criptomoedas</TabsTrigger>
            <TabsTrigger value="commodities">Commodities</TabsTrigger>
            <TabsTrigger value="forex">Forex</TabsTrigger>
          </TabsList>

          <TabsContent value="stocks" className="space-y-4 mt-4">
            {stockApis.map(renderApiConfigForm)}
          </TabsContent>

          <TabsContent value="crypto" className="space-y-4 mt-4">
            {cryptoApis.map(renderApiConfigForm)}
          </TabsContent>

          <TabsContent value="commodities" className="space-y-4 mt-4">
            {commodityApis.map(renderApiConfigForm)}
          </TabsContent>

          <TabsContent value="forex" className="space-y-4 mt-4">
            {forexApis.map(renderApiConfigForm)}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {saveSuccess === true && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Configurações salvas com sucesso!</AlertDescription>
          </Alert>
        )}

        {saveSuccess === false && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Erro ao salvar configurações. Tente novamente.</AlertDescription>
          </Alert>
        )}

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
