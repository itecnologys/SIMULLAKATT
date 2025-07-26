"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { BarChart2, Bitcoin, DollarSign, Droplet, Globe, Search, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"

// Definição dos universos disponíveis
const universes = [
  { id: "stocks", name: "Bolsa de Valores", icon: BarChart2, color: "bg-blue-500" },
  { id: "crypto", name: "Criptomoedas", icon: Bitcoin, color: "bg-orange-500" },
  { id: "forex", name: "Forex", icon: DollarSign, color: "bg-green-500" },
  { id: "commodities", name: "Commodities", icon: Droplet, color: "bg-amber-500" },
  { id: "indices", name: "Índices", icon: TrendingUp, color: "bg-purple-500" },
]

interface UniverseSelectorProps {
  onUniverseChange: (universe: string) => void
  onAssetChange: (asset: string) => void
}

export default function UniverseSelector({ onUniverseChange, onAssetChange }: UniverseSelectorProps) {
  const [selectedUniverse, setSelectedUniverse] = useState<string>("")
  const [assets, setAssets] = useState<{ id: string; name: string }[]>([])
  const [selectedAsset, setSelectedAsset] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredAssets, setFilteredAssets] = useState<{ id: string; name: string }[]>([])

  // Buscar ativos quando o universo for selecionado
  useEffect(() => {
    if (!selectedUniverse) return

    const fetchAssets = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/assets?universe=${selectedUniverse}`)
        const data = await response.json()

        if (data.success) {
          setAssets(data.assets)
          setFilteredAssets(data.assets)
        } else {
          console.error("Erro ao buscar ativos:", data.error)
          setAssets([])
          setFilteredAssets([])
        }
      } catch (error) {
        console.error("Erro ao buscar ativos:", error)
        setAssets([])
        setFilteredAssets([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssets()
  }, [selectedUniverse])

  // Filtrar ativos com base no termo de pesquisa
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAssets(assets)
      return
    }

    const filtered = assets.filter(
      (asset) =>
        asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredAssets(filtered)
  }, [searchTerm, assets])

  // Atualizar o universo selecionado
  const handleUniverseChange = (value: string) => {
    setSelectedUniverse(value)
    setSelectedAsset("")
    setSearchTerm("")
    onUniverseChange(value)
  }

  // Atualizar o ativo selecionado
  const handleAssetChange = (value: string) => {
    setSelectedAsset(value)
    onAssetChange(value)
  }

  // Obter ícone do universo
  const getUniverseIcon = (universeId: string) => {
    const universe = universes.find((u) => u.id === universeId)
    const Icon = universe?.icon || Globe
    return <Icon className="h-5 w-5" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {selectedUniverse ? (
            <>
              {getUniverseIcon(selectedUniverse)}
              <span>Selecione o Ativo</span>
            </>
          ) : (
            <span>Selecione o Universo e Ativo</span>
          )}
        </CardTitle>
        <CardDescription>Escolha um universo financeiro e um ativo para análise detalhada</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Universo Financeiro</label>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {universes.map((universe) => (
              <Badge
                key={universe.id}
                variant={selectedUniverse === universe.id ? "default" : "outline"}
                className={`flex items-center gap-1 px-3 py-2 cursor-pointer ${
                  selectedUniverse === universe.id ? universe.color : ""
                }`}
                onClick={() => handleUniverseChange(universe.id)}
              >
                <universe.icon className="h-4 w-4" />
                <span>{universe.name}</span>
              </Badge>
            ))}
          </div>
        </div>

        {selectedUniverse && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Ativo/Índice</label>
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar ativos..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {filteredAssets.length > 0 ? (
                  <div className="max-h-[200px] overflow-y-auto border rounded-md">
                    {filteredAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className={`px-3 py-2 cursor-pointer hover:bg-muted ${
                          selectedAsset === asset.id ? "bg-primary/10 font-medium" : ""
                        }`}
                        onClick={() => handleAssetChange(asset.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{asset.id}</div>
                          <Badge variant="outline" className="text-xs">
                            {getUniverseIcon(selectedUniverse)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{asset.name}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground border rounded-md">
                    {searchTerm ? "Nenhum ativo encontrado" : "Nenhum ativo disponível"}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {selectedAsset && (
          <div className="pt-2">
            <Badge className="px-3 py-1.5">
              {getUniverseIcon(selectedUniverse)}
              <span className="ml-1">{selectedAsset}</span>
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Ativo selecionado para análise. Veja os detalhes no painel à direita.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
