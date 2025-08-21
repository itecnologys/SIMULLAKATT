"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CreditCard, 
  Plus, 
  Minus, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  History, 
  Settings,
  Zap,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react"
import { useSimulation } from "@/contexts/SimulationContext"

// Função para gerar hash único baseado nos dados do cartão
const generateCardHash = (data: {
  initialInvestment: string
  dailyAccumulated: number
  depositAccumulated: number
  currency: string
  timestamp: number
}): string => {
  const dataString = `${data.initialInvestment}-${data.dailyAccumulated}-${data.depositAccumulated}-${data.currency}-${data.timestamp}`
  
  // Função hash simples mas efetiva
  let hash = 0
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Converter para string hexadecimal e pegar os primeiros 8 caracteres
  return Math.abs(hash).toString(16).padStart(8, '0').substring(0, 8)
}

interface CreditLine {
  id: string
  name: string
  limit: number
  used: number
  available: number
  currency: string
  status: 'active' | 'suspended' | 'pending'
  createdAt: string
  lastTransaction: string
  transactions: Transaction[]
  cardId?: string
}

interface Card {
  id: string
  name: string
  createdAt: string
  status: 'active' | 'inactive'
  creditLines: CreditLine[]
  totalBalance: number
  currency: string
}

interface Transaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  cardId: string
  cardHash: string
  cardName: string
}

export default function CardPage() {
  const { simulationData, accumulatedValues } = useSimulation()
  const [cards, setCards] = useState<Card[]>([])
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [creditLines, setCreditLines] = useState<CreditLine[]>([])
  const [selectedCreditLine, setSelectedCreditLine] = useState<CreditLine | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    type: 'credit',
    amount: '',
    description: ''
  })

  // Calcular saldo total da simulação
  const totalSimulationBalance = accumulatedValues.dailyAccumulated + accumulatedValues.depositAccumulated

  // Criar ou atualizar cartão baseado na simulação
  useEffect(() => {
    // Só criar novo cartão se houver mudança significativa nos valores
    const shouldCreateNewCard = () => {
      if (cards.length === 0) return true
      
      const activeCard = cards.find(card => card.status === 'active')
      if (!activeCard) return true
      
      // Gerar hash para o estado atual
      const currentHash = generateCardHash({
        initialInvestment: simulationData.initialInvestment,
        dailyAccumulated: accumulatedValues.dailyAccumulated,
        depositAccumulated: accumulatedValues.depositAccumulated,
        currency: simulationData.currency,
        timestamp: Date.now()
      })
      
      // Extrair hash do cartão ativo
      const activeCardHash = activeCard.id.split('-')[1]
      
      // Criar novo cartão se o hash mudou (dados diferentes)
      return currentHash !== activeCardHash
    }

    if (!shouldCreateNewCard()) {
      // Atualizar apenas as linhas de crédito do cartão ativo
      const activeCard = cards.find(card => card.status === 'active')
      if (activeCard) {
        const updatedCreditLines: CreditLine[] = [
          {
            id: '1',
            name: 'Linha Principal',
            limit: totalSimulationBalance * 0.1,
            used: totalSimulationBalance,
            available: Math.max(0, (totalSimulationBalance * 0.1) - totalSimulationBalance),
            currency: simulationData.currency,
            status: 'active',
            createdAt: activeCard.createdAt,
            lastTransaction: new Date().toISOString(),
            cardId: activeCard.id,
            transactions: [
              {
                id: Date.now().toString(),
                type: 'credit',
                amount: totalSimulationBalance,
                description: 'Saldo total da simulação',
                date: new Date().toISOString(),
                status: 'completed',
                cardId: activeCard.id,
                cardHash: getCardHash(activeCard.id),
                cardName: activeCard.name
              }
            ]
          },
          {
            id: '2',
            name: 'Linha de Depósito',
            limit: Number(simulationData.initialInvestment) * 1.5,
            used: accumulatedValues.depositAccumulated,
            available: (Number(simulationData.initialInvestment) * 1.5) - accumulatedValues.depositAccumulated,
            currency: simulationData.currency,
            status: 'active',
            createdAt: activeCard.createdAt,
            lastTransaction: new Date().toISOString(),
            cardId: activeCard.id,
            transactions: [
              {
                id: (Date.now() + 1).toString(),
                type: 'credit',
                amount: accumulatedValues.depositAccumulated,
                description: 'Acúmulo de depósito',
                date: new Date().toISOString(),
                status: 'completed',
                cardId: activeCard.id,
                cardHash: getCardHash(activeCard.id),
                cardName: activeCard.name
              }
            ]
          }
        ]

        const updatedCard: Card = {
          ...activeCard,
          totalBalance: totalSimulationBalance,
          creditLines: updatedCreditLines
        }

        setCards(prevCards => 
          prevCards.map(card => 
            card.id === activeCard.id ? updatedCard : card
          )
        )
        setCreditLines(updatedCreditLines)
        setSelectedCard(updatedCard)
      }
      return
    }

    // Criar novo cartão com hash único
    const timestamp = Date.now()
    const cardHash = generateCardHash({
      initialInvestment: simulationData.initialInvestment,
      dailyAccumulated: accumulatedValues.dailyAccumulated,
      depositAccumulated: accumulatedValues.depositAccumulated,
      currency: simulationData.currency,
      timestamp
    })
    
    const currentCardId = `card-${cardHash}-${timestamp}`
    const currentDate = new Date().toISOString()
    
    const newCreditLines: CreditLine[] = [
      {
        id: `${currentCardId}-line-1`,
        name: 'Linha Principal',
        limit: totalSimulationBalance * 0.1,
        used: totalSimulationBalance,
        available: Math.max(0, (totalSimulationBalance * 0.1) - totalSimulationBalance),
        currency: simulationData.currency,
        status: 'active',
        createdAt: currentDate,
        lastTransaction: currentDate,
        cardId: currentCardId,
                    transactions: [
              {
                id: `${currentCardId}-tx-1`,
                type: 'credit',
                amount: totalSimulationBalance,
                description: 'Saldo total da simulação',
                date: currentDate,
                status: 'completed',
                cardId: currentCardId,
                cardHash: cardHash,
                cardName: `APPC CARD SMLK - ${new Date().toLocaleDateString('pt-BR')}`
              }
            ]
      },
      {
        id: `${currentCardId}-line-2`,
        name: 'Linha de Depósito',
        limit: Number(simulationData.initialInvestment) * 1.5,
        used: accumulatedValues.depositAccumulated,
        available: (Number(simulationData.initialInvestment) * 1.5) - accumulatedValues.depositAccumulated,
        currency: simulationData.currency,
        status: 'active',
        createdAt: currentDate,
        lastTransaction: currentDate,
        cardId: currentCardId,
                    transactions: [
              {
                id: `${currentCardId}-tx-2`,
                type: 'credit',
                amount: accumulatedValues.depositAccumulated,
                description: 'Acúmulo de depósito',
                date: currentDate,
                status: 'completed',
                cardId: currentCardId,
                cardHash: cardHash,
                cardName: `APPC CARD SMLK - ${new Date().toLocaleDateString('pt-BR')}`
              }
            ]
      }
    ]

    const newCard: Card = {
      id: currentCardId,
      name: `APPC CARD SMLK - ${new Date().toLocaleDateString('pt-BR')}`,
      createdAt: currentDate,
      status: 'active',
      creditLines: newCreditLines,
      totalBalance: totalSimulationBalance,
      currency: simulationData.currency
    }

    // Adicionar novo cartão à lista ou atualizar cartão existente
    setCards(prevCards => {
      const existingCardIndex = prevCards.findIndex(card => card.status === 'active')
      if (existingCardIndex >= 0) {
        // Desativar cartão anterior
        const updatedCards = [...prevCards]
        updatedCards[existingCardIndex] = { ...updatedCards[existingCardIndex], status: 'inactive' }
        return [...updatedCards, newCard]
      } else {
        return [...prevCards, newCard]
      }
    })

    setCreditLines(newCreditLines)
    setSelectedCard(newCard)
  }, [simulationData.initialInvestment, accumulatedValues.dailyAccumulated, accumulatedValues.depositAccumulated, simulationData.currency])

  const handleTransaction = () => {
    if (!selectedCreditLine || !newTransaction.amount || !selectedCard) return

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type as 'credit' | 'debit',
      amount: Number(newTransaction.amount),
      description: newTransaction.description,
      date: new Date().toISOString(),
      status: 'completed',
      cardId: selectedCard.id,
      cardHash: getCardHash(selectedCard.id),
      cardName: selectedCard.name
    }

    const updatedCreditLines = creditLines.map(line => {
      if (line.id === selectedCreditLine.id) {
        const newUsed = newTransaction.type === 'credit' 
          ? line.used + Number(newTransaction.amount)
          : line.used - Number(newTransaction.amount)
        
        return {
          ...line,
          used: Math.max(0, newUsed),
          available: Math.max(0, line.limit - newUsed),
          transactions: [transaction, ...line.transactions]
        }
      }
      return line
    })

    setCreditLines(updatedCreditLines)
    setNewTransaction({ type: 'credit', amount: '', description: '' })
    setIsModalOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'suspended': return <XCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getCardHash = (cardId: string) => {
    return cardId.split('-')[1] || 'N/A'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">APPC CARD SMLK</h1>
          <p className="text-gray-600 mt-2">Controle de saldo e linhas de crédito</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cards List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Meus Cartões</CardTitle>
                    <CardDescription>Histórico de cartões criados por simulação</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {cards.filter(card => card.status === 'active').length} Ativo
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cards.map((card) => (
                    <div key={`card-overview-${card.id}`} className={`border rounded-lg p-4 transition-all ${
                      card.status === 'active' 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            card.status === 'active' ? 'bg-green-600' : 'bg-gray-400'
                          }`}>
                            <CreditCard className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{card.name}</h3>
                            <p className="text-sm text-gray-600">
                              Criado em: {new Date(card.createdAt).toLocaleDateString('pt-BR')} às {new Date(card.createdAt).toLocaleTimeString('pt-BR')}
                            </p>
                            <p className="text-xs text-gray-500 font-mono">
                              Hash: {getCardHash(card.id)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {card.currency === "EUR" ? "€" : "$"} {card.totalBalance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                          </div>
                          <Badge className={
                            card.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }>
                            {card.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Card Overview */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedCard?.name || 'APPC CARD SMLK'}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Saldo total da simulação
                        {selectedCard && (
                          <>
                            <span className="block text-xs text-gray-500">
                              Criado: {new Date(selectedCard.createdAt).toLocaleDateString('pt-BR')} às {new Date(selectedCard.createdAt).toLocaleTimeString('pt-BR')}
                            </span>
                            <span className="block text-xs text-gray-500 font-mono">
                              Hash: {getCardHash(selectedCard.id)}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {simulationData.currency === "EUR" ? "€" : "$"} {totalSimulationBalance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className="bg-black text-white">VISA</Badge>
                      <Badge className="bg-purple-600 text-white">LIGHTNING</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credit Lines */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Linhas de Crédito</CardTitle>
                    <CardDescription>Gerencie suas linhas de crédito disponíveis</CardDescription>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Linha
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {creditLines.map((line) => (
                    <div key={line.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{line.name}</h3>
                            <p className="text-sm text-gray-600">
                              Limite: {line.currency === "EUR" ? "€" : "$"} {line.limit.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {line.currency === "EUR" ? "€" : "$"} {line.used.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                          </div>
                          <div className="text-sm text-gray-600">
                            Disponível: {line.currency === "EUR" ? "€" : "$"} {line.available.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(line.status)}>
                            {getStatusIcon(line.status)}
                            <span className="ml-1">{line.status}</span>
                          </Badge>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                onClick={() => setSelectedCreditLine(line)}
                              >
                                <Settings className="h-4 w-4 mr-2" />
                                Gerenciar
                              </Button>
                            </DialogTrigger>
                                                         <DialogContent className="max-w-2xl">
                               <DialogHeader>
                                 <DialogTitle>{line.name}</DialogTitle>
                                 <DialogDescription>
                                   Gerencie transações e configurações desta linha de crédito
                                 </DialogDescription>
                                 {selectedCard && (
                                   <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                     <div className="flex items-center justify-between">
                                       <div>
                                         <p className="text-sm font-medium text-gray-900">Cartão Ativo</p>
                                         <p className="text-xs text-gray-600">{selectedCard.name}</p>
                                       </div>
                                       <div className="text-right">
                                         <p className="text-xs text-gray-500 font-mono">Hash: {getCardHash(selectedCard.id)}</p>
                                         <p className="text-xs text-gray-500">
                                           Saldo: {selectedCard.currency === "EUR" ? "€" : "$"} {selectedCard.totalBalance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                                         </p>
                                       </div>
                                     </div>
                                   </div>
                                 )}
                               </DialogHeader>
                              
                              <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                                  <TabsTrigger value="transactions">Transações</TabsTrigger>
                                  <TabsTrigger value="new">Nova Transação</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="overview" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                      <CardContent className="p-4">
                                        <div className="text-sm text-gray-600">Limite Total</div>
                                        <div className="text-xl font-bold text-gray-900">
                                          {line.currency === "EUR" ? "€" : "$"} {line.limit.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                                        </div>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="p-4">
                                        <div className="text-sm text-gray-600">Utilizado</div>
                                        <div className="text-xl font-bold text-red-600">
                                          {line.currency === "EUR" ? "€" : "$"} {line.used.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                                        </div>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="p-4">
                                        <div className="text-sm text-gray-600">Disponível</div>
                                        <div className="text-xl font-bold text-green-600">
                                          {line.currency === "EUR" ? "€" : "$"} {line.available.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                                        </div>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="p-4">
                                        <div className="text-sm text-gray-600">Status</div>
                                        <Badge className={getStatusColor(line.status)}>
                                          {getStatusIcon(line.status)}
                                          <span className="ml-1">{line.status}</span>
                                        </Badge>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="transactions" className="space-y-4">
                                  <div className="max-h-60 overflow-y-auto">
                                    {line.transactions.map((transaction) => (
                                      <div key={transaction.id} className="flex items-center justify-between p-3 border-b border-gray-100">
                                        <div className="flex items-center space-x-3">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                                          }`}>
                                            {transaction.type === 'credit' ? (
                                              <Plus className="h-4 w-4 text-green-600" />
                                            ) : (
                                              <Minus className="h-4 w-4 text-red-600" />
                                            )}
                                          </div>
                                                                                     <div>
                                             <div className="font-medium text-gray-900">{transaction.description}</div>
                                             <div className="text-sm text-gray-600">
                                               {new Date(transaction.date).toLocaleDateString('pt-BR')}
                                             </div>
                                             <div className="text-xs text-gray-500 font-mono">
                                               Cartão: {transaction.cardHash} - {transaction.cardName}
                                             </div>
                                           </div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`font-bold ${
                                            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                          }`}>
                                            {transaction.type === 'credit' ? '+' : '-'} {line.currency === "EUR" ? "€" : "$"} {transaction.amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                                          </div>
                                          <Badge className={
                                            transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                          }>
                                            {transaction.status}
                                          </Badge>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="new" className="space-y-4">
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="transaction-type">Tipo de Transação</Label>
                                      <Select 
                                        value={newTransaction.type} 
                                        onValueChange={(value) => setNewTransaction({...newTransaction, type: value})}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="credit">Crédito</SelectItem>
                                          <SelectItem value="debit">Débito</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    <div>
                                      <Label htmlFor="amount">Valor</Label>
                                      <Input
                                        id="amount"
                                        type="number"
                                        value={newTransaction.amount}
                                        onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                                        placeholder="0.00"
                                      />
                                    </div>
                                    
                                    <div>
                                      <Label htmlFor="description">Descrição</Label>
                                      <Input
                                        id="description"
                                        value={newTransaction.description}
                                        onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                                        placeholder="Descrição da transação"
                                      />
                                    </div>
                                    
                                    <Button 
                                      onClick={handleTransaction}
                                      className="w-full bg-green-600 hover:bg-green-700"
                                      disabled={!newTransaction.amount}
                                    >
                                      <Zap className="h-4 w-4 mr-2" />
                                      Executar Transação
                                    </Button>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Fundos
                </Button>
                <Button variant="outline" className="w-full">
                  <History className="h-4 w-4 mr-2" />
                  Histórico
                </Button>
                <Button variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Segurança
                </Button>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total de Cartões</span>
                  <span className="font-bold">{cards.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cartão Ativo</span>
                  <span className="font-bold text-green-600">
                    {cards.filter(card => card.status === 'active').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Saldo Total</span>
                  <span className="font-bold text-blue-600">
                    {simulationData.currency === "EUR" ? "€" : "$"} {totalSimulationBalance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Limite Principal (10%)</span>
                  <span className="font-bold text-orange-600">
                    {simulationData.currency === "EUR" ? "€" : "$"} {(totalSimulationBalance * 0.1).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History by Card */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico por Cartão</CardTitle>
                <CardDescription>Transações organizadas por cartão</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cards.map((card) => {
                    const allTransactions = card.creditLines.flatMap(line => line.transactions)
                    return (
                      <div key={`card-transactions-${card.id}`} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{card.name}</h4>
                            <p className="text-xs text-gray-500 font-mono">Hash: {getCardHash(card.id)}</p>
                          </div>
                          <Badge className={
                            card.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }>
                            {card.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Transações: {allTransactions.length}</p>
                          <p>Saldo: {card.currency === "EUR" ? "€" : "$"} {card.totalBalance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 