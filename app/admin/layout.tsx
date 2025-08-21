"use client"

import Link from "next/link"
import { useState, Suspense } from "react"
import { ChevronDown, User, Menu, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeLink, setActiveLink] = useState("My account")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navigationItems = [
    { name: "My account", href: "/overview", icon: "👤" },
    { name: "Índices", href: "/indices", icon: "📊" },
    { name: "SMLKCARD", href: "/card", badge: "new", icon: "💳" },
    { name: "Reports", href: "/reports", icon: "📋" },
    { name: "Simulação", href: "/simulate", icon: "🎯" },
    { name: "Operações", href: "/operations", icon: "⚙️" },
    { name: "Deposits and withdrawals", href: "/deposits", hasDropdown: true, icon: "💰" },
    { name: "More products", href: "/more", hasDropdown: true, icon: "📦" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* ADMINISTRATION Menu Banner */}
      <div className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-4 p-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="bg-gray-700 px-6 py-3 rounded-lg shadow-inner">
                <h1 className="text-2xl font-bold text-white tracking-wide uppercase" style={{textShadow: "2px 2px 4px rgba(0,0,0,0.5)"}}>
                  ADMINISTRATION
                </h1>
              </div>
              <span className="ml-4 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">v2.015</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                ← Voltar ao SIMULAK
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? "w-64" : "w-16"} bg-white shadow-lg transition-all duration-300 ease-in-out min-h-screen`}>
          <div className="p-4">
            {/* Logo */}
            <div className="mb-6">
              <Link href="/" className="text-2xl font-bold picnic-green">
                SIMULAK
              </Link>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative">
                  <Link
                    href={item.href}
                    onClick={() => setActiveLink(item.name)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeLink === item.name
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {sidebarOpen && (
                      <>
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-2">
                            {item.badge}
                          </Badge>
                        )}
                        {item.hasDropdown && (
                          <ChevronDown size={16} className="ml-2" />
                        )}
                      </>
                    )}
                  </Link>
                </div>
              ))}
            </nav>

            {/* User Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center px-3 py-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={16} className="text-blue-600" />
                </div>
                {sidebarOpen && (
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">Admin User</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }>
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  )
}
