"use client"

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, Gift, User, Menu } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [activeLink, setActiveLink] = useState('My account')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigationItems = [
    { name: 'My account', href: '/dashboard' },
    { name: 'Card', href: '/card', badge: 'new' },
    { name: 'Buy Crypto', href: '/buy-crypto' },
    { name: 'Swap', href: '/swap' },
    { name: 'Deposits and withdrawals', href: '/deposits', hasDropdown: true },
    { name: 'More products', href: '/more', hasDropdown: true },
  ]

  return (
    <header className="picnic-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold picnic-green">
              SimulAKT
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative">
                <Link
                  href={item.href}
                  className={`picnic-nav-link ${
                    activeLink === item.name
                      ? 'picnic-nav-link-active'
                      : 'picnic-nav-link-inactive'
                  }`}
                  onClick={() => setActiveLink(item.name)}
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-1 bg-green-100 text-green-700 text-xs px-1.5 py-0.5">
                      {item.badge}
                    </Badge>
                  )}
                  {item.hasDropdown && <ChevronDown className="h-4 w-4 ml-1" />}
                </Link>
              </div>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <Button className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-lg flex items-center space-x-2">
              <Gift className="h-4 w-4" />
              <span className="text-sm font-medium">Earn US$ 10</span>
            </Button>
            
            <Button variant="ghost" className="p-2 rounded-full">
              <User className="h-6 w-6 picnic-text" />
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="md:hidden p-2 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6 picnic-text" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    activeLink === item.name
                      ? 'picnic-green bg-green-50'
                      : 'picnic-text hover:text-green-600 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setActiveLink(item.name)
                    setMobileMenuOpen(false)
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.name}</span>
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5">
                          {item.badge}
                        </Badge>
                      )}
                      {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 