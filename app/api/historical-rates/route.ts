import { NextResponse } from "next/server"
import { getHistoricalRates, getHistoricalCandlestickData } from "@/lib/exchange-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const symbol = searchParams.get("symbol")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const interval = searchParams.get("interval") as "daily" | "weekly" | "monthly" | null

    // Se solicitando dados de candlestick
    if (symbol && startDate && endDate) {
      const data = await getHistoricalCandlestickData(symbol, startDate, endDate, interval || "daily")

      return NextResponse.json({
        success: true,
        symbol,
        startDate,
        endDate,
        interval: interval || "daily",
        data,
      })
    }

    // Se solicitando taxas de câmbio para uma data específica
    if (date) {
      const rates = await getHistoricalRates(date)

      return NextResponse.json({
        success: true,
        date,
        rates,
      })
    }

    return NextResponse.json({ success: false, error: "Parâmetros inválidos" }, { status: 400 })
  } catch (error) {
    console.error("Erro ao obter dados históricos:", error)
    return NextResponse.json({ success: false, error: "Falha ao obter dados históricos" }, { status: 500 })
  }
}
