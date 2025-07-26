"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

// Sample data for indices
const indices = [
  { id: "gold", name: "Gold" },
  { id: "sp500", name: "S&P 500" },
  { id: "nasdaq", name: "NASDAQ" },
  { id: "bitcoin", name: "Bitcoin" },
  { id: "oil", name: "Crude Oil" },
]

// Sample historical data for indices
const historicalData = {
  gold: [
    { date: "2023-01-01", value: 1800 },
    { date: "2023-02-01", value: 1820 },
    { date: "2023-03-01", value: 1840 },
    { date: "2023-04-01", value: 1860 },
    { date: "2023-05-01", value: 1880 },
    { date: "2023-06-01", value: 1900 },
    { date: "2023-07-01", value: 1920 },
    { date: "2023-08-01", value: 1940 },
    { date: "2023-09-01", value: 1960 },
    { date: "2023-10-01", value: 1980 },
    { date: "2023-11-01", value: 2000 },
    { date: "2023-12-01", value: 2020 },
  ],
  sp500: [
    { date: "2023-01-01", value: 3800 },
    { date: "2023-02-01", value: 3850 },
    { date: "2023-03-01", value: 3900 },
    { date: "2023-04-01", value: 3950 },
    { date: "2023-05-01", value: 4000 },
    { date: "2023-06-01", value: 4050 },
    { date: "2023-07-01", value: 4100 },
    { date: "2023-08-01", value: 4150 },
    { date: "2023-09-01", value: 4200 },
    { date: "2023-10-01", value: 4250 },
    { date: "2023-11-01", value: 4300 },
    { date: "2023-12-01", value: 4350 },
  ],
  // Add data for other indices
}

export default function ReferenceIndices() {
  const [selectedIndex, setSelectedIndex] = useState("gold")
  const [investmentAmount, setInvestmentAmount] = useState(2000)
  const [comparisonData, setComparisonData] = useState<any[]>([])

  useEffect(() => {
    // Calculate comparison data
    if (selectedIndex && historicalData[selectedIndex]) {
      const data = historicalData[selectedIndex]
      const initialValue = data[0].value
      const initialUnits = investmentAmount / initialValue

      const comparison = data.map((item) => {
        const indexValue = item.value
        const investmentValue = initialUnits * indexValue

        return {
          date: item.date,
          indexValue,
          investmentValue,
        }
      })

      setComparisonData(comparison)
    }
  }, [selectedIndex, investmentAmount])

  const initialValue = comparisonData[0]?.investmentValue || investmentAmount
  const currentValue = comparisonData[comparisonData.length - 1]?.investmentValue || investmentAmount
  const percentChange = ((currentValue - initialValue) / initialValue) * 100
  const isPositive = percentChange >= 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reference Index Comparison</CardTitle>
        <CardDescription>Compare your investment with market indices</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Select Reference Index</label>
            <Select value={selectedIndex} onValueChange={setSelectedIndex}>
              <SelectTrigger>
                <SelectValue placeholder="Select an index" />
              </SelectTrigger>
              <SelectContent>
                {indices.map((index) => (
                  <SelectItem key={index.id} value={index.id}>
                    {index.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Investment Amount (€)</label>
            <input
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div className="pt-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Initial Value</div>
              <div className="text-2xl font-bold">€{initialValue.toFixed(2)}</div>
            </div>

            <div className="flex-1 p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Current Value</div>
              <div className="text-2xl font-bold">€{currentValue.toFixed(2)}</div>
            </div>

            <div className="flex-1 p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Change</div>
              <div className={`text-2xl font-bold flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
                {isPositive ? <TrendingUp className="mr-1 h-5 w-5" /> : <TrendingDown className="mr-1 h-5 w-5" />}
                {percentChange.toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={comparisonData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="indexValue"
                  name={`${indices.find((i) => i.id === selectedIndex)?.name} Price`}
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="investmentValue"
                  name="Investment Value"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto">
          Run Full Comparison
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
