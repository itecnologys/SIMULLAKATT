"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { ChevronDown, Gift, User, Menu } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [activeLink, setActiveLink] = useState("My account")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Não renderizar o header se estiver no ambiente admin
  if (pathname?.startsWith("/admin")) {
    return null
  }

  const navigationItems = [
    { name: "My account", href: "/overview" },
    { name: "Índices", href: "/indices" },
    { name: "SMLKCARD", href: "/card", badge: "new" },
    { name: "Reports", href: "/reports" },
    { name: "Simulação", href: "/simulate" },
    { name: "Operações", href: "/operations" },
    { name: "Deposits and withdrawals", href: "/deposits", hasDropdown: true },
    { name: "More products", href: "/more", hasDropdown: true },
  ]

  return (
    <header className="picnic-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold picnic-green">
              SIMULAK
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative">
                <Link
                  href={item.href}
                  onClick={() => setActiveLink(item.name)}
                  className={`flex items-center text-sm font-medium transition-colors ${
                    activeLink === item.name
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2">
                      {item.badge}
                    </Badge>
                  )}
                  {item.hasDropdown && (
                    <ChevronDown size={16} className="ml-1" />
                  )}
                </Link>
              </div>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User size={20} className="text-gray-700" />
              <span className="text-sm font-medium text-gray-700">User</span>
            </div>
            <Button variant="outline" size="sm">
              <Gift size={16} className="mr-2" />
              Rewards
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-blue-600"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    setActiveLink(item.name)
                    setMobileMenuOpen(false)
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    activeLink === item.name
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
