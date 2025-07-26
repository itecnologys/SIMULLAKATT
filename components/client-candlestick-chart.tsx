"use client"

import dynamic from "next/dynamic"

// Use dynamic import with no SSR for the chart component
const CandlestickChart = dynamic(() => import("@/components/candlestick-chart"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  ),
})

export default function ClientCandlestickChart() {
  return <CandlestickChart />
}
