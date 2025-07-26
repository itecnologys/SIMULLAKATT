import { NextResponse } from "next/server"
import { getComparisonData } from "@/lib/exchange-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const initialInvestment = Number.parseFloat(searchParams.get("initialInvestment") || "0")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const baseCurrency = searchParams.get("baseCurrency") || "USD"

    if (!initialInvestment || !startDate || !endDate) {
      return NextResponse.json({ success: false, error: "Parâmetros inválidos" }, { status: 400 })
    }

    const data = await getComparisonData(initialInvestment, startDate, endDate, baseCurrency)

    return NextResponse.json({
      success: true,
      initialInvestment,
      startDate,
      endDate,
      baseCurrency,
      data,
    })
  } catch (error) {
    console.error("Erro ao obter dados comparativos:", error)
    return NextResponse.json({ success: false, error: "Falha ao obter dados comparativos" }, { status: 500 })
  }
}
