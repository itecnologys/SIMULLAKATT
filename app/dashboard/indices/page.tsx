"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Settings, FileText, LogOut, Menu, User, Bell, LineChart } from "lucide-react"
import ReferenceIndices from "@/components/reference-indices"

export default function IndicesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`bg-card border-r ${isSidebarOpen ? "w-64" : "w-0 -ml-64"} transition-all duration-300 md:ml-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <h1 className="text-xl font-bold">SIMULLAKT</h1>
          </div>

          <div className="flex-1 overflow-auto py-4">
            <nav className="space-y-1 px-2">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <BarChart className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/setup"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Settings className="h-5 w-5" />
                <span>Setup</span>
              </Link>
              <Link
                href="/dashboard/reports"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <FileText className="h-5 w-5" />
                <span>Reports</span>
              </Link>
              <Link
                href="/dashboard/indices"
                className="flex items-center space-x-3 px-3 py-2 rounded-md bg-primary/10 text-primary"
              >
                <LineChart className="h-5 w-5" />
                <span>Reference Indices</span>
              </Link>
            </nav>
          </div>

          <div className="p-4 border-t">
            <Link href="/login">
              <Button variant="outline" className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-4">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center ml-auto space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Reference Indices</h2>

            <ReferenceIndices />

            <Card>
              <CardHeader>
                <CardTitle>Top 10 Market Assets</CardTitle>
                <CardDescription>Compare your investment with top market assets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left">Asset</th>
                        <th className="p-3 text-right">Current Price</th>
                        <th className="p-3 text-right">1 Month Change</th>
                        <th className="p-3 text-right">1 Year Change</th>
                        <th className="p-3 text-right">Compare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Apple (AAPL)", price: "$173.45", monthChange: "+2.3%", yearChange: "+15.7%" },
                        { name: "Microsoft (MSFT)", price: "$328.79", monthChange: "+1.8%", yearChange: "+22.4%" },
                        { name: "Amazon (AMZN)", price: "$129.12", monthChange: "-0.7%", yearChange: "+10.2%" },
                        { name: "Alphabet (GOOGL)", price: "$134.56", monthChange: "+3.1%", yearChange: "+18.9%" },
                        { name: "Tesla (TSLA)", price: "$245.67", monthChange: "-2.4%", yearChange: "+5.3%" },
                        { name: "Meta (META)", price: "$312.45", monthChange: "+4.2%", yearChange: "+28.7%" },
                        { name: "NVIDIA (NVDA)", price: "$437.89", monthChange: "+5.6%", yearChange: "+145.2%" },
                        {
                          name: "Berkshire Hathaway (BRK.A)",
                          price: "$489,123.00",
                          monthChange: "+0.9%",
                          yearChange: "+8.4%",
                        },
                        { name: "JPMorgan Chase (JPM)", price: "$145.23", monthChange: "+1.2%", yearChange: "+12.8%" },
                        {
                          name: "Johnson & Johnson (JNJ)",
                          price: "$156.78",
                          monthChange: "-0.5%",
                          yearChange: "+3.2%",
                        },
                      ].map((asset, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-3">{asset.name}</td>
                          <td className="p-3 text-right">{asset.price}</td>
                          <td
                            className={`p-3 text-right ${asset.monthChange.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                          >
                            {asset.monthChange}
                          </td>
                          <td
                            className={`p-3 text-right ${asset.yearChange.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                          >
                            {asset.yearChange}
                          </td>
                          <td className="p-3 text-right">
                            <Button variant="outline" size="sm">
                              Compare
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
