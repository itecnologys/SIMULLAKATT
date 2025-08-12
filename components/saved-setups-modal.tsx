"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Copy, Play, Search, Plus } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { loadAllSetups } from "@/lib/simulation-service"

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

interface SavedSetupsModalProps {
  onSetupSelect: (setup: SimulationSetup) => void
  onNewSetup: () => void
}

export function SavedSetupsModal({ onSetupSelect, onNewSetup }: SavedSetupsModalProps) {
  const [savedSetups, setSavedSetups] = useState<SimulationSetup[]>([])
  const [filteredSetups, setFilteredSetups] = useState<SimulationSetup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [setupToDelete, setSetupToDelete] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      loadSavedSetups()
    }
  }, [isOpen])

  useEffect(() => {
    const filtered = savedSetups.filter(setup =>
      setup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setup.currency.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredSetups(filtered)
  }, [searchTerm, savedSetups])

  const loadSavedSetups = async () => {
    setIsLoading(true)
    try {
      const setups = await loadAllSetups()
      setSavedSetups(setups)
      setFilteredSetups(setups)
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
      const currentSetups = await loadAllSetups()
      const updatedSetups = currentSetups.filter((setup) => setup.id !== id)

      if (typeof window !== "undefined") {
        localStorage.setItem("simullakt_setups", JSON.stringify(updatedSetups))
      }

      setSavedSetups(updatedSetups)
      setFilteredSetups(updatedSetups)

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
    onSetupSelect(setup)
    setIsOpen(false)
  }

  const handleDuplicateSetup = (setup: SimulationSetup) => {
    const duplicatedSetup = {
      ...setup,
      id: `setup-${Date.now()}`,
      name: `${setup.name} (Cópia)`,
    }

    const updatedSetups = [...savedSetups, duplicatedSetup]

    if (typeof window !== "undefined") {
      localStorage.setItem("simullakt_setups", JSON.stringify(updatedSetups))
    }

    setSavedSetups(updatedSetups)
    setFilteredSetups(updatedSetups)

    toast({
      title: "Configuração duplicada",
      description: "A configuração foi duplicada com sucesso.",
    })
  }

  const handleRunSimulation = (setup: SimulationSetup) => {
    onSetupSelect(setup)
    setIsOpen(false)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Search className="mr-2 h-4 w-4" />
            Ver Configurações Salvas
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Configurações Salvas</DialogTitle>
            <DialogDescription>
              Selecione uma configuração existente ou crie uma nova
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Barra de pesquisa e ações */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar configurações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={onNewSetup} className="sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Nova Configuração
              </Button>
            </div>

            {/* Tabela de configurações */}
            <Card className="max-h-[60vh] overflow-hidden">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredSetups.length > 0 ? (
                  <div className="overflow-auto max-h-[60vh]">
                    <Table>
                      <TableHeader className="sticky top-0 bg-background">
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Investimento</TableHead>
                          <TableHead>Taxa de Lucro</TableHead>
                          <TableHead>Operações/Dia</TableHead>
                          <TableHead>Período</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSetups.map((setup) => (
                          <TableRow key={setup.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium max-w-[200px] truncate">
                              {setup.name}
                            </TableCell>
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
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRunSimulation(setup)}
                                  title="Usar esta configuração"
                                >
                                  <Play className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditSetup(setup)}
                                  title="Editar configuração"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDuplicateSetup(setup)}
                                  title="Duplicar configuração"
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
                                  title="Excluir configuração"
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
                    <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="mb-2">
                      {searchTerm ? "Nenhuma configuração encontrada" : "Nenhuma configuração salva"}
                    </p>
                    {!searchTerm && (
                      <Button variant="outline" onClick={onNewSetup}>
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Primeira Configuração
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

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
