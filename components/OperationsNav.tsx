"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigationItems = [
  { name: 'Operações', href: '/operations', description: 'Detalhamento de cada operação' },
  { name: 'Resumo Mensal', href: '/operations/monthly', description: 'Resumo por mês' },
  { name: 'Cálculos Diários', href: '/operations/daily', description: 'Cálculos por dia' },
  { name: 'Cálculos Semanais', href: '/operations/weekly', description: 'Cálculos por semana' },
  { name: 'Cálculos Mensais', href: '/operations/monthly-calc', description: 'Cálculos por mês' },
  { name: 'Resumo Geral', href: '/operations/summary', description: 'Resumo geral anual' },
]

export default function OperationsNav() {
  const pathname = usePathname()

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  isActive
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
} 