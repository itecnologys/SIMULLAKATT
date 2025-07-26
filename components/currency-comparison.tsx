"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

interface CurrencyData {
  code: string
  name: string
  openRate: number
  closeRate: number
  change: number
  changePercent: number
}

export default function CurrencyComparison() {
  const [currencyData, setCurrencyData] = useState<CurrencyData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, fetch from API
    const fetchCurrencyData = async () => {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Sample data
      const sampleData: CurrencyData[] = [
        {
          code: "EUR",
          name: "Euro",
          openRate: 0.92,
          closeRate: 0.93,
          change: 0.01,
          changePercent: 1.09,
        },
        {
          code: "GBP",
          name: "British Pound",
          openRate: 0.79,
          closeRate: 0.78,
          change: -0.01,
          changePercent: -1.27,
        },
        {
          code: "JPY",
          name: "Japanese Yen",
          openRate: 149.82,
          closeRate: 150.45,
          change: 0.63,
          changePercent: 0.42,
        },
        {
          code: "CHF",
          name: "Swiss Franc",
          openRate: 0.89,
          closeRate: 0.88,
          change: -0.01,
          changePercent: -1.12,
        },
        {
          code: "AUD",
          name: "Australian Dollar",
          openRate: 1.52,
          closeRate: 1.53,
          change: 0.01,
          changePercent: 0.66,
        },
        {
          code: "CAD",
          name: "Canadian Dollar",
          openRate: 1.36,
          closeRate: 1.37,
          change: 0.01,
          changePercent: 0.74,
        },
        {
          code: "CNY",
          name: "Chinese Yuan",
          openRate: 7.21,
          closeRate: 7.19,
          change: -0.02,
          changePercent: -0.28,
        },
      ]

      setCurrencyData(sampleData)
      setIsLoading(false)
    }

    fetchCurrencyData()
  }, [])

  return (
    <Tabs defaultValue="monthly">
      <TabsList>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="yearly">Yearly</TabsTrigger>
      </TabsList>

      <TabsContent value="monthly" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Currency Rates (Last 30 Days)</CardTitle>
            <CardDescription>Comparison against USD</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Currency</TableHead>
                    <TableHead className="text-right">Open Rate</TableHead>
                    <TableHead className="text-right">Close Rate</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currencyData.map((currency) => (
                    <TableRow key={currency.code}>
                      <TableCell>
                        <div className="font-medium">{currency.code}</div>
                        <div className="text-sm text-muted-foreground">{currency.name}</div>
                      </TableCell>
                      <TableCell className="text-right">{currency.openRate.toFixed(4)}</TableCell>
                      <TableCell className="text-right">{currency.closeRate.toFixed(4)}</TableCell>
                      <TableCell className="text-right">
                        <div
                          className={`flex items-center justify-end ${
                            currency.change > 0 ? "text-green-500" : currency.change < 0 ? "text-red-500" : ""
                          }`}
                        >
                          {currency.change > 0 ? (
                            <ArrowUpIcon className="mr-1 h-4 w-4" />
                          ) : currency.change < 0 ? (
                            <ArrowDownIcon className="mr-1 h-4 w-4" />
                          ) : null}
                          {currency.changePercent.toFixed(2)}%
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="yearly" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Currency Rates (Last 12 Months)</CardTitle>
            <CardDescription>Comparison against USD</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Currency</TableHead>
                    <TableHead className="text-right">Open Rate</TableHead>
                    <TableHead className="text-right">Close Rate</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currencyData.map((currency) => {
                    // Simulate different values for yearly view
                    const yearlyChange = currency.change * 3
                    const yearlyChangePercent = currency.changePercent * 3
                    const yearlyOpenRate = currency.openRate - yearlyChange

                    return (
                      <TableRow key={currency.code}>
                        <TableCell>
                          <div className="font-medium">{currency.code}</div>
                          <div className="text-sm text-muted-foreground">{currency.name}</div>
                        </TableCell>
                        <TableCell className="text-right">{yearlyOpenRate.toFixed(4)}</TableCell>
                        <TableCell className="text-right">{currency.closeRate.toFixed(4)}</TableCell>
                        <TableCell className="text-right">
                          <div
                            className={`flex items-center justify-end ${
                              yearlyChange > 0 ? "text-green-500" : yearlyChange < 0 ? "text-red-500" : ""
                            }`}
                          >
                            {yearlyChange > 0 ? (
                              <ArrowUpIcon className="mr-1 h-4 w-4" />
                            ) : yearlyChange < 0 ? (
                              <ArrowDownIcon className="mr-1 h-4 w-4" />
                            ) : null}
                            {yearlyChangePercent.toFixed(2)}%
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
