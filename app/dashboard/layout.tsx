"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Settings,
  FileText,
  LogOut,
  Menu,
  User,
  Bell,
  LineChart,
  Calculator,
  Grid,
  Activity,
  TrendingUp,
} from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - única coluna de menu */}
      <div className={`bg-card border-r ${isSidebarOpen ? "w-64" : "w-0 -ml-64"} transition-all duration-300 md:ml-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <h1 className="text-xl font-bold">SIMULAK</h1>
          </div>

          <div className="flex-1 overflow-auto py-4">
            <nav className="space-y-1 px-2">
              <Link
                href="/dashboard"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                  pathname === "/dashboard"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <BarChart className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/setup"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                  pathname === "/dashboard/setup"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Setup</span>
              </Link>
              <Link
                href="/dashboard/reports"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                  pathname === "/dashboard/reports"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <FileText className="h-5 w-5" />
                <span>Reports</span>
              </Link>
              <Link
                href="/dashboard/comparison"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                  pathname === "/dashboard/comparison"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <LineChart className="h-5 w-5" />
                <span>Comparação</span>
              </Link>
              <Link
                href="/dashboard/audit"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                  pathname === "/dashboard/audit"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Calculator className="h-5 w-5" />
                <span>Auditoria</span>
              </Link>
              <Link
                href="/market-view"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                  pathname === "/market-view"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Grid className="h-5 w-5" />
                <span>Visão de Mercado</span>
              </Link>
              <Link
                href="/dashboard/real-performance"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                  pathname === "/dashboard/real-performance"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <TrendingUp className="h-5 w-5" />
                <span>Desempenho Real</span>
              </Link>
              <Link
                href="/dashboard/analysis"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                  pathname === "/dashboard/analysis"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Activity className="h-5 w-5" />
                <span>Análise</span>
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

          <div className="flex items-center">
            <h1 className="text-xl font-bold">SIMULAK</h1>
          </div>

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
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/20">{children}</main>
      </div>
    </div>
  )
}
