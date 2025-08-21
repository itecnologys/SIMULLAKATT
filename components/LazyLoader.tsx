"use client"

import { Suspense, lazy, ComponentType } from "react"

interface LazyLoaderProps {
  component: () => Promise<{ default: ComponentType<any> }>
  fallback?: React.ReactNode
  props?: any
}

export default function LazyLoader({ 
  component, 
  fallback = <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>,
  props = {}
}: LazyLoaderProps) {
  const LazyComponent = lazy(component)

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  )
}

// Componentes lazy pré-definidos para melhor performance
export const LazyMarketTicker = lazy(() => import("./MarketTickerBloomberg"))
export const LazyCryptoTicker = lazy(() => import("./CryptoMarketTicker"))
export const LazyIndicesGrid = lazy(() => import("./IndicesGrid"))
export const LazyAdminDashboard = lazy(() => import("../app/admin/page"))
export const LazyPluginsManagement = lazy(() => import("../app/admin/plugins/page"))
export const LazyIndicesManagement = lazy(() => import("../app/admin/indices/page"))
