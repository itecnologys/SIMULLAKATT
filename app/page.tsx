"use client"

import { Suspense, lazy } from "react"
import Header from "@/components/Header"

// Lazy loading dos componentes pesados
const MarketTickerBloomberg = lazy(() => import("@/components/MarketTickerBloomberg"))
const CryptoMarketTicker = lazy(() => import("@/components/CryptoMarketTicker"))

// Fallback otimizado
const TickerFallback = () => (
  <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  </div>
)

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SIMULAK - Simulação Financeira Avançada
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Plataforma avançada de simulação financeira com análise de mercado e projeções de investimento
          </p>
        </div>

        {/* Market Data Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Traditional Market Ticker */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Mercado Tradicional</h2>
              <Suspense fallback={<TickerFallback />}>
                <MarketTickerBloomberg />
              </Suspense>
            </div>
          </div>

          {/* Crypto Market Ticker */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Criptomoedas</h2>
              <Suspense fallback={<TickerFallback />}>
                <CryptoMarketTicker />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="/indices" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-all duration-300">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Índices</h3>
              <p className="text-gray-600">Visualize índices de diversos mercados financeiros</p>
            </div>
          </a>

          <a href="/card" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-all duration-300">
            <div className="text-center">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">SMLKCARD</h3>
              <p className="text-gray-600">Gerencie seus cartões e transações</p>
            </div>
          </a>

          <a href="/admin" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-all duration-300">
            <div className="text-center">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Administração</h3>
              <p className="text-gray-600">Painel administrativo e configurações</p>
            </div>
          </a>
        </div>
      </main>
    </div>
  )
}
