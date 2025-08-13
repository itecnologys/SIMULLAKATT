"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart, Settings, FileText, LogOut, Menu, User, Bell, LineChart, MessageSquare } from "lucide-react"
import ChatComparison from "@/components/chat-comparison"

export default function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`bg-card border-r ${isSidebarOpen ? "w-64" : "w-0 -ml-64"} transition-all duration-300 md:ml-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <h1 className="text-xl font-bold">SIMULAK</h1>
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
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <LineChart className="h-5 w-5" />
                <span>Reference Indices</span>
              </Link>
              <Link
                href="/dashboard/chat"
                className="flex items-center space-x-3 px-3 py-2 rounded-md bg-primary/10 text-primary"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Chat</span>
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
            <h2 className="text-3xl font-bold tracking-tight">Investment Chat</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <ChatComparison />

              <div className="space-y-6">
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-lg font-medium mb-4">Popular Comparisons</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() => alert("This would trigger a comparison with Gold")}
                    >
                      <LineChart className="mr-2 h-4 w-4" />
                      Compare with Gold
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() => alert("This would trigger a comparison with S&P 500")}
                    >
                      <LineChart className="mr-2 h-4 w-4" />
                      Compare with S&P 500
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() => alert("This would trigger a comparison with Bitcoin")}
                    >
                      <LineChart className="mr-2 h-4 w-4" />
                      Compare with Bitcoin
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() => alert("This would trigger a comparison with NASDAQ")}
                    >
                      <LineChart className="mr-2 h-4 w-4" />
                      Compare with NASDAQ
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() => alert("This would trigger a comparison with Crude Oil")}
                    >
                      <LineChart className="mr-2 h-4 w-4" />
                      Compare with Crude Oil
                    </Button>
                  </div>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-lg font-medium mb-4">Chat Tips</h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Ask about specific assets to compare your investment</li>
                    <li>Request performance over different time periods</li>
                    <li>Ask for investment advice based on historical data</li>
                    <li>Compare multiple assets at once</li>
                    <li>Request visual charts for better comparison</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
