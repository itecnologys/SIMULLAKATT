import { NextResponse } from "next/server"
import { calculateFullProjection } from "@/lib/calculation"
import { saveSimulation } from "@/lib/simulation-service"
import { getHistoricalRates } from "@/lib/exchange-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      initialInvestment,
      currency,
      entryFee,
      exitFee,
      profitRate,
      dailyFee,
      operationsPerDay,
      projectionMonths,
      includeWeekends,
      startDate,
      name,
    } = body

    // Validate input
    if (!initialInvestment || initialInvestment <= 0) {
      return NextResponse.json({ success: false, error: "Investimento inicial inválido" }, { status: 400 })
    }

    // Get historical rates if startDate provided
    let historicalRates = null
    if (startDate) {
      historicalRates = await getHistoricalRates(startDate)
    }

    // Calculate projection
    const projection = calculateFullProjection(
      initialInvestment,
      entryFee,
      profitRate,
      exitFee,
      dailyFee,
      operationsPerDay,
      projectionMonths,
      includeWeekends,
    )

    // Calculate total fees
    const totalFees = projection.months.reduce(
      (total, month) => total + month.days.reduce((t, day) => t + (day.dailyFee || 0), 0),
      0,
    )

    // Save simulation
    const simulationResult = await saveSimulation({
      initialAmount: initialInvestment,
      finalAmount: projection.finalAmount,
      profitAmount: projection.totalGrowth,
      profitPercentage: projection.totalGrowthPercentage,
      operationsCount: operationsPerDay * 30 * projectionMonths,
      totalFees,
      currency: currency || "EUR",
      setupParams: {
        initialInvestment,
        currency,
        entryFee,
        exitFee,
        profitRate,
        dailyFee,
        operationsPerDay,
        projectionMonths,
        includeWeekends,
        startDate,
        name,
      },
      historicalRates,
      monthlyData: projection.months,
    })

    return NextResponse.json({
      success: true,
      simulationId: simulationResult.id,
      projection,
      historicalRates,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Falha no cálculo da simulação" }, { status: 500 })
  }
}
