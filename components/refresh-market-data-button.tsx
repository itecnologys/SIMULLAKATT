"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface RefreshMarketDataButtonProps {
  onRefresh?: () => void
}

export function RefreshMarketDataButton({ onRefresh }: RefreshMarketDataButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const handleRefresh = async () => {
    if (isRefreshing) return

    setIsRefreshing(true)

    try {
      // Simular atualização
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (onRefresh) {
        onRefresh()
      }

      toast({
        title: "Dados atualizados",
        description: "Os índices de mercado foram atualizados com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro na atualização",
        description: "Não foi possível atualizar os dados. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
      <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
      {isRefreshing ? "Atualizando..." : "Atualizar Índices"}
    </Button>
  )
}
