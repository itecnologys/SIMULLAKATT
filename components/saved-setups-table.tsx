"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Copy, Play } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { loadAllSetups } from "@/lib/simulation-service"
import { useRouter } from "next/navigation"

interface SimulationSetup {
  id?: string
  name: string
  initialInvestment: number
  currency: string
  entryFee: number
  exitFee: number
  profitRate: number
  dailyFee: number
  operationsPerDay: number
  projectionMonths: number
  includeWeekends: boolean
  startDate?: string
}

export function SavedSetupsTable() {
  const [savedSetups, setSavedSetups] = useState<SimulationSetup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [setupToDelete, setSetupToDelete] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadSavedSetups()
  }, [])

  const loadSavedSetups = async () => {
    setIsLoading(true)
    try {
      const setups = await loadAllSetups()
      setSavedSetups(setups)
    } catch (error) {
      console.error("Erro ao carregar configurações:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações salvas.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSetup = async (id: string) => {
    try {
      // Obter configurações atuais
      const currentSetups = await loadAllSetups()

      // Filtrar a configuração a ser excluída
      const updatedSetups = currentSetups.filter((setup) => setup.id !== id)

      // Salvar configurações atualizadas
      if (typeof window !== "undefined") {
        localStorage.setItem("simullakt_setups", JSON.stringify(updatedSetups))
      }

      // Atualizar estado
      setSavedSetups(updatedSetups)

      toast({
        title: "Configuração excluída",
        description: "A configuração foi excluída com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao excluir configuração:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a configuração.",
        variant: "destructive",
      })
    }

    setDeleteDialogOpen(false)
    setSetupToDelete(null)
  }

  const handleEditSetup = (setup: SimulationSetup) => {
    // Salvar configuração atual para edição
    if (typeof window !== "undefined") {
      localStorage.setItem("simullakt_current_setup", JSON.stringify(setup))
    }

    // Redirecionar para a página de configuração
    router.push("/dashboard/setup")
  }

  const handleDuplicateSetup = (setup: SimulationSetup) => {
    const duplicatedSetup = {
      ...setup,
      id: `setup-${Date.now()}`,
      name: `${setup.name} (Cópia)`,
    }

    // Adicionar à lista de configurações
    const updatedSetups = [...savedSetups, duplicatedSetup]

    // Salvar configurações atualizadas
    if (typeof window !== "undefined") {
      localStorage.setItem("simullakt_setups", JSON.stringify(updatedSetups))
    }

    // Atualizar estado
    setSavedSetups(updatedSetups)

    toast({
      title: "Configuração duplicada",
      description: "A configuração foi duplicada com sucesso.",
    })
  }

  const handleRunSimulation = (setup: SimulationSetup) => {
    // Salvar configuração atual
    if (typeof window !== "undefined") {
      localStorage.setItem("simullakt_current_setup", JSON.stringify(setup))
    }

    // Redirecionar para a página de simulação
    router.push(`/dashboard/setup?run=true`)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Configurações Salvas</CardTitle>
          <CardDescription>Configurações de simulação salvas anteriormente</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : savedSetups.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Investimento</TableHead>
                    <TableHead>Taxa de Lucro</TableHead>
                    <TableHead>Operações/Dia</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedSetups.map((setup) => (
                    <TableRow key={setup.id}>
                      <TableCell className="font-medium">{setup.name}</TableCell>
                      <TableCell>
                        {setup.initialInvestment.toLocaleString()} {setup.currency}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {setup.profitRate.toFixed(2)}%
                        </Badge>
                      </TableCell>
                      <TableCell>{setup.operationsPerDay}</TableCell>
                      <TableCell>{setup.projectionMonths} meses</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRunSimulation(setup)}
                            title="Executar Simulação"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditSetup(setup)}
                            title="Editar Configuração"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDuplicateSetup(setup)}
                            title="Duplicar Configuração"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSetupToDelete(setup.id || "")
                              setDeleteDialogOpen(true)
                            }}
                            title="Excluir Configuração"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhuma configuração salva encontrada</p>
              <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard/setup")}>
                Criar Nova Configuração
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Configuração</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta configuração? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => setupToDelete && handleDeleteSetup(setupToDelete)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
