"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Operation {
  id: string
  date: string
  initialValue: number
  projectedMonths: number
  dailyOperations: number
  totalProfit: number
  finalValue: number
  totalWithdrawals: number
}

// Sample data - would come from API in production
const sampleOperations: Operation[] = [
  {
    id: "op-001",
    date: "2025-03-15",
    initialValue: 2000,
    projectedMonths: 24,
    dailyOperations: 3,
    totalProfit: 876.54,
    finalValue: 2876.54,
    totalWithdrawals: 120.32,
  },
  {
    id: "op-002",
    date: "2025-03-14",
    initialValue: 5000,
    projectedMonths: 12,
    dailyOperations: 3,
    totalProfit: 1543.21,
    finalValue: 6543.21,
    totalWithdrawals: 287.65,
  },
  {
    id: "op-003",
    date: "2025-03-13",
    initialValue: 1000,
    projectedMonths: 6,
    dailyOperations: 3,
    totalProfit: 187.43,
    finalValue: 1187.43,
    totalWithdrawals: 45.21,
  },
  {
    id: "op-004",
    date: "2025-03-12",
    initialValue: 3000,
    projectedMonths: 18,
    dailyOperations: 3,
    totalProfit: 965.32,
    finalValue: 3965.32,
    totalWithdrawals: 178.43,
  },
  {
    id: "op-005",
    date: "2025-03-11",
    initialValue: 10000,
    projectedMonths: 24,
    dailyOperations: 3,
    totalProfit: 4321.87,
    finalValue: 14321.87,
    totalWithdrawals: 654.32,
  },
]

// Sample detailed operations for the modal
const sampleDetailedOperations = [
  { id: "001", day: 1, operation: 1, initial: 2000.0, entryFee: 2.0, profit: 15.98, exitFee: 2.02, final: 2011.96 },
  { id: "002", day: 1, operation: 2, initial: 2011.96, entryFee: 2.01, profit: 16.08, exitFee: 2.03, final: 2024.0 },
  { id: "003", day: 1, operation: 3, initial: 2024.0, entryFee: 2.02, profit: 16.18, exitFee: 2.04, final: 2036.12 },
  { id: "004", day: 2, operation: 1, initial: 2036.12, entryFee: 2.04, profit: 16.27, exitFee: 2.05, final: 2048.3 },
  { id: "005", day: 2, operation: 2, initial: 2048.3, entryFee: 2.05, profit: 16.37, exitFee: 2.06, final: 2060.56 },
  { id: "006", day: 2, operation: 3, initial: 2060.56, entryFee: 2.06, profit: 16.47, exitFee: 2.07, final: 2072.9 },
]

export default function OperationsTable() {
  const [timeFilter, setTimeFilter] = useState("all")
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null)

  // Filter operations based on selected time period
  const [filteredOperations, setFilteredOperations] = useState(sampleOperations)

  // Função para formatar valores monetários com ponto para milhares e vírgula para centavos
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  useEffect(() => {
    // Filtragem simulada baseada no período selecionado
    const fetchFilteredOperations = async () => {
      // Em um app real, isso chamaria sua API com o filtro apropriado
      const now = new Date()
      let filtered = [...sampleOperations]

      if (timeFilter === "day") {
        const yesterday = new Date(now)
        yesterday.setDate(now.getDate() - 1)
        filtered = sampleOperations.filter((op) => new Date(op.date) >= yesterday)
      } else if (timeFilter === "week") {
        const lastWeek = new Date(now)
        lastWeek.setDate(now.getDate() - 7)
        filtered = sampleOperations.filter((op) => new Date(op.date) >= lastWeek)
      } else if (timeFilter === "month") {
        const lastMonth = new Date(now)
        lastMonth.setMonth(now.getMonth() - 1)
        filtered = sampleOperations.filter((op) => new Date(op.date) >= lastMonth)
      } else if (timeFilter === "year") {
        const lastYear = new Date(now)
        lastYear.setFullYear(now.getFullYear() - 1)
        filtered = sampleOperations.filter((op) => new Date(op.date) >= lastYear)
      }

      setFilteredOperations(filtered)
    }

    fetchFilteredOperations()
  }, [timeFilter])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Operations List</h3>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Operations</SelectItem>
            <SelectItem value="day">Last Day</SelectItem>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Initial Value</TableHead>
                <TableHead className="text-right">Months</TableHead>
                <TableHead className="text-right">Daily Ops</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead className="text-right">Final Value</TableHead>
                <TableHead className="text-right">Withdrawals</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOperations.map((operation) => (
                <TableRow key={operation.id}>
                  <TableCell>{operation.id}</TableCell>
                  <TableCell>{new Date(operation.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">€{formatCurrency(operation.initialValue)}</TableCell>
                  <TableCell className="text-right">{operation.projectedMonths}</TableCell>
                  <TableCell className="text-right">{operation.dailyOperations}</TableCell>
                  <TableCell className="text-right text-green-500">+€{formatCurrency(operation.totalProfit)}</TableCell>
                  <TableCell className="text-right font-medium">€{formatCurrency(operation.finalValue)}</TableCell>
                  <TableCell className="text-right text-amber-600">
                    €{formatCurrency(operation.totalWithdrawals)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedOperation(operation)}
                          className="ml-auto"
                        >
                          <Eye className="h-5 w-5" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Operation Details</DialogTitle>
                          <DialogDescription>
                            Operation from {new Date(operation?.date || "").toLocaleDateString()}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Individual Operations</h4>
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>ID</TableHead>
                                  <TableHead>Day</TableHead>
                                  <TableHead>Operation</TableHead>
                                  <TableHead className="text-right">Initial</TableHead>
                                  <TableHead className="text-right">Entry Fee</TableHead>
                                  <TableHead className="text-right">Profit</TableHead>
                                  <TableHead className="text-right">Exit Fee</TableHead>
                                  <TableHead className="text-right">Final</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {sampleDetailedOperations.map((op, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{op.id}</TableCell>
                                    <TableCell>{op.day}</TableCell>
                                    <TableCell>{op.operation}</TableCell>
                                    <TableCell className="text-right">€{formatCurrency(op.initial)}</TableCell>
                                    <TableCell className="text-right text-red-500">
                                      -€{formatCurrency(op.entryFee)}
                                    </TableCell>
                                    <TableCell className="text-right text-green-500">
                                      +€{formatCurrency(op.profit)}
                                    </TableCell>
                                    <TableCell className="text-right text-red-500">
                                      -€{formatCurrency(op.exitFee)}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                      €{formatCurrency(op.final)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
